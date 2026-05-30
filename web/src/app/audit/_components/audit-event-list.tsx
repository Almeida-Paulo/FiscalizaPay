import { Search } from "lucide-react";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { AuditEventCard } from "./audit-event-card";
import type { AuditEventItem } from "./use-audit-events";

interface AuditEventListProps {
  events: AuditEventItem[] | undefined;
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
}

export function AuditEventList({ events, isLoading, isError, totalCount }: AuditEventListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState description="Não foi possível carregar os eventos de auditoria." />;
  }

  if (!events || events.length === 0) {
    const hasFilters = totalCount > 0;
    return (
      <EmptyState
        icon={<Search className="h-6 w-6" />}
        title={hasFilters ? "Nenhum evento encontrado" : "Sem eventos registrados"}
        description={
          hasFilters
            ? "Tente ajustar os filtros para encontrar o que procura."
            : "Ainda não há eventos de auditoria no sistema."
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <AuditEventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
