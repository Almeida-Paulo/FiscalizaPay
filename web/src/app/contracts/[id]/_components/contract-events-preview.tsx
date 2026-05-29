import { Clock, ChevronRight, FileText, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { CopyButton } from "@/shared/ui/copy-button";
import { shortenHash, formatDateTimeBR } from "@/shared/lib/formatters";
import { EVENT_TYPE_MAP } from "@/entities/contract-event/model/constants";
import type { ContractEvent } from "@/entities/contract-event/model/types";

const MAX_PREVIEW = 3;

interface ContractEventsPreviewProps {
  events?: ContractEvent[];
  isLoading: boolean;
}

export function ContractEventsPreview({
  events,
  isLoading,
}: ContractEventsPreviewProps) {
  const sorted = events
    ? [...events].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    : [];
  const preview = sorted.slice(0, MAX_PREVIEW);
  const totalCount = sorted.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Eventos recentes</CardTitle>
          {totalCount > MAX_PREVIEW && (
            <span className="text-xs text-muted-foreground">
              Mostrando {MAX_PREVIEW} de {totalCount} eventos
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : preview.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-5 w-5" />}
            title="Nenhum evento registrado"
            description="Os eventos de atualização do contrato aparecerão aqui."
            className="py-8"
          />
        ) : (
          <div className="space-y-0">
            {preview.map((event, idx) => {
              const meta = EVENT_TYPE_MAP[event.eventType];
              return (
                <div
                  key={event.id}
                  className={`flex gap-3 py-3 ${idx !== preview.length - 1 ? "border-b border-border" : ""}`}
                >
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        meta.isAlert
                          ? "bg-danger/10"
                          : meta.isCritical
                            ? "bg-success/10"
                            : "bg-muted"
                      }`}
                    >
                      <Clock
                        className={`h-4 w-4 ${
                          meta.isAlert
                            ? "text-danger"
                            : meta.isCritical
                              ? "text-success"
                              : "text-muted-foreground"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <span
                        className={`text-sm font-medium ${meta.isAlert ? "text-danger" : "text-foreground"}`}
                      >
                        {meta.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateTimeBR(event.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      {event.responsibleName && (
                        <span>
                          {event.responsibleName} ·{" "}
                          <span className="text-primary">{event.responsibleRole}</span>
                        </span>
                      )}
                      {event.documentHash && (
                        <span className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          <span className="font-mono">{shortenHash(event.documentHash, 6)}</span>
                          <CopyButton value={event.documentHash} />
                        </span>
                      )}
                      {event.transactionHash && (
                        <span className="flex items-center gap-1">
                          <Link2 className="h-3 w-3" />
                          <span className="font-mono">{shortenHash(event.transactionHash, 6)}</span>
                          <CopyButton value={event.transactionHash} />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA for full timeline */}
        <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-muted/30 px-3 py-2.5">
          <ChevronRight className="h-4 w-4 shrink-0 text-primary" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Timeline completa</span>{" "}
            com todos os eventos, hashes e transições de status será implementada no{" "}
            <span className="text-primary">Bloco 13</span>.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
