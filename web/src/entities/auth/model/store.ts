import { create } from "zustand";

import type { UserRole } from "@/entities/profile";
import type {
  AuthProfile,
  AuthSession as ApiAuthSession,
} from "@/shared/api/auth-api";

export const AUTH_SESSION_STORAGE_KEY = "fiscalizapay.auth.session";

export type AuthSession = ApiAuthSession;

export type PersistedAuthSession = {
  accessToken: string;
  expiresAt: string;
  profile: AuthProfile;
  walletAddress: string;
  role: UserRole;
  isAuthenticated: true;
};

export type AuthState = {
  accessToken: string | null;
  expiresAt: string | null;
  profile: AuthProfile | null;
  walletAddress: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};

export type AuthActions = {
  login: (session: AuthSession) => void;
  logout: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  hydrate: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export type AuthStore = AuthState & AuthActions;

const VALID_ROLES: UserRole[] = [
  "GESTOR",
  "FORNECEDOR",
  "ENTREGADOR",
  "FISCAL",
  "AUDITOR",
];

const emptyAuthState: AuthState = {
  accessToken: null,
  expiresAt: null,
  profile: null,
  walletAddress: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && VALID_ROLES.includes(value as UserRole);
}

function isAuthProfile(value: unknown): value is AuthProfile {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    isUserRole(value.role) &&
    typeof value.walletAddress === "string" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isSessionExpired(expiresAt: string): boolean {
  const expiresAtMs = Date.parse(expiresAt);

  if (Number.isNaN(expiresAtMs)) {
    return true;
  }

  return expiresAtMs <= Date.now();
}

function toPersistedSession(session: AuthSession): PersistedAuthSession | null {
  const accessToken = session.accessToken?.trim();
  const expiresAt = session.expiresAt?.trim();
  const profile = session.profile;
  const walletAddress = session.walletAddress || profile?.walletAddress;
  const role = session.role || profile?.role;

  if (
    !accessToken ||
    !expiresAt ||
    !profile ||
    !isAuthProfile(profile) ||
    !walletAddress ||
    !isUserRole(role)
  ) {
    return null;
  }

  return {
    accessToken,
    expiresAt,
    profile,
    walletAddress,
    role,
    isAuthenticated: true,
  };
}

function parseStoredSession(value: unknown): PersistedAuthSession | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.accessToken !== "string" ||
    typeof value.expiresAt !== "string" ||
    !isAuthProfile(value.profile) ||
    typeof value.walletAddress !== "string" ||
    !isUserRole(value.role) ||
    value.isAuthenticated !== true
  ) {
    return null;
  }

  return {
    accessToken: value.accessToken,
    expiresAt: value.expiresAt,
    profile: value.profile,
    walletAddress: value.walletAddress,
    role: value.role,
    isAuthenticated: true,
  };
}

function readStoredSession(): PersistedAuthSession | null {
  if (!isBrowser()) {
    return null;
  }

  const rawSession = window.sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return parseStoredSession(JSON.parse(rawSession));
  } catch {
    return null;
  }
}

function writeStoredSession(session: PersistedAuthSession): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );
}

function clearStoredSession(): void {
  if (!isBrowser()) {
    return;
  }

  window.sessionStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...emptyAuthState,
  login: (session) => {
    get().setSession(session);
  },
  logout: () => {
    get().clearSession();
  },
  setSession: (session) => {
    const persistedSession = toPersistedSession(session);

    if (!persistedSession) {
      clearStoredSession();
      set({
        ...emptyAuthState,
        error: "Sessao de autenticacao invalida.",
      });
      return;
    }

    if (isSessionExpired(persistedSession.expiresAt)) {
      clearStoredSession();
      set({
        ...emptyAuthState,
        error: "Sessao expirada. Faca login novamente.",
      });
      return;
    }

    writeStoredSession(persistedSession);
    set({
      ...persistedSession,
      isLoading: false,
      error: null,
    });
  },
  clearSession: () => {
    clearStoredSession();
    set(emptyAuthState);
  },
  hydrate: () => {
    set({ isLoading: true, error: null });

    const persistedSession = readStoredSession();

    if (!persistedSession) {
      clearStoredSession();
      set({
        ...emptyAuthState,
        isLoading: false,
      });
      return;
    }

    if (isSessionExpired(persistedSession.expiresAt)) {
      clearStoredSession();
      set({
        ...emptyAuthState,
        isLoading: false,
        error: "Sessao expirada. Faca login novamente.",
      });
      return;
    }

    set({
      ...persistedSession,
      isLoading: false,
      error: null,
    });
  },
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
