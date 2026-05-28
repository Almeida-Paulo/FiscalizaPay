import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { CONTRACT_STATUS_MAP, type StatusVariant } from "@/entities/contract/model/constants";
import type { ContractStatus } from "@/entities/contract/model/types";

const VARIANT_CLASSES: Record<StatusVariant, string> = {
  neutral: "border-border bg-muted text-muted-foreground",
  info: "border-primary/40 text-primary",
  warning: "border-warning/40 text-warning",
  success: "border-success/40 text-success",
  danger: "border-danger/40 text-danger",
};

interface ContractStatusBadgeProps {
  status: ContractStatus;
  className?: string;
  showDescription?: boolean;
}

export function ContractStatusBadge({
  status,
  className,
  showDescription = false,
}: ContractStatusBadgeProps) {
  const { label, description, variant } = CONTRACT_STATUS_MAP[status];

  return (
    <span className={cn("inline-flex flex-col gap-0.5", className)}>
      <Badge variant="outline" className={cn(VARIANT_CLASSES[variant])}>
        {label}
      </Badge>
      {showDescription && (
        <span className="text-xs text-muted-foreground">{description}</span>
      )}
    </span>
  );
}
