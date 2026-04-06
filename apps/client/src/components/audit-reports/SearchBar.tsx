type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  statusOptions?: string[];
};

const defaultStatuses = ["All Status", "Completed", "In Progress", "Draft", "Rejected"];

export default function SearchBar({
  value,
  onChange,
  status,
  onStatusChange,
  statusOptions = defaultStatuses,
}: SearchBarProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Search */}
      <div className="flex-1 relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by client or auditor..."
          className="h-10 w-full rounded-xl border border-white/10 bg-black/20 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition"
        />
      </div>

      {/* Status dropdown */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-xl border border-white/10 bg-black/20 pl-3 pr-8 text-sm text-slate-200 outline-none appearance-none focus:border-white/20 focus:ring-1 focus:ring-white/10 transition cursor-pointer"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s} className="bg-slate-900">
              {s}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
          ▾
        </span>
      </div>
    </div>
  );
}
