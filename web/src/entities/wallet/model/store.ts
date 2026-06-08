import { create } from "zustand";
import { OFFICIAL_CHAIN_ID } from "./types";
import { env } from "@/shared/config/env";

// Este store é apenas visual/demo. A conexão real de wallet será integrada
// futuramente via wagmi + MetaMask + RainbowKit. Nenhum dado aqui é persistido on-chain.

const MOCK_WALLET = {
  address: "0x8888888888888888888888888888888888888888",
  chainId: OFFICIAL_CHAIN_ID,
  networkName: "Sepolia",
} as const;

interface WalletState {
  address: string | null;
  chainId: number | null;
  networkName: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connectMockWallet: () => void;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  address: null,
  chainId: null,
  networkName: null,
  isConnected: false,
  isCorrectNetwork: false,
  connectMockWallet: () =>
    set({
      address: MOCK_WALLET.address,
      chainId: MOCK_WALLET.chainId,
      networkName: MOCK_WALLET.networkName,
      isConnected: true,
      isCorrectNetwork: MOCK_WALLET.chainId === (env.chainId || OFFICIAL_CHAIN_ID),
    }),
  disconnectWallet: () =>
    set({
      address: null,
      chainId: null,
      networkName: null,
      isConnected: false,
      isCorrectNetwork: false,
    }),
}));
