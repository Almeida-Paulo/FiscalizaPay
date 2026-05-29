"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { useDashboardSummary } from "@/entities/contract/api/use-dashboard-summary";
import { CONTRACT_STATUS_MAP } from "@/entities/contract/model/constants";
import type { ContractStatus } from "@/entities/contract/model/types";
import { cn } from "@/shared/lib/utils";

const ORDERED_STATUSES: ContractStatus[] = [
  "CRIADO",
  "ENVIADO",
  "ENTREGUE",
  "VALIDADO",
  "PAGAMENTO_AUTORIZADO",
  "DISPUTA",
];

const SUMMARY_KEY: Record<ContractStatus, keyof { criado: number; enviado: number; entregue: number; validado: number; pagamentoAutorizado: number; disputa: number }> = {
  CRIADO: "criado",
  ENVIADO: "enviado",
  ENTREGUE: "entregue",
  VALIDADO: "validado",
  PAGAMENTO_AUTORIZADO: "pagamentoAutorizado",
  DISPUTA: "disputa",
};

const VARIANT_BAR_CLASS: Record<string, string> = {
  neutral: "bg-muted-foreground/40",
  info: "bg-primary",
  warning: "bg-warning",
  success: "bg-success",
  danger: "bg-danger",
};

const VARIANT_DOT_CLASS: Record<string, string> = {
  neutral: "bg-muted-foreground/60",
  info: "bg-primary",
  warning: "bg-warning",
  success: "bg-success",
  danger: "bg-danger",
};

export function DashboardStatusOverview() {
  const { data: summary, isLoading, isError } = useDashboardSummary();

  const total = summary?.total ?? 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Resumo por status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isError && (
          <p className="text-xs text-muted-foreground">Erro ao carregar dados.</p>
        )}
        {ORDERED_STATUSES.map((status) => {
          const { label, variant } = CONTRACT_STATUS_MAP[status];
          const count = summary?.[SUMMARY_KEY[status]] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;

          return (
            <div key={status} className="flex items-center gap-3">
              {isLoading ? (
                <>
                  <Skeleton className="h-2 w-2 rounded-full" />
                  <Skeleton className="h-3 flex-1" />
                  <Skeleton className="h-3 w-6" />
                </>
              ) : (
                <>
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      VARIANT_DOT_CLASS[variant],
                    )}
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-xs text-foreground">{label}</span>
                      <span className="shrink-0 tabular-nums text-xs font-semibold text-foreground">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          VARIANT_BAR_CLASS[variant],
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
