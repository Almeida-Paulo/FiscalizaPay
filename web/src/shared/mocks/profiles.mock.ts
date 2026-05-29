import type { Profile } from "@/entities/profile";

export const mockProfiles: Profile[] = [
  {
    id: "profile-gestor-1",
    name: "Maria Santos",
    role: "GESTOR",
    walletAddress: "0xDeadBeef1234567890abcdef1234567890DeaD01",
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "profile-fornecedor-1",
    name: "Carlos Rodrigues",
    role: "FORNECEDOR",
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C9C3500000002",
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-04-20T14:00:00.000Z",
  },
  {
    id: "profile-entregador-1",
    name: "Ricardo Alves",
    role: "ENTREGADOR",
    walletAddress: "0xLogistica1234567890abcdef1234567890000003",
    createdAt: "2026-02-01T07:30:00.000Z",
    updatedAt: "2026-03-15T11:00:00.000Z",
  },
  {
    id: "profile-fiscal-1",
    name: "João Silva",
    role: "FISCAL",
    walletAddress: "0x1234abcd5678ef901234abcd5678ef9012340004",
    createdAt: "2026-01-20T08:45:00.000Z",
    updatedAt: "2026-05-10T09:30:00.000Z",
  },
  {
    id: "profile-auditor-1",
    name: "Ana Ferreira",
    role: "AUDITOR",
    walletAddress: "0xAuditor1234567890abcdef1234567890AudiT05",
    createdAt: "2026-02-10T10:00:00.000Z",
    updatedAt: "2026-04-30T16:00:00.000Z",
  },
];

export const mockProfileByRole = {
  GESTOR: mockProfiles[0],
  FORNECEDOR: mockProfiles[1],
  ENTREGADOR: mockProfiles[2],
  FISCAL: mockProfiles[3],
  AUDITOR: mockProfiles[4],
} as const;
