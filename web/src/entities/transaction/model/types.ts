/**
 * Status de transação blockchain.
 * Usa inglês pois é status técnico de infraestrutura, não de domínio de contrato.
 */
export type TransactionStatus = "PENDING" | "CONFIRMED" | "FAILED";

/** Transação blockchain registrada */
export interface BlockchainTransaction {
  hash: string;
  status?: TransactionStatus;
  explorerUrl?: string;
  createdAt?: string;
  confirmedAt?: string;
}
