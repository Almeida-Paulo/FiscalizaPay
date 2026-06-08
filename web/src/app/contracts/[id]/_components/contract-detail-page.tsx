"use client";

import Link from "next/link";
import { ArrowLeft, FileSearch } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { ErrorState } from "@/shared/ui/error-state";
import { EmptyState } from "@/shared/ui/empty-state";
import { Skeleton } from "@/shared/ui/skeleton";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { HttpClientError } from "@/shared/api/http-client";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { useContractById } from "@/entities/contract/api/use-contract-by-id";
import { useContractEvents } from "@/entities/contract-event/api/use-contract-events";
import { useBlockchainStatus } from "@/entities/transaction/api/use-blockchain-status";
import { ContractDisputeAlert } from "./contract-dispute-alert";
import { ContractOverviewCard } from "./contract-overview-card";
import { ContractPartiesCard } from "./contract-parties-card";
import { ContractHashesCard } from "./contract-hashes-card";
import { ContractBlockchainCard } from "./contract-blockchain-card";
import { ContractActionPanel } from "@/features/contract-actions";
import { ContractTimeline } from "./contract-timeline";

interface ContractDetailPageProps {
  id: string;
}

export function ContractDetailPage({ id }: ContractDetailPageProps) {
  const {
    data: contract,
    isLoading: contractLoading,
    isError: contractError,
    error: contractFetchError,
  } = useContractById(id);

  const contractNotFound =
    contractFetchError instanceof HttpClientError &&
    contractFetchError.apiError.code === "NOT_FOUND";

  const { data: events, isLoading: eventsLoading } = useContractEvents(id);

  const { data: blockchainStatus, isLoading: blockchainLoading } =
    useBlockchainStatus(id);

  const backButton = (
    <Button asChild variant="outline" size="sm">
      <Link href="/contracts">
        <ArrowLeft className="mr-1.5 h-4 w-4" />
        Contratos
      </Link>
    </Button>
  );

  if (contractLoading) {
    return (
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6 flex items-center justify-between">
          {backButton}
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (contractError) {
    if (contractNotFound) {
      return (
        <div className="px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6">{backButton}</div>
          <EmptyState
            icon={<FileSearch className="h-6 w-6" />}
            title="Contrato não encontrado"
            description="O contrato solicitado não existe ou ainda não foi sincronizado."
            action={
              <Button asChild>
                <Link href="/contracts">Voltar para contratos</Link>
              </Button>
            }
          />
        </div>
      );
    }

    return (
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6">{backButton}</div>
        <ErrorState
          title="Erro ao carregar contrato"
          description={getApiErrorMessage(contractFetchError)}
          action={backButton}
        />
      </div>
    );
  }

  if (!contract) {
    return null;
  }

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      {/* Header */}
      <PageHeader
        title={contract.contractNumber}
        description={contract.publicAgency}
        badge={<ContractStatusBadge status={contract.status} />}
        action={backButton}
      />

      {/* Dispute alert */}
      {contract.status === "DISPUTA" && (
        <div className="mt-4">
          <ContractDisputeAlert contract={contract} />
        </div>
      )}

      <div className="mt-6 space-y-6">
        {/* Primary grid: overview + next action */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ContractOverviewCard contract={contract} />
          <ContractActionPanel contract={contract} blockchainStatus={blockchainStatus} />
        </div>

        {/* Secondary grid: parties + hashes + blockchain */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ContractPartiesCard contract={contract} />
          <ContractHashesCard
            contract={contract}
            blockchainStatus={blockchainStatus}
          />
          <ContractBlockchainCard
            blockchainStatus={blockchainStatus}
            isLoading={blockchainLoading}
          />
        </div>

        {/* Auditable timeline */}
        <ContractTimeline events={events} isLoading={eventsLoading} />
      </div>
    </div>
  );
}
