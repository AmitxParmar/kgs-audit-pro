import React from 'react';
import type { AuditReportStatusEnum } from '../utils';

export const AUDIT_REPORT_STATUS_MAP: Record<AuditReportStatusEnum, { label: string; className: string }> = {
  draft_report: {
    label: "Draft Report",
    className: "bg-slate-900/30 border-slate-400/20 text-slate-300",
  },
  technical_review: {
    label: "Technical Review",
    className: "bg-purple-900/30 border-purple-400/20 text-purple-300",
  },
  iatf_update: {
    label: "IATF Update",
    className: "bg-cyan-900/30 border-cyan-400/20 text-cyan-300",
  },
  nc_update: {
    label: "NC Management",
    className: "bg-amber-900/30 border-amber-400/20 text-amber-300",
  },
  certification_update: {
    label: "Certification",
    className: "bg-emerald-900/30 border-emerald-400/20 text-emerald-300",
  },
};

interface StatusBubbleProps {
  status: string | null;
}

const StatusBubble: React.FC<StatusBubbleProps> = ({ status }) => {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase bg-white/5 border-white/10 text-slate-500">
        Unset
      </span>
    );
  }

  const mapping = AUDIT_REPORT_STATUS_MAP[status as AuditReportStatusEnum];
  const label = mapping?.label ?? status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const className = mapping?.className ?? "bg-white/5 border-white/10 text-slate-400";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${className}`}
    >
      {label}
    </span>
  );
};

export default StatusBubble;