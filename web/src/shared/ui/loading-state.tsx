import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "./skeleton";

interface LoadingStateProps {
  label?: string;
  variant?: "spinner" | "skeleton";
  className?: string;
}

export function LoadingState({
  label,
  variant = "spinner",
  className,
}: LoadingStateProps) {
  if (variant === "skeleton") {
    return (
      <div className={cn("flex flex-col gap-3 py-4", className)}>
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4",
        className,
      )}
    >
      <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
