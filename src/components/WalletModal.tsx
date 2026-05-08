import { motion, AnimatePresence } from 'framer-motion';

export default function WalletModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-[#111318] border border-white/10 rounded-[18px] w-full max-w-[380px] overflow-hidden"
          >
            <div className="p-5 pb-4 border-b border-white/10 flex justify-between items-center">
              <span className="text-[16px] font-semibold tracking-[-0.3px] text-[#F2F2F7]">Connect your Wallet</span>
              <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm text-[#F2F2F7]/50 hover:text-[#F2F2F7] transition-colors hover:bg-white/20">
                ✕
              </button>
            </div>
            
            <div className="py-2">
              {[
                { icon: '🦊', name: 'MetaMask', desc: 'Browser extension', bg: 'rgba(255,133,27,0.12)' },
                { icon: '👻', name: 'Phantom', desc: 'Solana & multi-chain', bg: 'rgba(101,31,255,0.12)' },
                { icon: '💠', name: 'Coinbase Wallet', desc: 'Self-custody', bg: 'rgba(0,82,255,0.12)' },
                { icon: '•••', name: 'Other Wallets', desc: 'WalletConnect v2', bg: 'rgba(255,255,255,0.06)' },
              ].map((w, i) => (
                <div key={i} className="flex items-center gap-3.5 px-5 py-3.5 cursor-pointer hover:bg-white/5 transition-colors group">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center text-lg" style={{ background: w.bg }}>
                    {w.icon}
                  </div>
                  <div>
                    <div className="text-[15px] font-medium tracking-[-0.2px] text-[#F2F2F7]">{w.name}</div>
                    <div className="text-[12px] text-[#F2F2F7]/40">{w.desc}</div>
                  </div>
                  <svg className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3L9 7L5 11" stroke="#F2F2F7" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                </div>
              ))}
            </div>

            <div className="px-5 py-3.5 border-t border-white/5 text-[11px] text-[#F2F2F7]/35 text-center">
              By connecting, you agree to our <a href="#" className="text-[#0066FF] hover:underline">Terms</a> and <a href="#" className="text-[#0066FF] hover:underline">Privacy Policy</a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
