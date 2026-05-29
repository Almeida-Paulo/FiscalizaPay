import type { BlockchainStatus } from "@/entities/contract";
import { env } from "@/shared/config/env";

const explorerUrl = env.explorerUrl;

export const mockBlockchainStatuses: BlockchainStatus[] = [
  {
    contractId: "mock-contract-1",
    status: "CRIADO",
    registeredOnChain: false,
  },
  {
    contractId: "mock-contract-2",
    status: "ENVIADO",
    documentHash: "b2c3d4e5f67890123456789012345678901bcdef2233445566778899",
    transactionHash: "0xa1b2c3d4e5f6789012345678901234567890abcdef11223344556677ff02",
    blockNumber: 12341100,
    blockchainTimestamp: "2026-05-05T14:20:00.000Z",
    registeredOnChain: true,
  },
  {
    contractId: "mock-contract-3",
    status: "ENTREGUE",
    documentHash: "c3d4e5f678901234567890123456789012cdef3344556677889900",
    transactionHash: "0xc3d4e5f678901234567890123456789012cdef22334455667788990003bb",
    blockNumber: 12342500,
    blockchainTimestamp: "2026-05-12T16:45:00.000Z",
    registeredOnChain: true,
  },
  {
    contractId: "mock-contract-4",
    status: "VALIDADO",
    documentHash: "d4e5f6789012345678901234567890123def4455667788990011",
    transactionHash: "0xf67890123456789012345678901234567f556677889900112233ee0004",
    blockNumber: 12345678,
    blockchainTimestamp: "2026-05-20T10:15:00.000Z",
    registeredOnChain: true,
  },
  {
    contractId: "mock-contract-5",
    status: "PAGAMENTO_AUTORIZADO",
    documentHash: "e5f678901234567890123456789012345ef556677889900112233",
    transactionHash: "0x5566778899001122334455667788990011aabbcceeff00dd330005ee",
    blockNumber: 12347890,
    blockchainTimestamp: "2026-05-25T09:00:00.000Z",
    registeredOnChain: true,
  },
  {
    contractId: "mock-contract-6",
    status: "DISPUTA",
    documentHash: "f6789012345678901234567890123456f0667788990011223344",
    transactionHash: "0x6677889900112233445566778899001122aabbccdeff0011440006aa",
    blockNumber: 12348200,
    blockchainTimestamp: "2026-04-01T07:00:00.000Z",
    registeredOnChain: true,
  },
];

export const getMockBlockchainStatus = (contractId: string): BlockchainStatus =>
  mockBlockchainStatuses.find((s) => s.contractId === contractId) ?? {
    contractId,
    status: "CRIADO",
    registeredOnChain: false,
  };

export const buildExplorerTxUrl = (txHash: string): string =>
  `${explorerUrl}/tx/${txHash}`;
