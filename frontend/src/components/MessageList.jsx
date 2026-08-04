import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Sparkles, TerminalSquare } from 'lucide-react';
import MessageBubble from './MessageBubble';

function MessageList() {
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the newest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Check if we should show the empty state
  const showEmptyState = !selectedConversation || !messages || messages.length === 0;

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#edede6]/10 [&::-webkit-scrollbar-thumb]:rounded-full">
      {showEmptyState ? (
        /* ================= HERO EMPTY STATE ================= */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto"
        >
          {/* Glowing Logo Container */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#beff8b]/20 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 rounded-3xl bg-black border border-[#beff8b]/30 flex items-center justify-center text-[#beff8b] shadow-[0_0_30px_rgba(190,255,139,0.15)]">
              <Sparkles size={36} className="stroke-[1.5]" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-[#edede6] mb-3">
            Welcome to <span className="text-[#beff8b]">Shubh AI</span>
          </h1>
          
          <p className="text-[#edede6]/50 text-sm sm:text-base leading-relaxed flex items-center justify-center gap-2">
            <TerminalSquare size={16} />
            System initialized. Enter a prompt below to launch the Multi-Agent pipeline.
          </p>
        </motion.div>
      ) : (
        /* ================= MESSAGE STREAM ================= */
        <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-4">
          {messages.map((msg, i) => (
            <motion.div
              key={msg._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble role={msg?.role} content={msg?.content} images={msg?.images || []} />
            </motion.div>
          ))}
          {/* Invisible div to anchor the auto-scroll */}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      )}
    </div>
  );
}

export default MessageList;