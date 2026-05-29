"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { CONTRACT_STATUS_LABELS } from "@/entities/contract/model/constants";
import type { ContractStatus } from "@/entities/contract/model/types";

export type StatusFilter = ContractStatus | "ALL";
export type SortOrder = "updatedAt_desc" | "updatedAt_asc" | "amount_desc" | "amount_asc";

interface ContractsFiltersProps {
  search: string;
  statusFilter: StatusFilter;
  agencyFilter: string;
  sortOrder: SortOrder;
  agencies: string[];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onAgencyChange: (value: string) => void;
  onSortChange: (value: SortOrder) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const ALL_STATUSES = "ALL" as const;
const ALL_AGENCIES = "ALL" as const;

const SORT_LABELS: Record<SortOrder, string> = {
  updatedAt_desc: "Mais recentes",
  updatedAt_asc: "Mais antigos",
  amount_desc: "Maior valor",
  amount_asc: "Menor valor",
};

export function ContractsFilters({
  search,
  statusFilter,
  agencyFilter,
  sortOrder,
  agencies,
  onSearchChange,
  onStatusChange,
  onAgencyChange,
  onSortChange,
  onClear,
  hasActiveFilters,
}: ContractsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {/* Search */}
      <div className="relative flex-1 sm:min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por número, órgão, fornecedor..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Status filter */}
      <Select value={statusFilter} onValueChange={(v) => onStatusChange(v as StatusFilter)}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_STATUSES}>Todos os status</SelectItem>
          {(Object.entries(CONTRACT_STATUS_LABELS) as [ContractStatus, string][]).map(
            ([status, label]) => (
              <SelectItem key={status} value={status}>
                {label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      {/* Agency filter */}
      {agencies.length > 0 && (
        <Select value={agencyFilter} onValueChange={onAgencyChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Todos os órgãos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_AGENCIES}>Todos os órgãos</SelectItem>
            {agencies.map((agency) => (
              <SelectItem key={agency} value={agency}>
                {agency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Sort order */}
      <Select value={sortOrder} onValueChange={(v) => onSortChange(v as SortOrder)}>
        <SelectTrigger className="w-full sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.entries(SORT_LABELS) as [SortOrder, string][]).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Limpar
        </Button>
      )}
    </div>
  );
}
