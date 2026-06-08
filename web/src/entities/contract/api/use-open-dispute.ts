"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { openDispute } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import type { OpenDisputePayload } from "@/entities/contract";

type Variables = { contractId: string; payload: OpenDisputePayload };

export function useOpenDispute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, payload }: Variables) => openDispute(contractId, payload),
    onSuccess: (_response, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractEvents(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditEvents });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
      toast.success("Disputa aberta com sucesso.");
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
