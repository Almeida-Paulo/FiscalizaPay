import { ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CONTRACT_STATUS_MAP } from "@/entities/contract/model/constants";
import type { ContractStatus } from "@/entities/contract/model/types";

const VARIANT_COLOR: Record<string, string> = {
  neutral: "text-muted-foreground",
  info: "text-blue-400",
  warning: "text-warning",
  success: "text-success",
  danger: "text-danger",
};

interface StatusTransitionProps {
  from: ContractStatus;
  to: ContractStatus;
  className?: string;
}

export function StatusTransition({ from, to, className }: StatusTransitionProps) {
  const fromMeta = CONTRACT_STATUS_MAP[from];
  const toMeta = CONTRACT_STATUS_MAP[to];
  return (
    <span className={cn("flex items-center gap-1.5 text-xs", className)}>
      <span className={VARIANT_COLOR[fromMeta.variant]}>{fromMeta.label}</span>
      <ArrowRight className="h-3 w-3 shrink-0 text-muted-foreground" />
      <span className={VARIANT_COLOR[toMeta.variant]}>{toMeta.label}</span>
    </span>
  );
}
