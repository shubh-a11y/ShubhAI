import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Crown, 
  X, 
  Zap, 
  Coins, 
  Check, 
  Sparkles, 
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { createOrder } from '../features/createOrder';
import { verifyPayment } from '../features/verifyPayment';
import { setUserdata } from '../redux/userSlice';

function BillingDrawer({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Safely calculate credits & percentage
  const currentPlan = userData?.plan || "free";
  const credits = userData?.credits ?? 0;
  const totalCredits = userData?.totalCredits ?? 100;
  const creditPercent = Math.min(Math.max((credits / totalCredits) * 100, 0), 100);

  const handleUpgrade = async (plan) => {
    try {
      const data = await createOrder(plan);
      console.log("Order created:", data);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "ShubhAI",
        description: `${data.plan.name} Plan`,
        order_id: data.order.id,
        handler: async (response) => {
          try {
            const res = await verifyPayment(response);
            dispatch(setUserdata(res.user)); // Update user data in Redux store
            console.log("Payment verified:", res);
          } catch (err) {
            console.error("Error verifying payment:", err);
          }
        },
        theme: {
          color: "#beff8b" // Aligned with the Neon Lime brand accent
        }
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Error in handleUpgrade:", err);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.4, 0.0, 0.2, 1] }}
            className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-[#0a0a0d]/95 backdrop-blur-2xl border-l border-[#edede6]/10 z-50 shadow-2xl flex flex-col justify-between overflow-hidden select-none"
          >
            {/* ================= HEADER ================= */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#edede6]/10 bg-[#000000]/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#beff8b]/10 border border-[#beff8b]/20 flex items-center justify-center text-[#beff8b]">
                  <Coins size={17} />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-[#edede6]">Billing & Plans</h2>
                  <p className="text-[11px] text-[#edede6]/40 font-mono">Manage token credits & subscription</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-xl bg-[#edede6]/[0.05] hover:bg-[#edede6]/10 text-[#edede6]/60 hover:text-[#edede6] border border-[#edede6]/10 transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* ================= BODY CONTENT ================= */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-[#edede6]/10 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              {/* CURRENT PLAN & CREDIT CONSUMPTION CARD */}
              <div className="relative p-5 rounded-2xl bg-[#edede6]/[0.03] border border-[#edede6]/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#beff8b]/5 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider font-mono text-[#edede6]/50">Active Tier</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase font-mono bg-[#d5bafb]/10 text-[#d5bafb] border border-[#d5bafb]/20">
                      {currentPlan}
                    </span>
                  </div>
                  <Crown size={18} className="text-[#beff8b]" />
                </div>

                {/* Progress Bar Info */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-xs text-[#edede6]/70">Available Credits</span>
                    <span className="text-sm font-mono font-bold text-[#edede6]">
                      {credits} <span className="text-[#edede6]/40 font-normal">/ {totalCredits}</span>
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-[#edede6]/10 overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${creditPercent}%` }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-[#d5bafb] to-[#beff8b]"
                    />
                  </div>
                  <p className="text-[11px] text-[#edede6]/40 text-right">
                    {Math.round(creditPercent)}% tokens remaining
                  </p>
                </div>
              </div>

              {/* TIER UPGRADE SECTION */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase tracking-wider font-mono text-[#edede6]/50 px-1">
                  Upgrade Capacity
                </h3>

                {/* STARTER PLAN CARD */}
                <div className="group relative p-5 rounded-2xl bg-[#000000]/50 border border-[#edede6]/10 hover:border-[#edede6]/25 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-base font-semibold text-[#edede6]">Starter Plan</h4>
                      <p className="text-xs text-[#edede6]/50">Ideal for daily development tasks</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-[#edede6]">₹199</span>
                      <span className="text-xs text-[#edede6]/40 block font-mono">one-time</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-4 text-xs text-[#edede6]/70">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#beff8b]" /> 500 Compute Credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#beff8b]" /> Standard Multi-Agent routing
                    </li>
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpgrade('starter')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#edede6]/10 hover:bg-[#edede6]/15 text-[#edede6] border border-[#edede6]/15 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Upgrade to Starter</span>
                    <ChevronRight size={14} />
                  </motion.button>
                </div>

                {/* PRO PLAN CARD (RECOMMENDED) */}
                <div className="relative p-5 rounded-2xl bg-[#d5bafb]/[0.03] border border-[#d5bafb]/30 shadow-[0_0_25px_rgba(213,186,251,0.06)]">
                  {/* Badge */}
                  <div className="absolute -top-2.5 right-5 px-2.5 py-0.5 rounded-full bg-[#beff8b] text-black font-semibold text-[10px] uppercase tracking-wide">
                    Popular
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-semibold text-[#edede6]">Pro Plan</h4>
                        <Sparkles size={14} className="text-[#d5bafb]" />
                      </div>
                      <p className="text-xs text-[#edede6]/50">Unlimited autonomy & priority queue</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-[#beff8b]">₹499</span>
                      <span className="text-xs text-[#edede6]/40 block font-mono">one-time</span>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-5 text-xs text-[#edede6]/80">
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#beff8b]" /> 1,000 Compute Credits
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#beff8b]" /> Full RAG Vector Search & Ingestion
                    </li>
                    <li className="flex items-center gap-2">
                      <Check size={14} className="text-[#beff8b]" /> Priority LangGraph execution
                    </li>
                  </ul>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleUpgrade('pro')}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#beff8b] hover:bg-[#beff8b]/90 text-black text-xs font-semibold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(190,255,139,0.2)] transition-all cursor-pointer"
                  >
                    <Zap size={14} className="fill-black" />
                    <span>Get Pro Plan</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ================= FOOTER ================= */}
            <div className="p-4 border-t border-[#edede6]/10 bg-[#000000]/60 flex items-center justify-center gap-2 text-xs text-[#edede6]/40 font-mono shrink-0">
              <ShieldCheck size={14} className="text-[#beff8b]" />
              <span>Encrypted payments via Razorpay Gateway</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BillingDrawer;