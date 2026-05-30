import { cn } from "@/shared/lib/utils";
import { formatDateTimeBR } from "@/shared/lib/formatters";
import { EVENT_TYPE_MAP } from "@/entities/contract-event/model/constants";
import { RoleBadge } from "@/entities/profile/ui/role-badge";
import { TransactionHashLink } from "@/entities/transaction/ui/transaction-hash-link";
import { EventTypeIcon } from "./event-type-icon";
import { StatusTransition } from "./status-transition";
import { DocumentHashViewer } from "./document-hash-viewer";
import type { ContractEvent } from "../model/types";

interface ContractEventCardProps {
  event: ContractEvent;
  isLast?: boolean;
}

export function ContractEventCard({ event, isLast = false }: ContractEventCardProps) {
  const meta = EVENT_TYPE_MAP[event.eventType];

  const iconColor = meta.isAlert
    ? "text-danger"
    : meta.isCritical
      ? "text-success"
      : "text-primary";

  const iconBg = meta.isAlert
    ? "bg-danger/10"
    : meta.isCritical
      ? "bg-success/10"
      : "bg-primary/10";

  const hasHashes = event.documentHash || event.transactionHash;
  const hasTransition = event.statusBefore && event.statusAfter;

  return (
    <div className="flex gap-4">
      {/* Timeline dot + vertical connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            iconBg,
          )}
        >
          <EventTypeIcon
            eventType={event.eventType}
            className={cn("h-4 w-4", iconColor)}
          />
        </div>
        {!isLast && <div className="mt-1 w-px flex-1 bg-border" />}
      </div>

      {/* Event content */}
      <div className={cn("min-w-0 flex-1", !isLast && "pb-6")}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span
            className={cn(
              "text-sm font-semibold",
              meta.isAlert ? "text-danger" : "text-foreground",
            )}
          >
            {meta.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDateTimeBR(event.createdAt)}
          </span>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>

        {hasTransition && (
          <div className="mt-2">
            <StatusTransition from={event.statusBefore!} to={event.statusAfter!} />
          </div>
        )}

        {event.responsibleName && (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {event.responsibleName}
            </span>
            <RoleBadge role={event.responsibleRole} />
          </div>
        )}

        {hasHashes && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {event.documentHash && (
              <DocumentHashViewer hash={event.documentHash} />
            )}
            {event.transactionHash && (
              <TransactionHashLink hash={event.transactionHash} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
