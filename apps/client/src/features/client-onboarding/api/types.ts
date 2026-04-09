// ─── Raw Supabase response shapes ─────────────────────────────────────────────

export interface ApplicationMasterRaw {
  application_id: string;
  client_id: string;
  standard: string;
  status: string;
  created_at: string;
  received_by: string | null;
  received_at: string | null;
  office_verified_by: string | null;
  office_verified_at: string | null;
  sent_to_scheme_at: string | null;
  scheme_manager_id: string | null;
  scheme_action_at: string | null;
  scheme_comment: string | null;
  last_action_role: string | null;
  last_action_by: string | null;
  attachment_url: string | null;
  type_of_audit: string | null;
  existing_standards: unknown;
  product_design_responsibility: string | null;
  mailing_address: string | null;
  registration_site_address: string | null;
  manufacturing_sites: ManufacturingSite[] | null;
  extended_sites: unknown;
  remote_locations: RemoteLocation[] | null;
  surveillance_frequency: number | null;
  working_days: unknown;
  shifts: ShiftEntry[] | null;
  proposed_scope: string | null;
  outsourced_processes: string | null;
  iaf_code: string | null;
  nace_code: string | null;
  sic_code: string | null;
  primary_language: string | null;
  automotive_percentage: number | null;
  legal_obligations: boolean | null;
  legal_obligation_details: string | null;
  previous_iatf_certified: boolean | null;
  automotive_customers: unknown;
  annex4_eligibility: boolean | null;
  has_iatf_oem_customers: boolean | null;
  iatf_oem_customers: unknown;
  other_oem_customers: unknown;
  has_other_oem_customers: boolean | null;
  signed_contract_url: string | null;
  other_employees: number | null;
  signed_application_url: string | null;
  languages_spoken: LanguagesSpoken | null;
  mandays_file: unknown;
  audit_details: unknown;
  updated_at: string | null;
  application_type: string | null;
  attachment_base64: string | null;
  application_review_document: string | null;
}

export interface ClientRaw {
  id: string;
  cb_id: string;
  name: string;
  industry: string | null;
  kyc_status: string | null;
  onboarded_at: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  website: string | null;
  status: string | null;
  /** Joined relation – can be array or single object depending on query */
  application_master: ApplicationMasterRaw | ApplicationMasterRaw[] | null;
}

// ─── Domain sub-types ──────────────────────────────────────────────────────────

export interface ManufacturingSite {
  site_name: string;
  address: string;
  employees_mfg: string;
  employees_support: string;
  total_employees: string;
  remote_locations: RemoteLocation[];
}

export interface RemoteLocation {
  site_name: string;
  address: string;
  employees_mfg: string;
  employees_support: string;
  total_employees: string;
  support_functions: string[];
}

export interface ShiftEntry {
  shift: string;
  start: string;
  end: string;
}

export interface LanguagesSpoken {
  management: string;
  supporting: string;
  manufacturing: string;
}

export interface IatfOemCustomer {
  name: string;
  supplier_code: string;
  selected: boolean;
}

export interface OtherOemCustomer {
  name: string;
  supplier_code: string;
  OEM: boolean;
}

export interface AutomotiveCustomer {
  name: string;
  supplier_code: string;
}

// ─── Onboard payload ───────────────────────────────────────────────────────────

export interface OnboardClientPayload {
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  website: string;
  industry: string;
  application_type: "IATF" | "IAF";
  application: {
    type_of_audit: string;
    applicable_standards: string[];
    product_design_responsibility: string;
    manufacturing_sites: ManufacturingSite[];
    // remote_locations derived by service (flatMap from manufacturing_sites)
    iaf_code: string;
    nace_code: string;
    sic_code: string;
    languages_spoken: LanguagesSpoken;
    shifts: ShiftEntry[];
    working_days: string[];                 // jsonb column in application_master
    surveillance_frequency: number | null;  // integer column
    legal_obligations: boolean;
    legal_obligation_details: string;
    previous_iatf_certified: boolean;
    automotive_customers: AutomotiveCustomer[];
    automotive_percentage: string;          // stored as integer — service parses it
    annex4_eligibility: boolean;            // boolean column
    has_iatf_oem_customers: boolean;
    iatf_oem_customers: IatfOemCustomer[];
    has_other_oem_customers: boolean;
    other_oem_customers: OtherOemCustomer[];
    proposed_scope: string;
    outsourced_processes: string;
    attachment_base64: string | null;
  };
}

export interface UpdateApplicationStatusPayload {
  status: string;
  note?: string;
  review_document?: string;
}

export interface CreateContractPayload {
  application_id: string;
  contract_number: string;
  start_date?: string;
  end_date?: string;
  notes?: string;
  pdf_base64?: string | null;
}