# Feedback — Bloco 8: Layout Principal

**Data:** 2026-05-28
**Commit:** `f8b1659`
**Branch:** `main`

---

## O que foi entregue

### Widgets criados

| Widget | Arquivo | Descrição |
|---|---|---|
| `AppSidebar` | `widgets/app-sidebar/ui/app-sidebar.tsx` | Navegação lateral com ICON_MAP, active state, footer |
| `AppHeader` | `widgets/app-header/ui/app-header.tsx` | Título contextual, ProfileSwitcher compact, wallet status badge, hamburger mobile |
| `AppShell` | `widgets/app-shell/ui/app-shell.tsx` | Layout raiz: sidebar + header + conteúdo + Sheet mobile |

### Constantes e helpers

| Arquivo | Exporta |
|---|---|
| `shared/constants/navigation.ts` | `NAVIGATION_ITEMS`, `NavItem` |
| `shared/lib/page-meta.ts` | `getPageMeta(pathname)`, `PageMeta` |

### Páginas placeholder

| Rota | Arquivo | Nota |
|---|---|---|
| `/` | `app/page.tsx` | Landing page com botões "Acessar Dashboard" e "Ver contratos" |
| `/dashboard` | `app/dashboard/page.tsx` | Placeholder com EmptyState (Bloco 9) |
| `/contracts` | `app/contracts/page.tsx` | Placeholder com EmptyState + botão "Novo contrato" (Bloco 10) |
| `/contracts/new` | `app/contracts/new/page.tsx` | Placeholder com EmptyState (Bloco 10) |
| `/disputes` | `app/disputes/page.tsx` | Placeholder com EmptyState (Bloco 11) |
| `/audit` | `app/audit/page.tsx` | Placeholder com EmptyState (Bloco 12) |

### Arquivos atualizados

- `app/layout.tsx` — body `h-full overflow-hidden`, AppShell envolvendo children
- `web/README.md` — seção "Layout principal" com tabela de rotas e responsividade
- `Docs/Cronograma/Tasks_Frontend_implementation.md` — Bloco 8 marcado como completo

---

## Decisões técnicas

### ICON_MAP no AppSidebar
`NAVIGATION_ITEMS` usa strings (`"LayoutDashboard"`, `"FileText"`, etc.) em vez de importar componentes Lucide diretamente — evita importação de ícones em um arquivo de constantes compartilhado. O `ICON_MAP` no AppSidebar faz o lookup para o componente real.

### Active state por rota
Lógica especial para evitar conflito entre `/contracts` e `/contracts/new`:
```ts
item.href === "/contracts/new"
  ? pathname === item.href
  : item.href === "/contracts"
    ? pathname === item.href || (pathname.startsWith("/contracts/") && pathname !== "/contracts/new")
    : pathname === item.href || pathname.startsWith(item.href + "/")
```

### usePathname() null coalescing
`usePathname()` retorna `string | null` nesta versão do Next.js. O AppShell usa `?? "/"` para garantir type safety.

### Server/Client boundary
AppSidebar marcado como `"use client"` porque recebe `onItemClick?: () => void` do AppShell (Client Component). Sem isso, Next.js emitia aviso de serialização de props.

---

## Validação

| Check | Status |
|---|---|
| `npm run lint` | ✅ PASSOU |
| `npm run build` | ✅ PASSOU (TypeScript + 9 rotas estáticas) |
| Commit | `f8b1659` — `feat(frontend): add application layout shell` |
| Push | ✅ `origin/main` |

---

## Restrições respeitadas

- Não implementado: dashboard real, métricas, listagens, formulários, detalhes, timeline, ações, backend, smart contract
- Todas as páginas são placeholder com EmptyState indicando o bloco futuro responsável
- `ProfileSwitcher` usado de forma compacta — sem modificações na entidade de perfil
- Wallet status é apenas visual (badge Conectado/Desconectado via `useAccount()`) — sem botão de conexão final

---

## Próximo bloco

**Bloco 9 — Dashboard:** usar `useDashboardSummary()` para exibir métricas reais, lista de contratos recentes via `useContracts()`, alertas de disputa.
