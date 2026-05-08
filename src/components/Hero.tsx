
interface Props {
  totalValue: number;
  riskScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
}

export default function Hero({ totalValue, riskScore, riskLevel }: Props) {
  const getRiskColor = (level: string) => {
    if (level === 'LOW') return '#00D4AA';
    if (level === 'MEDIUM') return '#FFB900';
    return '#FF4B6E';
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '30px', 
      backgroundColor: 'rgba(255,255,255,0.02)', 
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '12px'
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '14px', color: 'rgba(242,242,247,0.5)', marginBottom: '8px' }}>Total Position Value</div>
        <div style={{ fontSize: '42px', fontWeight: 600 }}>
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>
      <div style={{ flex: 1, borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '20px' }}>
        <div style={{ fontSize: '14px', color: 'rgba(242,242,247,0.5)', marginBottom: '8px' }}>Risk Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '42px', fontWeight: 600, color: getRiskColor(riskLevel) }}>
            {riskScore}/100
          </span>
          <span style={{ 
            padding: '4px 10px', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: 600,
            backgroundColor: `${getRiskColor(riskLevel)}20`,
            color: getRiskColor(riskLevel)
          }}>
            {riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
