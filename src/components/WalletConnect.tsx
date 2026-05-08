type WalletConnectProps = {
  onConnect: (address: string) => void;
};

export default function WalletConnect({ onConnect }: WalletConnectProps) {
  const connectWallet = async () => {
    try {
      // 🟣 Phantom (Solana)
      if ("solana" in window) {
        const provider: any = (window as any).solana;
        const resp = await provider.connect();
        onConnect(resp.publicKey.toString());
      } else {
        alert("Phantom wallet not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={connectWallet}
      style={{
        background: "#000",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: "10px",
        border: "1px solid #222",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      Connect Wallet
    </button>
  );
}