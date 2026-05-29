"use client";
import { useQuery } from "@tanstack/react-query";
import { getContractById } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";

export function useContractById(contractId: string) {
  return useQuery({
    queryKey: queryKeys.contract(contractId),
    queryFn: async () => {
      const { data } = await getContractById(contractId);
      return data;
    },
    enabled: !!contractId,
  });
}
