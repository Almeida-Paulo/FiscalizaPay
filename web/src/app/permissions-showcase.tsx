"use client";

import { useProfileStore } from "@/entities/profile/model/store";
import { ProfileSwitcher } from "@/entities/profile/ui/profile-switcher";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { PermissionGate } from "@/shared/ui/permission-gate";
import {
  canConfirmShipment,
  canConfirmDelivery,
  canAuthorizePayment,
  canOpenDispute,
  getAvailableContractActions,
  getBlockedActionReason,
} from "@/entities/contract/model/rules";
import type { Contract } from "@/entities/contract";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { SectionTitle } from "@/shared/ui/section-title";
import { CheckCircle, XCircle } from "lucide-react";

/** Contrato fake mínimo para showcase das regras visuais — não é mock real */
const SHOWCASE_CONTRACT: Contract = {
  id: "showcase-1",
  contractNumber: "CT-DEMO-001",
  publicAgency: "Prefeitura Demo",
  supplierName: "Empresa Demo",
  object: "Fornecimento de equipamentos",
  amount: 150000,
  deadline: "2026-12-31T23:59:59.000Z",
  inspectorName: "Fiscal Demo",
  logisticsResponsible: "Logística Demo",
  status: "CRIADO",
  documentHash: "abc123def456",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function PermissionsShowcase() {
  const { currentProfile } = useProfileStore();

  const availableActions = getAvailableContractActions(SHOWCASE_CONTRACT, currentProfile);
  const canShip = canConfirmShipment(SHOWCASE_CONTRACT, currentProfile);
  const canDeliver = canConfirmDelivery(SHOWCASE_CONTRACT, currentProfile);
  const canPay = canAuthorizePayment(SHOWCASE_CONTRACT, currentProfile);
  const canDispute = canOpenDispute(SHOWCASE_CONTRACT, currentProfile);
  // canValidateReceipt, canSimulateFraud: verificados via getAvailableContractActions

  const shipReason = getBlockedActionReason("CONFIRM_SHIPMENT", SHOWCASE_CONTRACT, currentProfile);
  const payReason = getBlockedActionReason("AUTHORIZE_PAYMENT", SHOWCASE_CONTRACT, currentProfile);

  return (
    <div className="space-y-6">
      {/* ProfileSwitcher */}
      <div>
        <SectionTitle
          title="Regras visuais por perfil"
          description="Selecione um perfil para ver quais ações estão disponíveis"
        />
        <ProfileSwitcher className="mt-3" />
      </div>

      {/* Contrato demo */}
      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
        <span className="text-xs text-muted-foreground">Contrato demo:</span>
        <span className="font-mono text-xs">{SHOWCASE_CONTRACT.contractNumber}</span>
        <ContractStatusBadge status={SHOWCASE_CONTRACT.status} />
      </div>

      {/* Ações disponíveis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">
            Ações disponíveis para{" "}
            <span className="text-primary">{currentProfile.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableActions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma ação disponível para este perfil/status.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {availableActions.map((action) => (
                <Badge key={action} variant="outline" className="border-success/40 text-success">
                  {action.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* PermissionGate examples */}
      <div className="space-y-3">
        <SectionTitle
          title="PermissionGate"
          description="Oculta ou exibe baseado na permissão visual"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              canConfirmShipment
            </p>
            <div className="flex items-center gap-2">
              {canShip ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-danger" />
              )}
              <PermissionGate
                allowed={canShip}
                fallback={
                  <span className="text-xs text-muted-foreground">
                    {shipReason}
                  </span>
                }
              >
                <Button size="sm" variant="outline">
                  Confirmar envio
                </Button>
              </PermissionGate>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
              canAuthorizePayment
            </p>
            <div className="flex items-center gap-2">
              {canPay ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-danger" />
              )}
              <PermissionGate
                allowed={canPay}
                fallback={
                  <span className="text-xs text-muted-foreground">
                    {payReason}
                  </span>
                }
              >
                <Button size="sm">Autorizar pagamento</Button>
              </PermissionGate>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">canConfirmDelivery</p>
            <div className="flex items-center gap-2">
              {canDeliver ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">
                {canDeliver ? "Disponível" : "Bloqueado — status CRIADO"}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">canOpenDispute</p>
            <div className="flex items-center gap-2">
              {canDispute ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <XCircle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">
                {canDispute ? "Disponível" : "Apenas GESTOR/FISCAL/AUDITOR"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
