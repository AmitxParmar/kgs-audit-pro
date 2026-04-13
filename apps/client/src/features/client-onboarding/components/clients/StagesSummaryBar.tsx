import type { StageName } from "../../utils/stage";
import type { ClientViewModel } from "../../api/client-queries";

interface Props {
  stages: readonly StageName[];
  baseList: ClientViewModel[];
  stageFilter: string | null;
  onStageClick: (stage: StageName) => void;
}

export function StagesSummaryBar({ stages, baseList, stageFilter, onStageClick }: Props) {
  return (
    <div className="grid grid-cols-7 bg-card border border-border rounded-xl overflow-hidden text-center">
      {stages.map((stage, i) => {
        const count = baseList.filter((c) => c.stage === stage).length;
        return (
          <div
            key={i}
            onClick={() => onStageClick(stage)}
            className={`py-5 border-r border-border cursor-pointer ${
              stageFilter === stage ? "bg-[#1a1f2e]" : ""
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-full border border-amber-500 flex items-center justify-center text-amber-400 mb-2">
              {count}
            </div>
            <p className="text-[11px] text-gray-400">{stage}</p>
          </div>
        );
      })}
    </div>
  );
}
