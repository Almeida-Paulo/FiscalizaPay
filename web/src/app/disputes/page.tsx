import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Card } from "@/shared/ui/card";

export default function DisputesPage() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Disputas"
        description="Contratos com divergência ou bloqueio"
      />
      <div className="mt-6">
        <Card>
          <EmptyState
            icon={<AlertTriangle className="h-6 w-6" />}
            title="Disputas em breve"
            description="O Bloco 11 implementará a gestão de disputas e resolução de conflitos."
          />
        </Card>
      </div>
    </div>
  );
}
