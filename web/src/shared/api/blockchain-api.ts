import { env } from "@/shared/config/env";
import { httpClient } from "./http-client";
import type { ApiResponse } from "@/shared/types/api";
import type { BlockchainStatus } from "@/entities/contract";
import type { ContractEvent } from "@/entities/contract-event";
import { getMockBlockchainStatus } from "@/shared/mocks";

type RegisterOnChainResult = {
  contractId: string;
  transactionHash: string;
  blockNumber: number;
  blockchainTimestamp: string;
  registeredOnChain: true;
  event: Pick<ContractEvent, "id" | "eventType" | "transactionHash" | "createdAt">;
};

export async function getBlockchainStatus(
  contractId: string,
): Promise<ApiResponse<BlockchainStatus>> {
  if (env.enableMocks) {
    return { data: getMockBlockchainStatus(contractId) };
  }
  return httpClient.get<BlockchainStatus>(
    `/contracts/${contractId}/blockchain-status`,
  );
}

export async function registerOnChain(
  contractId: string,
): Promise<ApiResponse<RegisterOnChainResult>> {
  if (env.enableMocks) {
    const now = new Date().toISOString();
    const txHash = `0xmock_onchain_${Date.now().toString(16)}`;
    return {
      data: {
        contractId,
        transactionHash: txHash,
        blockNumber: 12350000 + Math.floor(Math.random() * 1000),
        blockchainTimestamp: now,
        registeredOnChain: true,
        event: {
          id: `evt-onchain-${Date.now()}`,
          eventType: "HASH_REGISTRADO",
          transactionHash: txHash,
          createdAt: now,
        },
      },
      message: "Contrato registrado na blockchain com sucesso.",
    };
  }
  return httpClient.post<RegisterOnChainResult>(
    `/contracts/${contractId}/register-on-chain`,
  );
}
