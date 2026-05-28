import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { ROLE_LABELS } from "@/entities/profile/model/constants";
import type { UserRole } from "@/entities/profile/model/types";

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-primary/30 bg-primary/5 font-mono text-xs text-primary",
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </Badge>
  );
}
