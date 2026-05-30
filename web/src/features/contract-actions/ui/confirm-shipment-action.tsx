"use client";

import { useState } from "react";
import { Truck } from "lucide-react";
import { useConfirmShipment } from "@/entities/contract/api/use-confirm-shipment";
import {
  canConfirmShipment,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";
import { ConfirmDialog } from "./confirm-dialog";

interface ConfirmShipmentActionProps {
  contract: Contract;
  profile: Profile;
}

export function ConfirmShipmentAction({ contract, profile }: ConfirmShipmentActionProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useConfirmShipment();
  const can = canConfirmShipment(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("CONFIRM_SHIPMENT", contract, profile) ?? undefined);

  return (
    <>
      <ActionButton
        label="Confirmar envio"
        loadingLabel="Confirmando envio..."
        icon={<Truck className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        isLoading={isPending}
        disabled={!can}
        disabledReason={disabledReason}
      />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirmar envio"
        description="Ao confirmar o envio, o contrato avança para a etapa de entrega. Esta ação será registrada na auditoria."
        onConfirm={() =>
          mutate({ contractId: contract.id }, { onSuccess: () => setOpen(false) })
        }
        isLoading={isPending}
        confirmLabel="Confirmar envio"
      />
    </>
  );
}
