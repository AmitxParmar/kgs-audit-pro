import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AUDIT_TYPES = [
  "Re-Certification Audit",
  "Registration Audit",
  "Pre-Assessment Audit",
  "Transfer Audit",
  "Special Audit",
];

interface Props {
  typeOfAudit: string;
  onChange: (value: string) => void;
}

export function AuditTypeCard({ typeOfAudit, onChange }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          Type of Quote <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {AUDIT_TYPES.map((v) => (
          <label key={v} className="flex gap-2">
            <input
              type="radio"
              checked={typeOfAudit === v}
              onChange={() => onChange(v)}
            />
            {v}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
