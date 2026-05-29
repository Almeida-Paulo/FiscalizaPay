import { env } from "@/shared/config/env";
import { httpClient } from "./http-client";
import type { ApiResponse } from "@/shared/types/api";
import type { Contract } from "@/entities/contract";
import type { ContractEvent } from "@/entities/contract-event";
import type {
  CreateContractPayload,
  UpdateContractPayload,
  ContractActionPayload,
  OpenDisputePayload,
  SimulateFraudPayload,
} from "@/entities/contract/model/api-types";
import {
  mockContracts,
  getMockContractById,
  getMockEventsByContractId,
} from "@/shared/mocks";
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

function mockActionResult(
  contractId: string,
  eventId: string,
  eventType: ContractEvent["eventType"],
  newStatus: Contract["status"],
  txHash: string,
): ApiResponse<ActionResult> {
  const now = new Date().toISOString();
  return {
    data: {
      id: contractId,
      status: newStatus,
      updatedAt: now,
      event: {
        id: eventId,
        eventType,
        transactionHash: txHash,
        createdAt: now,
      },
    },
  };
}

// ── GET /contracts ──────────────────────────────────────────────────────────

export async function getContracts(): Promise<ApiResponse<Contract[]>> {
  if (env.enableMocks) {
    return { data: mockContracts };
  }
  return httpClient.get<Contract[]>("/contracts");
}

// ── GET /contracts/:id ──────────────────────────────────────────────────────

export async function getContractById(contractId: string): Promise<ApiResponse<Contract>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
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
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "CRIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "CRIADO");
    }
    const updated: Contract = {
      ...contract!,
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return { data: updated, message: "Contrato atualizado com sucesso." };
  }
  return httpClient.patch<Contract>(`/contracts/${contractId}`, payload);
}

// ── DELETE /contracts/:id ───────────────────────────────────────────────────

export async function deleteContract(contractId: string): Promise<ApiResponse<null>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "CRIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "CRIADO");
    }
    return { data: null, message: "Contrato excluído com sucesso." };
  }
  return httpClient.delete<null>(`/contracts/${contractId}`);
}

// ── GET /contracts/:id/events ───────────────────────────────────────────────

export async function getContractEvents(
  contractId: string,
): Promise<ApiResponse<ContractEvent[]>> {
  if (env.enableMocks) {
    const events = getMockEventsByContractId(contractId);
    return { data: events };
  }
  return httpClient.get<ContractEvent[]>(`/contracts/${contractId}/events`);
}

// ── POST /contracts/:id/confirm-shipment ────────────────────────────────────

export async function confirmShipment(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "CRIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "CRIADO");
    }
    return mockActionResult(
      contractId,
      `evt-mock-ship-${Date.now()}`,
      "ENVIO_CONFIRMADO",
      "ENVIADO",
      `0xmock_ship_${Date.now().toString(16)}`,
    );
  }
  return httpClient.post<ActionResult>(
    `/contracts/${contractId}/confirm-shipment`,
    payload,
  );
}

// ── POST /contracts/:id/confirm-delivery ────────────────────────────────────

export async function confirmDelivery(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "ENVIADO") {
      MockErrors.invalidStatusTransition(contract!.status, "ENVIADO");
    }
    return mockActionResult(
      contractId,
      `evt-mock-del-${Date.now()}`,
      "ENTREGA_CONFIRMADA",
      "ENTREGUE",
      `0xmock_del_${Date.now().toString(16)}`,
    );
  }
  return httpClient.post<ActionResult>(
    `/contracts/${contractId}/confirm-delivery`,
    payload,
  );
}

// ── POST /contracts/:id/validate-receipt ────────────────────────────────────

export async function validateReceipt(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "ENTREGUE") {
      MockErrors.invalidStatusTransition(contract!.status, "ENTREGUE");
    }
    return mockActionResult(
      contractId,
      `evt-mock-val-${Date.now()}`,
      "RECEBIMENTO_VALIDADO",
      "VALIDADO",
      `0xmock_val_${Date.now().toString(16)}`,
    );
  }
  return httpClient.post<ActionResult>(
    `/contracts/${contractId}/validate-receipt`,
    payload,
  );
}

// ── POST /contracts/:id/authorize-payment ───────────────────────────────────

export async function authorizePayment(
  contractId: string,
  payload?: ContractActionPayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status !== "VALIDADO") {
      MockErrors.invalidStatusTransition(contract!.status, "VALIDADO");
    }
    return mockActionResult(
      contractId,
      `evt-mock-pay-${Date.now()}`,
      "PAGAMENTO_AUTORIZADO",
      "PAGAMENTO_AUTORIZADO",
      `0xmock_pay_${Date.now().toString(16)}`,
    );
  }
  return httpClient.post<ActionResult>(
    `/contracts/${contractId}/authorize-payment`,
    payload,
  );
}

// ── POST /contracts/:id/open-dispute ────────────────────────────────────────

export async function openDispute(
  contractId: string,
  payload: OpenDisputePayload,
): Promise<ApiResponse<ActionResult>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (contract!.status === "PAGAMENTO_AUTORIZADO") {
      MockErrors.invalidStatusTransition(contract!.status, "qualquer (exceto PAGAMENTO_AUTORIZADO)");
    }
    if (!payload.reason) {
      MockErrors.validationError("reason", "O motivo da disputa é obrigatório.");
    }
    return mockActionResult(
      contractId,
      `evt-mock-disp-${Date.now()}`,
      "DISPUTA_ABERTA",
      "DISPUTA",
      `0x`,
    );
  }
  return httpClient.post<ActionResult>(
    `/contracts/${contractId}/open-dispute`,
    payload,
  );
}

// ── POST /contracts/:id/simulate-fraud ──────────────────────────────────────

export async function simulateFraud(
  contractId: string,
  payload: SimulateFraudPayload,
): Promise<ApiResponse<SimulateFraudResult>> {
  if (env.enableMocks) {
    const contract = getMockContractById(contractId);
    if (!contract) MockErrors.notFound("Contrato");
    if (!payload.newDocumentHash) {
      MockErrors.validationError("newDocumentHash", "O hash do documento alterado é obrigatório.");
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
    return {
      data: {
        id: contractId,
        status: "DISPUTA",
        fraudDetected: true,
        originalHash: contract!.documentHash,
        newHash: payload.newDocumentHash,
        updatedAt: now,
        events: [
          { id: `evt-fraud-${Date.now()}`, eventType: "FRAUDE_SIMULADA", createdAt: now },
          { id: `evt-disp-${Date.now()}`, eventType: "DISPUTA_ABERTA", createdAt: now },
        ],
      },
      message: "Fraude detectada: hash do documento diverge do original. Disputa aberta automaticamente.",
    };
  }
  return httpClient.post<SimulateFraudResult>(
    `/contracts/${contractId}/simulate-fraud`,
    payload,
  );
}
