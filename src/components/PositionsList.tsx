export default function PositionsList({ positions }: any) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Positions</h3>

      {positions.map((p: any, i: number) => (
        <div key={i}>
          {p.market} — {p.leverage}x — {p.pnl_percent}%
        </div>
      ))}
    </div>
  );
}