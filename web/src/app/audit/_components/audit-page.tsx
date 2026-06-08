"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/shared/ui/page-header";
import { EVENT_TYPE_IS_ALERT } from "@/entities/contract-event/model/constants";
import { useAuditEvents } from "./use-audit-events";
import { AuditSummary } from "./audit-summary";
import { AuditFilters, type AuditFiltersState } from "./audit-filters";
import { AuditEventList } from "./audit-event-list";
import type { AuditEventItem } from "./use-audit-events";

const DEFAULT_FILTERS: AuditFiltersState = {
  search: "",
  eventType: "all",
  contractStatus: "all",
  onlyAlert: false,
  orderBy: "newest",
};

function applyFilters(events: AuditEventItem[], filters: AuditFiltersState): AuditEventItem[] {
  let result = events;

  if (filters.onlyAlert) {
    result = result.filter((e) => EVENT_TYPE_IS_ALERT[e.eventType]);
  }

  if (filters.eventType !== "all") {
    result = result.filter((e) => e.eventType === filters.eventType);
  }

  if (filters.contractStatus !== "all") {
    result = result.filter((e) => e.contractStatus === filters.contractStatus);
  }

  if (filters.search.trim() !== "") {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (e) =>
        e.contractNumber.toLowerCase().includes(q) ||
        e.contractObject.toLowerCase().includes(q) ||
        (e.responsibleName ?? "").toLowerCase().includes(q) ||
        (e.responsibleWallet ?? "").toLowerCase().includes(q) ||
        (e.transactionHash ?? "").toLowerCase().includes(q) ||
        (e.documentHash ?? "").toLowerCase().includes(q),
    );
  }

  if (filters.orderBy === "oldest") {
    result = [...result].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }

  return result;
}

export function AuditPage() {
  const [filters, setFilters] = useState<AuditFiltersState>(DEFAULT_FILTERS);
  const { data: allEvents, isLoading, isError, error } = useAuditEvents();

  const filteredEvents = useMemo(
    () => applyFilters(allEvents ?? [], filters),
    [allEvents, filters],
  );

  return (
    <div className="px-4 py-6 md:px-6 md:py-8">
      <PageHeader
        title="Auditoria"
        description="Rastreabilidade de eventos, hashes e transações"
      />

      <div className="mt-6 space-y-6">
        {/* Summary stats */}
        {!isLoading && !isError && allEvents && (
          <AuditSummary events={allEvents} />
        )}

        {/* Filters */}
        <AuditFilters
          filters={filters}
          onChange={setFilters}
          resultCount={filteredEvents.length}
          totalCount={allEvents?.length ?? 0}
        />

        {/* Event list */}
        <AuditEventList
          events={filteredEvents}
          isLoading={isLoading}
          isError={isError}
          error={error}
          totalCount={allEvents?.length ?? 0}
        />
      </div>
    </div>
  );
}
