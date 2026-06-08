"use client";

import { useProfileStore } from "@/entities/profile/model/store";
import { ROLE_LABELS } from "@/entities/profile/model/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { RoleBadge } from "./role-badge";
import { cn } from "@/shared/lib/utils";
import { env } from "@/shared/config/env";

interface ProfileSwitcherProps {
  className?: string;
  /** Se true, exibe apenas o select sem o nome completo */
  compact?: boolean;
}

/**
 * Seletor de perfil para demo do frontend.
 * Permite simular diferentes perfis de usuário durante desenvolvimento.
 * NÃO é autenticação real — apenas para demonstração visual.
 *
 * Disponível apenas em mock mode (NEXT_PUBLIC_USE_MOCKS=true). Em modo API
 * real a role vem do backend/JWT e não pode ser simulada pela UI, então o
 * switcher não é renderizado.
 */
export function ProfileSwitcher({ className, compact = false }: ProfileSwitcherProps) {
  const { currentProfile, demoProfiles, setCurrentProfile } = useProfileStore();

  if (!env.useMocks) {
    return null;
  }

  function handleChange(role: string) {
    const profile = demoProfiles.find((p) => p.role === role);
    if (profile) setCurrentProfile(profile);
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs text-muted-foreground">Perfil demo:</span>
      <Select value={currentProfile.role} onValueChange={handleChange}>
        <SelectTrigger className="h-7 w-[140px] border-border text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {demoProfiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.role} className="text-xs">
              {ROLE_LABELS[profile.role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {!compact && (
        <RoleBadge role={currentProfile.role} />
      )}
    </div>
  );
}
