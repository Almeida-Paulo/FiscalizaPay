"use client";

import { type ReactNode } from "react";
import { Card, CardContent } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { cn } from "@/shared/lib/utils";

type MetricVariant = "default" | "danger" | "success" | "warning";

interface DashboardMetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  variant?: MetricVariant;
  loading?: boolean;
  className?: string;
}

const VARIANT_VALUE_CLASS: Record<MetricVariant, string> = {
  default: "text-primary",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
};

const VARIANT_ICON_CLASS: Record<MetricVariant, string> = {
  default: "bg-primary/10 text-primary",
  danger: "bg-danger/10 text-danger",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function DashboardMetricCard({
  title,
  value,
  description,
  icon,
  variant = "default",
  loading = false,
  className,
}: DashboardMetricCardProps) {
  if (loading) {
    return (
      <Card className={cn("p-5", className)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-5", className)}>
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-muted-foreground">{title}</p>
            <p className={cn("mt-1.5 text-2xl font-bold tabular-nums", VARIANT_VALUE_CLASS[variant])}>
              {value}
            </p>
            {description && (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              VARIANT_ICON_CLASS[variant],
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
