import { motion } from "framer-motion";
import { PieChart as PieChartIcon, Grid, Layers } from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  Treemap
} from "recharts";
import { useWallet } from "../contexts/WalletContext";

const defaultProtocolColors = ["#f7931a", "#ffb74d", "#ffa726", "#ffcc80", "#ffe0b2", "#8a8a8a"];

export default function Exposure() {
  const { analysis } = useWallet();

  const assets = analysis?.assets || [];
  const protocolExposure = analysis?.protocol_exposure || [];

  const protocolData = protocolExposure.map((pe, idx) => ({
      name: pe.protocol,
      value: pe.exposure_usd,
      color: defaultProtocolColors[idx % defaultProtocolColors.length]
  }));
  
  const totalProtocolValue = protocolData.reduce((acc, curr) => acc + curr.value, 0);
  
  // Format data for Treemap
  const treeMapData = assets.map((a) => ({
    name: a.symbol,
    size: a.usd_value > 0 ? a.usd_value : 0.01 // Keep on chart even if dust
  })).filter(a => a.size >= 0.01);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Protocol Allocation (Pie Chart) - Dynamic mapped from Phase 4 */}
        <motion.div 
          className="lg:col-span-4 rounded-[32px] p-8 bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl flex flex-col h-[400px]"
        >
          <h3 className="text-[#8a8a8a] font-semibold tracking-wider text-sm mb-6 uppercase flex items-center gap-2">
            <PieChartIcon size={16} className="text-white" /> Protocol Allocation
          </h3>
          <div className="flex-1 w-full min-h-0 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={protocolData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {protocolData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  itemStyle={{ fontWeight: "bold" }}
                  formatter={(val: any) => `$${val.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
              <span className="text-[#8a8a8a] text-xs font-bold uppercase tracking-widest">Protocol TVL</span>
              <span className="text-white text-xl font-black">${totalProtocolValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
            </div>
          </div>
        </motion.div>

        {/* Asset Distribution / Dynamic Heatmap (Treemap) */}
        <motion.div 
          className="lg:col-span-8 rounded-[32px] p-8 bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/[0.08] backdrop-blur-xl flex flex-col h-[400px]"
        >
          <h3 className="text-[#8a8a8a] font-semibold tracking-wider text-sm mb-6 uppercase flex items-center gap-2">
            <Grid size={16} className="text-white" /> Asset Heatmap
          </h3>
          <div className="flex-1 w-full min-h-0">
             <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={treeMapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="#060606"
                fill="#f7931a"
                content={({ x, y, width, height, name, index }: any) => {
                  let opacity = 0.4 - (index * 0.05);
                  if (opacity < 0.1) opacity = 0.1;
                  return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={`rgba(247,147,26,${opacity})`}
                      stroke="#111"
                      strokeWidth={2}
                      rx={8}
                      ry={8}
                    />
                    {width > 50 && height > 30 && (
                      <text x={x + 12} y={y + 24} fill="#fff" fontSize={14} fontWeight="bold">
                        {name}
                      </text>
                    )}
                  </g>
                )}}
              >
                <Tooltip 
                  contentStyle={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  formatter={(val: any) => `$${val.toLocaleString()}`}
                />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Real Asset Allocations Table */}
        <motion.div 
          className="rounded-[32px] p-8 bg-white/[0.02] border border-white/[0.04] overflow-hidden"
        >
          <h3 className="text-[#8a8a8a] font-semibold tracking-wider text-sm mb-6 uppercase flex items-center gap-2">
            <Layers size={16} className="text-white" /> Asset Composition
          </h3>
          <div className="w-full overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="py-4 text-[#8a8a8a] font-medium text-sm">Asset</th>
                  <th className="py-4 text-[#8a8a8a] font-medium text-sm">Name</th>
                  <th className="py-4 text-[#8a8a8a] font-medium text-sm text-right">Balance</th>
                  <th className="py-4 text-[#8a8a8a] font-medium text-sm text-right">Value ($)</th>
                  <th className="py-4 text-[#8a8a8a] font-medium text-sm text-right">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((a, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 text-white font-bold">{a.symbol}</td>
                    <td className="py-4 text-[#8a8a8a] text-sm">{a.name}</td>
                    <td className="py-4 text-white font-mono text-right">{a.balance.toLocaleString(undefined, {maximumFractionDigits: 4})}</td>
                    <td className="py-4 text-white font-mono text-right">${a.usd_value.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    <td className="py-4 text-right">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold bg-[#f7931a]/10 text-[#f7931a]">
                            {a.allocation}%
                        </div>
                    </td>
                  </tr>
                ))}
                {assets.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-[#8a8a8a]">No assets detected on-chain.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
