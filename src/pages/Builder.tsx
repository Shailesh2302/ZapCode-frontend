import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StepsList } from "../components/StepsList.tsx";
import { FileExplorer } from "../components/FileExplorer";
import { TabView } from "../components/TabView.tsx";
import { CodeEditor } from "../components/CodeEditor.tsx";
import { PreviewFrame } from "../components/PreviewFrame";
import { Step, FileItem, StepType } from "../types/index.ts";
import axios from "axios";
import { API_URL } from "../config.ts";
import { parseXml } from "../steps";
import { useWebContainer } from "../hooks/useWebContainer";
import { Loader } from "../components/Loader.tsx";

import {
  Home,
  PanelRight,
  Send,
  RefreshCw,
  AlertTriangle,
  Bolt,
  Download,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { WebContainer } from "@webcontainer/api";
import { downloadProjectAsZip } from "../utils/fileDownloader";
import { useAppContext } from "../context/AppContext";

// Defining the step status type explicitly
type StepStatus = "pending" | "in-progress" | "completed";

export function Builder() {
  const navigate = useNavigate();
  const {
    prompt,
    setLoading: setContextLoading,
    currentStep,
    setCurrentStep,
  } = useAppContext();
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const {
    webcontainer,
    error: webContainerError,
    loading: webContainerLoading,
  } = useWebContainer();

  const [activeTab, setActiveTab] = useState<"code" | "preview">("code");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFileExplorerCollapsed, setFileExplorerCollapsed] = useState(false);

  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  // Process steps to generate files
  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;

    steps
      .filter(({ status }) => status === "pending")
      .forEach((step) => {
        updateHappened = true;
        if (step?.type === StepType.CreateFile) {
          let parsedPath = step.path?.split("/") ?? []; // ["src", "components", "App.tsx"]
          let currentFileStructure = [...originalFiles]; // {}
          let finalAnswerRef = currentFileStructure;

          let currentFolder = "";
          while (parsedPath.length) {
            currentFolder = `${currentFolder}/${parsedPath[0]}`;
            let currentFolderName = parsedPath[0];
            parsedPath = parsedPath.slice(1);

            if (!parsedPath.length) {
              // final file
              let file = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!file) {
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "file",
                  path: currentFolder,
                  content: step.code,
                });
              } else {
                file.content = step.code;
              }
            } else {
              /// in a folder
              let folder = currentFileStructure.find(
                (x) => x.path === currentFolder
              );
              if (!folder) {
                // create the folder
                currentFileStructure.push({
                  name: currentFolderName,
                  type: "folder",
                  path: currentFolder,
                  children: [],
                });
              }

              currentFileStructure = currentFileStructure.find(
                (x) => x.path === currentFolder
              )!.children!;
            }
          }
          originalFiles = finalAnswerRef;
        }
      });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps((steps) =>
        steps.map((s: Step) => {
          return {
            ...s,
            status: "completed" as StepStatus,
          };
        })
      );
    }
  }, [steps]);

  // Update WebContainer when files change
  useEffect(() => {
    if (!webcontainer || files.length === 0) return;

    try {
      (webcontainer as WebContainer).mount(createMountStructure(files));
    } catch (err) {
      console.error("Error mounting files to WebContainer:", err);
    }
  }, [files, webcontainer]);

  const handleFileUpdate = (updatedFile: FileItem) => {
    // Deep clone files to maintain immutability
    const updateFilesRecursively = (
      filesArray: FileItem[],
      fileToUpdate: FileItem
    ): FileItem[] => {
      return filesArray.map((file) => {
        if (file.path === fileToUpdate.path) {
          return fileToUpdate;
        } else if (file.type === "folder" && file.children) {
          return {
            ...file,
            children: updateFilesRecursively(file.children, fileToUpdate),
          };
        }
        return file;
      });
    };

    const updatedFiles = updateFilesRecursively(files, updatedFile);
    setFiles(updatedFiles);

    // Update file in WebContainer if it's initialized
    if (webcontainer) {
      try {
        (webcontainer as WebContainer).fs.writeFile(
          updatedFile.path.startsWith("/")
            ? updatedFile.path.substring(1)
            : updatedFile.path,
          updatedFile.content || ""
        );
      } catch (err) {
        console.error("Error writing file to WebContainer:", err);
      }
    }
  };

  // Create mount structure for WebContainer
  const createMountStructure = (files: FileItem[]): Record<string, any> => {
    const mountStructure: Record<string, any> = {};

    const processFile = (file: FileItem, isRootFolder: boolean) => {
      if (file.type === "folder") {
        // For folders, create a directory entry
        mountStructure[file.name] = {
          directory: file.children
            ? Object.fromEntries(
                file.children.map((child) => [
                  child.name,
                  processFile(child, false),
                ])
              )
            : {},
        };
      } else if (file.type === "file") {
        if (isRootFolder) {
          mountStructure[file.name] = {
            file: {
              contents: file.content || "",
            },
          };
        } else {
          // For files, create a file entry with contents
          return {
            file: {
              contents: file.content || "",
            },
          };
        }
      }

      return mountStructure[file.name];
    };

    // Process each top-level file/folder
    files.forEach((file) => processFile(file, true));

    return mountStructure;
  };

  async function init() {
    try {
      setLoading(true);

      // Skip if template is already set
      if (!templateSet) {
        // Get template from backend
        const response = await axios.post(`${API_URL}/template`, {
          prompt,
        });

        const { prompts, uiPrompts } = response.data;

        setLlmMessages([
          {
            role: "user",
            content: prompt,
          },
        ]);

        // Set the initial steps from template
        const initialSteps = parseXml(uiPrompts[0] || "").map((x: any) => ({
          ...x,
          status: "pending" as StepStatus,
        }));

        setSteps(initialSteps);
        setTemplateSet(true);

        // Send the chat request for full project generation
        const chatResponse = await axios.post(`${API_URL}/chat`, {
          messages: [...prompts, prompt].map((content: string) => ({
            role: "user",
            content,
          })),
        });

        // Process the steps from the chat response
        const newSteps = parseXml(chatResponse.data.response).map((x: any) => ({
          ...x,
          status: "pending" as StepStatus,
        }));

        setSteps((prevSteps) => [...prevSteps, ...newSteps]);

        setLlmMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", content: chatResponse.data.response },
        ]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error initializing project:", error);
      setLoading(false);
    }
  }

  const handleRefreshWebContainer = () => {
    window.location.href = "/";
  };

  const handleDownloadProject = async () => {
    if (files.length > 0) {
      setIsDownloading(true);
      try {
        await downloadProjectAsZip(files);
      } catch (error) {
        console.error("Failed to download project:", error);
      } finally {
        setIsDownloading(false);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!userPrompt.trim()) return;

    const newUserMessage = {
      role: "user" as const,
      content: userPrompt,
    };

    setLlmMessages([...llmMessages, newUserMessage]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        messages: [...llmMessages, newUserMessage],
      });

      const assistantMessage = {
        role: "assistant" as const,
        content: response.data.response,
      };

      setLlmMessages([...llmMessages, newUserMessage, assistantMessage]);

      // Check if the response contains steps in XML format
      const newSteps = parseXml(response.data.response).map((x: any) => ({
        ...x,
        status: "pending" as StepStatus,
      }));

      if (newSteps.length > 0) {
        setSteps((prevSteps) => [...prevSteps, ...newSteps]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (webcontainer && !templateSet) {
      init();
    }
  }, [webcontainer, templateSet]);

  return (
    <div className="h-screen bg-gray-950 flex flex-col overflow-hidden">
      {/* Header with electric pulse effect */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800/50 px-6 py-4 flex items-center justify-between relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>

        <div className="flex items-center relative z-10">
          <button
            onClick={() => (window.location.href = "/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          >
            <div className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-amber-600/20 to-amber-400/20 border border-amber-800/30 group-hover:border-amber-500/50 transition-colors">
              <Zap className="w-5 h-5 text-amber-400 group-hover:text-yellow-300 transition-colors" />
            </div>
            <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400">
              ZapCode
            </h1>
          </button>
          <div className="h-6 mx-4 border-r border-gray-700/50"></div>
          <h2 className="text-gray-300 hidden sm:block">AI Website Builder</h2>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <button
            onClick={handleDownloadProject}
            disabled={isDownloading || files.length === 0}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-gradient-to-r from-amber-900/30 to-amber-800/30 px-3 py-1.5 rounded-md border border-amber-800/50 hover:border-amber-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download project as ZIP"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Downloading...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download ZIP</span>
              </>
            )}
          </button>
          <a
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </a>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar */}
        <motion.div
          className="bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800/50 overflow-hidden relative flex-shrink-0"
          animate={{
            width: isSidebarCollapsed
              ? "3rem"
              : ["100%", "90%", "75%", "50%", "33%", "25rem"].length >
                window.innerWidth / 100
              ? "0"
              : "25rem",
          }}
          initial={false}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow animation-delay-2000"></div>
          </div>

          <div className="flex h-full relative z-10">
            {/* Collapse button */}
            <div className="p-2 bg-gray-900/50 border-r border-gray-800/50 flex flex-col items-center flex-shrink-0">
              <button
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors group"
                title={
                  isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
              >
                <PanelRight
                  className={`w-5 h-5 text-gray-400 group-hover:text-amber-400 transition-all ${
                    isSidebarCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-hidden flex flex-col min-w-0">
                <div className="border-b border-gray-800/50 p-4 flex-shrink-0">
                  <h3 className="text-white font-medium mb-1">Your Prompt</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{prompt}</p>
                </div>

                <div className="flex-1 overflow-hidden p-4 flex flex-col min-h-0">
                  <h3 className="text-white font-medium mb-4 flex-shrink-0">Build Steps</h3>
                  <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <StepsList
                      steps={steps}
                      currentStep={currentStep}
                      onStepClick={setCurrentStep}
                    />
                  </div>
                </div>

                <div className="border-t border-gray-800/50 p-4 flex-shrink-0">
                  {loading || !templateSet ? (
                    <Loader />
                  ) : (
                    <div className="space-y-3">
                      <h3 className="text-white font-medium">
                        Add Instructions
                      </h3>
                      <div className="relative">
                        <textarea
                          value={userPrompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Add more instructions or modifications..."
                          className="w-full p-3 bg-gray-800/50 text-gray-200 rounded-lg border border-gray-700/50 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30 outline-none resize-none placeholder-gray-500 text-sm h-20 backdrop-blur-sm"
                        ></textarea>
                        <button
                          onClick={handleSendMessage}
                          disabled={userPrompt.trim().length === 0}
                          className="absolute right-3 bottom-3 p-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 disabled:bg-gray-700/50 disabled:text-gray-500 text-white rounded-full transition-all shadow-sm hover:shadow-md"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* File explorer */}
        <motion.div
          className="border-r border-gray-800/50 bg-gradient-to-b from-gray-900 to-gray-950 overflow-hidden flex flex-col relative flex-shrink-0"
          animate={{
            width: isFileExplorerCollapsed ? "0" : "16rem",
            opacity: isFileExplorerCollapsed ? 0 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
          </div>

          <div className="p-4 border-b border-gray-800/50 flex items-center justify-between relative z-10 flex-shrink-0">
            <h3 className="text-white font-medium">Files</h3>
            <button
              onClick={() => setFileExplorerCollapsed(!isFileExplorerCollapsed)}
              className="p-1 rounded-lg hover:bg-gray-800/50 transition-colors md:hidden"
            >
              <PanelRight className="w-4 h-4 text-gray-400 hover:text-amber-400" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto relative z-10 custom-scrollbar">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>
        </motion.div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <div className="p-4 border-b border-gray-800/50 bg-gradient-to-r from-gray-900 to-gray-950 flex items-center justify-between flex-shrink-0">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex items-center md:hidden">
              <button
                onClick={() =>
                  setFileExplorerCollapsed(!isFileExplorerCollapsed)
                }
                className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                title={isFileExplorerCollapsed ? "Show files" : "Hide files"}
              >
                <PanelRight
                  className={`w-4 h-4 text-gray-400 hover:text-amber-400 ${
                    isFileExplorerCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                className="ml-2 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
                title={isSidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
              >
                <PanelRight
                  className={`w-4 h-4 text-gray-400 group-hover:text-amber-400 ${
                    !isSidebarCollapsed ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-4 bg-gradient-to-br from-gray-950 to-gray-900">
            <div className="h-full rounded-xl overflow-hidden border border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-gray-950/50 shadow-[0_0_30px_rgba(251,191,36,0.05)] backdrop-blur-sm">
              {activeTab === "code" ? (
                <CodeEditor
                  file={selectedFile}
                  onUpdateFile={handleFileUpdate}
                />
              ) : webcontainer ? (
                <PreviewFrame
                  webContainer={webcontainer as WebContainer}
                  files={files}
                />
              ) : webContainerLoading ? (
                <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center">
                  <div>
                    <Loader size="lg" className="mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      Initializing WebContainer
                    </h3>
                    <p className="text-gray-500 max-w-md">
                      Setting up the preview environment. This might take a
                      moment...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 p-8 text-center">
                  <div>
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-900/20 to-amber-800/20 border border-amber-800/50 flex items-center justify-center">
                      <AlertTriangle className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      WebContainer Error
                    </h3>
                    <p className="text-gray-400 max-w-md mb-6">
                      {webContainerError?.message ||
                        "The WebContainer environment could not be initialized. This may be due to missing browser security headers or lack of browser support."}
                    </p>
                    <button
                      onClick={handleRefreshWebContainer}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white rounded-md transition-all shadow-sm hover:shadow-md"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}