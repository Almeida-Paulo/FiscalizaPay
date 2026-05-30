import { SUPPORTED_NETWORKS, OFFICIAL_CHAIN_ID } from "./types";

export function isExpectedChain(chainId: number | null): boolean {
  return chainId === OFFICIAL_CHAIN_ID;
}

export function getNetworkLabel(chainId: number | null): string {
  if (!chainId) return "Não detectada";
  const network = SUPPORTED_NETWORKS.find((n) => n.chainId === chainId);
  return network?.name ?? `Chain ${chainId}`;
}

export function getExplorerAddressUrl(explorerUrl: string, address: string): string {
  return `${explorerUrl}/address/${address}`;
}
