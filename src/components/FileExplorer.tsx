import { useState } from 'react';
import { FolderTree, File, ChevronRight, ChevronDown, FileCode, FileJson, FileText, Zap, Bolt } from 'lucide-react';
import { FileItem } from '../types';
import { cn } from '../utils/cn';

interface FileExplorerProps {
  files: FileItem[];
  onFileSelect: (file: FileItem) => void;
}

interface FileNodeProps {
  item: FileItem;
  depth: number;
  onFileClick: (file: FileItem) => void;
}

function getFileIcon(fileName: string) {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
    case 'jsx':
      return <FileCode className="w-4 h-4 text-yellow-400" />;
    case 'ts':
    case 'tsx':
      return <FileCode className="w-4 h-4 text-blue-400" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-green-400" />;
    case 'md':
      return <FileText className="w-4 h-4 text-purple-400" />;
    case 'html':
      return <FileCode className="w-4 h-4 text-orange-400" />;
    case 'css':
      return <FileCode className="w-4 h-4 text-cyan-400" />;
    case 'scss':
      return <FileCode className="w-4 h-4 text-pink-400" />;
    default:
      return <File className="w-4 h-4 text-gray-400" />;
  }
}

function FileNode({ item, depth, onFileClick }: FileNodeProps) {
  const [isExpanded, setIsExpanded] = useState(item.type === 'folder');

  const handleClick = () => {
    if (item.type === 'folder') {
      setIsExpanded(!isExpanded);
    } else {
      onFileClick(item);
    }
  };

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer transition-all",
          item.type === 'file' ? "hover:bg-gray-800/70" : "hover:bg-gray-800/40",
          "group"
        )}
        style={{ paddingLeft: `${depth * 0.75 + 0.5}rem` }}
        onClick={handleClick}
      >
        {item.type === 'folder' && (
          <span className="text-gray-500 group-hover:text-amber-400 transition-colors">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        )}
        {item.type === 'folder' ? (
          <FolderTree className="w-4 h-4 text-blue-400 group-hover:text-amber-400 transition-colors" />
        ) : (
          getFileIcon(item.name)
        )}
        <span className={cn(
          "truncate transition-colors",
          item.type === 'folder' 
            ? "text-gray-300 font-medium group-hover:text-amber-300" 
            : "text-gray-400 group-hover:text-gray-200"
        )}>
          {item.name}
        </span>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div className="animate-fadeIn">
          {item.children
            .sort((a, b) => {
              if (a.type === 'folder' && b.type === 'file') return -1;
              if (a.type === 'file' && b.type === 'folder') return 1;
              return a.name.localeCompare(b.name);
            })
            .map((child, index) => (
              <FileNode
                key={`${child.path}-${index}`}
                item={child}
                depth={depth + 1}
                onFileClick={onFileClick}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export function FileExplorer({ files, onFileSelect }: FileExplorerProps) {
  const sortedFiles = [...files].sort((a, b) => {
    if (a.type === 'folder' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="h-full overflow-auto py-2">
      <div className="px-3 py-2 border-b border-gray-800/50 flex items-center gap-2">
        <Bolt className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-gray-300">Project Files</span>
      </div>
      <div className="space-y-0.5 px-1 py-2">
        {sortedFiles.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
          />
        ))}
        {sortedFiles.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm flex flex-col items-center">
            <Zap className="w-5 h-5 text-gray-600 mb-2" />
            No files generated yet
          </div>
        )}
      </div>
    </div>
  );
}