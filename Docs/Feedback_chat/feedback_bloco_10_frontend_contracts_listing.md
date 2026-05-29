# Feedback Bloco 10 — Listagem de Contratos

## 1. Objetivo do bloco

Implementar a listagem real de contratos em `/contracts`, substituindo o placeholder do Bloco 8. A página permite busca, filtros por status e órgão público, ordenação, e exibe os contratos usando `useContracts()`.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_9_frontend_dashboard.md` — padrão de widgets, hooks usados
- `Docs/Cronograma/Tasks_Frontend_implementation.md` — seção Bloco 10
- `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` — shape de Contract e ContractStatus
- `Docs/Governanca_tecnica/glossario_tecnico_oficial.md` — status e roles oficiais

---

## 3. Arquivos criados

```txt
web/src/app/contracts/_components/contracts-page.tsx
web/src/entities/contract/ui/contract-amount.tsx
web/src/entities/contract/ui/contract-card.tsx
web/src/widgets/contracts-filters/ui/contracts-filters.tsx
web/src/widgets/contracts-filters/index.ts
web/src/widgets/contracts-list/ui/contracts-list.tsx
web/src/widgets/contracts-list/index.ts
web/src/widgets/contracts-summary-bar/ui/contracts-summary-bar.tsx
web/src/widgets/contracts-summary-bar/index.ts
```

---

## 4. Arquivos alterados

```txt
web/src/app/contracts/page.tsx        → delegação para ContractsPage
web/README.md                         → seção "Listagem de contratos" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md → Bloco 10 marcado como concluído
```

**Arquivos removidos:**
```txt
web/src/pages/.gitkeep                → diretório src/pages/ removido (conflito Next.js)
```

---

## 5. Componentes implementados

### ContractAmount
`entities/contract/ui/contract-amount.tsx` — componente presentacional. Recebe `amount: number` e `size: "sm" | "md" | "lg"`, formata com `formatCurrencyBRL`. Evita duplicação de formatação monetária no codebase.

### ContractCard
`entities/contract/ui/contract-card.tsx` — card completo de contrato. Exibe:
- Número do contrato + data de atualização (header)
- Órgão público (com ícone `Building2`) e fornecedor (com ícone `User`)
- Objeto (até 2 linhas, truncado via `line-clamp-2`)
- Valor (`ContractAmount`) + prazo (`formatDateBR`) + botão "Ver →" (`/contracts/:id`)
- Borda vermelha (`border-danger/30`) quando `status === "DISPUTA"`
- Hover com `shadow-md`

### ContractsFilters
`widgets/contracts-filters/ui/contracts-filters.tsx` — presentacional, sem hooks. Recebe todos os estados e callbacks via props. Controles:
- Search Input com ícone lupa (busca em `contractNumber`, `supplierName`, `publicAgency`, `object`)
- Select de status (CRIADO → DISPUTA + "Todos os status")
- Select de órgão público (derivado dos dados, passado como prop `agencies[]`)
- Select de ordenação (4 opções: mais recentes, mais antigos, maior/menor valor)
- Botão "Limpar" aparece apenas quando `hasActiveFilters === true`

Exporta os tipos `StatusFilter` e `SortOrder` para uso no componente de estado.

### ContractsList
`widgets/contracts-list/ui/contracts-list.tsx` — presentacional, sem hooks. Renderiza grid `1 col → 2 cols (lg)` de `ContractCard`. Estados:
- Loading: 4 skeleton cards com o shape exato do ContractCard real
- Empty (isFiltered=true): EmptyState "Nenhum contrato encontrado" + botão "Limpar filtros"
- Empty (isFiltered=false): EmptyState "Nenhum contrato cadastrado" + CTA "Novo contrato" → `/contracts/new`

### ContractsSummaryBar
`widgets/contracts-summary-bar/ui/contracts-summary-bar.tsx` — barra de resumo acima da lista. Exibe:
- Total de contratos encontrados
- Quantidade em disputa (vermelho quando > 0)
- Quantidade com pagamento autorizado
- Valor total dos contratos filtrados (`formatCurrencyCompact`)

---

## 6. Página /contracts

**Arquitetura:**
```
app/contracts/page.tsx                → Server Component (delegação, sem lógica)
app/contracts/_components/contracts-page.tsx → Client Component (estado + hooks)
```

`ContractsPage` é um Client Component que:
- Chama `useContracts()` (um único fetch, cacheado por TanStack Query)
- Mantém estado local: `search`, `statusFilter`, `agencyFilter`, `sortOrder`
- Deriva `agencies` via `useMemo` (unique values dos dados)
- Deriva `filteredContracts` via `useMemo` (filter + sort em memória)
- Compõe: `PageHeader` → `ContractsFilters` → `ContractsSummaryBar` → `ContractsList`

A rota `app/contracts/page.tsx` é um Server Component puro que importa e renderiza o Client Component — nenhuma lógica nela.

---

## 7. Filtros e ordenação

**Busca:** filtra `contractNumber + supplierName + publicAgency + object` (case-insensitive, `includes`). Busca combina com os outros filtros.

**Filtro por status:** dropdown com todos os 6 status oficiais + "Todos os status". Combinável com busca e órgão.

**Filtro por órgão público:** dropdown derivado dinamicamente dos contratos carregados (unique `publicAgency` values, sorted). Combinável com busca e status.

**Ordenação:** 4 opções via `SortOrder`:
- `updatedAt_desc` — "Mais recentes" (padrão)
- `updatedAt_asc` — "Mais antigos"
- `amount_desc` — "Maior valor"
- `amount_asc` — "Menor valor"

Toda a lógica de filtro+sort é executada via `useMemo` no cliente — sem chamadas extras ao servidor/API.

---

## 8. Estados de interface

| Estado | Componente | Implementação |
|---|---|---|
| loading | ContractsList | 4 skeleton cards com shape real |
| error | ContractsPage | `ErrorState` com mensagem amigável |
| empty geral | ContractsList | EmptyState + CTA "Novo contrato" |
| empty de filtro | ContractsList | EmptyState + botão "Limpar filtros" |

---

## 9. Responsividade e visual

- Filtros: `flex-col` em mobile → `flex-row flex-wrap` em `sm+`
- Selects: `w-full` em mobile, larguras fixas em `sm+` (`w-[180px]`, `w-[200px]`, `w-[160px]`)
- Grid de cards: `grid-cols-1` → `grid-cols-2` em `lg`
- Objetos longos: `line-clamp-2` nos cards, `truncate` em nomes de órgão/fornecedor
- Valor monetário: `tabular-nums` para alinhamento consistente
- Borda vermelho em contratos em disputa: `border-danger/30` no ContractCard
- Visual: dark, bordas sutis, hover shadow, ícones muted, botão "Ver" ghost/discreto

---

## 10. Atualização do README

`web/README.md` atualizado com seção "Listagem de contratos" descrevendo a arquitetura, componentes e filtros disponíveis.

---

## 11. Atualização do checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` — Bloco 10 marcado como concluído com todas as tasks, critérios de aceite e versionamento.

---

## 12. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 9 rotas estáticas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 13. Commit e push

| Item | Valor |
|---|---|
| Commit realizado | ✅ sim |
| Hash do commit | `c8f301e` |
| Mensagem | `feat(frontend): implement contracts listing` |
| Push realizado | ✅ sim |
| Branch | `main` |
| Remote | `origin/main` |
| Arquivos no commit | 14 (11 criados, 3 alterados, 1 removido) |

---

## 14. Problemas encontrados

**Problema — Conflito entre FSD `src/pages/` e Next.js Pages Router:**

O FSD (Feature-Sliced Design) usa uma camada `pages/` para composição de telas. No entanto, Next.js 16.2.6 trata `src/pages/` como a Pages Router directory e exige que arquivos nela tenham `export default`. O `ContractsPage` usa `export function` (named export), causando erro TypeScript na fase de build:

```
Type error: Property 'default' is missing in type 'typeof import("...contracts-page")' but required in type 'PagesPageConfig'.
```

**Solução:** FSD `src/pages/` é incompatível com Next.js App Router nesta versão. O `ContractsPage` foi movido para `app/contracts/_components/contracts-page.tsx`, usando a convenção Next.js de "pasta privada" (`_` prefix) que não cria rotas. O diretório `src/pages/` foi removido do projeto.

**Decisão documentada:** Para este projeto, a camada FSD `pages/` não será usada. Componentes de composição de tela ficarão em `app/[rota]/_components/` (convenção Next.js) ou em `widgets/` (quando o componente for mais genérico/reutilizável).

---

## 15. Pendências para o Bloco 11

- Cadastro de contrato em `/contracts/new`
- Formulário com React Hook Form + Zod
- Schema `createContractSchema` com validações (campos obrigatórios, valor > 0, endereço wallet, prazo)
- Integração com `useCreateContract()`
- Loading no botão de submit
- Toast de sucesso
- Redirecionamento para `/contracts/:id` após criar (ou `/contracts` como fallback)
- Error state do formulário

---

## 16. Veredito

**Bloco 10 está concluído e aprovado para avançar para o Bloco 11.**

Todos os critérios de aceite foram atendidos:
- `/contracts` implementado como listagem real
- `useContracts()` consumido sem fetch direto
- `ContractCard`, `ContractAmount`, `ContractsFilters`, `ContractsList`, `ContractsSummaryBar` criados
- Busca, filtro por status, filtro por órgão público, ordenação funcionais
- Loading/error/empty states (geral e de filtro) implementados
- Layout responsivo mobile/desktop
- Visual alinhado ao Design System Oraculum
- `npm run lint`: PASSOU
- `npm run build`: PASSOU
- Commit `c8f301e` e push realizados
- Backend e smart contract não foram alterados
