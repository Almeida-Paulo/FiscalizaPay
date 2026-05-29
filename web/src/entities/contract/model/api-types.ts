export interface CreateContractPayload {
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
  documentHash?: string;
}

export type UpdateContractPayload = Partial<CreateContractPayload>;

export interface ContractActionPayload {
  notes?: string;
  documentHash?: string;
}

export interface OpenDisputePayload {
  reason: string;
  disputeType?: string;
}

export interface SimulateFraudPayload {
  newDocumentHash: string;
  reason?: string;
}
