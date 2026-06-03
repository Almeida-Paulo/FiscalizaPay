# Feedback Bloco 5 — Regras Visuais e Permissões

> **Responsável:** Pessoa 2 — Frontend / UI Lead  
> **Bloco:** 5 — Regras Visuais e Permissões  
> **Data:** 2026-05-28  
> **Status:** ✅ Aprovado — liberado para Bloco 6

---

## 1. Objetivo do Bloco

Criar as regras visuais de permissão, helpers de status/progresso e o store de perfil simulado do frontend do FiscalizaPay Web3. Nenhuma tela real, mock de contrato ou API client foi implementado.

---

## 2. Documentos Consultados

```txt
Docs/Governanca_tecnica/glossario_tecnico_oficial.md
Docs/Contratos_tecnicos/contrato_api_frontend_backend.md
Docs/Feedback_chat/feedback_bloco_4_frontend_domain_models.md
Docs/Planos_implementacao/plano_implementacao_frontend.md
```

---

## 3. Arquivos Criados

| Arquivo | Responsabilidade |
|---|---|
| `web/src/entities/contract/model/rules.ts` | Todas as regras visuais e helpers de status |
| `web/src/entities/contract/ui/contract-status-badge.tsx` | Badge com cor por ContractStatus |
| `web/src/entities/profile/model/store.ts` | Zustand store de perfil simulado para demo |
| `web/src/entities/profile/ui/role-badge.tsx` | Badge com label por UserRole |
| `web/src/entities/profile/ui/profile-switcher.tsx` | Select para trocar perfil de demo |
| `web/src/shared/ui/permission-gate.tsx` | Wrapper visual de permissão |
| `web/src/app/permissions-showcase.tsx` | Showcase interativo do Bloco 5 (client) |

---

## 4. Arquivos Alterados

| Arquivo | O que foi alterado |
|---|---|
| `web/src/entities/contract/index.ts` | Adicionado `export * from "./model/rules"` |
| `web/src/entities/profile/index.ts` | Adicionada nota: store.ts não está no barrel (evita import em Server Components) |
| `web/src/app/page.tsx` | Adicionadas seções de Bloco 5: PermissionsShowcase, ContractStatusBadge, RoleBadge |
| `web/README.md` | Adicionada seção "Regras visuais e permissões" |
| `Docs/Cronograma/Tasks_Frontend_implementation.md` | Bloco 5 marcado como concluído |

---

## 5. Regras Visuais Implementadas

Todas em `entities/contract/model/rules.ts`. Arquivo contém aviso de segurança:
> "Estas funções controlam apenas a interface visual. O backend é a fonte definitiva de validação e segurança."

| Função | Regra |
|---|---|
| `canConfirmShipment` | `status === "CRIADO"` e `role === "FORNECEDOR"` |
| `canConfirmDelivery` | `status === "ENVIADO"` e `role === "ENTREGADOR"` |
| `canValidateReceipt` | `status === "ENTREGUE"` e `role === "FISCAL"` |
| `canAuthorizePayment` | `status === "VALIDADO"` e `role === "GESTOR"` |
| `canOpenDispute` | `status !== "PAGAMENTO_AUTORIZADO"` e role em `GESTOR|FISCAL|FORNECEDOR|ENTREGADOR` |
| `canSimulateFraud` | `documentHash` presente, `status !== "PAGAMENTO_AUTORIZADO"`, role em `GESTOR|FISCAL` |

---

## 6. Helpers Implementados

| Função | Retorno |
|---|---|
| `getNextContractAction(contract, profile)` | `ContractAction | null` — próxima ação principal |
| `getAvailableContractActions(contract, profile)` | `ContractAction[]` — todas as ações disponíveis |
| `getBlockedActionReason(action, contract, profile)` | `string | null` — mensagem amigável pt-BR do bloqueio |
| `getContractProgress(contract)` | `number` — 0-100 (CRIADO=10, PGTO_AUT=100, DISPUTA=50) |
| `getContractStatusLabel(status)` | `string` — label pt-BR do status |
| `getContractStatusDescription(status)` | `string` — contexto do status |
| `getContractStatusVariant(status)` | `StatusVariant` — para colorização |
| `isContractInDispute(contract)` | `boolean` |
| `isContractPaymentAuthorized(contract)` | `boolean` |

Tipo criado: `ContractAction` com 6 valores: `CONFIRM_SHIPMENT`, `CONFIRM_DELIVERY`, `VALIDATE_RECEIPT`, `AUTHORIZE_PAYMENT`, `OPEN_DISPUTE`, `SIMULATE_FRAUD`.

---

## 7. Componentes Criados

### PermissionGate (`shared/ui/permission-gate.tsx`)

- Props: `allowed: boolean`, `children`, `fallback?: ReactNode`
- Se `allowed = false` → renderiza fallback ou null
- Genérico — não conhece Contract/Profile diretamente
- Comentário: "Controla apenas a exibição. Backend é a fonte de autorização."

### ContractStatusBadge (`entities/contract/ui/contract-status-badge.tsx`)

- Recebe `status: ContractStatus`
- Usa `CONTRACT_STATUS_MAP` para label e variant
- Usa `StatusVariant → VARIANT_CLASSES` para aplicar cores: neutral/info/warning/success/danger
- Suporte a `showDescription?: boolean` para mostrar descrição contextual

### RoleBadge (`entities/profile/ui/role-badge.tsx`)

- Recebe `role: UserRole`
- Usa `ROLE_LABELS` para label
- Estilo: borda e texto em primary (#22D3EE) com fundo sutil

### ProfileSwitcher (`entities/profile/ui/profile-switcher.tsx`) — `"use client"`

- Usa `useProfileStore` do Zustand
- Select shadcn/ui com todas as roles de demo
- Props: `compact?: boolean` (esconde nome na versão compacta)
- Exibe `RoleBadge` do perfil atual

---

## 8. Store Zustand

`entities/profile/model/store.ts`:

```ts
useProfileStore → { currentProfile, demoProfiles, setCurrentProfile, setCurrentRole }
```

- 5 perfis de demo: GESTOR, FORNECEDOR, ENTREGADOR, FISCAL, AUDITOR
- Default: GESTOR (Maria Santos)
- Comentário: "NÃO é autenticação real. Serve apenas para demonstrar o fluxo visual."
- **NÃO exportado no barrel** `index.ts` — para evitar import acidental em Server Components
- Import direto: `from "@/entities/profile/model/store"`

---

## 9. Atualização do Showcase

`app/permissions-showcase.tsx` (client component) demonstra interativamente:
- `ProfileSwitcher` — troca de perfil em tempo real
- Contrato fake mínimo inline (não é arquivo de mock — apenas dados estáticos no componente)
- Lista de ações disponíveis para o perfil/status selecionado
- `PermissionGate` com `canConfirmShipment` e `canAuthorizePayment` — mostrando botão visível ou mensagem de bloqueio

`app/page.tsx` (server component) recebeu:
- Import de `PermissionsShowcase`, `ContractStatusBadge`, `RoleBadge`
- Seção com showcase interativo de regras
- Grade de `ContractStatusBadge` para todos os 6 status
- Grade de `RoleBadge` para todas as 5 roles

---

## 10. Atualização do Checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` atualizado:
- 25+ tasks do Bloco 5 marcadas como `[x]`
- Versionamento (commit + push) marcado como `[x]`

---

## 11. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm run build` | ✅ PASSOU — TypeScript válido, sem imports circulares |
| `npm run lint` | ✅ PASSOU — 1 warning resolvido (variável não usada) |
| `npm run dev` | ⚠️ Não executado no ambiente de sessão |

**Verificações específicas do Bloco 5:**
- `rules.ts` → importa de `./types`, `./constants`, `@/entities/profile` sem circular dep ✅
- `ContractStatusBadge` → usa `StatusVariant` do mesmo entity sem "use client" ✅
- `ProfileSwitcher` → "use client" corretamente ✅
- `store.ts` → não está no barrel `index.ts` ✅
- Mensagens de `getBlockedActionReason` em pt-BR ✅
- `ContractAction` type com 6 valores corretos ✅

---

## 12. Commit e Push

| Item | Valor |
|---|---|
| Hash do commit | `53a1724` |
| Mensagem | `feat(frontend): add visual permission rules` |
| Branch | `main` |
| Remote | `https://github.com/LukasAlexandre/FiscalizaPay.git` |
| Push | ✅ `29c46ba..53a1724 main -> main` |

---

## 13. Problemas Encontrados

```txt
Nenhum problema crítico encontrado.
```

**Ajuste menor:** durante o lint, a variável `canValidate` foi detectada como declarada mas não usada (o bloco visual exibia `canDeliver` em seu lugar). Corrigida antes do commit final.

---

## 14. Pendências para o Bloco 6

```txt
[ ] Criar shared/api/httpClient.ts
    - fetch wrapper com ApiResponse<T> e ApiError
    - lê NEXT_PUBLIC_API_URL do env
    - lança ApiError em resposta não-ok

[ ] Criar shared/config/env.ts
    - variáveis de ambiente tipadas
    - NEXT_PUBLIC_API_URL, NEXT_PUBLIC_ENABLE_MOCKS, NEXT_PUBLIC_EXPLORER_URL, etc.

[ ] Criar shared/mocks/contracts.mock.ts
    - 5+ contratos com status variados
    - pelo menos 1 em disputa
    - tipos seguem Contract exatamente

[ ] Criar shared/mocks/events.mock.ts
    - timeline completa para 1-2 contratos
    - tipos seguem ContractEvent exatamente

[ ] Criar shared/mocks/dashboard.mock.ts
    - DashboardSummary mockado

[ ] Criar shared/mocks/profiles.mock.ts
    - Reusar ou referenciar DEMO_PROFILES da store

[ ] Criar estratégia de alternância mock/API
    - getMockResponse vs fetch baseado em NEXT_PUBLIC_ENABLE_MOCKS
    - sem alterar componentes ao trocar de modo
```

---

## 15. Veredito

```txt
✅ Bloco 5 CONCLUÍDO

Funções de regras:    6 (can* functions)
Helpers:              9 (get*, is*)
ContractAction:       1 type com 6 valores
Componentes visuais:  4 (PermissionGate, ContractStatusBadge, RoleBadge, ProfileSwitcher)
Zustand store:        1 (DEMO_PROFILES, useProfileStore)
Showcase interativo:  1 (PermissionsShowcase — client)
Build:                ✅ VERDE
Lint:                 ✅ VERDE
Commit:               53a1724 — feat(frontend): add visual permission rules
Push:                 main → origin/main ✅

Próximo bloco: Bloco 6 — Mocks e API Client
```

---

*Bloco 5 concluído em: 2026-05-28*  
*Arquivos criados: 7*  
*Arquivos alterados: 5*  
*Build status: ✅ VERDE*
