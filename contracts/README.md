# FiscalizaPay - Smart Contracts

Projeto Hardhat 3 (TypeScript + viem) com o contrato `FiscalizaPayRegistry`: um
registro on-chain, publico e imutavel, do hash do documento de contratos de
fiscalizacao de pagamentos publicos auditados pelo FiscalizaPay.

## Rede atual

Rede atual documentada: **Sepolia**  
Chain ID: `11155111`  
Explorer: `https://sepolia.etherscan.io`

Contrato deployado:

```txt
FiscalizaPayRegistry
0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
https://sepolia.etherscan.io/address/0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
```

O Hardhat tambem mantem configuracao para Polygon Amoy como alternativa/fallback.

## Estrutura

```txt
contracts/FiscalizaPayRegistry.sol   contrato principal
test/FiscalizaPayRegistry.ts         testes (node:test + viem)
ignition/modules/                    modulo de deploy (Hardhat Ignition)
hardhat.config.ts                    config (sepolia/amoy, perfis do compilador)
ignition/deployments/chain-11155111/ artefato do deploy Sepolia
```

## O contrato

`FiscalizaPayRegistry` e `Ownable` (OpenZeppelin v5): so o `owner` (a wallet
operadora/deployer) pode chamar `registerContract(contractId, documentHash)`.
Cada `contractId` so pode ser registrado uma unica vez. No backend atual, esse
`contractId` e `keccak256` do UUID interno do contrato, para manter estabilidade
mesmo se o numero administrativo for corrigido. Nao existe funcao de update; o
registro e imutavel por design.

Toda escrita emite o evento:

```solidity
ContractRegistered(contractId, documentHash, registeredBy, timestamp)
```

Os dados podem ser lidos via `getRecord` e `isRegistered`.

## Comandos

```bash
npm install
npm run compile
npm test
```

## Segredos

Nunca cole chave privada, seed phrase ou mnemonic em arquivos versionados, no
chat ou em commits. Use o keystore do Hardhat ou variaveis de ambiente locais.

Keystore recomendado:

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set DEPLOYER_PRIVATE_KEY
```

Ou variaveis de ambiente no PowerShell:

```powershell
$env:SEPOLIA_RPC_URL = "https://..."
$env:DEPLOYER_PRIVATE_KEY = "0x..."
```

## Deploy Sepolia

```bash
npx hardhat ignition deploy ignition/modules/FiscalizaPayRegistry.ts --network sepolia
```

A saida mostra o endereco do contrato implantado. Esse valor publico deve ser
copiado para:

```txt
backend/.env      -> CONTRACT_ADDRESS
backend/.env      -> RPC_URL, OPERATOR_PRIVATE_KEY, BLOCKCHAIN_ENABLED=true
web/.env.local    -> NEXT_PUBLIC_CONTRACT_ADDRESS
```

## Verificacao no explorer

Com chave de API do explorer configurada:

```bash
npx hardhat verify --network sepolia <endereco-do-contrato> <endereco-do-owner>
```

## Estado da integracao

O contrato esta deployado e o backend possui integracao Web3 para escrita
runtime. Por padrao, a demo mantem `BLOCKCHAIN_ENABLED=false` para evitar
dependencia de faucet, saldo e transacoes ao vivo. Para teste ponta a ponta,
habilite `BLOCKCHAIN_ENABLED=true`, configure RPC Sepolia, chave da wallet owner
em `OPERATOR_PRIVATE_KEY` e saldo suficiente para gas.

## Testes

Os testes (`test/FiscalizaPayRegistry.ts`) rodam em uma rede local simulada e
cobrem:

- deployer vira `owner`;
- registro com sucesso e emissao do evento `ContractRegistered`;
- leitura de registros existentes e inexistentes (`getRecord`/`isRegistered`);
- bloqueio de registro duplicado (`AlreadyRegistered`);
- isolamento entre `contractId`s diferentes;
- bloqueio de chamada por conta que nao e `owner`;
- timestamp do registro corresponde ao timestamp do bloco minerado.
