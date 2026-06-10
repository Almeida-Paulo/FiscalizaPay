# FiscalizaPay

FiscalizaPay e uma plataforma Web3 para fiscalizacao de contratos publicos antes da liberacao de pagamento. O sistema cria uma trilha auditavel de contratos, etapas, responsaveis, wallets, hashes de documentos e disputas, reduzindo o risco de pagamento sem validacao.

## Problema

Contratos publicos podem envolver documentos dispersos, validacoes manuais e auditoria tardia. Quando uma entrega e paga antes de ser comprovada, o prejuizo ja aconteceu. O FiscalizaPay ataca esse problema com fluxo sequencial, historico consultavel e prova criptografica de integridade documental.

## Solucao

O MVP cobre cinco etapas principais:

1. Gestor cria o contrato.
2. Fornecedor confirma envio ou execucao.
3. Entregador confirma entrega.
4. Fiscal valida recebimento.
5. Gestor autoriza pagamento.

Quando ha divergencia de hash ou problema operacional, gestor, fiscal ou auditor podem abrir disputa. A disputa bloqueia o pagamento e fica registrada na timeline.

## Participantes

| Perfil | Papel |
| --- | --- |
| Gestor | Cria contratos, autoriza pagamentos e registra hash on-chain quando habilitado. |
| Fornecedor | Confirma envio ou execucao. |
| Entregador | Confirma entrega. |
| Fiscal | Valida recebimento e pode abrir disputa. |
| Auditor | Consulta historico, audita hashes e pode abrir disputa. |

## Arquitetura

```txt
web/        Frontend Next.js, wallet, dashboard, timeline e demo
backend/    API FastAPI, PostgreSQL, JWT, regras de negocio e auditoria
contracts/  Smart contract Solidity/Hardhat para registro on-chain de hashes
Docs/       Documentacao de produto, demo, tecnologia e avaliacao
```

## On-chain vs off-chain

On-chain:
- `contractId`;
- `documentHash`;
- endereco que registrou;
- timestamp do bloco;
- evento `ContractRegistered`.

Off-chain:
- dados completos do contrato;
- orgao, fornecedor, valor, prazos e responsaveis;
- perfis e wallets vinculadas;
- eventos de fluxo;
- disputas e motivos;
- nonces de autenticacao;
- documentos completos ou evidencias sensiveis.

Essa separacao evita publicar dados sensiveis na blockchain e usa o contrato apenas como prova de integridade.

## Blockchain

Contrato: `FiscalizaPayRegistry`

Rede atual documentada: Sepolia

Chain ID: `11155111`

Endereco: `0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`

Explorer: `https://sepolia.etherscan.io/address/0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`

Estado atual: o contrato existe e ha artefato de deploy em `contracts/ignition/deployments/chain-11155111/`. O backend possui integracao Web3 real para `register-on-chain`, mas ela fica desabilitada por padrao para evitar gasto de faucet/taxa durante demo. Para gravar de fato em Sepolia, configure `BLOCKCHAIN_ENABLED=true`, `RPC_URL`, `OPERATOR_PRIVATE_KEY` e saldo na wallet owner do contrato.

## Metricas de impacto

Metricas atuais:
- valor total fiscalizado;
- quantidade de contratos fiscalizados;
- contratos por status;
- contratos em disputa;
- valor bloqueado em disputas;
- pagamentos autorizados apos validacao;
- eventos com hash de documento;
- eventos com transaction hash quando houver registro blockchain.

Metrica principal recomendada para pitch:

> Valor total de contratos publicos fiscalizados com trilha auditavel e bloqueio de pagamento em caso de disputa.

Melhorias futuras:
- calcular `valor protegido` como soma de contratos em disputa ou bloqueados;
- medir `pagamentos evitados antes da validacao`;
- medir tempo medio entre criacao, entrega, validacao e pagamento;
- medir quantidade de documentos com hash divergente;
- medir percentual de contratos com todas as etapas auditadas.

## Como rodar

### Frontend

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

URL: `http://localhost:3000`

### Backend

```bash
cd backend
cp .env.example .env
docker compose up -d --build
docker compose exec -T api python -m scripts.seed_demo_profiles
```

URL: `http://127.0.0.1:8000`

### Smart contracts

```bash
cd contracts
npm install
npm run compile
npm test
```

Deploy Sepolia:

```bash
npx hardhat ignition deploy ignition/modules/FiscalizaPayRegistry.ts --network sepolia
```

## Tecnologias

- Frontend: Next.js 16, React 19, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, Zustand, wagmi, viem, RainbowKit.
- Backend: Python, FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT, eth-account, web3.py, Docker.
- Blockchain: Solidity 0.8.28, Hardhat 3, Hardhat Ignition, OpenZeppelin, Sepolia.

## Demo

Os artefatos de video-pitch e slides PDF podem ficar fora deste repositorio. Os roteiros e apoio estao em `Docs/funcionamento.md` e `Docs/Demo/`.

Modo demo padrao:

```env
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
```

Modo API real com escrita on-chain:

```env
BLOCKCHAIN_ENABLED=true
CHAIN_ID=11155111
RPC_URL=https://...
CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
OPERATOR_PRIVATE_KEY=0x...
```

Use uma wallet de teste, com saldo Sepolia, e nunca versione a chave privada.

## Uso de IA

O projeto foi desenvolvido com apoio de ferramentas de IA para planejamento, revisao tecnica, documentacao e apoio a implementacao. A validacao final das regras de negocio, arquitetura, codigo e apresentacao permanece responsabilidade da equipe.

Ferramentas citadas na documentacao do projeto incluem Codex/ChatGPT, Claude Code/Copilot e metodologia DDAD (Document-Driven AI Development).
