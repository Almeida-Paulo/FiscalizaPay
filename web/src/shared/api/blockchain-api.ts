import { env } from "@/shared/config/env";
import { httpClient } from "./http-client";
import type { ApiResponse } from "@/shared/types/api";
import type { BlockchainStatus } from "@/entities/contract";
import type { ContractEvent } from "@/entities/contract-event";
import { mockStore } from "@/shared/mocks/mock-store";
import { MockErrors } from "@/shared/mocks/mock-errors";

type RegisterOnChainResult = {
  contractId: string;
  transactionHash: string;
  blockNumber: number;
  blockchainTimestamp: string;
  registeredOnChain: true;
  event: Pick<ContractEvent, "id" | "eventType" | "transactionHash" | "createdAt">;
};

// Leitura/escrita blockchain mantem o mesmo contrato em mock e API real.
export async function getBlockchainStatus(
  contractId: string,
): Promise<ApiResponse<BlockchainStatus>> {
  if (env.useMocks) {
    const status = mockStore.getBlockchainStatus(contractId);
    if (!status) MockErrors.notFound("Status blockchain");
    return { data: status! };
  }
  return httpClient.get<BlockchainStatus>(`/contracts/${contractId}/blockchain-status`);
}

export async function registerOnChain(
  contractId: string,
): Promise<ApiResponse<RegisterOnChainResult>> {
  if (env.useMocks) {
    // Simulacao local: gera tx visual, atualiza status e cria evento auditavel.
    const now = new Date().toISOString();
    const txHash = `0xmock_onchain_${Date.now().toString(16)}`;
    const blockNumber = 12350000 + Math.floor(Math.random() * 1000);
    const eventId = `evt-onchain-${Date.now()}`;

    mockStore.upsertBlockchainStatus(contractId, {
      transactionHash: txHash,
      blockNumber,
      blockchainTimestamp: now,
      registeredOnChain: true,
    });
    mockStore.addEvent({
      id: eventId,
      contractId,
      eventType: "HASH_REGISTRADO",
      description: "Hash do contrato registrado na blockchain.",
      responsibleRole: "GESTOR",
      transactionHash: txHash,
      blockchainTimestamp: now,
      createdAt: now,
    });

    return {
      data: {
        contractId,
        transactionHash: txHash,
        blockNumber,
        blockchainTimestamp: now,
        registeredOnChain: true,
        event: {
          id: eventId,
          eventType: "HASH_REGISTRADO",
          transactionHash: txHash,
          createdAt: now,
        },
      },
      message: "Contrato registrado na blockchain com sucesso.",
    };
  }
  return httpClient.post<RegisterOnChainResult>(`/contracts/${contractId}/register-on-chain`);
}
