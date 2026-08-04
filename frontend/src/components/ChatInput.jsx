import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mic, Paperclip, Send, Sparkles, CornerDownLeft, Zap, MessageSquare, Code2, FileText, Presentation, ImageIcon, Globe2 } from 'lucide-react';

// Feature & Redux Imports (Kept 100% identical to your structure)
import sendMessage from '../features/sendMessage';
import { addMessage } from '../redux/messageSlice';
import { addConversation, setConvTitle, setSelectedConversation } from '../redux/conversationSlice';
import { createConversation } from '../features/createConversation';
import { updateConversation } from '../features/updateConversation';

function ChatInput() {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { selectedConversation } = useSelector((state) => state.conversation);
  const [selectedAgent, setSelectedAgent] = useState("Auto");



  const handleSendMessage = async () => {

    let conversation = selectedConversation;
    if(!conversation)
    {
      const {data} = await createConversation();
      console.log(data);
      dispatch(setSelectedConversation(data.conversation));
      dispatch(addConversation(data.conversation));

      conversation = data.conversation;
    }

    if(conversation?.title === "New Conversation")
    {
      await updateConversation({id: conversation._id, title: value.trim()});
      dispatch(setConvTitle({conversationId: conversation._id, title: value.trim()}))
    }
      
    

    if (!value.trim() || !conversation?._id || isLoading) return;

    const userPrompt = value.trim();
    setValue(""); // Instant UX feedback
    setIsLoading(true);

    try {
      const payload = {
        conversationId: conversation._id,
        prompt: userPrompt,
        agent: selectedAgent.toLowerCase()
      };

      // Optimistically add user message to state
      dispatch(addMessage({
        role: "user",
        content: userPrompt,
        conversationId: conversation._id
      }));

      // Call API backend
      const data = await sendMessage(payload);
      console.log("Response data:", data);

      // Add assistant response to state
      dispatch(addMessage({
        role: "assistant",
        content: data.answer,
        conversationId: conversation._id,
        images: data.images || []
      }));
    } catch (err) {
      console.error("Message error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut: Enter sends message, Shift+Enter adds newline
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isBtnDisabled = value.trim().length === 0 || isLoading;

  const agents = [
    {
      id:"auto",
      icon:Zap,
      label: "Auto"
    },
        {
      id:"chat",
      icon:MessageSquare,
      label: "Chat"
    },
        {
      id:"coding",
      icon:Code2,
      label: "Coding"
    },
        {
      id:"pdf",
      icon:FileText,
      label: "PDF"
    },
        {
      id:"ppt",
      icon:Presentation,
      label: "PPT"
    },
        {
      id:"image",
      icon:ImageIcon,
      label: "Image"
    },
        {
      id:"search",
      icon:Globe2,
      label: "Search"
    }
  ]


  return (
    <div className="w-full p-4 sm:p-6 bg-gradient-to-t from-[#000000] via-[#000000]/90 to-transparent shrink-0 z-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Main Floating Input Box */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative bg-[#0a0a0d]/80 backdrop-blur-xl border border-[#edede6]/15 focus-within:border-[#beff8b]/50 focus-within:shadow-[0_0_25px_rgba(190,255,139,0.12)] rounded-2xl p-3 transition-all duration-200"
        >

          <div className="flex items-center gap-2 mb-2">
            {agents.map(agent => {
              const isActive = selectedAgent === agent.label
              const Icon = agent.icon;
              return (
                <div className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer ${isActive ? 'bg-[#beff8b]/10 border-[#beff8b] text-[#beff8b]' : 'bg-[#d5bafb]/10 border-[#d5bafb]/20 text-[#d5bafb]'}`}
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.label)}
                >
                  <Icon size={16} className={isActive? 'text-[#beff8b]' : 'text-[#d5bafb]'}/>
                  <span>{agent.label}</span> 

                </div>
              )
            })}
          </div>
          {/* Textarea Input */}
          <textarea
            rows={2}
        
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            value={value}

            placeholder={
              selectedConversation 
                ? "Ask the Multi-Agent engine anything... (e.g. Analyze document or run task)" 
                : "Select a conversation from the sidebar to start messaging..."
            }
            className="w-full bg-transparent text-[#edede6] placeholder:text-[#edede6]/30 text-sm sm:text-base focus:outline-none resize-none pr-2 custom-scrollbar disabled:opacity-50"
          />

          {/* Bottom Action Bar inside Input Box */}
          <div className="flex items-center justify-between pt-2 border-t border-[#edede6]/10 mt-1">
            {/* Attachment & Voice Tools */}
            <div className="flex items-center gap-1 sm:gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="p-2 rounded-xl text-[#edede6]/50 hover:text-[#edede6] hover:bg-[#edede6]/[0.08] transition-colors"
                title="Attach Document for RAG Vector Search"
              >
                <Paperclip size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="p-2 rounded-xl text-[#edede6]/50 hover:text-[#edede6] hover:bg-[#edede6]/[0.08] transition-colors"
                title="Voice Input"
              >
                <Mic size={18} />
              </motion.button>

              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#d5bafb]/10 text-[#d5bafb] text-[11px] font-mono border border-[#d5bafb]/20 ml-1">
                <Sparkles size={12} /> Multi-Agent Mode
              </div>
            </div>

            {/* Send CTA Button */}
            <motion.button
              whileHover={!isBtnDisabled ? { scale: 1.05 } : {}}
              whileTap={!isBtnDisabled ? { scale: 0.95 } : {}}
              disabled={isBtnDisabled}
              onClick={handleSendMessage}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isBtnDisabled
                  ? "bg-[#edede6]/10 text-[#edede6]/30 cursor-not-allowed"
                  : "bg-[#beff8b] text-black shadow-[0_0_18px_rgba(190,255,139,0.3)] hover:bg-[#beff8b]/90 cursor-pointer"
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Send</span>
                  <Send size={15} className="stroke-[2.5]" />
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Shortcut Indicator */}
        <div className="flex items-center justify-between px-2 text-[11px] text-[#edede6]/30 font-mono">
          <span className="flex items-center gap-1">
            <CornerDownLeft size={10} /> <span className="text-[#edede6]/50">Enter</span> to send, <span className="text-[#edede6]/50">Shift + Enter</span> for new line
          </span>
          <span className="hidden sm:inline">Shubh AI</span>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;