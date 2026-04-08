import React from 'react';

export const STATUS_MAP: Record<string, { label: string; className: string }> = {
  client_onboarded: { 
    label: "Client Onboarded", 
    className: "bg-slate-900/30 border-slate-400/20 text-slate-300" 
  },
  audit_planned: { 
    label: "Audit Planned", 
    className: "bg-blue-900/30 border-blue-400/20 text-blue-300" 
  },
  audit_in_progress: { 
    label: "Audit In Progress", 
    className: "bg-indigo-900/30 border-indigo-400/20 text-indigo-300" 
  },
  nc_raised: { 
    label: "NC Raised", 
    className: "bg-amber-900/30 border-amber-400/20 text-amber-300" 
  },
  report_under_review: { 
    label: "Report Under Review", 
    className: "bg-purple-900/30 border-purple-400/20 text-purple-300" 
  },
  cert_decision: { 
    label: "Certification Decision", 
    className: "bg-cyan-900/30 border-cyan-400/20 text-cyan-300" 
  },
  cert_granted: { 
    label: "Certification Granted", 
    className: "bg-emerald-900/30 border-emerald-400/20 text-emerald-300" 
  },
  cert_uploaded: { 
    label: "Cert Uploaded", 
    className: "bg-teal-900/30 border-teal-400/20 text-teal-300" 
  },
  active: { 
    label: "Active Certification", 
    className: "bg-blue-900/30 border-blue-400/20 text-blue-300" 
  },
  denied: { 
    label: "Denied", 
    className: "bg-rose-900/30 border-rose-400/20 text-rose-300" 
  },
  suspended: { 
    label: "Suspended", 
    className: "bg-slate-700/50 border-slate-500/30 text-slate-400" 
  },
};

interface StatusBubbleProps {
  status: string;
}

const StatusBubble: React.FC<StatusBubbleProps> = ({ status }) => {
  const mapping = STATUS_MAP[status];
  const label = mapping?.label || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const className = mapping?.className || "bg-white/5 border-white/10 text-slate-400";

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold tracking-wider uppercase transition-all duration-300 ${className}`}>
      {label}
    </span>
  );
};

export default StatusBubble;
