import {
  createContext,
  useContext,
  useState,
} from "react";

import type { ReactNode } from "react";

// =====================================================
// TYPES
// =====================================================

export type RiskBreakdown = {
  concentration: number;
  leverage: number;
  liquidity: number;
  volatility: number;
};

export type LiquidationAnalysis = {
  probability: number;
  critical_asset: string;
  trigger_price: number;
};

export type ProtocolExposure = {
  protocol: string;
  type: string;
  risk_score: number;
  leverage: number;
  exposure_usd: number;
};

export type Asset = {
  symbol: string;
  name: string;
  balance: number;
  decimals: number;
  usd_value: number;
  allocation: number;
};

export type Position = {
  wallet: string;
  protocol: string;
  value: number;
  risk: string;
};

export type WalletBreakdown = {
  wallet: string;
  exposure: number;
  risk_score: number;
  health_factor: number;
};

export type AnalysisResponse = {
  wallet_count: number;

  risk_breakdown: RiskBreakdown;

  aggregate_risk_score: number;

  liquidation_analysis: LiquidationAnalysis;

  wallets: string[];

  assets: Asset[];
  protocol_exposure: ProtocolExposure[];

  risk_score: number;

  health_factor: number;

  total_exposure: number;

  alerts: string[];

  positions: Position[];

  wallet_breakdown: WalletBreakdown[];
};

interface WalletContextType {

  connected: boolean;

  wallets: string[];

  isAnalyzing: boolean;

  analysis: AnalysisResponse | null;

  backendError: string | null;

  connectWallet: () => Promise<void>;

  disconnectWallet: () => void;

  addWallet: (
    wallet: string
  ) => void;

  removeWallet: (
    wallet: string
  ) => void;
}

// =====================================================
// CONTEXT
// =====================================================

const WalletContext = createContext<
  WalletContextType | undefined
>(undefined);

// =====================================================
// PROVIDER
// =====================================================

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [connected, setConnected] =
    useState(false);

  const [wallets, setWallets] =
    useState<string[]>([]);

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [analysis, setAnalysis] =
    useState<AnalysisResponse | null>(
      null
    );

  const [backendError, setBackendError] =
    useState<string | null>(null);

  // =====================================================
  // FETCH ANALYSIS
  // =====================================================

  const fetchAnalysis = async (
    currentWallets: string[]
  ) => {

    if (
      currentWallets.length === 0
    ) {

      setAnalysis(null);

      setBackendError(null);

      return;
    }

    setIsAnalyzing(true);

    setBackendError(null);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            wallets:
              currentWallets,
          }),
        }
      );

      if (!response.ok) {

        throw new Error(
          `Backend error: ${response.status}`
        );
      }

      const data: AnalysisResponse =
        await response.json();

      setTimeout(() => {

        setAnalysis(data);

        setIsAnalyzing(false);

      }, 1800);

    } catch (err) {

      console.error(
        "Backend connection error:",
        err
      );

      setTimeout(() => {

        setBackendError(
          err instanceof Error
            ? err.message
            : "Unknown backend error"
        );

        setAnalysis(null);

        setIsAnalyzing(false);

      }, 1000);
    }
  };

  // =====================================================
  // CONNECT WALLET
  // =====================================================

  const connectWallet =
    async () => {

    try {

      const provider =
        (window as any).solana;

      if (
        !provider?.isPhantom
      ) {

        window.open(
          "https://phantom.app/",
          "_blank"
        );

        return;
      }

      const response =
        await provider.connect();

      const walletAddress =
        response.publicKey.toString();

      const connectedWallets = [
        walletAddress
      ];

      setConnected(true);

      setWallets(
        connectedWallets
      );

      fetchAnalysis(
        connectedWallets
      );

    } catch (err) {

      console.error(
        "Wallet connection failed:",
        err
      );
    }
  };

  // =====================================================
  // DISCONNECT
  // =====================================================

  const disconnectWallet =
    () => {

    setConnected(false);

    setWallets([]);

    setAnalysis(null);

    setBackendError(null);
  };

  // =====================================================
  // ADD WALLET
  // =====================================================

  const addWallet = (
    wallet: string
  ) => {

    if (
      !wallets.includes(wallet)
    ) {

      const updatedWallets = [
        ...wallets,
        wallet,
      ];

      setWallets(
        updatedWallets
      );

      fetchAnalysis(
        updatedWallets
      );
    }
  };

  // =====================================================
  // REMOVE WALLET
  // =====================================================

  const removeWallet = (
    wallet: string
  ) => {

    const updatedWallets =
      wallets.filter(
        (w) => w !== wallet
      );

    setWallets(
      updatedWallets
    );

    fetchAnalysis(
      updatedWallets
    );
  };

  // =====================================================
  // PROVIDER
  // =====================================================

  return (
    <WalletContext.Provider
      value={{
        connected,

        wallets,

        isAnalyzing,

        analysis,

        backendError,

        connectWallet,

        disconnectWallet,

        addWallet,

        removeWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useWallet() {

  const context =
    useContext(WalletContext);

  if (!context) {

    throw new Error(
      "useWallet must be used within WalletProvider"
    );
  }

  return context;
}