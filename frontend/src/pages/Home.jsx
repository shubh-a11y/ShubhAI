import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import api from '../../utils/axios';
import { auth, googleProvider } from '../../utils/firebase';
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { setUserdata } from '../redux/userSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

// Main App Components
import Sidebar from '../components/Sidebar.jsx';
import ChatArea from '../components/ChatArea.jsx';
import Artifact from '../components/Artifact.jsx';

function Home() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  // Backend login handler (Preserved exactly as in your logic)
  const handleLogin = async (token) => {
    try {
      const data = await api.post("/api/auth/login", { token });
      dispatch(setUserdata(data.data));
      console.log("User data set in Redux:", data.data);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  // Google Firebase OAuth handler (Preserved exactly as in your logic)
  const googleLogin = async () => {
    try {
      const data = await signInWithPopup(auth, googleProvider);
      const token = await data.user.getIdToken();
      await handleLogin(token);
    } catch (error) {
      console.error("Google authentication failed:", error);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#000000] flex overflow-hidden relative select-none">
      {/* ================= MAIN APP LAYOUT (EDGE-TO-EDGE) ================= */}
      <Sidebar />
      <ChatArea />
      <Artifact />

      {/* ================= FLOATING LOGIN MODAL OVERLAY ================= */}
      <AnimatePresence>
        {!userData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/80 backdrop-blur-xl p-4"
          >
            {/* Ambient Background Glow */}
            <div className="absolute w-[380px] h-[380px] bg-[#d5bafb]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#0a0a0d]/90 border border-[#edede6]/15 rounded-3xl p-8 sm:p-10 flex flex-col items-center text-center shadow-[0_0_60px_rgba(0,0,0,0.9)] z-10"
            >
              {/* Brand Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-[#beff8b]/10 border border-[#beff8b]/30 flex items-center justify-center text-[#beff8b] mb-5 shadow-[0_0_25px_rgba(190,255,139,0.15)]">
                <Sparkles size={28} className="stroke-[1.75]" />
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl sm:text-3xl font-bold text-[#edede6] tracking-tight mb-2">
                Welcome to <span className="text-[#beff8b]">Shubh AI</span>
              </h2>
              <p className="text-[#edede6]/50 text-sm leading-relaxed mb-8 max-w-xs">
                Sign in to access your multi-agent workspaces, autonomous tools, and code artifacts.
              </p>

              {/* Google Sign-in CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={googleLogin}
                className="w-full py-3.5 px-4 bg-[#edede6] hover:bg-white text-black font-semibold text-sm rounded-xl flex items-center justify-center gap-3 shadow-[0_4px_20px_rgba(255,255,255,0.08)] transition-all cursor-pointer"
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </motion.button>

              {/* Trust & Feature Badges */}
              <div className="flex items-center gap-4 mt-8 text-[11px] font-mono text-[#edede6]/40">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#beff8b]" /> Secure Auth
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Zap size={14} className="text-[#d5bafb]" /> Multi-Agent Engine
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;