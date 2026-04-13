import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useClients } from "../api/client-queries";
import { useUpdateApplicationStatus, useCreateContract } from "../api/client-mutations";
import { toBase64 } from "../utils/file";
import { isContractingStage, STAGES } from "../utils/stage";
import { STANDARD_MASTER } from "../utils/types";
import type {
  ActiveModal,
  ClientContext,
  TypeFilter,
  SignedData,
  ContractFormData,
} from "../utils/types";
import type { ClientViewModel } from "../api/client-queries";



// ─── Initial state ─────────────────────────────────────────────────────────────

const initialSignedData: SignedData = {
  checklist: {
    email_sent: false,
    signed_contract_received: false,
    signed_contract_uploaded: false,
  },
  file: null,
  signedApplicationFile: null,
  notes: "",
  scopeChange: { enabled: false, type: "" },
  audit: {},
};

const initialContractData: ContractFormData = {
  contractName: "",
  contractNumber: "",
  applicationId: "",
  startDate: "",
  endDate: "",
  terms: "",
  notes: "",
  standardIds: [],
  mandaysSheetFile: null,
  reviewedFile: null,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClientsPage(ctx: ClientContext = "both") {

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: clients = [], isLoading, isError, error } = useClients();
  const updateStatusMutation = useUpdateApplicationStatus();
  const createContractMutation = useCreateContract();

  // ── Local UI state ────────────────────────────────────────────────────────
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientViewModel | null>(null);
  const [note, setNote] = useState("");
  const [decisionType, setDecisionType] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [reviewFile, setReviewFile] = useState<File | null>(null);
  const [reason, setReason] = useState("");
  const [signedData, setSignedData] = useState<SignedData>(initialSignedData);
  const [contractData, setContractData] = useState<ContractFormData>(initialContractData);
  const [standards, setStandards] = useState<any[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("standards") || "[]");
    setStandards(saved);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────

  const baseList = clients.filter((c) => {
    if (ctx !== "both" && c.type?.toUpperCase() !== ctx.toUpperCase()) return false;
    if (typeFilter !== "ALL" && c.type !== typeFilter) return false;
    return true;
  });

  const filteredClients = baseList.filter((c) => {
    if (stageFilter && c.stage !== stageFilter) return false;
    return true;
  });

  const totalClients = baseList.length;
  const inProgress = baseList.filter(
    (c) => c.stage !== "Onboarding Complete" && c.stage !== "Contract Signed",
  ).length;
  const completed = baseList.filter((c) => c.stage === "Onboarding Complete").length;
  const overdue = 0;

  const filteredStandards =
    selectedClient?.type === "IAF"
      ? STANDARD_MASTER.IAF
      : selectedClient?.type === "IATF"
        ? STANDARD_MASTER.IATF
        : [];

  // ── Modal open helper ─────────────────────────────────────────────────────

  const openClientModal = (client: ClientViewModel) => {
    setSelectedClient(client);
    setActiveModal(isContractingStage(client.stage) ? "contract" : "review");
  };

  const closeModal = () => {
    setSelectedClient(null);
    setActiveModal(null);
  };

  // ── Handlers ──────────────────────────────────────────────────────────────

  async function handleSendToReview() {
    if (!selectedClient) return;
    if (!note.trim()) {
      toast.error("Please add a review note before submitting");
      return;
    }
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedClient.application_id!,
        payload: { status: "application_review", note },
      });
      closeModal();
      setNote("");
    } catch (err) {
      console.error("Error updating stage:", err);
    }
  }

  function handleConfirmDecision() {
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }
    // legacy localStorage path (non-Supabase flows)
    const stored = JSON.parse(localStorage.getItem("applications") || "[]");
    const updated = stored.map((a: any) => {
      const code = `${a.type}-CLI-${new Date().getFullYear()}-${a.id}`;
      if (code !== selectedClient?.code) return a;
      if (decisionType === "approve") return { ...a, stage: "Contract Creation", decisionNote: reason };
      if (decisionType === "reject") return { ...a, stage: "Rejected", decisionNote: reason };
      if (decisionType === "more_info") return { ...a, stage: "Application Received", decisionNote: reason };
      return a;
    });
    localStorage.setItem("applications", JSON.stringify(updated));
    window.location.reload();
    if (decisionType === "approve") toast.success("Moved to Contract Creation");
    else if (decisionType === "reject") toast.error("Application Rejected");
    else toast("Sent back for more info");
    setDecisionType(null);
    setReason("");
    closeModal();
  }

  async function handleCreateContract() {
    if (!contractData.contractNumber || !contractData.applicationId) {
      toast.error("Fill required fields");
      return;
    }
    try {
      let base64File: string | null = null;
      if (contractData.mandaysSheetFile) {
        base64File = (await toBase64(contractData.mandaysSheetFile)) as string;
      }
      await createContractMutation.mutateAsync({
        application_id: contractData.applicationId,
        contract_number: contractData.contractNumber,
        start_date: contractData.startDate || undefined,
        end_date: contractData.endDate || undefined,
        notes: contractData.notes,
        pdf_base64: base64File,
      });
      closeModal();
    } catch (err) {
      console.error("Contract creation error:", err);
    }
  }

  async function handleApproveWithFile() {
    if (!reviewFile) {
      toast.error("Please upload review document");
      return;
    }
    try {
      const appId = selectedClient?.application_id;
      if (!appId) return;
      const base64File = (await toBase64(reviewFile)) as string;
      await updateStatusMutation.mutateAsync({
        id: appId,
        payload: {
          status: "contract_creation",
          note: "Approved and moved to contract creation",
          review_document: base64File,
        },
      });
      closeModal();
      setReviewFile(null);
    } catch (err) {
      console.error("Approval error:", err);
    }
  }

  async function handleCloseTask() {
    if (!selectedClient?.application_id) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedClient.application_id,
        payload: { status: "contract_signed", note: "Contract signed by client" },
      });
      closeModal();
    } catch (err) {
      console.error("Close task error:", err);
    }
  }

  function toggleChecklist(key: string) {
    // Checklist is local UI state only — persisted when the modal action fires
    setSignedData((prev) => ({
      ...prev,
      checklist: { ...prev.checklist, [key]: !prev.checklist[key as keyof typeof prev.checklist] },
    }));
  }

  async function handleCompleteOnboarding() {
    if (!selectedClient?.application_id) return;
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedClient.application_id,
        payload: { status: "onboarding_complete", note: signedData.notes || "Onboarding completed" },
      });
      closeModal();
    } catch (err) {
      console.error("Complete onboarding error:", err);
    }
  }

  async function handleContractAction(type: "approve" | "reject" | "save") {
    if (!selectedClient?.application_id) return;
    const appId = selectedClient.application_id;

    try {
      if (type === "approve") {
        await updateStatusMutation.mutateAsync({
          id: appId,
          payload: {
            status: "contract_sent",
            note: contractData.notes || "Contract approved and sent to client",
          },
        });
      } else if (type === "reject") {
        if (!contractData.notes.trim()) {
          toast.error("Please add a rejection reason");
          return;
        }
        await updateStatusMutation.mutateAsync({
          id: appId,
          payload: { status: "contract_creation", note: contractData.notes },
        });
      } else if (type === "save") {
        await updateStatusMutation.mutateAsync({
          id: appId,
          payload: {
            status: selectedClient.application?.status ?? "contract_review",
            note: contractData.notes,
          },
        });
      }
      closeModal();
    } catch (err) {
      console.error("Contract action error:", err);
    }
  }

  return {
    // query state
    clients,
    isLoading,
    isError,
    error,
    // ui state
    ctx,
    typeFilter,
    setTypeFilter,
    stageFilter,
    setStageFilter,
    selectedClient,
    setSelectedClient,
    note,
    setNote,
    decisionType,
    setDecisionType,
    activeModal,
    setActiveModal,
    reviewFile,
    setReviewFile,
    reason,
    setReason,
    signedData,
    setSignedData,
    contractData,
    setContractData,
    standards,
    // derived
    baseList,
    filteredClients,
    filteredStandards,
    totalClients,
    inProgress,
    completed,
    overdue,
    stages: STAGES,
    // helpers
    openClientModal,
    closeModal,
    // handlers
    handleSendToReview,
    handleConfirmDecision,
    handleCreateContract,
    handleApproveWithFile,
    handleCloseTask,
    toggleChecklist,
    handleCompleteOnboarding,
    handleContractAction,
  };
}
