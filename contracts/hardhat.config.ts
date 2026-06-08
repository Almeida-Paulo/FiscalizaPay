import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatIgnitionViemPlugin from "@nomicfoundation/hardhat-ignition-viem";
import { configVariable, defineConfig } from "hardhat/config";

/**
 * Segredos (RPC URL e chave privada) NUNCA ficam em texto plano neste arquivo
 * nem em .env versionado. `configVariable` le de variaveis de ambiente OU do
 * keystore criptografado do Hardhat (`npx hardhat keystore set <NOME>`).
 *
 * Veja README.md para o passo a passo de configuracao local.
 */
export default defineConfig({
  plugins: [hardhatToolboxViemPlugin, hardhatIgnitionViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    amoy: {
      type: "http",
      chainType: "l1",
      url: configVariable("AMOY_RPC_URL"),
      accounts: [configVariable("DEPLOYER_PRIVATE_KEY")],
      chainId: 80002,
    },
  },
});
