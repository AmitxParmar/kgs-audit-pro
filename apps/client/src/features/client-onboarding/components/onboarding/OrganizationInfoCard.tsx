import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ClientInfoFormState } from "../../utils/types";

const RequiredLabel = ({ text }: { text: string }) => (
  <label className="text-sm font-medium">
    {text} <span className="text-red-500">*</span>
  </label>
);

interface Props {
  client: ClientInfoFormState;
  onChange: (updated: ClientInfoFormState) => void;
}

export function OrganizationInfoCard({ client, onChange }: Props) {
  const set = (key: keyof ClientInfoFormState, value: string) =>
    onChange({ ...client, [key]: value });

  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>Organization Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <RequiredLabel text="Organization Name" />
            <Input
              className="hover:text-black"
              value={client.organization_name}
              onChange={(e) => set("organization_name", e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Website</label>
            <Input
              className="hover:text-black"
              value={client.website}
              onChange={(e) => set("website", e.target.value)}
            />
          </div>
        </div>
        <div>
          <RequiredLabel text="Manufacturing Site PinCode / ZipCode" />
          <Textarea
            rows={3}
            value={client.registration_site_address}
            onChange={(e) => set("registration_site_address", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
