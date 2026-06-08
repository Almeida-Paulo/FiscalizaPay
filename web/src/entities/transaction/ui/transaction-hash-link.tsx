import { ExternalLink } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CopyButton } from "@/shared/ui/copy-button";
import { shortenHash } from "@/shared/lib/formatters";
import { env } from "@/shared/config/env";
import { buildExplorerTxUrl, isEvmTransactionHash } from "../model/helpers";

interface TransactionHashLinkProps {
  hash: string;
  className?: string;
}

export function TransactionHashLink({ hash, className }: TransactionHashLinkProps) {
  const canOpenExplorer = isEvmTransactionHash(hash);

  return (
    <span className={cn("flex items-center gap-1 font-mono text-xs", className)}>
      {canOpenExplorer ? (
        <a
          href={buildExplorerTxUrl(env.explorerUrl, hash)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
        >
          <span>{shortenHash(hash, 6)}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      ) : (
        <span className="text-muted-foreground">{shortenHash(hash, 6)}</span>
      )}
      <CopyButton value={hash} />
    </span>
  );
}
