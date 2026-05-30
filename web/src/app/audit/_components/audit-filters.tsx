import { X } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { EVENT_TYPE_LABELS } from "@/entities/contract-event/model/constants";
import { CONTRACT_STATUS_MAP } from "@/entities/contract/model/constants";
import type { ContractEventType } from "@/entities/contract-event/model/types";
import type { ContractStatus } from "@/entities/contract/model/types";

export interface AuditFiltersState {
  search: string;
  eventType: ContractEventType | "all";
  contractStatus: ContractStatus | "all";
  onlyAlert: boolean;
  orderBy: "newest" | "oldest";
}

interface AuditFiltersProps {
  filters: AuditFiltersState;
  onChange: (filters: AuditFiltersState) => void;
  resultCount: number;
  totalCount: number;
}

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as ContractEventType[];
const CONTRACT_STATUSES = Object.keys(CONTRACT_STATUS_MAP) as ContractStatus[];

export function AuditFilters({ filters, onChange, resultCount, totalCount }: AuditFiltersProps) {
  const isFiltered =
    filters.search !== "" ||
    filters.eventType !== "all" ||
    filters.contractStatus !== "all" ||
    filters.onlyAlert ||
    filters.orderBy !== "newest";

  function set(partial: Partial<AuditFiltersState>) {
    onChange({ ...filters, ...partial });
  }

  function reset() {
    onChange({ search: "", eventType: "all", contractStatus: "all", onlyAlert: false, orderBy: "newest" });
  }

  return (
    <div className="space-y-3">
      {/* Search + clear */}
      <div className="flex gap-2">
        <Input
          placeholder="Buscar por contrato, responsável, hash..."
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          className="h-8 text-sm"
        />
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-8 shrink-0 gap-1 text-xs">
            <X className="h-3.5 w-3.5" />
            Limpar
          </Button>
        )}
      </div>

      {/* Selects row */}
      <div className="flex flex-wrap gap-2">
        {/* Event type */}
        <Select
          value={filters.eventType}
          onValueChange={(v) => set({ eventType: v as ContractEventType | "all" })}
        >
          <SelectTrigger size="sm" className="h-8 w-auto text-xs">
            <SelectValue placeholder="Tipo de evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {EVENT_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Contract status */}
        <Select
          value={filters.contractStatus}
          onValueChange={(v) => set({ contractStatus: v as ContractStatus | "all" })}
        >
          <SelectTrigger size="sm" className="h-8 w-auto text-xs">
            <SelectValue placeholder="Status do contrato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {CONTRACT_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {CONTRACT_STATUS_MAP[status].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Ordering */}
        <Select
          value={filters.orderBy}
          onValueChange={(v) => set({ orderBy: v as "newest" | "oldest" })}
        >
          <SelectTrigger size="sm" className="h-8 w-auto text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recente</SelectItem>
            <SelectItem value="oldest">Mais antigo</SelectItem>
          </SelectContent>
        </Select>

        {/* Alert toggle */}
        <Button
          variant={filters.onlyAlert ? "default" : "outline"}
          size="sm"
          className="h-8 text-xs"
          onClick={() => set({ onlyAlert: !filters.onlyAlert })}
        >
          Disputas e fraudes
        </Button>
      </div>

      {/* Result count */}
      <p className="text-xs text-muted-foreground">
        {resultCount === totalCount
          ? `${totalCount} evento${totalCount !== 1 ? "s" : ""}`
          : `${resultCount} de ${totalCount} evento${totalCount !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}
