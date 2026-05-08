export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #1f2937",
        borderRadius: "14px",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
}