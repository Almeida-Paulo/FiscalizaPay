# FiscalizaPay — Smart Contracts

Projeto Hardhat 3 (TypeScript + viem) com o contrato `FiscalizaPayRegistry`: um
registro on-chain, público e imutável, do hash do documento de contratos de
fiscalização de pagamentos públicos auditados pelo FiscalizaPay.

Rede alvo: **Polygon Amoy** (testnet, chainId `80002`, explorer
[amoy.polygonscan.com](https://amoy.polygonscan.com)) — a mesma já configurada
no restante do projeto (`backend/.env` → `CHAIN_ID=80002`).

## Estrutura

```
contracts/FiscalizaPayRegistry.sol   contrato principal
test/FiscalizaPayRegistry.ts         testes (node:test + viem)
ignition/modules/                    módulo de deploy (Hardhat Ignition)
hardhat.config.ts                    config (rede amoy, perfis do compilador)
```

## O contrato

`FiscalizaPayRegistry` é `Ownable` (OpenZeppelin v5): só o `owner` (a wallet
operadora do backend) pode chamar `registerContract(contractId, documentHash)`.
Cada `contractId` (= `keccak256(contract_number)`) só pode ser registrado uma
única vez — não existe função de update, o registro é imutável por design.
Toda escrita emite o evento `ContractRegistered(contractId, documentHash,
registeredBy, timestamp)`, e os dados podem ser lidos via `getRecord` /
`isRegistered` (funções `view`, sem custo de gas).

A checagem de papel/usuário (GESTOR + wallet vinculada ao contrato) já acontece
no backend antes de chamar este contrato; o `onlyOwner` é uma camada extra de
defesa caso o endereço do contrato seja descoberto por terceiros.

## Comandos

```bash
npm install        # instala dependências
npm run compile    # compila o contrato (hardhat compile)
npm test           # roda os testes unitários (rede local simulada)
```

## Configuração de segredos (RPC URL e chave privada)

**Nunca** cole chave privada, seed phrase ou mnemonic em arquivos versionados,
no chat ou em commits. Este projeto usa o sistema `configVariable` do
Hardhat 3 (veja `hardhat.config.ts`), que aceita dois jeitos seguros de
fornecer segredos — escolha um:

### Opção 1 — Keystore criptografado do Hardhat (recomendado)

Guarda os valores criptografados em disco (`.hardhat-keystore`, já no
`.gitignore`), protegidos por senha que você escolhe na hora:

```bash
npx hardhat keystore set AMOY_RPC_URL
npx hardhat keystore set DEPLOYER_PRIVATE_KEY
# opcional, só se for verificar o source no explorer:
npx hardhat keystore set POLYGONSCAN_API_KEY
```

### Opção 2 — Variáveis de ambiente no shell

Defina as variáveis na sessão do terminal antes de rodar os comandos
(nunca em um `.env` commitado — use `.env.example` apenas como referência
de quais nomes são esperados):

```powershell
$env:AMOY_RPC_URL = "https://..."
$env:DEPLOYER_PRIVATE_KEY = "0x..."
```

## Preparando a wallet operadora (passo a passo)

A mesma wallet que faz o deploy se torna o `owner` do contrato **e** é a
wallet que o backend usa como "relayer" para assinar e enviar as transações
de registro (veja a decisão de arquitetura no plano da sessão). Por isso:

1. Crie uma wallet nova (ex.: nova conta no MetaMask) — dedicada a esse papel,
   separada de wallets pessoais
2. Pegue MATIC/POL de teste no faucet oficial da Polygon Amoy para essa wallet
   (necessário para pagar gas dos deploys e dos registros)
3. Anote o **endereço público** dessa wallet — ele vai para `OPERATOR_ADDRESS`
   no `.env` do backend (não é segredo)
4. Configure `DEPLOYER_PRIVATE_KEY` (a chave privada dessa mesma wallet) e
   `AMOY_RPC_URL` usando uma das opções de segredo acima

## Deploy na Polygon Amoy

```bash
npx hardhat ignition deploy ignition/modules/FiscalizaPayRegistry.ts --network amoy
```

A saída mostra o **endereço do contrato implantado** — esse valor (público)
deve ser copiado para `CONTRACT_ADDRESS` em `backend/.env` e
`NEXT_PUBLIC_CONTRACT_ADDRESS` em `web/.env.local`.

Os registros de deploy ficam em `ignition/deployments/<network>/` (permite
re-executar o módulo sem reimplantar — o Ignition detecta o que já foi feito).

## Verificação do source no explorer (opcional)

Com `POLYGONSCAN_API_KEY` configurada:

```bash
npx hardhat verify --network amoy <endereço-do-contrato> <endereço-do-owner>
```

## Testes

Os testes (`test/FiscalizaPayRegistry.ts`) rodam em uma rede local simulada
(Hardhat Network via EDR) e cobrem:

- deployer vira `owner`
- registro com sucesso + emissão do evento `ContractRegistered`
- leitura de registros existentes e inexistentes (`getRecord`/`isRegistered`)
- bloqueio de registro duplicado (`AlreadyRegistered`, registro imutável)
- isolamento entre `contractId`s diferentes
- bloqueio de chamada por conta que não é `owner` (`OwnableUnauthorizedAccount`)
- timestamp do registro corresponde ao timestamp do bloco minerado
