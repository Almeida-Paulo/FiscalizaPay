import { env } from "@/shared/config/env";
import { httpClient } from "./http-client";
import type { ApiResponse } from "@/shared/types/api";
import type { DashboardSummary } from "@/entities/contract";
import { mockDashboardSummary } from "@/shared/mocks";

export async function getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
  if (env.enableMocks) {
    return { data: mockDashboardSummary };
  }
  return httpClient.get<DashboardSummary>("/dashboard/summary");
}
