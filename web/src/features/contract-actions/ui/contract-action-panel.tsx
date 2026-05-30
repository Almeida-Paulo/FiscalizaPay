"use client";

import { CheckCircle2, AlertTriangle, Zap, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { RoleBadge } from "@/entities/profile/ui/role-badge";
import { useProfileStore } from "@/entities/profile/model/store";
import {
  getNextContractAction,
  getCanonicalNextAction,
  getBlockedActionReason,
  canOpenDispute,
  canSimulateFraud,
  CONTRACT_ACTION_LABELS,
} from "@/entities/contract/model/rules";
import type { Contract, BlockchainStatus } from "@/entities/contract";
import { ConfirmShipmentAction } from "./confirm-shipment-action";
import { ConfirmDeliveryAction } from "./confirm-delivery-action";
import { ValidateReceiptAction } from "./validate-receipt-action";
import { AuthorizePaymentAction } from "./authorize-payment-action";
import { OpenDisputeAction } from "./open-dispute-action";
import { SimulateFraudAction } from "./simulate-fraud-action";
import { RegisterOnChainAction } from "./register-on-chain-action";

interface ContractActionPanelProps {
  contract: Contract;
  blockchainStatus?: BlockchainStatus;
}

export function ContractActionPanel({
  contract,
  blockchainStatus,
}: ContractActionPanelProps) {
  const currentProfile = useProfileStore((s) => s.currentProfile);

  const nextAction = getNextContractAction(contract, currentProfile);
  const canonicalNext = getCanonicalNextAction(contract);
  const canDoDispute = canOpenDispute(contract, currentProfile);
  const canDoFraud = canSimulateFraud(contract, currentProfile);
  const hasSecondaryActions = canDoDispute || canDoFraud;

  const isCompleted = contract.status === "PAGAMENTO_AUTORIZADO";
  const isDisputed = contract.status === "DISPUTA";
  const showRegisterOnChain = !isCompleted && !blockchainStatus?.registeredOnChain;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Ações do contrato</CardTitle>
          <RoleBadge role={currentProfile.role} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* ── COMPLETED ── */}
        {isCompleted && (
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
        )}

        {/* ── DISPUTED ── */}
        {isDisputed && (
          <>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-danger/10">
                <AlertTriangle className="h-5 w-5 text-danger" />
              </div>
              <div>
                <p className="text-sm font-semibold text-danger">Pagamento bloqueado</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  O contrato está em disputa. Nenhuma ação de fluxo pode ser executada até
                  resolução.
                </p>
              </div>
            </div>
            {canDoFraud && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Ações de auditoria</p>
                  <SimulateFraudAction contract={contract} profile={currentProfile} />
                </div>
              </>
            )}
          </>
        )}

        {/* ── NORMAL FLOW ── */}
        {!isCompleted && !isDisputed && (
          <>
            {nextAction ? (
              /* Primary action — highlighted */
              <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 shrink-0 text-primary" />
                  <span className="text-xs font-medium text-primary">Próxima ação</span>
                </div>
                {nextAction === "CONFIRM_SHIPMENT" && (
                  <ConfirmShipmentAction contract={contract} profile={currentProfile} />
                )}
                {nextAction === "CONFIRM_DELIVERY" && (
                  <ConfirmDeliveryAction contract={contract} profile={currentProfile} />
                )}
                {nextAction === "VALIDATE_RECEIPT" && (
                  <ValidateReceiptAction contract={contract} profile={currentProfile} />
                )}
                {nextAction === "AUTHORIZE_PAYMENT" && (
                  <AuthorizePaymentAction contract={contract} profile={currentProfile} />
                )}
              </div>
            ) : (
              /* Blocked — explain why */
              <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  {canonicalNext ? (
                    <>
                      <p className="text-sm font-medium text-muted-foreground">
                        Aguardando: {CONTRACT_ACTION_LABELS[canonicalNext]}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {getBlockedActionReason(canonicalNext, contract, currentProfile) ??
                          "O perfil atual não pode executar esta ação."}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-medium text-muted-foreground">
                      Nenhuma ação disponível para o status atual.
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Troque o perfil ativo no header para simular outras permissões.
                  </p>
                </div>
              </div>
            )}

            {/* Secondary actions */}
            {hasSecondaryActions && (
              <>
                <Separator />
                <div className="space-y-3">
                  <p className="text-xs font-medium text-muted-foreground">Ações adicionais</p>
                  {canDoDispute && (
                    <OpenDisputeAction contract={contract} profile={currentProfile} />
                  )}
                  {canDoFraud && (
                    <SimulateFraudAction contract={contract} profile={currentProfile} />
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Register on-chain */}
        {showRegisterOnChain && (
          <>
            <Separator />
            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Blockchain</p>
              <RegisterOnChainAction
                contractId={contract.id}
                blockchainStatus={blockchainStatus}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
