import type { ReactNode } from "react";

export type StageFilterCardProps = {
  label: string;
  count: number;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export default function StageFilterCard({
  label,
  count,
  icon,
  active = false,
  onClick,
}: StageFilterCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-xl border px-4 py-4 flex flex-col items-center gap-2 transition w-full text-center",
        active
          ? "border-teal-400/40 bg-teal-400/10 shadow-[0_0_24px_rgba(45,212,191,0.12)]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <span className={active ? "text-teal-400" : "text-slate-400"}>{icon}</span>
      <span
        className={`text-xs font-medium tracking-wide ${
          active ? "text-teal-300" : "text-slate-400"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-2xl font-extrabold ${active ? "text-teal-300" : "text-slate-100"}`}
      >
        {count}
      </span>
    </button>
  );
}
