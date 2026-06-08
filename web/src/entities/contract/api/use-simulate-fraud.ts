"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { simulateFraud } from "@/shared/api/contracts-api";
import { queryKeys } from "@/shared/api/query-keys";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import type { SimulateFraudPayload } from "@/entities/contract";

type Variables = { contractId: string; payload: SimulateFraudPayload };

export function useSimulateFraud() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, payload }: Variables) => simulateFraud(contractId, payload),
    onSuccess: (response, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractEvents(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditEvents });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
      const msg =
        response.message ??
        (response.data.fraudDetected
          ? "Fraude detectada. Disputa aberta automaticamente."
          : "Nenhuma adulteração detectada.");
      toast.success(msg);
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
