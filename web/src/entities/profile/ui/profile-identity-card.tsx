"use client";

import { useProfileStore } from "@/entities/profile/model/store";
import { ROLE_DESCRIPTIONS } from "@/entities/profile/model/constants";
import { RoleBadge } from "./role-badge";
import { ProfileSwitcher } from "./profile-switcher";
import { Separator } from "@/shared/ui/separator";

export function ProfileIdentityCard() {
  const { currentProfile } = useProfileStore();

  const initial = currentProfile.name.charAt(0).toUpperCase();

  return (
    <div className="space-y-3">
      {/* Avatar + name + role */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initial}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {currentProfile.name}
          </p>
          <RoleBadge role={currentProfile.role} className="mt-1" />
        </div>
      </div>

      {/* Role description */}
      <p className="text-xs leading-relaxed text-muted-foreground">
        {ROLE_DESCRIPTIONS[currentProfile.role]}
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
