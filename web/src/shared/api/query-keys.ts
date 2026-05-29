export const queryKeys = {
  dashboardSummary: ["dashboard-summary"] as const,
  contracts: ["contracts"] as const,
  contract: (contractId: string) => ["contract", contractId] as const,
  contractEvents: (contractId: string) => ["contract-events", contractId] as const,
  blockchainStatus: (contractId: string) => ["blockchain-status", contractId] as const,
} as const;
