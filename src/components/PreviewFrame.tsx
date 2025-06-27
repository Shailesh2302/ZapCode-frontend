import { WebContainer } from "@webcontainer/api";
import { useEffect, useState } from "react";
import { cn } from "../utils/cn";
import { RefreshCw, AlertOctagon, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface PreviewFrameProps {
  files: any[];
  webContainer: WebContainer;
}

export function PreviewFrame({ files, webContainer }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  async function startDevServer() {
    try {
      setLoading(true);
      setError(null);

      const installProcess = await webContainer.spawn("npm", ["install"]);
      installProcess.output.pipeTo(
        new WritableStream({
          write(data) {},
        })
      );

      const installExitCode = await installProcess.exit;
      if (installExitCode !== 0) {
        setError(`npm install failed with exit code ${installExitCode}`);
        setLoading(false);
        return;
      }

      try {
        const devProcess = await webContainer.spawn("npm", [
          "run",
          "dev",
          "--",
          "--host",
        ]);
        devProcess.output.pipeTo(
          new WritableStream({
            write(data) {},
          })
        );
      } catch (err) {
        setError("Failed to start development server");
        setLoading(false);
        return;
      }

      webContainer.on("server-ready", (port, serverUrl) => {
        setUrl(serverUrl);
        setLoading(false);
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        errorMessage.includes("SharedArrayBuffer")
          ? "This browser requires cross-origin isolation for the preview. Try restarting the dev server."
          : `Failed to initialize preview: ${errorMessage}`
      );
      setLoading(false);
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    startDevServer();
  };

  useEffect(() => {
    if (files.length > 0 && webContainer) {
      startDevServer();
    }
  }, [files, webContainer, retryCount]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-950/80 rounded-xl overflow-hidden border border-gray-800/50 backdrop-blur-sm">
      {/* Electric pulse background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-6 flex flex-col items-center gap-4 relative z-10"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.3)]"></div>
            <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <p className="text-gray-300 font-medium">
            Initializing preview environment
          </p>
          <p className="text-sm text-gray-400">This might take a moment...</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 bg-gray-900/80 rounded-xl border border-amber-900/50 max-w-md relative z-10 backdrop-blur-sm"
        >
          <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-600/20 to-amber-400/20 border border-amber-800/30">
            <AlertOctagon className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="text-amber-400 font-medium text-lg mb-2">
            Preview Error
          </h3>
          <p className="text-gray-300 mb-4 text-sm">{error}</p>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600/30 to-amber-500/30 hover:from-amber-600/50 hover:to-amber-500/50 text-gray-200 rounded-md transition-all border border-amber-800/30 hover:border-amber-600/50"
          >
            <RefreshCw className="h-4 w-4 text-amber-400" />
            <span>Retry</span>
          </button>
        </motion.div>
      )}

      {url && !loading && !error && (
        <motion.iframe
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          src={url}
          className="w-full h-full border-0"
          title="Site Preview"
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="accelerometer; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
        />
      )}
    </div>
  );
}
