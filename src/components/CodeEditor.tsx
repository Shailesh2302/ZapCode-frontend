import Editor from '@monaco-editor/react';
import { FileItem } from '../types';
import {  Zap, Bolt } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CodeEditorProps {
  file: FileItem | null;
  onUpdateFile?: (updatedFile: FileItem) => void;
}

// Determine language from file extension
function getLanguage(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'jsx':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescript';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'scss':
      return 'scss';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    default:
      return 'plaintext';
  }
}

export function CodeEditor({ file, onUpdateFile }: CodeEditorProps) {
  const [editorContent, setEditorContent] = useState<string>(file?.content || '');

  // Update editor content when file changes
  useEffect(() => {
    if (file) {
      setEditorContent(file.content || '');
    }
  }, [file]);

  const handleEditorChange = (value: string | undefined) => {
    if (!file || !value) return;
    
    setEditorContent(value);
    
    if (onUpdateFile) {
      onUpdateFile({
        ...file,
        content: value
      });
    }
  };

  if (!file) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gradient-to-br from-gray-950/80 to-gray-900/80">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-800/50 flex items-center justify-center border border-amber-900/30">
          <Zap className="w-8 h-8 text-amber-400/60 animate-pulse" />
        </div>
        <h3 className="text-lg font-medium text-gray-300 mb-2">No file selected</h3>
        <p className="text-gray-500 max-w-md">
          Select a file from the explorer to view and edit its contents
        </p>
      </div>
    );
  }

  return (
    <div className="h-full relative bg-gradient-to-br from-gray-950/80 to-gray-900/80">
      {/* File header with electric theme */}
      <div className="absolute top-0 left-0 right-0 bg-gray-900/70 backdrop-blur-sm border-b border-amber-900/30 px-4 py-2 flex items-center">
        <Bolt className="w-4 h-4 text-amber-400 mr-2" />
        <span className="text-sm font-mono text-gray-300">{file.path}</span>
      </div>
      
      {/* Editor with custom theme */}
      <div className="pt-10 h-full">
        <Editor
          height="100%"
          defaultLanguage={getLanguage(file.name)}
          theme="vs-dark"
          value={editorContent}
          onChange={handleEditorChange}
          options={{
            readOnly: false,
            minimap: { enabled: true },
            fontSize: 14,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            quickSuggestions: false,
            parameterHints: { enabled: false }
          }}
          beforeMount={(monaco) => {
            // Define custom theme
            monaco.editor.defineTheme('zapcode-dark', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: '', foreground: 'e2e8f0' },
                { token: 'keyword', foreground: 'f59e0b' },
                { token: 'type', foreground: 'f59e0b' },
                { token: 'string', foreground: '86efac' },
                { token: 'number', foreground: 'f472b6' },
                { token: 'delimiter', foreground: '93c5fd' }
              ],
              colors: {
                'editor.background': '#0f172a',
                'editor.foreground': '#e2e8f0',
                'editor.lineHighlightBackground': '#1e293b80',
                'editor.selectionBackground': '#f59e0b40',
                'editorCursor.foreground': '#f59e0b',
                'editor.lineNumbers': '#64748b',
                'editorGutter.background': '#0f172a',
                'editorIndentGuide.background': '#1e293b',
                'editorIndentGuide.activeBackground': '#334155'
              }
            });
          }}
          onMount={(editor, monaco) => {
            // Apply custom theme
            monaco.editor.setTheme('zapcode-dark');
            
            // Disable validation for TypeScript/JavaScript
            if (monaco.languages.typescript) {
              monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                noSemanticValidation: true,
                noSyntaxValidation: true
              });
              
              monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                noSemanticValidation: true,
                noSyntaxValidation: true
              });
            }
          }}
        />
      </div>
    </div>
  );
}