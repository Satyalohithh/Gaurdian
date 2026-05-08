import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function GlassPanel({
  children,
  className = "",
  glowColor = "rgba(255, 255, 255, 0.05)",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/80 p-6 backdrop-blur-md shadow-2xl ${className}`}
    >
      <div 
        className="pointer-events-none absolute -inset-px opacity-50 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at center, ${glowColor}, transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
