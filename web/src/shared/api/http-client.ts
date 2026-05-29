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
}

async function request<T>(
  method: HttpMethod,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = `${env.apiUrl}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  const init: RequestInit = {
    method,
    headers,
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, init);

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return { data: null as T };
  }

  const json = await response.json();

  if (!response.ok) {
    const apiError = json as ApiError;
    throw new HttpClientError(apiError);
  }

  return json as ApiResponse<T>;
}

export const httpClient = {
  get<T>(path: string, options?: Pick<RequestOptions, "headers">) {
    return request<T>("GET", path, options);
  },

  post<T>(path: string, body?: unknown, options?: Pick<RequestOptions, "headers">) {
    return request<T>("POST", path, { ...options, body });
  },

  patch<T>(path: string, body?: unknown, options?: Pick<RequestOptions, "headers">) {
    return request<T>("PATCH", path, { ...options, body });
  },

  delete<T>(path: string, options?: Pick<RequestOptions, "headers">) {
    return request<T>("DELETE", path, options);
  },
};
