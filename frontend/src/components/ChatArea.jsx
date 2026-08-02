import React, { useEffect } from "react";
import { motion } from "framer-motion";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import Nav from "./Nav";
import { useDispatch, useSelector } from "react-redux";
import getMessages from "../features/getMessages";
import { setMessages } from "../redux/messageSlice";

function ChatArea() {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);

  useEffect(() => {
    const getMesg = async () => {
      if (selectedConversation) {
        try {
          if(selectedConversation.title === "New Conversation") return;
          const data = await getMessages(selectedConversation._id);
          console.log("Fetched:", data.messages);
          dispatch(setMessages(data.messages || []));
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };

    getMesg();
  }, [selectedConversation?._id, dispatch]);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col h-screen bg-[#000000] relative overflow-hidden"
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d5bafb]/[0.03] blur-[120px] pointer-events-none z-0" />

      {/* Chat Components (Z-10 to sit above the glow) */}
      <div className="relative z-10 flex flex-col h-full w-full">
        <Nav />
        <MessageList />
        <ChatInput />
      </div>
    </motion.main>
  );
}

export default ChatArea;