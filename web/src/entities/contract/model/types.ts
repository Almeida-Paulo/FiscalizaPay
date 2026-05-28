/** Status oficiais do contrato — valores em português conforme domínio */
export type ContractStatus =
  | "CRIADO"
  | "ENVIADO"
  | "ENTREGUE"
  | "VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA";

/** Contrato público — shape completa retornada pela API */
export interface Contract {
  id: string;
  contractNumber: string;
  publicAgency: string;
  supplierName: string;
  supplierWallet?: string;
  object: string;
  amount: number;
  startDate?: string;
  endDate?: string;
  deadline: string;
  inspectorName: string;
  inspectorWallet?: string;
  logisticsResponsible: string;
  logisticsWallet?: string;
  managerName?: string;
  managerWallet?: string;
  status: ContractStatus;
  documentHash?: string;
  blockchainContractId?: string;
  createdAt: string;
  updatedAt: string;
}

/** Métricas do dashboard — retornado por GET /dashboard/summary */
export interface DashboardSummary {
  total: number;
  criado: number;
  enviado: number;
  entregue: number;
  validado: number;
  pagamentoAutorizado: number;
  disputa: number;
}

/** Status on-chain do contrato — retornado por GET /contracts/:id/blockchain-status */
export interface BlockchainStatus {
  contractId: string;
  status: ContractStatus;
  documentHash?: string;
  transactionHash?: string;
  blockNumber?: number;
  blockchainTimestamp?: string;
  registeredOnChain: boolean;
}
