import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type {
  IatfOemCustomerForm,
  OtherOemCustomerForm,
} from "../../utils/types";

interface Props {
  hasIatfOemCustomers: boolean;
  iatfOemCustomers: IatfOemCustomerForm[];
  hasOtherOemCustomers: boolean;
  otherOemCustomers: OtherOemCustomerForm[];
  onToggleHasIatf: (value: boolean) => void;
  onToggleOEM: (index: number) => void;
  onUpdateSupplierCode: (index: number, value: string) => void;
  onToggleHasOther: (value: boolean) => void;
  onUpdateOtherOEM: (index: number, key: string, value: string) => void;
  onAddOtherOEM: () => void;
  onToggleOtherOemFlag: (index: number) => void;
}

export function OemCustomersCard({
  hasIatfOemCustomers,
  iatfOemCustomers,
  hasOtherOemCustomers,
  otherOemCustomers,
  onToggleHasIatf,
  onToggleOEM,
  onUpdateSupplierCode,
  onToggleHasOther,
  onUpdateOtherOEM,
  onAddOtherOEM,
  onToggleOtherOemFlag,
}: Props) {
  return (
    <>
      {/* IATF OEM */}
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>
            Automotive Customers are (Automotive Customers (IATF))
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            Please list only customers that are applicable to IATF 16949
            (production or service parts only)
          </p>
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={hasIatfOemCustomers}
              onChange={(e) => onToggleHasIatf(e.target.checked)}
            />
            We have IATF OEM Automotive Customers
          </label>
          {hasIatfOemCustomers && (
            <div className="space-y-3 pt-3">
              {iatfOemCustomers.map((oem, index) => (
                <div
                  key={oem.name}
                  className="grid grid-cols-3 gap-4 items-center"
                >
                  <label className="flex gap-2 col-span-1">
                    <input
                      type="checkbox"
                      checked={oem.selected}
                      onChange={() => onToggleOEM(index)}
                    />
                    {oem.name}
                  </label>
                  <Input
                    className="hover:text-black"
                    disabled={!oem.selected}
                    placeholder="Supplier Code"
                    value={oem.supplier_code}
                    onChange={(e) => onUpdateSupplierCode(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other OEM */}
      <Card className="bg-card border border-border shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle>Other Automotive OEM / Automotive Customers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex gap-2">
            <input
              type="checkbox"
              checked={hasOtherOemCustomers}
              onChange={(e) => onToggleHasOther(e.target.checked)}
            />
            We have other Automotive OEM customers
          </label>
          {hasOtherOemCustomers && (
            <div className="space-y-4">
              {otherOemCustomers.map((o, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 items-center"
                >
                  <Input
                    className="hover:text-black col-span-5"
                    placeholder="Customer Name"
                    value={o.name}
                    onChange={(e) => onUpdateOtherOEM(index, "name", e.target.value)}
                  />
                  <Input
                    className="col-span-5 hover:text-black"
                    placeholder="Supplier Code"
                    value={o.supplier_code}
                    onChange={(e) =>
                      onUpdateOtherOEM(index, "supplier_code", e.target.value)
                    }
                  />
                  <div className="col-span-2 flex items-center justify-end gap-2 mr-10">
                    <input
                      type="checkbox"
                      checked={o.OEM}
                      onChange={() => onToggleOtherOemFlag(index)}
                    />
                    <span className="text-sm font-medium">OEM</span>
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={onAddOtherOEM}>
                + Add More OEM Customer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
