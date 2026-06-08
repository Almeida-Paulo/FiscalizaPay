"use client";

import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "../model/store";

type AuthSessionHydratorProps = {
  children: ReactNode;
};

export function AuthSessionHydrator({ children }: AuthSessionHydratorProps) {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return <>{children}</>;
}
