"use client";
import { useQuery } from "@tanstack/react-query";
import { getContractEvents } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";

export function useContractEvents(contractId: string) {
  return useQuery({
    queryKey: queryKeys.contractEvents(contractId),
    queryFn: async () => {
      const { data } = await getContractEvents(contractId);
      return data;
    },
    enabled: !!contractId,
  });
}
