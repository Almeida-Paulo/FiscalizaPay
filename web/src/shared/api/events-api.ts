import { env } from "@/shared/config/env";
import type { ApiResponse } from "@/shared/types/api";
import type { ContractEvent } from "@/entities/contract-event";
import { mockStore } from "@/shared/mocks/mock-store";
import { httpClient } from "./http-client";

export async function getContractEvents(
  contractId: string,
): Promise<ApiResponse<ContractEvent[]>> {
  if (env.useMocks) {
    const events = mockStore.getEventsByContractId(contractId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    return { data: events };
  }

  return httpClient.get<ContractEvent[]>(`/contracts/${contractId}/events`);
}
