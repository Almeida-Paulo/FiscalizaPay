/**
 * Regras visuais do frontend para FiscalizaPay Web3.
 *
 * ATENÇÃO: Estas funções controlam apenas a interface visual.
 * O backend é a fonte definitiva de validação e segurança.
 * Nunca confiar apenas nestas funções para autorizar ações críticas.
 */

import type { Contract, ContractStatus } from "./types";
import type { Profile } from "@/entities/profile";
import {
  CONTRACT_STATUS_LABELS,
  CONTRACT_STATUS_DESCRIPTIONS,
  CONTRACT_STATUS_VARIANTS,
  CONTRACT_STATUS_PROGRESS,
  type StatusVariant,
} from "./constants";

// ─── Tipo de ação disponível no contrato ──────────────────────────────────────

export type ContractAction =
  | "CONFIRM_SHIPMENT"
  | "CONFIRM_DELIVERY"
  | "VALIDATE_RECEIPT"
  | "AUTHORIZE_PAYMENT"
  | "OPEN_DISPUTE"
  | "SIMULATE_FRAUD";

const ACTION_LABELS: Record<ContractAction, string> = {
  CONFIRM_SHIPMENT: "confirmar o envio",
  CONFIRM_DELIVERY: "confirmar a entrega",
  VALIDATE_RECEIPT: "validar o recebimento",
  AUTHORIZE_PAYMENT: "autorizar o pagamento",
  OPEN_DISPUTE: "abrir disputa",
  SIMULATE_FRAUD: "simular fraude",
};

// ─── Regras de permissão visual por ação ─────────────────────────────────────

export function canConfirmShipment(contract: Contract, profile: Profile): boolean {
  return contract.status === "CRIADO" && profile.role === "FORNECEDOR";
}

export function canConfirmDelivery(contract: Contract, profile: Profile): boolean {
  return contract.status === "ENVIADO" && profile.role === "ENTREGADOR";
}

export function canValidateReceipt(contract: Contract, profile: Profile): boolean {
  return contract.status === "ENTREGUE" && profile.role === "FISCAL";
}

export function canAuthorizePayment(contract: Contract, profile: Profile): boolean {
  return contract.status === "VALIDADO" && profile.role === "GESTOR";
}

export function canOpenDispute(contract: Contract, profile: Profile): boolean {
  if (contract.status === "PAGAMENTO_AUTORIZADO") return false;
  return ["GESTOR", "FISCAL", "FORNECEDOR", "ENTREGADOR"].includes(profile.role);
}

export function canSimulateFraud(contract: Contract, profile: Profile): boolean {
  if (!contract.documentHash) return false;
  if (contract.status === "PAGAMENTO_AUTORIZADO") return false;
  return ["GESTOR", "FISCAL"].includes(profile.role);
}

// ─── Próxima ação e lista de ações disponíveis ────────────────────────────────

export function getNextContractAction(
  contract: Contract,
  profile: Profile,
): ContractAction | null {
  if (canConfirmShipment(contract, profile)) return "CONFIRM_SHIPMENT";
  if (canConfirmDelivery(contract, profile)) return "CONFIRM_DELIVERY";
  if (canValidateReceipt(contract, profile)) return "VALIDATE_RECEIPT";
  if (canAuthorizePayment(contract, profile)) return "AUTHORIZE_PAYMENT";
  return null;
}

export function getAvailableContractActions(
  contract: Contract,
  profile: Profile,
): ContractAction[] {
  const actions: ContractAction[] = [];
  if (canConfirmShipment(contract, profile)) actions.push("CONFIRM_SHIPMENT");
  if (canConfirmDelivery(contract, profile)) actions.push("CONFIRM_DELIVERY");
  if (canValidateReceipt(contract, profile)) actions.push("VALIDATE_RECEIPT");
  if (canAuthorizePayment(contract, profile)) actions.push("AUTHORIZE_PAYMENT");
  if (canOpenDispute(contract, profile)) actions.push("OPEN_DISPUTE");
  if (canSimulateFraud(contract, profile)) actions.push("SIMULATE_FRAUD");
  return actions;
}

// ─── Motivo de bloqueio de ação ───────────────────────────────────────────────

/**
 * Retorna mensagem amigável explicando por que uma ação está bloqueada.
 * Retorna null se a ação estiver disponível.
 */
export function getBlockedActionReason(
  action: ContractAction,
  contract: Contract,
  profile: Profile,
): string | null {
  if (getAvailableContractActions(contract, profile).includes(action)) return null;

  switch (action) {
    case "CONFIRM_SHIPMENT":
      if (profile.role !== "FORNECEDOR")
        return "Apenas o fornecedor pode confirmar o envio.";
      if (contract.status !== "CRIADO")
        return "Esta ação só fica disponível quando o contrato está criado.";
      break;

    case "CONFIRM_DELIVERY":
      if (profile.role !== "ENTREGADOR")
        return "Apenas o entregador pode confirmar a entrega.";
      if (contract.status !== "ENVIADO")
        return "Esta ação só fica disponível após o fornecedor confirmar o envio.";
      break;

    case "VALIDATE_RECEIPT":
      if (profile.role !== "FISCAL")
        return "Apenas o fiscal pode validar o recebimento.";
      if (contract.status !== "ENTREGUE")
        return "Esta ação só fica disponível após a confirmação de entrega.";
      break;

    case "AUTHORIZE_PAYMENT":
      if (profile.role !== "GESTOR")
        return "Apenas o gestor responsável pode autorizar o pagamento.";
      if (contract.status !== "VALIDADO")
        return "O pagamento só pode ser autorizado após a validação do fiscal.";
      break;

    case "OPEN_DISPUTE":
      if (contract.status === "PAGAMENTO_AUTORIZADO")
        return "O pagamento já foi autorizado e não pode mais ser disputado.";
      if (profile.role === "AUDITOR")
        return "O auditor pode apenas visualizar; não pode abrir disputas.";
      break;

    case "SIMULATE_FRAUD":
      if (contract.status === "PAGAMENTO_AUTORIZADO")
        return "O pagamento já foi autorizado; não é possível simular fraude.";
      if (!contract.documentHash)
        return "O contrato não possui documento registrado para comparação.";
      if (!["GESTOR", "FISCAL"].includes(profile.role))
        return "Apenas o gestor ou o fiscal podem simular fraude.";
      break;
  }

  return `Você não pode ${ACTION_LABELS[action]} no estado atual.`;
}

// ─── Helpers de status e progresso ───────────────────────────────────────────

export function getContractProgress(contract: Contract): number {
  return CONTRACT_STATUS_PROGRESS[contract.status];
}

export function getContractStatusLabel(status: ContractStatus): string {
  return CONTRACT_STATUS_LABELS[status];
}

export function getContractStatusDescription(status: ContractStatus): string {
  return CONTRACT_STATUS_DESCRIPTIONS[status];
}

export function getContractStatusVariant(status: ContractStatus): StatusVariant {
  return CONTRACT_STATUS_VARIANTS[status];
}

export function isContractInDispute(contract: Contract): boolean {
  return contract.status === "DISPUTA";
}

export function isContractPaymentAuthorized(contract: Contract): boolean {
  return contract.status === "PAGAMENTO_AUTORIZADO";
}
