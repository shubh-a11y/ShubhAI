import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Sparkles, Copy, Check, TerminalSquare } from 'lucide-react';

function MessageBubble({ role, content }) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  // Copy whole message to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex flex-col gap-1.5 max-w-[90%] md:max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        
        {/* ======== AVATAR & SENDER NAME ======== */}
        <div className={`flex items-center gap-2 px-1 text-xs font-mono mb-1 ${isUser ? 'flex-row-reverse text-[#edede6]/50' : 'text-[#d5bafb]'}`}>
          <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isUser ? 'bg-[#edede6]/10' : 'bg-[#d5bafb]/10 border border-[#d5bafb]/30'}`}>
            {isUser ? <User size={12} /> : <Sparkles size={12} className="text-[#d5bafb]" />}
          </div>
          <span className="font-semibold tracking-wider">
            {isUser ? "YOU" : "SHUBH AI"}
          </span>
          
          {/* Copy Button (Only for AI) */}
          {!isUser && (
            <button 
              onClick={handleCopy}
              className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#d5bafb]/10 rounded-md text-[#edede6]/40 hover:text-[#d5bafb]"
              title="Copy response"
            >
              {copied ? <Check size={14} className="text-[#beff8b]" /> : <Copy size={14} />}
            </button>
          )}
        </div>

        {/* ======== MESSAGE BUBBLE ======== */}
        <div 
          className={`relative px-5 py-4 text-[15px] leading-relaxed break-words shadow-sm ${
            isUser 
              ? 'bg-[#edede6]/[0.05] border border-[#edede6]/10 text-[#edede6] rounded-2xl rounded-tr-sm' 
              : 'bg-transparent border border-[#d5bafb]/15 text-[#edede6]/90 rounded-2xl rounded-tl-sm shadow-[0_0_15px_rgba(213,186,251,0.03)]'
          }`}
        >
          {/* 
            FIX APPLIED HERE: 
            Wrapped Markdown in a div for the flex styling to avoid v9 crash 
          */}
          <div className="flex flex-col gap-3">
            <Markdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Paragraphs
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                
                // Headings
                h1: ({ node, ...props }) => <h1 className="text-xl font-bold text-[#edede6] mt-4 mb-2" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-lg font-semibold text-[#edede6] mt-3 mb-2" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-base font-semibold text-[#edede6] mt-2 mb-1" {...props} />,
                
                // Lists
                ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 space-y-1 my-2 text-[#edede6]/80" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 space-y-1 my-2 text-[#edede6]/80" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                
                // Bold & Italic
                strong: ({ node, ...props }) => <strong className="font-semibold text-[#edede6]" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-[#edede6]/70" {...props} />,
                
                // Inline Code & Code Blocks
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  if (!inline) {
                    // Block Code (Terminal style)
                    return (
                      <div className="relative my-4 overflow-hidden rounded-xl border border-[#edede6]/15 bg-[#000000]">
                        <div className="flex items-center justify-between px-4 py-2 bg-[#edede6]/[0.05] border-b border-[#edede6]/10 text-xs font-mono text-[#edede6]/50">
                          <div className="flex items-center gap-2">
                            <TerminalSquare size={14} /> 
                            <span>{match ? match[1] : 'Code Output'}</span>
                          </div>
                        </div>
                        <div className="overflow-x-auto p-4 custom-scrollbar">
                          <code className="text-[13px] font-mono text-[#edede6]/90 whitespace-pre" {...props}>
                            {children}
                          </code>
                        </div>
                      </div>
                    );
                  }
                  // Inline Code
                  return (
                    <code className="px-1.5 py-0.5 rounded-md bg-[#edede6]/10 text-[#beff8b] font-mono text-[13px]" {...props}>
                      {children}
                    </code>
                  );
                },
                
                // Tables
                table: ({ node, ...props }) => (
                  <div className="overflow-x-auto my-4 rounded-lg border border-[#edede6]/15">
                    <table className="min-w-full divide-y divide-[#edede6]/15" {...props} />
                  </div>
                ),
                th: ({ node, ...props }) => <th className="px-4 py-3 bg-[#edede6]/[0.05] text-left text-xs font-semibold text-[#edede6] uppercase tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-4 py-3 whitespace-nowrap text-sm text-[#edede6]/80 border-t border-[#edede6]/10" {...props} />,
                
                // Blockquotes
                blockquote: ({ node, ...props }) => (
                  <blockquote className="border-l-2 border-[#d5bafb]/50 pl-4 py-1 my-2 italic text-[#edede6]/60 bg-[#d5bafb]/[0.02]" {...props} />
                )
              }}
            >
              {content}
            </Markdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;