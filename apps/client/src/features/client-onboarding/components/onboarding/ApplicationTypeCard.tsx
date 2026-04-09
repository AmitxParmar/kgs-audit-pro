import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  applicationType: "IATF" | "IAF";
  setApplicationType: (type: "IATF" | "IAF") => void;
}

export function ApplicationTypeCard({ applicationType, setApplicationType }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          Select Application Type <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-6">
        {(["IATF", "IAF"] as const).map((type) => (
          <label key={type} className="flex gap-2">
            <input
              type="radio"
              checked={applicationType === type}
              onChange={() => setApplicationType(type)}
            />
            {type}
          </label>
        ))}
      </CardContent>
    </Card>
  );
}
