import { AlertTriangle } from "lucide-react";
import type { Contract } from "@/entities/contract";

interface ContractDisputeAlertProps {
  contract: Contract;
}

export function ContractDisputeAlert({ contract }: ContractDisputeAlertProps) {
  if (contract.status !== "DISPUTA") return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
      <div>
        <p className="text-sm font-semibold text-danger">Contrato em disputa</p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Uma divergência foi registrada. O pagamento está bloqueado até resolução.
          Consulte a timeline de eventos para detalhes da ocorrência.
        </p>
      </div>
    </div>
  );
}
