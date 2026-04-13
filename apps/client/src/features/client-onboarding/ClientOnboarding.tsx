import { useOnboardingForm } from "./hooks/useOnboardingForm";
import { ApplicationTypeCard } from "./components/onboarding/ApplicationTypeCard";
import { AuditTypeCard } from "./components/onboarding/AuditTypeCard";
import { StandardsCard } from "./components/onboarding/StandardsCard";
import { ProductDesignCard } from "./components/onboarding/ProductDesignCard";
import { OrganizationInfoCard } from "./components/onboarding/OrganizationInfoCard";
import { ContactsCard } from "./components/onboarding/ContactsCard";
import { ManufacturingSitesCard } from "./components/onboarding/ManufacturingSitesCard";
import { CodesCard } from "./components/onboarding/CodesCard";
import { LanguagesCard } from "./components/onboarding/LanguagesCard";
import { ShiftTimingsCard } from "./components/onboarding/ShiftTimingsCard";
import { LegalObligationsCard } from "./components/onboarding/LegalObligationsCard";
import { OemCustomersCard } from "./components/onboarding/OemCustomersCard";
import { ScopeCard } from "./components/onboarding/ScopeCard";
import { DocumentUploadCard } from "./components/onboarding/DocumentUploadCard";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ClientOnboardingIATF() {
  const form = useOnboardingForm();

  return (
    <div className="min-h-screen py-10 px-4 flex justify-center bg-gradient-to-b from-slate-950 to-slate-950/80 text-white">
      <div className="w-full max-w-6xl space-y-8">

        {/* Title */}
        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {form.app.applicable_standards.length
                ? `${form.app.applicable_standards.join(" / ")} – Organization Profile`
                : "Organization Profile"}
            </CardTitle>
          </CardHeader>
        </Card>

        <ApplicationTypeCard
          applicationType={form.applicationType}
          setApplicationType={form.setApplicationType}
        />

        <AuditTypeCard
          typeOfAudit={form.app.type_of_audit}
          onChange={(value) => form.setApp({ ...form.app, type_of_audit: value })}
        />

        <StandardsCard
          applicableStandards={form.app.applicable_standards}
          onToggle={(std) => form.toggleArrayValue("applicable_standards", std)}
        />

        <ProductDesignCard
          value={form.app.product_design_responsibility}
          onChange={(value) =>
            form.setApp({ ...form.app, product_design_responsibility: value })
          }
        />

        <OrganizationInfoCard
          client={form.client}
          onChange={form.setClient}
        />

        <ContactsCard
          contacts={form.contacts}
          onAdd={form.addContact}
          onRemove={form.removeContact}
          onUpdate={form.updateContact}
        />

        <ManufacturingSitesCard
          manufacturingSites={form.app.manufacturing_sites}
          onUpdateSite={form.updateManufacturingSite}
          onAddSite={form.addManufacturingSite}
          onRemoveSite={form.removeManufacturingSite}
          onAddRemote={form.addRemoteLocation}
          onUpdateRemote={form.updateRemoteLocation}
          onRemoveRemote={form.removeRemoteLocation}
          onToggleRemoteFunction={form.toggleRemoteSupportFunction}
        />

        <CodesCard
          iaf_code={form.app.iaf_code}
          nace_code={form.app.nace_code}
          sic_code={form.app.sic_code}
          onChange={(key, value) => form.setApp({ ...form.app, [key]: value })}
        />

        <LanguagesCard
          languages_spoken={form.app.languages_spoken}
          onChange={(updated) =>
            form.setApp({ ...form.app, languages_spoken: updated })
          }
        />

        <ShiftTimingsCard
          shifts={form.app.shifts}
          onChange={(updated) => form.setApp({ ...form.app, shifts: updated })}
        />

        <LegalObligationsCard
          legalObligations={form.app.legal_obligations}
          legalObligationDetails={form.app.legal_obligation_details}
          previousIatfCertified={form.app.previous_iatf_certified}
          onChange={(key, value) => form.setApp({ ...form.app, [key]: value })}
        />

        <OemCustomersCard
          hasIatfOemCustomers={form.app.has_iatf_oem_customers}
          iatfOemCustomers={form.app.iatf_oem_customers}
          hasOtherOemCustomers={form.app.has_other_oem_customers}
          otherOemCustomers={form.app.other_oem_customers}
          onToggleHasIatf={(value) =>
            form.setApp({ ...form.app, has_iatf_oem_customers: value })
          }
          onToggleOEM={form.toggleOEM}
          onUpdateSupplierCode={form.updateSupplierCode}
          onToggleHasOther={(value) =>
            form.setApp({ ...form.app, has_other_oem_customers: value })
          }
          onUpdateOtherOEM={form.updateOtherOEM}
          onAddOtherOEM={() =>
            form.setApp({
              ...form.app,
              other_oem_customers: [
                ...form.app.other_oem_customers,
                { name: "", supplier_code: "", OEM: false },
              ],
            })
          }
          onToggleOtherOemFlag={(index) => {
            const updated = [...form.app.other_oem_customers];
            updated[index] = { ...updated[index], OEM: !updated[index].OEM };
            form.setApp({ ...form.app, other_oem_customers: updated });
          }}
        />

        <ScopeCard
          proposedScope={form.app.proposed_scope}
          outsourcedProcesses={form.app.outsourced_processes}
          onChange={(key, value) => form.setApp({ ...form.app, [key]: value })}
        />

        <DocumentUploadCard onChange={form.setAttachment} />

        <Button
          onClick={form.handleSubmit}
          disabled={form.loading}
          className="w-full text-lg py-6 rounded-2xl border border-white cursor-pointer hover:bg-gray-700 font-semibold shadow-md"
        >
          {form.loading ? "Submitting..." : "Submit IATF Application"}
        </Button>
      </div>
    </div>
  );
}
