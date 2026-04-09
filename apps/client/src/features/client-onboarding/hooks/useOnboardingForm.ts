import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardClient } from "../api/client-mutations";
import { toBase64 } from "../utils/file";
import { IATF_OEM_CUSTOMERS_DEFAULT } from "../utils/constants";
import type {
  AppFormState,
  ClientInfoFormState,
  ContactEntry,
} from "../utils/types";

// ─── Initial state ─────────────────────────────────────────────────────────────

const initialClientState: ClientInfoFormState = {
  organization_name: "",
  contact_name: "",
  title: "",
  phone: "",
  fax: "",
  email: "",
  website: "",
  mailing_address: "",
  registration_site_address: "",
};

const initialAppState: AppFormState = {
  type_of_audit: "",
  applicable_standards: [],
  product_design_responsibility: "",
  manufacturing_sites: [
    {
      site_name: "",
      address: "",
      employees_mfg: "",
      employees_support: "",
      total_employees: "",
      remote_locations: [],
    },
  ],
  extended_sites: [],
  surveillance_frequency: 12,
  proposed_scope: "",
  outsourced_processes: "",
  working_days: [],
  shifts: [
    { shift: "shift1", start: "08:00", end: "16:00" },
    { shift: "shift2", start: "", end: "" },
    { shift: "shift3", start: "", end: "" },
  ],
  iaf_code: "",
  nace_code: "",
  sic_code: "",
  languages_spoken: {
    management: "",
    supporting: "",
    manufacturing: "",
  },
  automotive_percentage: "",
  legal_obligations: false,
  legal_obligation_details: "",
  previous_iatf_certified: false,
  automotive_customers: [{ name: "", supplier_code: "" }],
  annex4_eligibility: false,
  has_iatf_oem_customers: false,
  iatf_oem_customers: IATF_OEM_CUSTOMERS_DEFAULT.map((c) => ({ ...c })),
  other_oem_customers: [{ name: "", supplier_code: "", OEM: false }],
  has_other_oem_customers: false,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

const safeInt = (value: string | number | null) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const calculateTotal = (mfg: string, support: string) => {
  const m = Number(mfg) || 0;
  const s = Number(support) || 0;
  return (m + s).toString();
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOnboardingForm() {
  const navigate = useNavigate();
  const onboardMutation = useOnboardClient();

  const [applicationType, setApplicationType] = useState<"IATF" | "IAF">("IATF");
  const [client, setClient] = useState<ClientInfoFormState>(initialClientState);
  const [app, setApp] = useState<AppFormState>(initialAppState);
  const [contacts, setContacts] = useState<ContactEntry[]>([
    { name: "", designation: "", phone: "", email: "" },
  ]);
  const [attachment, setAttachment] = useState<File | null>(null);

  // ── Derived ───────────────────────────────────────────────────────────────

  const calculateGrandTotal = () => {
    let total = 0;
    app.manufacturing_sites.forEach((site) => {
      total += safeInt(site.total_employees);
      site.remote_locations.forEach((remote) => {
        total += safeInt(remote.total_employees);
      });
    });
    return total;
  };

  // ── Array helpers ─────────────────────────────────────────────────────────

  const toggleArrayValue = (key: keyof AppFormState, value: string) => {
    const arr = app[key] as string[];
    setApp({
      ...app,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    });
  };

  // ── Contacts ──────────────────────────────────────────────────────────────

  const addContact = () =>
    setContacts([...contacts, { name: "", designation: "", phone: "", email: "" }]);

  const removeContact = (index: number) =>
    setContacts(contacts.filter((_, i) => i !== index));

  const updateContact = (index: number, key: string, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [key]: value };
    setContacts(updated);
  };

  // ── Manufacturing Sites ───────────────────────────────────────────────────

  const updateManufacturingSite = (index: number, key: string, value: string) => {
    const updated = [...app.manufacturing_sites];
    updated[index] = { ...updated[index], [key]: value };
    updated[index].total_employees = calculateTotal(
      updated[index].employees_mfg,
      updated[index].employees_support,
    );
    setApp({ ...app, manufacturing_sites: updated });
  };

  const addManufacturingSite = () =>
    setApp({
      ...app,
      manufacturing_sites: [
        ...app.manufacturing_sites,
        {
          site_name: "",
          address: "",
          employees_mfg: "",
          employees_support: "",
          total_employees: "",
          remote_locations: [],
        },
      ],
    });

  const removeManufacturingSite = (index: number) =>
    setApp({
      ...app,
      manufacturing_sites: app.manufacturing_sites.filter((_, i) => i !== index),
    });

  // ── Remote Locations ──────────────────────────────────────────────────────

  const addRemoteLocation = (mfgIndex: number) => {
    const updated = [...app.manufacturing_sites];
    updated[mfgIndex].remote_locations.push({
      site_name: "",
      address: "",
      employees_mfg: "",
      employees_support: "",
      total_employees: "",
      support_functions: [],
    });
    setApp({ ...app, manufacturing_sites: updated });
  };

  const updateRemoteLocation = (
    mfgIndex: number,
    remoteIndex: number,
    key: string,
    value: string,
  ) => {
    const updated = [...app.manufacturing_sites];
    const remote = { ...updated[mfgIndex].remote_locations[remoteIndex] };
    (remote as any)[key] = value;
    remote.total_employees = calculateTotal(remote.employees_mfg, remote.employees_support);
    updated[mfgIndex] = {
      ...updated[mfgIndex],
      remote_locations: updated[mfgIndex].remote_locations.map((r, i) =>
        i === remoteIndex ? remote : r,
      ),
    };
    setApp({ ...app, manufacturing_sites: updated });
  };

  const removeRemoteLocation = (mfgIndex: number, remoteIndex: number) => {
    const updated = [...app.manufacturing_sites];
    updated[mfgIndex] = {
      ...updated[mfgIndex],
      remote_locations: updated[mfgIndex].remote_locations.filter(
        (_, i) => i !== remoteIndex,
      ),
    };
    setApp({ ...app, manufacturing_sites: updated });
  };

  const toggleRemoteSupportFunction = (
    mfgIndex: number,
    remoteIndex: number,
    func: string,
  ) => {
    setApp((prev) => ({
      ...prev,
      manufacturing_sites: prev.manufacturing_sites.map((site, i) => {
        if (i !== mfgIndex) return site;
        return {
          ...site,
          remote_locations: site.remote_locations.map((remote, j) => {
            if (j !== remoteIndex) return remote;
            const current = remote.support_functions || [];
            return {
              ...remote,
              support_functions: current.includes(func)
                ? current.filter((f) => f !== func)
                : [...current, func],
            };
          }),
        };
      }),
    }));
  };

  // ── OEM Customers ─────────────────────────────────────────────────────────

  const toggleOEM = (index: number) => {
    const updated = [...app.iatf_oem_customers];
    updated[index] = { ...updated[index], selected: !updated[index].selected };
    setApp({ ...app, iatf_oem_customers: updated });
  };

  const updateSupplierCode = (index: number, value: string) => {
    const updated = [...app.iatf_oem_customers];
    updated[index] = { ...updated[index], supplier_code: value };
    setApp({ ...app, iatf_oem_customers: updated });
  };

  const updateOtherOEM = (index: number, key: string, value: string) => {
    const updated = [...app.other_oem_customers];
    updated[index] = { ...updated[index], [key]: value };
    setApp({ ...app, other_oem_customers: updated });
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    try {
      let attachment_base64: string | null = null;
      if (attachment) {
        attachment_base64 = await toBase64(attachment);
      }

      const primaryContact = contacts[0];

      const payload = {
        name: client.organization_name,
        contact_name: primaryContact?.name ?? "",
        contact_email: primaryContact?.email ?? "",
        contact_phone: primaryContact?.phone ?? "",
        address: client.mailing_address,
        website: client.website,
        industry: app.applicable_standards.join(", "),
        application_type: applicationType,
        application: {
          type_of_audit: app.type_of_audit,
          applicable_standards: app.applicable_standards,
          product_design_responsibility: app.product_design_responsibility,
          manufacturing_sites: app.manufacturing_sites,
          iaf_code: app.iaf_code,
          nace_code: app.nace_code,
          sic_code: app.sic_code,
          languages_spoken: app.languages_spoken,
          shifts: app.shifts,
          working_days: app.working_days,
          surveillance_frequency: app.surveillance_frequency ?? null,
          legal_obligations: app.legal_obligations,
          legal_obligation_details: app.legal_obligation_details,
          previous_iatf_certified: app.previous_iatf_certified,
          automotive_customers: app.automotive_customers,
          automotive_percentage: app.automotive_percentage,
          annex4_eligibility: app.annex4_eligibility,
          has_iatf_oem_customers: app.has_iatf_oem_customers,
          iatf_oem_customers: app.iatf_oem_customers,
          has_other_oem_customers: app.has_other_oem_customers,
          other_oem_customers: app.other_oem_customers,
          proposed_scope: app.proposed_scope,
          outsourced_processes: app.outsourced_processes,
          attachment_base64,
        },
      } satisfies import("../api/types").OnboardClientPayload;

      await onboardMutation.mutateAsync(payload);
      navigate("/clients");
    } catch (err) {
      console.error("Onboarding submit error:", err);
    }
  };

  return {
    // state
    applicationType,
    setApplicationType,
    client,
    setClient,
    app,
    setApp,
    contacts,
    attachment,
    setAttachment,
    loading: onboardMutation.isPending,
    // helpers
    calculateGrandTotal,
    toggleArrayValue,
    // contact handlers
    addContact,
    removeContact,
    updateContact,
    // manufacturing site handlers
    updateManufacturingSite,
    addManufacturingSite,
    removeManufacturingSite,
    // remote location handlers
    addRemoteLocation,
    updateRemoteLocation,
    removeRemoteLocation,
    toggleRemoteSupportFunction,
    // OEM handlers
    toggleOEM,
    updateSupplierCode,
    updateOtherOEM,
    // submit
    handleSubmit,
  };
}
