"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/shared/api/dashboard-api";
import { queryKeys } from "@/shared/api/query-keys";
import { useProtectedQueryEnabled } from "@/shared/api/use-protected-query-enabled";

export function useDashboardSummary() {
  const enabled = useProtectedQueryEnabled();

  return useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: async () => {
      const { data } = await getDashboardSummary();
      return data;
    },
    enabled,
  });
}
