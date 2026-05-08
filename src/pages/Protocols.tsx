import { motion, AnimatePresence } from "framer-motion";
import { Hexagon, ExternalLink, ShieldCheck, Cpu } from "lucide-react";
import { useWallet } from "../contexts/WalletContext";

export default function Protocols() {
  const { analysis } = useWallet();
  const rawProtocols = analysis?.protocol_exposure || [];
  
  // To keep institutional feel, if actual wallet exposes some, we show them as active.
  // We can merge with known framework architectures so UI doesn't look barren.
  
  const knownProtocols = [
    { name: "Kamino Finance", type: "Lending / Vaults" },
    { name: "Drift Protocol", type: "Perpetuals" },
    { name: "Jupiter", type: "Aggregator / Perps" },
    { name: "Marginfi", type: "Lending" },
    { name: "Raydium", type: "DEX / AMM" },
    { name: "Tensor", type: "NFT-Fi" },
    { name: "Meteora", type: "Liquidity" }
  ];

  // Build the integration list combining real exposure + inactive fallbacks
  const integrations = knownProtocols.map(kp => {
    const realData = rawProtocols.find(rp => rp.protocol === kp.name);
    if (realData) {
      return {
        name: realData.protocol,
        type: realData.type,
        tvl: `$${realData.exposure_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        risk: realData.risk_score > 70 ? "High" : realData.risk_score > 40 ? "Medium" : "Low",
        active: true
      };
    }
    return {
      ...kp,
      tvl: "$0",
      risk: "Offline",
      active: false
    };
  });
  
  // Add any rogue matched ones not in our known list
  rawProtocols.forEach(rp => {
     if (!knownProtocols.find(kp => kp.name === rp.protocol)) {
         integrations.push({
            name: rp.protocol,
            type: rp.type,
            tvl: `$${rp.exposure_usd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            risk: rp.risk_score > 70 ? "High" : rp.risk_score > 40 ? "Medium" : "Low",
            active: true
         });
     }
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-8"
    >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
            {integrations.map((protocol, i) => (
                <motion.div
                    key={protocol.name}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`
                    rounded-[28px] p-6 lg:p-8 flex flex-col
                    ${protocol.active 
                        ? "bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#f7931a]/20 shadow-[0_0_30px_rgba(247,147,26,0.05)]" 
                        : "bg-white/[0.02] border border-white/[0.03] opacity-60"}
                    `}
                >
                    <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${protocol.active ? "bg-[#f7931a]/10 text-[#f7931a]" : "bg-white/5 text-white/50"}`}>
                        <Hexagon size={20} />
                        </div>
                        <div>
                        <h3 className="text-xl font-bold text-white leading-none mb-1">{protocol.name}</h3>
                        <p className="text-xs font-semibold text-[#8a8a8a]">{protocol.type}</p>
                        </div>
                    </div>
                    <button className="text-[#555] hover:text-white transition-colors">
                        <ExternalLink size={18} />
                    </button>
                    </div>
                    
                    <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8a8a8a]">Exposure (USD)</span>
                        <span className="text-white font-mono font-bold">{protocol.tvl}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[#8a8a8a]">System Risk Profile</span>
                        <span className={`
                        font-bold px-2 py-0.5 rounded text-xs uppercase
                        ${protocol.risk === "High" ? "bg-red-500/10 text-red-500" : 
                            protocol.risk === "Medium" ? "bg-[#f7931a]/10 text-[#f7931a]" : 
                            protocol.risk === "Low" ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-zinc-500"}
                        `}>
                        {protocol.risk}
                        </span>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex items-center gap-2">
                        {protocol.active ? (
                        <>
                            <Cpu size={14} className="text-[#f7931a]" />
                            <span className="text-xs font-bold text-[#f7931a] uppercase tracking-wider">Engine Integrated</span>
                        </>
                        ) : (
                        <>
                            <ShieldCheck size={14} className="text-[#555]" />
                            <span className="text-xs font-bold text-[#555] uppercase tracking-wider">Disconnect</span>
                        </>
                        )}
                    </div>
                    </div>
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
    </motion.div>
  );
}
