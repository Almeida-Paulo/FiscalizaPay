"use client";

import { Zap, Lock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { useProfileStore } from "@/entities/profile/model/store";
import {
  getNextContractAction,
  getBlockedActionReason,
  type ContractAction,
} from "@/entities/contract/model/rules";
import type { Contract } from "@/entities/contract";

const ACTION_LABELS: Record<ContractAction, string> = {
  CONFIRM_SHIPMENT: "Confirmar envio",
  CONFIRM_DELIVERY: "Confirmar entrega",
  VALIDATE_RECEIPT: "Validar recebimento",
  AUTHORIZE_PAYMENT: "Autorizar pagamento",
  OPEN_DISPUTE: "Abrir disputa",
  SIMULATE_FRAUD: "Simular fraude",
};

const ACTION_DESCRIPTIONS: Record<ContractAction, string> = {
  CONFIRM_SHIPMENT:
    "O fornecedor deve confirmar que o envio ou execução foi realizado.",
  CONFIRM_DELIVERY:
    "O entregador deve confirmar que a entrega foi feita no local.",
  VALIDATE_RECEIPT:
    "O fiscal deve verificar a conformidade da entrega e validar o recebimento.",
  AUTHORIZE_PAYMENT:
    "O gestor pode autorizar o pagamento após a validação do fiscal.",
  OPEN_DISPUTE: "Registrar uma divergência para bloquear o pagamento.",
  SIMULATE_FRAUD: "Simular adulteração de documento para demonstrar rastreabilidade.",
};

interface ContractNextActionCardProps {
  contract: Contract;
}

export function ContractNextActionCard({ contract }: ContractNextActionCardProps) {
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const nextAction = getNextContractAction(contract, currentProfile);

  if (contract.status === "PAGAMENTO_AUTORIZADO") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Próxima ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-semibold text-success">Fluxo concluído</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                O pagamento foi autorizado. Este contrato completou o ciclo de fiscalização.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contract.status === "DISPUTA") {
    return (
      <Card className="border-danger/30">
        <CardHeader>
          <CardTitle className="text-base">Próxima ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/10">
              <Lock className="h-5 w-5 text-danger" />
            </div>
            <div>
              <p className="text-sm font-semibold text-danger">Pagamento bloqueado</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                O contrato está em disputa. Nenhuma ação pode ser executada até resolução.
                A resolução de disputas será implementada em breve.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (nextAction) {
    return (
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="text-base">Próxima ação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {ACTION_LABELS[nextAction]}
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {ACTION_DESCRIPTIONS[nextAction]}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Ações disponíveis serão implementadas no Bloco 14.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const blockedReason = getBlockedActionReason(
    "CONFIRM_SHIPMENT",
    contract,
    currentProfile,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Próxima ação</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
            <Lock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Perfil {currentProfile.role} — nenhuma ação disponível
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {blockedReason ??
                "O seu perfil atual não possui ações disponíveis para o status atual do contrato."}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Troque o perfil ativo no header para simular outras permissões.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
