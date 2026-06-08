"use client";
import { useQuery } from "@tanstack/react-query";
import { getAuditEvents } from "@/shared/api/audit-api";
import { queryKeys } from "@/shared/api/query-keys";

export { type AuditEventItem } from "@/shared/api/audit-api";

export function useAuditEvents() {
  return useQuery({
    queryKey: queryKeys.auditEvents,
    queryFn: async () => {
      const { data } = await getAuditEvents();
      return data;
    },
  });
}
