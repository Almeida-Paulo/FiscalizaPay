"use client";
import { useQuery } from "@tanstack/react-query";
import { getBlockchainStatus } from "@/shared/api/blockchain-api";
import { queryKeys } from "@/shared/api/query-keys";
import { useProtectedQueryEnabled } from "@/shared/api/use-protected-query-enabled";

export function useBlockchainStatus(contractId: string) {
  const enabled = useProtectedQueryEnabled(!!contractId);

  return useQuery({
    queryKey: queryKeys.blockchainStatus(contractId),
    queryFn: async () => {
      const { data } = await getBlockchainStatus(contractId);
      return data;
    },
    enabled,
  });
}
