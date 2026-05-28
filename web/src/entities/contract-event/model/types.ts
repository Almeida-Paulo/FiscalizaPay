import type { ContractStatus } from "@/entities/contract";
import type { UserRole } from "@/entities/profile";

/** Event types oficiais — SCREAMING_SNAKE_CASE conforme domínio */
export type ContractEventType =
  | "CONTRATO_CRIADO"
  | "ENVIO_CONFIRMADO"
  | "ENTREGA_CONFIRMADA"
  | "RECEBIMENTO_VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA_ABERTA"
  | "FRAUDE_SIMULADA"
  | "HASH_REGISTRADO";

/** Evento da linha do tempo de um contrato */
export interface ContractEvent {
  id: string;
  contractId: string;
  eventType: ContractEventType;
  description: string;
  responsibleRole: UserRole;
  responsibleName?: string;
  responsibleWallet?: string;
  statusBefore?: ContractStatus;
  statusAfter?: ContractStatus;
  documentHash?: string;
  transactionHash?: string;
  blockchainTimestamp?: string;
  createdAt: string;
}
