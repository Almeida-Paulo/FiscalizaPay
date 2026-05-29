export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  chainId: Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 80002),
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "",
  enableMocks: process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false",
  explorerUrl:
    process.env.NEXT_PUBLIC_EXPLORER_URL ?? "https://amoy.polygonscan.com",
  walletConnectProjectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
} as const;
