const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";

function normalizeApiBaseUrl(value?: string): string {
  const rawValue = value?.trim() || DEFAULT_API_BASE_URL;

  if (rawValue.startsWith("/")) {
    return rawValue.replace(/\/+$/, "");
  }

  const normalizedValue = rawValue.replace(/\/+$/, "");

  if (/^https?:\/\//i.test(normalizedValue)) {
    return normalizedValue;
  }

  if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?(\/.*)?$/i.test(normalizedValue)) {
    return `http://${normalizedValue}`;
  }

  return `https://${normalizedValue}`;
}

export const env = {
  // NEXT_PUBLIC_API_BASE_URL takes precedence; NEXT_PUBLIC_API_URL kept for backward compat
  apiBaseUrl: normalizeApiBaseUrl(
    process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.NEXT_PUBLIC_API_URL,
  ),
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 11155111),
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "",
  // Either USE_MOCKS or ENABLE_MOCKS must be "false" to disable mocks; default is true
  useMocks:
    process.env.NEXT_PUBLIC_USE_MOCKS !== "false" &&
    process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false",
  explorerUrl:
    process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://sepolia.etherscan.io",
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
} as const;
