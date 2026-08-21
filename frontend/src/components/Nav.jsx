
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { MessageSquare, Bot, Cpu, Sparkles } from 'lucide-react';

function Nav() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  if (!selectedConversation) {
    return (
      <header className="w-full h-16 bg-[#000000]/60 backdrop-blur-md border-b border-[#edede6]/10 px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#edede6]/[0.05] border border-[#edede6]/10 flex items-center justify-center text-[#edede6]/40">
            <Bot size={18} />
          </div>
          <span className="text-sm font-medium text-[#edede6]/40">
            Select or start a conversation
          </span>
        </div>
      </header>
    );
  }

  const msgCount = messages?.length || 0;

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-16 bg-[#000000]/70 backdrop-blur-md border-b border-[#edede6]/10 px-6 flex items-center justify-between z-20 shrink-0"
    >
      {/* Left Side: Conversation Title & Active Agent Status */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Agent Avatar Icon */}
        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-xl bg-[#beff8b]/10 border border-[#beff8b]/30 flex items-center justify-center text-[#beff8b] shadow-[0_0_12px_rgba(190,255,139,0.15)]">
            <Sparkles size={18} />
          </div>
          {/* Pulsing Live Dot */}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#beff8b] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#beff8b]" />
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-sm sm:text-base font-semibold text-[#edede6] truncate tracking-wide">
            {selectedConversation.title || "Untitled Agent Session"}
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-[#edede6]/50">
            <span className="flex items-center gap-1 text-[#beff8b] font-mono">
              <Cpu size={11} /> Multi-Agent Engine
            </span>
            <span>•</span>
            <span className="truncate">RAG Ingestion Active</span>
          </div>
        </div>
      </div>

      {/* Right Side: Message Count & Metric Badge */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edede6]/[0.04] border border-[#edede6]/10 text-xs font-mono text-[#edede6]/80">
          <MessageSquare size={13} className="text-[#d5bafb]" />
          <span>{msgCount}</span>
          <span className="text-[#edede6]/40 hidden sm:inline">
            {msgCount === 1 ? 'msg' : 'msgs'}
          </span>
        </div>
      </div>
    </motion.header>
  );
}

export default Nav;