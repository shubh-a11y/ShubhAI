import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coins, 
  LogOutIcon, 
  User, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Sparkles, 
  LogIn 
} from 'lucide-react';

// API & Redux Imports (Kept identical to your structure)
import { getConversations } from '../features/getConversations';
import logout from '../features/logout';
import { 
  setConversations, 
  setSelectedConversation 
} from '../redux/conversationSlice';
import { setUserdata } from '../redux/userSlice.js';
import { setMessages } from '../redux/messageSlice.js';
import BillingDrawer from './BillingDrawer.jsx';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const dispatch = useDispatch();
  const { conversations, selectedConversation } = useSelector((state) => state.conversation);
  const { userData } = useSelector((state) => state.user);
  const [showbilling, setShowBilling] = useState(false);

  // Fetch conversations on load or when userData changes
  useEffect(() => {
    const getConv = async () => {
      try {
        const { data } = await getConversations();
        dispatch(setConversations(data.conversations || []));
        console.log("Conversations fetched:", data);
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      }
    };
    if (userData) {
      getConv();
    }
  }, [userData, dispatch]);

  // Handle new conversation creation
  const createConversationHandler = async () => {
    
      dispatch(setSelectedConversation(null)); // Reset selected conversation
      dispatch(setMessages([]));
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(setUserdata(null));
      
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-[#000000] border-r border-[#edede6]/10 flex flex-col justify-between select-none relative z-50 shrink-0"
    >
      {/* ================= TOP SECTION: BRAND & NEW CHAT ================= */}
      <div className="p-4 flex flex-col gap-4 border-b border-[#edede6]/10">
        {/* Header & Toggle Button */}
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="w-7 h-7 rounded-lg bg-[#beff8b]/10 border border-[#beff8b]/30 flex items-center justify-center text-[#beff8b]">
                  <Sparkles size={16} />
                </div>
                <span className="font-semibold text-lg tracking-wide text-[#edede6] truncate">
                  Shubh<span className="text-[#beff8b]">.AI</span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-[#edede6]/[0.05] hover:bg-[#edede6]/[0.1] text-[#edede6]/60 hover:text-[#edede6] border border-[#edede6]/10 transition-colors mx-auto"
            title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </motion.button>
        </div>

        {/* Primary CTA: Create Conversation */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={createConversationHandler}
          className={`flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-[#beff8b] hover:bg-[#beff8b]/90 text-black font-semibold shadow-[0_0_15px_rgba(190,255,139,0.15)] transition-all ${
            collapsed ? "px-0" : ""
          }`}
          title="New Conversation"
        >
          <Plus size={20} className="shrink-0 stroke-[2.5]" />
          {!collapsed && <span className="truncate">New Chat</span>}
        </motion.button>
      </div>

      {/* ================= MIDDLE SECTION: CONVERSATIONS LIST ================= */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#edede6]/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        {!conversations || conversations.length === 0 ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#edede6]/40">
            <MessageSquare size={28} className="mb-2 opacity-50 stroke-[1.5]" />
            {!collapsed && (
              <p className="text-xs leading-relaxed">
                No active agents.<br />Click <span className="text-[#beff8b]">+</span> above to launch one.
              </p>
            )}
          </div>
        ) : (
          /* Populated List */
          conversations.map((conv, i) => {
            const isActive = conv._id === selectedConversation?._id;
            return (
              <motion.div
                key={conv._id || i}
                whileHover={{ x: 2 }}
                onClick={() => dispatch(setSelectedConversation(conv))}
                className={`group flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-150 border ${
                  isActive
                    ? "bg-[#beff8b]/10 text-[#beff8b] border-[#beff8b]/30 font-medium"
                    : "bg-transparent text-[#edede6]/70 hover:bg-[#edede6]/[0.05] hover:text-[#edede6] border-transparent"
                }`}
                title={conv.title || `Conversation ${i + 1}`}
              >
                <MessageSquare 
                  size={18} 
                  className={`shrink-0 ${isActive ? "text-[#beff8b]" : "text-[#edede6]/40 group-hover:text-[#edede6]/70"}`} 
                />
                
                {!collapsed && (
                  <span className="truncate text-sm">
                    {conv.title ? conv.title : `Conversation ${i + 1}`}
                  </span>
                )}

                {/* Subtle Active Indicator Dot */}
                {isActive && !collapsed && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#beff8b] ml-auto shrink-0 shadow-[0_0_8px_#beff8b]" />
                )}
              </motion.div>
            );
          })
        )}
      </div>

      {/* ================= BOTTOM SECTION: USER PROFILE & FOOTER ================= */}
      <div className="p-3 border-t border-[#edede6]/10 bg-[#edede6]/[0.02]">
        {userData ? (
          <div className={`flex items-center ${collapsed ? "justify-center flex-col gap-3" : "justify-between gap-3"}`}>
            {/* Avatar & User Info */}
            <div className="flex items-center gap-3 overflow-hidden min-w-0">
              <div className="relative shrink-0">
                {userData.avatar && !imageError ? (
                  <img
                    className="w-9 h-9 rounded-xl object-cover border border-[#edede6]/20"
                    src={userData.avatar}
                    alt={userData.name || "User"}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#edede6]/10 border border-[#edede6]/20 flex justify-center items-center text-[#edede6]">
                    <User size={18} />
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-[#beff8b] border-2 border-black rounded-full" />
              </div>

              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <p className="text-sm font-medium text-[#edede6] truncate">
                    {userData.name || "User"}
                  </p>
                  <span className="text-[10px] font-semibold text-[#d5bafb] bg-[#d5bafb]/10 border border-[#d5bafb]/20 px-1.5 py-0.5 rounded-md w-fit">
                    Free Plan
                  </span>
                </div>
              )}
            </div>

            {/* Actions: Coins & Logout */}
            <div className={`flex items-center ${collapsed ? "flex-col gap-1.5" : "gap-1"}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg hover:bg-[#edede6]/[0.05] text-[#edede6]/60 hover:text-[#beff8b] transition-colors"
                title="Credits & Billing"
                onClick={() => setShowBilling(true)}
              >
                <Coins size={16} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[#edede6]/[0.05] text-[#edede6]/60 hover:text-red-400 transition-colors"
                title="Log Out"
              >
                <LogOutIcon size={16} />
              </motion.button>
            </div>
          </div>
        ) : (
          /* Logged Out State */
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-2.5 px-3 rounded-xl bg-[#edede6]/10 hover:bg-[#edede6]/15 text-[#edede6] font-medium border border-[#edede6]/20 flex items-center justify-center gap-2 transition-all ${
              collapsed ? "px-0" : ""
            }`}
            title="Log In"
          >
            <LogIn size={18} className="shrink-0 text-[#beff8b]" />
            {!collapsed && <span>Log In</span>}
          </motion.button>
        )}
      </div>

        <BillingDrawer 
        open={showbilling}
        onClose={() => setShowBilling(false)}
        />
    </motion.aside>
  );
}


export default Sidebar;