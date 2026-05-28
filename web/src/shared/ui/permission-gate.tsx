import type { ReactNode } from "react";

interface PermissionGateProps {
  /** Se true, renderiza children. Se false, renderiza fallback ou null. */
  allowed: boolean;
  children: ReactNode;
  /** Conteúdo alternativo quando a permissão é negada. */
  fallback?: ReactNode;
}

/**
 * Wrapper visual de permissão.
 * Controla apenas a exibição de elementos na interface.
 * O backend continua sendo a fonte definitiva de autorização.
 */
export function PermissionGate({
  allowed,
  children,
  fallback = null,
}: PermissionGateProps) {
  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}
