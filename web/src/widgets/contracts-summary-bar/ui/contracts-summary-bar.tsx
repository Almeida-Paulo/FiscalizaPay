"use client";

import { AlertTriangle, CheckCircle2, DollarSign, List } from "lucide-react";
import { formatCurrencyCompact } from "@/shared/lib/formatters";
import type { Contract } from "@/entities/contract/model/types";

interface ContractsSummaryBarProps {
  contracts: Contract[];
}

export function ContractsSummaryBar({ contracts }: ContractsSummaryBarProps) {
  const total = contracts.length;
  const disputes = contracts.filter((c) => c.status === "DISPUTA").length;
  const authorized = contracts.filter((c) => c.status === "PAGAMENTO_AUTORIZADO").length;
  const totalAmount = contracts.reduce((sum, c) => sum + c.amount, 0);

  const items = [
    {
      icon: <List className="h-3.5 w-3.5" />,
      label: `${total} contrato${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`,
      className: "text-muted-foreground",
    },
    {
      icon: <AlertTriangle className="h-3.5 w-3.5 text-danger" />,
      label: `${disputes} em disputa`,
      className: disputes > 0 ? "text-danger" : "text-muted-foreground",
    },
    {
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
      label: `${authorized} autorizado${authorized !== 1 ? "s" : ""}`,
      className: "text-muted-foreground",
    },
    {
      icon: <DollarSign className="h-3.5 w-3.5 text-primary" />,
      label: formatCurrencyCompact(totalAmount),
      className: "text-primary font-medium",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
      {items.map((item, i) => (
        <div key={i} className={`flex items-center gap-1.5 text-xs ${item.className}`}>
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
