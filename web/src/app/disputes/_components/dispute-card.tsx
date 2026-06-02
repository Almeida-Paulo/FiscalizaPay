import Link from "next/link";
import { AlertTriangle, ArrowRight, Building2, Package } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { DocumentHashViewer } from "@/entities/contract-event/ui/document-hash-viewer";
import type { Contract } from "@/entities/contract";
import { formatCurrencyBRL } from "@/shared/lib/formatters";

interface DisputeCardProps {
  contract: Contract;
}

export function DisputeCard({ contract }: DisputeCardProps) {
  const formattedDate = new Date(contract.updatedAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="border-danger/30 bg-danger/5 transition-colors hover:border-danger/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-danger/10">
              <AlertTriangle className="h-4 w-4 text-danger" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-foreground truncate">
                  {contract.contractNumber}
                </p>
                <Badge variant="outline" className="border-danger/40 text-danger text-xs shrink-0">
                  Em disputa
                </Badge>
              </div>
              <div className="mt-1.5 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 shrink-0" />
                  <span className="truncate">{contract.publicAgency}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package className="h-3 w-3 shrink-0" />
                  <span className="truncate">{contract.supplierName}</span>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrencyBRL(contract.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Atualizado em {formattedDate}
                </p>
              </div>
              {contract.documentHash && (
                <div className="mt-2 rounded-md bg-muted/30 px-2 py-1.5">
                  <p className="mb-1 text-xs text-muted-foreground">Hash do documento</p>
                  <DocumentHashViewer hash={contract.documentHash} />
                </div>
              )}
            </div>
          </div>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Link href={`/contracts/${contract.id}`}>
              <span className="hidden sm:inline">Ver contrato</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
