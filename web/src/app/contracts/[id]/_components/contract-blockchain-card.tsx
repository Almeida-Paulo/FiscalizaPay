import { CheckCircle2, XCircle, Clock3, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { formatDateTimeBR } from "@/shared/lib/formatters";
import { TransactionHashLink } from "@/entities/transaction";
import type { BlockchainStatus } from "@/entities/contract/model/types";

interface ContractBlockchainCardProps {
  blockchainStatus?: BlockchainStatus;
  isLoading: boolean;
}

export function ContractBlockchainCard({
  blockchainStatus,
  isLoading,
}: ContractBlockchainCardProps) {
  const unavailableReason =
    blockchainStatus?.unavailableReason ??
    "Registro em blockchain indisponivel neste ambiente.";

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
            <span>Nao foi possivel obter o status blockchain.</span>
          </div>
        ) : blockchainStatus.blockchainAvailable === false ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Wrench className="h-4 w-4 shrink-0" />
              <span>Recurso blockchain em preparacao</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {unavailableReason} O fluxo principal do contrato permanece disponivel.
            </p>
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
                <p className="mb-0.5 text-xs text-muted-foreground">Hash da transacao</p>
                <TransactionHashLink hash={blockchainStatus.transactionHash} />
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
            <Clock3 className="h-4 w-4 shrink-0" />
            <span>Ainda nao registrado on-chain.</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
