import { create } from "zustand";
import type { Profile, UserRole } from "./types";

/**
 * Perfis simulados para demo do frontend.
 * NÃO é autenticação real. Serve apenas para demonstrar o fluxo
 * visual de permissões durante desenvolvimento e apresentação.
 * No MVP real, o perfil virá do backend após autenticação.
 */
export const DEMO_PROFILES: Profile[] = [
  {
    id: "demo-gestor",
    name: "Maria Santos",
    role: "GESTOR",
    walletAddress: "0xdeadbeef12345678901234567890abcdef123456",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-fornecedor",
    name: "Carlos Silva (ABC Ltda)",
    role: "FORNECEDOR",
    walletAddress: "0x742d35Cc6634C0532925a3b8D4C9C351234abcd",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-entregador",
    name: "João Logística (XYZ Transp.)",
    role: "ENTREGADOR",
    walletAddress: "0xlogistica000000000000000000000000001234",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-fiscal",
    name: "Ana Fischer",
    role: "FISCAL",
    walletAddress: "0x1234abcdef000000000000000000000000005678",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "demo-auditor",
    name: "Roberto Auditor",
    role: "AUDITOR",
    walletAddress: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ProfileState {
  /** Perfil ativo na sessão de demo */
  currentProfile: Profile;
  /** Todos os perfis de demo disponíveis */
  demoProfiles: Profile[];
  /** Troca o perfil ativo */
  setCurrentProfile: (profile: Profile) => void;
  /** Troca o perfil pelo role (busca no array de demo) */
  setCurrentRole: (role: UserRole) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  currentProfile: DEMO_PROFILES[0],
  demoProfiles: DEMO_PROFILES,
  setCurrentProfile: (profile) => set({ currentProfile: profile }),
  setCurrentRole: (role) =>
    set((state) => ({
      currentProfile:
        state.demoProfiles.find((p) => p.role === role) ??
        state.currentProfile,
    })),
}));
