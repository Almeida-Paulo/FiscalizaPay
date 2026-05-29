import Link from "next/link";
import { ArrowRight, Building2, Calendar, User } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { ContractStatusBadge } from "./contract-status-badge";
import { ContractAmount } from "./contract-amount";
import { formatDateBR } from "@/shared/lib/formatters";
import { cn } from "@/shared/lib/utils";
import type { Contract } from "@/entities/contract/model/types";

interface ContractCardProps {
  contract: Contract;
  className?: string;
}

export function ContractCard({ contract, className }: ContractCardProps) {
  const isDispute = contract.status === "DISPUTA";

  return (
    <Card
      className={cn(
        "gap-0 py-0 transition-shadow hover:shadow-md",
        isDispute && "border-danger/30",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">
              {contract.contractNumber}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">
              {formatDateBR(contract.updatedAt)}
            </span>
          </div>
        </div>
        <ContractStatusBadge status={contract.status} />
      </div>

      {/* Body */}
      <div className="mt-3 px-5">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Building2 className="h-3.5 w-3.5 shrink-0" />
          <p className="truncate text-sm font-semibold text-foreground">
            {contract.publicAgency}
          </p>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-muted-foreground">
          <User className="h-3.5 w-3.5 shrink-0" />
          <p className="truncate text-sm text-muted-foreground">
            {contract.supplierName}
          </p>
        </div>
        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
          {contract.object}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <ContractAmount amount={contract.amount} size="md" />
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs">Prazo: {formatDateBR(contract.deadline)}</span>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="h-7 shrink-0 gap-1 text-xs">
          <Link href={`/contracts/${contract.id}`}>
            Ver <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </Card>
  );
}
