"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { ErrorState } from "@/shared/ui/error-state";
import { useContracts } from "@/entities/contract/api/use-contracts";
import { ContractsFilters, type StatusFilter, type SortOrder } from "@/widgets/contracts-filters";
import { ContractsList } from "@/widgets/contracts-list";
import { ContractsSummaryBar } from "@/widgets/contracts-summary-bar";
import { useCurrentProfile } from "@/entities/profile/model/use-current-profile";
import { canCreateContract } from "@/entities/contract/model/rules";

const DEFAULT_SORT: SortOrder = "updatedAt_desc";

function sortContracts(contracts: ReturnType<typeof useContracts>["data"], order: SortOrder) {
  if (!contracts) return [];
  return [...contracts].sort((a, b) => {
    switch (order) {
      case "updatedAt_desc":
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case "updatedAt_asc":
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      case "amount_desc":
        return b.amount - a.amount;
      case "amount_asc":
        return a.amount - b.amount;
    }
  });
}

export function ContractsPage() {
  const { data: contracts, isLoading, isError } = useContracts();
  const { profile } = useCurrentProfile();
  const canCreate = profile ? canCreateContract(profile) : false;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [agencyFilter, setAgencyFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>(DEFAULT_SORT);

  const hasActiveFilters =
    search.trim() !== "" || statusFilter !== "ALL" || agencyFilter !== "ALL";

  const agencies = useMemo(
    () =>
      Array.from(new Set((contracts ?? []).map((c) => c.publicAgency))).sort(),
    [contracts],
  );

  const filteredContracts = useMemo(() => {
    const sorted = sortContracts(contracts, sortOrder);
    const query = search.trim().toLowerCase();

    return sorted.filter((c) => {
      if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
      if (agencyFilter !== "ALL" && c.publicAgency !== agencyFilter) return false;
      if (query) {
        const haystack = [
          c.contractNumber,
          c.supplierName,
          c.publicAgency,
          c.object,
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
  }, [contracts, search, statusFilter, agencyFilter, sortOrder]);

  function handleClear() {
    setSearch("");
    setStatusFilter("ALL");
    setAgencyFilter("ALL");
    setSortOrder(DEFAULT_SORT);
  }

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Contratos"
        description="Acompanhe contratos públicos e o status de execução"
        action={
          canCreate ? (
          <Button asChild size="sm">
            <Link href="/contracts/new">Novo contrato</Link>
          </Button>
          ) : undefined
        }
      />

      {isError ? (
        <div className="mt-6">
          <ErrorState
            title="Erro ao carregar contratos"
            description="Não foi possível buscar a lista de contratos. Tente novamente."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {/* Filters row */}
          <ContractsFilters
            search={search}
            statusFilter={statusFilter}
            agencyFilter={agencyFilter}
            sortOrder={sortOrder}
            agencies={agencies}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
            onAgencyChange={setAgencyFilter}
            onSortChange={setSortOrder}
            onClear={handleClear}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Summary bar — only when data is loaded */}
          {!isLoading && (
            <ContractsSummaryBar contracts={filteredContracts} />
          )}

          {/* Contracts list */}
          <ContractsList
            contracts={filteredContracts}
            isLoading={isLoading}
            isFiltered={hasActiveFilters}
            onClearFilters={handleClear}
            canCreateContract={canCreate}
          />
        </div>
      )}
    </div>
  );
}
