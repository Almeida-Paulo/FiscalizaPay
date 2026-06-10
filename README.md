# 🛡️ FiscalizaPay

**Fiscalização pública, rastreabilidade de contratos e prova de integridade com blockchain.**

O **FiscalizaPay** é uma plataforma Web3 para acompanhar contratos públicos antes da liberação de pagamentos. A aplicação organiza o fluxo de fiscalização, registra eventos auditáveis, vincula responsáveis por perfil e wallet, detecta divergências de hash e permite registrar provas de integridade na blockchain.

> Em vez de pagar primeiro e auditar depois, o FiscalizaPay coloca a validação antes da autorização do pagamento.

---

## 📌 Visão Geral

| Item | Status |
| --- | --- |
| Frontend | Deploy preparado para Vercel |
| Backend | API FastAPI preparada para Railway |
| Banco de dados | PostgreSQL |
| Blockchain | Contrato deployado na Sepolia |
| Smart contract | `FiscalizaPayRegistry` |
| Rede | Sepolia |
| Chain ID | `11155111` |
| Contrato | `0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83` |
| Explorer | https://sepolia.etherscan.io/address/0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83 |

---

## 🚨 Problema

Contratos públicos frequentemente envolvem:

- documentos espalhados em múltiplos canais;
- validações manuais e pouco rastreáveis;
- dificuldade para saber quem autorizou cada etapa;
- pagamento liberado antes de comprovação adequada;
- auditoria tardia, quando o prejuízo já aconteceu;
- baixa transparência para fiscalização social e institucional.

Quando a entrega é paga sem validação, o dano ao recurso público pode ser irreversível.

---

## ✅ Solução

O **FiscalizaPay** cria um fluxo de fiscalização com trilha auditável:

1. 🧑‍💼 **Gestor** cria o contrato.
2. 🏭 **Fornecedor** confirma envio ou execução.
3. 🚚 **Entregador** confirma entrega.
4. 🔎 **Fiscal** valida o recebimento.
5. ✅ **Gestor** autoriza o pagamento.

Se houver divergência de hash, suspeita de fraude ou problema operacional:

- uma **disputa** pode ser aberta;
- o pagamento fica **bloqueado**;
- o evento entra na **timeline auditável**;
- a evidência pode ser consultada posteriormente.

---

## ✨ Principais Funcionalidades

- 🔐 **Login por wallet** com assinatura EVM.
- 👥 **Perfis com permissões reais**: gestor, fornecedor, entregador, fiscal e auditor.
- 📄 **Cadastro de contratos públicos** com valor, órgão, fornecedor, prazos e responsáveis.
- 🔁 **Fluxo sequencial de status** do contrato.
- 🧾 **Timeline auditável** com responsável, role, wallet, status anterior/posterior e evidências.
- ⚠️ **Abertura de disputas** para bloquear pagamento.
- 🧪 **Simulação de fraude** por divergência de hash.
- 📊 **Dashboard de impacto** com contratos, status, disputas e valor fiscalizado.
- 🔍 **Tela de auditoria** para consultar eventos consolidados.
- ⛓️ **Registro on-chain de hash** via contrato Solidity na Sepolia.
- 🌐 **Integração preparada para Vercel + Railway + Sepolia**.

---

## 👥 Participantes do Fluxo

| Perfil | Permissões principais |
| --- | --- |
| 🧑‍💼 Gestor | Cria contratos, autoriza pagamentos e registra hash on-chain. |
| 🏭 Fornecedor | Confirma envio ou execução do contrato. |
| 🚚 Entregador | Confirma entrega do item ou serviço. |
| 🔎 Fiscal | Valida recebimento, abre disputa e simula fraude. |
| 🧑‍⚖️ Auditor | Consulta histórico, audita evidências e pode abrir disputa. |

As regras visuais existem no frontend, mas a **validação definitiva acontece no backend**.

---

## 🔁 Fluxo do Contrato

```txt
CRIADO
  ↓
ENVIADO
  ↓
ENTREGUE
  ↓
VALIDADO
  ↓
PAGAMENTO_AUTORIZADO
```

Fluxo alternativo:

```txt
CRIADO / ENVIADO / ENTREGUE / VALIDADO
  ↓
DISPUTA
  ↓
Pagamento bloqueado até análise
```

---

## 🧱 Arquitetura

```txt
FiscalizaPay
├── web/        Frontend Next.js, dashboard, contratos, wallet e auditoria
├── backend/    API FastAPI, PostgreSQL, JWT, regras de negócio e Web3
├── contracts/  Smart contract Solidity/Hardhat para registro de hashes
└── Docs/       Documentação técnica, demo, avaliação e planejamento
```

### Como as camadas se comunicam

```txt
Usuário
  ↓
Frontend Next.js / Vercel
  ↓
Backend FastAPI / Railway
  ↓
PostgreSQL
  ↓
Smart Contract Sepolia
```

---

## ⛓️ Blockchain

O projeto possui o contrato **`FiscalizaPayRegistry`** deployado na **Sepolia**.

### Dados registrados on-chain

- `contractId`;
- `documentHash`;
- endereço que registrou;
- timestamp do bloco;
- evento `ContractRegistered`.

### Dados mantidos off-chain

- número do contrato;
- órgão público;
- fornecedor;
- objeto contratado;
- valor;
- prazos;
- responsáveis;
- wallets vinculadas;
- status;
- eventos;
- disputas;
- motivos;
- documentos completos ou evidências sensíveis.

Essa separação evita publicar dados sensíveis na blockchain. A blockchain é usada como **prova pública de integridade**, não como banco de dados completo.

### Estado da integração Web3

O backend possui integração real com Web3 para chamar:

```solidity
registerContract(bytes32 contractId, bytes32 documentHash)
```

Por segurança e economia de faucet/taxa, a escrita real fica desligada por padrão:

```env
BLOCKCHAIN_ENABLED=false
```

Para registrar de fato em Sepolia, é necessário configurar:

```env
BLOCKCHAIN_ENABLED=true
CHAIN_ID=11155111
RPC_URL=https://SEU_RPC_SEPOLIA
CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
OPERATOR_PRIVATE_KEY=0xCHAVE_PRIVADA_DA_WALLET_OWNER
```

> ⚠️ A `OPERATOR_PRIVATE_KEY` deve pertencer à wallet **owner** do contrato. Se não for a owner, a transação reverte por `onlyOwner`.

---

## 📊 Métricas de Impacto

O FiscalizaPay acompanha métricas úteis para demonstrar impacto público:

| Métrica | O que demonstra |
| --- | --- |
| Valor total fiscalizado | Volume financeiro sob rastreabilidade. |
| Quantidade de contratos | Adoção e uso da plataforma. |
| Contratos por status | Situação operacional do fluxo. |
| Contratos em disputa | Casos bloqueados para análise. |
| Valor bloqueado em disputa | Potencial valor protegido. |
| Pagamentos autorizados após validação | Pagamentos liberados com controle. |
| Eventos com hash | Evidências vinculadas ao histórico. |
| Eventos com transaction hash | Registros com prova on-chain. |

Métrica principal para pitch:

> **Valor total de contratos públicos fiscalizados com trilha auditável e bloqueio de pagamento em caso de disputa.**

---

## 🧪 Demo

O projeto pode ser demonstrado de duas formas:

### 1. Demo com mocks

Ideal para apresentação sem depender de backend, saldo ou RPC.

```env
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
```

### 2. Demo com API real

Usa frontend na Vercel e backend na Railway.

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=https://URL_DO_BACKEND_RAILWAY
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
```

### 3. Demo com registro on-chain real

Além da API real, o backend precisa estar com blockchain habilitada:

```env
BLOCKCHAIN_ENABLED=true
RPC_URL=https://SEU_RPC_SEPOLIA
OPERATOR_PRIVATE_KEY=0xCHAVE_PRIVADA_DA_WALLET_OWNER
```

Use uma wallet de teste com saldo Sepolia.

---

## 🛠️ Tecnologias

### Frontend

- Next.js 16;
- React 19;
- TypeScript;
- TailwindCSS;
- shadcn/ui;
- TanStack Query;
- Zustand;
- wagmi;
- viem;
- RainbowKit.

### Backend

- Python;
- FastAPI;
- SQLAlchemy;
- Alembic;
- PostgreSQL;
- JWT;
- eth-account;
- web3.py;
- Docker.

### Blockchain

- Solidity 0.8.28;
- Hardhat 3;
- Hardhat Ignition;
- OpenZeppelin;
- Sepolia;
- Etherscan Sepolia.

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js;
- Python 3.12;
- Docker e Docker Compose;
- MetaMask;
- Git.

---

### Frontend

```bash
cd web
npm install
cp .env.example .env.local
npm run dev
```

URL local:

```txt
http://localhost:3000
```

Para usar backend real local:

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

---

### Backend

```bash
cd backend
cp .env.example .env
docker compose up -d --build
docker compose exec -T api python -m scripts.seed_demo_profiles
```

URL local:

```txt
http://127.0.0.1:8000
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

---

### Smart Contracts

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

---

## 🔐 Variáveis de Ambiente

### Frontend (`web/.env.local`)

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

### Backend (`backend/.env`)

```env
APP_NAME=FiscalizaPay API
ENVIRONMENT=development
PORT=8000
DATABASE_URL=postgresql+psycopg://fiscalizapay:fiscalizapay_dev_password@db:5432/fiscalizapay
JWT_SECRET=troque-por-uma-chave-forte-com-pelo-menos-32-caracteres
JWT_EXPIRES_MINUTES=60
JWT_ALGORITHM=HS256
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
AUTH_NONCE_EXPIRES_MINUTES=10
CHAIN_ID=11155111
EXPLORER_URL=https://sepolia.etherscan.io
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
RPC_URL=
OPERATOR_PRIVATE_KEY=
BLOCKCHAIN_TX_TIMEOUT_SECONDS=120
```

⚠️ Nunca versione `.env`, `.env.local`, chaves privadas, mnemonics ou tokens.

---

## 🌐 Deploy

### Frontend na Vercel

Configuração recomendada:

```txt
Root Directory: web
Build Command: npm run production
Install Command: npm install
```

Variáveis principais:

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=https://URL_DO_BACKEND_RAILWAY
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
```

### Backend na Railway

Variáveis principais:

```env
ENVIRONMENT=production
DATABASE_URL=postgresql+psycopg://...
JWT_SECRET=...
CORS_ORIGINS=https://URL_DO_FRONTEND_VERCEL
ALLOWED_HOSTS=URL_DO_BACKEND_RAILWAY_SEM_HTTPS
CHAIN_ID=11155111
EXPLORER_URL=https://sepolia.etherscan.io
CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
BLOCKCHAIN_ENABLED=false
```

Para escrita on-chain real:

```env
BLOCKCHAIN_ENABLED=true
RPC_URL=https://SEU_RPC_SEPOLIA
OPERATOR_PRIVATE_KEY=0xCHAVE_PRIVADA_DA_WALLET_OWNER
```

---

## 📁 Documentação

Materiais úteis:

```txt
backend/README.md
web/README.md
contracts/README.md
Docs/Demo/
Docs/technologias.md
Docs/diferenciais.md
Docs/espectativa.md
Docs/Contratos_tecnicos/
```

O repositório também possui documentação de apoio para pitch, demo, critérios técnicos e análise de alinhamento da proposta.

---

## 🧠 Uso de IA

O projeto foi desenvolvido com apoio de ferramentas de IA para:

- planejamento;
- revisão técnica;
- documentação;
- apoio à implementação;
- análise de alinhamento com a proposta;
- organização de demo e pitch.

A validação final das regras de negócio, arquitetura, código e apresentação permanece responsabilidade da equipe.

Ferramentas citadas na documentação incluem:

- Codex / ChatGPT;
- Claude Code / Copilot;
- metodologia DDAD: **Document-Driven AI Development**.

---

## 🧾 Resumo para Apresentação

> O FiscalizaPay é uma plataforma Web3 de fiscalização de contratos públicos que cria uma trilha auditável antes da liberação do pagamento. O sistema registra responsáveis, status, evidências, hashes e disputas, mantendo dados sensíveis off-chain e usando blockchain para prova pública de integridade documental.

---

## ⚠️ Aviso

Este é um MVP acadêmico/técnico. Para uso em produção real com órgãos públicos, ainda seriam necessários:

- auditoria de segurança;
- políticas formais de LGPD;
- gestão robusta de chaves;
- observabilidade;
- testes automatizados ampliados;
- revisão jurídica e operacional;
- plano de custódia e governança de dados.
