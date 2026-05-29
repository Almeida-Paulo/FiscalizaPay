import { env } from "@/shared/config/env";
import { httpClient } from "./http-client";
import type { ApiResponse } from "@/shared/types/api";
import type { Contract } from "@/entities/contract";
import type { ContractEvent } from "@/entities/contract-event";
import type { UserRole } from "@/entities/profile";
import type {
  CreateContractPayload,
  UpdateContractPayload,
  ContractActionPayload,
  OpenDisputePayload,
  SimulateFraudPayload,
} from "@/entities/contract/model/api-types";
import { mockStore } from "@/shared/mocks/mock-store";
import { MockErrors } from "@/shared/mocks/mock-errors";

type ActionResult = {
  id: string;
  status: Contract["status"];
  updatedAt: string;
  event: Pick<ContractEvent, "id" | "eventType" | "transactionHash" | "createdAt">;
};

type SimulateFraudResult = {
  id: string;
  status: Contract["status"];
  fraudDetected: boolean;
  originalHash?: string;
  newHash?: string;
  updatedAt: string;
  events?: Pick<ContractEvent, "id" | "eventType" | "createdAt">[];
  message?: string;
};

function persistAction(
  contractId: string,
  eventId: string,
  eventType: ContractEvent["eventType"],
  newStatus: Contract["status"],
  txHash: string,
  responsibleRole: UserRole,
  description: string,
): ApiResponse<ActionResult> {
  const now = new Date().toISOString();
  mockStore.updateContract(contractId, { status: newStatus });
  mockStore.addEvent({
    id: eventId,
    contractId,
    eventType,
    description,
    responsibleRole,
    transactionHash: txHash,
    statusAfter: newStatus,
    createdAt: now,
  });
  return {
    data: {
      id: contractId,
      status: newStatus,
      updatedAt: now,
      event: { id: eventId, eventType, transactionHash: txHash, createdAt: now },
    },
  };
}

// ── GET /contracts ──────────────────────────────────────────────────────────

export async function getContracts(): Promise<ApiResponse<Contract[]>> {
  if (env.enableMocks) {
    return { data: mockStore.getContracts() };
  }
  return httpClient.get<Contract[]>("/contracts");
}

// ── GET /contracts/:id ──────────────────────────────────────────────────────

export async function getContractById(contractId: string): Promise<ApiResponse<Contract>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    return { data: contract! };
  }
  return httpClient.get<Contract>(`/contracts/${contractId}`);
}

// ── POST /contracts ─────────────────────────────────────────────────────────

export async function createContract(
  payload: CreateContractPayload,
): Promise<ApiResponse<Contract>> {
  if (env.enableMocks) {
    const now = new Date().toISOString();
    const newContract: Contract = {
      id: `mock-contract-${Date.now()}`,
      ...payload,
      status: "CRIADO",
      createdAt: now,
      updatedAt: now,
    };
    mockStore.addContract(newContract);
    mockStore.addEvent({
      id: `evt-criado-${Date.now()}`,
      contractId: newContract.id,
      eventType: "CONTRATO_CRIADO",
      description: `Contrato ${payload.contractNumber ?? newContract.id} criado.`,
      responsibleRole: "GESTOR",
      responsibleName: payload.managerName,
      statusAfter: "CRIADO",
      createdAt: now,
    });
    return { data: newContract, message: "Contrato criado com sucesso." };
  }
  return httpClient.post<Contract>("/contracts", payload);
}

// ── PATCH /contracts/:id ────────────────────────────────────────────────────

export async function updateContract(
  contractId: string,
  payload: UpdateContractPayload,
): Promise<ApiResponse<Contract>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "CRIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "CRIADO");
    }
    const updated = mockStore.updateContract(contractId, payload);
    return { data: updated, message: "Contrato atualizado com sucesso." };
  }
  return httpClient.patch<Contract>(`/contracts/${contractId}`, payload);
}

// ── DELETE /contracts/:id ───────────────────────────────────────────────────

export async function deleteContract(contractId: string): Promise<ApiResponse<null>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "CRIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "CRIADO");
    }
    mockStore.removeContract(contractId);
    return { data: null, message: "Contrato excluído com sucesso." };
  }
  return httpClient.delete<null>(`/contracts/${contractId}`);
}

// ── GET /contracts/:id/events ───────────────────────────────────────────────

export async function getContractEvents(
  contractId: string,
): Promise<ApiResponse<ContractEvent[]>> {
  if (env.enableMocks) {
    return { data: mockStore.getEventsByContractId(contractId) };
  }
  return httpClient.get<ContractEvent[]>(`/contracts/${contractId}/events`);
}

// ── POST /contracts/:id/confirm-shipment ────────────────────────────────────

export async function confirmShipment(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "CRIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "CRIADO");
    }
    return persistAction(
      contractId,
      `evt-mock-ship-${Date.now()}`,
      "ENVIO_CONFIRMADO",
      "ENVIADO",
      `0xmock_ship_${Date.now().toString(16)}`,
      "FORNECEDOR",
      payload?.notes ?? "Envio confirmado pelo fornecedor.",
    );
  }
  return httpClient.post<ActionResult>(`/contracts/${contractId}/confirm-shipment`, payload);
}

// ── POST /contracts/:id/confirm-delivery ────────────────────────────────────

export async function confirmDelivery(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "ENVIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "ENVIADO");
    }
    return persistAction(
      contractId,
      `evt-mock-del-${Date.now()}`,
      "ENTREGA_CONFIRMADA",
      "ENTREGUE",
      `0xmock_del_${Date.now().toString(16)}`,
      "ENTREGADOR",
      payload?.notes ?? "Entrega confirmada pelo responsável logístico.",
    );
  }
  return httpClient.post<ActionResult>(`/contracts/${contractId}/confirm-delivery`, payload);
}

// ── POST /contracts/:id/validate-receipt ────────────────────────────────────

export async function validateReceipt(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "ENTREGUE") {
      MockErrors.invalidStatusTransition(contract!.status, "ENTREGUE");
    }
    return persistAction(
      contractId,
      `evt-mock-val-${Date.now()}`,
      "RECEBIMENTO_VALIDADO",
      "VALIDADO",
      `0xmock_val_${Date.now().toString(16)}`,
      "FISCAL",
      payload?.notes ?? "Recebimento validado pelo fiscal.",
    );
  }
  return httpClient.post<ActionResult>(`/contracts/${contractId}/validate-receipt`, payload);
}

// ── POST /contracts/:id/authorize-payment ───────────────────────────────────

export async function authorizePayment(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "VALIDADO") {
      MockErrors.invalidStatusTransition(contract!.status, "VALIDADO");
    }
    return persistAction(
      contractId,
      `evt-mock-pay-${Date.now()}`,
      "PAGAMENTO_AUTORIZADO",
      "PAGAMENTO_AUTORIZADO",
      `0xmock_pay_${Date.now().toString(16)}`,
      "GESTOR",
      payload?.notes ?? "Pagamento autorizado pelo gestor.",
    );
  }
  return httpClient.post<ActionResult>(`/contracts/${contractId}/authorize-payment`, payload);
}

// ── POST /contracts/:id/open-dispute ────────────────────────────────────────

export async function openDispute(
  contractId: string,
  payload: OpenDisputePayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status === "PAGAMENTO_AUTORIZADO") {
      MockErrors.invalidStatusTransition(
        contract!.status,
        "qualquer (exceto PAGAMENTO_AUTORIZADO)",
      );
    }
    if (!payload.reason) {
      MockErrors.validationError("reason", "O motivo da disputa é obrigatório.");
    }
    return persistAction(
      contractId,
      `evt-mock-disp-${Date.now()}`,
      "DISPUTA_ABERTA",
      "DISPUTA",
      `0x`,
      "FISCAL",
      `Disputa aberta: ${payload.reason}`,
    );
  }
  return httpClient.post<ActionResult>(`/contracts/${contractId}/open-dispute`, payload);
}

// ── POST /contracts/:id/simulate-fraud ──────────────────────────────────────

export async function simulateFraud(
  contractId: string,
  payload: SimulateFraudPayload,
): Promise<ApiResponse<SimulateFraudResult>> {
  if (env.enableMocks) {
    const contract = mockStore.getContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (!payload.newDocumentHash) {
      MockErrors.validationError(
        "newDocumentHash",
        "O hash do documento alterado é obrigatório.",
      );
    }

    const fraudDetected =
      !!contract!.documentHash && contract!.documentHash !== payload.newDocumentHash;

    if (!fraudDetected) {
      return {
        data: {
          id: contractId,
          status: contract!.status,
          fraudDetected: false,
          updatedAt: new Date().toISOString(),
          message: "Hashes idênticos. Nenhuma adulteração detectada.",
        },
      };
    }

    const now = new Date().toISOString();
    const fraudEventId = `evt-fraud-${Date.now()}`;
    const disputeEventId = `evt-disp-${Date.now() + 1}`;

    mockStore.updateContract(contractId, {
      status: "DISPUTA",
      documentHash: payload.newDocumentHash,
    });
    mockStore.addEvent({
      id: fraudEventId,
      contractId,
      eventType: "FRAUDE_SIMULADA",
      description: payload.reason ?? "Adulteração de documento detectada.",
      responsibleRole: "AUDITOR",
      statusBefore: contract!.status,
      statusAfter: "DISPUTA",
      documentHash: payload.newDocumentHash,
      createdAt: now,
    });
    mockStore.addEvent({
      id: disputeEventId,
      contractId,
      eventType: "DISPUTA_ABERTA",
      description: "Disputa aberta automaticamente após detecção de fraude.",
      responsibleRole: "AUDITOR",
      statusAfter: "DISPUTA",
      createdAt: now,
    });

    return {
      data: {
        id: contractId,
        status: "DISPUTA",
        fraudDetected: true,
        originalHash: contract!.documentHash,
        newHash: payload.newDocumentHash,
        updatedAt: now,
        events: [
          { id: fraudEventId, eventType: "FRAUDE_SIMULADA", createdAt: now },
          { id: disputeEventId, eventType: "DISPUTA_ABERTA", createdAt: now },
        ],
      },
      message:
        "Fraude detectada: hash do documento diverge do original. Disputa aberta automaticamente.",
    };
  }
  return httpClient.post<SimulateFraudResult>(`/contracts/${contractId}/simulate-fraud`, payload);
}
