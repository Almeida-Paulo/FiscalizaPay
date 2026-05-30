"use client";

import { useState } from "react";
import { Banknote } from "lucide-react";
import { useAuthorizePayment } from "@/entities/contract/api/use-authorize-payment";
import {
  canAuthorizePayment,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import type { Contract } from "@/entities/contract";
import type { Profile } from "@/entities/profile";
import { ActionButton } from "./action-button";
import { ConfirmDialog } from "./confirm-dialog";

interface AuthorizePaymentActionProps {
  contract: Contract;
  profile: Profile;
}

export function AuthorizePaymentAction({ contract, profile }: AuthorizePaymentActionProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useAuthorizePayment();
  const can = canAuthorizePayment(contract, profile);
  const disabledReason = can
    ? undefined
    : (getBlockedActionReason("AUTHORIZE_PAYMENT", contract, profile) ?? undefined);

  return (
    <>
      <ActionButton
        label="Autorizar pagamento"
        loadingLabel="Autorizando pagamento..."
        icon={<Banknote className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        isLoading={isPending}
        disabled={!can}
        disabledReason={disabledReason}
      />
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Autorizar pagamento"
        description="Tem certeza que deseja autorizar o pagamento? Esta é uma etapa crítica e irreversível do fluxo. Será registrada na auditoria visual."
        onConfirm={() =>
          mutate({ contractId: contract.id }, { onSuccess: () => setOpen(false) })
        }
        isLoading={isPending}
        confirmLabel="Autorizar pagamento"
      />
    </>
  );
}
