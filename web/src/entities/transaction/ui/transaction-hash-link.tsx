import { ExternalLink } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CopyButton } from "@/shared/ui/copy-button";
import { shortenHash } from "@/shared/lib/formatters";
import { env } from "@/shared/config/env";

interface TransactionHashLinkProps {
  hash: string;
  className?: string;
}

export function TransactionHashLink({ hash, className }: TransactionHashLinkProps) {
  return (
    <span className={cn("flex items-center gap-1 font-mono text-xs", className)}>
      <a
        href={`${env.explorerUrl}/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
      >
        <span>{shortenHash(hash, 6)}</span>
        <ExternalLink className="h-3 w-3 shrink-0" />
      </a>
      <CopyButton value={hash} />
    </span>
  );
}
