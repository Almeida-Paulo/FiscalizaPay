"use client";
import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/shared/api/dashboard-api";
import { queryKeys } from "@/shared/api/query-keys";

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboardSummary,
    queryFn: async () => {
      const { data } = await getDashboardSummary();
      return data;
    },
  });
}
