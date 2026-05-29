# Feedback Bloco 12 — Detalhe do Contrato

## 1. Objetivo do bloco

Implementar a tela real de detalhe do contrato em `/contracts/[id]`, substituindo o placeholder da listagem. A página exibe todas as informações do contrato, partes envolvidas, hashes, status blockchain, próxima ação sugerida, eventos recentes e alerta de disputa.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_7_frontend_data_hooks.md` — shapes dos hooks useContractById, useContractEvents, useBlockchainStatus
- `Docs/Feedback_chat/feedback_bloco_10_frontend_contracts_listing.md` — padrão de arquitetura, decisão sobre `src/pages/`
- `Docs/Feedback_chat/feedback_bloco_11_frontend_contract_creation.md` — padrão de Client/Server Component split
- `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` — shapes de Contract, ContractEvent, BlockchainStatus
- `Docs/Governanca_tecnica/glossario_tecnico_oficial.md` — status, roles, event types oficiais
- `Docs/Base_do_projeto/oraculum_design_system.md` — paleta e direção visual
- `web/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` — `params: Promise<{ id: string }>`, `await params` em Server Component

---

## 3. Arquivos criados

```txt
web/src/app/contracts/[id]/page.tsx
web/src/app/contracts/[id]/_components/contract-detail-page.tsx
web/src/app/contracts/[id]/_components/contract-dispute-alert.tsx
web/src/app/contracts/[id]/_components/contract-overview-card.tsx
web/src/app/contracts/[id]/_components/contract-parties-card.tsx
web/src/app/contracts/[id]/_components/contract-hashes-card.tsx
web/src/app/contracts/[id]/_components/contract-blockchain-card.tsx
web/src/app/contracts/[id]/_components/contract-next-action-card.tsx
web/src/app/contracts/[id]/_components/contract-events-preview.tsx
```

---

## 4. Arquivos alterados

```txt
web/README.md                                          → seção "Detalhe do contrato" adicionada; rota /contracts/[id] na tabela de rotas
Docs/Cronograma/Tasks_Frontend_implementation.md      → Bloco 12 marcado como concluído
```

---

## 5. Página /contracts/[id]

**Arquitetura:**

```
app/contracts/[id]/page.tsx                             → Server Component
                                                           await params → passa id para Client
app/contracts/[id]/_components/contract-detail-page.tsx → Client Component
                                                           3 hooks + composição dos 7 sub-componentes
```

A rota `page.tsx` usa o padrão Next.js 16 App Router: `params: Promise<{ id: string }>` + `await params` para extrair o `id` e passar como prop ao Client Component.

**Layout da página:**

```
PageHeader (contractNumber + publicAgency + ContractStatusBadge) + botão Voltar
ContractDisputeAlert [condicional]

Grid 2 colunas (lg):
  ContractOverviewCard
  ContractNextActionCard

Grid 3 colunas (md):
  ContractPartiesCard
  ContractHashesCard
  ContractBlockchainCard

ContractEventsPreview (largura total)
```

---

## 6. Hooks utilizados

| Hook | Dados buscados | Loading isolado |
|---|---|---|
| `useContractById(id)` | Contrato principal | Skeleton de toda a página |
| `useContractEvents(id)` | Lista de eventos | Skeleton só em ContractEventsPreview |
| `useBlockchainStatus(id)` | Status on-chain | Skeleton só em ContractBlockchainCard |

Os 3 hooks são chamados em paralelo pelo TanStack Query — o contrato principal controla o estado global da página; blockchain e eventos têm loading isolado dentro de seus cards.

---

## 7. Componentes implementados

### ContractDisputeAlert

`_components/contract-dispute-alert.tsx` — renderiza `null` se status ≠ DISPUTA. Quando DISPUTA: banner vermelho com `AlertTriangle`, mensagem de pagamento bloqueado e orientação para timeline.

### ContractOverviewCard

`_components/contract-overview-card.tsx` — card principal do contrato:
- contractNumber + updatedAt no header
- `ContractStatusBadge` com `showDescription`
- Barra de progresso (`getContractProgress` → 0–100%)
- Objeto completo do contrato
- Órgão público + fornecedor
- `ContractAmount` (valor) + `formatDateBR` (prazo)

### ContractPartiesCard

`_components/contract-parties-card.tsx` — 4 linhas de partes:
- Gestor (opcional, só renderiza se `managerName` existir)
- Fornecedor
- Fiscal
- Logística / Entregador

Cada linha: avatar muted com User, nome, wallet opcional com `shortenAddress` + `CopyButton`.

### ContractHashesCard

`_components/contract-hashes-card.tsx` — exibe até 3 hashes:
- `documentHash` do contrato
- `blockchainContractId` do contrato
- `transactionHash` do `blockchainStatus`

Cada hash: `shortenHash(val, 8)` + `CopyButton`. Empty state quando nenhum hash existe.

### ContractBlockchainCard

`_components/contract-blockchain-card.tsx` — status on-chain:
- Loading: 3 Skeleton
- `registeredOnChain = false`: ícone Loader2 + "Aguardando registro"
- `registeredOnChain = true`: CheckCircle2 verde + transactionHash + link para explorer (`env.explorerUrl/tx/:hash`) + blockNumber + blockchainTimestamp
- Erro/undefined: XCircle + mensagem amigável

### ContractNextActionCard

`_components/contract-next-action-card.tsx` — Client Component (usa `useProfileStore`):
- `PAGAMENTO_AUTORIZADO`: ícone verde + "Fluxo concluído"
- `DISPUTA`: ícone vermelho + "Pagamento bloqueado"
- `nextAction != null`: ícone ciano + label + description da ação + nota "Bloco 14"
- nenhuma ação: ícone lock + perfil atual + `getBlockedActionReason` + dica de troca de perfil

### ContractEventsPreview

`_components/contract-events-preview.tsx` — últimos 3 eventos (sorted desc por createdAt):
- Ícone colorido por `isAlert`/`isCritical` via `EVENT_TYPE_MAP`
- Label do event type + timestamp
- description (line-clamp-2)
- responsibleName + responsibleRole (ciano)
- documentHash + transactionHash inline com `shortenHash` + `CopyButton`
- CTA visual "Timeline completa no Bloco 13"

---

## 8. Estados de interface

| Estado | Componente | Implementação |
|---|---|---|
| loading principal | ContractDetailPage | Skeleton de toda a página (6 blocks) |
| error principal | ContractDetailPage | `ErrorState` com botão "← Contratos" |
| not found | ContractDetailPage | `EmptyState` com FileSearch + botão "Voltar para contratos" |
| loading eventos | ContractEventsPreview | 3 skeleton rows com avatar + linhas |
| loading blockchain | ContractBlockchainCard | 3 Skeleton horizontais |
| vazio de eventos | ContractEventsPreview | EmptyState "Nenhum evento registrado" |
| vazio de hashes | ContractHashesCard | EmptyState "Nenhum hash registrado" |
| disputa | ContractDisputeAlert | Banner vermelho (só quando status = DISPUTA) |

---

## 9. Dados Web3 exibidos

| Dado | Componente | Formatação |
|---|---|---|
| `documentHash` | ContractHashesCard | `shortenHash(val, 8)` + CopyButton |
| `blockchainContractId` | ContractHashesCard | `shortenHash(val, 8)` + CopyButton |
| `transactionHash` (blockchain) | ContractHashesCard + ContractBlockchainCard | `shortenHash(val, 8)` + CopyButton + ExternalLink |
| `blockNumber` | ContractBlockchainCard | `toLocaleString("pt-BR")` |
| `blockchainTimestamp` | ContractBlockchainCard | `formatDateTimeBR` |
| Explorer link | ContractBlockchainCard | `env.explorerUrl/tx/:transactionHash` (target _blank) |
| Wallets das partes | ContractPartiesCard | `shortenAddress` + CopyButton |
| Hashes nos eventos | ContractEventsPreview | `shortenHash(val, 6)` + CopyButton |

---

## 10. Limites do bloco

Conforme especificação:

- **Timeline auditável completa** → Bloco 13 (ContractTimeline, ContractEventCard, ícones por type, status before/after)
- **Painel de ações final** → Bloco 14 (botões funcionais: confirmar envio/entrega, validar, autorizar, disputar, simular fraude)
- **Modal de disputa** → Bloco 14
- **Simulação de fraude** → Bloco 14
- O `ContractNextActionCard` exibe a ação disponível mas sem botão funcional neste bloco

---

## 11. Responsividade e visual

- Grid primário: `grid-cols-1` → `lg:grid-cols-2` (overview + next action)
- Grid secundário: `grid-cols-1` → `md:grid-cols-2` → `lg:grid-cols-3` (parties + hashes + blockchain)
- Hashes: `break-all` nos valores longos + `shortenHash` para exibição — sem overflow horizontal
- Wallets: `shortenAddress` + truncate — evita quebra de layout
- Progresso visual: barra CSS com `bg-primary`, animação `transition-all duration-500`
- Visual: dark, bordas sutis, ícones muted, destaque ciano para roles/ações, vermelho para disputes/alerts
- Alerta de disputa: `border-danger/30` + `bg-danger/10` — destaque sem agredir o layout

---

## 12. Atualização do README

`web/README.md` atualizado com:
- Rota `/contracts/[id]` na tabela de rotas
- Seção "Detalhe do contrato" com arquitetura, hooks e limites do bloco

---

## 13. Atualização do checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` — Bloco 12 marcado como concluído com todas as tasks, critérios de aceite, limites intencais e versionamento.

---

## 14. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 8 rotas (7 estáticas + 1 dinâmica) |
| `npm run dev` | Não executado (ambiente headless) |

Rota `/contracts/[id]` aparece como `ƒ (Dynamic)` no output do build — correto para rota com params dinâmicos.

---

## 15. Commit e push

| Item | Valor |
|---|---|
| Commit realizado | ✅ sim |
| Hash do commit | `9b2e950` |
| Mensagem | `feat(frontend): implement contract detail page` |
| Push realizado | ✅ sim |
| Branch | `main` |
| Remote | `origin/main` |
| Arquivos no commit | 13 (9 criados, 2 alterados + 2 feedback docs de blocos anteriores) |

---

## 16. Problemas encontrados

**Problema — `web/src/pages/` reapareceu como untracked**

O diretório `web/src/pages/` com `.gitkeep` foi removido no Bloco 10 (commit `c8f301e`). Porém, ao verificar o status antes do commit do Bloco 12, o diretório havia sido recriado no sistema de arquivos (provavelmente por alguma ferramenta ou operação anterior).

**Solução:** Deletado novamente com `rm -rf` antes do commit. O arquivo `.gitkeep` não foi incluído no staging. O diretório `src/pages/` não deve existir neste projeto — ver decisão do Bloco 10.

---

## 17. Pendências para o Bloco 13

- `ContractTimeline` em `widgets/contract-timeline/` — timeline vertical completa
- `ContractEventCard` em `entities/contract-event/ui/` — card individual de evento
- Ícones por `ContractEventType` (mapa visual)
- Status `before → after` visual em cada evento
- Responsável + role por evento
- `documentHash` + `transactionHash` por evento com viewer
- `TransactionHashLink` — link para explorer por transação
- `DocumentHashViewer` — exibição e comparação de document hash
- Animação de entrada (Framer Motion)
- Empty state "Nenhum evento registrado"
- Integração na página de detalhe (substituir `ContractEventsPreview`)

---

## 18. Veredito

**Bloco 12 está concluído e aprovado para avançar para o Bloco 13.**

Todos os critérios de aceite foram atendidos:
- `/contracts/[id]` implementado como tela real com rota dinâmica
- `useContractById`, `useContractEvents`, `useBlockchainStatus` consumidos sem fetch direto
- 7 sub-componentes criados (`ContractOverviewCard`, `ContractPartiesCard`, `ContractHashesCard`, `ContractBlockchainCard`, `ContractNextActionCard`, `ContractEventsPreview`, `ContractDisputeAlert`)
- Status em destaque no PageHeader com badge
- Partes envolvidas exibidas com wallets
- documentHash, transactionHash, blockchainContractId exibidos com CopyButton
- Explorer link funcional via `env.explorerUrl`
- Loading/Error/NotFound states implementados
- Loading isolado para blockchain e eventos
- Alerta de disputa implementado
- Timeline completa e painel de ações NÃO implementados (escopo correto)
- Layout responsivo mobile/desktop
- Visual alinhado ao Design System Oraculum
- `npm run lint`: PASSOU
- `npm run build`: PASSOU (8 rotas, `/contracts/[id]` como dynamic)
- Commit `9b2e950` e push realizados
- Backend e smart contract não foram alterados
