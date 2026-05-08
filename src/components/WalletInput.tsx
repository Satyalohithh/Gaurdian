import { useState } from "react";

type WalletInputProps = {
  wallet: string;
  setWallet: (val: string) => void;
  analyze: () => Promise<void>;
};

export default function WalletInput({
  wallet,
  setWallet,
  analyze,
}: WalletInputProps) {
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!wallet) return;

    setLoading(true);
    await analyze();
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <input
        value={wallet}
        onChange={(e) => setWallet(e.target.value)}
        placeholder="Enter wallet address"
        style={{
          background: "#111",
          border: "1px solid #222",
          padding: "10px",
          borderRadius: "10px",
          color: "white",
          width: "260px",
          outline: "none",
        }}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading}
        style={{
          background: loading ? "#444" : "#fff",
          color: "#000",
          padding: "10px 18px",
          borderRadius: "10px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
          transition: "0.2s",
        }}
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </div>
  );
}