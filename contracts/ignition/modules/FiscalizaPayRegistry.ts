import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Implanta o FiscalizaPayRegistry definindo a propria conta deployer
 * (accounts[0] da rede configurada, ex: AMOY_DEPLOYER) como `owner`.
 *
 * Essa mesma conta e a "wallet operadora" usada pelo backend para assinar
 * e enviar as transacoes de `registerContract`, entao owner == operador
 * faz sentido: somente quem opera o backend pode gravar registros.
 */
export default buildModule("FiscalizaPayRegistryModule", (m) => {
  const initialOwner = m.getAccount(0);

  const registry = m.contract("FiscalizaPayRegistry", [initialOwner]);

  return { registry };
});
