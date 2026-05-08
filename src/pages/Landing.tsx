import { useState, useEffect } from "react";
import { Wallet, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../contexts/WalletContext";

export default function Landing() {
  const { connectWallet, connected } = useWallet();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  useEffect(() => {
    if (connected) {
      navigate('/overview');
    }
  }, [connected, navigate]);

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden relative text-white font-sans flex items-center justify-center">
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute w-[800px] h-[800px] lg:w-[1200px] lg:h-[1200px] -right-[200px] -top-[200px] lg:-right-[300px] lg:-top-[400px] rounded-full z-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(247,147,26,0.12), transparent 70%)",
          filter: "blur(140px)",
        }}
      />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full max-w-7xl px-8 lg:px-12">
        <div className="w-full md:w-[55%] mb-16 md:mb-0">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={mounted ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-6">
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-3 h-3 rounded-full bg-[#f7931a] shadow-[0_0_15px_rgba(247,147,26,0.6)]" 
              />
              <span className="text-[#f7931a] font-bold tracking-widest text-sm uppercase">Guardian Intelligence</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-8xl font-black leading-[1] lg:leading-[0.9] tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-[#e0e0e0] to-[#6b6b6b]">
              Institutional<br />
              Solana Risk<br />
              Terminal
            </h1>
            <p className="text-lg lg:text-2xl text-[#8a8a8a] leading-relaxed max-w-[600px] mb-12 font-medium">
              Real-time portfolio surveillance, leverage monitoring, and preemptive liquidation alerts for DeFi power users.
            </p>
            <button
              onClick={connectWallet}
              className="group relative h-16 w-full sm:w-auto px-10 rounded-2xl bg-[#f7931a] text-black font-bold text-lg overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(247,147,26,0.2)] hover:shadow-[0_0_60px_rgba(247,147,26,0.4)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center justify-center gap-2">
                <Wallet size={20} />
                Connect Phantom
              </span>
            </button>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={mounted ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full md:w-[420px] lg:w-[480px]"
        >
          <div className="rounded-[32px] p-8 bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.08] backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.5)] hover:border-white/[0.15] transition-colors duration-500">
            <div className="flex items-center justify-between mb-8">
              <div className="text-[11px] tracking-[2px] font-bold text-[#f7931a]">LIVE PREVIEW</div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
                <div className="w-2 h-2 rounded-full bg-white/20" />
              </div>
            </div>
            <div className="mb-10">
              <p className="text-sm font-medium text-[#8a8a8a] mb-2">Total Exposure</p>
              <h2 className="text-5xl font-black tracking-tight text-white mb-4">$142,589</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20">
                <AlertTriangle size={12} /> HIGH RISK ZONE
              </div>
            </div>
            <div className="space-y-3">
              {[
                "SOL-PERP margin deficit detected",
                "Leverage ratio at 4.2x (3.0x limit)",
                "Protocol concentration risk: Kamino"
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f7931a] mt-1.5 shrink-0" />
                  <span className="text-[#cfcfcf] text-sm font-medium leading-relaxed">{alert}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
