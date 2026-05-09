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
  X,
  Plus,
  Trash2,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { useWallet } from "../../contexts/WalletContext";
import { AnalysisLoading } from "../ui/AnalysisLoading";

const navItems = [
  {
    id: "Overview",
    path: "/overview",
    icon: Layers,
  },

  {
    id: "Risk Engine",
    path: "/risk-engine",
    icon: ShieldAlert,
  },

  {
    id: "Exposure",
    path: "/exposure",
    icon: Activity,
  },

  {
    id: "Protocols",
    path: "/protocols",
    icon: Hexagon,
  },

  {
    id: "Activity",
    path: "/activity",
    icon: Zap,
  },
];

export function DashboardLayout() {

  const {
    wallets,
    analysis,
    isAnalyzing,
    connectWallet,
    addWallet,
    removeWallet,
    disconnectWallet,
  } = useWallet();

  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [showAddWallet, setShowAddWallet] =
    useState(false);

  const [newWalletInput, setNewWalletInput] =
    useState("");

  const activeNav =
    navItems.find((item) =>
      location.pathname.includes(item.path)
    ) || navItems[0];

  const risk =
    analysis?.aggregate_risk_score ||
    analysis?.risk_score ||
    0;

  const riskLabel =
    risk >= 75
      ? "HIGH"
      : risk >= 45
      ? "MEDIUM"
      : "LOW";

  const riskStyles =
    risk >= 75
      ? "bg-red-500/10 border-red-500/20 text-red-500"
      : risk >= 45
      ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
      : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";

  return (

    <div className="h-screen bg-[#060606] text-white font-sans flex overflow-hidden selection:bg-[#f7931a]/30">

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              bg-black/80
              backdrop-blur-sm
              z-40
              md:hidden
            "
            onClick={() =>
              setMobileMenuOpen(false)
            }
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <div
        className={`
          fixed
          md:static
          inset-y-0
          left-0
          w-[260px]
          md:w-[280px]
          shrink-0
          border-r
          border-[#1a1a1a]
          bg-[#080808]/95
          backdrop-blur-xl
          p-5
          flex
          flex-col
          justify-between
          z-50
          transition-transform
          duration-300
          ease-[cubic-bezier(0.16,1,0.3,1)]

          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >

        <div>

          {/* LOGO */}
          <div className="flex items-center justify-between mb-10 pl-2">

            <Link
              to="/overview"
              className="flex items-center gap-3"
            >

              <div
                className="
                  w-4
                  h-4
                  rounded-[4px]
                  bg-gradient-to-br
                  from-[#f7931a]
                  to-[#d97706]
                "
              />

              <span className="text-2xl font-black tracking-tight">
                Guardian
              </span>

            </Link>

            <button
              onClick={() =>
                setMobileMenuOpen(false)
              }
              className="
                md:hidden
                text-[#8a8a8a]
              "
            >
              <X size={22} />
            </button>

          </div>

          {/* NAVIGATION */}
          <nav className="space-y-2">

            <p
              className="
                text-[#555]
                text-xs
                font-bold
                uppercase
                tracking-wider
                px-4
                mb-3
              "
            >
              Main Navigation
            </p>

            {navItems.map((item) => {

              const Icon = item.icon;

              const active =
                location.pathname.includes(
                  item.path
                );

              return (

                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    flex
                    items-center
                    gap-3
                    px-4
                    py-4
                    rounded-2xl
                    transition-all
                    duration-200
                    border

                    ${
                      active
                        ? `
                          bg-[#111]
                          border-[#f7931a]/30
                          text-white
                          shadow-[0_0_30px_rgba(247,147,26,0.08)]
                        `
                        : `
                          border-transparent
                          text-[#8a8a8a]
                          hover:bg-[#111]
                          hover:text-white
                        `
                    }
                  `}
                >

                  <Icon size={18} />

                  <span className="font-semibold">
                    {item.id}
                  </span>

                </Link>
              );
            })}
          </nav>
        </div>

        {/* WALLET SECTION */}
        <div>

          <div className="mb-4 flex items-center justify-between px-2">

            <p
              className="
                text-[#555]
                text-xs
                font-bold
                uppercase
                tracking-wider
              "
            >
              Portfolios ({wallets.length})
            </p>

            <button
              onClick={() =>
                setShowAddWallet(
                  !showAddWallet
                )
              }
              className="
                text-[#f7931a]
                text-sm
                font-bold
                hover:text-white
              "
            >
              + Add
            </button>

          </div>

          {/* ADD WALLET */}
          <AnimatePresence>
            {showAddWallet && (

              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}

                animate={{
                  opacity: 1,
                  height: "auto",
                }}

                exit={{
                  opacity: 0,
                  height: 0,
                }}

                className="
                  overflow-hidden
                  mb-3
                "
              >

                <div
                  className="
                    p-3
                    rounded-2xl
                    bg-[#111]
                    border
                    border-[#1f1f1f]
                    space-y-3
                  "
                >

                  <input
                    value={newWalletInput}
                    onChange={(e) =>
                      setNewWalletInput(
                        e.target.value
                      )
                    }
                    placeholder="Wallet Address"
                    className="
                      w-full
                      bg-[#0a0a0a]
                      border
                      border-[#1f1f1f]
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      outline-none
                    "
                  />

                  <button
                    onClick={() => {

                      if (
                        !newWalletInput.trim()
                      ) return;

                      addWallet(
                        newWalletInput
                      );

                      setNewWalletInput("");

                      setShowAddWallet(
                        false
                      );
                    }}

                    className="
                      w-full
                      py-3
                      rounded-xl
                      bg-[#f7931a]
                      text-black
                      font-bold
                    "
                  >
                    Add Wallet
                  </button>

                </div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* WALLET LIST */}
          <div className="space-y-2">

            {wallets.map(
              (wallet: string) => (

                <div
                  key={wallet}
                  className="
                    group
                    flex
                    items-center
                    justify-between
                    p-4
                    rounded-2xl
                    bg-[#0d0d0d]
                    border
                    border-[#1a1a1a]
                  "
                >

                  <div className="flex items-center gap-3">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-[#141414]
                        border
                        border-[#222]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Wallet
                        size={16}
                        className="
                          text-[#f7931a]
                        "
                      />
                    </div>

                    <div>

                      <p
                        className="
                          text-sm
                          font-bold
                          text-white
                        "
                      >
                        {wallet.slice(0, 4)}
                        ...
                        {wallet.slice(-4)}
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      removeWallet(wallet)
                    }
                    className="
                      opacity-0
                      group-hover:opacity-100
                      transition-opacity
                      text-[#666]
                      hover:text-red-500
                    "
                  >
                    <Trash2 size={15} />
                  </button>

                </div>
              )
            )}

          </div>

          {/* CONNECT */}
          <button
            onClick={connectWallet}
            className="
              mt-4
              w-full
              flex
              items-center
              justify-center
              gap-2
              py-4
              rounded-2xl
              bg-[#f7931a]
              text-black
              font-bold
              hover:scale-[1.01]
              transition-transform
            "
          >

            <Plus size={16} />

            Connect Phantom

          </button>

          {/* DISCONNECT */}
          <button
            onClick={disconnectWallet}
            className="
              mt-3
              w-full
              py-3
              rounded-2xl
              border
              border-[#1f1f1f]
              bg-[#0a0a0a]
              text-[#8a8a8a]
              hover:text-white
              transition-colors
            "
          >
            Disconnect
          </button>

        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOPBAR */}
        <div
          className="
            h-[72px]
            border-b
            border-[#1a1a1a]
            px-4
            sm:px-8
            flex
            items-center
            justify-between
            shrink-0
          "
        >

          {/* LEFT */}
          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="
                md:hidden
                text-[#8a8a8a]
              "
            >
              <Menu size={22} />
            </button>

            <div
              className="
                hidden
                lg:flex
                items-center
                gap-3
                bg-[#0d0d0d]
                border
                border-[#1a1a1a]
                rounded-2xl
                px-4
                py-3
                w-[340px]
              "
            >

              <Search
                size={16}
                className="text-[#666]"
              />

              <input
                placeholder="
                  Search addresses,
                  protocols,
                  TXs...
                "
                className="
                  bg-transparent
                  outline-none
                  text-sm
                  flex-1
                  placeholder:text-[#555]
                "
              />

              <div
                className="
                  text-[10px]
                  font-bold
                  text-[#555]
                  border
                  border-[#222]
                  rounded-md
                  px-2
                  py-1
                "
              >
                Ctrl K
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* RPC */}
            <div
              className="
                hidden
                md:flex
                items-center
                gap-2
                px-3
                py-1
                rounded-full
                bg-emerald-500/10
                border
                border-emerald-500/20
                text-emerald-400
                text-xs
                font-bold
              "
            >

              <div
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-emerald-400
                  animate-pulse
                "
              />

              RPC Connected

            </div>

            {/* RISK */}
            <div
              className={`
                hidden
                md:flex
                items-center
                gap-2
                px-3
                py-1
                rounded-full
                border
                text-xs
                font-bold
                ${riskStyles}
              `}
            >

              <ShieldAlert size={12} />

              SYSTEM RISK:
              {" "}
              {riskLabel}

            </div>

            {/* NOTIFICATIONS */}
            <button
              onClick={() => {

                alert(
                  analysis?.alerts?.length
                    ? analysis.alerts.join(
                        "\n\n"
                      )
                    : "No active notifications."
                );
              }}

              className="
                relative
                p-2
                text-[#8a8a8a]
                hover:text-white
                hover:bg-[#111]
                rounded-lg
                transition-colors
              "
            >

              <Bell size={18} />

              {(analysis?.alerts?.length ?? 0) > 0 && (
                <div
                  className="
                    absolute
                    top-1.5
                    right-1.5
                    w-2
                    h-2
                    rounded-full
                    bg-[#f7931a]
                    border-2
                    border-[#060606]
                  "
                />
              )}

            </button>

            {/* SETTINGS */}
            <button
              onClick={() => {

                alert(
                  `
Guardian Settings

Connected Wallets:
${wallets.length}

RPC Status:
Connected
                  `
                );
              }}

              className="
                p-2
                text-[#8a8a8a]
                hover:text-white
                hover:bg-[#111]
                rounded-lg
                transition-colors
              "
            >

              <Settings size={18} />

            </button>

          </div>

        </div>

        {/* CONTENT */}
        <div
          className="
            flex-1
            overflow-y-auto
            overflow-x-hidden
            p-4
            sm:p-8
            lg:p-10
            pb-32
          "
        >

          <div className="max-w-[1400px] mx-auto relative">

            {/* HEADER */}
            <header className="mb-10">

              <motion.div
                initial={{
                  opacity: 0,
                  x: -10,
                }}

                animate={{
                  opacity: 1,
                  x: 0,
                }}
              >

                <h1
                  className="
                    text-3xl
                    sm:text-4xl
                    font-black
                    mb-2
                    tracking-tight
                  "
                >
                  {activeNav?.id}
                </h1>

                <p
                  className="
                    text-[#8a8a8a]
                    text-sm
                    sm:text-base
                    max-w-2xl
                    leading-relaxed
                  "
                >

                  {activeNav?.id ===
                    "Overview" &&
                    "Real-time executive summary of cross-chain collateral and holistic liquidation risk metrics."}

                  {activeNav?.id ===
                    "Risk Engine" &&
                    "Deep-dive algorithmic risk assessment and scenario analysis."}

                  {activeNav?.id ===
                    "Exposure" &&
                    "Granular breakdown of asset dependencies and correlated vulnerabilities."}

                  {activeNav?.id ===
                    "Protocols" &&
                    "Institutional integrations and connected counterparty risks."}

                  {activeNav?.id ===
                    "Activity" &&
                    "Forensic transaction log and liquidation engine events."}

                </p>

              </motion.div>

            </header>

            {/* PAGE */}
            <AnimatePresence mode="wait">

              <motion.div
                key={location.pathname}

                initial={{
                  opacity: 0,
                  y: 10,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                exit={{
                  opacity: 0,
                  y: -10,
                }}

                transition={{
                  duration: 0.2,
                }}
              >

                {isAnalyzing
                  ? <AnalysisLoading />
                  : <Outlet />}

              </motion.div>

            </AnimatePresence>

          </div>

        </div>

      </div>

    </div>
  );
}