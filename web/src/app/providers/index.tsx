"use client";

import { Web3Provider } from "./web3-provider";
import { ToastProvider } from "./toast-provider";

/**
 * RootProviders — provider raiz da aplicação.
 *
 * Composição de providers:
 *   Web3Provider
 *     └── WagmiProvider (wagmi v2)
 *         └── QueryProvider (TanStack Query)
 *             └── RainbowKitProvider
 *                 └── {children}
 *   ToastProvider (Sonner — portal, não precisa envolver children)
 *
 * Usado em app/layout.tsx para envolver toda a aplicação sem
 * transformar o layout em Client Component.
 */
interface RootProvidersProps {
  children: React.ReactNode;
}

export function RootProviders({ children }: RootProvidersProps) {
  return (
    <Web3Provider>
      {children}
      <ToastProvider />
    </Web3Provider>
  );
}
