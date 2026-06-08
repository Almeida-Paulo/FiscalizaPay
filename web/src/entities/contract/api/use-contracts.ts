"use client";
import { useQuery } from "@tanstack/react-query";
import { getContracts } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";
import { useProtectedQueryEnabled } from "@/shared/api/use-protected-query-enabled";
import type { ContractStatus } from "@/entities/contract";

export function useContracts(status?: ContractStatus) {
  const enabled = useProtectedQueryEnabled();

  return useQuery({
    queryKey: queryKeys.contracts,
    queryFn: async () => {
      const { data } = await getContracts();
      return status ? data.filter((c) => c.status === status) : data;
    },
    enabled,
  });
}
