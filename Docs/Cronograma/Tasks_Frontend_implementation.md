# Tasks Frontend Implementation — FiscalizaPay Web3

## 1. Objetivo deste arquivo

Este documento redefine as tasks da **Pessoa 2 — Frontend / UI Lead**, considerando o nível atual do projeto após as sessões de coerência, decisões técnicas finais e organização da documentação.

O objetivo é transformar o checklist antigo em um plano de implementação frontend mais profissional, operacional e compatível com a arquitetura atual do FiscalizaPay Web3.

Este arquivo deve orientar a implementação do frontend sem mexer em backend, banco de dados, smart contract ou regras internas da Pessoa 3.

---

## 2. Diagnóstico do checklist atual

O checklist atual dentro de `fiscalizapay_divisao_etapas_equipe.md` está correto como visão macro, mas está simples demais para o nível atual do projeto.

Ele já contempla pontos importantes como:

- criação do projeto Next.js;
- configuração de TailwindCSS;
- configuração de shadcn/ui;
- configuração de wagmi, viem e RainbowKit;
- TanStack Query;
- Zustand;
- Feature-Sliced Design;
- mocks;
- dashboard;
- listagem;
- cadastro;
- detalhe;
- timeline;
- badges;
- ações por perfil/status;
- integração com API;
- disputa;
- simulação de fraude.

Porém, para iniciar desenvolvimento real com segurança, o checklist precisa ser mais detalhado em:

- ordem de implementação;
- dependência entre tarefas;
- critérios de aceite por bloco;
- organização por arquitetura Feature-Sliced Design;
- separação entre mock e API real;
- componentes compartilhados;
- entities;
- features;
- widgets;
- telas;
- providers;
- design system;
- estados de loading, error e empty;
- validações com Zod;
- query keys;
- integração visual com wallet;
- responsividade;
- qualidade para demo.

---

## 3. Escopo da Pessoa 2

A Pessoa 2 deve atuar apenas no frontend.

### Responsabilidades permitidas

```txt
- Criar base Next.js App Router.
- Configurar stack frontend.
- Criar estrutura Feature-Sliced Design.
- Criar design system visual.
- Criar componentes reutilizáveis.
- Criar mocks compatíveis com a API.
- Criar telas principais.
- Criar fluxo visual do contrato.
- Criar integração com TanStack Query.
- Criar camada de API client.
- Preparar substituição de mocks por API real.
- Criar conexão visual com wallet.
- Exibir documentHash e transactionHash.
- Criar disputa e fraude simulada no frontend.
- Garantir responsividade.
- Preparar demo visual.
```

### Responsabilidades que não pertencem à Pessoa 2

```txt
- Criar backend.
- Criar banco de dados.
- Criar endpoints reais.
- Criar smart contract.
- Fazer deploy em testnet.
- Definir regras finais de permissão no backend.
- Validar segurança real.
- Persistir dados reais.
- Implementar assinatura Web3 real completa.
```

O frontend pode simular ou consumir esses comportamentos, mas a responsabilidade técnica final é da Pessoa 3.

---

## 4. Stack oficial do frontend

A implementação deve seguir obrigatoriamente:

```txt
Next.js App Router
TypeScript
TailwindCSS
shadcn/ui
Framer Motion
TanStack Query
Zustand
React Hook Form
Zod
wagmi
viem
RainbowKit
Lucide React
```

Não usar como stack principal:

```txt
Vite
React Router
Axios como padrão principal se o projeto já usar fetch/httpClient
Ethers.js como lib principal do frontend
```

---

## 5. Arquitetura oficial do frontend

A estrutura deve seguir Feature-Sliced Design:

```txt
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

### Responsabilidade de cada camada

```txt
app/
- Providers globais
- Layout raiz
- Configuração de tema
- Configuração TanStack Query
- Configuração Web3
- Estilos globais
- Metadata

pages/
- Composição das telas principais
- Dashboard
- Contratos
- Detalhe do contrato
- Auditoria
- Disputas

widgets/
- AppSidebar
- AppHeader
- DashboardMetrics
- ContractTimeline
- ContractActionPanel
- WalletStatus
- AuditSummary

features/
- create-contract
- confirm-shipment
- confirm-delivery
- validate-receipt
- authorize-payment
- open-dispute
- simulate-fraud
- connect-wallet

entities/
- contract
- contract-event
- profile
- document
- wallet
- transaction

shared/
- api
- config
- constants
- hooks
- lib
- mocks
- types
- ui
```

---

## 6. Bloco 0 — Preparação antes de codar

### Objetivo

Garantir que a Pessoa 2 comece a implementação usando os documentos certos.

### Tasks

- [ ] Ler `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`.
- [ ] Ler `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md`.
- [ ] Ler `Docs/Governanca_tecnica/glossario_tecnico_oficial.md`.
- [ ] Ler `Docs/Governanca_tecnica/criterios_aceite_mvp.md`.
- [ ] Ler `Docs/Planos_implementacao/plano_implementacao_frontend.md`.
- [ ] Ler `Docs/Base_do_projeto/oraculum_design_system.md`.
- [ ] Confirmar que o frontend deve iniciar mockado.
- [ ] Confirmar que `NEXT_PUBLIC_ENABLE_MOCKS=true` será usado no início.
- [ ] Confirmar que a API real será integrada depois.
- [ ] Confirmar que o backend não será alterado pela Pessoa 2.

### Critérios de aceite

- [ ] A Pessoa 2 sabe exatamente quais documentos seguir.
- [ ] Não há dúvida sobre stack, arquitetura, status, roles e endpoints.
- [ ] O desenvolvimento pode começar sem depender do backend.

---

## 7. Bloco 1 — Criação e configuração do projeto

### Objetivo

Criar a base técnica do frontend.

### Tasks

- [ ] Criar projeto com Next.js App Router.
- [ ] Habilitar TypeScript.
- [ ] Configurar TailwindCSS.
- [ ] Configurar shadcn/ui.
- [ ] Configurar alias `@/`.
- [ ] Configurar ESLint.
- [ ] Configurar Prettier, se ainda não existir.
- [ ] Configurar estrutura `src/`.
- [ ] Criar estrutura Feature-Sliced Design.
- [ ] Criar arquivo `.env.example`.
- [ ] Adicionar variáveis públicas esperadas.
- [ ] Configurar fonte/tipografia base.
- [ ] Configurar estilos globais.
- [ ] Configurar tema dark como padrão.
- [ ] Remover boilerplate inicial do Next.js.

### Variáveis frontend esperadas

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_EXPLORER_URL=
```

### Critérios de aceite

- [ ] O projeto roda localmente.
- [ ] O build inicial não quebra.
- [ ] Tailwind está funcionando.
- [ ] shadcn/ui está funcionando.
- [ ] A estrutura FSD existe.
- [ ] O projeto está pronto para receber componentes.

---

## 8. Bloco 2 — Providers globais

### Objetivo

Configurar as bases globais da aplicação.

### Tasks

- [x] Criar `app/providers`.
- [x] Configurar `QueryClientProvider` do TanStack Query.
- [x] Configurar `WagmiProvider`.
- [x] Configurar `RainbowKitProvider`.
- [x] Configurar tema do RainbowKit compatível com dark system.
- [x] Criar provider de toast/sonner.
- [x] Garantir que providers client-side usem `"use client"`.
- [x] Evitar transformar o layout inteiro em Client Component sem necessidade.
- [x] Criar `shared/config/web3.ts` com wagmiConfig.
- [x] Atualizar `.env.example` com NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.
- [x] Atualizar `web/README.md` com seção de providers.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Critérios de aceite

- [x] TanStack Query está disponível globalmente.
- [x] Wallet provider está preparado.
- [x] Toasts funcionam.
- [x] App Router permanece organizado.
- [x] Não há erro de hydration.

### Versionamento

- [x] Fazer commit semântico do Bloco 2.
- [x] Fazer push da branch após validação.

---

## 9. Bloco 3 — Design system e UI base

### Objetivo

Criar os componentes visuais reutilizáveis da aplicação.

### Tasks

- [x] Aplicar paleta oficial (oklch no globals.css, @theme inline).
- [x] Criar tokens de cor no Tailwind (bg-primary, bg-success, bg-warning, bg-danger, bg-info).
- [x] Criar padrão de background (bg-background global no body).
- [x] Criar padrão de cards (bg-card, border-border via shadcn).
- [x] Criar padrão de bordas (border-border via CSS variables).
- [x] Criar padrão de textos (text-foreground, text-muted-foreground).
- [x] Criar padrão de hover/focus (hover:bg-muted, focus-visible:ring-ring via shadcn).
- [x] Criar padrão de badge (shadcn Badge com variantes).
- [x] Criar padrão de botões de ação (shadcn Button com variantes).
- [x] Criar padrão de cards de métricas (shadcn Card com CardHeader/CardContent).
- [x] Criar padrão de section headers (SectionTitle component).
- [x] Criar padrão de empty state (EmptyState component).
- [x] Criar padrão de error state (ErrorState component).
- [x] Criar padrão de loading/skeleton (LoadingState com variants spinner/skeleton).
- [x] Criar padrão de modal/dialog (shadcn Dialog instalado).
- [x] Criar padrão de filtros (shadcn Select + DropdownMenu instalados).
- [x] Criar padrão de timeline (base do Skeleton disponível).
- [x] Criar animações leves com Framer Motion (MotionContainer com fadeInUp).

### Paleta oficial

```txt
Background: #050816
Cards: #0F172A
Bordas: #1E293B
Texto principal: #F8FAFC
Texto secundário: #94A3B8
Destaque primário: #22D3EE
Neon Oraculum: #11DFF2
Sucesso: #22C55E
Alerta: #F59E0B
Erro: #EF4444
```

### Componentes `shared/ui`

**shadcn/ui instalados:**
- [x] `Button`
- [x] `Card`
- [x] `Badge`
- [x] `Input`
- [x] `Textarea`
- [x] `Select`
- [x] `Dialog`
- [x] `Sheet`
- [x] `Dropdown Menu`
- [x] `Tooltip`
- [x] `Skeleton`
- [x] `Separator`
- [x] `Tabs`

**Componentes próprios criados:**
- [x] `EmptyState` → estado vazio com icon/action
- [x] `ErrorState` → erro amigável com icon/action
- [x] `LoadingState` → spinner + variant skeleton
- [x] `PageHeader` → cabeçalho com badge/action
- [x] `SectionTitle` → título de seção com description/action
- [x] `CopyButton` → copia para clipboard + toast
- [x] `MotionContainer` → wrapper Framer Motion fadeInUp

**Arquivos adicionais criados:**
- [x] `shared/constants/theme.ts` → APP_NAME, THEME_COLORS
- [x] `shared/types/api.ts` → ApiResponse<T>, ApiError

### Critérios de aceite

- [x] A interface possui identidade visual consistente.
- [x] Os componentes base não possuem regra de negócio.
- [x] Os componentes são reutilizáveis.
- [x] O visual está alinhado ao Oraculum/FiscalizaPay.
- [x] TooltipProvider adicionado ao RootProviders.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Versionamento

- [x] Fazer commit semântico do Bloco 3.
- [x] Fazer push da branch após validação.

---

## 10. Bloco 4 — Modelos de domínio no frontend

### Objetivo

Criar os tipos oficiais do domínio no frontend.

### Tasks

- [x] Criar `entities/contract/model/types.ts` → ContractStatus, Contract, DashboardSummary, BlockchainStatus
- [x] Criar `entities/contract/model/constants.ts` → CONTRACT_STATUS_MAP, CONTRACT_STATUS_TRANSITIONS
- [x] Criar `entities/contract/index.ts` → barrel export
- [x] Criar `entities/contract-event/model/types.ts` → ContractEventType, ContractEvent
- [x] Criar `entities/contract-event/model/constants.ts` → EVENT_TYPE_MAP, ACTION_EVENT_MAP
- [x] Criar `entities/contract-event/index.ts` → barrel export
- [x] Criar `entities/profile/model/types.ts` → UserRole, Profile
- [x] Criar `entities/profile/model/constants.ts` → ROLE_LABELS, ROLE_VISUAL_MAP
- [x] Criar `entities/profile/index.ts` → barrel export
- [x] Criar `entities/wallet/model/types.ts` → WalletInfo, WalletNetwork, SUPPORTED_NETWORKS
- [x] Criar `entities/wallet/index.ts` → barrel export
- [x] Criar `entities/transaction/model/types.ts` → TransactionStatus, BlockchainTransaction
- [x] Criar `entities/transaction/index.ts` → barrel export
- [x] Atualizar `shared/types/api.ts` → ApiErrorCode extraído, PaginatedResponse adicionado
- [x] Criar `shared/lib/formatters.ts` → formatCurrencyBRL, formatDateBR, shortenAddress, shortenHash, etc.
- [x] Criar status oficiais em português (CRIADO, ENVIADO, ENTREGUE, VALIDADO, PAGAMENTO_AUTORIZADO, DISPUTA)
- [x] Criar roles oficiais em português (GESTOR, FORNECEDOR, ENTREGADOR, FISCAL, AUDITOR)
- [x] Criar event types oficiais (CONTRATO_CRIADO, ENVIO_CONFIRMADO, etc.)
- [x] Criar status map visual (label, description, variant, progress)
- [x] Criar role map visual (label, description, actions)
- [x] Criar event type map visual (label, description, isCritical, isAlert)
- [x] Atualizar app/page.tsx com seção de domínio (showcase mínimo)
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Critérios de aceite

- [x] ContractStatus com valores oficiais em português.
- [x] UserRole com valores oficiais em português.
- [x] ContractEventType definido.
- [x] Contract, ContractEvent, Profile, WalletInfo, BlockchainTransaction definidos.
- [x] ApiResponse, ApiError, ApiErrorCode, PaginatedResponse definidos.
- [x] Maps e labels criados.
- [x] Barrel exports em todos os index.ts.
- [x] Formatters criados.
- [x] Showcase atualizado sem virar dashboard.

### Versionamento

- [x] Fazer commit semântico do Bloco 4.
- [x] Fazer push da branch após validação.

### Status oficiais

```ts
export type ContractStatus =
  | "CRIADO"
  | "ENVIADO"
  | "ENTREGUE"
  | "VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA";
```

### Roles oficiais

```ts
export type UserRole =
  | "GESTOR"
  | "FORNECEDOR"
  | "ENTREGADOR"
  | "FISCAL"
  | "AUDITOR";
```

### Event types oficiais

```ts
export type ContractEventType =
  | "CONTRATO_CRIADO"
  | "ENVIO_CONFIRMADO"
  | "ENTREGA_CONFIRMADA"
  | "RECEBIMENTO_VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA_ABERTA"
  | "FRAUDE_SIMULADA"
  | "HASH_REGISTRADO";
```

### Critérios de aceite

- [ ] Nenhum status em inglês é usado como oficial.
- [ ] Nenhuma role em inglês é usada como oficial.
- [ ] Event types seguem SCREAMING_SNAKE_CASE.
- [ ] Os tipos batem com o contrato API.
- [ ] Os componentes usam esses tipos.

---

## 11. Bloco 5 — Regras visuais e permissões no frontend

### Objetivo

Criar regras visuais para habilitar/desabilitar ações no frontend.

### Tasks

- [x] Criar `entities/contract/model/rules.ts`
- [x] Criar `canConfirmShipment` (FORNECEDOR + CRIADO)
- [x] Criar `canConfirmDelivery` (ENTREGADOR + ENVIADO)
- [x] Criar `canValidateReceipt` (FISCAL + ENTREGUE)
- [x] Criar `canAuthorizePayment` (GESTOR + VALIDADO)
- [x] Criar `canOpenDispute` (GESTOR|FISCAL|FORNECEDOR|ENTREGADOR, exceto PGTO_AUT.)
- [x] Criar `canSimulateFraud` (GESTOR|FISCAL + documentHash + não PGTO_AUT.)
- [x] Criar `getNextContractAction` → ContractAction | null
- [x] Criar `getAvailableContractActions` → ContractAction[]
- [x] Criar `getBlockedActionReason` → string | null com mensagens amigáveis
- [x] Criar `getContractProgress` → number
- [x] Criar `getContractStatusLabel` → string
- [x] Criar `getContractStatusDescription` → string
- [x] Criar `getContractStatusVariant` → StatusVariant
- [x] Criar `isContractInDispute` → boolean
- [x] Criar `isContractPaymentAuthorized` → boolean
- [x] Criar `entities/contract/ui/contract-status-badge.tsx`
- [x] Criar `entities/profile/model/store.ts` (Zustand demo)
- [x] Criar `entities/profile/ui/role-badge.tsx`
- [x] Criar `entities/profile/ui/profile-switcher.tsx` (Select + Zustand)
- [x] Criar `shared/ui/permission-gate.tsx`
- [x] Criar `app/permissions-showcase.tsx` (client demo interativo)
- [x] Atualizar `entities/contract/index.ts` (barrel + rules)
- [x] Atualizar `entities/profile/index.ts` (nota sobre store)
- [x] Atualizar `app/page.tsx` com seção de Bloco 5
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Critérios de aceite

- [x] Nenhum status em inglês é usado como oficial.
- [x] Nenhuma role em inglês é usada como oficial.
- [x] Event types seguem SCREAMING_SNAKE_CASE.
- [x] Os tipos batem com o contrato API.
- [x] Os componentes usam esses tipos.
- [x] Zustand store comentada como "não é autenticação real".
- [x] rules.ts comentada com aviso de segurança.
- [x] Build limpo.

### Versionamento

- [x] Fazer commit semântico do Bloco 5.
- [ ] Fazer push da branch após validação.

### Observação importante

Essas regras são apenas visuais.

O backend continua sendo a fonte definitiva de segurança.

### Critérios de aceite

- [ ] Regras não ficam espalhadas no JSX.
- [ ] Botões respeitam status e perfil.
- [ ] Componentes usam funções de domínio.
- [ ] Permissões visuais estão claras na demo.

---

## 12. Bloco 6 — Cliente HTTP e estratégia de mocks

### Objetivo

Permitir que o frontend funcione antes do backend.

### Tasks

- [x] Criar `shared/api/http-client.ts` (wrapper fetch com GET, POST, PATCH, DELETE).
- [x] Criar `shared/config/env.ts` (centraliza envs públicas, enableMocks como boolean).
- [x] Criar `shared/mocks/contracts.mock.ts` (6 contratos — 1 por status oficial).
- [x] Criar `shared/mocks/contract-events.mock.ts` (timelines coerentes por contrato).
- [x] Criar `shared/mocks/profiles.mock.ts` (1 perfil por role).
- [x] Criar `shared/mocks/dashboard.mock.ts` (DashboardSummary derivado dos mocks).
- [x] Criar `shared/mocks/blockchain.mock.ts` (BlockchainStatus por contrato).
- [x] Criar `shared/mocks/mock-errors.ts` (helpers para erros tipados).
- [x] Criar `shared/mocks/index.ts` (barrel).
- [x] Criar `shared/api/contracts-api.ts` (alterna mock/real via env.enableMocks).
- [x] Criar `shared/api/dashboard-api.ts`.
- [x] Criar `shared/api/blockchain-api.ts`.
- [x] Criar `shared/api/index.ts` (barrel).
- [x] Criar `shared/config/index.ts` (barrel).
- [x] Criar `entities/contract/model/api-types.ts` (payload types).
- [x] Criar camada que alterna entre mock e API real via NEXT_PUBLIC_ENABLE_MOCKS.
- [x] Garantir que mocks sigam o contrato API (tipos e formato).
- [x] Criar dados mockados completos para demo.
- [x] Criar 6 contratos mockados (1 por status oficial).
- [x] Criar contrato em disputa com timeline de fraude simulada.
- [x] Criar timeline completa para contrato com PAGAMENTO_AUTORIZADO.
- [x] Atualizar `app/page.tsx` com showcase do Bloco 6.
- [x] Atualizar `web/README.md` com seção Mocks e API Client.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Critérios de aceite

- [x] Com backend desligado, o frontend funciona.
- [x] Os mocks usam os mesmos tipos da API.
- [x] Alternar mock/API não exige mexer nos componentes.
- [x] Dados mockados contam uma história boa para apresentação.

### Versionamento

- [x] Fazer commit semântico do Bloco 6. (hash: 1921a57)
- [x] Fazer push da branch após validação.

---

## 13. Bloco 7 — TanStack Query e hooks de dados

### Objetivo

Criar hooks oficiais para leitura e mutations.

### Tasks

- [x] Criar `shared/mocks/mock-store.ts` (estado mutável em memória para persistência em demo).
- [x] Criar `shared/api/query-keys.ts` (query keys centralizadas).
- [x] Criar `shared/api/handle-api-error.ts` (extrator de mensagem de erro).
- [x] Atualizar `contracts-api.ts`, `dashboard-api.ts`, `blockchain-api.ts` para usar mockStore.
- [x] Criar `useDashboardSummary` → `entities/contract/api/`.
- [x] Criar `useContracts` → `entities/contract/api/`.
- [x] Criar `useContractById` → `entities/contract/api/`.
- [x] Criar `useContractEvents` → `entities/contract-event/api/`.
- [x] Criar `useBlockchainStatus` → `entities/transaction/api/`.
- [x] Criar `useCreateContract` → `entities/contract/api/`.
- [x] Criar `useConfirmShipment` → `entities/contract/api/`.
- [x] Criar `useConfirmDelivery` → `entities/contract/api/`.
- [x] Criar `useValidateReceipt` → `entities/contract/api/`.
- [x] Criar `useAuthorizePayment` → `entities/contract/api/`.
- [x] Criar `useOpenDispute` → `entities/contract/api/`.
- [x] Criar `useSimulateFraud` → `entities/contract/api/`.
- [x] Criar `useRegisterOnChain` → `entities/transaction/api/`.
- [x] Criar barrel `entities/contract/api/index.ts`.
- [x] Criar barrel `entities/contract-event/api/index.ts`.
- [x] Criar barrel `entities/transaction/api/index.ts`.
- [x] Definir query keys oficiais em `shared/api/query-keys.ts`.
- [x] Invalidar queries após cada mutation.
- [x] Tratar loading (isLoading/isPending).
- [x] Tratar error (isError + toast.error).
- [x] Tratar success toast (toast.success).
- [x] Criar `app/query-showcase.tsx` (showcase interativo do Bloco 7).
- [x] Atualizar `app/page.tsx` com seção de Bloco 7.
- [x] Atualizar `web/README.md` com seção Data Fetching.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Query keys oficiais

```ts
["dashboard-summary"]
["contracts"]
["contract", contractId]
["contract-events", contractId]
["blockchain-status", contractId]
```

### Critérios de aceite

- [x] Nenhuma tela chama fetch direto.
- [x] Dados remotos passam por hooks.
- [x] Mutations invalidam dados corretamente.
- [x] Loading/error/success são tratados.
- [x] Hooks funcionam com mock e API real.
- [x] Em mock mode, mutations persistem estado via mockStore.

### Versionamento

- [x] Fazer commit semântico do Bloco 7.
- [x] Fazer push da branch após validação.

---

## 14. Bloco 8 — Layout principal

### Objetivo

Criar a estrutura visual base da aplicação.

### Tasks

- [x] Criar `widgets/app-sidebar` (ICON_MAP, active state, footer).
- [x] Criar `widgets/app-header` (título contextual, ProfileSwitcher compact, wallet status, hamburger mobile).
- [x] Criar `widgets/app-shell` (sidebar + header + conteúdo + Sheet mobile).
- [x] Criar `shared/constants/navigation.ts` (NAVIGATION_ITEMS).
- [x] Criar `shared/lib/page-meta.ts` (getPageMeta).
- [x] Criar navegação principal com active state por rota.
- [x] Criar área principal de conteúdo (main overflow-y-auto).
- [x] Criar menu mobile com Sheet (side="left", fecha ao clicar item).
- [x] Criar indicador de wallet no header (wagmi useAccount, badge Conectado/Desconectado).
- [x] Criar seletor visual de perfil (ProfileSwitcher compact no header).
- [x] Criar título contextual via getPageMeta(pathname).
- [x] Criar layout responsivo (sidebar hidden md:flex, Sheet no mobile).
- [x] Criar estados ativos de navegação (dot indicator, bg-primary/10).
- [x] Criar páginas placeholder: /dashboard, /contracts, /contracts/new, /disputes, /audit.
- [x] Atualizar `app/layout.tsx` com AppShell e body h-full.
- [x] Simplificar `app/page.tsx` para landing page com botões de acesso.
- [x] Atualizar `web/README.md` com seção Layout principal.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Rotas mínimas

```txt
/           → Landing page
/dashboard  → Placeholder (Bloco 9)
/contracts  → Placeholder (Bloco 10)
/contracts/new → Placeholder (Bloco 10)
/disputes   → Placeholder (Bloco 11)
/audit      → Placeholder (Bloco 12)
```

### Critérios de aceite

- [x] Sidebar funciona no desktop.
- [x] Menu mobile funciona (Sheet drawer).
- [x] Header exibe título contextual por rota.
- [x] Wallet status aparece no header.
- [x] Navegação é clara com active state visual.
- [x] ProfileSwitcher disponível no header.

### Versionamento

- [x] Fazer commit semântico do Bloco 8.
- [x] Fazer push da branch após validação.

---

## 15. Bloco 9 — Dashboard

### Objetivo

Criar a tela inicial do sistema.

### Tasks

- [x] Criar `app/dashboard/page.tsx` (Server Component composto por widgets).
- [x] Criar `widgets/dashboard-metrics/ui/dashboard-metric-card.tsx` (card presentacional com loading skeleton).
- [x] Criar `widgets/dashboard-metrics/ui/dashboard-metrics.tsx` (grid 2-3-4 colunas, `useDashboardSummary` + `useContracts`).
- [x] Criar `widgets/dashboard-metrics/index.ts` (barrel).
- [x] Criar `widgets/dashboard-status-overview/ui/dashboard-status-overview.tsx` (barras por status, `useDashboardSummary`).
- [x] Criar `widgets/dashboard-status-overview/index.ts` (barrel).
- [x] Criar `widgets/dashboard-recent-contracts/ui/dashboard-recent-contracts.tsx` (5 contratos recentes, `useContracts`, link `/contracts/:id`).
- [x] Criar `widgets/dashboard-recent-contracts/index.ts` (barrel).
- [x] Criar `widgets/dashboard-alerts/ui/dashboard-alerts.tsx` (disputas em destaque, CTA `/disputes`).
- [x] Criar `widgets/dashboard-alerts/index.ts` (barrel).
- [x] Criar cards de métrica (total, criado, enviado, entregue, validado, pgto. autorizado, disputa, valor total).
- [x] Criar listagem de contratos recentes (5 mais recentes por updatedAt).
- [x] Criar resumo por status com barra de progresso visual.
- [x] Criar seção de alertas com estado positivo quando sem disputas.
- [x] Criar link rápido para novo contrato (botão no PageHeader).
- [x] Criar link para contratos em disputa (botão no DashboardAlerts).
- [x] Criar loading state (skeleton por widget).
- [x] Criar empty state (EmptyState em DashboardRecentContracts quando lista vazia).
- [x] Criar error state (ErrorState/mensagem em cada widget).
- [x] Atualizar `web/README.md` com seção Dashboard.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Métricas implementadas

```txt
Total de contratos        → summary.total
Criados                   → summary.criado
Enviados                  → summary.enviado
Entregues                 → summary.entregue
Validados                 → summary.validado
Pagamentos autorizados    → summary.pagamentoAutorizado
Em disputa                → summary.disputa
Valor total fiscalizado   → soma dos amounts via useContracts()
```

### Critérios de aceite

- [x] Dashboard funciona com mocks.
- [x] Cards possuem visual forte (variantes de cor por tipo).
- [x] Métricas batem com dados mockados.
- [x] Usuário consegue navegar para contrato (link em cada item recente).
- [x] Dashboard fica bom para print/demo.

### Versionamento

- [x] Fazer commit semântico do Bloco 9.
- [x] Fazer push da branch após validação.

---

## 16. Bloco 10 — Listagem de contratos

### Objetivo

Criar tela para visualizar e filtrar contratos.

### Tasks

- [x] Criar `pages/contracts/ui/contracts-page.tsx` (Client Component com estado e `useContracts`).
- [x] Criar `entities/contract/ui/contract-card.tsx` (card completo com link, status badge, valor, prazo).
- [x] Criar `entities/contract/ui/contract-amount.tsx` (componente de valor monetário reutilizável).
- [x] Criar `widgets/contracts-filters/` (busca, filtro status, filtro órgão, ordenação, limpar).
- [x] Criar `widgets/contracts-list/` (grid de ContractCard, empty state geral e de filtro).
- [x] Criar `widgets/contracts-summary-bar/` (total, disputas, autorizados, valor total).
- [x] Atualizar `app/contracts/page.tsx` (Server Component → delega para ContractsPage).
- [x] Criar busca por número/fornecedor/órgão/objeto.
- [x] Criar filtro por status (CRIADO, ENVIADO, ENTREGUE, VALIDADO, PAGAMENTO_AUTORIZADO, DISPUTA).
- [x] Criar filtro por órgão público (derivado dinamicamente dos dados).
- [x] Criar ordenação: mais recentes, mais antigos, maior valor, menor valor.
- [x] Criar botão para visualizar detalhe (link `/contracts/:id` em cada ContractCard).
- [x] Criar botão para novo contrato (PageHeader + EmptyState).
- [x] Criar loading state (skeleton em grade 1→2 colunas).
- [x] Criar empty state geral (sem contratos + CTA novo contrato).
- [x] Criar empty state de filtro (sem resultados + botão "Limpar filtros").
- [x] Criar error state (ErrorState com mensagem amigável).
- [x] Criar versão responsiva (filtros empilhados mobile, grid 1→2 colunas desktop).
- [x] Atualizar `web/README.md` com seção Listagem de contratos.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Critérios de aceite

- [x] Usuário consegue encontrar contratos (busca + filtros combinados).
- [x] Filtros funcionam com mocks.
- [x] Status aparece com `ContractStatusBadge` em cada card.
- [x] Cards são responsivos (grid 1 col mobile → 2 col desktop).
- [x] Clique em "Ver" abre `/contracts/:id` (detalhe implementado no Bloco 12).

### Versionamento

- [x] Fazer commit semântico do Bloco 10.
- [x] Fazer push da branch após validação.

---

## 17. Bloco 11 — Cadastro de contrato

### Objetivo

Criar formulário para criação de contrato.

### Tasks

- [x] Criar `app/contracts/new/_components/create-contract-page.tsx` (substituiu `pages/contracts/new`, evita conflito Next.js Pages Router).
- [x] Criar feature `features/create-contract/` (schema, form, barrel).
- [x] Criar `createContractSchema` (Zod) em `features/create-contract/model/`.
- [x] Criar `CreateContractForm` em `features/create-contract/ui/`.
- [x] Usar React Hook Form (`useForm` + `handleSubmit` + `register`).
- [x] Usar Zod resolver (`zodResolver`).
- [x] Validar campos obrigatórios (contractNumber, publicAgency, supplierName, object, amount, deadline, inspectorName, logisticsResponsible).
- [x] Validar valor maior que zero (`z.coerce.number().positive()`).
- [x] Validar endereço de wallet (regex `^0x[a-fA-F0-9]{40}$`) em todos os campos de carteira (opcional — vazio permitido).
- [x] Validar prazo/data (campo `type="date"` obrigatório).
- [x] Exibir mensagens de erro amigáveis (em português, abaixo de cada campo, `text-danger`).
- [x] Exibir toast de sucesso (via `useCreateContract` — toast interno à mutation).
- [x] Redirecionar para `/contracts` após criar (`useRouter().push('/contracts')` em `onSuccess`).
- [x] Criar loading no botão (`mutation.isPending` → "Salvando...").
- [x] Criar estado de erro da mutation (toast.error via `useCreateContract` — tratamento interno à mutation).
- [x] Atualizar `app/contracts/new/page.tsx` (Server Component → delega para CreateContractPage).
- [x] Atualizar `web/README.md` com seção "Cadastro de contrato".
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Campos mínimos

```txt
contractNumber     (obrigatório, mín. 3 chars)
publicAgency       (obrigatório)
supplierName       (obrigatório)
supplierWallet     (opcional, validação wallet se preenchido)
object             (obrigatório, mín. 10 chars)
amount             (obrigatório, > 0)
deadline           (obrigatório, date input)
inspectorName      (obrigatório)
inspectorWallet    (opcional, validação wallet se preenchido)
logisticsResponsible (obrigatório)
logisticsWallet    (opcional, validação wallet se preenchido)
managerName        (opcional)
managerWallet      (opcional, validação wallet se preenchido)
documentHash       (opcional, mín. 16 chars se preenchido)
```

### Critérios de aceite

- [x] Formulário não envia dados inválidos.
- [x] Formulário segue contrato API (`CreateContractPayload`).
- [x] UX de erro é clara (mensagem abaixo de cada campo + `aria-invalid`).
- [x] UX de sucesso é clara (toast + redirect para /contracts).
- [x] Após criar, usuário é redirecionado para a listagem de contratos.

### Versionamento

- [x] Fazer commit semântico do Bloco 11.
- [x] Fazer push da branch após validação.

---

## 18. Bloco 12 — Detalhe do contrato

### Objetivo

Criar a tela mais importante da demo.

### Tasks

- [x] Criar `app/contracts/[id]/page.tsx` (Server Component, await params, passa id para Client).
- [x] Criar `app/contracts/[id]/_components/contract-detail-page.tsx` (Client Component, 3 hooks).
- [x] Criar `ContractOverviewCard` — resumo principal, progresso visual, valor, prazo.
- [x] Criar `ContractPartiesCard` — gestor, fornecedor, fiscal, logística com wallets.
- [x] Criar `ContractHashesCard` — documentHash, blockchainContractId, transactionHash.
- [x] Criar `ContractBlockchainCard` — status on-chain, explorer link, blockNumber, timestamp.
- [x] Criar `ContractNextActionCard` — próxima ação por perfil via `getNextContractAction`.
- [x] Criar `ContractEventsPreview` — últimos 3 eventos com CTA "Timeline completa no Bloco 13".
- [x] Criar `ContractDisputeAlert` — alerta de disputa com pagamento bloqueado.
- [x] Usar `useContractById(id)`.
- [x] Usar `useContractEvents(id)`.
- [x] Usar `useBlockchainStatus(id)`.
- [x] Criar status atual em destaque no `PageHeader` (badge).
- [x] Criar área de hashes com `CopyButton` e `shortenHash`.
- [x] Criar link para explorer (`env.explorerUrl/tx/:hash`).
- [x] Criar alerta se estiver em DISPUTA.
- [x] Criar loading state (skeleton da página inteira).
- [x] Criar error state (`ErrorState` com botão voltar).
- [x] Criar not found state (`EmptyState` com botão voltar para /contracts).
- [x] Atualizar `web/README.md` com seção "Detalhe do contrato".
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Limites do bloco (intencional)

- [ ] Timeline auditável completa → Bloco 13
- [ ] Painel de ações final → Bloco 14
- [ ] Modal de disputa → Bloco 14
- [ ] Simulação de fraude → Bloco 14

### Critérios de aceite

- [x] Usuário entende rapidamente o status do contrato.
- [x] Usuário entende qual é a próxima etapa (por perfil via `useProfileStore`).
- [x] Ações são exibidas conforme status/perfil (próxima ação ou motivo de bloqueio).
- [x] Eventos recentes aparecem na mesma tela.
- [x] Hash/tx hash ficam visíveis com CopyButton.
- [x] Tela é convincente para apresentação.

### Versionamento

- [x] Fazer commit semântico do Bloco 12.
- [x] Fazer push da branch após validação.

---

## 19. Bloco 13 — Timeline auditável ✅

### Objetivo

Criar componente visual de auditoria do contrato.

### Tasks

- [x] Criar `ContractTimeline` em `app/contracts/[id]/_components/` (Client Component, Framer Motion).
- [x] Criar `entities/contract-event/ui/ContractEventCard` — card completo de evento.
- [x] Criar `entities/contract-event/ui/EventTypeIcon` — ícone Lucide por ContractEventType.
- [x] Criar label por event type (via `EVENT_TYPE_MAP`).
- [x] Criar `entities/contract-event/ui/StatusTransition` — statusBefore → statusAfter.
- [x] Exibir responsável (`responsibleName`).
- [x] Exibir role (`RoleBadge`).
- [x] Exibir data/hora (`formatDateTimeBR`).
- [x] Criar `entities/contract-event/ui/DocumentHashViewer` — documentHash + CopyButton.
- [x] Exibir transactionHash via `TransactionHashLink`.
- [x] Criar `entities/transaction/ui/TransactionHashLink` — explorer link + CopyButton.
- [x] Criar estado vazio (EmptyState "Nenhum evento registrado").
- [x] Criar animação de entrada (Framer Motion, stagger 0.06s).
- [x] Substituir `ContractEventsPreview` por `ContractTimeline` em `contract-detail-page.tsx`.

### Critérios de aceite

- [x] Cada evento é compreensível — label + descrição + timestamp + responsável.
- [x] Hash é legível e copiável — `shortenHash(val, 6)` + `CopyButton`.
- [x] Tx hash possui link quando possível — `env.explorerUrl/tx/:hash` com ExternalLink.
- [x] Timeline reforça a ideia de auditoria — ordem cronológica, conector vertical, ícones por tipo.
- [x] Timeline é visualmente forte — Framer Motion stagger, ícones coloridos, RoleBadge ciano.

### Limites intenciais

- [ ] Painel de ações final → Bloco 14
- [ ] Modal de disputa → Bloco 14
- [ ] Simulação de fraude → Bloco 14

### Commit

`feat(frontend): implement auditable contract timeline` — commit pendente após validação.

---

## 20. Bloco 14 — Painel de ações do contrato ✅

### Objetivo

Criar ações de avanço de status.

### Tasks

- [x] Criar `features/contract-actions/ui/contract-action-panel.tsx` — painel principal.
- [x] Criar `features/contract-actions/ui/action-button.tsx` — botão reutilizável.
- [x] Criar `features/contract-actions/ui/confirm-dialog.tsx` — dialog reutilizável.
- [x] Criar feature `confirm-shipment-action` (FORNECEDOR + CRIADO).
- [x] Criar feature `confirm-delivery-action` (ENTREGADOR + ENVIADO).
- [x] Criar feature `validate-receipt-action` (FISCAL + ENTREGUE).
- [x] Criar feature `authorize-payment-action` (GESTOR + VALIDADO) + confirmação crítica.
- [x] Criar feature `open-dispute-action` + dialog com motivo obrigatório.
- [x] Criar feature `simulate-fraud-action` + dialog com novo hash + motivo opcional.
- [x] Criar feature `register-on-chain-action` + confirmação + badge se já registrado.
- [x] Criar botões por ação via `ActionButton`.
- [x] Criar dialogs de confirmação via `ConfirmDialog` (Dialog shadcn/ui).
- [x] Criar estados de loading nos botões (isPending por mutation).
- [x] Criar estados disabled com razão explicativa (`getBlockedActionReason`).
- [x] Toast de sucesso e erro — via hooks de mutation (Bloco 7).
- [x] Invalidar queries após ação — via hooks de mutation (Bloco 7).
- [x] Timeline atualiza após ação — invalidação de contractEvents nas mutations.
- [x] Adicionar `getCanonicalNextAction` e `CONTRACT_ACTION_LABELS` em `rules.ts`.
- [x] Substituir `ContractNextActionCard` por `ContractActionPanel` em `contract-detail-page.tsx`.
- [x] Deletar `contract-next-action-card.tsx`.
- [x] Criar `features/contract-actions/index.ts` (barrel).
- [x] Atualizar `web/README.md` — seção "Painel de ações do contrato".
- [x] Fazer commit semântico do Bloco 14.
- [x] Fazer push da branch após validação.

### Critérios de aceite

- [ ] Botões não aparecem de forma aleatória.
- [ ] Usuário entende por que uma ação está bloqueada.
- [ ] Cada ação atualiza o status.
- [x] Botões não aparecem de forma aleatória — regras visuais via `getAvailableContractActions`.
- [x] Usuário entende por que uma ação está bloqueada — `getBlockedActionReason` + `getCanonicalNextAction`.
- [x] Cada ação atualiza o status — mutations invalidam `contract`, `contracts`, `contractEvents`, `dashboardSummary`.
- [x] Cada ação cria/mostra evento — mutations do Bloco 7 criam eventos no mock store.
- [x] A demo consegue seguir o fluxo completo — `ProfileSwitcher` no header para trocar perfil.

### Limites intenciais

- [ ] Fluxo completo de disputa/fraude → Bloco 15
- [ ] Modal avançado de disputa → Bloco 15
- [ ] Visual de comparação de hashes → Bloco 15
- [ ] Tela dedicada de disputas → Bloco 15

---

## 21. Bloco 15 — Disputa e fraude simulada

### Objetivo

Criar cena de impacto para demo.

### Tasks

- [ ] Criar modal de abertura de disputa.
- [ ] Criar `openDisputeSchema`.
- [ ] Criar campo de motivo.
- [ ] Criar seleção de tipo de divergência.
- [ ] Criar feature `simulate-fraud`.
- [ ] Criar visual comparando hash original e hash alterado.
- [ ] Criar alerta de hash incompatível.
- [ ] Criar estado `DISPUTA`.
- [ ] Bloquear visualmente autorização de pagamento.
- [ ] Registrar/exibir evento `FRAUDE_SIMULADA`.
- [ ] Registrar/exibir evento `DISPUTA_ABERTA`.
- [ ] Criar animação/efeito visual de alerta.
- [ ] Criar CTA para consultar timeline.

### Critérios de aceite

- [ ] Usuário entende que houve divergência.
- [ ] O impacto visual é forte.
- [ ] Pagamento aparece bloqueado.
- [ ] Timeline prova o ocorrido.
- [ ] Cena serve para apresentação final.

---

## 22. Bloco 16 — Wallet e perfil visual

### Objetivo

Criar integração visual com carteira e perfis.

### Tasks

- [ ] Criar feature `connect-wallet`.
- [ ] Criar `WalletConnectButton`.
- [ ] Criar `WalletStatus`.
- [ ] Exibir endereço curto.
- [ ] Exibir rede atual.
- [ ] Exibir alerta de rede incorreta.
- [ ] Exibir link para explorer da carteira, se aplicável.
- [ ] Criar perfil mockado via Zustand.
- [ ] Criar seletor de perfil para demo.
- [ ] Relacionar perfil visual com permissões.
- [ ] Preparar integração futura com assinatura de mensagem.

### Importante

No MVP, autenticação Web3 real completa não é responsabilidade obrigatória do frontend.

A prioridade é:

```txt
Conectar wallet visualmente
Exibir endereço
Permitir demo por perfil
Preparar integração futura
```

### Critérios de aceite

- [ ] Wallet conecta visualmente.
- [ ] Endereço aparece encurtado.
- [ ] Perfil atual aparece na interface.
- [ ] Botões mudam conforme perfil/status.
- [ ] Não há dependência obrigatória de backend para demonstrar perfil.

---

## 23. Bloco 17 — Auditoria e tela de consulta

### Objetivo

Criar tela ou área para reforçar rastreabilidade.

### Tasks

- [ ] Criar `pages/audit`.
- [ ] Exibir contratos com eventos críticos.
- [ ] Exibir filtros por status.
- [ ] Exibir filtros por evento.
- [ ] Exibir hashes recentes.
- [ ] Exibir tx hashes recentes.
- [ ] Criar cards de auditoria.
- [ ] Criar CTA para abrir detalhe do contrato.
- [ ] Criar empty/loading/error states.

### Critérios de aceite

- [ ] A tela reforça o valor de auditoria.
- [ ] Auditor consegue consultar eventos.
- [ ] Interface mostra rastreabilidade.
- [ ] Tela pode ser usada na demo se houver tempo.

---

## 24. Bloco 18 — Responsividade e polish visual

### Objetivo

Garantir qualidade visual e usabilidade.

### Tasks

- [ ] Revisar desktop.
- [ ] Revisar notebook.
- [ ] Revisar tablet.
- [ ] Revisar mobile.
- [ ] Ajustar sidebar mobile.
- [ ] Ajustar tabelas/cards em telas pequenas.
- [ ] Ajustar formulários.
- [ ] Ajustar espaçamentos.
- [ ] Ajustar contraste.
- [ ] Ajustar animações.
- [ ] Ajustar estados hover/focus.
- [ ] Ajustar acessibilidade básica.
- [ ] Garantir que textos não estourem.
- [ ] Garantir que hashes longos não quebrem layout.
- [ ] Criar copy-to-clipboard para hashes.

### Critérios de aceite

- [ ] A aplicação é utilizável em mobile.
- [ ] A demo fica excelente em desktop.
- [ ] Não existem quebras visuais graves.
- [ ] Hashes e tx hashes são legíveis.
- [ ] Interface mantém padrão profissional.

---

## 25. Bloco 19 — Integração com API real

### Objetivo

Trocar mocks por API real quando Pessoa 3 liberar backend.

### Tasks

- [ ] Confirmar `NEXT_PUBLIC_API_URL`.
- [ ] Desativar mocks com `NEXT_PUBLIC_ENABLE_MOCKS=false`.
- [ ] Testar `GET /dashboard/summary`.
- [ ] Testar `GET /contracts`.
- [ ] Testar `POST /contracts`.
- [ ] Testar `GET /contracts/:id`.
- [ ] Testar `GET /contracts/:id/events`.
- [ ] Testar `POST /contracts/:id/confirm-shipment`.
- [ ] Testar `POST /contracts/:id/confirm-delivery`.
- [ ] Testar `POST /contracts/:id/validate-receipt`.
- [ ] Testar `POST /contracts/:id/authorize-payment`.
- [ ] Testar `POST /contracts/:id/open-dispute`.
- [ ] Testar `POST /contracts/:id/simulate-fraud`.
- [ ] Testar `GET /contracts/:id/blockchain-status`.
- [ ] Testar `POST /contracts/:id/register-on-chain`.
- [ ] Ajustar pequenos detalhes de payload apenas se o contrato API permitir.
- [ ] Reportar divergências para Pessoa 3, sem alterar backend diretamente.

### Critérios de aceite

- [ ] Frontend consome API real.
- [ ] Erros da API aparecem de forma amigável.
- [ ] Timeline atualiza com dados reais.
- [ ] Actions funcionam ponta a ponta.
- [ ] Mocks ainda podem ser reativados para demo/plano B.

---

## 26. Bloco 20 — Preparação da demo frontend

### Objetivo

Deixar o frontend pronto para apresentação.

### Tasks

- [ ] Criar contrato demo com dados realistas.
- [ ] Criar fluxo feliz completo.
- [ ] Criar fluxo de disputa.
- [ ] Criar fluxo de fraude simulada.
- [ ] Preparar tela inicial limpa.
- [ ] Preparar roteiro de cliques.
- [ ] Garantir que botões principais estejam visíveis.
- [ ] Garantir que os dados mockados contem uma história.
- [ ] Garantir que loading não atrapalhe a demo.
- [ ] Criar plano B com mocks ativados.
- [ ] Testar apresentação em tela cheia.
- [ ] Fazer ensaio de 5 minutos.

### Critérios de aceite

- [ ] A demo pode ser feita sem improviso.
- [ ] O fluxo completo funciona.
- [ ] A fraude gera impacto visual.
- [ ] O valor da solução fica claro.
- [ ] Existe plano B caso backend falhe.

---

## 27. Checklist resumido por prioridade

## Prioridade P0 — Fundação obrigatória

- [ ] Criar projeto Next.js App Router.
- [ ] Configurar TypeScript.
- [ ] Configurar TailwindCSS.
- [ ] Configurar shadcn/ui.
- [ ] Criar estrutura Feature-Sliced Design.
- [ ] Configurar providers globais.
- [ ] Criar design tokens.
- [ ] Criar tipos oficiais.
- [ ] Criar mocks compatíveis com API.
- [ ] Criar httpClient.
- [ ] Criar hooks TanStack Query base.

## Prioridade P1 — Produto principal

- [ ] Criar layout base.
- [ ] Criar dashboard.
- [ ] Criar listagem de contratos.
- [ ] Criar cadastro de contrato.
- [ ] Criar detalhe do contrato.
- [ ] Criar timeline auditável.
- [ ] Criar painel de ações.
- [ ] Criar fluxo visual por status.
- [ ] Criar permissões visuais por perfil.
- [ ] Criar loading/error/empty states.

## Prioridade P2 — Diferencial Web3/demo

- [ ] Criar integração visual com wallet.
- [ ] Exibir documentHash.
- [ ] Exibir transactionHash.
- [ ] Criar link para explorer.
- [ ] Criar disputa.
- [ ] Criar simulação de fraude.
- [ ] Criar alerta visual de hash divergente.
- [ ] Criar tela de auditoria, se houver tempo.

## Prioridade P3 — Integração e polish

- [ ] Integrar API real.
- [ ] Ajustar payloads conforme contrato.
- [ ] Revisar responsividade.
- [ ] Revisar acessibilidade básica.
- [ ] Revisar animações.
- [ ] Preparar demo.
- [ ] Criar plano B com mocks.

---

## 28. Definition of Done do Frontend

O frontend pode ser considerado pronto quando:

- [ ] O projeto roda localmente sem erro.
- [ ] O build passa.
- [ ] A arquitetura FSD está respeitada.
- [ ] O design system está aplicado.
- [ ] O dashboard funciona.
- [ ] A listagem funciona.
- [ ] O cadastro funciona.
- [ ] O detalhe funciona.
- [ ] A timeline funciona.
- [ ] As ações por status funcionam.
- [ ] As permissões visuais funcionam.
- [ ] A disputa funciona.
- [ ] A fraude simulada funciona.
- [ ] Wallet conecta visualmente.
- [ ] documentHash aparece.
- [ ] transactionHash aparece ou é simulado claramente.
- [ ] Explorer link aparece quando houver tx hash.
- [ ] Loading states existem.
- [ ] Error states existem.
- [ ] Empty states existem.
- [ ] O frontend funciona com mocks.
- [ ] O frontend está preparado para API real.
- [ ] A interface está responsiva.
- [ ] Existe plano B para demo.
- [ ] A demo pode ser apresentada em menos de 5 minutos.

---

## 29. Ordem recomendada para executar no Claude Code/Codex

Use esta ordem para evitar confusão:

```txt
1. Fundação do projeto
2. FSD + providers + design system
3. Tipos oficiais + mocks + API client
4. Layout base
5. Dashboard
6. Listagem
7. Cadastro
8. Detalhe
9. Timeline
10. Painel de ações
11. Disputa/fraude
12. Wallet
13. Integração API real
14. Responsividade
15. Demo
```

Não peça tudo de uma vez.

Faça por blocos.

---

## 30. Prompt inicial recomendado para iniciar implementação frontend

```txt
Você é um desenvolvedor frontend sênior especialista em Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, Feature-Sliced Design, TanStack Query, Zustand, React Hook Form, Zod, wagmi, viem e RainbowKit.

Estamos iniciando a implementação do frontend do FiscalizaPay Web3.

Antes de codar, leia estes documentos:

- Docs/Contratos_tecnicos/contrato_api_frontend_backend.md
- Docs/Governanca_tecnica/decisoes_tecnicas_finais.md
- Docs/Governanca_tecnica/glossario_tecnico_oficial.md
- Docs/Governanca_tecnica/criterios_aceite_mvp.md
- Docs/Planos_implementacao/plano_implementacao_frontend.md
- Docs/Base_do_projeto/oraculum_design_system.md
- Docs/Cronograma/Tasks_Frontend_implementation.md

Sua primeira tarefa é implementar apenas o Bloco 1 e o Bloco 2 deste arquivo:

- Criação e configuração do projeto
- Providers globais

Não implemente telas ainda.
Não implemente backend.
Não implemente smart contract.
Não altere documentos de backend.

Ao final, entregue um feedback com:
- arquivos criados
- dependências instaladas
- estrutura criada
- pendências
- próximo bloco recomendado
```

---

## 31. Observação final

O checklist anterior era bom para visão de equipe, mas este documento deve ser usado como checklist operacional da Pessoa 2.

A regra principal é:

```txt
Frontend começa mockado, bem estruturado, visualmente forte e pronto para integração.
```

A Pessoa 2 não deve esperar o backend ficar pronto para começar.

O frontend deve nascer com:

```txt
arquitetura correta
mocks corretos
contrato API respeitado
componentes reutilizáveis
design system consistente
fluxo completo demonstrável
```
