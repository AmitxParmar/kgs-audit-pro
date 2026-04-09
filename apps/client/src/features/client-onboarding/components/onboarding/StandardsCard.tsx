import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const APPLICABLE_STANDARDS = [
  "ISO 9001:2015",
  "ISO 14001:2015",
  "ISO 45001:2018",
  "ISO 13485:2016",
  "ISO 22000:2018",
  "GOOD MANUFACTURING PRACTICES (GMP)",
  "HACCP SYSTEMS (HACCP)",
  "IATF 16949:2016",
];

interface Props {
  applicableStandards: string[];
  onToggle: (value: string) => void;
}

export function StandardsCard({ applicableStandards, onToggle }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          Applicable Standards <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {APPLICABLE_STANDARDS.map((std) => (
          <label key={std} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={applicableStandards.includes(std)}
              onChange={() => onToggle(std)}
            />
            {std}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
