"use client";

import { useEffect, type ReactNode } from "react";

import { env } from "@/shared/config/env";
import { refreshAuthenticatedProfile } from "../model/session";
import { useAuthStore } from "../model/store";

type AuthSessionHydratorProps = {
  children: ReactNode;
};

export function AuthSessionHydrator({ children }: AuthSessionHydratorProps) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
    if (!env.useMocks && useAuthStore.getState().accessToken) {
      void refreshAuthenticatedProfile({ ignoreMissingToken: true }).catch(() => undefined);
    }
  }, [hydrate]);

  return <>{children}</>;
}
