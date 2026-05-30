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
| `/contracts/new` | Cadastro de contrato (Bloco 11) |
| `/contracts/[id]` | Detalhe do contrato (Bloco 12) |
| `/disputes` | Disputas (Bloco 11) |
| `/audit` | Auditoria (Bloco 12) |

### Responsividade

- **Desktop (≥ md):** sidebar fixa à esquerda (240px), conteúdo ocupa o restante
- **Mobile (< md):** sidebar oculta, acessível via Sheet (drawer) ativado pelo botão hamburger no header

---

## Dashboard

O dashboard (`/dashboard`) é implementado com widgets independentes em `src/widgets/`:

| Widget | Arquivo | Hooks usados |
|---|---|---|
| `DashboardMetrics` | `widgets/dashboard-metrics/` | `useDashboardSummary`, `useContracts` |
| `DashboardMetricCard` | `widgets/dashboard-metrics/` | — (presentational) |
| `DashboardStatusOverview` | `widgets/dashboard-status-overview/` | `useDashboardSummary` |
| `DashboardRecentContracts` | `widgets/dashboard-recent-contracts/` | `useContracts` |
| `DashboardAlerts` | `widgets/dashboard-alerts/` | `useContracts` |

Métricas exibidas: total, criados, enviados, entregues, validados, pagamentos autorizados, em disputa, valor total fiscalizado.

Cada widget é um Client Component com loading/error/empty state próprio. A página `/dashboard` é um Server Component que os compõe.

---

## Listagem de contratos

A página `/contracts` é implementada com a arquitetura:

```txt
app/contracts/page.tsx         → Server Component (delegação)
app/contracts/_components/contracts-page.tsx → Client Component (estado + useContracts)
widgets/contracts-filters/     → Filtros (busca, status, órgão, ordenação)
widgets/contracts-list/        → Grade de ContractCard com estados de interface
widgets/contracts-summary-bar/ → Contadores e valor total filtrado
entities/contract/ui/contract-card.tsx    → Card de contrato (link para /contracts/:id)
entities/contract/ui/contract-amount.tsx  → Exibição de valor monetário reutilizável
```

Filtros disponíveis:
- Busca por `contractNumber`, `supplierName`, `publicAgency`, `object`
- Filtro por status (CRIADO, ENVIADO, ENTREGUE, VALIDADO, PAGAMENTO_AUTORIZADO, DISPUTA)
- Filtro por órgão público (derivado dinamicamente dos dados)
- Ordenação: mais recentes, mais antigos, maior valor, menor valor

---

## Cadastro de contrato

A página `/contracts/new` é implementada com a arquitetura:

```txt
app/contracts/new/page.tsx                        → Server Component (delegação)
app/contracts/new/_components/create-contract-page.tsx → Client Component (layout + back button)
features/create-contract/ui/create-contract-form.tsx   → Formulário RHF + Zod + useCreateContract
features/create-contract/model/create-contract-schema.ts → Schema Zod com validações
features/create-contract/index.ts                      → Barrel
```

Campos do formulário:
- `contractNumber`, `publicAgency`, `amount`, `deadline`, `object` (obrigatórios)
- `supplierName`, `supplierWallet` (opcional, regex `0x` + 40 hex chars)
- `inspectorName`, `inspectorWallet` (opcional wallet)
- `logisticsResponsible`, `logisticsWallet` (opcional wallet)
- `managerName` (opcional), `managerWallet` (opcional wallet)
- `documentHash` (opcional, mín. 16 chars se preenchido)

Após criação bem-sucedida: `toast.success` (via `useCreateContract`) + redirect para `/contracts`.

---

## Detalhe do contrato

A página `/contracts/[id]` é implementada com a arquitetura:

```txt
app/contracts/[id]/page.tsx                              → Server Component (await params → passa id)
app/contracts/[id]/_components/contract-detail-page.tsx  → Client Component (3 hooks + layout)
app/contracts/[id]/_components/contract-overview-card.tsx    → Status, progresso, valor, prazo
app/contracts/[id]/_components/contract-parties-card.tsx     → Gestor, Fornecedor, Fiscal, Logística
app/contracts/[id]/_components/contract-hashes-card.tsx      → documentHash, blockchainContractId, transactionHash
app/contracts/[id]/_components/contract-blockchain-card.tsx  → Status on-chain, explorer link
app/contracts/[id]/_components/contract-next-action-card.tsx → Próxima ação por perfil (useProfileStore)
app/contracts/[id]/_components/contract-events-preview.tsx   → Últimos 3 eventos
app/contracts/[id]/_components/contract-dispute-alert.tsx    → Alerta de disputa
```

Hooks usados:
- `useContractById(id)` — dados do contrato
- `useContractEvents(id)` — eventos (loading skeleton isolado)
- `useBlockchainStatus(id)` — status on-chain (loading skeleton isolado)

Estados:
- Loading: skeleton de toda a página
- Error: ErrorState com botão voltar
- Not found: EmptyState com botão voltar
- Disputa: alerta de destaque vermelho

Painel de ações será implementado no **Bloco 14**.

---

## Painel de ações do contrato

A página `/contracts/[id]` exibe o `ContractActionPanel`, substituindo o `ContractNextActionCard` do Bloco 12.

```txt
features/contract-actions/ui/contract-action-panel.tsx    → Panel principal — usa regras visuais + perfil ativo
features/contract-actions/ui/action-button.tsx            → Botão reutilizável com loading/disabled/reason
features/contract-actions/ui/confirm-dialog.tsx           → Dialog de confirmação reutilizável
features/contract-actions/ui/confirm-shipment-action.tsx  → Confirmar envio (FORNECEDOR + CRIADO)
features/contract-actions/ui/confirm-delivery-action.tsx  → Confirmar entrega (ENTREGADOR + ENVIADO)
features/contract-actions/ui/validate-receipt-action.tsx  → Validar recebimento (FISCAL + ENTREGUE)
features/contract-actions/ui/authorize-payment-action.tsx → Autorizar pagamento (GESTOR + VALIDADO) — confirmação crítica
features/contract-actions/ui/open-dispute-action.tsx      → Abrir disputa — dialog com motivo obrigatório
features/contract-actions/ui/simulate-fraud-action.tsx    → Simular fraude — dialog com novo hash
features/contract-actions/ui/register-on-chain-action.tsx → Registrar on-chain — confirmação + badge se já registrado
```

Regras visuais usadas (fonte: `entities/contract/model/rules.ts`):
- `canConfirmShipment`, `canConfirmDelivery`, `canValidateReceipt`, `canAuthorizePayment`
- `canOpenDispute`, `canSimulateFraud`
- `getNextContractAction`, `getCanonicalNextAction`, `getBlockedActionReason`
- `CONTRACT_ACTION_LABELS`

Mutations usadas (fonte: Bloco 7 — TanStack Query):
- `useConfirmShipment`, `useConfirmDelivery`, `useValidateReceipt`, `useAuthorizePayment`
- `useOpenDispute`, `useSimulateFraud`, `useRegisterOnChain`

**Importante:** As regras do frontend são apenas visuais. O backend continua sendo a fonte definitiva de validação e segurança. Disputa e fraude completas serão aprofundadas no Bloco 15.

---

## Timeline auditável

A page `/contracts/[id]` exibe a timeline completa via `ContractTimeline`, substituindo o preview de 3 eventos do Bloco 12.

```txt
app/contracts/[id]/_components/contract-timeline.tsx       → Client Component (Framer Motion + sorting asc)
entities/contract-event/ui/contract-event-card.tsx         → Card de evento: ícone, label, descrição, status transition, responsible, hashes
entities/contract-event/ui/event-type-icon.tsx             → Ícone Lucide por ContractEventType
entities/contract-event/ui/status-transition.tsx           → statusBefore → statusAfter visual
entities/contract-event/ui/document-hash-viewer.tsx        → documentHash com shortenHash + CopyButton
entities/transaction/ui/transaction-hash-link.tsx          → transactionHash com explorer link + CopyButton
```

Eventos ordenados do mais antigo ao mais recente (ordem cronológica). Cada `ContractEventCard` exibe:
- Ícone colorido por `isAlert`/`isCritical` (danger/success/primary)
- Label + timestamp (`formatDateTimeBR`)
- Descrição completa
- `StatusTransition` (statusBefore → statusAfter, quando presentes)
- `responsibleName` + `RoleBadge` (quando presente)
- `DocumentHashViewer` e/ou `TransactionHashLink` (quando presentes)

Conector vertical (`w-px bg-border`) liga os eventos na linha do tempo, sem conector após o último.

Painel de ações será implementado no **Bloco 14**.

---

## Disputa e fraude simulada

O fluxo completo de disputa e simulação de fraude é implementado no **Bloco 15** em duas features independentes.

### `features/open-dispute/`

```txt
model/open-dispute-schema.ts  → Zod schema + DISPUTE_TYPES + DISPUTE_TYPE_LABELS + OpenDisputeValues
ui/open-dispute-form.tsx      → RHF + Zod, Select tipo disputa (Controller), Textarea motivo + notas
ui/open-dispute-dialog.tsx    → Dialog wrapping o form, loading guard no onOpenChange
index.ts                      → Barrel
```

**Tipos de disputa disponíveis:**
| Enum | Label |
|---|---|
| `DOCUMENT_HASH_MISMATCH` | Divergência de hash do documento |
| `DELIVERY_NOT_CONFIRMED` | Entrega não confirmada |
| `INSPECTION_REJECTED` | Inspeção rejeitada |
| `PAYMENT_BLOCKED` | Pagamento bloqueado |
| `OTHER` | Outro |

### `features/simulate-fraud/`

```txt
model/simulate-fraud-schema.ts  → Zod schema + generateFakeHash + SimulateFraudValues
ui/simulate-fraud-form.tsx      → Comparação hash original vs alterado, botão "Gerar hash falso", alerta de divergência
ui/simulate-fraud-dialog.tsx    → Dialog wrapping o form, loading guard no onOpenChange
index.ts                        → Barrel
```

**Comparação visual:** quando o hash alterado diverge do original, o painel da direita fica com borda `border-danger/50 bg-danger/5` e texto `text-danger`. Alerta de rodapé confirma que uma disputa será aberta ao confirmar.

### `/disputes` — Página de disputas

```txt
app/disputes/page.tsx                           → Server Component (delegação)
app/disputes/_components/disputes-page.tsx      → Client Component — useContracts("DISPUTA"), summary + lista
app/disputes/_components/disputes-summary.tsx   → 3 cards: total disputas, valor bloqueado, pagamentos bloqueados
app/disputes/_components/dispute-card.tsx       → Card: contractNumber, órgão, fornecedor, valor, hash, link detalhe
```

### Integração com `features/contract-actions/`

Os componentes do Bloco 14 foram atualizados para usar os novos dialogs:
- `open-dispute-action.tsx` → usa `OpenDisputeDialog` (antes: dialog inline com Textarea simples)
- `simulate-fraud-action.tsx` → usa `SimulateFraudDialog` com `originalHash={contract.documentHash}` (antes: dialog inline sem comparação)

### Regras visuais aplicadas

| Status | `ContractActionPanel` exibe |
|---|---|
| `DISPUTA` | AlertTriangle vermelho + "Pagamento bloqueado" + `SimulateFraudAction` se `canSimulateFraud` |
| Outro | Fluxo normal de próxima ação |

**Importante:** a validação final de disputa é responsabilidade do backend. O frontend aplica regras visuais como camada de UX.

---

## Wallet e perfil visual

A camada visual de wallet e perfil foi implementada no **Bloco 16** com store simulado e componentes independentes da integração real.

### Store de wallet (`entities/wallet/model/store.ts`)

```ts
// Demo visual — não é conexão real com MetaMask/Wagmi
useWalletStore()  // address, chainId, networkName, isConnected, isCorrectNetwork
                  // connectMockWallet() | disconnectWallet()
```

Simula endereço `0x8A4D35...F92B` na rede **Polygon Amoy** (Chain 80002). A integração real virá via `wagmi` + `RainbowKit` em versão futura — o store será sincronizado com `useAccount()` nessa etapa.

### Componentes de wallet (`entities/wallet/ui/`)

| Componente | Descrição |
|---|---|
| `NetworkBadge` | Badge visual: verde (rede correta), amarelo (rede incorreta), muted (não conectada) |
| `WalletStatus` | Dot indicador + endereço encurtado + NetworkBadge — exibição compacta sem interação |
| `WalletAccountCard` | Card completo: endereço copiável, rede, ChainID, link explorer, aviso demo |

### Feature de conexão (`features/wallet-connect/`)

```txt
features/wallet-connect/ui/wallet-connect-button.tsx
  → Se desconectada: botão "Conectar wallet (demo)"
  → Se conectada: dropdown com endereço + WalletAccountCard + "Desconectar wallet"
```

### Componentes de perfil (`entities/profile/ui/`)

| Componente | Descrição |
|---|---|
| `ProfileIdentityCard` | Avatar inicial + nome + RoleBadge + descrição da role + ProfileSwitcher integrado |
| `ProfileSwitcher` | Select de perfil demo — sem alterações do Bloco 5 |
| `RoleBadge` | Badge ciano com label da role — sem alterações |

### AppHeader atualizado

O `AppHeader` foi refatorado:

```txt
Antes: [wallet badge wagmi] [ProfileSwitcher compact]
Depois: [WalletConnectButton] [Perfil dropdown → ProfileIdentityCard]
```

- `useAccount()` do wagmi removido do header — wallet agora usa `useWalletStore`
- Wallet: dropdown com `WalletAccountCard` + ações de conectar/desconectar
- Perfil: dropdown com `ProfileIdentityCard` (nome, role, seletor de demo)
- Mobile: botão de wallet sem texto (só ícone), botão de perfil com ícone

### Helpers (`entities/wallet/model/helpers.ts`)

```ts
isExpectedChain(chainId: number | null): boolean      // compara com OFFICIAL_CHAIN_ID (80002)
getNetworkLabel(chainId: number | null): string        // "Polygon Amoy" | "Sepolia" | "Chain X"
getExplorerAddressUrl(explorerUrl, address): string    // URL do explorer para o endereço
```

### Preparação para integração real

A estrutura está pronta para substituir o mock por wagmi real:

```ts
// Futura integração — sem impacto nos componentes visuais:
// const { address, isConnected, chain } = useAccount();
// useEffect(() => {
//   if (isConnected && address) {
//     connectMockWallet(); // ou syncFromWagmi(address, chain.id)
//   }
// }, [address, isConnected, chain]);
```

Os componentes consomem o store — a troca de fonte (mock → wagmi) é local ao store, sem tocar em UI.

---

## Auditoria e consulta

A tela `/audit` (**Bloco 17**) exibe todos os eventos do sistema consolidados em uma única tela de consulta.

### Arquitetura

```txt
app/audit/page.tsx                           → Server Component (delegação)
app/audit/_components/audit-page.tsx         → Client Component — orquestra tudo
app/audit/_components/audit-filters.tsx      → Busca + filtros + ordenação
app/audit/_components/audit-summary.tsx      → 4 cards estatísticos
app/audit/_components/audit-event-list.tsx   → Lista com loading/error/empty states
app/audit/_components/audit-event-card.tsx   → Card individual de evento
app/audit/_components/use-audit-events.ts    → Hook TanStack Query
```

### Hook — `useAuditEvents`

```ts
// Retorna todos os eventos de todos os contratos, enriquecidos com dados do contrato
useAuditEvents() → useQuery<AuditEventItem[]>

type AuditEventItem = ContractEvent & {
  contractNumber: string;
  contractObject: string;
  contractStatus: ContractStatus;
}
```

A lógica de enriquecimento fica em `getAuditEvents()` no `shared/api/contracts-api.ts` — em modo mock, usa `mockStore.getAllEvents()` e junta com `getContracts()`.

### Filtros disponíveis

| Filtro | Tipo | Opções |
|---|---|---|
| Busca geral | texto | contractNumber, contractObject, responsibleName, responsibleWallet, transactionHash, documentHash |
| Tipo de evento | select | Todos os 8 tipos de `ContractEventType` |
| Status do contrato | select | Todos os 6 status de `ContractStatus` |
| Disputas e fraudes | toggle | DISPUTA_ABERTA + FRAUDE_SIMULADA |
| Ordenação | select | Mais recente / Mais antigo |

### Sumário estatístico

| Card | Métrica |
|---|---|
| Total de eventos | count total |
| Com tx blockchain | eventos com `transactionHash` |
| Com hash de documento | eventos com `documentHash` |
| Disputas e fraudes | eventos com `EVENT_TYPE_IS_ALERT = true` |

### Componentes reutilizados no `AuditEventCard`

- `EventTypeIcon` — ícone do tipo de evento
- `StatusTransition` — de/para status do contrato
- `DocumentHashViewer` — hash do documento com CopyButton
- `TransactionHashLink` — link para o block explorer
- `RoleBadge` — role do responsável
- `ContractStatusBadge` — status atual do contrato

---

## Próximo bloco

**Bloco 18 — Responsividade e polish visual:** revisão desktop/mobile, ajuste de espaçamentos e contraste.
