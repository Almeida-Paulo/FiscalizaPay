"use client";

import { useState } from "react";
import { Link2, CheckCircle2 } from "lucide-react";
import { useRegisterOnChain } from "@/entities/transaction/api/use-register-on-chain";
import type { BlockchainStatus } from "@/entities/contract";
import { env } from "@/shared/config/env";
import { ActionButton } from "./action-button";
import { ConfirmDialog } from "./confirm-dialog";

interface RegisterOnChainActionProps {
  contractId: string;
  blockchainStatus?: BlockchainStatus;
  isStatusLoading?: boolean;
}

export function RegisterOnChainAction({
  contractId,
  blockchainStatus,
  isStatusLoading = false,
}: RegisterOnChainActionProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useRegisterOnChain();
  const isRegistered = blockchainStatus?.registeredOnChain ?? false;
  const frontendContractAddressConfigured = env.contractAddress.trim().length > 0;
  const blockchainUnavailable =
    !env.useMocks &&
    (blockchainStatus?.blockchainAvailable === false ||
      !frontendContractAddressConfigured);
  const statusUnavailable = !env.useMocks && !isStatusLoading && !blockchainStatus;
  const disabledReason = isStatusLoading
    ? "Verificando disponibilidade blockchain..."
    : blockchainUnavailable
      ? (blockchainStatus?.unavailableReason ??
        "Registro em blockchain indisponivel neste ambiente.")
      : statusUnavailable
        ? "Nao foi possivel confirmar a disponibilidade blockchain."
        : undefined;
  const isDisabled = !!disabledReason;

  if (isRegistered) {
    return (
      <div className="flex items-center gap-2 text-xs text-success">
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
        <span>Contrato registrado na blockchain</span>
      </div>
    );
  }

  return (
    <>
      <ActionButton
        label="Registrar on-chain"
        loadingLabel="Registrando na blockchain..."
        icon={<Link2 className="h-4 w-4" />}
        onClick={() => setOpen(true)}
        isLoading={isPending}
        disabled={isDisabled}
        disabledReason={disabledReason}
        variant="outline"
      />
      {!isDisabled && (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Registrar contrato na blockchain"
          description="O hash do documento sera registrado na blockchain de forma permanente e imutavel. Esta operacao nao pode ser desfeita."
          onConfirm={() =>
            mutate(contractId, { onSuccess: () => setOpen(false) })
          }
          isLoading={isPending}
          confirmLabel="Registrar on-chain"
        />
      )}
    </>
  );
}
