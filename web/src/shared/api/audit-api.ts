import { env } from "@/shared/config/env";
import type { Contract } from "@/entities/contract";
import type { ContractEvent } from "@/entities/contract-event";
import type { ApiResponse } from "@/shared/types/api";
import { mockStore } from "@/shared/mocks/mock-store";
import { httpClient } from "./http-client";

export type AuditEventItem = ContractEvent & {
  contractNumber: string;
  contractObject: string;
  contractStatus: Contract["status"];
};

export async function getAuditEvents(): Promise<ApiResponse<AuditEventItem[]>> {
  if (env.useMocks) {
    const contracts = mockStore.getContracts();
    const contractMap = new Map(contracts.map((contract) => [contract.id, contract]));
    const events = mockStore.getAllEvents();
    const enriched: AuditEventItem[] = events
      .map((event) => {
        const contract = contractMap.get(event.contractId);

        return {
          ...event,
          contractNumber: contract?.contractNumber ?? event.contractId,
          contractObject: contract?.object ?? "",
          contractStatus: contract?.status ?? ("CRIADO" as Contract["status"]),
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { data: enriched };
  }

  return httpClient.get<AuditEventItem[]>("/audit/events");
}
