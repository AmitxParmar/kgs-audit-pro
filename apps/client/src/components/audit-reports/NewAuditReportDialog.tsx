"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useClients, useStandards, useAuditors, useCreateAudit, useCertificationBodies } from "../../queries/audit-reports-queries";
import { CalendarIcon, User, ShieldCheck, ClipboardList, Paperclip, Layers, Building2 } from "lucide-react";

// Stage → backend status mapping
const STAGE_TO_BACKEND: Record<string, string[]> = {
  "Draft Report": ["client_onboarded", "audit_planned", "audit_in_progress"],
  "Technical Review": ["report_under_review"],
  "IATF Update": ["cert_decision"],
  "NC Management": ["nc_raised"],
  "Certification": ["cert_granted", "cert_uploaded", "active", "denied", "suspended"],
};

export function NewAuditReportDialog() {
  const [open, setOpen] = useState(false);
  const [cbId, setCbId] = useState("");
  const [clientId, setClientId] = useState("");
  const [standardId, setStandardId] = useState("");
  const [auditorId, setAuditorId] = useState("");
  const [status, setStatus] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [summary, setSummary] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: cbs, isLoading: loadingCbs } = useCertificationBodies();
  const { data: clients, isLoading: loadingClients } = useClients();
  const { data: standards } = useStandards();
  const { data: auditors } = useAuditors();
  const createAudit = useCreateAudit();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSave = async () => {
    if (!cbId || !clientId || !standardId || !plannedDate || !status) {
      alert("Please fill in all required fields (CB, Client, Standard, Date, Status)");
      return;
    }

    try {
      await createAudit.mutateAsync({
        cb_id: cbId,
        client_id: clientId,
        standard_id: standardId,
        lead_auditor_id: auditorId || null,
        planned_date: plannedDate,
        scope: summary || undefined,
        status: status,
      });
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create audit:", error);
    }
  };

  const resetForm = () => {
    setCbId("");
    setClientId("");
    setStandardId("");
    setAuditorId("");
    setStatus("");
    setPlannedDate("");
    setSummary("");
    setAttachments([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="h-9 px-4 rounded-full border border-teal-500/30 bg-teal-500/15 hover:bg-teal-500/20 transition text-sm font-extrabold text-teal-100 flex items-center gap-2"
          type="button"
        >
          <span>+</span> New Draft Report
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-[#0B1220] border-white/10 text-slate-100 p-0 overflow-hidden shadow-2xl">
        <div className="bg-teal-500/5 px-6 py-5 border-b border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-teal-400" />
              Initialize Audit Report
            </DialogTitle>
            <DialogDescription className="text-slate-400 mt-1 text-sm">
              Complete the workflow parameters to generate a new audit record.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

          {/* Row 1: CB + Organization */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                <Building2 className="h-3 w-3 inline mr-1" />
                Certification Body
              </Label>
              <Select onValueChange={setCbId} value={cbId}>
                <SelectTrigger className="w-full bg-black/40 border-white/10 h-12 focus:ring-4 focus:ring-teal-500/5 transition-all text-sm">
                  <SelectValue placeholder={loadingCbs ? "Loading..." : "Select CB"} />
                </SelectTrigger>
                <SelectContent className="bg-[#161f31] border-white/10 text-slate-100">
                  {cbs?.map((cb: any) => (
                    <SelectItem key={cb.id} value={cb.id}>
                      {cb.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                Organization
              </Label>
              <Select onValueChange={setClientId} value={clientId}>
                <SelectTrigger className="w-full bg-black/40 border-white/10 h-12 focus:ring-4 focus:ring-teal-500/5 transition-all">
                  <SelectValue placeholder={loadingClients ? "Loading..." : "Select client"} />
                </SelectTrigger>
                <SelectContent className="bg-[#161f31] border-white/10 text-slate-100 shadow-xl">
                  {clients?.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2: Standard + Stage */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                <ShieldCheck className="h-3 w-3 inline mr-1" />
                Audit Standard
              </Label>
              <Select onValueChange={setStandardId} value={standardId}>
                <SelectTrigger className="w-full bg-black/40 border-white/10 h-12 focus:ring-4 focus:ring-teal-500/5 transition-all text-sm">
                  <SelectValue placeholder="Select standard" />
                </SelectTrigger>
                <SelectContent className="bg-[#161f31] border-white/10 text-slate-100">
                  {standards?.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                <Layers className="h-3 w-3 inline mr-1" />
                Status
              </Label>
              <Select onValueChange={setStatus} value={status}>
                <SelectTrigger className="w-full bg-black/40 border-white/10 h-12 focus:ring-4 focus:ring-teal-500/5 transition-all text-sm">
                  <SelectValue placeholder="Select actual status" />
                </SelectTrigger>
                <SelectContent className="bg-[#161f31] border-white/10 text-slate-100">
                  {Object.entries(STAGE_TO_BACKEND).map(([uiStage, backendStatuses]) => (
                    <SelectGroup key={uiStage}>
                      <SelectLabel className="text-teal-400 font-bold uppercase tracking-wider pt-2">{uiStage}</SelectLabel>
                      {backendStatuses.map((backStatus) => (
                        <SelectItem key={backStatus} value={backStatus}>
                          {backStatus}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Planned Date + Lead Auditor */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                <CalendarIcon className="h-3 w-3 inline mr-1" />
                Planned Date
              </Label>
              <Input
                type="date"
                className="w-full bg-black/40 border-white/10 h-12 focus:ring-4 focus:ring-teal-500/5 transition-all [color-scheme:dark] px-4 cursor-pointer"
                value={plannedDate}
                onChange={(e) => setPlannedDate(e.target.value)}
                onClick={(e) => (e.currentTarget as any).showPicker?.()}
              />
            </div>
          
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
                <User className="h-3 w-3 inline mr-1" />
                Lead Auditor <span className="text-slate-600 normal-case font-normal tracking-normal">(optional)</span>
              </Label>
              <Select onValueChange={setAuditorId} value={auditorId}>
                <SelectTrigger className="w-full bg-black/40 border-white/10 h-12 focus:ring-4 focus:ring-teal-500/5 transition-all">
                  <SelectValue placeholder="Assign lead auditor" />
                </SelectTrigger>
                <SelectContent className="bg-[#161f31] border-white/10 text-slate-100">
                  {auditors?.map((auditor: any) => (
                    <SelectItem key={auditor.id} value={auditor.id}>
                      {auditor.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Summary / Notes */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              Summary / Notes <span className="text-slate-600 normal-case font-normal tracking-normal">(optional)</span>
            </Label>
            <Textarea
              placeholder="Executive summary, scope of audit, observations..."
              className="w-full bg-black/40 border-white/10 min-h-[90px] focus:ring-4 focus:ring-teal-500/5 transition-all text-sm resize-none"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
          </div>

          {/* Row 5: Attachments */}
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1">
              <Paperclip className="h-3 w-3 inline mr-1" />
              Attachments <span className="text-slate-600 normal-case font-normal tracking-normal">(optional)</span>
            </Label>
            <div
              className="w-full bg-black/40 border border-white/10 border-dashed rounded-md h-12 flex items-center px-4 gap-3 cursor-pointer hover:border-teal-500/40 hover:bg-black/60 transition-all"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4 text-slate-500" />
              <span className="text-sm text-slate-500">
                {attachments.length > 0
                  ? `${attachments.length} file${attachments.length > 1 ? "s" : ""} selected`
                  : "Click to attach supporting documents"}
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xlsx,.png,.jpg"
              />
            </div>
          </div>
        </div>

        <div className="bg-black/30 px-6 py-4 border-t border-white/10 backdrop-blur-sm">
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="border-white/10 hover:bg-white/5 text-slate-400 hover:text-white px-6 font-semibold"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-10 shadow-lg shadow-teal-500/10 active:scale-95 transition-all"
              onClick={handleSave}
              disabled={createAudit.isPending || !cbId || !clientId || !standardId || !plannedDate || !status}
            >
              {createAudit.isPending ? "Creating..." : "Initialize Workflow"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
