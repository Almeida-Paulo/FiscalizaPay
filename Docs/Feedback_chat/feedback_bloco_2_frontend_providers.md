# Feedback Bloco 2 — Providers Globais

> **Responsável:** Pessoa 2 — Frontend / UI Lead  
> **Bloco:** 2 — Providers globais  
> **Data:** 2026-05-28  
> **Status:** ✅ Aprovado — liberado para Bloco 3

---

## 1. Objetivo do Bloco

Configurar os providers globais do frontend do FiscalizaPay Web3, preparando a aplicação para TanStack Query, wagmi v2, RainbowKit e Sonner, sem criar telas, mocks ou regras de domínio.

---

## 2. Documentos Consultados

```txt
Docs/Feedback_chat/feedback_bloco_0_frontend_preparacao.md
Docs/Feedback_chat/feedback_bloco_1_frontend_setup.md
Docs/Cronograma/Tasks_Frontend_implementation.md
Docs/Planos_implementacao/plano_implementacao_frontend.md
Docs/Governanca_tecnica/decisoes_tecnicas_finais.md
Docs/Governanca_tecnica/glossario_tecnico_oficial.md
Docs/Base_do_projeto/oraculum_design_system.md
Docs/Contratos_tecnicos/contrato_api_frontend_backend.md
```

---

## 3. Arquivos Criados

| Arquivo | Responsabilidade |
|---|---|
| `web/src/app/providers/query-provider.tsx` | QueryClient + QueryClientProvider com defaultOptions do MVP |
| `web/src/app/providers/web3-provider.tsx` | WagmiProvider → QueryProvider → RainbowKitProvider (ordem correta) |
| `web/src/app/providers/toast-provider.tsx` | Sonner Toaster (dark, bottom-right, richColors) |
| `web/src/app/providers/index.tsx` | RootProviders — composição de todos os providers |
| `web/src/shared/config/web3.ts` | wagmiConfig com Polygon Amoy + Sepolia + connectors |

---

## 4. Arquivos Alterados

| Arquivo | O que foi alterado |
|---|---|
| `web/src/app/layout.tsx` | Adicionado import de RootProviders; body envolve children com `<RootProviders>` |
| `web/.env.example` | Adicionada variável `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` com comentário |
| `web/README.md` | Adicionada seção "Providers globais" com arquitetura e configuração Web3 |
| `Docs/Cronograma/Tasks_Frontend_implementation.md` | Bloco 2 marcado como concluído; tasks de commit/push adicionadas e concluídas |
| `web/package.json` | Sonner adicionado como dependência |
| `web/package-lock.json` | Lockfile atualizado com sonner |

---

## 5. Dependências Instaladas

```txt
sonner@latest   → notificações toast (dark mode, bottom-right, richColors)
```

---

## 6. Providers Implementados

### 6.1 QueryProvider (`app/providers/query-provider.tsx`)

```txt
- "use client"
- QueryClient criado via useState factory (não recria a cada render)
- defaultOptions configuradas para o MVP:
  - staleTime: 60 segundos (dados frescos por 1 minuto)
  - retry: 1 (apenas 1 tentativa em caso de erro)
  - refetchOnWindowFocus: false (não revalidar ao focar janela)
- Envolve children com QueryClientProvider
```

### 6.2 Web3Provider (`app/providers/web3-provider.tsx`)

```txt
- "use client"
- Ordem correta wagmi v2 + RainbowKit v2:
  WagmiProvider → QueryProvider → RainbowKitProvider → children

- RainbowKitProvider com tema dark customizado:
  - accentColor: #22D3EE (primary FiscalizaPay)
  - accentColorForeground: #050816 (background escuro)
  - borderRadius: "medium"
  - fontStack: "system"
  - overlayBlur: "small"
  - locale: "pt-BR"

- Importa estilos: "@rainbow-me/rainbowkit/styles.css"
```

### 6.3 ToastProvider (`app/providers/toast-provider.tsx`)

```txt
- "use client"
- Sonner Toaster com:
  - position: "bottom-right"
  - theme: "dark"
  - richColors: true (verde/vermelho/amarelo automático por tipo)
  - closeButton: true
  - duration: 4000ms
  - Estilo customizado: background #0F172A, border #1E293B, color #F8FAFC
    (paleta FiscalizaPay/Oraculum)
```

### 6.4 RootProviders (`app/providers/index.tsx`)

```txt
- "use client"
- Composição:
  Web3Provider
    └── {children}
    └── ToastProvider (portal — renderiza no body independente da posição)
```

---

## 7. Configuração Web3 (`shared/config/web3.ts`)

**Chain principal:** Polygon Amoy (ID 80002 — testnet oficial do MVP)

**Chain fallback:** Sepolia (ID 11155111 — testnet Ethereum)

**Connectors:**
- `injected()` — sempre ativo (MetaMask e extensões browser)
- `walletConnect({ projectId })` — ativo condicionalmente se `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` for fornecido

**Por que `createConfig` e não `getDefaultConfig` do RainbowKit:**

`getDefaultConfig` lança um erro durante SSR/build quando `projectId` é uma string vazia. O erro ocorria durante a pré-renderização estática de `/_not-found`. `createConfig` do wagmi v2 não impõe essa restrição — cria o config corretamente sem WalletConnect quando não há projectId.

**WalletConnect Project ID:**
- Não obrigatório para MetaMask (injected connector)
- Necessário para conexão mobile via QR code
- Obter gratuitamente em: https://cloud.walletconnect.com

**ssr: true** — habilitado para compatibilidade com Next.js App Router.

---

## 8. Atualização do Checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` foi atualizado:

```txt
- Todas as tasks do Bloco 2 marcadas como [x]
- Tasks de commit e push adicionadas ao final do bloco
- Ambas marcadas como [x] após execução
```

---

## 9. Validações Executadas

| Validação | Resultado | Observação |
|---|---|---|
| `npm run build` | ✅ PASSOU | Compilado em 11.4s, TypeScript válido, páginas geradas |
| `npm run lint` | ✅ PASSOU | Sem erros ou warnings |
| `npm run dev` | ⚠️ Não executado | Ambiente de sessão sem browser — verificar localmente |

**Build output:**
```txt
▲ Next.js 16.2.6 (Turbopack)
✓ Compiled successfully in 11.4s
✓ TypeScript passed in 6.9s
✓ Static pages generated (4/4)
Route (app): / — Static (prerendered)
```

---

## 10. Commit e Push

| Item | Valor |
|---|---|
| Hash do commit | `bb7558a` |
| Mensagem | `feat(frontend): configure global providers` |
| Branch | `main` |
| Remote | `https://github.com/LukasAlexandre/FiscalizaPay.git` |
| Push | ✅ Realizado — `main -> main` |

**Arquivos no commit:**
```txt
web/src/app/providers/index.tsx         (criado)
web/src/app/providers/query-provider.tsx (criado)
web/src/app/providers/toast-provider.tsx (criado)
web/src/app/providers/web3-provider.tsx  (criado)
web/src/shared/config/web3.ts           (criado)
web/src/app/layout.tsx                  (alterado)
web/.env.example                        (alterado)
web/README.md                           (alterado)
web/package.json                        (alterado)
web/package-lock.json                   (alterado)
Docs/Cronograma/Tasks_Frontend_implementation.md (alterado)
```

---

## 11. Problemas Encontrados

### Problema 1 — `getDefaultConfig` lança erro de projectId em SSR

**O que aconteceu:** O primeiro build falhou com:
```
Error: No projectId found. Every dApp must now provide a WalletConnect Cloud projectId
```
O erro ocorreu durante a pré-renderização de `/_not-found`.

**Causa:** `getDefaultConfig` do RainbowKit lança exceção quando `projectId` é string vazia, mesmo com `ssr: true`. A config é criada a nível de módulo e executada durante a geração estática de páginas.

**Solução aplicada:** Substituir `getDefaultConfig` do RainbowKit por `createConfig` do wagmi. O `createConfig` não exige `projectId` — o connector `walletConnect` é adicionado condicionalmente apenas quando o projectId está disponível. O RainbowKit continua sendo usado para UI, apenas com wagmiConfig personalizado.

**Impacto:** Nenhum para a demo. MetaMask funciona normalmente. WalletConnect (mobile) precisará do projectId configurado via `.env.local`.

---

## 12. Pendências para o Bloco 3

```txt
[ ] Criar componentes base em shared/ui:
    - Button, Card, Badge, Input, Textarea, Select
    - Dialog, Sheet, Dropdown, Tooltip, Skeleton
    - Toast (já pronto via Sonner)

[ ] Criar componentes de estado em shared/ui:
    - EmptyState
    - ErrorState
    - LoadingState (Skeleton)
    - PageHeader

[ ] Aplicar design tokens do Oraculum nos componentes:
    - bg-background, bg-surface, border-border
    - text-foreground, text-muted-foreground
    - text-primary (cyan), bg-primary

[ ] Criar animações base com Framer Motion:
    - transição de entrada de cards
    - fade de modais
    - animação de loading

[ ] Instalar componentes shadcn/ui base:
    npx shadcn@latest add button card badge input

[ ] Verificar se shared/lib/utils.ts com cn() funciona com shadcn components

[ ] Testar npm run dev localmente para verificar providers funcionando
    (especialmente hydration Web3 + RainbowKit locale pt-BR)
```

---

## 13. Veredito

```txt
✅ Bloco 2 CONCLUÍDO

Providers:          QueryProvider, Web3Provider, ToastProvider, RootProviders
Web3 config:        shared/config/web3.ts com Polygon Amoy + Sepolia
Layout:             Server Component — envolve children com RootProviders client
.env.example:       atualizado com NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
README:             atualizado com seção de providers
Tasks:              Bloco 2 marcado como concluído
Commit:             bb7558a — feat(frontend): configure global providers
Push:               main → origin/main ✅
Build:              ✅ VERDE
Lint:               ✅ VERDE

Próximo bloco: Bloco 3 — Design System e UI Base
```

---

*Bloco 2 concluído em: 2026-05-28*  
*Arquivos criados: 5*  
*Arquivos alterados: 6*  
*Dependências adicionadas: 1 (sonner)*  
*Commit: bb7558a — push para origin/main*  
*Build status: ✅ VERDE*
