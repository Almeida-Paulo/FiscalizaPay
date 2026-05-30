import type { Contract, BlockchainStatus, DashboardSummary } from "@/entities/contract";
import type { ContractEvent } from "@/entities/contract-event";
import { mockContracts } from "./contracts.mock";
import { mockContractEvents } from "./contract-events.mock";
import { mockBlockchainStatuses } from "./blockchain.mock";

// Module-level mutable state — resets on page reload (intentional for demo)
let _contracts: Contract[] = mockContracts.map((c) => ({ ...c }));
let _events: ContractEvent[] = mockContractEvents.map((e) => ({ ...e }));
let _blockchainStatuses: BlockchainStatus[] = mockBlockchainStatuses.map((s) => ({ ...s }));

export const mockStore = {
  // ── Reads ──────────────────────────────────────────────────────────────────

  getContracts: (): Contract[] => [..._contracts],

  getContractById: (id: string): Contract | undefined =>
    _contracts.find((c) => c.id === id),

  getEventsByContractId: (contractId: string): ContractEvent[] =>
    _events.filter((e) => e.contractId === contractId),

  getAllEvents: (): ContractEvent[] => [..._events],

  getBlockchainStatus: (contractId: string): BlockchainStatus | undefined =>
    _blockchainStatuses.find((s) => s.contractId === contractId),

  getDashboardSummary: (): DashboardSummary => ({
    total: _contracts.length,
    criado: _contracts.filter((c) => c.status === "CRIADO").length,
    enviado: _contracts.filter((c) => c.status === "ENVIADO").length,
    entregue: _contracts.filter((c) => c.status === "ENTREGUE").length,
    validado: _contracts.filter((c) => c.status === "VALIDADO").length,
    pagamentoAutorizado: _contracts.filter((c) => c.status === "PAGAMENTO_AUTORIZADO").length,
    disputa: _contracts.filter((c) => c.status === "DISPUTA").length,
  }),

  // ── Writes ─────────────────────────────────────────────────────────────────

  addContract: (contract: Contract): Contract => {
    _contracts = [..._contracts, contract];
    return contract;
  },

  updateContract: (id: string, updates: Partial<Contract>): Contract => {
    _contracts = _contracts.map((c) =>
      c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c,
    );
    return _contracts.find((c) => c.id === id)!;
  },

  removeContract: (id: string): void => {
    _contracts = _contracts.filter((c) => c.id !== id);
  },

  addEvent: (event: ContractEvent): ContractEvent => {
    _events = [..._events, event];
    return event;
  },

  upsertBlockchainStatus: (contractId: string, updates: Partial<BlockchainStatus>): void => {
    const exists = _blockchainStatuses.some((s) => s.contractId === contractId);
    if (exists) {
      _blockchainStatuses = _blockchainStatuses.map((s) =>
        s.contractId === contractId ? { ...s, ...updates } : s,
      );
    } else {
      _blockchainStatuses = [
        ..._blockchainStatuses,
        { contractId, status: "CRIADO", registeredOnChain: false, ...updates } as BlockchainStatus,
      ];
    }
  },

  reset: (): void => {
    _contracts = mockContracts.map((c) => ({ ...c }));
    _events = mockContractEvents.map((e) => ({ ...e }));
    _blockchainStatuses = mockBlockchainStatuses.map((s) => ({ ...s }));
  },
};
