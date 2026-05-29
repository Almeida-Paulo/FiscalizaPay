"use client";
import { useQuery } from "@tanstack/react-query";
import { getBlockchainStatus } from "@/shared/api/blockchain-api";
import { queryKeys } from "@/shared/api/query-keys";

export function useBlockchainStatus(contractId: string) {
  return useQuery({
    queryKey: queryKeys.blockchainStatus(contractId),
    queryFn: async () => {
      const { data } = await getBlockchainStatus(contractId);
      return data;
    },
    enabled: !!contractId,
  });
}
