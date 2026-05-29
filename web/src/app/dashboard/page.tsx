import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { DashboardMetrics } from "@/widgets/dashboard-metrics";
import { DashboardStatusOverview } from "@/widgets/dashboard-status-overview";
import { DashboardRecentContracts } from "@/widgets/dashboard-recent-contracts";
import { DashboardAlerts } from "@/widgets/dashboard-alerts";

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral dos contratos fiscalizados"
        action={
          <Button asChild size="sm">
            <Link href="/contracts/new">Novo contrato</Link>
          </Button>
        }
      />

      <div className="mt-6 space-y-6">
        {/* Metric cards grid */}
        <DashboardMetrics />

        {/* Mid-section: status overview + alerts side by side */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <DashboardStatusOverview />
          <DashboardAlerts />
        </div>

        {/* Recent contracts table */}
        <DashboardRecentContracts />
      </div>
    </div>
  );
}
