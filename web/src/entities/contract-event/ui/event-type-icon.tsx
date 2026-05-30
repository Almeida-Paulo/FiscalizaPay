import type { LucideIcon } from "lucide-react";
import {
  FilePlus,
  Truck,
  Package,
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldX,
  Hash,
} from "lucide-react";
import type { ContractEventType } from "../model/types";

const EVENT_ICONS: Record<ContractEventType, LucideIcon> = {
  CONTRATO_CRIADO: FilePlus,
  ENVIO_CONFIRMADO: Truck,
  ENTREGA_CONFIRMADA: Package,
  RECEBIMENTO_VALIDADO: ClipboardCheck,
  PAGAMENTO_AUTORIZADO: CheckCircle2,
  DISPUTA_ABERTA: AlertTriangle,
  FRAUDE_SIMULADA: ShieldX,
  HASH_REGISTRADO: Hash,
};

interface EventTypeIconProps {
  eventType: ContractEventType;
  className?: string;
}

export function EventTypeIcon({ eventType, className }: EventTypeIconProps) {
  const Icon = EVENT_ICONS[eventType];
  return <Icon className={className} />;
}
