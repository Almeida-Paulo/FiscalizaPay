"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { CreateContractForm } from "@/features/create-contract";
import { ErrorState } from "@/shared/ui/error-state";
import { useProfileStore } from "@/entities/profile/model/store";
import { canCreateContract } from "@/entities/contract/model/rules";

export function CreateContractPage() {
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const canCreate = canCreateContract(currentProfile);

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

      <div className="mt-6 max-w-3xl">
        {canCreate ? (
          <CreateContractForm />
        ) : (
          <ErrorState
            title="Permissao insuficiente"
            description="Voce nao tem permissao para criar contratos."
          />
        )}
      </div>
    </div>
  );
}
