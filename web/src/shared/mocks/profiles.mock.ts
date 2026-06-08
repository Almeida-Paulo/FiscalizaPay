import type { Profile } from "@/entities/profile";

export const mockProfiles: Profile[] = [
  {
    id: "profile-gestor-1",
    name: "Maria Santos",
    role: "GESTOR",
    walletAddress: "0x1111111111111111111111111111111111111111",
    createdAt: "2026-01-10T08:00:00.000Z",
    updatedAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "profile-fornecedor-1",
    name: "Carlos Rodrigues",
    role: "FORNECEDOR",
    walletAddress: "0x2222222222222222222222222222222222222222",
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-04-20T14:00:00.000Z",
  },
  {
    id: "profile-entregador-1",
    name: "Ricardo Alves",
    role: "ENTREGADOR",
    walletAddress: "0x3333333333333333333333333333333333333333",
    createdAt: "2026-02-01T07:30:00.000Z",
    updatedAt: "2026-03-15T11:00:00.000Z",
  },
  {
    id: "profile-fiscal-1",
    name: "João Silva",
    role: "FISCAL",
    walletAddress: "0x4444444444444444444444444444444444444444",
    createdAt: "2026-01-20T08:45:00.000Z",
    updatedAt: "2026-05-10T09:30:00.000Z",
  },
  {
    id: "profile-auditor-1",
    name: "Ana Ferreira",
    role: "AUDITOR",
    walletAddress: "0x5555555555555555555555555555555555555555",
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
