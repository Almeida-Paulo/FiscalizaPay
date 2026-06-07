"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";
import { DashboardMetrics } from "@/widgets/dashboard-metrics";
import { DashboardStatusOverview } from "@/widgets/dashboard-status-overview";
import { DashboardRecentContracts } from "@/widgets/dashboard-recent-contracts";
import { DashboardAlerts } from "@/widgets/dashboard-alerts";
import { useProfileStore } from "@/entities/profile/model/store";
import { canCreateContract } from "@/entities/contract/model/rules";

export default function DashboardPage() {
  const currentProfile = useProfileStore((s) => s.currentProfile);
  const canCreate = canCreateContract(currentProfile);

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral dos contratos fiscalizados"
        action={
          canCreate ? (
          <Button asChild size="sm">
            <Link href="/contracts/new">Novo contrato</Link>
          </Button>
          ) : undefined
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
