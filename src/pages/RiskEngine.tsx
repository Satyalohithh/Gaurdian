import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "../contexts/WalletContext";

import {
  ShieldAlert,
  Layers,
  Activity,
  GitBranch,
  Shield,
  Zap,
} from "lucide-react";

export default function RiskEngine() {
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
          Backend Connection Failed
        </h2>

        <p className="text-[#8a8a8a] text-center max-w-md">
          FastAPI runtime unreachable.
          Cannot construct correlation
          matrix or cross-wallet
          dependency graphs.
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
          No Wallets Provided
        </h3>

        <p className="text-[#8a8a8a] max-w-sm">
          Please bind at least one
          target in the sidebar to run
          the simulation protocols.
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
        <Shield className="w-12 h-12 text-[#555] mb-4" />

        <h3 className="text-xl font-bold text-white mb-2">
          Awaiting Analysis
        </h3>

        <p className="text-[#8a8a8a] max-w-sm">
          Guardian AI is waiting for
          portfolio analysis data.
        </p>
      </div>
    );
  }

  // =====================================================
  // HIGH RISK POSITIONS
  // =====================================================

  const highRiskPositions =
    analysis.positions?.filter(
      (p) => p.risk === "High"
    ) || [];

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
      {/* TOP GRID */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* CORRELATION PANEL */}

        <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a] flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-[-50%] right-[-10%] w-[300px] h-[300px] bg-[#f7931a] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[#8a8a8a] text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                <GitBranch
                  size={16}
                  className="text-[#f7931a]"
                />

                Cross-Wallet Correlation
                Vector
              </h3>

              <p className="text-white text-3xl font-black">
                $
                {analysis.total_exposure.toLocaleString()}
                {" "}
                Aggregate TVL
              </p>
            </div>

            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111] border border-[#2a2a2a] text-[#8a8a8a] text-xs font-mono font-bold">
                wallets:
                <span className="text-white">
                  {wallets.length}
                </span>
              </div>
            </div>
          </div>

          {/* METRICS */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-[#111] rounded-2xl border border-[#1f1f1f]">
              <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">
                Global Score
              </p>

              <p
                className={`text-2xl font-black ${
                  analysis.risk_score > 70
                    ? "text-red-500"
                    : analysis.risk_score >
                      40
                    ? "text-[#f7931a]"
                    : "text-green-500"
                }`}
              >
                {analysis.risk_score}
              </p>
            </div>

            <div className="p-4 bg-[#111] rounded-2xl border border-[#1f1f1f]">
              <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">
                Concentration
              </p>

              <p className="text-2xl font-black text-white">
                {
                  highRiskPositions.length
                }{" "}
                Assets
              </p>
            </div>

            <div className="p-4 bg-[#111] rounded-2xl border border-[#1f1f1f]">
              <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">
                Protocols
              </p>

              <p className="text-2xl font-black text-white">
                {
                  new Set(
                    analysis.positions.map(
                      (p) => p.protocol
                    )
                  ).size
                }{" "}
                Active
              </p>
            </div>

            <div className="p-4 bg-[#111] rounded-2xl border border-[#1f1f1f]">
              <p className="text-[#555] text-xs font-bold uppercase tracking-wider mb-2">
                Health
              </p>

              <p className="text-2xl font-black text-[#8a8a8a]">
                {
                  analysis.health_factor
                }
              </p>
            </div>
          </div>
        </div>

        {/* AI INFERENCE */}

        <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#1a1a1a] relative group">
          <Zap className="absolute top-6 right-6 text-[#1f1f1f] group-hover:text-[#f7931a]/20 transition-colors w-24 h-24" />

          <h3 className="text-[#8a8a8a] text-xs font-bold uppercase tracking-widest mb-6 border-b border-[#1f1f1f] pb-4">
            AI Inference
          </h3>

          <div className="space-y-4 text-sm text-[#8a8a8a] leading-relaxed relative z-10">
            <p>
              <strong className="text-white">
                Analysis generated for{" "}
                {wallets.length} localized
                wallet profiles.
              </strong>

              {" "}
              Aggregate portfolio risk
              currently evaluates at{" "}

              <strong
                className={
                  analysis.risk_score >
                  70
                    ? "text-red-500"
                    : "text-[#f7931a]"
                }
              >
                {
                  analysis.risk_score
                }
                /100
              </strong>
            </p>

            <p>
              Guardian AI detects
              protocol-level correlation
              exposure and systemic
              leverage dependencies
              across connected wallet
              infrastructure.
            </p>

            {analysis.alerts &&
              analysis.alerts.length >
                0 && (
                <div className="mt-4 p-3 bg-red-500/10 border-l-2 border-red-500 text-red-400 rounded-r-lg">
                  Detected{" "}
                  {
                    analysis.alerts
                      .length
                  }{" "}
                  systemic risk vectors.
                </div>
              )}
          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* POSITION TABLE */}
      {/* ===================================================== */}

      <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-[#1a1a1a]">
        <h3 className="text-white text-lg font-bold mb-6 flex items-center gap-3">
          <Shield className="text-[#f7931a] w-5 h-5" />

          Protocol Concentration
          Warnings
        </h3>

        {analysis.positions &&
        analysis.positions.length >
          0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1f1f1f]">
                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[#555]">
                    Wallet
                  </th>

                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[#555]">
                    Protocol
                  </th>

                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[#555] text-right">
                    Exposure
                  </th>

                  <th className="pb-3 text-xs font-bold uppercase tracking-wider text-[#555] text-right">
                    Risk
                  </th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence>
                  {analysis.positions.map(
                    (
                      pos,
                      idx
                    ) => (
                      <motion.tr
                        key={idx}
                        initial={{
                          opacity: 0,
                          x: -10,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            idx *
                            0.05,
                        }}
                        className="border-b border-[#111] hover:bg-[#111]/50 transition-colors group"
                      >
                        <td className="py-4 text-sm text-white font-mono">
                          {pos.wallet.slice(
                            0,
                            6
                          )}
                          ...
                        </td>

                        <td className="py-4 text-white font-semibold">
                          {
                            pos.protocol
                          }
                        </td>

                        <td className="py-4 text-right text-white font-mono">
                          $
                          {pos.value.toLocaleString()}
                        </td>

                        <td className="py-4 text-right">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              pos.risk ===
                              "High"
                                ? "bg-red-500/10 text-red-500 border border-red-500/20"
                                : pos.risk ===
                                  "Medium"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                                : "bg-green-500/10 text-green-500 border border-green-500/20"
                            }`}
                          >
                            {
                              pos.risk
                            }
                          </span>
                        </td>
                      </motion.tr>
                    )
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 bg-[#111]/30 rounded-xl border border-[#1f1f1f] border-dashed">
            <Layers className="w-8 h-8 text-[#555] mx-auto mb-3" />

            <p className="text-[#8a8a8a] text-sm">
              No protocol
              concentration detected.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}