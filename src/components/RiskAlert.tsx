
interface Props {
  warnings: string[];
}

export default function RiskAlert({ warnings }: Props) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'rgba(255, 75, 110, 0.1)', 
      border: '1px solid #FF4B6E', 
      borderRadius: '12px',
      color: '#FF4B6E'
    }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0' }}>Liquidation Warnings</h3>
      <ul style={{ margin: 0, paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {warnings.map((warning, idx) => (
          <li key={idx} style={{ fontSize: '15px' }}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}
