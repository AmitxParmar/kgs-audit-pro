import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Props {
  onChange: (file: File | null) => void;
}

export function DocumentUploadCard({ onChange }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          Upload Supporting Document <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => onChange(e.target.files?.[0] || null)}
        />
      </CardContent>
    </Card>
  );
}
