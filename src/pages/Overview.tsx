import { motion } from "framer-motion";

import { useWallet } from "../contexts/WalletContext";

import {
  ShieldAlert,
  Info,
  TrendingUp,
  Zap,
  Hexagon,
  PieChart,
  Activity,
} from "lucide-react";

export default function Overview() {
  const {
    analysis,
    backendError,
    wallets,
  } = useWallet();

  // =====================================================
  // BACKEND OFFLINE
  // =====================================================

  if (backendError) {
    return (
      <div className="flex flex-col items-center justify-center p-20 border border-red-500/20 bg-red-500/10 rounded-3xl mt-12">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />

        <h2 className="text-2xl font-bold text-white mb-2">
          Backend Offline
        </h2>

        <p className="text-[#8a8a8a] text-center max-w-md">
          Cannot sync analytics
          matrix. Please verify
          local Python agent is
          actively running on port
          8000.
        </p>
      </div>
    );
  }

  // =====================================================
  // NO WALLETS
  // =====================================================

  if (wallets.length === 0) {
    return (
      <div className="p-12 border border-[#1a1a1a] bg-[#111]/30 rounded-3xl flex flex-col items-center justify-center text-center mt-12">
        <Activity className="w-12 h-12 text-[#555] mb-4" />

        <h3 className="text-xl font-bold text-white mb-2">
          Awaiting Portfolio Data
        </h3>

        <p className="text-[#8a8a8a] max-w-sm">
          Connect a wallet via the
          sidebar to initiate
          portfolio aggregation
          scans.
        </p>
      </div>
    );
  }

  // =====================================================
  // NO ANALYSIS
  // =====================================================

  if (!analysis) {
    return (
      <div className="p-12 border border-[#1a1a1a] bg-[#111]/30 rounded-3xl flex flex-col items-center justify-center text-center mt-12">
        <ShieldAlert className="w-12 h-12 text-[#555] mb-4" />

        <h3 className="text-xl font-bold text-white mb-2">
          Awaiting Analysis
        </h3>

        <p className="text-[#8a8a8a] max-w-sm">
          Guardian AI is preparing
          institutional portfolio
          metrics.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
      }}
      className="space-y-6"
    >
      {/* ===================================================== */}
      {/* TOP CARDS */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* PORTFOLIO EXPOSURE */}

        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden group hover:border-[#f7931a]/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <PieChart
              size={64}
              className="text-[#f7931a] -rotate-12 transform"
            />
          </div>

          <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">
            Portfolio Exposure
          </p>

          <h2 className="text-4xl font-black text-white mb-1 tracking-tight">
            $
            {analysis.total_exposure.toLocaleString(
              undefined,
              {
                maximumFractionDigits:
                  0,
              }
            )}
          </h2>

          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
            <span className="flex items-center gap-1 text-green-400 bg-green-500/10 px-2 py-0.5 rounded text-xs border border-green-500/20">
              <TrendingUp size={12} />
              +2.4%
            </span>

            <span className="text-[#555] text-xs">
              24h aggregate
            </span>
          </div>
        </div>

        {/* WALLET COUNT */}

        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden group hover:border-[#f7931a]/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hexagon
              size={64}
              className="text-[#f7931a] rotate-12 transform"
            />
          </div>

          <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">
            Wallet Count
          </p>

          <h2 className="text-4xl font-black text-white mb-1 tracking-tight">
            {wallets.length}
          </h2>

          <div className="flex items-center gap-2 mt-4 text-sm font-medium">
            <span className="flex items-center gap-1 text-[#8a8a8a] bg-[#1a1a1a] px-2 py-0.5 rounded text-xs border border-[#2a2a2a]">
              Tracking active nodes
            </span>
          </div>
        </div>

        {/* AGGREGATE RISK */}

        <div className="p-6 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] relative overflow-hidden group hover:border-red-500/30 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldAlert
              size={64}
              className="text-red-500 -rotate-12 transform"
            />
          </div>

          <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">
            Aggregate Risk
          </p>

          <div className="flex items-end gap-3 mb-1">
            <h2 className="text-4xl font-black text-red-500 tracking-tight">
              {
                analysis.risk_score
              }
              /100
            </h2>
          </div>

          <div className="w-full bg-[#111] h-1.5 rounded-full mt-4 overflow-hidden border border-[#2a2a2a]">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-red-500"
              style={{
                width: `${analysis.risk_score}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* LOWER GRID */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* POSITIONS */}

        <div className="p-6 rounded-2xl bg-[#0a0a0a]/50 border border-[#1a1a1a]">
          <h3 className="text-[#8a8a8a] text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <Zap
              size={16}
              className="text-[#f7931a]"
            />

            Concentrated Positions
          </h3>

          <div className="space-y-3">
            {analysis.positions &&
            analysis.positions.length >
              0 ? (
              analysis.positions
                .slice(0, 4)
                .map(
                  (
                    pos,
                    idx
                  ) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl bg-[#111] border border-[#1f1f1f] hover:border-[#2a2a2a] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center font-bold text-[#f7931a] text-xs border border-[#2a2a2a]">
                          {pos.protocol.substring(
                            0,
                            3
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white">
                            {
                              pos.protocol
                            }
                          </p>

                          <p className="text-xs text-[#555]">
                            Wallet{" "}
                            {pos.wallet.slice(
                              0,
                              4
                            )}
                            ...
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-bold text-white">
                          $
                          {pos.value.toLocaleString()}
                        </p>

                        <p
                          className={`text-xs ${
                            pos.risk ===
                            "High"
                              ? "text-red-400"
                              : pos.risk ===
                                "Medium"
                              ? "text-orange-400"
                              : "text-green-400"
                          }`}
                        >
                          Risk:{" "}
                          {
                            pos.risk
                          }
                        </p>
                      </div>
                    </div>
                  )
                )
            ) : (
              <div className="text-center py-8 text-[#555] text-sm">
                No positions detected
                in current snapshot.
              </div>
            )}
          </div>
        </div>

        {/* ALERTS */}

        <div className="p-6 rounded-2xl bg-[#0a0a0a]/50 border border-[#1a1a1a]">
          <h3 className="text-[#8a8a8a] text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2">
            <Info
              size={16}
              className="text-red-500"
            />

            Active Warnings
          </h3>

          <div className="space-y-3">
            {analysis.alerts &&
            analysis.alerts.length >
              0 ? (
              analysis.alerts.map(
                (
                  warn,
                  idx
                ) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex items-start gap-3"
                  >
                    <div className="mt-0.5">
                      <ShieldAlert
                        size={14}
                        className="text-red-500"
                      />
                    </div>

                    <p className="text-sm text-red-200/90 leading-relaxed font-medium">
                      {warn}
                    </p>
                  </div>
                )
              )
            ) : (
              <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10 flex items-center gap-3">
                <Activity
                  size={14}
                  className="text-green-500"
                />

                <p className="text-sm text-green-400/90">
                  System nominally
                  stable. Zero
                  critical alerts.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}