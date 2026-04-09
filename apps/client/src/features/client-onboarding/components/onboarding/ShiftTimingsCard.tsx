import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ShiftFormEntry } from "../../utils/types";

interface Props {
  shifts: ShiftFormEntry[];
  onChange: (updated: ShiftFormEntry[]) => void;
}

export function ShiftTimingsCard({ shifts, onChange }: Props) {
  const updateShift = (index: number, key: "start" | "end", value: string) => {
    const updated = [...shifts];
    updated[index] = { ...updated[index], [key]: value };
    onChange(updated);
  };

  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>Shift Timings</CardTitle>
        <CardDescription>Define working hours for each shift</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {shifts.map((shift, index) => (
          <div
            key={shift.shift}
            className="grid grid-cols-3 gap-4 items-center"
          >
            <Label className="capitalize">{shift.shift}</Label>
            <Input
              type="time"
              className="bg-background border-border"
              value={shift.start}
              onChange={(e) => updateShift(index, "start", e.target.value)}
            />
            <Input
              type="time"
              className="bg-background border-border"
              value={shift.end}
              onChange={(e) => updateShift(index, "end", e.target.value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
