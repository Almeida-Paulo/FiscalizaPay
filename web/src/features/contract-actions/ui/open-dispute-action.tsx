"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useOpenDispute } from "@/entities/contract/api/use-open-dispute";
import {
  canOpenDispute,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import { OpenDisputeDialog } from "@/features/open-dispute";
import type { OpenDisputeValues } from "@/features/open-dispute";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";

interface OpenDisputeActionProps {
  contract: Contract;
  profile: Profile;
}

export function OpenDisputeAction({ contract, profile }: OpenDisputeActionProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useOpenDispute();
  const can = canOpenDispute(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("OPEN_DISPUTE", contract, profile) ?? undefined);

  function handleSubmit(values: OpenDisputeValues) {
    mutate(
      {
        contractId: contract.id,
        payload: { reason: values.reason, disputeType: values.disputeType },
      },
      { onSuccess: () => setOpen(false) },
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
      <OpenDisputeDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </>
  );
}
