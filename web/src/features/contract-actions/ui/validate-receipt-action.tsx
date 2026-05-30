"use client";

import { useState } from "react";
import { ClipboardCheck } from "lucide-react";
import { useValidateReceipt } from "@/entities/contract/api/use-validate-receipt";
import {
  canValidateReceipt,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";
import { ConfirmDialog } from "./confirm-dialog";

interface ValidateReceiptActionProps {
  contract: Contract;
  profile: Profile;
}

export function ValidateReceiptAction({ contract, profile }: ValidateReceiptActionProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useValidateReceipt();
  const can = canValidateReceipt(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("VALIDATE_RECEIPT", contract, profile) ?? undefined);

  return (
    <>
      <ActionButton
        label="Validar recebimento"
        loadingLabel="Validando recebimento..."
        icon={<ClipboardCheck className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        isLoading={isPending}
        disabled={!can}
        disabledReason={disabledReason}
      />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Validar recebimento"
        description="Ao validar o recebimento, o contrato avança para autorização de pagamento. Esta ação confirma a conformidade da entrega."
        onConfirm={() =>
          mutate({ contractId: contract.id }, { onSuccess: () => setOpen(false) })
        }
        isLoading={isPending}
        confirmLabel="Validar recebimento"
      />
    </>
  );
}
