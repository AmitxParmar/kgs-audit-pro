"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import { cn } from "@/lib/utils";

const RequiredLabel = ({ text }: { text: string }) => (
  <label className="text-sm font-medium">
    {text} <span className="text-red-500">*</span>
  </label>
);

const SUPPORT_FUNCTIONS = [
  "Aftersales",
  "Calibration",
  "Continuous Improvement",
  "Contract Review",
  "Customer Service",
  "Distribution",
  "Engineering",
  "Facilities Management",
  "Finance",
  "Human Resources",
  "Information Technology",
  "Internal Audit Management",
  "Laboratory",
  "Logistics",
  "Maintenance",
  "Management Review",
  "Marketing",
  "Packaging",
  "Policy Making",
  "Process Design",
  "Product Design",
  "Production Equipment Development",
  "Purchasing",
  "Quality System Management",
  "Research and Development",
  "Repair",
  "Sales",
  "Sequencing",
  "Servicing",
  "Strategic Planning",
  "Supplier Management",
  "Testing",
  "Training",
  "Warehousing",
  "Warranty Management",
];

export default function ClientOnboardingIATF({
  currentUserId,
  applicationId,
}: any) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [applicationType, setApplicationType] = useState<"IATF" | "IAF">("IATF");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [contacts, setContacts] = useState([
    { name: "", designation: "", phone: "", email: "" },
  ]);

  const [client, setClient] = useState({
    organization_name: "",
    contact_name: "",
    title: "",
    phone: "",
    fax: "",
    email: "",
    website: "",
    mailing_address: "",
    registration_site_address: "",
  });

  const addContact = () => {
    setContacts([
      ...contacts,
      { name: "", designation: "", phone: "", email: "" },
    ]);
  };

  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const updateContact = (index: number, key: string, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [key]: value };
    setContacts(updated);
  };

  const [app, setApp] = useState({
    type_of_audit: "",
    applicable_standards: [] as string[],
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
    working_days: [] as string[],
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

    iatf_oem_customers: [
      { name: "BMW Group", supplier_code: "", selected: false },
      { name: "Ford Motor Company", supplier_code: "", selected: false },
      { name: "Geely Holding Group", supplier_code: "", selected: false },
      { name: "General Motors", supplier_code: "", selected: false },
      { name: "IVECO Group", supplier_code: "", selected: false },
      {
        name: "Jaguar Land Rover (JLR) Limited",
        supplier_code: "",
        selected: false,
      },
      { name: "Mercedes-Benz Group AG", supplier_code: "", selected: false },
      { name: "Renault Group", supplier_code: "", selected: false },
      { name: "Stellantis (ex FCA)", supplier_code: "", selected: false },
      { name: "Stellantis (ex PSA)", supplier_code: "", selected: false },
      { name: "Volkswagen AG", supplier_code: "", selected: false },
      { name: "Volvo Group", supplier_code: "", selected: false },
    ],

    other_oem_customers: [{ name: "", supplier_code: "", OEM: false }],
  });

  const toggleArrayValue = (key: keyof typeof app, value: string) => {
    const arr = app[key] as string[];
    setApp({
      ...app,
      [key]: arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value],
    });
  };

  const generateClientCode = (name: string) =>
    `${name.substring(0, 3).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000,
    )}`;

  const uploadAttachment = async (code: string) => {
    if (!attachment) return null;
    const ext = attachment.name.split(".").pop();
    const path = `${code}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("client-documents")
      .upload(path, attachment);

    if (error) throw error;

    return supabase.storage.from("client-documents").getPublicUrl(path).data
      .publicUrl;
  };

  const safeInt = (value: string | number | null) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const calculateTotal = (mfg: string, support: string) => {
    const m = Number(mfg) || 0;
    const s = Number(support) || 0;
    return (m + s).toString();
  };

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

  const updateManufacturingSite = (
    index: number,
    key: string,
    value: string,
  ) => {
    const updated = [...app.manufacturing_sites];
    updated[index] = { ...updated[index], [key]: value };

    updated[index].total_employees = calculateTotal(
      updated[index].employees_mfg,
      updated[index].employees_support,
    );

    setApp({ ...app, manufacturing_sites: updated });
  };

  const addManufacturingSite = () => {
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
  };

  const removeManufacturingSite = (index: number) => {
    setApp({
      ...app,
      manufacturing_sites: app.manufacturing_sites.filter(
        (_, i) => i !== index,
      ),
    });
  };

  // following code removed
  // const updateRemoteLocation = (index: number, key: string, value: string) => {
  //   const updated = [...app.remote_locations];
  //   updated[index] = { ...updated[index], [key]: value };

  //   updated[index].total_employees = calculateTotal(
  //     updated[index].employees_mfg,
  //     updated[index].employees_support
  //   );

  //   setApp({ ...app, remote_locations: updated });
  // };

  // const addRemoteLocation = () => {
  //   setApp({
  //     ...app,
  //     remote_locations: [
  //       ...app.remote_locations,
  //       {
  //         site_name: "",
  //         address: "",
  //         employees_mfg: "",
  //         employees_support: "",
  //         total_employees: "",
  //       },
  //     ],
  //   });
  // };

  // const removeRemoteLocation = (index: number) => {
  //   setApp({
  //     ...app,
  //     remote_locations: app.remote_locations.filter((_, i) => i !== index),
  //   });
  // };

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

  const toggleRemoteSupportFunction = (
    mfgIndex: number,
    remoteIndex: number,
    func: string,
  ) => {
    const updated = [...app.manufacturing_sites];
    const remote = updated[mfgIndex].remote_locations[remoteIndex];

    remote.support_functions = remote.support_functions.includes(func)
      ? remote.support_functions.filter((f) => f !== func)
      : [...remote.support_functions, func];

    setApp({ ...app, manufacturing_sites: updated });
  };

  const updateRemoteLocation = (
    mfgIndex: number,
    remoteIndex: number,
    key: string,
    value: string,
  ) => {
    const updated = [...app.manufacturing_sites];
    const remote = updated[mfgIndex].remote_locations[remoteIndex];

    remote[key] = value;
    remote.total_employees = calculateTotal(
      remote.employees_mfg,
      remote.employees_support,
    );

    setApp({ ...app, manufacturing_sites: updated });
  };

  const removeRemoteLocation = (mfgIndex: number, remoteIndex: number) => {
    const updated = [...app.manufacturing_sites];
    updated[mfgIndex].remote_locations = updated[
      mfgIndex
    ].remote_locations.filter((_, i) => i !== remoteIndex);

    setApp({ ...app, manufacturing_sites: updated });
  };

  const toggleOEM = (index: number) => {
    const updated = [...app.iatf_oem_customers];
    updated[index].selected = !updated[index].selected;
    setApp({ ...app, iatf_oem_customers: updated });
  };

  const updateSupplierCode = (index: number, value: string) => {
    const updated = [...app.iatf_oem_customers];
    updated[index].supplier_code = value;
    setApp({ ...app, iatf_oem_customers: updated });
  };

  const updateOtherOEM = (index: number, key: string, value: string) => {
    const updated = [...app.other_oem_customers];
    updated[index] = { ...updated[index], [key]: value };
    setApp({ ...app, other_oem_customers: updated });
  };

  // const handleSubmit = async () => {
  //   const missingFields: string[] = [];

  //   if (!app.type_of_audit) missingFields.push("Type of Audit");
  //   if (app.applicable_standards.length === 0)
  //     missingFields.push("Applicable Standards");
  //   if (!app.product_design_responsibility)
  //     missingFields.push("Product Design Responsibility");
  //   if (!client.organization_name) missingFields.push("Organization Name");
  //   if (!client.registration_site_address)
  //     missingFields.push("Manufacturing Site Address");
  //   if (!app.proposed_scope) missingFields.push("Proposed Scope");
  //   if (!app.outsourced_processes) missingFields.push("Outsourced Processes");
  //   if (!attachment) missingFields.push("Supporting Document");

  //   if (contacts.length === 0) {
  //     missingFields.push("At least one contact");
  //   } else {
  //     contacts.forEach((c, i) => {
  //       if (!c.name.trim()) missingFields.push(`Contact ${i + 1} Name`);
  //       if (!c.designation.trim())
  //         missingFields.push(`Contact ${i + 1} Designation`);
  //       if (!c.phone.trim()) missingFields.push(`Contact ${i + 1} Phone`);
  //       if (!c.email.trim()) missingFields.push(`Contact ${i + 1} Email`);
  //     });
  //   }

  //   if (missingFields.length > 0) {
  //     toast.error(
  //       <div className="space-y-1">
  //         <p>Please fill all the following mandatory fields:</p>
  //         <ul className="list-disc ml-5 text-sm">
  //           {missingFields.map((f, idx) => (
  //             <li key={idx}>{f}</li>
  //           ))}
  //         </ul>
  //       </div>,
  //     );
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     let finalApplicationId = applicationId;

  //     const client_code = generateClientCode(client.organization_name);

  //     let clientRow;

  //     // =========================
  //     // CREATE CLIENT (ONLY IF NEW APPLICATION)
  //     // =========================
  //     if (!applicationId) {
  //       const { data, error } = await supabase
  //         .from("clients")
  //         .insert({
  //           company_name: client.organization_name,
  //           contact_name: contacts[0].name,
  //           contact_email: contacts[0].email,
  //           contact_phone: contacts[0].phone,
  //           title: contacts[0].designation,
  //           address: client.mailing_address || null,
  //           fax: client.fax || null,
  //           website: client.website || null,
  //           client_code,
  //           created_by: currentUserId,
  //           assigned_to: currentUserId,
  //           created_date: new Date(),
  //         })
  //         .select("id, client_code")
  //         .single();

  //       if (error) throw error;
  //       clientRow = data;
  //     }

  //     const attachment_url = await uploadAttachment(
  //       clientRow?.client_code || client_code,
  //     );

  //     const appPayload = {
  //       client_id: clientRow?.id,
  //       standard: app.applicable_standards.join(", "),
  //       type_of_audit: app.type_of_audit,
  //       product_design_responsibility: app.product_design_responsibility,
  //       manufacturing_sites: app.manufacturing_sites,
  //       proposed_scope: app.proposed_scope,
  //       outsourced_processes: app.outsourced_processes,
  //       shifts: app.shifts,
  //       working_days: app.working_days,
  //       iaf_code: app.iaf_code,
  //       nace_code: app.nace_code,
  //       sic_code: app.sic_code,
  //       languages_spoken: app.languages_spoken,
  //       automotive_percentage: app.automotive_percentage
  //         ? safeInt(app.automotive_percentage)
  //         : null,
  //       legal_obligations: app.legal_obligations,
  //       legal_obligation_details: app.legal_obligation_details,
  //       previous_iatf_certified: app.previous_iatf_certified,
  //       has_iatf_oem_customers: app.has_iatf_oem_customers,
  //       iatf_oem_customers: app.has_iatf_oem_customers
  //         ? app.iatf_oem_customers.filter((o) => o.selected)
  //         : [],
  //       has_other_oem_customers: app.has_other_oem_customers,
  //       other_oem_customers: app.has_other_oem_customers
  //         ? app.other_oem_customers.filter((o) => o.OEM && o.name)
  //         : [],
  //       attachment_url,
  //       status: applicationId ? "application_review" : "pending",
  //       last_action_role: "client",
  //       updated_at: new Date().toISOString(),
  //     };

  //     // =========================
  //     // UPDATE EXISTING APPLICATION
  //     // =========================
  //     if (applicationId) {
  //       const { error: updateErr } = await supabase
  //         .from("application_master")
  //         .update(appPayload)
  //         .eq("application_id", applicationId);

  //       if (updateErr) throw updateErr;

  //       // UPSERT CONTACTS
  //       for (const c of contacts) {
  //         await supabase.from("Contacts").upsert(
  //           {
  //             application_id: applicationId,
  //             Name: c.name,
  //             Designation: c.designation,
  //             Phone: c.phone ? Number(c.phone) : null,
  //             Email: c.email,
  //           },
  //           { onConflict: ["Email"] },
  //         );
  //       }

  //       toast.success("Application updated successfully");
  //     }

  //     // =========================
  //     // INSERT NEW APPLICATION
  //     // =========================
  //     else {
  //       const { data: newApp, error: insertErr } = await supabase
  //         .from("application_master")
  //         .insert(appPayload)
  //         .select("application_id")
  //         .single();

  //       if (insertErr) throw insertErr;

  //       finalApplicationId = newApp.application_id;

  //       const contactsPayload = contacts.map((c) => ({
  //         application_id: finalApplicationId,
  //         Name: c.name,
  //         Designation: c.designation,
  //         Phone: c.phone ? Number(c.phone) : null,
  //         Email: c.email,
  //       }));

  //       await supabase.from("Contacts").insert(contactsPayload);

  //       toast.success("IATF Application Submitted");
  //     }

  //     navigate(`/onboarding/success?appId=${finalApplicationId}`);
  //   } catch (err: any) {
  //     toast.error(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async () => {
  const applicationData = {
    id: Date.now(),
    type: applicationType, // ⭐ THIS IS KEY
    client,
    contacts,
    app,
  };

  const existingApps =
    JSON.parse(localStorage.getItem("applications") || "[]");

  const updatedApps = [...existingApps, applicationData];

  localStorage.setItem("applications", JSON.stringify(updatedApps));

  toast.success("Application stored sucessfully");

  navigate("/client-page");
};

  const confirmScopeChange = async () => {
    if (!applicationId) {
      toast.error("No application selected for scope change.");
      return;
    }

    if (!app.proposed_scope || app.proposed_scope.trim() === "") {
      toast.error("Please enter the proposed scope before confirming.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase
        .from("application_master")
        .update({
          proposed_scope: app.proposed_scope,
          last_action_role: "client",
          status: "scope_review",
          updated_at: new Date().toISOString(),
        })
        .eq("application_id", applicationId);

      if (error) throw error;

      toast.success("Scope updated successfully!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!applicationId) return; // if creating new, skip

    const fetchAppData = async () => {
      try {
        // Fetch application master
        const { data, error } = await supabase
          .from("application_master")
          .select("*")
          .eq("application_id", applicationId)
          .single();

        if (error) throw error;

        // Populate app state
        setApp({
          ...app,
          ...data,
          manufacturing_sites: data.manufacturing_sites || [],
          applicable_standards: data.standard?.split(", ") || [],
          languages_spoken: data.languages_spoken || {
            management: "",
            supporting: "",
            manufacturing: "",
          },
          proposed_scope: data.proposed_scope || "",
          outsourced_processes: data.outsourced_processes || "",
          shifts: data.shifts || [
            { shift: "shift1", start: "08:00", end: "16:00" },
            { shift: "shift2", start: "", end: "" },
            { shift: "shift3", start: "", end: "" },
          ],
          iaf_code: data.iaf_code || "",
          nace_code: data.nace_code || "",
          sic_code: data.sic_code || "",
        });

        // Populate client info
        if (data.client_id) {
          const { data: clientData, error: clientErr } = await supabase
            .from("clients")
            .select("*")
            .eq("id", data.client_id)
            .single();

          if (clientErr) throw clientErr;

          setClient({
            organization_name: clientData.company_name || "",
            contact_name: clientData.contact_name || "",
            title: clientData.title || "",
            phone: clientData.contact_phone || "",
            fax: clientData.fax || "",
            email: clientData.contact_email || "",
            website: clientData.website || "",
            mailing_address: clientData.address || "",
            registration_site_address:
              data.manufacturing_sites?.[0]?.address || "",
          });
        }

        // Fetch contacts
        const { data: contactsData } = await supabase
          .from("Contacts")
          .select("*")
          .eq("application_id", applicationId);

        setContacts(
          contactsData?.map((c: any) => ({
            name: c.Name,
            designation: c.Designation,
            phone: c.Phone ? String(c.Phone) : "",
            email: c.Email,
          })) || [{ name: "", designation: "", phone: "", email: "" }],
        );
      } catch (err: any) {
        toast.error("Failed to fetch application data: " + err.message);
      }
    };

    fetchAppData();
  }, [applicationId]);

  return (
  <div className="min-h-screen py-10 px-4 flex justify-center bg-gray-900 text-white">
      <div className="w-full max-w-6xl space-y-8">
       
        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
              {app.applicable_standards.length
                ? `${app.applicable_standards.join(" / ")} – Organization Profile`
                : "Organization Profile"}
            </CardTitle>
          </CardHeader>
        </Card>
         <Card className="bg-card border border-border shadow-sm rounded-2xl">
  <CardHeader>
    <CardTitle>
      Select Application Type <span className="text-red-500">*</span>
    </CardTitle>
  </CardHeader>

  <CardContent className="flex gap-6">
    {["IATF", "IAF"].map((type) => (
      <label key={type} className="flex gap-2">
        <input
          type="radio"
          checked={applicationType === type}
          onChange={() => setApplicationType(type as "IATF" | "IAF")}
        />
        {type}
      </label>
    ))}
  </CardContent>
</Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              Type of Quote <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              "Re-Certification Audit",
              "Registration Audit",
              "Pre-Assessment Audit",
              "Transfer Audit",
              "Special Audit",
            ].map((v) => (
              <label key={v} className="flex gap-2">
                <input
                  type="radio"
                  checked={app.type_of_audit === v}
                  onChange={() => setApp({ ...app, type_of_audit: v })}
                />
                {v}
              </label>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              Applicable Standards <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-3">
            {[
              "ISO 9001:2015",
              "ISO 14001:2015",
              "ISO 45001:2018",
              "ISO 13485:2016",
              "ISO 22000:2018",
              "GOOD MANUFACTURING PRACTICES (GMP)",
              "HACCP SYSTEMS (HACCP)",
              "IATF 16949:2016",
            ].map((std) => (
              <label key={std} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={app.applicable_standards.includes(std)}
                  onChange={() => toggleArrayValue("applicable_standards", std)}
                />
                {std}
              </label>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              Product Design Responsibility{" "}
              <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6">
            {["Client Responsible", "Customer Responsible"].map((v) => (
              <label key={v} className="flex gap-2">
                <input
                  type="radio"
                  checked={app.product_design_responsibility === v}
                  onChange={() =>
                    setApp({ ...app, product_design_responsibility: v })
                  }
                />
                {v}
              </label>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div >
                <RequiredLabel text="Organization Name" />
                <Input
               className=""
                  value={client.organization_name}
                  onChange={(e) =>
                    setClient({ ...client, organization_name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={client.website}
                  onChange={(e) =>
                    setClient({ ...client, website: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <RequiredLabel text="Manufacturing Site PinCode/ ZipCode" />
              <Textarea
                rows={3}
                value={client.registration_site_address}
                onChange={(e) =>
                  setClient({
                    ...client,
                    registration_site_address: e.target.value,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

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
                      required
                      value={c.name}
                      onChange={(e) =>
                        updateContact(index, "name", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <RequiredLabel text="Designation" />
                    <Input
                      required
                      value={c.designation}
                      onChange={(e) =>
                        updateContact(index, "designation", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <RequiredLabel text="Phone" />
                    <Input
                      required
                      value={c.phone}
                      onChange={(e) =>
                        updateContact(index, "phone", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <RequiredLabel text="Email" />
                    <Input
                      required
                      type="email"
                      value={c.email}
                      onChange={(e) =>
                        updateContact(index, "email", e.target.value)
                      }
                    />
                  </div>
                </div>

                {contacts.length > 1 && (
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeContact(index)}
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
              onClick={addContact}
              className="w-fit"
            >
              + Add Another Contact
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader></CardHeader>

          <CardContent className="space-y-10">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Manufacturing Sites *
              </h3>

              <div className="space-y-6">
                {app.manufacturing_sites.map((site, index) => (
                  <div key={index} className="border p-5 rounded-lg space-y-4">
                    <Input
                      placeholder={
                        index === 0
                          ? "Manufacturing Site"
                          : "Extended Manufacturing Site"
                      }
                      value={site.site_name}
                      onChange={(e) =>
                        updateManufacturingSite(
                          index,
                          "site_name",
                          e.target.value,
                        )
                      }
                    />

                    <Textarea
                      placeholder="Address"
                      value={site.address}
                      onChange={(e) =>
                        updateManufacturingSite(
                          index,
                          "address",
                          e.target.value,
                        )
                      }
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <Input
                        placeholder="Employees Mfg"
                        type="number"
                        value={site.employees_mfg}
                        onChange={(e) =>
                          updateManufacturingSite(
                            index,
                            "employees_mfg",
                            e.target.value,
                          )
                        }
                      />
                      <Input
                        placeholder="Employees Support"
                        type="number"
                        value={site.employees_support}
                        onChange={(e) =>
                          updateManufacturingSite(
                            index,
                            "employees_support",
                            e.target.value,
                          )
                        }
                      />
                      <Input
                        placeholder="Total Employees"
                        value={site.total_employees}
                        disabled
                      />
                    </div>

                    {/* ✅ SHOW REMOTE LOCATIONS ONLY FOR FIRST SITE */}
                    {index === 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">
                          Associated Remote Locations
                        </h4>

                        {site.remote_locations.map((remote, rIndex) => (
                          <div
                            key={rIndex}
                            className="border p-4 rounded-lg space-y-3"
                          >
                            <Input
                              placeholder="Remote Location Name"
                              value={remote.site_name}
                              onChange={(e) =>
                                updateRemoteLocation(
                                  index,
                                  rIndex,
                                  "site_name",
                                  e.target.value,
                                )
                              }
                            />

                            <Textarea
                              placeholder="Address"
                              value={remote.address}
                              onChange={(e) =>
                                updateRemoteLocation(
                                  index,
                                  rIndex,
                                  "address",
                                  e.target.value,
                                )
                              }
                            />

                            <div className="mt-4">
                              <label className="text-sm font-medium mb-2 block">
                                Support Functions
                              </label>

                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-between min-h-[44px] px-3"
                                  >
                                    <div className="flex flex-wrap gap-1 max-w-[90%]">
                                      {remote.support_functions?.length > 0 ? (
                                        remote.support_functions.map((func) => (
                                          <Badge
                                            key={func}
                                            variant="secondary"
                                            className="truncate max-w-[180px]"
                                          >
                                            {func}
                                          </Badge>
                                        ))
                                      ) : (
                                        <span className="text-muted-foreground text-sm">
                                          Select support functions
                                        </span>
                                      )}
                                    </div>
                                    <ChevronDown className="h-4 w-4 opacity-60 shrink-0" />
                                  </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                  align="start"
                                  className="w-full p-0"
                                >
                                  <Command>
                                    <div className="border-b px-3 py-2">
                                      <Input
                                        placeholder="Search support functions..."
                                        className="h-9"
                                      />
                                    </div>

                                    <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
                                      No function found
                                    </CommandEmpty>

                                    <CommandGroup className="max-h-[260px] overflow-auto">
                                      {SUPPORT_FUNCTIONS.map((func) => {
                                        const selected =
                                          remote.support_functions?.includes(
                                            func,
                                          );

                                        return (
                                          <CommandItem
                                            key={func}
                                            onSelect={() =>
                                              toggleRemoteSupportFunction(
                                                index,
                                                rIndex,
                                                func,
                                              )
                                            }
                                            className="flex items-center gap-2 px-4 py-2"
                                          >
                                            <Check
                                              className={cn(
                                                "h-4 w-4",
                                                selected
                                                  ? "opacity-100"
                                                  : "opacity-0",
                                              )}
                                            />
                                            <span className="text-sm">
                                              {func}
                                            </span>
                                          </CommandItem>
                                        );
                                      })}
                                    </CommandGroup>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <Input
                                type="number"
                                placeholder="Employees Support"
                                value={remote.employees_support}
                                onChange={(e) =>
                                  updateRemoteLocation(
                                    index,
                                    rIndex,
                                    "employees_support",
                                    e.target.value,
                                  )
                                }
                              />
                              <Input disabled value={remote.total_employees} />
                            </div>

                            <Button
                              variant="destructive"
                              onClick={() =>
                                removeRemoteLocation(index, rIndex)
                              }
                            >
                              Remove Remote Location
                            </Button>
                          </div>
                        ))}

                        <Button
                          variant="outline"
                          onClick={() => addRemoteLocation(index)}
                          className="mt-2"
                        >
                          + Add Remote Location
                        </Button>
                      </div>
                    )}

                    {app.manufacturing_sites.length > 1 && (
                      <Button
                        variant="destructive"
                        onClick={() => removeManufacturingSite(index)}
                      >
                        Remove Site
                      </Button>
                    )}
                  </div>
                ))}

                <Button variant="outline" onClick={addManufacturingSite}>
                  + Add Extended Manufacturing Site
                </Button>
              </div>
            </div>

            {/* <div>
      <h3 className="text-lg font-semibold mb-4">
        Remote Locations
      </h3>

      <div className="space-y-6">
        {app.remote_locations.map((site, index) => (
          <div key={index} className="border p-5 rounded-lg space-y-4">
            <Input
              placeholder="Remote Location Name"
              value={site.site_name}
              onChange={(e) =>
                updateRemoteLocation(index, "site_name", e.target.value)
              }
            />

            <Textarea
              placeholder="Address"
              value={site.address}
              onChange={(e) =>
                updateRemoteLocation(index, "address", e.target.value)
              }
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                placeholder="Employees Mfg"
                type="number"
                value={site.employees_mfg}
                onChange={(e) =>
                  updateRemoteLocation(index, "employees_mfg", e.target.value)
                }
              />
              <Input
                placeholder="Employees Support"
                type="number"
                value={site.employees_support}
                onChange={(e) =>
                  updateRemoteLocation(index, "employees_support", e.target.value)
                }
              />
              <Input
                placeholder="Total Employees"
                value={site.total_employees}
                disabled
              />
            </div>

            {app.remote_locations.length > 1 && (
              <Button
                variant="destructive"
                onClick={() => removeRemoteLocation(index)}
              >
                Remove Location
              </Button>
            )}
          </div>
        ))}

        <Button variant="outline" onClick={addRemoteLocation}>
          + Add Remote Location
        </Button>
      </div>
    </div> */}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              IAF / NACE / SIC Codes
              <span className="block text-sm font-normal text-muted-foreground mt-1">
                (If unknown, leave blank)
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">
                IAF Code <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 17"
                value={app.iaf_code}
                onChange={(e) => setApp({ ...app, iaf_code: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">NACE Code</label>

              <Input
                placeholder="e.g. C29.32"
                value={app.nace_code}
                onChange={(e) => setApp({ ...app, nace_code: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">SIC Code</label>

              <Input
                placeholder="e.g. 3714"
                value={app.sic_code}
                onChange={(e) => setApp({ ...app, sic_code: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Language spoken on site</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-6 items-center">
              <Label>Management personnel</Label>
              <Input
                placeholder="e.g. English"
                value={app.languages_spoken.management}
                onChange={(e) =>
                  setApp({
                    ...app,
                    languages_spoken: {
                      ...app.languages_spoken,
                      management: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6 items-center">
              <Label>Supporting personnel</Label>
              <Input
                placeholder="e.g. English"
                value={app.languages_spoken.supporting}
                onChange={(e) =>
                  setApp({
                    ...app,
                    languages_spoken: {
                      ...app.languages_spoken,
                      supporting: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6 items-center">
              <Label>Manufacturing personnel</Label>
              <Input
                placeholder="e.g. English"
                value={app.languages_spoken.manufacturing}
                onChange={(e) =>
                  setApp({
                    ...app,
                    languages_spoken: {
                      ...app.languages_spoken,
                      manufacturing: e.target.value,
                    },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Shift Timings</CardTitle>
            <CardDescription>
              Define working hours for each shift
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {app.shifts.map((shift, index) => (
              <div
                key={shift.shift}
                className="grid grid-cols-3 gap-4 items-center"
              >
                <Label className="capitalize">{shift.shift}</Label>

                <Input
                  type="time"
                 className="bg-background border-border"
                  value={shift.start}
                  onChange={(e) => {
                    const updated = [...app.shifts];
                    updated[index].start = e.target.value;
                    setApp({ ...app, shifts: updated });
                  }}
                />

                <Input
                  type="time"
                  className="bg-background border-border"
                  value={shift.end}
                  onChange={(e) => {
                    const updated = [...app.shifts];
                    updated[index].end = e.target.value;
                    setApp({ ...app, shifts: updated });
                  }}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Legal Obligations & IATF Certification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium">
                Does your company have any relevant legal obligations
                (bankruptcies, legal proceedings, etc.)?
              </label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={app.legal_obligations === true}
                    onChange={() => setApp({ ...app, legal_obligations: true })}
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={app.legal_obligations === false}
                    onChange={() =>
                      setApp({ ...app, legal_obligations: false })
                    }
                  />
                  No
                </label>
              </div>

              {app.legal_obligations && (
                <Textarea
                  placeholder="If yes, please describe"
                  value={app.legal_obligation_details}
                  onChange={(e) =>
                    setApp({ ...app, legal_obligation_details: e.target.value })
                  }
                  rows={3}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">
                Are you currently certified or have you been previously
                certified to IATF 16949?
              </label>
              <div className="flex gap-6 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={app.previous_iatf_certified === true}
                    onChange={() =>
                      setApp({ ...app, previous_iatf_certified: true })
                    }
                  />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={app.previous_iatf_certified === false}
                    onChange={() =>
                      setApp({ ...app, previous_iatf_certified: false })
                    }
                  />
                  No
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              Automotive Customers are (Automotive Customers (IATF) )
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
                checked={app.has_iatf_oem_customers}
                onChange={(e) =>
                  setApp({
                    ...app,
                    has_iatf_oem_customers: e.target.checked,
                  })
                }
              />
              We have IATF OEM Automotive Customers
            </label>

            {app.has_iatf_oem_customers && (
              <div className="space-y-3 pt-3">
                {app.iatf_oem_customers.map((oem, index) => (
                  <div
                    key={oem.name}
                    className="grid grid-cols-3 gap-4 items-center"
                  >
                    <label className="flex gap-2 col-span-1">
                      <input
                        type="checkbox"
                        checked={oem.selected}
                        onChange={() => toggleOEM(index)}
                      />
                      {oem.name}
                    </label>

                    <Input
                      disabled={!oem.selected}
                      placeholder="Supplier Code"
                      value={oem.supplier_code}
                      onChange={(e) =>
                        updateSupplierCode(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>Other Automotive OEM / Automotive Customers</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={app.has_other_oem_customers}
                onChange={(e) =>
                  setApp({
                    ...app,
                    has_other_oem_customers: e.target.checked,
                  })
                }
              />
              We have other Automotive OEM customers
            </label>

            {app.has_other_oem_customers && (
              <div className="space-y-4">
                {app.other_oem_customers.map((o, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-4 items-center"
                  >
                    {/* Customer Name */}
                    <Input
                      className="col-span-5"
                      placeholder="Customer Name"
                      value={o.name}
                      onChange={(e) =>
                        updateOtherOEM(index, "name", e.target.value)
                      }
                    />

                    {/* Supplier Code */}
                    <Input
                      className="col-span-5"
                      placeholder="Supplier Code"
                      value={o.supplier_code}
                      onChange={(e) =>
                        updateOtherOEM(index, "supplier_code", e.target.value)
                      }
                    />

                    {/* OEM Checkbox */}
                    <div className="col-span-2 flex items-center justify-end gap-2 mr-10">
                      <input
                        type="checkbox"
                        checked={o.OEM}
                        onChange={(e) => {
                          const updated = [...app.other_oem_customers];
                          updated[index].OEM = e.target.checked;
                          setApp({ ...app, other_oem_customers: updated });
                        }}
                      />

                      <span className="text-sm font-medium">OEM</span>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setApp({
                      ...app,
                      other_oem_customers: [
                        ...app.other_oem_customers,
                        {
                          name: "",
                          supplier_code: "",
                          OEM: false,
                        },
                      ],
                    });
                  }}
                >
                  + Add More OEM Customer
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle>
              Scope & Outsourced Processes{" "}
              <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Proposed Scope of Registration"
              value={app.proposed_scope}
              onChange={(e) =>
                setApp({ ...app, proposed_scope: e.target.value })
              }
            />
            <Textarea
              placeholder="Outsourced Processes"
              value={app.outsourced_processes}
              onChange={(e) =>
                setApp({ ...app, outsourced_processes: e.target.value })
              }
            />
          </CardContent>
        </Card>

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
              onChange={(e) => setAttachment(e.target.files?.[0] || null)}
            />
          </CardContent>
        </Card>

        <Button
          onClick={handleSubmit}
          disabled={loading}
           className="w-full text-lg py-6 rounded-2xl border border-white cursor-pointer hover:bg-gray-700  font-semibold shadow-md"
        >
          {loading ? "Submitting..." : "Submit IATF Application"}
        </Button>
      </div>
    </div>
  );
}
