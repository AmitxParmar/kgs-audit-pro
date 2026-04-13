import { Mail, Phone, Calendar, Clock } from "lucide-react";
import type { ClientViewModel } from "../../api/client-queries";

interface Props {
  client: ClientViewModel;
  onClick: (client: ClientViewModel) => void;
}

export function ClientCard({ client: c, onClick }: Props) {
  return (
    <div
      onClick={() => onClick(c)}
      className="bg-card border border-border rounded-xl p-5 hover:bg-[#1a1f2e] transition cursor-pointer"
    >
      {/* TOP */}
      <div className="flex justify-between mb-3">
        <div>
          <h2 className="text-white font-semibold">{c.name}</h2>
          <div className="flex gap-2 text-[11px] text-gray-500 mt-1">
            <span>{c.code}</span>
            <span className="px-2 py-[2px] bg-amber-900 text-amber-400 rounded">
              {c.type}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-900 text-amber-400">
            {c.stage}
          </span>
          {(c as any).contract?.status === "Rejected" && (
            <span className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
              Rejected
            </span>
          )}
          {c.stage === "Contract Review" && (
            <span className="flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              Draft
            </span>
          )}
        </div>
      </div>

      {/* DETAILS */}
      <div className="flex gap-6 text-[12px] text-gray-400 mb-3 flex-wrap">
        <span className="flex items-center gap-1">
          <Mail size={12} /> {c.contact_email}
        </span>
        <span className="flex items-center gap-1">
          <Phone size={12} /> {c.contact_phone}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={12} /> {c.date}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} /> {c.scope}
        </span>
      </div>

      {/* PROGRESS */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">Progress</span>
        <div className="flex-1 h-2 bg-[#1e2330] rounded">
          <div
            className="h-2 bg-amber-400 rounded"
            style={{ width: `${c.progress}%` }}
          />
        </div>
        <span className="text-xs text-amber-400">{c.progress}%</span>
        <span className="ml-3 text-[11px] px-3 py-1 bg-[#1a1f2e] rounded text-gray-300">
          {c.stageCount}
        </span>
      </div>
    </div>
  );
}
