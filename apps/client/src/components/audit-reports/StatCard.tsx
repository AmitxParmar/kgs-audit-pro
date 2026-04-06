import type { ReactNode } from "react";

export type StatCardProps = {
  label: string;
  value: number | string;
  icon: ReactNode;
  tone?: "default" | "warning" | "danger" | "info";
};

const toneMap = {
  default: "border-white/10 bg-white/[0.04]",
  warning: "border-amber-400/20 bg-amber-400/[0.06]",
  danger: "border-rose-400/20 bg-rose-400/[0.06]",
  info: "border-blue-400/20 bg-blue-400/[0.06]",
};

const iconToneMap = {
  default: "text-slate-400",
  warning: "text-amber-400",
  danger: "text-rose-400",
  info: "text-blue-400",
};

export default function StatCard({ label, value, icon, tone = "default" }: StatCardProps) {
  return (
    <div
      className={`rounded-xl border px-4 py-4 flex flex-col gap-3 ${toneMap[tone]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium tracking-wide">{label}</span>
        <span className={`${iconToneMap[tone]}`}>{icon}</span>
      </div>
      <div className="text-3xl font-extrabold text-slate-100">{value}</div>
    </div>
  );
}
