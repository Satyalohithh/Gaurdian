export default function AlertsPanel({ warnings }: any) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div style={{ color: "red", marginTop: "20px" }}>
      <h3>⚠ Alerts</h3>
      {warnings.map((w: string, i: number) => (
        <p key={i}>{w}</p>
      ))}
    </div>
  );
}