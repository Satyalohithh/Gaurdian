import { motion, AnimatePresence } from "framer-motion";

import {
  Hexagon,
  ExternalLink,
  ShieldCheck,
  Cpu,
} from "lucide-react";

import { useWallet } from "../contexts/WalletContext";

export default function Protocols() {
  const { analysis } = useWallet();

  const rawProtocols =
    analysis?.protocol_exposure || [];

  // =====================================================
  // KNOWN SOLANA PROTOCOLS
  // =====================================================

  const knownProtocols = [
    {
      name: "Kamino",
      type: "Lending / Vaults",
    },

    {
      name: "Drift",
      type: "Perpetuals",
    },

    {
      name: "Jupiter",
      type: "Aggregator / Perps",
    },

    {
      name: "MarginFi",
      type: "Lending",
    },

    {
      name: "Raydium",
      type: "DEX / AMM",
    },

    {
      name: "Tensor",
      type: "NFT-Fi",
    },

    {
      name: "Meteora",
      type: "Liquidity",
    },
  ];

  // =====================================================
  // BUILD INTEGRATIONS
  // =====================================================

  const integrations =
    knownProtocols.map((kp) => {
      const realData =
        rawProtocols.find(
          (rp) =>
            rp.protocol.toLowerCase() ===
            kp.name.toLowerCase()
        );

      if (realData) {
        return {
          name: realData.protocol,

          type:
            realData.type || kp.type,

          tvl: `$${Number(
            realData.exposure_usd || 0
          ).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`,

          risk:
            realData.risk_score > 70
              ? "High"
              : realData.risk_score > 40
              ? "Medium"
              : "Low",

          active: true,
        };
      }

      return {
        ...kp,

        tvl: "$0",

        risk: "Offline",

        active: false,
      };
    });

  // =====================================================
  // ADD UNKNOWN PROTOCOLS
  // =====================================================

  rawProtocols.forEach((rp) => {
    if (
      !knownProtocols.find(
        (kp) =>
          kp.name.toLowerCase() ===
          rp.protocol.toLowerCase()
      )
    ) {
      integrations.push({
        name: rp.protocol,

        type: rp.type || "Unknown",

        tvl: `$${Number(
          rp.exposure_usd || 0
        ).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`,

        risk:
          rp.risk_score > 70
            ? "High"
            : rp.risk_score > 40
            ? "Medium"
            : "Low",

        active: true,
      });
    }
  });

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
      }}
      className="flex flex-col gap-8"
    >
      {/* ===================================================== */}
      {/* GRID */}
      {/* ===================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <AnimatePresence>

          {integrations.map(
            (protocol, i) => (
              <motion.div
                key={protocol.name}
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: i * 0.05,
                }}
                whileHover={{
                  y: -4,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className={`
                  rounded-[28px]
                  p-6
                  lg:p-8
                  flex
                  flex-col
                  ${
                    protocol.active
                      ? `
                        bg-gradient-to-b
                        from-[#111]
                        to-[#0a0a0a]
                        border
                        border-[#f7931a]/20
                        shadow-[0_0_30px_rgba(247,147,26,0.05)]
                      `
                      : `
                        bg-white/[0.02]
                        border
                        border-white/[0.03]
                        opacity-60
                      `
                  }
                `}
              >
                {/* ===================================================== */}
                {/* HEADER */}
                {/* ===================================================== */}

                <div className="flex items-start justify-between mb-8">

                  <div className="flex items-center gap-3">

                    <div
                      className={`
                        w-10
                        h-10
                        rounded-xl
                        flex
                        items-center
                        justify-center
                        ${
                          protocol.active
                            ? `
                              bg-[#f7931a]/10
                              text-[#f7931a]
                            `
                            : `
                              bg-white/5
                              text-white/50
                            `
                        }
                      `}
                    >
                      <Hexagon size={20} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white leading-none mb-1">
                        {protocol.name}
                      </h3>

                      <p className="text-xs font-semibold text-[#8a8a8a]">
                        {protocol.type}
                      </p>
                    </div>
                  </div>

                  <button className="text-[#555] hover:text-white transition-colors">
                    <ExternalLink size={18} />
                  </button>
                </div>

                {/* ===================================================== */}
                {/* METRICS */}
                {/* ===================================================== */}

                <div className="mt-auto space-y-4">

                  {/* EXPOSURE */}

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-[#8a8a8a]">
                      Exposure (USD)
                    </span>

                    <span className="text-white font-mono font-bold">
                      {protocol.tvl}
                    </span>
                  </div>

                  {/* RISK */}

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-[#8a8a8a]">
                      System Risk Profile
                    </span>

                    <span
                      className={`
                        font-bold
                        px-2
                        py-0.5
                        rounded-full
                        text-xs
                        ${
                          protocol.risk ===
                          "High"
                            ? `
                              bg-red-500/10
                              text-red-400
                            `
                            : protocol.risk ===
                              "Medium"
                            ? `
                              bg-yellow-500/10
                              text-yellow-400
                            `
                            : protocol.risk ===
                              "Low"
                            ? `
                              bg-emerald-500/10
                              text-emerald-400
                            `
                            : `
                              bg-white/5
                              text-[#777]
                            `
                        }
                      `}
                    >
                      {protocol.risk}
                    </span>
                  </div>

                  {/* STATUS */}

                  <div className="pt-5 border-t border-white/[0.05] flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      {protocol.active ? (
                        <>
                          <ShieldCheck
                            size={15}
                            className="text-emerald-400"
                          />

                          <span className="text-xs font-semibold text-emerald-400">
                            ACTIVE
                          </span>
                        </>
                      ) : (
                        <>
                          <Cpu
                            size={15}
                            className="text-[#666]"
                          />

                          <span className="text-xs font-semibold text-[#666]">
                            OFFLINE
                          </span>
                        </>
                      )}
                    </div>

                    <span className="text-[10px] tracking-widest text-[#555] font-bold">
                      LIVE MONITORING
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}