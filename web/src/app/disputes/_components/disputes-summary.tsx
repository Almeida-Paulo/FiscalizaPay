import { AlertTriangle, DollarSign, ShieldOff } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import type { Contract } from "@/entities/contract";
import { formatCurrencyBRL } from "@/shared/lib/formatters";

interface DisputesSummaryProps {
  contracts: Contract[];
}

export function DisputesSummary({ contracts }: DisputesSummaryProps) {
  const totalValue = contracts.reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card className="border-danger/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10">
              <AlertTriangle className="h-4 w-4 text-danger" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{contracts.length}</p>
              <p className="text-xs text-muted-foreground">
                {contracts.length === 1 ? "Disputa ativa" : "Disputas ativas"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-warning/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/10">
              <DollarSign className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrencyBRL(totalValue)}
              </p>
              <p className="text-xs text-muted-foreground">Valor total bloqueado</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-danger/20 bg-danger/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger/10">
              <ShieldOff className="h-4 w-4 text-danger" />
            </div>
            <div>
              <p className="text-sm font-semibold text-danger">Pagamentos bloqueados</p>
              <p className="text-xs text-muted-foreground">
                Requer resolução manual ou intervenção do gestor.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
