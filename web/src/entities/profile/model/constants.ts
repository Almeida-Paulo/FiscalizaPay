import type { UserRole } from "./types";

/** Labels exibidos na interface para cada role */
export const ROLE_LABELS: Record<UserRole, string> = {
  GESTOR: "Gestor",
  FORNECEDOR: "Fornecedor",
  ENTREGADOR: "Entregador",
  FISCAL: "Fiscal",
  AUDITOR: "Auditor",
};

/** Descrição das responsabilidades de cada role */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  GESTOR: "Cria contratos, autoriza pagamentos e aciona disputas",
  FORNECEDOR: "Confirma envio ou execução do serviço",
  ENTREGADOR: "Confirma entrega no local correto",
  FISCAL: "Valida conformidade, abre disputa e simula fraude",
  AUDITOR: "Audita integridade, abre disputa e simula fraude",
};

/** Ações principais permitidas por role */
export const ROLE_ACTIONS: Record<UserRole, string[]> = {
  GESTOR: [
    "Criar contrato",
    "Autorizar pagamento",
    "Abrir disputa",
    "Simular fraude",
    "Registrar on-chain",
    "Visualizar dashboard",
  ],
  FORNECEDOR: [
    "Confirmar envio",
    "Visualizar contratos vinculados",
  ],
  ENTREGADOR: [
    "Confirmar entrega",
    "Visualizar contratos vinculados",
  ],
  FISCAL: [
    "Validar recebimento",
    "Abrir disputa",
    "Simular fraude",
    "Conferir nota fiscal",
  ],
  AUDITOR: [
    "Visualizar timeline",
    "Consultar hashes",
    "Abrir disputa",
    "Simular fraude",
    "Verificar integridade",
  ],
};

/** Map visual completo por role */
export const ROLE_VISUAL_MAP: Record<
  UserRole,
  { label: string; description: string; actions: string[] }
> = {
  GESTOR: {
    label: ROLE_LABELS.GESTOR,
    description: ROLE_DESCRIPTIONS.GESTOR,
    actions: ROLE_ACTIONS.GESTOR,
  },
  FORNECEDOR: {
    label: ROLE_LABELS.FORNECEDOR,
    description: ROLE_DESCRIPTIONS.FORNECEDOR,
    actions: ROLE_ACTIONS.FORNECEDOR,
  },
  ENTREGADOR: {
    label: ROLE_LABELS.ENTREGADOR,
    description: ROLE_DESCRIPTIONS.ENTREGADOR,
    actions: ROLE_ACTIONS.ENTREGADOR,
  },
  FISCAL: {
    label: ROLE_LABELS.FISCAL,
    description: ROLE_DESCRIPTIONS.FISCAL,
    actions: ROLE_ACTIONS.FISCAL,
  },
  AUDITOR: {
    label: ROLE_LABELS.AUDITOR,
    description: ROLE_DESCRIPTIONS.AUDITOR,
    actions: ROLE_ACTIONS.AUDITOR,
  },
};
