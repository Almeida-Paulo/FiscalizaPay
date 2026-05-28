import type { ContractStatus } from "./types";

/** Variante visual — mapeada para tokens de cor do Design System */
export type StatusVariant =
  | "neutral"
  | "info"
  | "warning"
  | "success"
  | "danger";

/** Labels exibidos na interface para cada status */
export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  CRIADO: "Criado",
  ENVIADO: "Enviado",
  ENTREGUE: "Entregue",
  VALIDADO: "Validado",
  PAGAMENTO_AUTORIZADO: "Pagamento autorizado",
  DISPUTA: "Em disputa",
};

/** Descrição curta para cada status */
export const CONTRACT_STATUS_DESCRIPTIONS: Record<ContractStatus, string> = {
  CRIADO: "Aguardando confirmação do fornecedor",
  ENVIADO: "Aguardando confirmação de entrega",
  ENTREGUE: "Aguardando validação do fiscal",
  VALIDADO: "Aguardando autorização de pagamento",
  PAGAMENTO_AUTORIZADO: "Pagamento autorizado pelo gestor",
  DISPUTA: "Divergência registrada — pagamento bloqueado",
};

/** Variante visual para badge de status */
export const CONTRACT_STATUS_VARIANTS: Record<ContractStatus, StatusVariant> = {
  CRIADO: "neutral",
  ENVIADO: "info",
  ENTREGUE: "warning",
  VALIDADO: "success",
  PAGAMENTO_AUTORIZADO: "success",
  DISPUTA: "danger",
};

/** Progresso percentual do fluxo (0-100) */
export const CONTRACT_STATUS_PROGRESS: Record<ContractStatus, number> = {
  CRIADO: 10,
  ENVIADO: 30,
  ENTREGUE: 55,
  VALIDADO: 80,
  PAGAMENTO_AUTORIZADO: 100,
  DISPUTA: 50,
};

/** Map visual completo — tudo em um só objeto */
export const CONTRACT_STATUS_MAP: Record<
  ContractStatus,
  {
    label: string;
    description: string;
    variant: StatusVariant;
    progress: number;
  }
> = {
  CRIADO: {
    label: CONTRACT_STATUS_LABELS.CRIADO,
    description: CONTRACT_STATUS_DESCRIPTIONS.CRIADO,
    variant: CONTRACT_STATUS_VARIANTS.CRIADO,
    progress: CONTRACT_STATUS_PROGRESS.CRIADO,
  },
  ENVIADO: {
    label: CONTRACT_STATUS_LABELS.ENVIADO,
    description: CONTRACT_STATUS_DESCRIPTIONS.ENVIADO,
    variant: CONTRACT_STATUS_VARIANTS.ENVIADO,
    progress: CONTRACT_STATUS_PROGRESS.ENVIADO,
  },
  ENTREGUE: {
    label: CONTRACT_STATUS_LABELS.ENTREGUE,
    description: CONTRACT_STATUS_DESCRIPTIONS.ENTREGUE,
    variant: CONTRACT_STATUS_VARIANTS.ENTREGUE,
    progress: CONTRACT_STATUS_PROGRESS.ENTREGUE,
  },
  VALIDADO: {
    label: CONTRACT_STATUS_LABELS.VALIDADO,
    description: CONTRACT_STATUS_DESCRIPTIONS.VALIDADO,
    variant: CONTRACT_STATUS_VARIANTS.VALIDADO,
    progress: CONTRACT_STATUS_PROGRESS.VALIDADO,
  },
  PAGAMENTO_AUTORIZADO: {
    label: CONTRACT_STATUS_LABELS.PAGAMENTO_AUTORIZADO,
    description: CONTRACT_STATUS_DESCRIPTIONS.PAGAMENTO_AUTORIZADO,
    variant: CONTRACT_STATUS_VARIANTS.PAGAMENTO_AUTORIZADO,
    progress: CONTRACT_STATUS_PROGRESS.PAGAMENTO_AUTORIZADO,
  },
  DISPUTA: {
    label: CONTRACT_STATUS_LABELS.DISPUTA,
    description: CONTRACT_STATUS_DESCRIPTIONS.DISPUTA,
    variant: CONTRACT_STATUS_VARIANTS.DISPUTA,
    progress: CONTRACT_STATUS_PROGRESS.DISPUTA,
  },
};

/** Transições de status permitidas pelo fluxo de negócio */
export const CONTRACT_STATUS_TRANSITIONS: Partial<
  Record<ContractStatus, ContractStatus[]>
> = {
  CRIADO: ["ENVIADO", "DISPUTA"],
  ENVIADO: ["ENTREGUE", "DISPUTA"],
  ENTREGUE: ["VALIDADO", "DISPUTA"],
  VALIDADO: ["PAGAMENTO_AUTORIZADO", "DISPUTA"],
  PAGAMENTO_AUTORIZADO: [],
  DISPUTA: [],
};
