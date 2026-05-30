"use client";

import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { EmptyState } from "@/shared/ui/empty-state";
import { ContractEventCard } from "@/entities/contract-event/ui/contract-event-card";
import type { ContractEvent } from "@/entities/contract-event";

interface ContractTimelineProps {
  events?: ContractEvent[];
  isLoading: boolean;
}

export function ContractTimeline({ events, isLoading }: ContractTimelineProps) {
  const sorted = events
    ? [...events].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Timeline auditável</CardTitle>
          {sorted.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {sorted.length} {sorted.length === 1 ? "evento" : "eventos"}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2 pt-1">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={<Clock className="h-5 w-5" />}
            title="Nenhum evento registrado"
            description="Os eventos de atualização do contrato aparecerão aqui."
            className="py-8"
          />
        ) : (
          <div>
            {sorted.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06, duration: 0.3, ease: "easeOut" }}
              >
                <ContractEventCard
                  event={event}
                  isLast={idx === sorted.length - 1}
                />
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
