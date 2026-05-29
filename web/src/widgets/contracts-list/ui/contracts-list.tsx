"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { Button } from "@/shared/ui/button";
import { ContractCard } from "@/entities/contract/ui/contract-card";
import type { Contract } from "@/entities/contract/model/types";

interface ContractsListProps {
  contracts: Contract[];
  isLoading: boolean;
  isFiltered: boolean;
  onClearFilters: () => void;
}

const SKELETON_COUNT = 4;

export function ContractsList({
  contracts,
  isLoading,
  isFiltered,
  onClearFilters,
}: ContractsListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Card key={i} className="gap-0 py-0">
            <div className="px-5 pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-5 w-20 shrink-0 rounded-full" />
              </div>
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-1.5 h-3 w-4/5" />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border px-5 py-4">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-7 w-16 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (contracts.length === 0 && isFiltered) {
    return (
      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title="Nenhum contrato encontrado"
        description="Nenhum contrato corresponde aos filtros aplicados."
        action={
          <Button variant="outline" size="sm" onClick={onClearFilters}>
            Limpar filtros
          </Button>
        }
      />
    );
  }

  if (contracts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="h-6 w-6" />}
        title="Nenhum contrato cadastrado"
        description="Crie o primeiro contrato para iniciar a fiscalização."
        action={
          <Button asChild size="sm">
            <Link href="/contracts/new">Novo contrato</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
}
