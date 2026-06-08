/** Redes de blockchain conhecidas */
export interface WalletNetwork {
  chainId: number;
  name: string;
  explorerUrl: string;
}

/** Estado da carteira conectada no frontend */
export interface WalletInfo {
  address: string;
  chainId?: number;
  chainName?: string;
  isConnected: boolean;
  isCorrectNetwork?: boolean;
}

/** Redes suportadas pelo projeto */
export const SUPPORTED_NETWORKS: WalletNetwork[] = [
  {
    chainId: 11155111,
    name: "Sepolia",
    explorerUrl: "https://sepolia.etherscan.io",
  },
  {
    chainId: 80002,
    name: "Polygon Amoy",
    explorerUrl: "https://amoy.polygonscan.com",
  },
];

/** Chain ID oficial do MVP */
export const OFFICIAL_CHAIN_ID = 11155111;
