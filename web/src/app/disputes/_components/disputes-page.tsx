"use client";

import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { useContracts } from "@/entities/contract/api/use-contracts";
import { DisputesSummary } from "./disputes-summary";
import { DisputeCard } from "./dispute-card";

export function DisputesPage() {
  const { data: disputes, isLoading } = useContracts("DISPUTA");

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Disputas"
        description="Contratos com divergência ou bloqueio de pagamento"
      />

      <div className="mt-6 space-y-6">
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Skeleton className="h-[76px] rounded-xl" />
              <Skeleton className="h-[76px] rounded-xl" />
              <Skeleton className="h-[76px] rounded-xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-[140px] rounded-xl" />
              <Skeleton className="h-[140px] rounded-xl" />
            </div>
          </>
        ) : !disputes || disputes.length === 0 ? (
          <EmptyState
            icon={<CheckCircle2 className="h-6 w-6 text-success" />}
            title="Nenhuma disputa ativa"
            description="Todos os contratos estão com fluxo de pagamento desbloqueado."
          />
        ) : (
          <>
            <DisputesSummary contracts={disputes} />
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">
                {disputes.length} {disputes.length === 1 ? "contrato" : "contratos"} em disputa
              </p>
              {disputes.map((contract) => (
                <DisputeCard key={contract.id} contract={contract} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
