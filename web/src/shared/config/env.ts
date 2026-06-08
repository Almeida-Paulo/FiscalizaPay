export const env = {
  // NEXT_PUBLIC_API_BASE_URL takes precedence; NEXT_PUBLIC_API_URL kept for backward compat
  apiBaseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:8000",
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
