import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";

interface ActionButtonProps {
  label: string;
  loadingLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost";
  className?: string;
}

export function ActionButton({
  label,
  loadingLabel,
  icon,
  onClick,
  isLoading = false,
  disabled = false,
  disabledReason,
  variant = "default",
  className,
}: ActionButtonProps) {
  return (
    <div className="space-y-1">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant={variant}
        className={cn("w-full gap-2", className)}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {isLoading ? (loadingLabel ?? label) : label}
      </Button>
      {disabled && disabledReason && (
        <p className="text-xs leading-tight text-muted-foreground">{disabledReason}</p>
      )}
    </div>
  );
}
