import { PlusCircle } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Card } from "@/shared/ui/card";

export default function NewContractPage() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Novo contrato"
        description="Cadastre um contrato para fiscalização"
      />
      <div className="mt-6">
        <Card>
          <EmptyState
            icon={<PlusCircle className="h-6 w-6" />}
            title="Formulário em breve"
            description="O Bloco 10 implementará o formulário de cadastro de contratos."
          />
        </Card>
      </div>
    </div>
  );
}
