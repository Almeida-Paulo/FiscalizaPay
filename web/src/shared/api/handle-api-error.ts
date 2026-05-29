import { HttpClientError } from "./http-client";

const FALLBACK_MESSAGE = "Não foi possível concluir a operação. Tente novamente.";

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof HttpClientError) {
    return error.apiError.message || FALLBACK_MESSAGE;
  }
  if (error instanceof Error) {
    return error.message || FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
