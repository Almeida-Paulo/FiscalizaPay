"use client";

import { useDashboardSummary } from "@/entities/contract/api/use-dashboard-summary";
import { useContracts } from "@/entities/contract/api/use-contracts";
import { useConfirmShipment } from "@/entities/contract/api/use-confirm-shipment";
import { useConfirmDelivery } from "@/entities/contract/api/use-confirm-delivery";
import { useValidateReceipt } from "@/entities/contract/api/use-validate-receipt";
import { useAuthorizePayment } from "@/entities/contract/api/use-authorize-payment";
import { useRegisterOnChain } from "@/entities/transaction/api/use-register-on-chain";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { LoadingState } from "@/shared/ui/loading-state";
import { ErrorState } from "@/shared/ui/error-state";
import { formatCurrencyBRL } from "@/shared/lib/formatters";

export function QueryShowcase() {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: contracts, isLoading: contractsLoading, isError } = useContracts();

  const confirmShipment = useConfirmShipment();
  const confirmDelivery = useConfirmDelivery();
  const validateReceipt = useValidateReceipt();
  const authorizePayment = useAuthorizePayment();
  const registerOnChain = useRegisterOnChain();

  function getMutationButton(contractId: string, status: string) {
    switch (status) {
      case "CRIADO":
        return (
          <Button
            size="sm"
            variant="outline"
            disabled={confirmShipment.isPending}
            onClick={() => confirmShipment.mutate({ contractId })}
          >
            Confirmar Envio
          </Button>
        );
      case "ENVIADO":
        return (
          <Button
            size="sm"
            variant="outline"
            disabled={confirmDelivery.isPending}
            onClick={() => confirmDelivery.mutate({ contractId })}
          >
            Confirmar Entrega
          </Button>
        );
      case "ENTREGUE":
        return (
          <Button
            size="sm"
            variant="outline"
            disabled={validateReceipt.isPending}
            onClick={() => validateReceipt.mutate({ contractId })}
          >
            Validar Recebimento
          </Button>
        );
      case "VALIDADO":
        return (
          <Button
            size="sm"
            variant="outline"
            disabled={authorizePayment.isPending}
            onClick={() => authorizePayment.mutate({ contractId })}
          >
            Autorizar Pagamento
          </Button>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-4">
      {/* Dashboard Summary — live from mockStore */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summaryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="mt-1 h-3 w-12" />
              </CardContent>
            </Card>
          ))
        ) : (
          <>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{summary?.total ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">Criados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-muted-foreground">{summary?.criado ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">Enviados</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-warning">{summary?.enviado ?? 0}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-xs text-muted-foreground">Em disputa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-danger">{summary?.disputa ?? 0}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Contract list — live, updates after mutations */}
      {contractsLoading && <LoadingState label="Carregando contratos..." />}
      {isError && (
        <ErrorState
          title="Falha ao carregar contratos"
          description="Verifique os logs do console."
        />
      )}
      {contracts && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            {contracts.length} contrato(s) — clique nos botões para avançar o status e observar a
            invalidação do cache
          </p>
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col">
                <span className="font-mono text-xs text-muted-foreground">
                  {contract.contractNumber}
                </span>
                <span className="text-sm font-medium">{contract.publicAgency}</span>
                <span className="text-xs text-muted-foreground">
                  {formatCurrencyBRL(contract.amount)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ContractStatusBadge status={contract.status} />
                {getMutationButton(contract.id, contract.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Register on-chain button for CT-2026-001 */}
      <div className="rounded-lg border border-border bg-card px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Registrar CT-2026-001 na blockchain (mockado)
        </p>
        <Button
          size="sm"
          variant="outline"
          className="mt-2"
          disabled={registerOnChain.isPending}
          onClick={() => registerOnChain.mutate("mock-contract-1")}
        >
          Registrar on-chain
        </Button>
      </div>
    </div>
  );
}
