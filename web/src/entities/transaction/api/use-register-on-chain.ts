"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerOnChain } from "@/shared/api/blockchain-api";
import { queryKeys } from "@/shared/api/query-keys";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";

export function useRegisterOnChain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contractId: string) => registerOnChain(contractId),
    onSuccess: (response, contractId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blockchainStatus(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractEvents(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditEvents });
      toast.success(response.message ?? "Contrato registrado na blockchain com sucesso.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
