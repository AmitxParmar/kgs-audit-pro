import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  iaf_code: string;
  nace_code: string;
  sic_code: string;
  onChange: (key: "iaf_code" | "nace_code" | "sic_code", value: string) => void;
}

export function CodesCard({ iaf_code, nace_code, sic_code, onChange }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          IAF / NACE / SIC Codes
          <span className="block text-sm font-normal text-muted-foreground mt-1">
            (If unknown, leave blank)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-medium">
            IAF Code <span className="text-red-500">*</span>
          </label>
          <Input
            className="hover:text-black"
            placeholder="e.g. 17"
            value={iaf_code}
            onChange={(e) => onChange("iaf_code", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">NACE Code</label>
          <Input
            className="hover:text-black"
            placeholder="e.g. C29.32"
            value={nace_code}
            onChange={(e) => onChange("nace_code", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">SIC Code</label>
          <Input
            className="hover:text-black"
            placeholder="e.g. 3714"
            value={sic_code}
            onChange={(e) => onChange("sic_code", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
