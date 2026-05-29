import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/shared/ui/page-header";
import { EmptyState } from "@/shared/ui/empty-state";
import { Card } from "@/shared/ui/card";

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral dos contratos fiscalizados"
      />
      <div className="mt-6">
        <Card>
          <EmptyState
            icon={<LayoutDashboard className="h-6 w-6" />}
            title="Dashboard em breve"
            description="O Bloco 9 implementará métricas, contratos recentes e alertas."
          />
        </Card>
      </div>
    </div>
  );
}
