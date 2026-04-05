import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, Clock } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";
import { apiFetch } from "@/services/api";

type ContextType = {
  ctx: "both" | "iatf" | "iaf";
};

const STANDARD_MASTER = {
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

const STAGE_PROGRESS_MAP: Record<string, number> = {
  "Application Received": 14,
  "Application Review": 28,
  "Contract Creation": 42,
  "Contract Review": 57,
  "Contract Sent": 71,
  "Contract Signed": 85,
  "Onboarding Complete": 100,
};

const STAGE_COUNT_MAP: Record<string, string> = {
  "Application Received": "Stage 1 of 7",
  "Application Review": "Stage 2 of 7",
  "Contract Creation": "Stage 3 of 7",
  "Contract Review": "Stage 4 of 7",
  "Contract Sent": "Stage 5 of 7",
  "Contract Signed": "Stage 6 of 7",
  "Onboarding Complete": "Stage 7 of 7",
};


export function ClientsPage() {
  const navigate = useNavigate();

  const [typeFilter, setTypeFilter] = useState<"ALL" | "IAF" | "IATF">("ALL");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [clients, setClients] = useState<any[]>([]);
const [selectedClient, setSelectedClient] = useState<any | null>(null);
const [note, setNote] = useState("");
 const { ctx } = useOutletContext<ContextType>();
const [decisionType, setDecisionType] = useState<string | null>(null);
const [activeModal, setActiveModal] = useState<"review" | "contract" | null>(null);

const [reason, setReason] = useState("");
  const stages = [
    "Application Received",
    "Application Review",
    "Contract Creation",
    "Contract Review",
    "Contract Sent",
    "Contract Signed",
    "Onboarding Complete",
  ];

  const [signedData, setSignedData] = useState({
  checklist: {
    email_sent: false,
    signed_contract_received: false,
    signed_contract_uploaded: false,
  },
  file: null as File | null,
  signedApplicationFile: null as File | null,
  notes: "",
  scopeChange: {
    enabled: false,
    type: "" as "commercial_amendment" | "scope_change" | "",
  },
  audit: {} as Record<string, string>,
});



  
const [contractData, setContractData] = useState({
  contractName: "",
  contractNumber: "",
  applicationId: "",
  startDate: "",
  endDate: "",
  terms: "",
  notes: "",
  standardIds: [] as number[],
  mandaysSheetFile: null as File | null,
   reviewedFile: null as File | null,
});

  const [standards, setStandards] = useState<any[]>([]);
const filteredClients = clients.filter((c) => {
  if (stageFilter && c.stage !== stageFilter) return false;

  if (ctx !== "both" && c.type?.toUpperCase() !== ctx.toUpperCase()) {
    return false;
  }

  if (typeFilter !== "ALL" && c.type?.toUpperCase() !== typeFilter) {
    return false;
  }

  return true;
});


useEffect(() => {
  // Example: fetch standards from localStorage or API
  const savedStandards = JSON.parse(localStorage.getItem("standards") || "[]");
  setStandards(savedStandards);
}, []);

const baseList = clients.filter((c) => {

  if (ctx !== "both") {
    if (c.type?.toUpperCase() !== ctx.toUpperCase()) return false;
  }

  
  if (typeFilter !== "ALL") {
    if (c.type !== typeFilter) return false;
  }

  return true;
});

const totalClients = baseList.length;

const inProgress = baseList.filter(
  (c) =>
    c.stage !== "Onboarding Complete" &&
    c.stage !== "Contract Signed"
).length;

const completed = baseList.filter(
  (c) => c.stage === "Onboarding Complete"
).length;

const overdue = 0; // temporary


function mapStatus(status: string) {
  switch (status) {
    case "pending":
      return "Application Received";
    case "application_received":
      return "Application Received";
    case "application_review":
      return "Application Review";
    case "contract_creation":
      return "Contract Creation";
    case "contract_review":
      return "Contract Review";
    case "contract_sent":
      return "Contract Sent";
    case "contract_signed":
      return "Contract Signed";
    case "completed":
      return "Onboarding Complete";
    default:
      return "Application Received";
  }
}

 useEffect(() => {
  async function fetchClients() {
    try {
      const clients = await apiFetch("/api/client-onboarding");

      console.log("API RESPONSE:", clients);

    const formatted = clients.map((client: any) => {
  const app = client.application_master?.[0]; // ✅ FIX

  console.log("TYPE CHECK:", app?.application_type);

  return {
    name: client.name,
    code: `CLI-${client.id.slice(0, 6)}`,
    email: client.contact_email,
    phone: client.contact_phone,
    date: `Created ${new Date(client.created_at).toLocaleDateString()}`,
    scope: client.industry || "N/A",

    stage: mapStatus(app?.status || "pending"),
    progress:
      STAGE_PROGRESS_MAP[mapStatus(app?.status || "pending")] || 14,
    stageCount:
      STAGE_COUNT_MAP[mapStatus(app?.status || "pending")] ||
      "Stage 1 of 7",

    type: app?.application_type
      ? app.application_type.trim().toUpperCase()
      : "IAF",
  };

  
});



      setClients(formatted);
    } catch (err) {
      console.error(err);
    }
  }

  fetchClients();
}, []);


const filteredStandards =
  selectedClient?.type === "IAF"
    ? STANDARD_MASTER.IAF
    : selectedClient?.type === "IATF"
    ? STANDARD_MASTER.IATF
    : [];

function handleSendToReview() {
  if (!selectedClient) return;

  if (!note.trim()) {
    toast.error("Please add a review note before submitting");
    return;
  }

  const stored = JSON.parse(localStorage.getItem("applications") || "[]");

  const updated = stored.map((app: any) => {
    const code = `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`;

    if (code === selectedClient.code) {
      return {
        ...app,
        stage: "Application Review",
        reviewNote: note,
      };
    }
    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));

  const refreshed = updated.map((app: any) => ({
    name: app.client.organization_name,
    code: `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`,
    email: app.contacts?.[0]?.email || "N/A",
    phone: app.contacts?.[0]?.phone || "N/A",
    date: `Applied ${new Date(app.id).toLocaleDateString()}`,
    scope: app.app.proposed_scope || "N/A",
    stage: app.stage || "Application Received",
   progress: STAGE_PROGRESS_MAP[app.stage] || 14,
stageCount: STAGE_COUNT_MAP[app.stage] || "Stage 1 of 7",
    type: (app.type || "").toUpperCase().trim(),
  }));

  setClients(refreshed);

 
  toast.success("Moved to Application Review ");

  setSelectedClient(null);
  setNote("");
}

function handleConfirmDecision() {
  if (!reason.trim()) {
    toast.error("Please enter a reason");
    return;
  }

  const stored = JSON.parse(localStorage.getItem("applications") || "[]");

  const updated = stored.map((app: any) => {
    const code = `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`;

    if (code === selectedClient.code) {

      if (decisionType === "approve") {
        return { ...app, stage: "Contract Creation", decisionNote: reason };
      }

      if (decisionType === "reject") {
        return { ...app, stage: "Rejected", decisionNote: reason };
      }

      if (decisionType === "more_info") {
        return { ...app, stage: "Application Received", decisionNote: reason };
      }
    }

    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));

  // 🔥 Refresh UI
  window.location.reload();

  // Toasts
  if (decisionType === "approve") {
    toast.success("Moved to Contract Creation 🚀");
  } else if (decisionType === "reject") {
    toast.error("Application Rejected ❌");
  } else {
    toast("Sent back for more info 🔁");
  }

  setDecisionType(null);
  setReason("");
  setSelectedClient(null);
}


function handleCreateContract() {
  if (!contractData.contractNumber || !contractData.applicationId) {
    toast.error("Please fill all required fields");
    return;
  }

  const stored = JSON.parse(localStorage.getItem("applications") || "[]");

  const updated = stored.map((app: any) => {
    const code = `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`;
    if (code === selectedClient?.code) {
      return {
        ...app,
        stage: "Contract Review",
        contract: {
          ...contractData,
          status: "Draft",
        },
        applications: [
          {
            application_id: app.id,
            status: "Draft",
          },
        ],
      };
    }
    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));

  // ✅ REFRESH UI
  setClients(
    updated.map((app: any) => ({
      name: app.client.organization_name,
      code: `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`,
      email: app.contacts?.[0]?.email || "N/A",
      phone: app.contacts?.[0]?.phone || "N/A",
      date: `Applied ${new Date(app.id).toLocaleDateString()}`,
      scope: app.app.proposed_scope || "N/A",
      stage: app.stage || "Application Received",
      progress: STAGE_PROGRESS_MAP[app.stage] || 14,
stageCount: STAGE_COUNT_MAP[app.stage] || "Stage 1 of 7",
      type: (app.type || "").toUpperCase().trim(),

       contract: app.contract || null,
      applications: [
        {
          application_id: app.id,
          status: app.contract?.status || "Draft",
        },
      ],
    }))
  );

  
  setStageFilter(null);

  toast.success("Contract Created ✅");

  setIsContractModalOpen(false);
  setContractData({
    contractName: "",
    contractNumber: "",
    applicationId: "",
    startDate: "",
    endDate: "",
    terms: "",
    notes: "",
    standardIds: [],
    mandaysSheetFile: null,
  });

  setSelectedClient(null);
}

function handleCloseTask() {
  const stored = JSON.parse(localStorage.getItem("applications") || "[]");

  const updated = stored.map((app: any) => {
    const code = `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`;

    if (code === selectedClient.code) {
      return {
        ...app,
        stage: "Contract Signed",
        contract: {
          ...app.contract,
          checklist: {
            ...app.contract?.checklist,
            task_closed: true,
          },
        },
      };
    }
    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));
  toast.success("Moved to Contract Signed ✅");
  window.location.reload();
}
  

function toggleChecklist(key: string) {
  const stored = JSON.parse(localStorage.getItem("applications") || "[]");

  const updated = stored.map((app: any) => {
    const code = `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`;

    if (code === selectedClient.code) {
      return {
        ...app,
        contract: {
          ...app.contract,
          checklist: {
            ...app.contract?.checklist,
            [key]: !app.contract?.checklist?.[key],
          },
        },
      };
    }
    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));
  window.location.reload();
}


function handleCompleteOnboarding() {
  const stored = JSON.parse(localStorage.getItem("applications") || "[]");

  const updated = stored.map((app: any) => {
    const code = `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`;

    if (code === selectedClient.code) {
      return {
        ...app,
        stage: "Onboarding Complete",
        signedData,
      };
    }
    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));

  toast.success("Onboarding Completed ");

  window.location.reload();
}

function handleContractAction(type: "approve" | "reject" | "save") {
  const stored = JSON.parse(localStorage.getItem("applications") || "[]");

  const updated = stored.map((app: any) => {
    const code = `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`;

    if (code === selectedClient.code) {

      if (type === "approve") {
        return {
          ...app,
          stage: "Contract Sent",
          contract: {
            ...app.contract,
            status: "Approved",
            notes: contractData.notes,
            reviewedFileName: contractData.reviewedFile?.name || null,
checklist: {
  email_sent: false,
  signed_contract_received: false,
  task_closed: false,
},
          },
        };
      }

      if (type === "reject") {
        return {
          ...app,
          stage: "Contract Review",
          contract: {
            ...app.contract,
            status: "Rejected",
            notes: contractData.notes,
          },
        };
      }

      if (type === "save") {
        return {
          ...app,
          contract: {
            ...app.contract,
            notes: contractData.notes,
          },
        };
      }
    }

    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));

  window.location.reload();
}

const isReviewStage = selectedClient?.stage === "Application Review";

  return (
    <div className="space-y-6  ">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">
            Client Onboarding
          </h1>
          <p className="text-xs text-gray-400">
            Manage IAF MD4 client applications and contracting
          </p>
        </div>

       <div className="flex gap-3 items-center">
  <select
  value={stageFilter || "All"}
  onChange={(e) =>
    setStageFilter(e.target.value === "All" ? null : e.target.value)
  }
  className="bg-[#1a1f2e] text-white border border-border px-4 py-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
>
  <option value="All" className="bg-[#1a1f2e] text-white">
    All Stages
  </option>
  {stages.map((stage) => (
    <option key={stage} value={stage} className="bg-[#1a1f2e] text-white">
      {stage}
    </option>
  ))}
</select>

          <button
            onClick={() => navigate("/clients/onboard")}
            className="bg-amber-500 hover:bg-amber-600 text-black text-sm px-4 py-2 rounded font-medium"
          >
            + New Client
          </button>
        </div>
      </div>

      {/* STATS */}
   <div className="grid grid-cols-4 gap-4">
  {[
    {
      title: "Total Clients",
      value: totalClients,
      sub: typeFilter === "ALL" ? "All Applications" : `${typeFilter} Only`,
    },
    {
      title: "In Progress",
      value: inProgress,
      sub: "Active pipeline",
    },
    {
      title: "Onboarding Complete",
      value: completed,
      sub: "This cycle",
    },
    {
      title: "Overdue Actions",
      value: overdue,
      sub: "Needs attention",
    },
  ].map((s, i) => (
    <div key={i} className="bg-card border border-border rounded-xl p-4">
      <p className="text-xs text-gray-400">{s.title}</p>
      <h2 className="text-2xl font-bold mt-2 text-white">{s.value}</h2>
      <p className="text-xs text-green-400">{s.sub}</p>
    </div>
  ))}
</div>

      {/* PIPELINE */}
      <div className="grid grid-cols-7 bg-card border border-border rounded-xl overflow-hidden text-center">
        {stages.map((stage, i) => {
          const count = baseList.filter((c) => c.stage === stage).length;

          return (
            <div
              key={i}
              onClick={() =>
                setStageFilter(stageFilter === stage ? null : stage)
              }
              className={`py-5 border-r border-border cursor-pointer ${
                stageFilter === stage ? "bg-[#1a1f2e]" : ""
              }`}
            >
              <div className="w-10 h-10 mx-auto rounded-full border border-amber-500 flex items-center justify-center text-amber-400 mb-2">
                {count}
              </div>
              <p className="text-[11px] text-gray-400">{stage}</p>
            </div>
          );
        })}
      </div>

      

      {/* CLIENT CARDS */}
      <div className="space-y-4">
        {filteredClients.map((c, i) => (
          <div
  key={i}
onClick={() => {
  setSelectedClient(c);

  if (
  [
    "Contract Creation",
    "Contract Review",
    "Contract Sent",
    "Contract Signed"
  ].includes(c.stage)
) {
  setActiveModal("contract");
} else {
  setActiveModal("review");
}
}}
  className="bg-card border border-border rounded-xl p-5 hover:bg-[#1a1f2e] transition"
>
            {/* TOP */}
            <div className="flex justify-between mb-3">
              <div>
                <h2 className="text-white font-semibold">{c.name}</h2>
                <div className="flex gap-2 text-[11px] text-gray-500 mt-1">
                  <span>{c.code}</span>
                 <span className="px-2 py-[2px] bg-amber-900 text-amber-400 rounded">
  {c.type}
</span>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-amber-900 text-amber-400">
                {c.stage}
              </span>
              {c.contract?.status === "Rejected" && (
  <span className="ml-2 text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20">
    Rejected
  </span>
)}
            {c.stage === "Contract Review" && (
  <span className="ml-2 flex items-center gap-1 text-[11px] px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
    Draft
  </span>
)}
            </div>

            {/* DETAILS */}
            <div className="flex gap-6 text-[12px] text-gray-400 mb-3 flex-wrap">
              <span className="flex items-center gap-1">
                <Mail size={12} /> {c.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone size={12} /> {c.phone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {c.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {c.scope}
              </span>
            </div>

            {/* PROGRESS */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400">Progress</span>

              <div className="flex-1 h-2 bg-[#1e2330] rounded">
                <div
                  className="h-2 bg-amber-400 rounded"
                  style={{ width: `${c.progress}%` }}
                />
              </div>

              <span className="text-xs text-amber-400">
                {c.progress}%
              </span>

              <span className="ml-3 text-[11px] px-3 py-1 bg-[#1a1f2e] rounded text-gray-300">
                {c.stageCount}
              </span>
            </div>
          </div>
        ))}
      </div>

      

   {activeModal === "review" && selectedClient && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-card bg-gray-900 w-[600px] rounded-xl p-6 border border-border">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">{selectedClient.name}</h2>
        <button onClick={() => {
  setSelectedClient(null);
  setActiveModal(null);
}} className="text-gray-400 hover:text-white">✕</button>
      </div>

      {/* DETAILS */}
      <div className="space-y-2 text-sm text-gray-300">
        <p><b>Code:</b> {selectedClient.code}</p>
        <p><b>Email:</b> {selectedClient.email}</p>
        <p><b>Phone:</b> {selectedClient.phone}</p>
        <p><b>Scope:</b> {selectedClient.scope}</p>
        <p><b>Stage:</b> {selectedClient.stage}</p>

        {selectedClient.decisionNote && (
          <p className="text-yellow-400 text-xs mt-2">Reason: {selectedClient.decisionNote}</p>
        )}
      </div>

      {/* CONDITIONAL ACTIONS */}
     <>
 
  {selectedClient.stage === "Application Received" && (
    <div className="mt-4">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add review note..."
        className="w-full bg-[#1a1f2e] border border-border rounded p-2 text-sm text-white"
      />

      <button
        onClick={handleSendToReview}
        className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-black py-2 rounded"
      >
        Send to Application Review
      </button>
    </div>
  )}

  {/* ✅ APPLICATION REVIEW → SHOW ACTIONS */}
  {selectedClient.stage === "Application Review" && (
    <div className="flex gap-3 mt-4">
      <button
        onClick={() => setDecisionType("approve")}
        className="flex-1 bg-green-500 py-2 rounded"
      >
        Approve
      </button>

      <button
        onClick={() => setDecisionType("reject")}
        className="flex-1 bg-red-500 py-2 rounded"
      >
        Reject
      </button>

      <button
        onClick={() => setDecisionType("more_info")}
        className="flex-1 bg-yellow-500 py-2 rounded"
      >
        Need Info
      </button>
    </div>
  )}
</>

    </div>
  </div>
)}

{decisionType && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
    <div className="bg-card w-[500px] bg-gray-900 p-5 rounded-xl border border-border">
      
      <h3 className="text-white mb-3 capitalize">
        Enter Reason
      </h3>

      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full bg-[#1a1f2e] border border-border rounded p-2 text-white"
        placeholder="Enter reason..."
      />

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleConfirmDecision}
          className="flex-1 bg-amber-500 py-2 rounded"
        >
          Submit
        </button>

        <button
          onClick={() => setDecisionType(null)}
          className="flex-1 bg-gray-700 py-2 rounded"
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}

{activeModal === "contract" && selectedClient && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-card w-[700px] p-6 rounded-xl border border-border bg-gray-900 text-white max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
  {selectedClient.stage === "Contract Review"
    ? "Review Contract"
    : "Create Contract"} for {selectedClient.name}
</h2>
        <button
          onClick={() => {
  setSelectedClient(null);
  setActiveModal(null);
}}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

    <div className="space-y-4 text-sm">

  {/* ✅ SHOW FORM ONLY IN CONTRACT CREATION */}
  {selectedClient?.stage === "Contract Creation" && (
    <>
      {/* Application Selection */}
      <div>
        <label className="block mb-1">Application</label>
        <select
          value={contractData.applicationId || ""}
          onChange={(e) =>
            setContractData({ ...contractData, applicationId: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
        >
          <option value="">-- Select Application --</option>
          {selectedClient.applications?.map((a: any) => (
            <option key={a.application_id} value={a.application_id}>
              {`APP-${a.application_id.toString().slice(-4).toUpperCase()}`} ({a.status})
            </option>
          ))}
        </select>
      </div>

      {/* Standards */}
      <div>
        <label className="block mb-1">Standards</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-800 p-2 rounded border border-gray-700">
          {filteredStandards.map((s: any) => (
            <label key={s.standard_id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={contractData.standardIds?.includes(s.standard_id)}
                onChange={() => {
                  const selected = contractData.standardIds || [];
                  const newSelected = selected.includes(s.standard_id)
                    ? selected.filter((id) => id !== s.standard_id)
                    : [...selected, s.standard_id];
                  setContractData({ ...contractData, standardIds: newSelected });
                }}
              />
              {s.standard_name}
            </label>
          ))}
        </div>
      </div>

      {/* Contract Number */}
      <div>
        <label className="block mb-1">Contract Number</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={contractData.contractNumber || ""}
            onChange={(e) =>
              setContractData({ ...contractData, contractNumber: e.target.value })
            }
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          />
          <button
            type="button"
            onClick={() => {
              const timestamp = new Date()
                .toISOString()
                .replace(/[-:.TZ]/g, "")
                .slice(0, 12);
              const random = Math.floor(100 + Math.random() * 900);
              setContractData({
                ...contractData,
                contractNumber: `CON-${timestamp}-${random}`,
              });
            }}
            className="bg-amber-500 px-3 py-2 rounded"
          >
            Generate
          </button>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-1">Notes</label>
        <textarea
          value={contractData.notes}
          onChange={(e) =>
            setContractData({ ...contractData, notes: e.target.value })
          }
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        />
      </div>

      {/* Upload */}
      <div>
        <label className="block mb-1">Upload Draft</label>
        <input
          type="file"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setContractData({
                ...contractData,
                mandaysSheetFile: e.target.files[0],
              });
            }
          }}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
        />
      </div>
    </>
  )}

  {/* ✅ SHOW READ-ONLY VIEW IN REVIEW */}
  {selectedClient?.stage === "Contract Review" && (
    <div className="bg-gray-800 p-4 rounded border border-gray-700">
      <p><b>Contract No:</b> {selectedClient.contract?.contractNumber}</p>
      <p><b>Status:</b> {selectedClient.contract?.status}</p>
      <p><b>Standards:</b> {selectedClient.contract?.standardIds?.join(", ")}</p>
      <p><b>Notes:</b> {selectedClient.contract?.notes || "N/A"}</p>
     
{selectedClient.contract?.reviewedFileName && (
  <div className="mt-2">
    <p className="text-xs text-gray-400">Reviewed File</p>
    <div className="bg-[#1a1f2e] px-3 py-2 rounded text-sm text-green-400">
      📄 {selectedClient.contract.reviewedFileName}
    </div>
  </div>
)}
    </div>
  )}

  

</div>

{selectedClient?.stage === "Contract Sent" && (
  <div className="space-y-4">

    {/* BASIC INFO */}
    <div className="bg-gray-800 p-4 rounded border border-gray-700 text-sm">
      <p><b>Contract No:</b> {selectedClient.contract?.contractNumber}</p>
      <p><b>Status:</b> {selectedClient.contract?.status}</p>
    </div>

    {/* CHECKLIST */}
    <div className="bg-gray-800 p-4 rounded border border-gray-700 space-y-2">
      <p className="font-semibold text-sm">Checklist</p>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!selectedClient.contract?.checklist?.email_sent}
          onChange={() => toggleChecklist("email_sent")}
        />
        Email Sent to Client
      </label>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!selectedClient.contract?.checklist?.signed_contract_received}
          onChange={() => toggleChecklist("signed_contract_received")}
        />
        Signed Contract Received
      </label>
    </div>

    {/* ATTACHMENTS */}
    <div className="bg-gray-800 p-4 rounded border border-gray-700 space-y-2 text-sm">
      <p className="font-semibold">Attachments</p>

      {selectedClient.contract?.reviewedFileName && (
        <p className="text-green-400">
          📄 Reviewed Contract: {selectedClient.contract.reviewedFileName}
        </p>
      )}

      {selectedClient.contract?.mandaysSheetFile?.name && (
        <p className="text-blue-400">
          📄 Draft Contract: {selectedClient.contract.mandaysSheetFile.name}
        </p>
      )}
    </div>

    {/* CLOSE TASK BUTTON */}
    <button
      disabled={
        !selectedClient.contract?.checklist?.email_sent ||
        !selectedClient.contract?.checklist?.signed_contract_received
      }
      onClick={handleCloseTask}
      className="w-full bg-green-500 py-2 rounded disabled:opacity-50"
    >
      Close Task & Move to Signed
    </button>

  </div>
)}

{selectedClient?.stage === "Contract Signed" && (
  <div className="space-y-4">

    {/* BASIC INFO */}
    <div className="bg-gray-800 p-4 rounded border border-gray-700 text-sm">
      <p><b>Contract No:</b> {selectedClient.contract?.contractNumber}</p>
      <p><b>Status:</b> {selectedClient.contract?.status}</p>
    </div>

    {/* SCOPE CHANGE */}
    <div className="bg-gray-800 p-4 rounded border border-gray-700">
      <label className="flex gap-2 text-sm">
        <input
          type="checkbox"
          checked={signedData.scopeChange.enabled}
          onChange={(e) =>
            setSignedData({
              ...signedData,
              scopeChange: { enabled: e.target.checked, type: "" },
            })
          }
        />
        Any Scope / Commercial Change?
      </label>

      {signedData.scopeChange.enabled && (
        <div className="mt-2 space-y-2 text-sm">
          <label className="flex gap-2">
            <input
              type="radio"
              name="scope"
              onChange={() =>
                setSignedData({
                  ...signedData,
                  scopeChange: {
                    enabled: true,
                    type: "commercial_amendment",
                  },
                })
              }
            />
            Commercial Amendment
          </label>

          <label className="flex gap-2">
            <input
              type="radio"
              name="scope"
              onChange={() =>
                setSignedData({
                  ...signedData,
                  scopeChange: {
                    enabled: true,
                    type: "scope_change",
                  },
                })
              }
            />
            Scope Change
          </label>
        </div>
      )}
    </div>

   

    {/* CHECKLIST */}
    <div className="bg-gray-800 p-4 rounded border border-gray-700 space-y-2">
      {[
        { key: "email_sent", label: "Email Sent" },
        { key: "signed_contract_received", label: "Contract Received" },
        { key: "signed_contract_uploaded", label: "Contract Uploaded" },
      ].map((item) => (
        <label key={item.key} className="flex gap-2 text-sm">
          <input
            type="checkbox"
            checked={signedData.checklist[item.key]}
            onChange={() =>
              setSignedData({
                ...signedData,
                checklist: {
                  ...signedData.checklist,
                  [item.key]: !signedData.checklist[item.key],
                },
              })
            }
          />
          {item.label}
        </label>
      ))}
    </div>

     {/* NOTES */}
    <textarea
      placeholder="Add notes..."
      value={signedData.notes}
      onChange={(e) =>
        setSignedData({ ...signedData, notes: e.target.value })
      }
      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
    />

    {/* FILE UPLOAD */}
    <div className="bg-gray-800 p-4 rounded border border-gray-700">
      <p className="text-sm mb-2">Upload Signed Contract</p>
      <input
        type="file"
        onChange={(e) =>
          setSignedData({
            ...signedData,
            file: e.target.files?.[0] || null,
          })
        }
      />
    </div>

    <div className="bg-gray-800 p-4 rounded border border-gray-700">
      <p className="text-sm mb-2">Upload Signed Application</p>
      <input
        type="file"
        onChange={(e) =>
          setSignedData({
            ...signedData,
            signedApplicationFile: e.target.files?.[0] || null,
          })
        }
      />
    </div>

    {/* COMPLETE BUTTON */}
    <button
      onClick={handleCompleteOnboarding}
      disabled={
        !signedData.file ||
        !signedData.signedApplicationFile ||
        !Object.values(signedData.checklist).every(Boolean)
      }
      className="w-full bg-green-500 py-2 rounded disabled:opacity-50"
    >
      Complete Onboarding
    </button>

  </div>
)}

{selectedClient?.stage === "Contract Review" && (
  <div className="mt-4 space-y-3">

    <textarea
      placeholder="Add notes or reason..."
      value={contractData.notes}
      onChange={(e) =>
        setContractData({ ...contractData, notes: e.target.value })
      }
      className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
    />

    {/* ✅ Upload Reviewed Contract */}
<div>
  <label className="block text-xs mb-1 text-gray-400">
    Upload Reviewed Contract
  </label>

  <input
    type="file"
    onChange={(e) => {
      if (e.target.files && e.target.files[0]) {
        setContractData({
          ...contractData,
          reviewedFile: e.target.files[0],
        });
      }
    }}
    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-xs"
  />
</div>

    <div className="flex gap-2">
      <button
        onClick={() => handleContractAction("approve")}
        className="flex-1 bg-green-500 py-2 rounded"
      >
        Approve
      </button>

      <button
        onClick={() => handleContractAction("reject")}
        className="flex-1 bg-red-500 py-2 rounded"
      >
        Reject
      </button>

      <button
        onClick={() => handleContractAction("save")}
        className="flex-1 bg-yellow-500 py-2 rounded"
      >
        Save Notes
      </button>
    </div>

  </div>
)}


    {selectedClient?.stage === "Contract Creation" && (
  <div className="flex gap-3 mt-4">
    <button
      onClick={handleCreateContract}
      className="flex-1 bg-amber-500 py-2 rounded"
    >
      Submit
    </button>

    <button
      onClick={() => {
  setSelectedClient(null);
  setActiveModal(null);
}}
      className="flex-1 bg-gray-700 py-2 rounded"
    >
      Cancel
    </button>
  </div>
)}
    </div>
  </div>
)}

    </div>
  );
}