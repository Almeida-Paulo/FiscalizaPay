import { ExternalLink, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CopyButton } from "@/shared/ui/copy-button";
import { Skeleton } from "@/shared/ui/skeleton";
import { shortenHash, formatDateTimeBR } from "@/shared/lib/formatters";
import { env } from "@/shared/config/env";
import type { BlockchainStatus } from "@/entities/contract/model/types";

interface ContractBlockchainCardProps {
  blockchainStatus?: BlockchainStatus;
  isLoading: boolean;
}

export function ContractBlockchainCard({
  blockchainStatus,
  isLoading,
}: ContractBlockchainCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status blockchain</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : !blockchainStatus ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <XCircle className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span>Não foi possível obter o status on-chain.</span>
          </div>
        ) : blockchainStatus.registeredOnChain ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              <span className="text-sm font-medium text-success">
                Registrado on-chain
              </span>
            </div>

            {blockchainStatus.transactionHash && (
              <div>
                <p className="mb-0.5 text-xs text-muted-foreground">Hash da transação</p>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs text-foreground">
                    {shortenHash(blockchainStatus.transactionHash, 8)}
                  </span>
                  <CopyButton value={blockchainStatus.transactionHash} />
                  <a
                    href={`${env.explorerUrl}/tx/${blockchainStatus.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 rounded text-xs text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Ver no explorador"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Ver no explorer
                  </a>
                </div>
              </div>
            )}

            {blockchainStatus.blockNumber && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Bloco:{" "}
                  <span className="font-mono text-foreground">
                    #{blockchainStatus.blockNumber.toLocaleString("pt-BR")}
                  </span>
                </p>
              </div>
            )}

            {blockchainStatus.blockchainTimestamp && (
              <div>
                <p className="text-xs text-muted-foreground">
                  Registrado em:{" "}
                  <span className="text-foreground">
                    {formatDateTimeBR(blockchainStatus.blockchainTimestamp)}
                  </span>
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
            <span>Aguardando registro on-chain.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
