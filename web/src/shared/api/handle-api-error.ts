import { HttpClientError } from "./http-client";

const FALLBACK_MESSAGE = "Nao foi possivel concluir a operacao. Tente novamente.";

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof HttpClientError) {
    if (error.apiError.statusCode === 400 || error.apiError.statusCode === 422) {
      return error.apiError.message || "Dados invalidos. Revise as informacoes enviadas.";
    }
    if (error.apiError.statusCode === 401) {
      return "Sessao invalida. Faca login novamente.";
    }
    if (error.apiError.statusCode === 403) {
      if (error.apiError.message.toLowerCase().includes("wallet autenticada")) {
        return "Carteira autenticada, mas sem perfil cadastrado.";
      }
      return "Voce nao tem permissao para executar esta acao.";
    }
    if (error.apiError.statusCode && error.apiError.statusCode >= 500) {
      return "Erro interno no servidor. Tente novamente em instantes.";
    }
    return error.apiError.message || FALLBACK_MESSAGE;
  }
  if (error instanceof Error) {
    return error.message || FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
