"use client";

import { useState } from "react";
import { ShieldX } from "lucide-react";
import { useSimulateFraud } from "@/entities/contract/api/use-simulate-fraud";
import {
  canSimulateFraud,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import { SimulateFraudDialog } from "@/features/simulate-fraud";
import type { SimulateFraudValues } from "@/features/simulate-fraud";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";

interface SimulateFraudActionProps {
  contract: Contract;
  profile: Profile;
}

export function SimulateFraudAction({ contract, profile }: SimulateFraudActionProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useSimulateFraud();
  const can = canSimulateFraud(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("SIMULATE_FRAUD", contract, profile) ?? undefined);

  function handleSubmit(values: SimulateFraudValues) {
    mutate(
      {
        contractId: contract.id,
        payload: {
          newDocumentHash: values.alteredDocumentHash,
          reason: values.fraudReason,
        },
      },
      { onSuccess: () => setOpen(false) },
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
      <SimulateFraudDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={handleSubmit}
        originalHash={contract.documentHash ?? ""}
        isLoading={isPending}
      />
    </>
  );
}
