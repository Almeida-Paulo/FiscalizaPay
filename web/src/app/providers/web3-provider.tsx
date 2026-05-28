"use client";

import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import { wagmiConfig } from "@/shared/config/web3";
import { QueryProvider } from "./query-provider";

/**
 * Ordem correta para wagmi v2 + RainbowKit v2:
 * WagmiProvider → QueryClientProvider → RainbowKitProvider
 *
 * WagmiProvider precisa ser o mais externo.
 * QueryClientProvider precisa estar dentro do WagmiProvider
 * (wagmi v2 usa React Query internamente).
 * RainbowKitProvider precisa estar dentro do QueryClientProvider.
 */

interface Web3ProviderProps {
  children: React.ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryProvider>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#22D3EE",           // primary FiscalizaPay
            accentColorForeground: "#050816",  // background escuro
            borderRadius: "medium",
            fontStack: "system",
            overlayBlur: "small",
          })}
          locale="pt-BR"
        >
          {children}
        </RainbowKitProvider>
      </QueryProvider>
    </WagmiProvider>
  );
}
