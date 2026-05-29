import { env } from "@/shared/config/env";
import { httpClient } from "./http-client";
import type { ApiResponse } from "@/shared/types/api";
import type { DashboardSummary } from "@/entities/contract";
import { mockStore } from "@/shared/mocks/mock-store";

export async function getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
  if (env.enableMocks) {
    return { data: mockStore.getDashboardSummary() };
  }
  return httpClient.get<DashboardSummary>("/dashboard/summary");
}
