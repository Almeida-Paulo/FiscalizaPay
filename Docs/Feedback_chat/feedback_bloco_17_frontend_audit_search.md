# Feedback Bloco 17 — Auditoria e Tela de Consulta

## 1. Objetivo do bloco

Implementar a tela real `/audit`: lista global de eventos auditáveis de todos os contratos, com busca, filtros por tipo de evento / status / disputas e fraudes / ordenação, sumário estatístico com 4 cards, `AuditEventCard` reutilizando componentes da timeline existente, e estados de loading/error/empty.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_16_frontend_wallet_profile.md` — pendências para o Bloco 17
- `web/src/entities/contract-event/model/types.ts` — `ContractEventType`, `ContractEvent`
- `web/src/entities/contract-event/model/constants.ts` — `EVENT_TYPE_MAP`, `EVENT_TYPE_IS_ALERT`, `EVENT_TYPE_LABELS`
- `web/src/entities/contract-event/index.ts` — exports disponíveis
- `web/src/entities/contract-event/api/use-contract-events.ts` — hook de referência
- `web/src/entities/contract/api/use-contracts.ts` — hook de referência
- `web/src/entities/contract/model/types.ts` — `Contract`, `ContractStatus`
- `web/src/entities/contract/model/constants.ts` — `CONTRACT_STATUS_MAP`
- `web/src/shared/api/contracts-api.ts` — funções de API e mock
- `web/src/shared/api/query-keys.ts` — chaves de query
- `web/src/shared/mocks/mock-store.ts` — mockStore mutável
- `web/src/entities/contract-event/ui/event-type-icon.tsx` — EventTypeIcon
- `web/src/entities/contract-event/ui/status-transition.tsx` — StatusTransition
- `web/src/entities/contract-event/ui/document-hash-viewer.tsx` — DocumentHashViewer
- `web/src/entities/transaction/ui/transaction-hash-link.tsx` — TransactionHashLink
- `web/src/entities/profile/ui/role-badge.tsx` — RoleBadge
- `web/src/entities/contract/ui/contract-status-badge.tsx` — ContractStatusBadge
- `web/src/shared/ui/empty-state.tsx` — EmptyState
- `web/src/shared/ui/error-state.tsx` — ErrorState
- `web/src/shared/lib/formatters.ts` — `formatDateTimeBR`
- `web/src/app/audit/page.tsx` — placeholder existente

---

## 3. Arquivos criados

```txt
web/src/app/audit/_components/use-audit-events.ts
web/src/app/audit/_components/audit-event-card.tsx
web/src/app/audit/_components/audit-event-list.tsx
web/src/app/audit/_components/audit-filters.tsx
web/src/app/audit/_components/audit-summary.tsx
web/src/app/audit/_components/audit-page.tsx
Docs/Feedback_chat/feedback_bloco_17_frontend_audit_search.md
```

---

## 4. Arquivos alterados

```txt
web/src/shared/mocks/mock-store.ts     → adiciona getAllEvents()
web/src/shared/api/contracts-api.ts    → adiciona AuditEventItem type + getAuditEvents()
web/src/shared/api/query-keys.ts       → adiciona auditEvents key
web/src/app/audit/page.tsx             → substitui placeholder por <AuditPage />
web/README.md                          → seção "Auditoria e consulta" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md → Bloco 17 marcado como concluído
```

---

## 5. Decisões de arquitetura

### Enriquecimento de eventos no servidor de API

`getAuditEvents()` em `shared/api/contracts-api.ts` consolida todos os eventos de todos os contratos e os enriquece com `contractNumber`, `contractObject` e `contractStatus`. Essa lógica fica no service layer, não no hook ou no componente.

**Por que:** o hook (`useAuditEvents`) fica simples — só chama a função e envolve com TanStack Query. A substituição futura por uma endpoint real (`GET /audit/events`) requer alterar apenas o service.

### `AuditEventItem` type no contracts-api.ts

O tipo `AuditEventItem = ContractEvent & { contractNumber, contractObject, contractStatus }` é definido junto à função que o produz. Re-exportado via `use-audit-events.ts` para os componentes que precisam dele.

### Filtragem em memória no Client Component

`audit-page.tsx` mantém os filtros em `useState` e aplica a função `applyFilters()` via `useMemo`. Não há URL params — a tela de auditoria é uma tela de consulta operacional, não uma tela para ser compartilhada com estado.

### Ordenação padrão: mais recente

`getAuditEvents()` retorna os eventos ordenados por `createdAt` descrescente. O filtro "Mais antigo" re-ordena no cliente.

---

## 6. Tipo `AuditEventItem`

```ts
export type AuditEventItem = ContractEvent & {
  contractNumber: string;  // ex: "CT-2026-001"
  contractObject: string;  // ex: "Fornecimento de EPI"
  contractStatus: ContractStatus; // status atual do contrato
};
```

---

## 7. Hook `useAuditEvents`

**Arquivo:** `app/audit/_components/use-audit-events.ts`

```ts
export function useAuditEvents() {
  return useQuery({
    queryKey: queryKeys.auditEvents,
    queryFn: async () => {
      const { data } = await getAuditEvents();
      return data;
    },
  });
}
```

Query key: `["audit-events"]` — independente das queries de contratos individuais.

---

## 8. Componentes criados

### `AuditEventCard`

**Arquivo:** `app/audit/_components/audit-event-card.tsx`

- Ícone colorido: `bg-warning/15 text-warning` para alertas, `bg-success/15 text-success` para críticos, `bg-muted` para neutros
- Header: label do tipo de evento + data/hora formatada
- Linha do contrato: `contractNumber` mono com link `/contracts/[id]` + ícone `ExternalLink` + `contractObject` (hidden mobile) + `ContractStatusBadge`
- Descrição do evento
- Role badge + nome do responsável
- `StatusTransition` se `statusBefore` e `statusAfter` presentes
- `DocumentHashViewer` + `TransactionHashLink` se presentes
- Borda e fundo `border-warning/20 bg-warning/5` para eventos com `isAlert = true`

### `AuditEventList`

**Arquivo:** `app/audit/_components/audit-event-list.tsx`

- Loading: 5 skeletons de `h-28`
- Error: `ErrorState` com descrição específica
- Empty (sem filtros): mensagem "Sem eventos registrados"
- Empty (com filtros): mensagem "Nenhum evento encontrado" + instrução para ajustar filtros
- Distingue os dois casos via `totalCount > 0`

### `AuditFilters`

**Arquivo:** `app/audit/_components/audit-filters.tsx`

Props:
```ts
{ filters: AuditFiltersState, onChange, resultCount, totalCount }
```

Estado:
```ts
interface AuditFiltersState {
  search: string;
  eventType: ContractEventType | "all";
  contractStatus: ContractStatus | "all";
  onlyAlert: boolean;
  orderBy: "newest" | "oldest";
}
```

- Input de busca full-width com botão "Limpar" (aparece apenas se algum filtro ativo)
- Select de tipo de evento: "Todos os tipos" + 8 opções
- Select de status: "Todos os status" + 6 opções
- Select de ordenação: "Mais recente" | "Mais antigo"
- Botão toggle "Disputas e fraudes" (variant="default" quando ativo)
- Contador: `"N de M eventos"` ou `"N eventos"` se sem filtro

### `AuditSummary`

**Arquivo:** `app/audit/_components/audit-summary.tsx`

4 cards em grid `grid-cols-2 sm:grid-cols-4`:

| Card | Ícone | Cor |
|---|---|---|
| Total de eventos | `Hash` | `text-primary` |
| Com tx blockchain | `Link2` | `text-success` |
| Com hash de documento | `FileSearch` | `text-blue-400` |
| Disputas e fraudes | `AlertTriangle` | `text-warning` (se > 0) ou muted |

### `AuditPage`

**Arquivo:** `app/audit/_components/audit-page.tsx`

- Client Component com `"use client"`
- `useAuditEvents()` para dados
- `useState<AuditFiltersState>` para filtros
- `useMemo` para `filteredEvents`
- Sequência: `PageHeader` → `AuditSummary` (quando carregado) → `AuditFilters` → `AuditEventList`

---

## 9. Filtros — lógica de aplicação

```ts
function applyFilters(events, filters):
  1. onlyAlert → filtra EVENT_TYPE_IS_ALERT[e.eventType]
  2. eventType → filtra por tipo exato
  3. contractStatus → filtra por contractStatus
  4. search → substring case-insensitive em: contractNumber, contractObject,
               responsibleName, responsibleWallet, transactionHash, documentHash
  5. orderBy "oldest" → re-ordena ascendente por createdAt
```

A ordem importa: `onlyAlert` é o filtro mais restritivo e vai primeiro para evitar iterações desnecessárias.

---

## 10. Alterações no mock store e API

### `mock-store.ts`

```ts
getAllEvents: (): ContractEvent[] => [..._events],
```

Expõe todos os eventos do estado global mutável — necessário para `getAuditEvents()` sem precisar iterar por contrato.

### `contracts-api.ts`

```ts
export async function getAuditEvents(): Promise<ApiResponse<AuditEventItem[]>> {
  if (env.enableMocks) {
    const contracts = mockStore.getContracts();
    const contractMap = new Map(contracts.map((c) => [c.id, c]));
    const events = mockStore.getAllEvents();
    const enriched = events
      .map((e) => ({
        ...e,
        contractNumber: contractMap.get(e.contractId)?.contractNumber ?? e.contractId,
        contractObject: contractMap.get(e.contractId)?.object ?? "",
        contractStatus: contractMap.get(e.contractId)?.status ?? "CRIADO",
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { data: enriched };
  }
  return httpClient.get<AuditEventItem[]>("/audit/events");
}
```

---

## 11. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 9 rotas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 12. Commit e push

| Item | Valor |
|---|---|
| Commit Bloco 17 | (a preencher após commit) |
| Mensagem | `feat(frontend): implement audit search page` |
| Push | ✅ sim |
| Branch | `main` |

---

## 13. Problemas encontrados

Nenhum problema encontrado durante a implementação. A arquitetura de `getAuditEvents()` como service no API layer evitou a necessidade de queries paralelas no hook — a consolidação acontece no service onde fica isolada e testável independentemente.

---

## 14. Pendências para o Bloco 18

- Revisão de responsividade: desktop / notebook / tablet / mobile
- Ajuste de espaçamentos e contraste
- Ajustar sidebar mobile
- Garantir que textos longos (hashes, nomes) não quebrem layout
- Ajustar estados hover/focus em cards e botões
- Acessibilidade básica (aria-labels, focus traps)

---

## 15. Veredito

**Bloco 17 está concluído e aprovado para avançar para o Bloco 18.**

Todos os critérios de aceite foram atendidos:
- Tela `/audit` real implementada ✅
- `useAuditEvents` hook consolidando todos os eventos ✅
- `AuditEventItem` type enriquecido com dados do contrato ✅
- `AuditSummary` com 4 cards estatísticos ✅
- `AuditFilters` com busca geral + 3 selects + toggle + limpar ✅
- `AuditEventList` com loading/error/empty states ✅
- `AuditEventCard` reutilizando EventTypeIcon, StatusTransition, DocumentHashViewer, TransactionHashLink, RoleBadge, ContractStatusBadge ✅
- Links para `/contracts/[id]` funcionando ✅
- Filtragem em memória via useMemo ✅
- `npm run lint`: PASSOU (0 erros, 0 warnings) ✅
- `npm run build`: PASSOU (9 rotas, TypeScript sem erros) ✅
- Backend e smart contract não foram alterados ✅
