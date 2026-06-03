# Feedback Bloco 4 — Modelos de Domínio no Frontend

> **Responsável:** Pessoa 2 — Frontend / UI Lead  
> **Bloco:** 4 — Modelos de Domínio  
> **Data:** 2026-05-28  
> **Status:** ✅ Aprovado — liberado para Bloco 5

---

## 1. Objetivo do Bloco

Criar os modelos de domínio oficiais do frontend com tipagem forte, alinhados ao glossário técnico oficial e ao contrato de API. Nenhuma regra de permissão, mock, hook ou tela foi implementada.

---

## 2. Documentos Consultados

```txt
Docs/Governanca_tecnica/glossario_tecnico_oficial.md
Docs/Contratos_tecnicos/contrato_api_frontend_backend.md
Docs/Governanca_tecnica/decisoes_tecnicas_finais.md
Docs/Planos_implementacao/plano_implementacao_frontend.md
Docs/Cronograma/Tasks_Frontend_implementation.md
```

---

## 3. Arquivos Criados

### entities/contract (3 arquivos)

```txt
web/src/entities/contract/model/types.ts     → ContractStatus, Contract, DashboardSummary, BlockchainStatus
web/src/entities/contract/model/constants.ts → CONTRACT_STATUS_MAP, CONTRACT_STATUS_TRANSITIONS, StatusVariant
web/src/entities/contract/index.ts           → barrel export
```

### entities/contract-event (3 arquivos)

```txt
web/src/entities/contract-event/model/types.ts     → ContractEventType, ContractEvent
web/src/entities/contract-event/model/constants.ts → EVENT_TYPE_MAP, ACTION_EVENT_MAP
web/src/entities/contract-event/index.ts           → barrel export
```

### entities/profile (3 arquivos)

```txt
web/src/entities/profile/model/types.ts     → UserRole, Profile
web/src/entities/profile/model/constants.ts → ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_VISUAL_MAP
web/src/entities/profile/index.ts           → barrel export
```

### entities/wallet (2 arquivos)

```txt
web/src/entities/wallet/model/types.ts → WalletInfo, WalletNetwork, SUPPORTED_NETWORKS, OFFICIAL_CHAIN_ID
web/src/entities/wallet/index.ts       → barrel export
```

### entities/transaction (2 arquivos)

```txt
web/src/entities/transaction/model/types.ts → TransactionStatus, BlockchainTransaction
web/src/entities/transaction/index.ts       → barrel export
```

### shared/lib

```txt
web/src/shared/lib/formatters.ts → formatCurrencyBRL, formatDateBR, formatDateTimeBR,
                                    shortenAddress, shortenHash, formatCurrencyCompact
```

**Total de arquivos criados: 14**

---

## 4. Arquivos Alterados

| Arquivo | O que foi alterado |
|---|---|
| `web/src/shared/types/api.ts` | Extraído `ApiErrorCode` como tipo nomeado; adicionado `PaginatedResponse<T>` |
| `web/src/app/page.tsx` | Adicionada seção de domínio no showcase (status map, roles, formatters) |
| `web/README.md` | Adicionada seção "Domínio frontend" com tabela de entidades e helpers |
| `Docs/Cronograma/Tasks_Frontend_implementation.md` | Bloco 4 marcado como concluído |

---

## 5. Entidades Implementadas

### Contract

```txt
ContractStatus   → "CRIADO" | "ENVIADO" | "ENTREGUE" | "VALIDADO" | "PAGAMENTO_AUTORIZADO" | "DISPUTA"
Contract         → interface completa com todos os campos do contrato público
DashboardSummary → shape de GET /dashboard/summary
BlockchainStatus → shape de GET /contracts/:id/blockchain-status
```

### ContractEvent

```txt
ContractEventType → 8 event types em SCREAMING_SNAKE_CASE (CONTRATO_CRIADO, etc.)
ContractEvent     → interface com importação de ContractStatus e UserRole via @/entities
```

### Profile

```txt
UserRole  → "GESTOR" | "FORNECEDOR" | "ENTREGADOR" | "FISCAL" | "AUDITOR"
Profile   → interface com walletAddress opcional
```

### Wallet

```txt
WalletInfo     → endereço, chainId, isConnected, isCorrectNetwork
WalletNetwork  → chainId, name, explorerUrl
```

### Transaction

```txt
TransactionStatus       → "PENDING" | "CONFIRMED" | "FAILED" (status técnico de infra, inglês permitido)
BlockchainTransaction   → hash, status, explorerUrl, timestamps
```

---

## 6. Tipos Oficiais Implementados

| Tipo | Localização |
|---|---|
| `ContractStatus` | `entities/contract/model/types.ts` |
| `UserRole` | `entities/profile/model/types.ts` |
| `ContractEventType` | `entities/contract-event/model/types.ts` |
| `TransactionStatus` | `entities/transaction/model/types.ts` |
| `ApiResponse<T>` | `shared/types/api.ts` |
| `ApiError` | `shared/types/api.ts` |
| `ApiErrorCode` | `shared/types/api.ts` |
| `PaginatedResponse<T>` | `shared/types/api.ts` |

---

## 7. Maps e Constantes Criadas

### Status do contrato (`CONTRACT_STATUS_MAP`)

Cada status possui:
- `label` — nome exibido na interface (pt-BR)
- `description` — contexto do status (quem deve agir)
- `variant` — `"neutral" | "info" | "warning" | "success" | "danger"` (mapeado para tokens de cor)
- `progress` — percentual de avanço do fluxo (10 → 30 → 55 → 80 → 100, DISPUTA = 50)

Também criado `CONTRACT_STATUS_TRANSITIONS` — quais transições cada status permite.

### Roles (`ROLE_LABELS`, `ROLE_VISUAL_MAP`)

- `ROLE_LABELS` — labels curtos pt-BR por role
- `ROLE_DESCRIPTIONS` — descrição de responsabilidade por role
- `ROLE_ACTIONS` — lista de ações principais por role
- `ROLE_VISUAL_MAP` — map completo com label + description + actions

### Event types (`EVENT_TYPE_MAP`, `ACTION_EVENT_MAP`)

- `EVENT_TYPE_LABELS` — labels pt-BR por event type
- `EVENT_TYPE_DESCRIPTIONS` — descrição contextual por event type
- `EVENT_TYPE_IS_CRITICAL` — se o evento é terminal/crítico
- `EVENT_TYPE_IS_ALERT` — se o evento representa alerta/problema
- `EVENT_TYPE_MAP` — map completo com tudo acima
- `ACTION_EVENT_MAP` — mapa endpoint-ação → event type(s) gerado(s)

---

## 8. Helpers Criados

| Função | Exemplo |
|---|---|
| `formatCurrencyBRL(150000)` | "R$ 150.000,00" |
| `formatDateBR("2026-05-28T...")` | "28/05/2026" |
| `formatDateTimeBR("2026-05-28T14:00:00Z")` | "28/05/2026 11:00" |
| `shortenAddress("0x742d35Cc...")` | "0x742d...35Cc" |
| `shortenHash("abc123def456...")` | "abc123...def456" |
| `formatCurrencyCompact(1500000)` | "R$ 1,5M" |

---

## 9. Atualização do Showcase

`app/page.tsx` recebeu duas seções adicionais:
1. **Status do contrato**: grid com todos os 6 status e seus valores (nome, progress%)
2. **Roles e helpers**: badges por role + chamadas de `formatCurrencyBRL` e `shortenAddress`

A página continua sendo um showcase temporário do Design System + domínio. NÃO é o dashboard real.

---

## 10. Atualização do Checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` atualizado:
- Todas as tasks do Bloco 4 marcadas como `[x]`
- Tasks de versionamento (commit/push) adicionadas e concluídas

---

## 11. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm run build` | ✅ PASSOU — TypeScript válido, imports entre entities funcionando |
| `npm run lint` | ✅ PASSOU — sem erros |
| `npm run dev` | ⚠️ Não executado no ambiente de sessão |

**Verificações específicas do Bloco 4:**
- Sem status em inglês em `ContractStatus` ✅
- Sem roles em inglês em `UserRole` ✅
- Aliases `@/entities/contract`, `@/entities/profile` funcionando ✅
- Sem imports circulares (`contract-event` → `contract` + `profile`, sem volta) ✅
- Barrel exports resolvendo corretamente ✅

---

## 12. Commit e Push

| Item | Valor |
|---|---|
| Hash do commit | `29c46ba` |
| Mensagem | `feat(frontend): add domain models` |
| Branch | `main` |
| Remote | `https://github.com/LukasAlexandre/FiscalizaPay.git` |
| Push | ✅ `94a367d..29c46ba main -> main` |

---

## 13. Problemas Encontrados

```txt
Nenhum problema crítico encontrado.
```

---

## 14. Pendências para o Bloco 5

```txt
[ ] Criar entities/contract/model/rules.ts com:
    - canConfirmShipment(contract, profile): boolean
    - canConfirmDelivery(contract, profile): boolean
    - canValidateReceipt(contract, profile): boolean
    - canAuthorizePayment(contract, profile): boolean
    - canOpenDispute(contract, profile): boolean
    - canSimulateFraud(contract, profile): boolean

[ ] Criar helpers derivados do status map:
    - getContractStatusLabel(status)
    - getContractStatusVariant(status)
    - getContractProgress(status)
    - getNextContractAction(contract, profile)

[ ] Criar entities/contract/ui/ContractStatusBadge.tsx
    - Badge visual mapeando ContractStatus → cor + label
    - Usa CONTRACT_STATUS_MAP para label e variant

[ ] Criar entities/profile/ui/RoleBadge.tsx
    - Badge visual mapeando UserRole → label

[ ] Criar shared/ui/PermissionGate.tsx
    - Wrapper que esconde/desativa elementos baseado em regra
    - Recebe `allowed: boolean` e renderiza children condicionalmente

[ ] Criar entities/profile/model/store.ts (Zustand)
    - useProfileStore para demo de perfil simulado
    - Permite trocar entre GESTOR, FORNECEDOR, etc. na demo
```

---

## 15. Veredito

```txt
✅ Bloco 4 CONCLUÍDO

Entidades implementadas:   5 (contract, contract-event, profile, wallet, transaction)
Tipos criados:             8 (ContractStatus, UserRole, ContractEventType, etc.)
Constants e maps:         12 (CONTRACT_STATUS_MAP, ROLE_VISUAL_MAP, EVENT_TYPE_MAP, etc.)
Helpers:                   6 (formatCurrencyBRL, shortenAddress, etc.)
Barrel exports:            5 (index.ts por entity)
Imports entre entities:   ✅ sem circular deps
Build:                    ✅ VERDE
Lint:                     ✅ VERDE
Commit:                   29c46ba — feat(frontend): add domain models
Push:                     main → origin/main ✅

Próximo bloco: Bloco 5 — Regras Visuais e Permissões
```

---

*Bloco 4 concluído em: 2026-05-28*  
*Arquivos criados: 14*  
*Arquivos alterados: 4*  
*Build status: ✅ VERDE*
