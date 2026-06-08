"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { validateReceipt } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import type { ContractActionPayload } from "@/entities/contract";

type Variables = { contractId: string; payload?: ContractActionPayload };

export function useValidateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, payload }: Variables) => validateReceipt(contractId, payload),
    onSuccess: (_response, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractEvents(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditEvents });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
      toast.success("Recebimento validado com sucesso.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
