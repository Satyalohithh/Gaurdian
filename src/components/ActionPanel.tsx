export default function ActionPanel({ actions }: any) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Recommended Actions</h3>

      {actions.map((a: string, i: number) => (
        <p key={i}>{a}</p>
      ))}
    </div>
  );
}