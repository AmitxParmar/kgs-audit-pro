interface StatItem {
  title: string;
  value: number;
  sub: string;
}

interface Props {
  stats: StatItem[];
}

export function StatsGrid({ stats }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-4">
          <p className="text-xs text-gray-400">{s.title}</p>
          <h2 className="text-2xl font-bold mt-2 text-white">{s.value}</h2>
          <p className="text-xs text-green-400">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}
