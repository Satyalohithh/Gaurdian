import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { GlassPanel } from "./GlassPanel";

const steps = [
  "Connecting wallet...",
  "Parsing protocol exposure...",
  "Calculating liquidation risk...",
  "Running Guardian AI analysis..."
];

export function AnalysisLoading() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const intervals = [0, 600, 1400, 2200];
    const timeouts = intervals.map((time, idx) => 
      setTimeout(() => setStepIndex(idx), time)
    );
    return () => timeouts.forEach((t) => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-[#f7931a] blur-xl opacity-30 rounded-full animate-pulse" />
          <div className="h-16 w-16 bg-[#111] rounded-full border border-[#1f1f1f] shadow-lg flex items-center justify-center relative z-10 overflow-hidden">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-[#f7931a] rounded-full"
            />
            <BrainCircuit className="text-[#f7931a]" size={28} />
          </div>
        </div>
        
        <div className="h-8 overflow-hidden flex items-center justify-center">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-lg font-serif tracking-tight text-white"
          >
            {steps[stepIndex]}
          </motion.div>
        </div>
        <div className="mt-2 text-xs font-mono text-[#8a8a8a] flex items-center gap-2 uppercase tracking-widest">
          <span className="text-[#f7931a] animate-pulse">?</span> Processing
        </div>
      </div>

      {/* Skeletons Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <GlassPanel key={i} className="h-[120px] relative overflow-hidden flex flex-col justify-between">
            <div className="w-24 h-4 bg-white/5 rounded animate-pulse" />
            <div className="w-16 h-8 bg-white/5 rounded animate-pulse" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-full animate-[shimmer_2s_infinite]" />
          </GlassPanel>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassPanel className="lg:col-span-2 h-[350px] relative overflow-hidden">
          <div className="w-48 h-5 bg-white/5 rounded mb-8 animate-pulse" />
          <div className="h-[250px] w-full bg-white/5 rounded animate-pulse" />
        </GlassPanel>

        <GlassPanel className="h-[350px] relative overflow-hidden">
          <div className="w-32 h-5 bg-white/5 rounded mb-8 animate-pulse" />
          <div className="h-[100px] w-full bg-white/5 rounded mb-4 animate-pulse" />
          <div className="h-[100px] w-full bg-white/5 rounded animate-pulse" />
        </GlassPanel>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(-200%) skewX(-12deg); }
        }
      `}</style>
    </motion.div>
  );
}
