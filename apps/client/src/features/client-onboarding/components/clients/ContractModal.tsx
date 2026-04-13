import type { ClientViewModel } from "../../api/client-queries";
import type { ContractFormData, SignedData, StandardEntry } from "../../utils/types";

interface Props {
  client: ClientViewModel;
  contractData: ContractFormData;
  signedData: SignedData;
  filteredStandards: StandardEntry[];
  onClose: () => void;
  onContractDataChange: (data: ContractFormData) => void;
  onSignedDataChange: (data: SignedData) => void;
  onCreateContract: () => void;
  onContractAction: (type: "approve" | "reject" | "save") => void;
  onCloseTask: () => void;
  onCompleteOnboarding: () => void;
  onToggleChecklist: (key: string) => void;
}

export function ContractModal({
  client,
  contractData,
  signedData,
  filteredStandards,
  onClose,
  onContractDataChange,
  onSignedDataChange,
  onCreateContract,
  onContractAction,
  onCloseTask,
  onCompleteOnboarding,
  onToggleChecklist,
}: Props) {
  const set = (partial: Partial<ContractFormData>) =>
    onContractDataChange({ ...contractData, ...partial });

  const generateContractNumber = () => {
    const ts = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 12);
    const r = Math.floor(100 + Math.random() * 900);
    set({ contractNumber: `CON-${ts}-${r}` });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card w-[700px] p-6 rounded-xl border border-border bg-gray-900 text-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {client.stage === "Contract Review"
              ? "Review Contract"
              : "Create Contract"}{" "}
            for {client.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm">

          {/* ── Contract Creation ── */}
          {client.stage === "Contract Creation" && (
            <>
              {/* Application selection */}
              <div>
                <label className="block mb-1">Application</label>
                <select
                  value={contractData.applicationId || ""}
                  onChange={(e) => set({ applicationId: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
                >
                  <option value="">-- Select Application --</option>
                  {client.applications?.map((a) => (
                    <option key={a.application_id} value={a.application_id}>
                      {a.application_id} ({a.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Standards */}
              <div>
                <label className="block mb-1">Standards</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-gray-800 p-2 rounded border border-gray-700">
                  {filteredStandards.map((s) => (
                    <label key={s.standard_id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={contractData.standardIds?.includes(s.standard_id)}
                        onChange={() => {
                          const selected = contractData.standardIds || [];
                          const newSelected = selected.includes(s.standard_id)
                            ? selected.filter((id) => id !== s.standard_id)
                            : [...selected, s.standard_id];
                          set({ standardIds: newSelected });
                        }}
                      />
                      {s.standard_name}
                    </label>
                  ))}
                </div>
              </div>

              {/* Contract number */}
              <div>
                <label className="block mb-1">Contract Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={contractData.contractNumber || ""}
                    onChange={(e) => set({ contractNumber: e.target.value })}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={generateContractNumber}
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
                  onChange={(e) => set({ notes: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>

              {/* Upload */}
              <div>
                <label className="block mb-1">Upload Draft</label>
                <input
                  type="file"
                  onChange={(e) =>
                    set({ mandaysSheetFile: e.target.files?.[0] || null })
                  }
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={onCreateContract}
                  className="flex-1 bg-amber-500 py-2 rounded"
                >
                  Submit
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-700 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {/* ── Contract Review (read-only) ── */}
          {client.stage === "Contract Review" && (
            <>
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <p><b>Contract No:</b> {(client as any).contract?.contractNumber}</p>
                <p><b>Status:</b> {(client as any).contract?.status}</p>
                <p><b>Standards:</b> {(client as any).contract?.standardIds?.join(", ")}</p>
                <p><b>Notes:</b> {(client as any).contract?.notes || "N/A"}</p>
                {(client as any).contract?.reviewedFileName && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">Reviewed File</p>
                    <div className="bg-[#1a1f2e] px-3 py-2 rounded text-sm text-green-400">
                      📄 {(client as any).contract.reviewedFileName}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <textarea
                  placeholder="Add notes or reason..."
                  value={contractData.notes}
                  onChange={(e) => set({ notes: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white"
                />
                <div>
                  <label className="block text-xs mb-1 text-gray-400">
                    Upload Reviewed Contract
                  </label>
                  <input
                    type="file"
                    onChange={(e) =>
                      set({ reviewedFile: e.target.files?.[0] || null })
                    }
                    className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-xs"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onContractAction("approve")}
                    className="flex-1 bg-green-500 py-2 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onContractAction("reject")}
                    className="flex-1 bg-red-500 py-2 rounded"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => onContractAction("save")}
                    className="flex-1 bg-yellow-500 py-2 rounded"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </>
          )}

          {client.stage === "Contract Sent" && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded border border-gray-700 text-sm">
                <p><b>Client:</b> {client.name}</p>
                <p><b>Status:</b> Contract Sent — awaiting client signature</p>
              </div>
              <div className="bg-gray-800 p-4 rounded border border-gray-700 space-y-2">
                <p className="font-semibold text-sm">Checklist</p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!signedData.checklist.email_sent}
                    onChange={() => onToggleChecklist("email_sent")}
                  />
                  Email Sent to Client
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={!!signedData.checklist.signed_contract_received}
                    onChange={() => onToggleChecklist("signed_contract_received")}
                  />
                  Signed Contract Received
                </label>
              </div>
              <button
                disabled={
                  !signedData.checklist.email_sent ||
                  !signedData.checklist.signed_contract_received
                }
                onClick={onCloseTask}
                className="w-full bg-green-500 py-2 rounded disabled:opacity-50"
              >
                Close Task &amp; Move to Signed
              </button>
            </div>
          )}

          {/* ── Contract Signed ── */}
          {client.stage === "Contract Signed" && (
            <div className="space-y-4">
              <div className="bg-gray-800 p-4 rounded border border-gray-700 text-sm">
                <p><b>Contract No:</b> {(client as any).contract?.contractNumber}</p>
                <p><b>Status:</b> {(client as any).contract?.status}</p>
              </div>

              {/* Scope change */}
              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={signedData.scopeChange.enabled}
                    onChange={(e) =>
                      onSignedDataChange({
                        ...signedData,
                        scopeChange: { enabled: e.target.checked, type: "" },
                      })
                    }
                  />
                  Any Scope / Commercial Change?
                </label>
                {signedData.scopeChange.enabled && (
                  <div className="mt-2 space-y-2 text-sm">
                    {(
                      [
                        ["commercial_amendment", "Commercial Amendment"],
                        ["scope_change", "Scope Change"],
                      ] as const
                    ).map(([val, label]) => (
                      <label key={val} className="flex gap-2">
                        <input
                          type="radio"
                          name="scope"
                          onChange={() =>
                            onSignedDataChange({
                              ...signedData,
                              scopeChange: { enabled: true, type: val },
                            })
                          }
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Checklist */}
              <div className="bg-gray-800 p-4 rounded border border-gray-700 space-y-2">
                {(
                  [
                    ["email_sent", "Email Sent"],
                    ["signed_contract_received", "Contract Received"],
                    ["signed_contract_uploaded", "Contract Uploaded"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={signedData.checklist[key]}
                      onChange={() =>
                        onSignedDataChange({
                          ...signedData,
                          checklist: {
                            ...signedData.checklist,
                            [key]: !signedData.checklist[key],
                          },
                        })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>

              <textarea
                placeholder="Add notes..."
                value={signedData.notes}
                onChange={(e) =>
                  onSignedDataChange({ ...signedData, notes: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              />

              <div className="bg-gray-800 p-4 rounded border border-gray-700">
                <p className="text-sm mb-2">Upload Signed Contract</p>
                <input
                  type="file"
                  onChange={(e) =>
                    onSignedDataChange({
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
                    onSignedDataChange({
                      ...signedData,
                      signedApplicationFile: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>

              <button
                onClick={onCompleteOnboarding}
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
        </div>
      </div>
    </div>
  );
}
