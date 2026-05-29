"use client";

import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { useContracts } from "@/entities/contract/api/use-contracts";
import { formatCurrencyBRL, formatDateBR } from "@/shared/lib/formatters";

const MAX_ITEMS = 5;

export function DashboardRecentContracts() {
  const { data: contracts, isLoading, isError } = useContracts();

  const recent = contracts
    ? [...contracts]
        .sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, MAX_ITEMS)
    : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-semibold">Contratos recentes</CardTitle>
        <Button asChild variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground">
          <Link href="/contracts">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isError && (
          <p className="px-6 pb-4 text-xs text-muted-foreground">
            Erro ao carregar contratos.
          </p>
        )}

        {isLoading && (
          <div className="divide-y divide-border">
            {Array.from({ length: MAX_ITEMS }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-3">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-3 w-20 shrink-0" />
                <Skeleton className="h-5 w-24 shrink-0 rounded-full" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && recent.length === 0 && (
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Nenhum contrato cadastrado"
            description="Crie o primeiro contrato para começar a fiscalizar."
            action={
              <Button asChild size="sm">
                <Link href="/contracts/new">Novo contrato</Link>
              </Button>
            }
          />
        )}

        {!isLoading && !isError && recent.length > 0 && (
          <div className="divide-y divide-border">
            {recent.map((contract) => (
              <Link
                key={contract.id}
                href={`/contracts/${contract.id}`}
                className="flex items-center gap-4 px-6 py-3 transition-colors hover:bg-muted/40"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {contract.contractNumber}
                    </span>
                    <span className="hidden text-xs text-muted-foreground sm:block">·</span>
                    <span className="hidden truncate text-xs text-muted-foreground sm:block">
                      {formatDateBR(contract.updatedAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">
                    {contract.publicAgency}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {contract.supplierName}
                  </p>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-xs font-medium text-foreground">
                    {formatCurrencyBRL(contract.amount)}
                  </p>
                </div>
                <div className="shrink-0">
                  <ContractStatusBadge status={contract.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
