/** Formato padrão de resposta de sucesso da API */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Códigos de erro oficiais da API */
export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "INVALID_STATUS_TRANSITION"
  | "UNAUTHORIZED_ROLE"
  | "BLOCKCHAIN_ERROR"
  | "INTERNAL_ERROR";

/** Formato padrão de resposta de erro da API */
export interface ApiError {
  message: string;
  code: ApiErrorCode;
  details?: unknown;
}

/**
 * Resposta paginada — utilitário para endpoints que suportarão paginação futura.
 * O contrato API do MVP não usa paginação ainda; reservado para pós-MVP.
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
