import { useEffect, useState } from "react";

type AnalysisResponse = {
  wallet: string;
  risk_score: number;
  health_factor?: number;
  total_exposure: number;
  alerts: string[];
  positions: {
    protocol: string;
    value: number;
    risk: string;
  }[];
};

export default function Dashboard() {
  const [connected, setConnected] =
    useState(false);

  const [wallet, setWallet] =
    useState("");

  const [mounted, setMounted] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("Overview");

  const [analysis, setAnalysis] =
    useState<AnalysisResponse | null>(
      null
    );

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 100);
  }, []);

  // ==========================================
  // CONNECT WALLET
  // ==========================================

  const connectWallet = async () => {
    try {
      const provider = (window as any)
        .solana;

      if (!provider?.isPhantom) {
        window.open(
          "https://phantom.app",
          "_blank"
        );

        return;
      }

      setLoading(true);

      const response =
        await provider.connect();

      const walletAddress =
        response.publicKey.toString();

      setWallet(walletAddress);

      setConnected(true);

      const res = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            wallet: walletAddress,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      setAnalysis(data);

      setLoading(false);
    } catch (err) {
      console.error(err);

      setLoading(false);
    }
  };

  // ==========================================
  // LANDING PAGE
  // ==========================================

  if (!connected) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#050505",
          overflow: "hidden",
          position: "relative",
          color: "white",
          fontFamily:
            "Inter, sans-serif",
        }}
      >
        {/* GRID */}
        <div
          style={{
            position: "absolute",
            inset: 0,

            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,

            backgroundSize:
              "60px 60px",
          }}
        />

        {/* GLOW */}
        <div
          style={{
            position: "absolute",

            width: "1200px",
            height: "1200px",

            right: "-300px",
            top: "-400px",

            background:
              "radial-gradient(circle, rgba(247,147,26,0.18), transparent 70%)",

            filter: "blur(140px)",
          }}
        />

        {/* STRIP */}
        <div
          style={{
            position: "absolute",
            top: "28px",

            width: "100%",

            overflow: "hidden",

            whiteSpace: "nowrap",

            opacity: 0.2,
          }}
        >
          <div
            style={{
              display: "inline-flex",

              gap: "40px",

              minWidth: "200%",

              animation:
                "marquee 24s linear infinite",

              color: "#f7931a",

              fontSize: "11px",

              letterSpacing: "2px",

              fontWeight: 700,
            }}
          >
            {Array(10)
              .fill(
                "SOLANA • DEFI • RISK • LIQUIDATION • LEVERAGE • ONCHAIN • TVL • APY •"
              )
              .map((x, i) => (
                <span key={i}>{x}</span>
              ))}
          </div>
        </div>

        {/* MAIN */}
        <div
          style={{
            position: "relative",
            zIndex: 2,

            display: "flex",

            alignItems: "center",

            justifyContent:
              "space-between",

            minHeight: "100vh",

            padding: "0 90px",
          }}
        >
          {/* LEFT */}
          <div style={{ width: "52%" }}>
            <h1
              style={{
                fontSize: "110px",

                lineHeight: 0.9,

                letterSpacing: "-6px",

                marginBottom: "30px",

                fontWeight: 900,

                background:
                  "linear-gradient(180deg,#ffffff 0%,#d0d0d0 50%,#6b6b6b 100%)",

                WebkitBackgroundClip:
                  "text",

                WebkitTextFillColor:
                  "transparent",

                opacity: mounted
                  ? 1
                  : 0,

                transform: mounted
                  ? "translateY(0)"
                  : "translateY(30px)",

                transition:
                  "all 1s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              Securing
              <br />
              Solana’s
              <br />
              next $100B
            </h1>

            <p
              style={{
                fontSize: "28px",

                color: "#8f8f8f",

                lineHeight: 1.4,

                maxWidth: "680px",

                marginBottom: "42px",
              }}
            >
              Institutional-grade
              liquidation intelligence
              for Solana DeFi.
            </p>

            <button
              onClick={connectWallet}
              disabled={loading}
              style={{
                height: "64px",

                padding: "0 42px",

                borderRadius: "16px",

                border: "none",

                background: "#f7931a",

                color: "#000",

                fontSize: "18px",

                fontWeight: 800,

                cursor: "pointer",

                boxShadow:
                  "0 0 60px rgba(247,147,26,0.3)",
              }}
            >
              {loading
                ? "Analyzing..."
                : "Connect Phantom"}
            </button>
          </div>

          {/* RIGHT */}
          <div
            style={{
              width: "520px",

              borderRadius: "30px",

              padding: "28px",

              background:
                "linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.03))",

              border:
                "1px solid rgba(255,255,255,0.08)",

              backdropFilter:
                "blur(20px)",
            }}
          >
            <div
              style={{
                fontSize: "12px",

                letterSpacing: "1px",

                fontWeight: 700,

                color: "#f7931a",

                marginBottom: "20px",
              }}
            >
              LIVE PREVIEW
            </div>

            <h2
              style={{
                fontSize: "48px",
                fontWeight: 800,
                marginBottom: "20px",
              }}
            >
              $24,847
            </h2>

            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {[
                "SOL-PERP nearing liquidation",
                "Leverage exceeds threshold",
                "Exposure concentrated in volatile assets",
              ].map((a, i) => (
                <div
                  key={i}
                  style={{
                    padding: "16px",

                    borderRadius:
                      "16px",

                    background:
                      "rgba(255,255,255,0.03)",

                    border:
                      "1px solid rgba(255,255,255,0.05)",

                    color: "#cfcfcf",
                  }}
                >
                  ⚠ {a}
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes marquee {
              0% {
                transform: translateX(0%);
              }

              100% {
                transform: translateX(-50%);
              }
            }
          `}
        </style>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        display: "flex",
        fontFamily:
          "Inter, sans-serif",
      }}
    >
      {/* SIDEBAR */}
      <div
        style={{
          width: "260px",

          borderRight:
            "1px solid rgba(255,255,255,0.06)",

          background:
            "rgba(255,255,255,0.02)",

          padding: "32px 24px",

          display: "flex",

          flexDirection: "column",

          justifyContent:
            "space-between",
        }}
      >
        <div>
          {/* LOGO */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "60px",
            }}
          >
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: "#f7931a",
              }}
            />

            <h1
              style={{
                fontSize: "24px",
                fontWeight: 800,
              }}
            >
              Guardian
            </h1>
          </div>

          {/* NAV */}
          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {[
              "Overview",
              "Risk Engine",
              "Exposure",
              "Protocols",
              "Activity",
            ].map((item) => (
              <div
                key={item}

                onClick={() =>
                  setActiveTab(item)
                }

                style={{
                  padding:
                    "14px 18px",

                  borderRadius:
                    "14px",

                  background:
                    activeTab === item
                      ? "rgba(247,147,26,0.12)"
                      : "transparent",

                  border:
                    activeTab === item
                      ? "1px solid rgba(247,147,26,0.22)"
                      : "1px solid transparent",

                  color:
                    activeTab === item
                      ? "#f7931a"
                      : "#9a9a9a",

                  fontWeight: 600,

                  cursor: "pointer",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* WALLET */}
        <div
          style={{
            padding: "18px",

            borderRadius: "18px",

            background:
              "rgba(255,255,255,0.03)",

            border:
              "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <p
            style={{
              color: "#8a8a8a",

              fontSize: "12px",

              marginBottom: "8px",
            }}
          >
            CONNECTED WALLET
          </p>

          <p
            style={{
              fontSize: "14px",

              fontWeight: 600,

              wordBreak: "break-all",
            }}
          >
            {wallet}
          </p>
        </div>
      </div>

      {/* MAIN */}
      <div
        style={{
          flex: 1,
          padding: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 900,
            marginBottom: "10px",
          }}
        >
          {activeTab}
        </h1>

        <p
          style={{
            color: "#8a8a8a",
            marginBottom: "40px",
          }}
        >
          Real-time liquidation
          intelligence.
        </p>

        {/* HERO */}
        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "1.4fr 1fr",

            gap: "24px",

            marginBottom: "24px",
          }}
        >
          {/* BIG CARD */}
          <div
            style={{
              borderRadius: "30px",

              padding: "36px",

              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",

              border:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                color: "#8a8a8a",
                marginBottom: "16px",
              }}
            >
              Total Exposure
            </p>

            <h2
              style={{
                fontSize: "72px",

                fontWeight: 900,

                marginBottom: "18px",
              }}
            >
              $
              {analysis?.total_exposure ??
                "24,847"}
            </h2>

            <div
              style={{
                display: "inline-flex",

                padding: "10px 18px",

                borderRadius: "999px",

                background:
                  "rgba(247,147,26,0.12)",

                color: "#f7931a",

                fontWeight: 700,
              }}
            >
              HIGH RISK
            </div>
          </div>

          {/* SCORE */}
          <div
            style={{
              borderRadius: "30px",

              padding: "36px",

              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",

              border:
                "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p
              style={{
                color: "#8a8a8a",

                marginBottom: "16px",
              }}
            >
              Risk Score
            </p>

            <h2
              style={{
                fontSize: "84px",

                fontWeight: 900,

                color: "#f7931a",
              }}
            >
              {analysis?.risk_score ??
                "72"}
            </h2>
          </div>
        </div>

        {/* ALERTS */}
        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          {(analysis?.alerts || []).map(
            (a, i) => (
              <div
                key={i}
                style={{
                  padding: "24px",

                  borderRadius: "20px",

                  background:
                    "rgba(255,255,255,0.03)",

                  border:
                    "1px solid rgba(255,255,255,0.06)",

                  color: "#d0d0d0",

                  fontSize: "16px",
                }}
              >
                ⚠ {a}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}