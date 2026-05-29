import { Calendar, Building2, User, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { ContractAmount } from "@/entities/contract/ui/contract-amount";
import { formatDateBR, formatDateTimeBR } from "@/shared/lib/formatters";
import { getContractProgress } from "@/entities/contract/model/rules";
import { CONTRACT_STATUS_MAP } from "@/entities/contract/model/constants";
import type { Contract } from "@/entities/contract";

interface ContractOverviewCardProps {
  contract: Contract;
}

export function ContractOverviewCard({ contract }: ContractOverviewCardProps) {
  const progress = getContractProgress(contract);
  const statusInfo = CONTRACT_STATUS_MAP[contract.status];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-lg">{contract.contractNumber}</CardTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Atualizado em {formatDateTimeBR(contract.updatedAt)}
            </p>
          </div>
          <ContractStatusBadge status={contract.status} showDescription />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs text-muted-foreground">
            <span>{statusInfo.description}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted">
            <div
              className="h-1.5 rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Object */}
        <div className="flex gap-2.5">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <p className="text-sm text-foreground leading-relaxed">{contract.object}</p>
        </div>

        {/* Agency + Supplier */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Órgão público</p>
              <p className="truncate text-sm font-medium text-foreground">
                {contract.publicAgency}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Fornecedor</p>
              <p className="truncate text-sm font-medium text-foreground">
                {contract.supplierName}
              </p>
            </div>
          </div>
        </div>

        {/* Amount + Deadline */}
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
          <div>
            <p className="mb-0.5 text-xs text-muted-foreground">Valor do contrato</p>
            <ContractAmount amount={contract.amount} size="lg" />
          </div>
          <div>
            <p className="mb-0.5 text-xs text-muted-foreground">Prazo de entrega</p>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {formatDateBR(contract.deadline)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
