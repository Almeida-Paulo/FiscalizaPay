"use client";

import { useState } from "react";
import { ShieldX } from "lucide-react";
import { useSimulateFraud } from "@/entities/contract/api/use-simulate-fraud";
import {
  canSimulateFraud,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";
import { ConfirmDialog } from "./confirm-dialog";

interface SimulateFraudActionProps {
  contract: Contract;
  profile: Profile;
}

export function SimulateFraudAction({ contract, profile }: SimulateFraudActionProps) {
  const [open, setOpen] = useState(false);
  const [newHash, setNewHash] = useState("");
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useSimulateFraud();
  const can = canSimulateFraud(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("SIMULATE_FRAUD", contract, profile) ?? undefined);

  function handleOpenChange(v: boolean) {
    if (!v) { setNewHash(""); setReason(""); }
    setOpen(v);
  }

  function handleConfirm() {
    if (!newHash.trim()) return;
    mutate(
      {
        contractId: contract.id,
        payload: {
          newDocumentHash: newHash.trim(),
          reason: reason.trim() || undefined,
        },
      },
      { onSuccess: () => { setOpen(false); setNewHash(""); setReason(""); } },
    );
  }

  return (
    <>
      <ActionButton
        label="Simular fraude"
        loadingLabel="Simulando fraude..."
        icon={<ShieldX className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        isLoading={isPending}
        disabled={!can}
        disabledReason={disabledReason}
        variant="outline"
        className="border-danger/50 text-danger hover:bg-danger/10 hover:text-danger"
      />
      <ConfirmDialog
        open={open}
        onOpenChange={handleOpenChange}
        title="Simular adulteração de documento"
        description="Esta simulação substitui o hash do documento, permitindo testar a detecção de fraude. Se o hash divergir, uma disputa será aberta automaticamente."
        onConfirm={handleConfirm}
        isLoading={isPending}
        confirmLabel="Simular fraude"
        confirmDisabled={!newHash.trim()}
        destructive
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">Novo hash do documento *</p>
            <Input
              value={newHash}
              onChange={(e) => setNewHash(e.target.value)}
              placeholder="Hash adulterado para comparação..."
              disabled={isPending}
              className="font-mono text-xs"
            />
            {!newHash.trim() && (
              <p className="text-xs text-muted-foreground">O hash do documento é obrigatório.</p>
            )}
          </div>
          <div className="space-y-1.5">
            <p className="text-sm font-medium text-foreground">Motivo (opcional)</p>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o cenário de adulteração..."
              rows={2}
              disabled={isPending}
            />
          </div>
        </div>
      </ConfirmDialog>
    </>
  );
}
