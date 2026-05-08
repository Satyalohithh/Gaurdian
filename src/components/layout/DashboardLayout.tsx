import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { 
  ShieldAlert, 
  Activity, 
  Wallet, 
  Layers, 
  Hexagon,
    Zap,
  Search,
  Bell,
  Settings,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../../contexts/WalletContext";
import { AnalysisLoading } from "../ui/AnalysisLoading";

const navItems = [
  { id: "Overview", path: "/overview", icon: Layers },
  { id: "Risk Engine", path: "/risk-engine", icon: ShieldAlert },
  { id: "Exposure", path: "/exposure", icon: Activity },
  { id: "Protocols", path: "/protocols", icon: Hexagon },
  { id: "Activity", path: "/activity", icon: Zap },
];

export function DashboardLayout() {
  const { wallets, isAnalyzing, connectWallet, addWallet, removeWallet, disconnectWallet } = useWallet();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddWallet, setShowAddWallet] = useState(false);
  const [newWalletInput, setNewWalletInput] = useState("");

  const activeNav = navItems.find((item) => location.pathname.includes(item.path)) || navItems[0];

  return (
    <div className="h-screen bg-[#060606] text-white font-sans flex overflow-hidden selection:bg-[#f7931a]/30">
      
      {/* MOBILE MENU TOGGLE AND OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <div className={`
        fixed md:static inset-y-0 left-0 w-[260px] md:w-[280px] shrink-0 border-r border-[#1a1a1a] bg-[#080808]/95 backdrop-blur-xl p-5 flex flex-col justify-between z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[#f7931a]/10 to-transparent opacity-50" />
        
        <div>
          {/* LOGO */}
          <div className="flex items-center justify-between mb-10 pl-2 pr-1">
            <Link to="/overview" className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-[4px] bg-gradient-to-br from-[#f7931a] to-[#d97706] shadow-[0_0_20px_rgba(247,147,26,0.5)] transform rotate-45" />
              <h1 className="text-xl font-black tracking-tight mt-1 hover:text-[#f7931a] transition-colors">Guardian</h1>
            </Link>
            <button className="md:hidden text-[#8a8a8a]" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* NAV MENU */}
          <div className="flex flex-col gap-1 mb-8">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#555] mb-2 px-3">Main Navigation</div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group
                    ${isActive 
                      ? "bg-[#111] text-white shadow-[inset_2px_0_0_#f7931a]" 
                      : "text-[#8a8a8a] border border-transparent hover:bg-[#111]/50 hover:text-white"
                    }
                  `}
                >
                  <Icon size={18} className={`transition-colors ${isActive ? "text-[#f7931a]" : "text-[#555] group-hover:text-[#888]"}`} />
                  {item.id}
                </Link>
              );
            })}
          </div>
        </div>

        {/* WALLETS SECTION */}
        <div className="flex flex-col gap-2 mt-4 border-t border-[#1a1a1a] pt-4">
          <div className="flex items-center justify-between px-2 mb-1">
            <span className="text-[10px] font-bold text-[#555] uppercase tracking-widest">Portfolios ({wallets.length})</span>
            <button 
              onClick={() => showAddWallet ? setShowAddWallet(false) : setShowAddWallet(true)}
              className="text-[#f7931a] text-xs hover:text-[#ffb74d]"
            >
              + Add
            </button>
          </div>
          
          <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
            {wallets.length === 0 && (
              <div className="text-xs text-[#555] px-2 py-2">
                <button onClick={connectWallet} className="bg-[#111] hover:bg-[#1a1a1a] text-white border border-[#1f1f1f] rounded-lg px-3 py-1.5 w-full text-left flex items-center gap-2">
                   <Wallet size={12} className="text-[#f7931a]"/> Connect Phantom
                </button>
              </div>
            )}
            {wallets.map((w, idx) => (
              <div key={idx} className="p-2.5 rounded-xl bg-[#111] border border-[#1f1f1f] flex items-center justify-between group">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                    <Wallet size={12} className="text-indigo-400" />
                  </div>
                  <p className="text-xs font-mono truncate text-white/90">
                    {w.slice(0, 4)}...{w.slice(-4)}
                  </p>
                </div>
                <button onClick={() => removeWallet(w)} className="text-[#555] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {wallets.length > 0 && (
            <button 
              onClick={disconnectWallet}
              className="mt-2 text-xs text-[#555] hover:text-white px-2 text-left"
            >
              Disconnect All
            </button>
          )}

          {showAddWallet && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
              <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-6 rounded-2xl w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-white mb-4">Add Wallet</h3>
                <input 
                  type="text" 
                  placeholder="Enter wallet address" 
                  value={newWalletInput}
                  onChange={(e) => setNewWalletInput(e.target.value)}
                  className="w-full bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-sm text-white mb-4 outline-none focus:border-[#f7931a]"
                />
                <div className="flex gap-3 justify-end">
                  <button 
                    onClick={() => setShowAddWallet(false)}
                    className="px-4 py-2 text-sm text-[#8a8a8a] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (newWalletInput.trim()) {
                        addWallet(newWalletInput.trim());
                        setNewWalletInput("");
                        setShowAddWallet(false);
                      }
                    }}
                    className="px-4 py-2 bg-[#f7931a] text-black font-semibold rounded-lg text-sm hover:bg-[#ffb74d]"
                  >
                    Add Portfolio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen relative bg-[#060606] shadow-[-10px_0_40px_rgba(0,0,0,0.5)] z-0">
        
        {/* Subtle Background Elements */}
        <div className="absolute top-[10%] right-[20%] w-[600px] h-[400px] bg-[#f7931a] blur-[200px] opacity-[0.02] pointer-events-none rounded-full" />
        <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[300px] bg-red-500 blur-[200px] opacity-[0.015] pointer-events-none rounded-full" />

        {/* TOP COMMAND BAR */}
        <div className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-4 sm:px-8 bg-[#060606]/80 backdrop-blur-md z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#8a8a8a] hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#111] rounded-lg border border-[#1f1f1f] w-64 md:w-80 group focus-within:border-[#f7931a]/30 focus-within:ring-1 focus-within:ring-[#f7931a]/10 transition-all">
              <Search size={14} className="text-[#555] group-focus-within:text-[#f7931a] transition-colors" />
              <input 
                type="text" 
                placeholder="Search addresses, protocols, TXs..." 
                className="bg-transparent border-none outline-none text-xs text-white w-full placeholder-[#555]"
              />
              <div className="flex items-center gap-1 text-[10px] text-[#555] font-mono font-bold bg-[#1a1a1a] px-1.5 py-0.5 rounded">
                <span>Ctrl</span><span>K</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
             <div className="hidden sm:flex lg:flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              RPC Connected
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
              <ShieldAlert size={12} />
              SYSTEM RISK: HIGH
            </div>
            <button className="relative p-2 text-[#8a8a8a] hover:text-white hover:bg-[#111] rounded-lg transition-colors">
              <Bell size={18} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f7931a] border-2 border-[#060606]" />
            </button>
            <button className="p-2 text-[#8a8a8a] hover:text-white hover:bg-[#111] rounded-lg transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* SCROLLABLE MAIN */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-8 lg:p-10 pb-32">
          <div className="max-w-[1400px] mx-auto relative">
            {/* HEADER */}
            <header className="mb-10">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight">{activeNav?.id}</h1>
                <p className="text-[#8a8a8a] text-sm sm:text-base max-w-2xl leading-relaxed">
                  {activeNav?.id === "Overview" && "Real-time executive summary of cross-chain collateral and holistic liquidation risk metrics."}
                  {activeNav?.id === "Risk Engine" && "Deep-dive algorithmic risk assessment and scenario analysis."}
                  {activeNav?.id === "Exposure" && "Granular breakdown of asset dependencies and correlated vulnerabilities."}
                  {activeNav?.id === "Protocols" && "Institutional integrations and connected counterparty risks."}
                  {activeNav?.id === "Activity" && "Forensic transaction log and liquidation engine events."}
                </p>
              </motion.div>
            </header>

            {/* PAGE CONTENT */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isAnalyzing ? <AnalysisLoading /> : <Outlet />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </div>
  );
}
