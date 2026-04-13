import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ContactEntry } from "../../utils/types";

const RequiredLabel = ({ text }: { text: string }) => (
  <label className="text-sm font-medium">
    {text} <span className="text-red-500">*</span>
  </label>
);

interface Props {
  contacts: ContactEntry[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, key: string, value: string) => void;
}

export function ContactsCard({ contacts, onAdd, onRemove, onUpdate }: Props) {
  return (
    <Card className="bg-card border border-border shadow-sm rounded-2xl">
      <CardHeader>
        <CardTitle>
          Contacts <span className="text-red-500">*</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {contacts.map((c, index) => (
          <div
            key={index}
            className="rounded-lg border border-border p-5 space-y-4"
          >
            <div className="grid grid-cols-2 gap-6">
              <div>
                <RequiredLabel text="Name" />
                <Input
                  className="hover:text-black"
                  value={c.name}
                  onChange={(e) => onUpdate(index, "name", e.target.value)}
                />
              </div>
              <div>
                <RequiredLabel text="Designation" />
                <Input
                  className="hover:text-black"
                  value={c.designation}
                  onChange={(e) => onUpdate(index, "designation", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <RequiredLabel text="Phone" />
                <Input
                  className="hover:text-black"
                  value={c.phone}
                  onChange={(e) => onUpdate(index, "phone", e.target.value)}
                />
              </div>
              <div>
                <RequiredLabel text="Email" />
                <Input
                  className="hover:text-black"
                  type="email"
                  value={c.email}
                  onChange={(e) => onUpdate(index, "email", e.target.value)}
                />
              </div>
            </div>
            {contacts.length > 1 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => onRemove(index)}
                >
                  Remove Contact
                </Button>
              </div>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={onAdd}
          className="w-fit"
        >
          + Add Another Contact
        </Button>
      </CardContent>
    </Card>
  );
}
