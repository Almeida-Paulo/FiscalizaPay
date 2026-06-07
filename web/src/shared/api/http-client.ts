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

async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${env.apiBaseUrl}${path}`;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

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

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return { data: null as T };
    }

    const text = await response.text();

    if (!text) {
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
