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
  | "SIMULATE_FRAUD"
  | "REGISTER_ON_CHAIN";

const ACTION_LABELS: Record<ContractAction, string> = {
  CONFIRM_SHIPMENT: "confirmar o envio",
  CONFIRM_DELIVERY: "confirmar a entrega",
  VALIDATE_RECEIPT: "validar o recebimento",
  AUTHORIZE_PAYMENT: "autorizar o pagamento",
  OPEN_DISPUTE: "abrir disputa",
  SIMULATE_FRAUD: "simular fraude",
  REGISTER_ON_CHAIN: "registrar on-chain",
};

// ─── Regras de permissão visual por ação ─────────────────────────────────────

/**
 * Espelha `require_party_wallet` do backend: a checagem só se aplica quando o
 * contrato tem uma wallet registrada para aquele papel; sem wallet vinculada,
 * qualquer perfil com o papel correto pode agir. Comparação case-insensitive.
 */
function hasRequiredWallet(
  requiredWallet: string | undefined,
  currentWallet: string | null | undefined,
): boolean {
  if (!requiredWallet) return true;
  return !!currentWallet && currentWallet.toLowerCase() === requiredWallet.toLowerCase();
}

export function canConfirmShipment(contract: Contract, profile: Profile): boolean {
  if (contract.status !== "CRIADO" || profile.role !== "FORNECEDOR") return false;
  return hasRequiredWallet(contract.supplierWallet, profile.walletAddress);
}

export function canConfirmDelivery(contract: Contract, profile: Profile): boolean {
  if (contract.status !== "ENVIADO" || profile.role !== "ENTREGADOR") return false;
  return hasRequiredWallet(contract.logisticsWallet, profile.walletAddress);
}

export function canValidateReceipt(contract: Contract, profile: Profile): boolean {
  if (contract.status !== "ENTREGUE" || profile.role !== "FISCAL") return false;
  return hasRequiredWallet(contract.inspectorWallet, profile.walletAddress);
}

export function canAuthorizePayment(contract: Contract, profile: Profile): boolean {
  if (contract.status !== "VALIDADO" || profile.role !== "GESTOR") return false;
  return hasRequiredWallet(contract.managerWallet, profile.walletAddress);
}

export function canCreateContract(profile: Profile): boolean {
  return profile.role === "GESTOR";
}

export function canOpenDispute(contract: Contract, profile: Profile): boolean {
  if (["PAGAMENTO_AUTORIZADO", "DISPUTA"].includes(contract.status)) return false;
  return ["GESTOR", "FISCAL", "AUDITOR"].includes(profile.role);
}

export function canSimulateFraud(contract: Contract, profile: Profile): boolean {
  if (!contract.documentHash) return false;
  if (["PAGAMENTO_AUTORIZADO", "DISPUTA"].includes(contract.status)) return false;
  return ["GESTOR", "FISCAL", "AUDITOR"].includes(profile.role);
}

export function canRegisterOnChain(_: Contract, profile: Profile): boolean {
  return profile.role === "GESTOR";
}

// ─── Labels de exibição para ações ───────────────────────────────────────────

export const CONTRACT_ACTION_LABELS: Record<ContractAction, string> = {
  CONFIRM_SHIPMENT: "Confirmar envio",
  CONFIRM_DELIVERY: "Confirmar entrega",
  VALIDATE_RECEIPT: "Validar recebimento",
  AUTHORIZE_PAYMENT: "Autorizar pagamento",
  OPEN_DISPUTE: "Abrir disputa",
  SIMULATE_FRAUD: "Simular fraude",
  REGISTER_ON_CHAIN: "Registrar on-chain",
};

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
  if (canRegisterOnChain(contract, profile)) actions.push("REGISTER_ON_CHAIN");
  return actions;
}

export function getCanonicalNextAction(contract: Contract): ContractAction | null {
  switch (contract.status) {
    case "CRIADO": return "CONFIRM_SHIPMENT";
    case "ENVIADO": return "CONFIRM_DELIVERY";
    case "ENTREGUE": return "VALIDATE_RECEIPT";
    case "VALIDADO": return "AUTHORIZE_PAYMENT";
    default: return null;
  }
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
      if (!hasRequiredWallet(contract.supplierWallet, profile.walletAddress))
        return "Esta ação exige a wallet de fornecedor vinculada a este contrato.";
      break;

    case "CONFIRM_DELIVERY":
      if (profile.role !== "ENTREGADOR")
        return "Apenas o entregador pode confirmar a entrega.";
      if (contract.status !== "ENVIADO")
        return "Esta ação só fica disponível após o fornecedor confirmar o envio.";
      if (!hasRequiredWallet(contract.logisticsWallet, profile.walletAddress))
        return "Esta ação exige a wallet de logística vinculada a este contrato.";
      break;

    case "VALIDATE_RECEIPT":
      if (profile.role !== "FISCAL")
        return "Apenas o fiscal pode validar o recebimento.";
      if (contract.status !== "ENTREGUE")
        return "Esta ação só fica disponível após a confirmação de entrega.";
      if (!hasRequiredWallet(contract.inspectorWallet, profile.walletAddress))
        return "Esta ação exige a wallet de fiscal vinculada a este contrato.";
      break;

    case "AUTHORIZE_PAYMENT":
      if (profile.role !== "GESTOR")
        return "Apenas o gestor responsável pode autorizar o pagamento.";
      if (contract.status !== "VALIDADO")
        return "O pagamento só pode ser autorizado após a validação do fiscal.";
      if (!hasRequiredWallet(contract.managerWallet, profile.walletAddress))
        return "Esta ação exige a wallet de gestor vinculada a este contrato.";
      break;

    case "OPEN_DISPUTE":
      if (contract.status === "PAGAMENTO_AUTORIZADO")
        return "O pagamento já foi autorizado e não pode mais ser disputado.";
      if (contract.status === "DISPUTA")
        return "O contrato já está em disputa.";
      if (!["GESTOR", "FISCAL", "AUDITOR"].includes(profile.role))
        return "Apenas gestor, fiscal ou auditor podem abrir disputa.";
      break;

    case "SIMULATE_FRAUD":
      if (contract.status === "PAGAMENTO_AUTORIZADO")
        return "O pagamento já foi autorizado; não é possível simular fraude.";
      if (contract.status === "DISPUTA")
        return "O contrato já está em disputa.";
      if (!contract.documentHash)
        return "O contrato não possui documento registrado para comparação.";
      if (!["GESTOR", "FISCAL", "AUDITOR"].includes(profile.role))
        return "Apenas gestor, fiscal ou auditor podem simular fraude.";
      break;

    case "REGISTER_ON_CHAIN":
      if (profile.role !== "GESTOR")
        return "Apenas o gestor pode registrar o contrato on-chain.";
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
