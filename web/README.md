# FiscalizaPay Web3 — Frontend

> Plataforma de fiscalização e liberação segura de pagamentos em contratos públicos, com rastreabilidade blockchain.

---

## Stack

```txt
Next.js 16 App Router      Framework e roteamento
React 19 + TypeScript      UI e tipagem
TailwindCSS v4             Estilização (CSS-first)
shadcn/ui                  Componentes base
Framer Motion              Animações
TanStack Query v5          Cache e dados remotos
Zustand                    Estado global local
React Hook Form + Zod      Formulários e validação
wagmi v2 + viem v2         Integração Web3
RainbowKit v2              Conexão de wallet
Lucide React               Ícones
```

---

## Como rodar

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com seus valores

# 3. Rodar em desenvolvimento
npm run dev
```

Acesse: http://localhost:3000

---

## Scripts disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linter ESLint
```

---

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

| Variável | Descrição | Valor padrão |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://localhost:3001` |
| `NEXT_PUBLIC_CHAIN_ID` | Chain ID da testnet | `80002` (Polygon Amoy) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Endereço do smart contract | _(preenchido após deploy)_ |
| `NEXT_PUBLIC_ENABLE_MOCKS` | Ativar mocks locais | `true` |
| `NEXT_PUBLIC_EXPLORER_URL` | URL do block explorer | `https://amoy.polygonscan.com` |

---

## Estrutura de pastas

```txt
src/
├── app/          → Providers, layout raiz, estilos globais
├── pages/        → Composição das telas principais
├── widgets/      → Blocos grandes de interface (sidebar, header, timeline)
├── features/     → Ações do usuário isoladas (create-contract, open-dispute...)
├── entities/     → Modelos do domínio (contract, profile, wallet...)
└── shared/
    ├── api/      → Cliente HTTP base
    ├── config/   → Configuração de ambiente
    ├── constants/ → Constantes e query keys
    ├── hooks/    → Hooks reutilizáveis
    ├── lib/      → Utilitários (cn, formatadores)
    ├── mocks/    → Dados mockados para desenvolvimento
    ├── types/    → Tipos globais (ApiResponse, ApiError)
    └── ui/       → Componentes shadcn/ui e UI base
```

---

## Arquitetura

Feature-Sliced Design (FSD). Ver: `../Docs/Planos_implementacao/plano_implementacao_frontend.md`

---

## Contrato API

Ver: `../Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`

---

## Providers globais

Os providers são compostos em `src/app/providers/`:

```txt
RootProviders (index.tsx)
└── Web3Provider (web3-provider.tsx)
    └── WagmiProvider          → wagmi v2 (createConfig)
        └── QueryProvider       → TanStack Query v5
            └── RainbowKitProvider → tema dark FiscalizaPay
                └── {children}
    └── ToastProvider          → Sonner (portal, bottom-right)
```

A configuração Web3 fica em `src/shared/config/web3.ts`:
- Chain principal: **Polygon Amoy** (ID 80002)
- Fallback: Sepolia (ID 11155111)
- Connector padrão: MetaMask (injected)
- WalletConnect: ativado apenas se `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` for fornecido

---

## Design System

Paleta oficial (Oraculum Design System):

| Token | Hex | Classe Tailwind |
|---|---|---|
| Primário | `#22D3EE` | `text-primary`, `bg-primary` |
| Neon | `#11DFF2` | `text-primary-neon` |
| Sucesso | `#22C55E` | `text-success`, `bg-success` |
| Alerta | `#F59E0B` | `text-warning`, `bg-warning` |
| Erro | `#EF4444` | `text-danger`, `bg-danger` |
| Background | `#050816` | `bg-background` |
| Cards | `#0F172A` | `bg-card` |

### Componentes shadcn/ui disponíveis (`shared/ui/`)

```txt
button, card, badge, input, textarea, select,
dialog, sheet, dropdown-menu, tooltip, skeleton,
separator, tabs
```

### Componentes próprios (`shared/ui/`)

```txt
EmptyState        → estado vazio com icon/action opcional
ErrorState        → estado de erro amigável
LoadingState      → spinner (variant spinner) ou skeleton
PageHeader        → cabeçalho de página com badge/action
SectionTitle      → título de seção com description/action
CopyButton        → copia para clipboard + toast Sonner
MotionContainer   → wrapper Framer Motion para animações de entrada
```

### Tipos e constantes

```txt
shared/constants/theme.ts  → APP_NAME, APP_DESCRIPTION, THEME_COLORS
shared/types/api.ts        → ApiResponse<T>, ApiError
shared/lib/utils.ts        → cn() (clsx + tailwind-merge)
```

---

## Domínio frontend

Modelos de domínio estão em `src/entities/`. Cada entidade exporta seus tipos e constantes via barrel file `index.ts`.

| Entidade | Tipos principais | Constantes |
|---|---|---|
| `entities/contract` | `ContractStatus`, `Contract`, `DashboardSummary`, `BlockchainStatus` | `CONTRACT_STATUS_MAP`, `CONTRACT_STATUS_TRANSITIONS` |
| `entities/contract-event` | `ContractEventType`, `ContractEvent` | `EVENT_TYPE_MAP`, `ACTION_EVENT_MAP` |
| `entities/profile` | `UserRole`, `Profile` | `ROLE_LABELS`, `ROLE_VISUAL_MAP` |
| `entities/wallet` | `WalletInfo`, `WalletNetwork` | `SUPPORTED_NETWORKS`, `OFFICIAL_CHAIN_ID` |
| `entities/transaction` | `TransactionStatus`, `BlockchainTransaction` | — |

**Status oficiais** (em português, conforme domínio):
`CRIADO` → `ENVIADO` → `ENTREGUE` → `VALIDADO` → `PAGAMENTO_AUTORIZADO` / `DISPUTA`

**Roles oficiais**: `GESTOR`, `FORNECEDOR`, `ENTREGADOR`, `FISCAL`, `AUDITOR`

**Helpers** em `shared/lib/formatters.ts`:
`formatCurrencyBRL`, `formatDateBR`, `formatDateTimeBR`, `shortenAddress`, `shortenHash`, `formatCurrencyCompact`

---

## Regras visuais e permissões

As regras visuais ficam em `entities/contract/model/rules.ts`:

```ts
canConfirmShipment(contract, profile)  // FORNECEDOR + status CRIADO
canConfirmDelivery(contract, profile)  // ENTREGADOR + status ENVIADO
canValidateReceipt(contract, profile)  // FISCAL + status ENTREGUE
canAuthorizePayment(contract, profile) // GESTOR + status VALIDADO
canOpenDispute(contract, profile)      // GESTOR|FISCAL|FORNECEDOR|ENTREGADOR
canSimulateFraud(contract, profile)    // GESTOR|FISCAL + documentHash presente
getNextContractAction(contract, profile) → ContractAction | null
getBlockedActionReason(action, contract, profile) → string | null
```

**Importante:** essas funções são apenas regras visuais. O backend é a fonte definitiva de validação e segurança.

O perfil simulado (`entities/profile/model/store.ts`) existe apenas para demo frontend. Não é autenticação real.

---

## Mocks e API Client

- `NEXT_PUBLIC_ENABLE_MOCKS=true` ativa dados mockados; `false` usa a API real
- `shared/api/` concentra todos os services (contracts-api, dashboard-api, blockchain-api)
- `shared/mocks/` concentra todos os dados mockados de demo
- `shared/config/env.ts` centraliza a leitura das variáveis de ambiente públicas
- Componentes **não** devem chamar `fetch` diretamente — sempre via services em `shared/api/`

### Services disponíveis

```ts
// Contratos
getContracts()
getContractById(id)
createContract(payload)
updateContract(id, payload)
deleteContract(id)
getContractEvents(id)
confirmShipment(id, payload?)
confirmDelivery(id, payload?)
validateReceipt(id, payload?)
authorizePayment(id, payload?)
openDispute(id, payload)
simulateFraud(id, payload)

// Dashboard
getDashboardSummary()

// Blockchain
getBlockchainStatus(id)
registerOnChain(id)
```

### Mocks disponíveis

```txt
shared/mocks/contracts.mock.ts       → 6 contratos (1 por status oficial)
shared/mocks/contract-events.mock.ts → timelines coerentes por contrato
shared/mocks/profiles.mock.ts        → 5 perfis (1 por role)
shared/mocks/dashboard.mock.ts       → DashboardSummary derivado dos contratos
shared/mocks/blockchain.mock.ts      → BlockchainStatus por contrato
shared/mocks/mock-errors.ts          → helpers para simular erros tipados
shared/mocks/mock-store.ts           → estado em memória mutável (persiste entre queries)
```

---

## Data Fetching — TanStack Query

Hooks em `entities/*/api/`. Todos os hooks são "use client" e usam `queryKeys` de `shared/api/query-keys.ts`.

### Query hooks

```ts
useDashboardSummary()             // entities/contract/api/
useContracts(status?)             // entities/contract/api/
useContractById(contractId)       // entities/contract/api/
useContractEvents(contractId)     // entities/contract-event/api/
useBlockchainStatus(contractId)   // entities/transaction/api/
```

### Mutation hooks

```ts
// entities/contract/api/
useCreateContract()
useConfirmShipment()   // variables: { contractId, payload? }
useConfirmDelivery()   // variables: { contractId, payload? }
useValidateReceipt()   // variables: { contractId, payload? }
useAuthorizePayment()  // variables: { contractId, payload? }
useOpenDispute()       // variables: { contractId, payload }
useSimulateFraud()     // variables: { contractId, payload }

// entities/transaction/api/
useRegisterOnChain()   // variables: contractId (string)
```

Todas as mutations:
- Invalidam as queries afetadas após sucesso
- Exibem `toast.success` em sucesso e `toast.error` em falha
- Em mock mode, persistem o estado via `mockStore` — o re-fetch do TanStack Query mostra o dado atualizado

---

## Layout principal

A estrutura visual é composta por três widgets em `src/widgets/`:

```txt
AppShell       → layout raiz (sidebar + header + conteúdo + mobile sheet)
AppSidebar     → navegação lateral com active state e ícones
AppHeader      → título da página, ProfileSwitcher, status da wallet, hamburger mobile
```

### Navegação

```ts
// shared/constants/navigation.ts
NAVIGATION_ITEMS  → lista de { title, href, icon } para o sidebar
```

### Helper de página

```ts
// shared/lib/page-meta.ts
getPageMeta(pathname: string): { title: string; description: string }
// usado pelo AppHeader para exibir o título correto por rota
```

### Rotas disponíveis

| Rota | Página |
|---|---|
| `/` | Landing (entrada da app) |
| `/dashboard` | Dashboard (Bloco 9 implementará métricas) |
| `/contracts` | Listagem de contratos (Bloco 10) |
| `/contracts/new` | Novo contrato (Bloco 10) |
| `/disputes` | Disputas (Bloco 11) |
| `/audit` | Auditoria (Bloco 12) |

### Responsividade

- **Desktop (≥ md):** sidebar fixa à esquerda (240px), conteúdo ocupa o restante
- **Mobile (< md):** sidebar oculta, acessível via Sheet (drawer) ativado pelo botão hamburger no header

---

## Próximo bloco

**Bloco 9 — Dashboard:** métricas reais via `useDashboardSummary`, contratos recentes, alertas de status.
