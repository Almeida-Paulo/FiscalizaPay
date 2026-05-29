# Feedback Bloco 9 — Dashboard

## 1. Objetivo do bloco

Implementar o dashboard real da aplicação em `/dashboard`, substituindo o placeholder do Bloco 8. O dashboard apresenta uma visão geral do FiscalizaPay Web3 usando os hooks e mocks criados no Bloco 7.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_7_frontend_data_hooks.md` — hooks disponíveis, shapes de dados, padrão de mutation
- `Docs/Feedback_chat/feedback_bloco_8_frontend_layout.md` — estrutura de AppShell, placeholder substituído
- `Docs/Cronograma/Tasks_Frontend_implementation.md` — seção Bloco 9
- `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` — shape de DashboardSummary e Contract
- `Docs/Base_do_projeto/oraculum_design_system.md` — paleta e tokens visuais

---

## 3. Arquivos criados

```txt
web/src/widgets/dashboard-metrics/ui/dashboard-metric-card.tsx
web/src/widgets/dashboard-metrics/ui/dashboard-metrics.tsx
web/src/widgets/dashboard-metrics/index.ts
web/src/widgets/dashboard-status-overview/ui/dashboard-status-overview.tsx
web/src/widgets/dashboard-status-overview/index.ts
web/src/widgets/dashboard-recent-contracts/ui/dashboard-recent-contracts.tsx
web/src/widgets/dashboard-recent-contracts/index.ts
web/src/widgets/dashboard-alerts/ui/dashboard-alerts.tsx
web/src/widgets/dashboard-alerts/index.ts
```

---

## 4. Arquivos alterados

```txt
web/src/app/dashboard/page.tsx          → substituído por composição real de widgets
web/README.md                           → seção "Dashboard" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md → Bloco 9 marcado como concluído
```

---

## 5. Widgets implementados

### DashboardMetricCard
Componente presentacional (`widgets/dashboard-metrics/ui/dashboard-metric-card.tsx`). Exibe: título, valor numérico/texto, descrição, ícone em círculo colorido. Aceita `variant: "default" | "danger" | "success" | "warning"` que controla a cor do valor e do ícone. Quando `loading=true`, exibe um skeleton em vez dos dados. Não chama hooks — recebe tudo por props.

### DashboardMetrics
Client Component (`widgets/dashboard-metrics/ui/dashboard-metrics.tsx`). Consome `useDashboardSummary()` e `useContracts()`. Renderiza 8 `DashboardMetricCard` em grid `2 cols → 3 cols (sm) → 4 cols (lg)`:

| Métrica | Fonte | Variante |
|---|---|---|
| Total de contratos | `summary.total` | default |
| Criados | `summary.criado` | default |
| Enviados | `summary.enviado` | default |
| Entregues | `summary.entregue` | default |
| Validados | `summary.validado` | default |
| Pgtos. autorizados | `summary.pagamentoAutorizado` | success |
| Em disputa | `summary.disputa` | danger |
| Valor total fiscalizado | soma de `contracts[].amount` via `formatCurrencyCompact` | success |

Se `isError`, exibe `ErrorState`. Se `isLoading`, renderiza os cards com `loading=true` (skeleton interno).

### DashboardStatusOverview
Client Component (`widgets/dashboard-status-overview/ui/dashboard-status-overview.tsx`). Consome `useDashboardSummary()`. Exibe os 6 status em ordem do fluxo com:
- Dot colorido por variant (neutro/info/warning/success/danger)
- Contagem numérica
- Barra de progresso proporcional ao total (`count / total * 100%`)

Loading state: skeleton por linha. Error state: mensagem inline.

### DashboardRecentContracts
Client Component (`widgets/dashboard-recent-contracts/ui/dashboard-recent-contracts.tsx`). Consome `useContracts()`. Ordena por `updatedAt` descendente e exibe os 5 mais recentes. Cada item:
- Link para `/contracts/:id` (detalhe implementado no Bloco 12)
- `contractNumber`, `publicAgency`, `supplierName`
- `formatCurrencyBRL(amount)` (visível em sm+)
- `ContractStatusBadge`
- `formatDateBR(updatedAt)` (visível em sm+)

Hover: `bg-muted/40`. Loading: 5 linhas skeleton. Empty: `EmptyState` com CTA "Novo contrato".

### DashboardAlerts
Client Component (`widgets/dashboard-alerts/ui/dashboard-alerts.tsx`). Consome `useContracts()` e filtra por `status === "DISPUTA"`. Cada disputa exibe: `contractNumber`, `ContractStatusBadge`, `publicAgency`, data de atualização. Se sem disputas: estado positivo com `CheckCircle2` e mensagem verde. Com disputas: botão "Ver todas as disputas" → `/disputes`.

---

## 6. Página dashboard

`app/dashboard/page.tsx` é um **Server Component** que compõe os widgets:

```
PageHeader "Dashboard" + botão "Novo contrato" → /contracts/new

DashboardMetrics (grid full width)

Grid lg:2 cols:
  DashboardStatusOverview   |   DashboardAlerts

DashboardRecentContracts (full width)
```

A página não contém lógica visual nem chamadas de hooks — apenas composição de widgets.

---

## 7. Hooks utilizados

| Hook | Widget que consome |
|---|---|
| `useDashboardSummary()` | `DashboardMetrics`, `DashboardStatusOverview` |
| `useContracts()` | `DashboardMetrics` (total amount), `DashboardRecentContracts`, `DashboardAlerts` |

TanStack Query cacheia por queryKey — `useContracts()` chamado em 3 widgets compartilha o mesmo cache, sem fetches duplicados.

---

## 8. Estados de interface

| Estado | Widget | Implementação |
|---|---|---|
| loading | DashboardMetrics | cards com `loading=true` (skeleton interno) |
| loading | DashboardStatusOverview | skeleton por linha de status |
| loading | DashboardRecentContracts | 5 linhas skeleton |
| loading | DashboardAlerts | 2 skeleton cards |
| error | DashboardMetrics | `ErrorState` com mensagem |
| error | DashboardStatusOverview | texto inline |
| error | DashboardRecentContracts | texto inline |
| error | DashboardAlerts | texto inline |
| empty | DashboardRecentContracts | `EmptyState` com CTA "Novo contrato" |
| empty (positivo) | DashboardAlerts | badge verde "Nenhuma disputa aberta" |

---

## 9. Responsividade e visual

- Grid de métricas: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` — funciona de 2 a 4 colunas
- Seção mid-section: `grid-cols-1 lg:grid-cols-2` — empilha em mobile, lado a lado em desktop
- Contratos recentes: colunas de data e valor ocultas em mobile com `hidden sm:block`
- Valores monetários usam `formatCurrencyBRL` (completo) e `formatCurrencyCompact` (cards)
- Paleta: variantes `default` (cyan/primary), `success` (verde), `danger` (vermelho), `warning` (âmbar)
- Cards com `p-5` e borda sutil (padrão `bg-card border-border` do Design System)
- Barras de progresso com cores mapeadas por variant via `CONTRACT_STATUS_MAP`

---

## 10. Atualização do README

`web/README.md` atualizado com seção "Dashboard" — tabela de widgets, hooks usados e próximo bloco.

---

## 11. Atualização do checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` — Bloco 9 marcado como concluído com todas as tasks e critérios de aceite. Versioning também marcado (commit/push).

---

## 12. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings (1 warning corrigido: import não utilizado) |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 9 rotas estáticas geradas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 13. Commit e push

| Item | Valor |
|---|---|
| Commit realizado | ✅ sim |
| Hash do commit | `0cfb5b8` |
| Mensagem | `feat(frontend): implement dashboard overview` |
| Push realizado | ✅ sim |
| Branch | `main` |
| Remote | `origin/main` |
| Arquivos no commit | 13 (10 criados, 3 alterados) |

---

## 14. Problemas encontrados

**Problema 1 — Import não utilizado (`CONTRACT_STATUS_VARIANTS`):**
`dashboard-status-overview.tsx` importava `CONTRACT_STATUS_VARIANTS` que foi substituído por lookup via `CONTRACT_STATUS_MAP[status].variant`. Removido antes do segundo lint.

Nenhum outro problema crítico encontrado.

---

## 15. Pendências para o Bloco 10

- Listagem completa de contratos em `/contracts`
- Filtros por status (usando `useContracts(status?)`)
- Busca por número/órgão/fornecedor
- Ordenação (por data, valor, status)
- `ContractCard` reutilizável
- Paginação ou infinite scroll
- Empty/loading/error states da listagem
- Botão "Novo contrato" na listagem

A rota `/contracts/:id` referenciada no `DashboardRecentContracts` ainda não existe — o clique resultará em 404 até o Bloco 12 (detalhe do contrato).

---

## 16. Veredito

**Bloco 9 está concluído e aprovado para avançar para o Bloco 10.**

Todos os critérios de aceite foram atendidos:
- Dashboard real implementado em `/dashboard` com 4 widgets
- `useDashboardSummary` e `useContracts` consumidos corretamente
- 8 métricas exibidas (incluindo valor total fiscalizado calculado no cliente)
- Contratos recentes com link e badge de status
- Alertas de disputa com estado positivo
- Loading/error/empty states em todos os widgets
- Visual alinhado ao Design System Oraculum
- Responsivo para mobile e desktop
- `npm run lint`: PASSOU
- `npm run build`: PASSOU
- Commit `0cfb5b8` e push realizados
- Backend e smart contract não foram alterados
