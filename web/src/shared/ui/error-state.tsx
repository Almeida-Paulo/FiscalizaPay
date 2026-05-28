import { AlertCircle } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Algo deu errado",
  description = "Ocorreu um erro inesperado. Tente novamente.",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
