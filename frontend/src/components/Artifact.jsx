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
  TerminalSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Editor from '@monaco-editor/react';

function Artifact() {
  // 1. ALL REDUX & STATE HOOKS CALLED UNCONDITIONALLY AT THE TOP
  const { artifacts } = useSelector(state => state.message);
  
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("code");
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Safely compute derived state
  const hasArtifacts = Boolean(artifacts && artifacts.length > 0);
  const currentArtifact = hasArtifacts ? artifacts[currentIndex] : null;
  const files = currentArtifact?.files || [];
  const file = files[activeFile];

  const htmlFile = files.find(f => f?.name?.toLowerCase().endsWith('.html'));
  const cssFile = files.find(f => f?.name?.toLowerCase().endsWith('.css'));
  const jsFile = files.find(f => f?.name?.toLowerCase().endsWith('.js'));
  const canPreview = Boolean(htmlFile);

  // 2. ALL EFFECTS CALLED UNCONDITIONALLY BEFORE ANY RETURN
  useEffect(() => {
    if (artifacts && artifacts.length > 0) {
      setCurrentIndex(artifacts.length - 1);
      setActiveFile(0);
    }
  }, [artifacts?.length]);

  useEffect(() => {
    if (!canPreview && tab === "preview") {
      setTab("code");
    }
  }, [canPreview, tab, currentIndex]);

  // 3. SAFE CONDITIONAL RETURN (Hooks have all been registered)
  if (!hasArtifacts) return null;

  const handleCopy = () => {
    if (file?.content) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
      initial={{ x: "100%", opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: collapsed ? 64 : "45vw"
      }}
      transition={{ 
        duration: 0.35, 
        ease: [0.4, 0.0, 0.2, 1] 
      }}
      className="hidden lg:flex flex-col fixed right-0 top-0 h-full bg-[#0a0a0d]/95 backdrop-blur-2xl border-l border-[#edede6]/10 z-40 shadow-2xl overflow-hidden origin-right"
    >
      {/* ================= HEADER ================= */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#edede6]/10 bg-[#000000]/60 shrink-0">
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div 
              key="expanded-header"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-3 overflow-hidden w-full mr-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#d5bafb]/10 border border-[#d5bafb]/20 flex items-center justify-center text-[#d5bafb] shrink-0">
                  <Code2 size={18} />
                </div>
                <span className="font-semibold text-[#edede6] truncate tracking-wide text-sm sm:text-base">
                  {currentArtifact?.title || "Generated Artifact"}
                </span>
              </div>

              {/* Version Controller */}
              {artifacts.length > 1 && (
                <div className="flex items-center gap-1.5 bg-[#edede6]/[0.05] border border-[#edede6]/10 rounded-xl p-1 shrink-0">
                  <button 
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => prev - 1)}
                    className="p-1 rounded-lg text-[#edede6]/60 hover:text-[#edede6] hover:bg-[#edede6]/10 disabled:opacity-25 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-mono text-[#edede6]/80 px-1">
                    {currentIndex + 1} / {artifacts.length}
                  </span>
                  <button 
                    disabled={currentIndex === artifacts.length - 1}
                    onClick={() => setCurrentIndex(prev => prev + 1)}
                    className="p-1 rounded-lg text-[#edede6]/60 hover:text-[#edede6] hover:bg-[#edede6]/10 disabled:opacity-25 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Collapse / Expand Toggle */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-[#edede6]/[0.05] hover:bg-[#edede6]/10 text-[#edede6]/70 hover:text-[#edede6] border border-[#edede6]/10 transition-colors mx-auto shrink-0"
          title={collapsed ? "Expand Artifact Panel" : "Collapse Artifact Panel"}
        >
          {collapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
        </motion.button>
      </div>

      {/* ================= COLLAPSED VIEW ================= */}
      <AnimatePresence>
        {collapsed && (
          <motion.div 
            key="collapsed-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col items-center pt-8 gap-5"
          >
            <div className="text-[#d5bafb] p-2.5 rounded-xl bg-[#d5bafb]/10 border border-[#d5bafb]/20 relative">
              <FileCode2 size={22} />
              {artifacts.length > 1 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#beff8b] rounded-full ring-2 ring-black" />
              )}
            </div>
            <div 
              className="text-[#edede6]/60 tracking-widest text-xs font-mono whitespace-nowrap"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {currentArtifact?.title || "ARTIFACT WORKSPACE"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= EXPANDED VIEW ================= */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div 
            key="expanded-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Action Bar: Tabs & Copy */}
            <div className="flex items-center justify-between p-3.5 border-b border-[#edede6]/10 bg-[#edede6]/[0.02] shrink-0">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#000000] border border-[#edede6]/10">
                <button 
                  onClick={() => setTab("code")} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    tab === "code" 
                      ? 'bg-[#edede6]/10 text-[#edede6] shadow-sm font-semibold' 
                      : 'text-[#edede6]/50 hover:text-[#edede6]'
                  }`}
                >
                  <CodeIcon size={16} /> Code
                </button>
                
                {canPreview && (
                  <button 
                    onClick={() => setTab("preview")} 
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      tab === "preview" 
                        ? 'bg-[#beff8b]/10 text-[#beff8b] shadow-sm font-semibold' 
                        : 'text-[#edede6]/50 hover:text-[#edede6]'
                    }`}
                  >
                    <Eye size={16} /> Preview
                  </button>
                )}
              </div>

              {tab === "code" && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#edede6]/[0.05] hover:bg-[#edede6]/10 border border-[#edede6]/10 text-[#edede6]/80 text-sm font-medium transition-colors"
                >
                  {copied ? <Check size={16} className="text-[#beff8b]" /> : <Copy size={16} />}
                  <span>{copied ? "Copied!" : "Copy Code"}</span>
                </motion.button>
              )}
            </div>

            {/* File Switcher */}
            {tab === "code" && files.length > 1 && (
              <div className="flex items-center gap-2 px-4 py-2.5 overflow-x-auto border-b border-[#edede6]/10 bg-[#000000]/40 shrink-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:bg-[#edede6]/10">
                {files.map((f, index) => (
                  <button 
                    key={index} 
                    onClick={() => setActiveFile(index)} 
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all duration-200 ${
                      activeFile === index 
                        ? 'bg-[#d5bafb]/15 text-[#d5bafb] border border-[#d5bafb]/30 font-semibold' 
                        : 'bg-transparent text-[#edede6]/50 hover:text-[#edede6] hover:bg-[#edede6]/[0.05] border border-transparent'
                    }`}
                  >
                    <TerminalSquare size={14} />
                    {f.name}
                  </button>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden bg-[#000000]">
              <AnimatePresence mode="wait">
                {tab === "preview" && canPreview ? (
                  <motion.div
                    key="preview-window"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full bg-white"
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
                    key="editor-window"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-full h-full"
                  >
                    <Editor
                      height="100%"
                      width="100%"
                      theme="vs-dark"
                      value={file?.content || "// No file content available"}
                      language={detectLanguage(file?.name)}
                      options={{
                        wordWrap: 'on',
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20, bottom: 20 },
                        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                        fontSize: 14,
                        lineHeight: 22
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Artifact;