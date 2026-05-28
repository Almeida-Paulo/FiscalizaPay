# FiscalizaPay Web3 — Plano de Implementação Frontend

> **Responsável:** Pessoa 2 — Frontend / UI Lead  
> **Referências:** `contrato_api_frontend_backend.md` | `glossario_tecnico_oficial.md` | `criterios_aceite_mvp.md`

---

## 1. Objetivo

Construir o frontend do FiscalizaPay Web3 como um sistema SaaS/Web3 profissional, escalável e preparado para integração com backend real.

O frontend deve:

- renderizar todas as telas do fluxo principal;
- operar com mocks controlados enquanto o backend não estiver pronto;
- consumir a API real quando o backend estiver disponível, sem alterar componentes;
- demonstrar a proposta de valor do FiscalizaPay de forma visual e convincente.

---

## 2. Stack

```txt
Next.js App Router   → framework e roteamento
TypeScript (strict)  → tipagem em todo o projeto
TailwindCSS          → estilização
shadcn/ui            → base de componentes
Framer Motion        → animações e transições
TanStack Query v5    → dados remotos e cache
Zustand              → estado global local
React Hook Form      → formulários
Zod                  → validação de formulários
wagmi + viem         → integração Web3
RainbowKit           → UI de conexão de wallet
Lucide React         → ícones
```

---

## 3. Estrutura de Pastas (Feature-Sliced Design)

```txt
web/
└── src/
    ├── app/
    │   ├── providers/
    │   │   ├── QueryProvider.tsx        → TanStack Query
    │   │   ├── Web3Provider.tsx         → wagmi + RainbowKit
    │   │   └── index.tsx
    │   ├── styles/
    │   │   └── globals.css
    │   ├── layout.tsx
    │   └── page.tsx                     → redireciona para /dashboard
    │
    ├── pages/
    │   ├── dashboard/
    │   │   └── index.tsx
    │   ├── contracts/
    │   │   └── index.tsx                → listagem
    │   ├── contracts/new/
    │   │   └── index.tsx                → cadastro
    │   ├── contracts/[id]/
    │   │   └── index.tsx                → detalhe
    │   ├── audit/
    │   │   └── index.tsx
    │   └── disputes/
    │       └── index.tsx
    │
    ├── widgets/
    │   ├── app-sidebar/
    │   │   ├── ui/
    │   │   │   └── AppSidebar.tsx
    │   │   └── index.ts
    │   ├── app-header/
    │   │   ├── ui/
    │   │   │   └── AppHeader.tsx
    │   │   └── index.ts
    │   ├── dashboard-metrics/
    │   │   ├── ui/
    │   │   │   └── DashboardMetrics.tsx
    │   │   └── index.ts
    │   ├── contract-timeline/
    │   │   ├── ui/
    │   │   │   └── ContractTimeline.tsx
    │   │   └── index.ts
    │   ├── contract-action-panel/
    │   │   ├── ui/
    │   │   │   └── ContractActionPanel.tsx
    │   │   └── index.ts
    │   ├── wallet-status/
    │   │   ├── ui/
    │   │   │   └── WalletStatus.tsx
    │   │   └── index.ts
    │   └── audit-summary/
    │       ├── ui/
    │       │   └── AuditSummary.tsx
    │       └── index.ts
    │
    ├── features/
    │   ├── create-contract/
    │   │   ├── ui/
    │   │   │   └── CreateContractForm.tsx
    │   │   ├── model/
    │   │   │   ├── useCreateContract.ts
    │   │   │   └── createContractSchema.ts
    │   │   ├── api/
    │   │   │   └── createContractApi.ts
    │   │   └── index.ts
    │   ├── confirm-shipment/
    │   │   ├── ui/
    │   │   │   └── ConfirmShipmentButton.tsx
    │   │   ├── model/
    │   │   │   └── useConfirmShipment.ts
    │   │   └── index.ts
    │   ├── confirm-delivery/
    │   │   ├── ui/
    │   │   │   └── ConfirmDeliveryButton.tsx
    │   │   ├── model/
    │   │   │   └── useConfirmDelivery.ts
    │   │   └── index.ts
    │   ├── validate-receipt/
    │   │   ├── ui/
    │   │   │   └── ValidateReceiptButton.tsx
    │   │   ├── model/
    │   │   │   └── useValidateReceipt.ts
    │   │   └── index.ts
    │   ├── authorize-payment/
    │   │   ├── ui/
    │   │   │   └── AuthorizePaymentButton.tsx
    │   │   ├── model/
    │   │   │   └── useAuthorizePayment.ts
    │   │   └── index.ts
    │   ├── open-dispute/
    │   │   ├── ui/
    │   │   │   └── OpenDisputeDialog.tsx
    │   │   ├── model/
    │   │   │   ├── useOpenDispute.ts
    │   │   │   └── openDisputeSchema.ts
    │   │   └── index.ts
    │   ├── simulate-fraud/
    │   │   ├── ui/
    │   │   │   └── SimulateFraudPanel.tsx
    │   │   ├── model/
    │   │   │   └── useSimulateFraud.ts
    │   │   └── index.ts
    │   └── connect-wallet/
    │       ├── ui/
    │       │   └── WalletConnectButton.tsx
    │       ├── model/
    │       │   └── useConnectWallet.ts
    │       └── index.ts
    │
    ├── entities/
    │   ├── contract/
    │   │   ├── model/
    │   │   │   ├── types.ts             → Contract, ContractStatus
    │   │   │   ├── constants.ts         → contractStatusMap (label + cor)
    │   │   │   └── rules.ts             → canConfirmShipment, canAuthorizePayment, etc.
    │   │   ├── api/
    │   │   │   ├── useContracts.ts
    │   │   │   └── useContractById.ts
    │   │   ├── ui/
    │   │   │   ├── ContractCard.tsx
    │   │   │   ├── ContractStatusBadge.tsx
    │   │   │   └── ContractAmount.tsx
    │   │   └── index.ts
    │   ├── contract-event/
    │   │   ├── model/
    │   │   │   ├── types.ts             → ContractEvent, ContractEventType
    │   │   │   └── constants.ts         → eventTypeMap (label + ícone)
    │   │   ├── api/
    │   │   │   └── useContractEvents.ts
    │   │   ├── ui/
    │   │   │   └── ContractEventCard.tsx
    │   │   └── index.ts
    │   ├── profile/
    │   │   ├── model/
    │   │   │   ├── types.ts             → Profile, UserRole
    │   │   │   └── store.ts             → Zustand store de perfil simulado
    │   │   ├── ui/
    │   │   │   └── RoleBadge.tsx
    │   │   └── index.ts
    │   ├── dashboard/
    │   │   ├── model/
    │   │   │   └── types.ts             → DashboardSummary
    │   │   ├── api/
    │   │   │   └── useDashboardSummary.ts
    │   │   └── index.ts
    │   └── wallet/
    │       ├── model/
    │       │   └── types.ts
    │       ├── ui/
    │       │   └── WalletAddress.tsx
    │       └── index.ts
    │
    └── shared/
        ├── api/
        │   └── httpClient.ts
        ├── config/
        │   └── env.ts                   → variáveis de ambiente tipadas
        ├── constants/
        │   └── queryKeys.ts
        ├── hooks/
        │   └── useDebounce.ts
        ├── lib/
        │   └── utils.ts                 → cn(), formatAmount(), formatDate()
        ├── mocks/
        │   ├── contracts.mock.ts
        │   ├── events.mock.ts
        │   ├── dashboard.mock.ts
        │   └── profiles.mock.ts
        ├── types/
        │   └── api.ts                   → ApiResponse, ApiError
        └── ui/
            ├── EmptyState.tsx
            ├── ErrorState.tsx
            ├── LoadingState.tsx
            ├── PageHeader.tsx
            ├── PermissionGate.tsx
            ├── TransactionHashLink.tsx
            └── DocumentHashViewer.tsx
```

---

## 4. Ordem de Implementação

Execute nesta ordem para garantir que cada etapa seja demonstrável:

### Bloco 1 — Fundação (Day 1)

```txt
[  ] 1. Criar projeto Next.js com App Router e TypeScript
         npx create-next-app@latest web --typescript --tailwind --app --src-dir

[  ] 2. Configurar TailwindCSS com design tokens
         tailwind.config.ts → cores custom do design system

[  ] 3. Instalar e configurar shadcn/ui
         npx shadcn@latest init

[  ] 4. Instalar dependências principais
         npm install @tanstack/react-query zustand react-hook-form zod
         npm install framer-motion lucide-react
         npm install wagmi viem @rainbow-me/rainbowkit

[  ] 5. Configurar aliases de importação no tsconfig.json
         "@/app/*", "@/pages/*", "@/widgets/*",
         "@/features/*", "@/entities/*", "@/shared/*"

[  ] 6. Criar estrutura de pastas Feature-Sliced Design

[  ] 7. Criar shared/config/env.ts com variáveis de ambiente tipadas

[  ] 8. Criar shared/types/api.ts com ApiResponse e ApiError

[  ] 9. Criar shared/api/httpClient.ts

[  ] 10. Criar shared/constants/queryKeys.ts

[  ] 11. Configurar app/providers/ (QueryProvider + Web3Provider)
```

### Bloco 2 — Design System (Day 1-2)

```txt
[  ] 12. Aplicar paleta dark no globals.css e tailwind.config.ts
          Background: #050816 | Cards: #0F172A | Primary: #22D3EE

[  ] 13. Criar shared/ui/EmptyState.tsx
[  ] 14. Criar shared/ui/ErrorState.tsx
[  ] 15. Criar shared/ui/LoadingState.tsx (Skeleton)
[  ] 16. Criar shared/ui/PageHeader.tsx
[  ] 17. Criar shared/ui/PermissionGate.tsx
[  ] 18. Criar shared/ui/TransactionHashLink.tsx
[  ] 19. Criar shared/ui/DocumentHashViewer.tsx

[  ] 20. Criar entities/contract/ui/ContractStatusBadge.tsx
          CRIADO=cinza | ENVIADO=azul | ENTREGUE=amarelo |
          VALIDADO=verde | PAGAMENTO_AUTORIZADO=verde | DISPUTA=vermelho

[  ] 21. Criar entities/profile/ui/RoleBadge.tsx

[  ] 22. Criar widgets/app-sidebar/
[  ] 23. Criar widgets/app-header/
[  ] 24. Criar app/layout.tsx com sidebar + header + providers
```

### Bloco 3 — Mocks e Entidades (Day 2)

```txt
[  ] 25. Criar shared/mocks/contracts.mock.ts (5-8 contratos com status variados)
[  ] 26. Criar shared/mocks/events.mock.ts (timeline completa para 1-2 contratos)
[  ] 27. Criar shared/mocks/dashboard.mock.ts
[  ] 28. Criar shared/mocks/profiles.mock.ts

[  ] 29. Criar entities/contract/model/types.ts
[  ] 30. Criar entities/contract/model/constants.ts (contractStatusMap)
[  ] 31. Criar entities/contract/model/rules.ts
          canConfirmShipment, canConfirmDelivery, canValidateReceipt,
          canAuthorizePayment, canOpenDispute

[  ] 32. Criar entities/contract/api/useContracts.ts
[  ] 33. Criar entities/contract/api/useContractById.ts
[  ] 34. Criar entities/contract-event/api/useContractEvents.ts
[  ] 35. Criar entities/dashboard/api/useDashboardSummary.ts
[  ] 36. Criar entities/profile/model/store.ts (Zustand — perfil simulado)
```

### Bloco 4 — Telas Principais (Day 2-3)

```txt
[  ] 37. Criar pages/dashboard/ com widgets/dashboard-metrics/
[  ] 38. Criar entities/contract/ui/ContractCard.tsx
[  ] 39. Criar pages/contracts/ (listagem com filtro por status)
[  ] 40. Criar pages/contracts/new/ com features/create-contract/
[  ] 41. Criar pages/contracts/[id]/ (detalhe)
[  ] 42. Criar widgets/contract-timeline/ com entities/contract-event/ui/ContractEventCard.tsx
```

### Bloco 5 — Ações e Permissões (Day 3)

```txt
[  ] 43. Criar widgets/contract-action-panel/
[  ] 44. Criar features/confirm-shipment/ (botão + hook + mutation)
[  ] 45. Criar features/confirm-delivery/
[  ] 46. Criar features/validate-receipt/
[  ] 47. Criar features/authorize-payment/
[  ] 48. Criar features/open-dispute/ (dialog com campo de motivo)
[  ] 49. Aplicar PermissionGate em todos os botões de ação
```

### Bloco 6 — Wallet e Fraude (Day 3-4)

```txt
[  ] 50. Criar features/connect-wallet/ com RainbowKit
[  ] 51. Criar widgets/wallet-status/
[  ] 52. Criar features/simulate-fraud/ com DocumentHashViewer
[  ] 53. Criar shared/ui/TransactionHashLink.tsx com link para explorer
```

### Bloco 7 — Integração com API Real (Day 4)

```txt
[  ] 54. Remover mocks (ou manter ativados por NEXT_PUBLIC_ENABLE_MOCKS)
[  ] 55. Apontar NEXT_PUBLIC_API_URL para o backend real
[  ] 56. Testar cada endpoint do contrato API
[  ] 57. Ajustar erros e feedbacks da API no frontend
[  ] 58. Testar fluxo completo ponta a ponta
```

---

## 5. Componentes Base (shadcn/ui a instalar)

```txt
button
card
badge
input
textarea
select
dialog
sheet
tabs
table
tooltip
toast (sonner)
skeleton
dropdown-menu
separator
avatar
scroll-area
```

---

## 6. Entidades e Responsabilidades

| Entidade | Responsabilidade |
|---|---|
| `entities/contract` | Tipos, regras, hooks de busca e cards visuais de contrato |
| `entities/contract-event` | Tipos e cards visuais de evento da timeline |
| `entities/profile` | Tipos, store Zustand de perfil simulado, badge de role |
| `entities/dashboard` | Tipos e hook de busca do summary |
| `entities/wallet` | Tipos e display de endereço Web3 |

---

## 7. Features e Responsabilidades

| Feature | Responsabilidade |
|---|---|
| `create-contract` | Formulário de criação com validação Zod + mutation |
| `confirm-shipment` | Botão + hook de mutação para FORNECEDOR |
| `confirm-delivery` | Botão + hook de mutação para ENTREGADOR |
| `validate-receipt` | Botão + hook de mutação para FISCAL |
| `authorize-payment` | Botão + hook de mutação para GESTOR |
| `open-dispute` | Dialog com motivo + hook de mutação |
| `simulate-fraud` | Painel de simulação com input de hash + comparação visual |
| `connect-wallet` | Botão RainbowKit + hook wagmi |

---

## 8. Widgets e Responsabilidades

| Widget | Responsabilidade |
|---|---|
| `app-sidebar` | Navegação principal com logo, links e indicador de rota ativa |
| `app-header` | Topbar com breadcrumb, wallet status e selector de perfil |
| `dashboard-metrics` | Cards de métricas por status do dashboard |
| `contract-timeline` | Linha do tempo vertical de eventos com animação |
| `contract-action-panel` | Painel de ações disponíveis baseado em status + role |
| `wallet-status` | Display do endereço conectado e rede |
| `audit-summary` | Resumo de hashes e transações de auditoria |

---

## 9. Telas Principais

### 9.1 Dashboard (`/dashboard`)

- Métricas: total, por status, em disputa.
- Lista rápida dos últimos contratos.
- Botão "Novo contrato".
- Indicador de wallet conectada.

### 9.2 Listagem de Contratos (`/contracts`)

- Tabela ou cards.
- Filtro por status com badges.
- Busca por número de contrato ou fornecedor.
- Badge de status colorido.
- Ação: "Ver detalhes".

### 9.3 Cadastro de Contrato (`/contracts/new`)

- Formulário completo com validação.
- Campos obrigatórios marcados.
- Feedback de sucesso → redireciona para detalhe.
- Feedback de erro da API.

### 9.4 Detalhe do Contrato (`/contracts/[id]`)

- Dados completos do contrato.
- Status atual com badge.
- Próxima etapa indicada.
- Painel de ações (ContractActionPanel) → botões por status e role.
- Timeline auditável (ContractTimeline).
- DocumentHash e TransactionHash visíveis.
- Botão de abrir disputa.
- Botão de simular fraude.

### 9.5 Timeline Auditável (componente dentro do detalhe)

- Cada evento: tipo, responsável, role, data, status anterior → status novo.
- Hash do documento (se existir).
- Transaction hash com link para explorer.
- Ícone diferente por tipo de evento.
- Animação de entrada com Framer Motion.
- Evento de disputa em vermelho com alerta.

### 9.6 Simulação de Fraude (painel no detalhe)

- Campo para inserir "hash alterado".
- Botão "Simular alteração".
- Comparação visual: hash original vs hash novo.
- Alerta visual quando hashes divergem.
- Resultado: disputa aberta visualmente.

---

## 10. Mocks

### Estratégia de mocks

```ts
// shared/api/httpClient.ts
const MOCKS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_MOCKS === "true";

export async function httpClient<T>(path: string, options?: RequestInit): Promise<T> {
  if (MOCKS_ENABLED) {
    return getMockResponse<T>(path, options);
  }
  // implementação real
}
```

### Regras dos mocks

1. Mocks devem retornar exatamente o formato `{ data: T, message?: string }`.
2. Mocks devem usar os tipos TypeScript oficiais.
3. Mocks devem cobrir os estados: CRIADO, ENVIADO, ENTREGUE, VALIDADO, PAGAMENTO_AUTORIZADO, DISPUTA.
4. Mocks de timeline devem ter ao menos 3 eventos por contrato.
5. Ao desativar mocks, trocar apenas a origem dos dados, sem alterar componentes.

---

## 11. Integração com API

### Cliente HTTP base

```ts
// shared/api/httpClient.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function httpClient<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw error; // ApiError com { message, code, details }
  }

  const json = await response.json();
  return json.data; // ApiResponse<T>
}
```

---

## 12. Integração Wallet

### Configuração wagmi (MVP)

```ts
// app/providers/Web3Provider.tsx
const chains = [polygonAmoy]; // testnet oficial
const config = createConfig({
  chains,
  transports: { [polygonAmoy.id]: http() },
});
```

### Funcionalidades Web3 no MVP

```txt
[ ] Conectar MetaMask via RainbowKit
[ ] Exibir endereço curto (0x1234...abcd)
[ ] Exibir rede atual
[ ] Alertar se rede divergir da testnet oficial
[ ] Exibir status de conexão no header
```

---

## 13. Estados de Tela

Cada tela deve implementar os três estados:

| Estado | Componente | Situação |
|---|---|---|
| Loading | `LoadingState` (Skeleton) | Durante fetch da API |
| Error | `ErrorState` | Falha na chamada ou erro da API |
| Empty | `EmptyState` | Lista sem itens |
| Data | renderização normal | Dados carregados com sucesso |

### Feedbacks de ação

```txt
Mutação em execução → botão desabilitado + spinner
Mutação com sucesso → toast verde + invalidação das queries
Mutação com erro    → toast vermelho com mensagem do ApiError
```

---

## 14. Design System

### Paleta base

```ts
// tailwind.config.ts
colors: {
  bg: "#050816",
  surface: "#0F172A",
  border: "#1E293B",
  "text-primary": "#F8FAFC",
  "text-secondary": "#94A3B8",
  primary: "#22D3EE",      // destaque principal
  "primary-alt": "#11DFF2", // neon Oraculum (hover, glow)
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#3B82F6",
}
```

### Status → cores

| Status | Cor | Classe TailwindCSS |
|---|---|---|
| `CRIADO` | cinza | `bg-slate-500/10 text-slate-400` |
| `ENVIADO` | azul | `bg-blue-500/10 text-blue-400` |
| `ENTREGUE` | amarelo | `bg-amber-500/10 text-amber-400` |
| `VALIDADO` | verde | `bg-green-500/10 text-green-400` |
| `PAGAMENTO_AUTORIZADO` | verde | `bg-emerald-500/10 text-emerald-400` |
| `DISPUTA` | vermelho | `bg-red-500/10 text-red-400` |

---

## 15. Critérios de Aceite do Frontend

O frontend está completo para o MVP quando todos os itens abaixo estiverem marcados:

```txt
[ ] Projeto Next.js com App Router e TypeScript criado.
[ ] TailwindCSS, shadcn/ui e design system aplicados.
[ ] Estrutura Feature-Sliced Design implementada.
[ ] Mocks criados e funcionando com NEXT_PUBLIC_ENABLE_MOCKS=true.
[ ] Dashboard com métricas.
[ ] Listagem de contratos com filtro por status.
[ ] Cadastro de contrato com validação.
[ ] Detalhe do contrato com todos os dados.
[ ] Timeline auditável com eventos, roles, hashes.
[ ] Painel de ações com botões por status e role.
[ ] Abrir disputa funcional com motivo.
[ ] Simulação de fraude com comparação de hashes.
[ ] Conexão de wallet com RainbowKit.
[ ] Loading, error e empty states em todas as telas.
[ ] TransactionHashLink exibindo link para o explorer.
[ ] Badges de status com cores corretas.
[ ] PermissionGate escondendo ações não permitidas.
[ ] Integração com API real funcionando sem alterações em componentes.
[ ] Deploy na Vercel funcionando.
```

---

*Documento criado na Session Two de Coerência — 2026-05-28*
