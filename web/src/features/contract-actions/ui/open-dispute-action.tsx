"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useOpenDispute } from "@/entities/contract/api/use-open-dispute";
import {
  canOpenDispute,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import { Textarea } from "@/shared/ui/textarea";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";
import { ConfirmDialog } from "./confirm-dialog";

interface OpenDisputeActionProps {
  contract: Contract;
  profile: Profile;
}

export function OpenDisputeAction({ contract, profile }: OpenDisputeActionProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useOpenDispute();
  const can = canOpenDispute(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("OPEN_DISPUTE", contract, profile) ?? undefined);

  function handleOpenChange(v: boolean) {
    if (!v) setReason("");
    setOpen(v);
  }

  function handleConfirm() {
    if (!reason.trim()) return;
    mutate(
      { contractId: contract.id, payload: { reason: reason.trim() } },
      { onSuccess: () => { setOpen(false); setReason(""); } },
    );
  }

  return (
    <>
      <ActionButton
        label="Abrir disputa"
        loadingLabel="Abrindo disputa..."
        icon={<AlertTriangle className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        isLoading={isPending}
        disabled={!can}
        disabledReason={disabledReason}
        variant="outline"
        className="border-warning/50 text-warning hover:bg-warning/10 hover:text-warning"
      />
      <ConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Abrir disputa"
        description="Ao abrir uma disputa, o pagamento será bloqueado até resolução. Esta ação será registrada permanentemente na auditoria."
        onConfirm={handleConfirm}
        isLoading={isPending}
        confirmLabel="Abrir disputa"
        confirmDisabled={!reason.trim()}
        destructive
      >
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-foreground">Motivo da disputa *</p>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Descreva o motivo da disputa..."
            rows={3}
            disabled={isPending}
          />
          {!reason.trim() && (
            <p className="text-xs text-muted-foreground">O motivo é obrigatório para abrir uma disputa.</p>
          )}
        </div>
      </ConfirmDialog>
    </>
  );
}
