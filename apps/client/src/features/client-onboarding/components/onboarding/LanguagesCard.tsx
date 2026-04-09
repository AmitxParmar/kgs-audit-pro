import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LanguagesSpokenForm } from "../../utils/types";

interface Props {
  languages_spoken: LanguagesSpokenForm;
  onChange: (updated: LanguagesSpokenForm) => void;
}

export function LanguagesCard({ languages_spoken, onChange }: Props) {
  const set = (key: keyof LanguagesSpokenForm, value: string) =>
    onChange({ ...languages_spoken, [key]: value });

  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>Language spoken on site</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {(
          [
            ["Management personnel", "management"],
            ["Supporting personnel", "supporting"],
            ["Manufacturing personnel", "manufacturing"],
          ] as const
        ).map(([label, key]) => (
          <div key={key} className="grid grid-cols-2 gap-6 items-center">
            <Label>{label}</Label>
            <Input
              className="hover:text-black"
              placeholder="e.g. English"
              value={languages_spoken[key]}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
