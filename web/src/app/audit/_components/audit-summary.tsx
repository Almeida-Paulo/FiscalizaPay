import { Hash, Link2, FileSearch, AlertTriangle } from "lucide-react";
import { Card } from "@/shared/ui/card";
import { EVENT_TYPE_IS_ALERT } from "@/entities/contract-event/model/constants";
import type { AuditEventItem } from "./use-audit-events";

interface AuditSummaryProps {
  events: AuditEventItem[];
}

export function AuditSummary({ events }: AuditSummaryProps) {
  const withTxHash = events.filter((e) => !!e.transactionHash).length;
  const withDocHash = events.filter((e) => !!e.documentHash).length;
  const alerts = events.filter((e) => EVENT_TYPE_IS_ALERT[e.eventType]).length;

  const stats = [
    {
      label: "Total de eventos",
      value: events.length,
      icon: Hash,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Com tx blockchain",
      value: withTxHash,
      icon: Link2,
      color: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Com hash de documento",
      value: withDocHash,
      icon: FileSearch,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Disputas e fraudes",
      value: alerts,
      icon: AlertTriangle,
      color: alerts > 0 ? "text-warning" : "text-muted-foreground",
      bg: alerts > 0 ? "bg-warning/10" : "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="gap-0 p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${stat.bg}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
