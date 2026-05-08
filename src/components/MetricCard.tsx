import Card from "./Card.tsx";

export default function MetricCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <Card>
      <p style={{ color: "#9ca3af", fontSize: "14px" }}>{title}</p>
      <h2 style={{ fontSize: "24px", marginTop: "8px", color: color || "white" }}>
        {value}
      </h2>
    </Card>
  );
}