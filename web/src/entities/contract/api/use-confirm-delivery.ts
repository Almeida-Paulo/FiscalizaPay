"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmDelivery } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import type { ContractActionPayload } from "@/entities/contract";

type Variables = { contractId: string; payload?: ContractActionPayload };

export function useConfirmDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, payload }: Variables) => confirmDelivery(contractId, payload),
    onSuccess: (_response, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractEvents(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditEvents });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
      toast.success("Entrega confirmada com sucesso.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
