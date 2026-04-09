import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function ProductDesignCard({ value, onChange }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          Product Design Responsibility{" "}
          <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-6">
        {["Client Responsible", "Customer Responsible"].map((v) => (
          <label key={v} className="flex gap-2">
            <input
              type="radio"
              checked={value === v}
              onChange={() => onChange(v)}
            />
            {v}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
