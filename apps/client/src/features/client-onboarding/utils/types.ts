
// ─── Modal / panel discriminators ─────────────────────────────────────────────

export type ActiveModal = "review" | "contract" | null;

// ─── Context type injected by AppShell / Outlet ───────────────────────────────

export type ClientContext = "both" | "iatf" | "iaf";

// ─── Type filter in the ClientsPage toolbar ───────────────────────────────────

export type TypeFilter = "ALL" | "IAF" | "IATF";

// ─── Checklist state for "Contract Signed" panel ─────────────────────────────

export interface SignedChecklist {
  email_sent: boolean;
  signed_contract_received: boolean;
  signed_contract_uploaded: boolean;
}

export interface SignedData {
  checklist: SignedChecklist;
  file: File | null;
  signedApplicationFile: File | null;
  notes: string;
  scopeChange: {
    enabled: boolean;
    type: "commercial_amendment" | "scope_change" | "";
  };
  audit: Record<string, string>;
}

// ─── Contract creation form state ─────────────────────────────────────────────

export interface ContractFormData {
  contractName: string;
  contractNumber: string;
  applicationId: string;
  startDate: string;
  endDate: string;
  terms: string;
  notes: string;
  standardIds: number[];
  mandaysSheetFile: File | null;
  reviewedFile: File | null;
}

// ─── Standard master (used in ClientsPage and contract form) ──────────────────

export interface StandardEntry {
  standard_id: number;
  standard_name: string;
}

export const STANDARD_MASTER: Record<"IAF" | "IATF", StandardEntry[]> = {
  IAF: [
    { standard_id: 1, standard_name: "ISO 9001" },
    { standard_id: 2, standard_name: "ISO 14001" },
    { standard_id: 3, standard_name: "ISO 45001" },
    { standard_id: 4, standard_name: "ISO 27001" },
    { standard_id: 5, standard_name: "ISO 22000" },
    { standard_id: 6, standard_name: "ISO 13485" },
    { standard_id: 7, standard_name: "ISO 50001" },
    { standard_id: 8, standard_name: "ISO 22301" },
    { standard_id: 9, standard_name: "ISO 20000-1" },
    { standard_id: 10, standard_name: "ISO 37001" },
  ],
  IATF: [
    { standard_id: 11, standard_name: "IATF 16949" },
    { standard_id: 12, standard_name: "VDA 6.3" },
    { standard_id: 13, standard_name: "VDA 6.5" },
  ],
};

// ─── Application form state (used in ClientOnboarding) ───────────────────────

export interface AppFormState {
  type_of_audit: string;
  applicable_standards: string[];
  product_design_responsibility: string;
  manufacturing_sites: ManufacturingSiteFormEntry[];
  extended_sites: unknown[];
  surveillance_frequency: number;
  proposed_scope: string;
  outsourced_processes: string;
  working_days: string[];
  shifts: ShiftFormEntry[];
  iaf_code: string;
  nace_code: string;
  sic_code: string;
  languages_spoken: LanguagesSpokenForm;
  automotive_percentage: string;
  legal_obligations: boolean;
  legal_obligation_details: string;
  previous_iatf_certified: boolean;
  automotive_customers: AutomotiveCustomerForm[];
  annex4_eligibility: boolean;
  has_iatf_oem_customers: boolean;
  iatf_oem_customers: IatfOemCustomerForm[];
  other_oem_customers: OtherOemCustomerForm[];
  has_other_oem_customers: boolean;
}

export interface ManufacturingSiteFormEntry {
  site_name: string;
  address: string;
  employees_mfg: string;
  employees_support: string;
  total_employees: string;
  remote_locations: RemoteLocationFormEntry[];
}

export interface RemoteLocationFormEntry {
  site_name: string;
  address: string;
  employees_mfg: string;
  employees_support: string;
  total_employees: string;
  support_functions: string[];
}

export interface ShiftFormEntry {
  shift: string;
  start: string;
  end: string;
}

export interface LanguagesSpokenForm {
  management: string;
  supporting: string;
  manufacturing: string;
}

export interface AutomotiveCustomerForm {
  name: string;
  supplier_code: string;
}

export interface IatfOemCustomerForm {
  name: string;
  supplier_code: string;
  selected: boolean;
}

export interface OtherOemCustomerForm {
  name: string;
  supplier_code: string;
  OEM: boolean;
}

export interface ClientInfoFormState {
  organization_name: string;
  contact_name: string;
  title: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  mailing_address: string;
  registration_site_address: string;
}

export interface ContactEntry {
  name: string;
  designation: string;
  phone: string;
  email: string;
}