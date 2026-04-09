import { useNavigate } from "react-router-dom";
import { useClientsPage } from "./hooks/useClientsPage";
import { ClientCard } from "./components/clients/ClientCard";
import { StatsGrid } from "./components/clients/StatsGrid";
import { StagesSummaryBar } from "./components/clients/StagesSummaryBar";
import { ReviewModal } from "./components/clients/ReviewModal";
import { ContractModal } from "./components/clients/ContractModal";
import type { StageName } from "./utils/stage";

export default function ClientsPage() {
  const navigate = useNavigate();
  const page = useClientsPage();

  if (page.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  if (page.isError) {
    console.error("ClientsPage query error:", page.error);
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-red-500 gap-2">
        <p className="font-semibold">Failed to load clients</p>
        <p className="text-xs text-red-400 max-w-md text-center">
          {(page.error as any)?.message || JSON.stringify(page.error)}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-amber-500 text-white rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Clients",
      value: page.totalClients,
      sub: page.typeFilter === "ALL" ? "All Applications" : `${page.typeFilter} Only`,
    },
    { title: "In Progress", value: page.inProgress, sub: "Active pipeline" },
    { title: "Onboarding Complete", value: page.completed, sub: "This cycle" },
    { title: "Overdue Actions", value: page.overdue, sub: "Needs attention" },
  ];

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-white">Client Onboarding</h1>
          <p className="text-xs text-gray-400">
            Manage IAF MD4 client applications and contracting
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={page.stageFilter || "All"}
            onChange={(e) =>
              page.setStageFilter(e.target.value === "All" ? null : e.target.value)
            }
            className="bg-[#1a1f2e] text-white border border-border px-4 py-2 rounded text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="All">All Stages</option>
            {page.stages.map((stage) => (
              <option key={stage} value={stage}>
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
      <StatsGrid stats={stats} />

      {/* PIPELINE */}
      <StagesSummaryBar
        stages={page.stages}
        baseList={page.baseList}
        stageFilter={page.stageFilter}
        onStageClick={(stage: StageName) =>
          page.setStageFilter(page.stageFilter === stage ? null : stage)
        }
      />

      {/* CLIENT CARDS */}
      <div className="space-y-4">
        {page.filteredClients.map((c, i) => (
          <ClientCard key={i} client={c} onClick={page.openClientModal} />
        ))}
      </div>

      {/* REVIEW MODAL */}
      {page.activeModal === "review" && page.selectedClient && (
        <ReviewModal
          client={page.selectedClient}
          note={page.note}
          onNoteChange={page.setNote}
          onReviewFileChange={page.setReviewFile}
          onClose={page.closeModal}
          onSendToReview={page.handleSendToReview}
          onApproveWithFile={page.handleApproveWithFile}
          onSetDecisionType={page.setDecisionType}
        />
      )}

      {/* DECISION REASON MODAL */}
      {page.decisionType && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]">
          <div className="bg-card w-[500px] bg-gray-900 p-5 rounded-xl border border-border">
            <h3 className="text-white mb-3 capitalize">Enter Reason</h3>
            <textarea
              value={page.reason}
              onChange={(e) => page.setReason(e.target.value)}
              className="w-full bg-[#1a1f2e] border border-border rounded p-2 text-white"
              placeholder="Enter reason..."
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={page.handleConfirmDecision}
                className="flex-1 bg-amber-500 py-2 rounded"
              >
                Submit
              </button>
              <button
                onClick={() => page.setDecisionType(null)}
                className="flex-1 bg-gray-700 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTRACT MODAL */}
      {page.activeModal === "contract" && page.selectedClient && (
        <ContractModal
          client={page.selectedClient}
          contractData={page.contractData}
          signedData={page.signedData}
          filteredStandards={page.filteredStandards}
          onClose={page.closeModal}
          onContractDataChange={page.setContractData}
          onSignedDataChange={page.setSignedData}
          onCreateContract={page.handleCreateContract}
          onContractAction={page.handleContractAction}
          onCloseTask={page.handleCloseTask}
          onCompleteOnboarding={page.handleCompleteOnboarding}
          onToggleChecklist={page.toggleChecklist}
        />
      )}
    </div>
  );
}