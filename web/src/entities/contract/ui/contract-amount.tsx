import { formatCurrencyBRL } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/utils";

interface ContractAmountProps {
  amount: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const SIZE_CLASS = {
  sm: "text-xs",
  md: "text-sm font-medium",
  lg: "text-base font-semibold",
};

export function ContractAmount({ amount, className, size = "md" }: ContractAmountProps) {
  return (
    <span className={cn("tabular-nums text-foreground", SIZE_CLASS[size], className)}>
      {formatCurrencyBRL(amount)}
    </span>
  );
}
