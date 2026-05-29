"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { useContracts } from "@/entities/contract/api/use-contracts";
import { formatDateBR } from "@/shared/lib/formatters";

export function DashboardAlerts() {
  const { data: contracts, isLoading, isError } = useContracts();

  const disputes = contracts?.filter((c) => c.status === "DISPUTA") ?? [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <CardTitle className="text-sm font-semibold">Alertas de disputa</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isError && (
          <p className="text-xs text-muted-foreground">Erro ao carregar alertas.</p>
        )}

        {isLoading && (
          <>
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
          </>
        )}

        {!isLoading && !isError && disputes.length === 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-success/20 bg-success/5 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <p className="text-sm text-success">
              Nenhuma disputa aberta no momento.
            </p>
          </div>
        )}

        {!isLoading && !isError && disputes.length > 0 && (
          <>
            {disputes.map((contract) => (
              <div
                key={contract.id}
                className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        {contract.contractNumber}
                      </span>
                      <ContractStatusBadge status={contract.status} />
                    </div>
                    <p className="mt-1 truncate text-sm font-medium text-foreground">
                      {contract.publicAgency}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Atualizado em {formatDateBR(contract.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <Button asChild variant="outline" size="sm" className="mt-1 w-full gap-1.5 text-xs">
              <Link href="/disputes">
                Ver todas as disputas <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
