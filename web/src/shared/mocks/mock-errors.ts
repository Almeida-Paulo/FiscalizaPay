import type { ApiError } from "@/shared/types/api";
import { HttpClientError } from "@/shared/api/http-client";

export function mockError(code: ApiError["code"], message: string, details?: unknown): never {
  throw new HttpClientError({ message, code, details });
}

export const MockErrors = {
  notFound: (resource = "Recurso") =>
    mockError("NOT_FOUND", `${resource} não encontrado.`),

  invalidStatusTransition: (currentStatus: string, requiredStatus: string) =>
    mockError(
      "INVALID_STATUS_TRANSITION",
      `Esta ação requer que o contrato esteja no status ${requiredStatus}. Status atual: ${currentStatus}.`,
      { currentStatus, requiredStatus },
    ),

  unauthorizedRole: (requiredRole: string) =>
    mockError(
      "UNAUTHORIZED_ROLE",
      `Esta ação requer o perfil ${requiredRole}.`,
      { requiredRole },
    ),

  validationError: (field: string, message: string) =>
    mockError(
      "VALIDATION_ERROR",
      `Campo inválido: ${field}. ${message}`,
      { field },
    ),
};
