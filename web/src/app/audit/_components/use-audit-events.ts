"use client";
import { useQuery } from "@tanstack/react-query";
import { getAuditEvents } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";

export { type AuditEventItem } from "@/shared/api/contracts-api";

export function useAuditEvents() {
  return useQuery({
    queryKey: queryKeys.auditEvents,
    queryFn: async () => {
      const { data } = await getAuditEvents();
      return data;
    },
  });
}
