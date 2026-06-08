"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { CreateContractForm } from "@/features/create-contract";
import { ErrorState } from "@/shared/ui/error-state";
import { useCurrentProfile } from "@/entities/profile/model/use-current-profile";
import { canCreateContract } from "@/entities/contract/model/rules";

export function CreateContractPage() {
  const { profile, isMockMode, isAuthenticated, isLoading, error } = useCurrentProfile();
  const canCreate = profile ? canCreateContract(profile) : false;

  function renderContent() {
    if (!isMockMode) {
      if (isLoading) {
        return (
          <div className="flex items-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            Carregando perfil autenticado...
          </div>
        );
      }

      if (error) {
        return (
          <ErrorState
            title="Erro ao carregar perfil"
            description={error}
          />
        );
      }

      if (!isAuthenticated || !profile) {
        return (
          <ErrorState
            title="Autenticacao necessaria"
            description="Conecte sua wallet e faca login para acessar a criacao de contratos."
          />
        );
      }
    }

    if (!canCreate) {
      return (
        <ErrorState
          title="Permissao insuficiente"
          description="Voce nao tem permissao para criar contratos."
        />
      );
    }

    return <CreateContractForm />;
  }

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Novo contrato"
        description="Cadastre um contrato público para fiscalização"
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/contracts">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        }
      />

      <div className="mt-6 max-w-3xl">{renderContent()}</div>
    </div>
  );
}
