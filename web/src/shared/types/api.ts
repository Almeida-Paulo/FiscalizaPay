/** Formato padrão de resposta de sucesso da API */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Formato padrão de resposta de erro da API */
export interface ApiError {
  message: string;
  code:
    | "VALIDATION_ERROR"
    | "NOT_FOUND"
    | "INVALID_STATUS_TRANSITION"
    | "UNAUTHORIZED_ROLE"
    | "BLOCKCHAIN_ERROR"
    | "INTERNAL_ERROR";
  details?: unknown;
}
