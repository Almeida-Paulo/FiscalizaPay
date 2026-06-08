"use client";
import { useQuery } from "@tanstack/react-query";
import { getContractEvents } from "@/shared/api/events-api";
import { queryKeys } from "@/shared/api/query-keys";
import { useProtectedQueryEnabled } from "@/shared/api/use-protected-query-enabled";

export function useContractEvents(contractId: string) {
  const enabled = useProtectedQueryEnabled(!!contractId);

  return useQuery({
    queryKey: queryKeys.contractEvents(contractId),
    queryFn: async () => {
      const { data } = await getContractEvents(contractId);
      return data;
    },
    enabled,
  });
}
