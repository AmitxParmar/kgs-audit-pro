import type { ClientViewModel } from "../../api/client-queries";

interface Props {
  client: ClientViewModel;
  note: string;
  onNoteChange: (value: string) => void;
  onReviewFileChange: (file: File | null) => void;
  onClose: () => void;
  onSendToReview: () => void;
  onApproveWithFile: () => void;
  onSetDecisionType: (type: string) => void;
}

export function ReviewModal({
  client,
  note,
  onNoteChange,
  onReviewFileChange,
  onClose,
  onSendToReview,
  onApproveWithFile,
  onSetDecisionType,
}: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card bg-gray-900 w-[600px] max-h-[90vh] overflow-y-auto rounded-xl p-6 border border-border">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">{client.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-gray-300">
          <p><b>Code:</b> {client.code}</p>
          <p><b>Email:</b> {client.contact_email}</p>
          <p><b>Phone:</b> {client.contact_phone}</p>
          <p><b>Scope:</b> {client.scope}</p>
          <p><b>Stage:</b> {client.stage}</p>
          {client.decisionNote && (
            <p className="text-yellow-400 text-xs mt-2">
              Reason: {client.decisionNote}
            </p>
          )}
        </div>

        {/* ── Application Received → send to review ── */}
        {client.stage === "Application Received" && (
          <div className="mt-4">
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add review note..."
              className="w-full bg-[#1a1f2e] border border-border rounded p-2 text-sm text-white"
            />
            <button
              onClick={onSendToReview}
              className="mt-2 w-full bg-amber-500 hover:bg-amber-600 text-black py-2 rounded"
            >
              Send to Application Review
            </button>
          </div>
        )}

        {/* ── Application Review → details + approve/reject ── */}
        {client.stage === "Application Review" && (
          <div className="mt-4 space-y-4 text-sm text-gray-300">
            <h3 className="text-white font-semibold text-lg border-b border-gray-700 pb-2">
              Application Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-xs">Audit Type</p>
                <p>{client.application?.type_of_audit || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Standards</p>
                <p>{client.application?.standard || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">IAF Code</p>
                <p>{client.application?.iaf_code || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">NACE Code</p>
                <p>{client.application?.nace_code || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">SIC Code</p>
                <p>{client.application?.sic_code || "N/A"}</p>
              </div>

              {/* Shifts */}
              <div className="col-span-2">
                <p className="text-gray-400 text-xs mb-2">Shifts</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Array.isArray(client.application?.shifts) ? (
                    client.application.shifts.map((s: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-[#1a1f2e] p-3 rounded-lg border border-gray-700"
                      >
                        <p className="font-semibold text-white mb-1">
                          Shift {idx + 1}
                        </p>
                        <p className="text-xs text-gray-400">Start: {s.start}</p>
                        <p className="text-xs text-gray-400">End: {s.end}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No shift data</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Legal Obligations</p>
                <p>
                  {client.application?.legal_obligations ? "Yes" : "No"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Legal Details</p>
                <p>
                  {client.application?.legal_obligation_details || "N/A"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Proposed Scope</p>
                <p>{client.application?.proposed_scope || "N/A"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Outsourced Processes</p>
                <p>{client.application?.outsourced_processes || "N/A"}</p>
              </div>

              {/* Attachment */}
              {client.application?.attachment_base64 && (
                <div className="col-span-2 mt-4">
                  <p className="text-gray-400 text-xs mb-2">Attachment</p>
                  {client.application.attachment_base64.startsWith("data:image") ? (
                    <img
                      src={client.application.attachment_base64}
                      alt="attachment"
                      className="max-h-60 rounded border border-gray-700"
                    />
                  ) : (
                    <div className="flex gap-3">
                      <a
                        href={client.application.attachment_base64}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white text-sm"
                      >
                        View Attachment
                      </a>
                      <a
                        href={client.application.attachment_base64}
                        download="attachment"
                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white text-sm"
                      >
                        Download
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Manufacturing Sites */}
              <div className="col-span-2 mt-4">
                <p className="text-gray-400 text-xs mb-2">Manufacturing Sites</p>
                <div className="space-y-3">
                  {Array.isArray(client.application?.manufacturing_sites) ? (
                    client.application.manufacturing_sites.map(
                      (site: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-[#1a1f2e] p-4 rounded-lg border border-gray-700"
                        >
                          <p className="text-white font-semibold mb-2">
                            {site.site_name}
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            <p><b>Address:</b> {site.address}</p>
                            <p><b>Total Employees:</b> {site.total_employees}</p>
                            <p><b>MFG Employees:</b> {site.employees_mfg}</p>
                          </div>
                          {site.remote_locations?.length > 0 && (
                            <div className="mt-3 border-t border-gray-700 pt-2">
                              <p className="text-gray-400 text-xs mb-1">
                                Remote Locations
                              </p>
                              {site.remote_locations.map((r: any, i: number) => (
                                <p key={i} className="text-xs text-gray-300">
                                  • {r.site_name} ({r.address})
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ),
                    )
                  ) : (
                    <p className="text-xs text-gray-500">No data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Upload review doc */}
            <input
              type="file"
              onChange={(e) =>
                onReviewFileChange(e.target.files?.[0] || null)
              }
              className="w-full bg-[#1a1f2e] border border-border rounded p-2 text-sm text-white"
            />

            {/* Action buttons */}
            <div className="sticky -bottom-6 left-0 right-0 bg-gray-900 pt-3 pb-2 border-t border-gray-700 mt-6">
              <div className="flex gap-3">
                <button
                  onClick={onApproveWithFile}
                  className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => onSetDecisionType("reject")}
                  className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded font-medium"
                >
                  Reject
                </button>
                <button
                  onClick={() => onSetDecisionType("more_info")}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-2 rounded font-medium text-black"
                >
                  Need Info
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
