"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { useConfirmDelivery } from "@/entities/contract/api/use-confirm-delivery";
import {
  canConfirmDelivery,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";
import { ConfirmDialog } from "./confirm-dialog";

interface ConfirmDeliveryActionProps {
  contract: Contract;
  profile: Profile;
}

export function ConfirmDeliveryAction({ contract, profile }: ConfirmDeliveryActionProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useConfirmDelivery();
  const can = canConfirmDelivery(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("CONFIRM_DELIVERY", contract, profile) ?? undefined);

  return (
    <>
      <ActionButton
        label="Confirmar entrega"
        loadingLabel="Confirmando entrega..."
        icon={<Package className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        isLoading={isPending}
        disabled={!can}
        disabledReason={disabledReason}
      />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirmar entrega"
        description="Ao confirmar a entrega, o contrato avança para validação pelo fiscal. Esta ação será registrada na auditoria."
        onConfirm={() =>
          mutate({ contractId: contract.id }, { onSuccess: () => setOpen(false) })
        }
        isLoading={isPending}
        confirmLabel="Confirmar entrega"
      />
    </>
  );
}
