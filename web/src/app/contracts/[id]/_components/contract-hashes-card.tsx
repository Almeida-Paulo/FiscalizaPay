import { Hash, FileCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CopyButton } from "@/shared/ui/copy-button";
import { EmptyState } from "@/shared/ui/empty-state";
import { shortenHash } from "@/shared/lib/formatters";
import type { Contract } from "@/entities/contract";
import type { BlockchainStatus } from "@/entities/contract/model/types";

interface HashRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

function HashRow({ label, value, mono = true }: HashRowProps) {
  return (
    <div className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p
          className={`mt-0.5 break-all text-sm text-foreground ${mono ? "font-mono" : ""}`}
          title={value}
        >
          {shortenHash(value, 8)}
        </p>
      </div>
      <CopyButton value={value} />
    </div>
  );
}

interface ContractHashesCardProps {
  contract: Contract;
  blockchainStatus?: BlockchainStatus;
}

export function ContractHashesCard({
  contract,
  blockchainStatus,
}: ContractHashesCardProps) {
  const hasDocumentHash = !!contract.documentHash;
  const hasBlockchainId = !!contract.blockchainContractId;
  const hasTransactionHash = !!blockchainStatus?.transactionHash;
  const hasAnyHash = hasDocumentHash || hasBlockchainId || hasTransactionHash;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hashes e identificadores</CardTitle>
      </CardHeader>
      <CardContent>
        {hasAnyHash ? (
          <div>
            {hasDocumentHash && (
              <HashRow label="Hash do documento" value={contract.documentHash!} />
            )}
            {hasBlockchainId && (
              <HashRow
                label="ID do contrato na blockchain"
                value={contract.blockchainContractId!}
              />
            )}
            {hasTransactionHash && (
              <HashRow
                label="Hash da transação"
                value={blockchainStatus!.transactionHash!}
              />
            )}
          </div>
        ) : (
          <EmptyState
            icon={<Hash className="h-5 w-5" />}
            title="Nenhum hash registrado"
            description="O documento e a transação blockchain ainda não foram registrados."
            className="py-8"
          />
        )}
        {!hasDocumentHash && hasAnyHash && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileCheck className="h-3.5 w-3.5" />
            Documento original não registrado neste contrato.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
