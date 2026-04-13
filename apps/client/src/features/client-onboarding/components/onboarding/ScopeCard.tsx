import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  proposedScope: string;
  outsourcedProcesses: string;
  onChange: (key: "proposed_scope" | "outsourced_processes", value: string) => void;
}

export function ScopeCard({ proposedScope, outsourcedProcesses, onChange }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          Scope &amp; Outsourced Processes{" "}
          <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Proposed Scope of Registration"
          value={proposedScope}
          onChange={(e) => onChange("proposed_scope", e.target.value)}
        />
        <Textarea
          placeholder="Outsourced Processes"
          value={outsourcedProcesses}
          onChange={(e) => onChange("outsourced_processes", e.target.value)}
        />
      </CardContent>
    </Card>
  );
}
