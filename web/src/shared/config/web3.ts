import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { polygonAmoy, sepolia } from "viem/chains";

/**
 * Wagmi v2 config via createConfig.
 *
 * Chain principal: Polygon Amoy (testnet oficial do MVP, chain ID 80002)
 * Chain fallback:  Sepolia (testnet Ethereum, chain ID 11155111)
 *
 * Connectors:
 * - injected: MetaMask e outras carteiras browser extension (sempre ativo)
 * - walletConnect: mobile wallets via QR code (ativo apenas se projectId for fornecido)
 *
 * NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
 * - Opcional para a demo/hackathon (MetaMask funciona sem ele)
 * - Obrigatório para conexão mobile via QR code em produção
 * - Obtenha gratuitamente em: https://cloud.walletconnect.com
 *
 * Por que createConfig e não getDefaultConfig do RainbowKit:
 * getDefaultConfig lança erro durante SSR/build se projectId for vazio.
 * createConfig funciona de forma segura sem projectId.
 */
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [polygonAmoy, sepolia],
  connectors: [
    injected(),
    ...(projectId ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [polygonAmoy.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
