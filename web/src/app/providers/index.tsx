"use client";

import { Web3Provider } from "./web3-provider";
import { ToastProvider } from "./toast-provider";
import { TooltipProvider } from "@/shared/ui/tooltip";

/**
 * RootProviders — provider raiz da aplicação.
 *
 * Composição de providers:
 *   Web3Provider
 *     └── WagmiProvider (wagmi v2)
 *         └── QueryProvider (TanStack Query)
 *             └── RainbowKitProvider
 *                 └── TooltipProvider (shadcn/ui)
 *                     └── {children}
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
      <TooltipProvider delayDuration={300}>
        {children}
      </TooltipProvider>
      <ToastProvider />
    </Web3Provider>
  );
}
