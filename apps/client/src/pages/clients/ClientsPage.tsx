import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Mail, Phone, Calendar, Clock } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import toast from "react-hot-toast";

type ContextType = {
  ctx: "both" | "iatf" | "iaf";
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

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
const [contractData, setContractData] = useState({
  contractName: "",
  startDate: "",
  endDate: "",
  terms: "",
  standardIds: [] as number[], 
});

  const [standards, setStandards] = useState<any[]>([]);
const filteredClients = clients.filter((c) => {
  if (stageFilter && c.stage !== stageFilter) return false;

  
  if (ctx !== "both") {
    if (c.type?.toLowerCase() !== ctx) return false;
  }

  
  if (typeFilter !== "ALL") {
    if (c.type?.toUpperCase() !== typeFilter) return false;
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
    if (c.type?.toLowerCase() !== ctx) return false;
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

  useEffect(() => {
  const data = JSON.parse(localStorage.getItem("applications") || "[]");

  // transform your form data → UI format
  const formatted = data.map((app: any) => ({
    name: app.client.organization_name,
    code: `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`,
    email: app.contacts?.[0]?.email || "N/A",
    phone: app.contacts?.[0]?.phone || "N/A",
    date: `Applied ${new Date(app.id).toLocaleDateString()}`,
    scope: app.app.proposed_scope || "N/A",
    stage: app.stage || "Application Received",
    progress: 14,
    stageCount: "Stage 1 of 7",
    type: (app.type || "").toUpperCase().trim(), 
  }));

  setClients(formatted);
}, []);


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
    progress: app.stage === "Application Review" ? 28 : 14,
    stageCount:
      app.stage === "Application Review"
        ? "Stage 2 of 7"
        : "Stage 1 of 7",
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
  if (!contractData.contractName || !contractData.startDate || !contractData.endDate) {
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
        contract: { ...contractData },
      };
    }
    return app;
  });

  localStorage.setItem("applications", JSON.stringify(updated));

  // Update UI
  setClients(
    updated.map((app: any) => ({
      name: app.client.organization_name,
      code: `${app.type}-CLI-${new Date().getFullYear()}-${app.id}`,
      email: app.contacts?.[0]?.email || "N/A",
      phone: app.contacts?.[0]?.phone || "N/A",
      date: `Applied ${new Date(app.id).toLocaleDateString()}`,
      scope: app.app.proposed_scope || "N/A",
      stage: app.stage || "Application Received",
      progress:
        app.stage === "Contract Review"
          ? 42
          : app.stage === "Application Review"
          ? 28
          : 14,
      stageCount:
        app.stage === "Contract Review"
          ? "Stage 3 of 7"
          : app.stage === "Application Review"
          ? "Stage 2 of 7"
          : "Stage 1 of 7",
      type: (app.type || "").toUpperCase().trim(),
    }))
  );

  toast.success("Contract Created ✅");
  setIsContractModalOpen(false);
  setContractData({ contractName: "", startDate: "", endDate: "", terms: "" });
  setSelectedClient(null);
}


const isReviewStage = selectedClient?.stage === "Application Review";

  return (
    <div className="space-y-6">

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

      {/* FILTER TABS */}
    <div className="flex gap-3 text-xs">
  {["ALL", "IAF", "IATF"].map((f) => (
    <button
      key={f}
      onClick={() => setTypeFilter(f as any)}
      className={`px-4 py-1 rounded-full border ${
        typeFilter === f
          ? "bg-amber-500 text-black border-amber-500"
          : "border-border text-gray-400"
      }`}
    >
      {f}
    </button>
  ))}
</div>

      {/* CLIENT CARDS */}
      <div className="space-y-4">
        {filteredClients.map((c, i) => (
          <div
  key={i}
  onClick={() => {
    setSelectedClient(c);
    if (c.stage === "Contract Creation") {
      setIsContractModalOpen(true);
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

      

   {selectedClient && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-card bg-gray-900 w-[600px] rounded-xl p-6 border border-border">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-lg font-semibold">{selectedClient.name}</h2>
        <button onClick={() => setSelectedClient(null)} className="text-gray-400 hover:text-white">✕</button>
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
      {stageFilter && stageFilter !== "All" && (
        <>
          {/* NOTE INPUT */}
          {!isReviewStage && (
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

          {/* REVIEW STAGE ACTIONS */}
          {isReviewStage && (
            <div className="flex gap-3 mt-4">
              <button onClick={() => setDecisionType("approve")} className="flex-1 bg-green-500 py-2 rounded">Approve</button>
              <button onClick={() => setDecisionType("reject")} className="flex-1 bg-red-500 py-2 rounded">Reject</button>
              <button onClick={() => setDecisionType("more_info")} className="flex-1 bg-yellow-500 py-2 rounded">Need Info</button>
            </div>
          )}
        </>
      )}

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

{isContractModalOpen && selectedClient && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-card w-[700px] p-6 rounded-xl border border-border bg-gray-900 text-white max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Create Contract for {selectedClient.name}
        </h2>
        <button
          onClick={() => setIsContractModalOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4 text-sm">
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
                {`APP-${a.application_id.slice(-4).toUpperCase()}`} ({a.status})
              </option>
            ))}
          </select>
        </div>

        {/* Standards Selection */}
        <div>
          <label className="block mb-1">Standards</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-800 p-2 rounded border border-gray-700">
            {standards.map((s: any) => (
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

        {/* Contract Name & Number */}
        <div className="flex gap-2">
         
          <div className="flex-1">
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

        {/* Attachments */}
        <div>
          <label className="block mb-1">Upload Draft / Mandays Sheet</label>
          <input
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setContractData({ ...contractData, mandaysSheetFile: e.target.files[0] });
              }
            }}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleCreateContract}
          className="flex-1 bg-amber-500 py-2 rounded"
        >
          Submit
        </button>
        <button
          onClick={() => setIsContractModalOpen(false)}
          className="flex-1 bg-gray-700 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}