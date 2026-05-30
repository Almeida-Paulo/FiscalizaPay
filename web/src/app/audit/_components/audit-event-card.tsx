import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { formatDateTimeBR } from "@/shared/lib/formatters";
import { EventTypeIcon } from "@/entities/contract-event/ui/event-type-icon";
import { StatusTransition } from "@/entities/contract-event/ui/status-transition";
import { DocumentHashViewer } from "@/entities/contract-event/ui/document-hash-viewer";
import { TransactionHashLink } from "@/entities/transaction/ui/transaction-hash-link";
import { RoleBadge } from "@/entities/profile/ui/role-badge";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { EVENT_TYPE_MAP } from "@/entities/contract-event/model/constants";
import type { AuditEventItem } from "./use-audit-events";

interface AuditEventCardProps {
  event: AuditEventItem;
}

export function AuditEventCard({ event }: AuditEventCardProps) {
  const meta = EVENT_TYPE_MAP[event.eventType];

  return (
    <Card
      className={cn(
        "gap-0 p-4 transition-colors",
        meta.isAlert && "border-warning/20 bg-warning/5",
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            meta.isAlert
              ? "bg-warning/15 text-warning"
              : meta.isCritical
                ? "bg-success/15 text-success"
                : "bg-muted text-muted-foreground",
          )}
        >
          <EventTypeIcon eventType={event.eventType} className="h-4 w-4" />
        </div>

        {/* Main content */}
        <div className="min-w-0 flex-1 space-y-1.5">
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-sm font-semibold text-foreground">{meta.label}</p>
            <span className="text-xs text-muted-foreground">
              {formatDateTimeBR(event.createdAt)}
            </span>
          </div>

          {/* Contract link */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/contracts/${event.contractId}`}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <span className="font-mono">{event.contractNumber}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </Link>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {event.contractObject}
            </span>
            <ContractStatusBadge status={event.contractStatus} />
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground">{event.description}</p>

          {/* Responsible */}
          <div className="flex flex-wrap items-center gap-2">
            <RoleBadge role={event.responsibleRole} />
            {event.responsibleName && (
              <span className="text-xs text-muted-foreground">{event.responsibleName}</span>
            )}
          </div>

          {/* Status transition */}
          {event.statusBefore && event.statusAfter && (
            <StatusTransition from={event.statusBefore} to={event.statusAfter} />
          )}

          {/* Hashes */}
          {(event.documentHash || event.transactionHash) && (
            <div className="flex flex-wrap items-center gap-4 pt-0.5">
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
    </Card>
  );
}
