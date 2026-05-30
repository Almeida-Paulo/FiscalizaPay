import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { getNetworkLabel } from "../model/helpers";

interface NetworkBadgeProps {
  chainId: number | null;
  isConnected?: boolean;
  isCorrectNetwork?: boolean;
  className?: string;
}

export function NetworkBadge({
  chainId,
  isConnected,
  isCorrectNetwork,
  className,
}: NetworkBadgeProps) {
  if (!isConnected) {
    return (
      <Badge
        variant="outline"
        className={cn("border-border text-muted-foreground text-[10px]", className)}
      >
        Não conectada
      </Badge>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Badge
        variant="outline"
        className={cn(
          "border-warning/40 bg-warning/10 text-warning text-[10px]",
          className,
        )}
      >
        Rede incorreta
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-success/40 bg-success/10 text-success text-[10px]",
        className,
      )}
    >
      {getNetworkLabel(chainId)}
    </Badge>
  );
}
