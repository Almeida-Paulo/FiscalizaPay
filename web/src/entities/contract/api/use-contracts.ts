"use client";
import { useQuery } from "@tanstack/react-query";
import { getContracts } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";
import type { ContractStatus } from "@/entities/contract";

export function useContracts(status?: ContractStatus) {
  return useQuery({
    queryKey: queryKeys.contracts,
    queryFn: async () => {
      const { data } = await getContracts();
      return status ? data.filter((c) => c.status === status) : data;
    },
  });
}
