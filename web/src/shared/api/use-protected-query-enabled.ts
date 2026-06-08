"use client";

import { useAuthStore } from "@/entities/auth/model/store";
import { env } from "@/shared/config/env";

export function useProtectedQueryEnabled(baseEnabled = true): boolean {
  const accessToken = useAuthStore((state) => state.accessToken);

  return baseEnabled && (env.useMocks || !!accessToken);
}
