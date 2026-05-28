import type { ContractEventType } from "./types";

/** Labels exibidos na timeline para cada event type */
export const EVENT_TYPE_LABELS: Record<ContractEventType, string> = {
  CONTRATO_CRIADO: "Contrato criado",
  ENVIO_CONFIRMADO: "Envio confirmado",
  ENTREGA_CONFIRMADA: "Entrega confirmada",
  RECEBIMENTO_VALIDADO: "Recebimento validado",
  PAGAMENTO_AUTORIZADO: "Pagamento autorizado",
  DISPUTA_ABERTA: "Disputa aberta",
  FRAUDE_SIMULADA: "Fraude simulada",
  HASH_REGISTRADO: "Hash registrado",
};

/** Descrição de cada tipo de evento */
export const EVENT_TYPE_DESCRIPTIONS: Record<ContractEventType, string> = {
  CONTRATO_CRIADO: "O gestor criou e registrou o contrato",
  ENVIO_CONFIRMADO: "O fornecedor confirmou o envio ou execução",
  ENTREGA_CONFIRMADA: "O entregador confirmou a entrega no local",
  RECEBIMENTO_VALIDADO: "O fiscal validou a conformidade da entrega",
  PAGAMENTO_AUTORIZADO: "O gestor autorizou o pagamento final",
  DISPUTA_ABERTA: "Uma divergência foi registrada — pagamento bloqueado",
  FRAUDE_SIMULADA: "Hash do documento diverge do original",
  HASH_REGISTRADO: "Prova crítica registrada na blockchain",
};

/** Indica se o event type representa um estado terminal positivo */
export const EVENT_TYPE_IS_CRITICAL: Record<ContractEventType, boolean> = {
  CONTRATO_CRIADO: false,
  ENVIO_CONFIRMADO: false,
  ENTREGA_CONFIRMADA: false,
  RECEBIMENTO_VALIDADO: false,
  PAGAMENTO_AUTORIZADO: true,
  DISPUTA_ABERTA: true,
  FRAUDE_SIMULADA: true,
  HASH_REGISTRADO: false,
};

/** Indica se o event type representa alerta/problema */
export const EVENT_TYPE_IS_ALERT: Record<ContractEventType, boolean> = {
  CONTRATO_CRIADO: false,
  ENVIO_CONFIRMADO: false,
  ENTREGA_CONFIRMADA: false,
  RECEBIMENTO_VALIDADO: false,
  PAGAMENTO_AUTORIZADO: false,
  DISPUTA_ABERTA: true,
  FRAUDE_SIMULADA: true,
  HASH_REGISTRADO: false,
};

/** Map visual completo por event type */
export const EVENT_TYPE_MAP: Record<
  ContractEventType,
  {
    label: string;
    description: string;
    isCritical: boolean;
    isAlert: boolean;
  }
> = {
  CONTRATO_CRIADO: {
    label: EVENT_TYPE_LABELS.CONTRATO_CRIADO,
    description: EVENT_TYPE_DESCRIPTIONS.CONTRATO_CRIADO,
    isCritical: EVENT_TYPE_IS_CRITICAL.CONTRATO_CRIADO,
    isAlert: EVENT_TYPE_IS_ALERT.CONTRATO_CRIADO,
  },
  ENVIO_CONFIRMADO: {
    label: EVENT_TYPE_LABELS.ENVIO_CONFIRMADO,
    description: EVENT_TYPE_DESCRIPTIONS.ENVIO_CONFIRMADO,
    isCritical: EVENT_TYPE_IS_CRITICAL.ENVIO_CONFIRMADO,
    isAlert: EVENT_TYPE_IS_ALERT.ENVIO_CONFIRMADO,
  },
  ENTREGA_CONFIRMADA: {
    label: EVENT_TYPE_LABELS.ENTREGA_CONFIRMADA,
    description: EVENT_TYPE_DESCRIPTIONS.ENTREGA_CONFIRMADA,
    isCritical: EVENT_TYPE_IS_CRITICAL.ENTREGA_CONFIRMADA,
    isAlert: EVENT_TYPE_IS_ALERT.ENTREGA_CONFIRMADA,
  },
  RECEBIMENTO_VALIDADO: {
    label: EVENT_TYPE_LABELS.RECEBIMENTO_VALIDADO,
    description: EVENT_TYPE_DESCRIPTIONS.RECEBIMENTO_VALIDADO,
    isCritical: EVENT_TYPE_IS_CRITICAL.RECEBIMENTO_VALIDADO,
    isAlert: EVENT_TYPE_IS_ALERT.RECEBIMENTO_VALIDADO,
  },
  PAGAMENTO_AUTORIZADO: {
    label: EVENT_TYPE_LABELS.PAGAMENTO_AUTORIZADO,
    description: EVENT_TYPE_DESCRIPTIONS.PAGAMENTO_AUTORIZADO,
    isCritical: EVENT_TYPE_IS_CRITICAL.PAGAMENTO_AUTORIZADO,
    isAlert: EVENT_TYPE_IS_ALERT.PAGAMENTO_AUTORIZADO,
  },
  DISPUTA_ABERTA: {
    label: EVENT_TYPE_LABELS.DISPUTA_ABERTA,
    description: EVENT_TYPE_DESCRIPTIONS.DISPUTA_ABERTA,
    isCritical: EVENT_TYPE_IS_CRITICAL.DISPUTA_ABERTA,
    isAlert: EVENT_TYPE_IS_ALERT.DISPUTA_ABERTA,
  },
  FRAUDE_SIMULADA: {
    label: EVENT_TYPE_LABELS.FRAUDE_SIMULADA,
    description: EVENT_TYPE_DESCRIPTIONS.FRAUDE_SIMULADA,
    isCritical: EVENT_TYPE_IS_CRITICAL.FRAUDE_SIMULADA,
    isAlert: EVENT_TYPE_IS_ALERT.FRAUDE_SIMULADA,
  },
  HASH_REGISTRADO: {
    label: EVENT_TYPE_LABELS.HASH_REGISTRADO,
    description: EVENT_TYPE_DESCRIPTIONS.HASH_REGISTRADO,
    isCritical: EVENT_TYPE_IS_CRITICAL.HASH_REGISTRADO,
    isAlert: EVENT_TYPE_IS_ALERT.HASH_REGISTRADO,
  },
};

/** Mapa de endpoint → event type(s) gerado(s) */
export const ACTION_EVENT_MAP: Record<string, ContractEventType[]> = {
  "create-contract": ["CONTRATO_CRIADO"],
  "confirm-shipment": ["ENVIO_CONFIRMADO"],
  "confirm-delivery": ["ENTREGA_CONFIRMADA"],
  "validate-receipt": ["RECEBIMENTO_VALIDADO"],
  "authorize-payment": ["PAGAMENTO_AUTORIZADO"],
  "open-dispute": ["DISPUTA_ABERTA"],
  "simulate-fraud": ["FRAUDE_SIMULADA", "DISPUTA_ABERTA"],
  "register-on-chain": ["HASH_REGISTRADO"],
};
