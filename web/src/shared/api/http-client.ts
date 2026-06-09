import { useAuthStore } from "@/entities/auth/model/store";
import { env } from "@/shared/config/env";
import type { ApiResponse, ApiError } from "@/shared/types/api";

export type { ApiResponse, ApiError };

export class HttpClientError extends Error {
  constructor(public readonly apiError: ApiError) {
    super(apiError.message);
    this.name = "HttpClientError";
  }
}

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

interface RequestOptions {
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 10_000;

// Endpoints publicos nunca recebem Bearer token.
const PUBLIC_API_PATHS = new Set([
  "/health",
  "/auth/nonce",
  "/auth/verify",
]);

function getPathname(path: string): string {
  try {
    return new URL(path, env.apiBaseUrl).pathname;
  } catch {
    return path.split("?")[0] || path;
  }
}

function isPublicApiPath(path: string): boolean {
  return PUBLIC_API_PATHS.has(getPathname(path));
}

function findAuthorizationHeaderKey(headers: Record<string, string>): string | null {
  return (
    Object.keys(headers).find(
      (headerName) => headerName.toLowerCase() === "authorization",
    ) ?? null
  );
}

function removeAuthorizationHeader(headers: Record<string, string>): void {
  const authorizationHeaderKey = findAuthorizationHeaderKey(headers);

  if (authorizationHeaderKey) {
    delete headers[authorizationHeaderKey];
  }
}

function buildHeaders(
  path: string,
  optionsHeaders: Record<string, string> = {},
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...optionsHeaders,
  };

  if (env.useMocks || isPublicApiPath(path)) {
    removeAuthorizationHeader(headers);
    return headers;
  }

  if (findAuthorizationHeaderKey(headers)) {
    return headers;
  }

  // Em modo API real, rotas protegidas usam o JWT obtido via assinatura da wallet.
  const accessToken = useAuthStore.getState().accessToken?.trim();

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
}

function buildResponseError(
  response: Response,
  fallback?: Partial<ApiError>,
): ApiError {
  return {
    message: fallback?.message || "Nao foi possivel concluir a operacao.",
    code: fallback?.code || "INTERNAL_ERROR",
    details: fallback?.details,
    statusCode: response.status,
  };
}

function clearSessionOnUnauthorized(path: string, response: Response): void {
  // 401 em rota protegida invalida a sessao local para evitar UI autenticada falsa.
  if (response.status === 401 && !env.useMocks && !isPublicApiPath(path)) {
    useAuthStore.getState().clearSession();
  }
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl}${path}`;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers = buildHeaders(path, options.headers);

  const init: RequestInit = {
    method,
    headers,
    signal: controller.signal,
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, init);

    // Alguns endpoints podem retornar corpo vazio; o cliente ainda preserva o envelope.
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      if (!response.ok) {
        clearSessionOnUnauthorized(path, response);
        throw new HttpClientError(buildResponseError(response));
      }
      return { data: null as T };
    }

    const text = await response.text();

    if (!text) {
      if (!response.ok) {
        clearSessionOnUnauthorized(path, response);
        throw new HttpClientError(buildResponseError(response));
      }
      return { data: null as T };
    }

    let json: unknown;
    try {
      json = JSON.parse(text);
    } catch {
      throw new HttpClientError({
        message: "Resposta inválida do servidor.",
        code: "INTERNAL_ERROR",
      });
    }

    if (!response.ok) {
      const apiError = json as ApiError;
      clearSessionOnUnauthorized(path, response);
      throw new HttpClientError({ ...apiError, statusCode: response.status });
    }

    return json as ApiResponse<T>;
  } catch (error) {
    if (error instanceof HttpClientError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new HttpClientError({
        message: "Tempo limite da requisição excedido. Verifique sua conexão.",
        code: "INTERNAL_ERROR",
      });
    }

    throw new HttpClientError({
      message: "Erro de conexão com o servidor.",
      code: "INTERNAL_ERROR",
    });
  } finally {
    clearTimeout(timeout);
  }
}

export const httpClient = {
  get<T>(path: string, options?: Pick<RequestOptions, "headers" | "timeoutMs">) {
    return request<T>("GET", path, options);
  },

  post<T>(path: string, body?: unknown, options?: Pick<RequestOptions, "headers" | "timeoutMs">) {
    return request<T>("POST", path, { ...options, body });
  },

  patch<T>(path: string, body?: unknown, options?: Pick<RequestOptions, "headers" | "timeoutMs">) {
    return request<T>("PATCH", path, { ...options, body });
  },

  delete<T>(path: string, options?: Pick<RequestOptions, "headers" | "timeoutMs">) {
    return request<T>("DELETE", path, options);
  },
};
