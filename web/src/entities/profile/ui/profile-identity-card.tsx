"use client";

import { AlertCircle, Loader2, Wallet } from "lucide-react";
import { useCurrentProfile } from "@/entities/profile/model/use-current-profile";
import { ROLE_DESCRIPTIONS } from "@/entities/profile/model/constants";
import type { Profile } from "@/entities/profile/model/types";
import { refreshAuthenticatedProfile } from "@/entities/auth/model/session";
import { shortenAddress } from "@/shared/lib/formatters";
import { RoleBadge } from "./role-badge";
import { ProfileSwitcher } from "./profile-switcher";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";

export function ProfileIdentityCard() {
  const { profile, isMockMode, isAuthenticated, isLoading, error } = useCurrentProfile();

  if (isMockMode) {
    return profile ? <DemoProfileIdentity profile={profile} /> : null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
        Carregando perfil...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-sm text-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={() => void refreshAuthenticatedProfile().catch(() => undefined)}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!isAuthenticated || !profile) {
    return (
      <div className="flex flex-col items-center gap-2 py-3 text-center">
        <Wallet className="h-7 w-7 text-muted-foreground/40" />
        <p className="text-sm font-medium text-foreground">
          Conecte sua wallet para continuar
        </p>
        <p className="text-xs text-muted-foreground">
          Faça login com sua wallet para carregar seu perfil real.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Avatar + name + role */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {profile.name}
          </p>
          <RoleBadge role={profile.role} className="mt-1" />
        </div>
      </div>

      {/* Role description */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {ROLE_DESCRIPTIONS[profile.role]}
      </p>

      {profile.walletAddress && (
        <>
          <Separator />
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
              Wallet autenticada
            </p>
            <p className="truncate font-mono text-xs text-foreground">
              {shortenAddress(profile.walletAddress, 6)}
            </p>
          </div>
        </>
      )}

      <p className="text-[10px] italic text-muted-foreground/60">
        Perfil autenticado via /auth/me — não pode ser trocado pela UI.
      </p>
    </div>
  );
}

/** Identidade exibida em mock mode — usa o perfil demo selecionado no ProfileSwitcher */
function DemoProfileIdentity({ profile }: { profile: Profile }) {
  const initial = profile.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-3">
      {/* Avatar + name + role */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {profile.name}
          </p>
          <RoleBadge role={profile.role} className="mt-1" />
        </div>
      </div>

      {/* Role description */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {ROLE_DESCRIPTIONS[profile.role]}
      </p>

      <Separator />

      {/* Profile switcher */}
      <div>
        <p className="mb-2 text-[10px] uppercase tracking-wide text-muted-foreground">
          Trocar perfil de demo
        </p>
        <ProfileSwitcher compact />
      </div>

      <p className="text-[10px] italic text-muted-foreground/60">
        Perfil simulado — não é autenticação real.
      </p>
    </div>
  );
}
