import { FileText } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function ContractsPage() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Contratos"
        description="Acompanhe contratos públicos e status de execução"
        action={
          <Button asChild size="sm">
            <Link href="/contracts/new">Novo contrato</Link>
          </Button>
        }
      />
      <div className="mt-6">
        <Card>
          <EmptyState
            icon={<FileText className="h-6 w-6" />}
            title="Listagem em breve"
            description="O Bloco 10 implementará a listagem de contratos com filtros por status."
          />
        </Card>
      </div>
    </div>
  );
}
