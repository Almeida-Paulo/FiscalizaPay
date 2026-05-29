"use client";

import {
  LayoutDashboard,
  PlusCircle,
  Truck,
  PackageCheck,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import { useDashboardSummary } from "@/entities/contract/api/use-dashboard-summary";
import { useContracts } from "@/entities/contract/api/use-contracts";
import { formatCurrencyCompact } from "@/shared/lib/formatters";
import { ErrorState } from "@/shared/ui/error-state";
import { DashboardMetricCard } from "./dashboard-metric-card";

export function DashboardMetrics() {
  const summary = useDashboardSummary();
  const contracts = useContracts();

  const isLoading = summary.isLoading || contracts.isLoading;
  const isError = summary.isError || contracts.isError;

  if (isError) {
    return (
      <ErrorState
        title="Erro ao carregar métricas"
        description="Não foi possível buscar o resumo do dashboard."
      />
    );
  }

  const totalAmount =
    contracts.data?.reduce((sum, c) => sum + c.amount, 0) ?? 0;

  const metrics = [
    {
      title: "Total de contratos",
      value: summary.data?.total ?? 0,
      description: "Todos os status",
      icon: <LayoutDashboard className="h-5 w-5" />,
      variant: "default" as const,
    },
    {
      title: "Criados",
      value: summary.data?.criado ?? 0,
      description: "Aguardando envio",
      icon: <PlusCircle className="h-5 w-5" />,
      variant: "default" as const,
    },
    {
      title: "Enviados",
      value: summary.data?.enviado ?? 0,
      description: "Aguardando entrega",
      icon: <Truck className="h-5 w-5" />,
      variant: "default" as const,
    },
    {
      title: "Entregues",
      value: summary.data?.entregue ?? 0,
      description: "Aguardando fiscalização",
      icon: <PackageCheck className="h-5 w-5" />,
      variant: "default" as const,
    },
    {
      title: "Validados",
      value: summary.data?.validado ?? 0,
      description: "Aguardando autorização",
      icon: <ClipboardCheck className="h-5 w-5" />,
      variant: "default" as const,
    },
    {
      title: "Pgtos. autorizados",
      value: summary.data?.pagamentoAutorizado ?? 0,
      description: "Ciclo concluído",
      icon: <CheckCircle2 className="h-5 w-5" />,
      variant: "success" as const,
    },
    {
      title: "Em disputa",
      value: summary.data?.disputa ?? 0,
      description: "Pagamento bloqueado",
      icon: <AlertTriangle className="h-5 w-5" />,
      variant: "danger" as const,
    },
    {
      title: "Valor total fiscalizado",
      value: formatCurrencyCompact(totalAmount),
      description: "Soma de todos os contratos",
      icon: <DollarSign className="h-5 w-5" />,
      variant: "success" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {metrics.map((metric) => (
        <DashboardMetricCard
          key={metric.title}
          loading={isLoading}
          {...metric}
        />
      ))}
    </div>
  );
}
