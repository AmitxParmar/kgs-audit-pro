import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  legalObligations: boolean;
  legalObligationDetails: string;
  previousIatfCertified: boolean;
  onChange: (key: string, value: boolean | string) => void;
}

export function LegalObligationsCard({
  legalObligations,
  legalObligationDetails,
  previousIatfCertified,
  onChange,
}: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>Legal Obligations &amp; IATF Certification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Legal obligations */}
        <div>
          <label className="text-sm font-medium">
            Does your company have any relevant legal obligations (bankruptcies,
            legal proceedings, etc.)?
          </label>
          <div className="flex gap-6 mt-2">
            {([true, false] as const).map((val) => (
              <label key={String(val)} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={legalObligations === val}
                  onChange={() => onChange("legal_obligations", val)}
                />
                {val ? "Yes" : "No"}
              </label>
            ))}
          </div>
          {legalObligations && (
            <Textarea
              placeholder="If yes, please describe"
              value={legalObligationDetails}
              onChange={(e) =>
                onChange("legal_obligation_details", e.target.value)
              }
              rows={3}
              className="mt-2"
            />
          )}
        </div>

        {/* IATF certified */}
        <div>
          <label className="text-sm font-medium">
            Are you currently certified or have you been previously certified to
            IATF 16949?
          </label>
          <div className="flex gap-6 mt-2">
            {([true, false] as const).map((val) => (
              <label key={String(val)} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={previousIatfCertified === val}
                  onChange={() => onChange("previous_iatf_certified", val)}
                />
                {val ? "Yes" : "No"}
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
