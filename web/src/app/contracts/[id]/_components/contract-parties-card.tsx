import { User, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { CopyButton } from "@/shared/ui/copy-button";
import { shortenAddress } from "@/shared/lib/formatters";
import type { Contract } from "@/entities/contract";

interface PartyRowProps {
  label: string;
  name: string;
  wallet?: string;
}

function PartyRow({ label, name, wallet }: PartyRowProps) {
  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
        <User className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        {wallet && (
          <div className="mt-0.5 flex items-center gap-1">
            <Wallet className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs text-muted-foreground">
              {shortenAddress(wallet)}
            </span>
            <CopyButton value={wallet} />
          </div>
        )}
      </div>
    </div>
  );
}

interface ContractPartiesCardProps {
  contract: Contract;
}

export function ContractPartiesCard({ contract }: ContractPartiesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Partes envolvidas</CardTitle>
      </CardHeader>
      <CardContent>
        {contract.managerName && (
          <PartyRow
            label="Gestor"
            name={contract.managerName}
            wallet={contract.managerWallet}
          />
        )}
        <PartyRow
          label="Fornecedor"
          name={contract.supplierName}
          wallet={contract.supplierWallet}
        />
        <PartyRow
          label="Fiscal"
          name={contract.inspectorName}
          wallet={contract.inspectorWallet}
        />
        <PartyRow
          label="Logística / Entregador"
          name={contract.logisticsResponsible}
          wallet={contract.logisticsWallet}
        />
      </CardContent>
    </Card>
  );
}
