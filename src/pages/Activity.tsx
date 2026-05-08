import { motion } from "framer-motion";
import { Zap, AlertCircle, ArrowRightLeft, Database } from "lucide-react";

const activities = [
  { id: 1, type: 'risk', title: 'Collateral Value Dropped', desc: 'SOL-PERP margin fell by 4.2% in 5 minutes.', time: '2 mins ago', severity: 'high' },
  { id: 2, type: 'tx', title: 'Position Liquidated', desc: 'Liquidator bot #420 liquidated marginfi position $400.', time: '14 mins ago', severity: 'critical' },
  { id: 3, type: 'system', title: 'Oracle Sync', desc: 'Pyth network oracles synced successfully.', time: '1 hr ago', severity: 'info' },
  { id: 4, type: 'tx', title: 'Wallet Deposit', desc: '+50.00 SOL deposited to margin account.', time: '3 hrs ago', severity: 'success' },
  { id: 5, type: 'risk', title: 'Liquidity Warning', desc: 'USDC borrow utilization > 85% on Kamino.', time: '5 hrs ago', severity: 'medium' },
];

export default function Activity() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-6 max-w-4xl"
    >
      <div className="rounded-[32px] p-8 lg:p-10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#f7931a]/10 flex items-center justify-center">
            <Zap size={24} className="text-[#f7931a]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Event Log</h2>
            <p className="text-[#8a8a8a] text-sm">System events, oracles, and transaction history.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-[23px] w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
          
          <div className="space-y-8 relative">
            {activities.map((act) => {
              
              let Icon = ArrowRightLeft;
              let color = 'text-white';
              let bg = 'bg-white/10';
              let ring = 'ring-white/5';
              
              if (act.severity === 'critical') {
                Icon = AlertCircle; color = 'text-red-500'; bg = 'bg-red-500/10'; ring = 'ring-red-500/20';
              } else if (act.severity === 'high') {
                Icon = AlertCircle; color = 'text-[#f7931a]'; bg = 'bg-[#f7931a]/10'; ring = 'ring-[#f7931a]/20';
              } else if (act.severity === 'medium') {
                Icon = AlertCircle; color = 'text-yellow-500'; bg = 'bg-yellow-500/10'; ring = 'ring-yellow-500/20';
              } else if (act.severity === 'success') {
                color = 'text-green-500'; bg = 'bg-green-500/10'; ring = 'ring-green-500/20';
              } else if (act.type === 'system') {
                Icon = Database; color = 'text-blue-400'; bg = 'bg-blue-500/10'; ring = 'ring-blue-500/20';
              }
              
              return (
                <motion.div 
                  key={act.id} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex gap-6 relative group"
                >
                  <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${bg} ${color} ring-4 ${ring} z-10 group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                  </div>
                  <div className="pt-2 flex-1 pb-4 border-b border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-white font-bold text-lg">{act.title}</h4>
                      <span className="text-xs font-mono font-bold text-[#555]">{act.time}</span>
                    </div>
                    <p className="text-[#8a8a8a] text-sm leading-relaxed">{act.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
