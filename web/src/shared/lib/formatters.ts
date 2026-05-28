/**
 * Formata um número como moeda BRL (Real Brasileiro).
 * Ex: 150000 → "R$ 150.000,00"
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Formata uma data ISO para o padrão brasileiro dd/mm/aaaa.
 * Ex: "2026-05-28T14:00:00.000Z" → "28/05/2026"
 */
export function formatDateBR(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("pt-BR");
}

/**
 * Formata uma data ISO para data e hora no padrão brasileiro.
 * Ex: "2026-05-28T14:00:00.000Z" → "28/05/2026 11:00"
 */
export function formatDateTimeBR(isoDate: string): string {
  return new Date(isoDate).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Encurta um endereço de carteira Ethereum.
 * Ex: "0x742d35Cc6634C0532925a3b8D4C9C35..." → "0x742d...C9C35"
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address ?? "";
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

/**
 * Encurta um hash (documentHash ou transactionHash).
 * Ex: "abc123def456..." → "abc123...456abc"
 */
export function shortenHash(hash: string, chars = 6): string {
  if (!hash || hash.length <= chars * 2) return hash ?? "";
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}

/**
 * Formata um valor monetário compacto para exibição em cards.
 * Ex: 1500000 → "R$ 1,5M" | 150000 → "R$ 150K"
 */
export function formatCurrencyCompact(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
