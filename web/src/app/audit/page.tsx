import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Card } from "@/shared/ui/card";

export default function AuditPage() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Auditoria"
        description="Rastreabilidade de eventos, hashes e transações"
      />
      <div className="mt-6">
        <Card>
          <EmptyState
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Auditoria em breve"
            description="O Bloco 12 implementará o log de auditoria com filtros e exportação."
          />
        </Card>
      </div>
    </div>
  );
}
