"use client";

import { useAuthStore } from "@/entities/auth/model/store";
import { env } from "@/shared/config/env";
import { useProfileStore } from "./store";
import type { Profile, UserRole } from "./types";

export type ResolvedProfile = {
  /** Perfil ativo — demo em mock mode, real (vindo de /auth/me) em modo API */
  profile: Profile | null;
  role: UserRole | null;
  walletAddress: string | null;
  /** true quando NEXT_PUBLIC_USE_MOCKS=true */
  isMockMode: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

/**
 * Fonte única do perfil "atual" da aplicação.
 *
 * Em mock mode, resolve para o perfil demo selecionado no useProfileStore.
 * Em modo API real, resolve exclusivamente para o perfil autenticado vindo
 * da auth store (carregado via /auth/me no Bloco 06) — nunca cai para o
 * perfil demo, mesmo que não exista sessão autenticada.
 */
export function useCurrentProfile(): ResolvedProfile {
  const demoProfile = useProfileStore((state) => state.currentProfile);

  const authProfile = useAuthStore((state) => state.profile);
  const authRole = useAuthStore((state) => state.role);
  const authWalletAddress = useAuthStore((state) => state.walletAddress);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  if (env.useMocks) {
    return {
      profile: demoProfile,
      role: demoProfile.role,
      walletAddress: demoProfile.walletAddress ?? null,
      isMockMode: true,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    };
  }

  return {
    profile: authProfile,
    role: authRole,
    walletAddress: authWalletAddress,
    isMockMode: false,
    isAuthenticated,
    isLoading,
    error,
  };
}
