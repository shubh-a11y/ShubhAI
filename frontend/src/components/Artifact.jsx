import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  CodeIcon, 
  Copy, 
  Check, 
  Eye, 
  PanelRightClose, 
  PanelRightOpen, 
  FileCode2, 
  TerminalSquare
} from 'lucide-react';
import Editor from '@monaco-editor/react';

function Artifact() {
  const { artifacts } = useSelector(state => state.message);
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  // Safely extract artifact data
  const currentArtifact = artifacts?.[0];
  const files = currentArtifact?.files || [];
  const file = files[activeFile];

  // Look for specific web files for the preview feature
  const htmlFile = files.find(f => f?.name?.toLowerCase().endsWith('.html'));
  const cssFile = files.find(f => f?.name?.toLowerCase().endsWith('.css'));
  const jsFile = files.find(f => f?.name?.toLowerCase().endsWith('.js'));

  const canPreview = Boolean(htmlFile);

  // Force tab to "code" if preview is not available for this artifact
  useEffect(() => {
    if (!canPreview && tab === "preview") {
      setTab("code");
    }
  }, [canPreview, tab]);

  // Handle completely empty state
  if (!artifacts || artifacts.length === 0) return null;

  // Copy functionality
  const handleCopy = () => {
    if (file?.content) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Construct iframe document
  const previewDoc = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Artifact Preview</title>
      <style>
          ${cssFile?.content || ''}
      </style>
  </head>
  <body>
      ${htmlFile?.content || ''}
      <script>
          ${jsFile?.content || ''}
      </script>
  </body>
  </html>`;

  const detectLanguage = (filename = "") => {
    const name = filename.toLowerCase();
    if (name.endsWith(".js") || name.endsWith(".jsx")) return "javascript";
    if (name.endsWith(".ts") || name.endsWith(".tsx")) return "typescript";
    if (name.endsWith(".html")) return "html";
    if (name.endsWith(".css")) return "css";
    if (name.endsWith(".json")) return "json";
    if (name.endsWith(".md")) return "markdown";
    if (name.endsWith(".py")) return "python";
    if (name.endsWith(".cpp") || name.endsWith(".c")) return "cpp";
    if (name.endsWith(".java")) return "java";
    if (name.endsWith(".rb")) return "ruby";
    return "plaintext";
  };

  return (
    <motion.div 
      initial={{ x: 100, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: collapsed ? '4rem' : '45vw', // 4rem collapsed, 45vw expanded
        minWidth: collapsed ? '4rem' : '400px'
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full bg-[#0a0a0d]/95 backdrop-blur-2xl border-l border-[#edede6]/10 z-40 shadow-2xl overflow-hidden"
    >
      {/* ================= HEADER ================= */}
      <div className="h-16 flex items-center justify-between px-3 border-b border-[#edede6]/10 bg-[#000000]/50 shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-[#d5bafb]/10 border border-[#d5bafb]/20 flex items-center justify-center text-[#d5bafb] shrink-0">
                <Code2 size={16} />
              </div>
              <span className="font-semibold text-[#edede6] truncate tracking-wide text-sm">
                {currentArtifact?.title || "Generated Artifact"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse/Expand Toggle */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-[#edede6]/[0.05] hover:bg-[#edede6]/10 text-[#edede6]/60 hover:text-[#edede6] transition-colors mx-auto shrink-0"
          title={collapsed ? "Expand Artifact" : "Collapse Artifact"}
        >
          {collapsed ? <PanelRightOpen size={25} /> : <PanelRightClose size={25} />}
        </motion.button>
      </div>

      {/* ================= COLLAPSED VIEW ================= */}
      <AnimatePresence>
        {collapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center pt-8 gap-4"
          >
            <div className="text-[#d5bafb] p-2 rounded-lg bg-[#d5bafb]/10">
              <FileCode2 size={20} />
            </div>
            <div 
              className="text-[#edede6]/50 tracking-widest text-sm font-mono whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {currentArtifact?.title || "ARTIFACT"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= EXPANDED VIEW ================= */}
      {!collapsed && (
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Action Bar: Tabs & Copy */}
          <div className="flex items-center justify-between p-3 border-b border-[#edede6]/5 bg-[#edede6]/[0.02] shrink-0">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#000000] border border-[#edede6]/10">
              <button 
                onClick={() => setTab("code")} 
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  tab === "code" 
                    ? 'bg-[#edede6]/10 text-[#edede6] shadow-sm' 
                    : 'text-[#edede6]/40 hover:text-[#edede6]'
                }`}
              >
                <CodeIcon size={14} /> Code
              </button>
              
              {canPreview && (
                <button 
                  onClick={() => setTab("preview")} 
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    tab === "preview" 
                      ? 'bg-[#beff8b]/10 text-[#beff8b] shadow-sm' 
                      : 'text-[#edede6]/40 hover:text-[#edede6]'
                  }`}
                >
                  <Eye size={14} /> Preview
                </button>
              )}
            </div>

            {/* Copy Button */}
            {tab === "code" && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#edede6]/[0.05] hover:bg-[#edede6]/10 border border-[#edede6]/10 text-[#edede6]/70 text-xs font-medium transition-colors"
              >
                {copied ? <Check size={14} className="text-[#beff8b]" /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            )}
          </div>

          {/* File Switcher (Only visible in Code mode and if multiple files exist) */}
          {tab === "code" && files.length > 1 && (
            <div className="flex items-center gap-2 p-2 px-3 overflow-x-auto custom-scrollbar border-b border-[#edede6]/5 shrink-0">
              {files.map((f, index) => (
                <button 
                  key={index} 
                  onClick={() => setActiveFile(index)} 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all duration-200 ${
                    activeFile === index 
                      ? 'bg-[#d5bafb]/15 text-[#d5bafb] border border-[#d5bafb]/30' 
                      : 'bg-transparent text-[#edede6]/40 hover:text-[#edede6] hover:bg-[#edede6]/[0.05] border border-transparent'
                  }`}
                >
                  <TerminalSquare size={12} />
                  {f.name}
                </button>
              ))}
            </div>
          )}

          {/* Content Area (Editor or iframe) */}
          <div className="flex-1 relative overflow-hidden bg-[#000000]">
            <AnimatePresence mode="wait">
              {tab === "preview" && canPreview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full bg-white" // Preview iframe background usually kept white for web standards
                >
                  <iframe
                    srcDoc={previewDoc}
                    title="Artifact Preview"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                    className="w-full h-full border-none"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full"
                >
                  <Editor
                    height="100%"
                    width="100%"
                    theme="vs-dark"
                    value={file?.content || "// No content available"}
                    language={detectLanguage(file?.name)}
                    options={{
                      wordWrap: 'on',
                      readOnly: true,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      fontSize: 13
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Artifact;