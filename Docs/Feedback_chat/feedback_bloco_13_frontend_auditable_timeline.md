# Feedback Bloco 13 — Timeline Auditável

## 1. Objetivo do bloco

Implementar a timeline auditável completa dentro da tela de detalhe do contrato, substituindo o `ContractEventsPreview` do Bloco 12. A timeline exibe todos os eventos do contrato em ordem cronológica com ícones por tipo, transição de status, responsável com role badge, e hashes de documento e transação blockchain.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_12_frontend_contract_detail.md` — shapes de ContractEvent, hooks useContractEvents, padrão de arquitetura da tela de detalhe
- `web/src/entities/contract-event/model/types.ts` — tipo ContractEvent completo (incluindo statusBefore, statusAfter, responsibleName, responsibleWallet, blockchainTimestamp)
- `web/src/entities/contract-event/model/constants.ts` — EVENT_TYPE_MAP, EVENT_TYPE_LABELS, EVENT_TYPE_IS_CRITICAL, EVENT_TYPE_IS_ALERT
- `web/src/entities/contract/model/constants.ts` — CONTRACT_STATUS_MAP, StatusVariant
- `web/src/entities/profile/ui/role-badge.tsx` — componente RoleBadge existente
- `web/src/shared/ui/motion-container.tsx` — padrão Framer Motion do projeto
- `web/src/shared/config/env.ts` — env.explorerUrl

---

## 3. Arquivos criados

```txt
web/src/entities/contract-event/ui/event-type-icon.tsx
web/src/entities/contract-event/ui/status-transition.tsx
web/src/entities/contract-event/ui/document-hash-viewer.tsx
web/src/entities/contract-event/ui/contract-event-card.tsx
web/src/entities/transaction/ui/transaction-hash-link.tsx
web/src/app/contracts/[id]/_components/contract-timeline.tsx
```

---

## 4. Arquivos alterados

```txt
web/src/app/contracts/[id]/_components/contract-detail-page.tsx  → ContractEventsPreview → ContractTimeline
web/src/entities/contract-event/index.ts                          → 4 novas re-exportações de ui/
web/src/entities/transaction/index.ts                             → 1 nova re-exportação de ui/
web/README.md                                                      → seção "Timeline auditável" adicionada; "Próximo bloco" atualizado para Bloco 14
Docs/Cronograma/Tasks_Frontend_implementation.md                  → Bloco 13 marcado como concluído
```

---

## 5. Arquivos removidos

```txt
web/src/app/contracts/[id]/_components/contract-events-preview.tsx  → substituído por ContractTimeline
```

---

## 6. Arquitetura dos componentes

```
ContractTimeline (contract-timeline.tsx)
  "use client" — ordena eventos asc, Framer Motion stagger
  └── ContractEventCard (entities/contract-event/ui/)
        ├── EventTypeIcon          → ícone Lucide por ContractEventType
        ├── StatusTransition       → statusBefore → statusAfter (se presentes)
        ├── RoleBadge              → role do responsável (existia em entities/profile/ui/)
        ├── DocumentHashViewer     → documentHash + shortenHash(6) + CopyButton
        └── TransactionHashLink    → transactionHash + explorer link + CopyButton
```

---

## 7. Componentes implementados

### EventTypeIcon

`entities/contract-event/ui/event-type-icon.tsx` — mapa `LucideIcon` por `ContractEventType`:

| EventType | Ícone |
|---|---|
| CONTRATO_CRIADO | FilePlus |
| ENVIO_CONFIRMADO | Truck |
| ENTREGA_CONFIRMADA | Package |
| RECEBIMENTO_VALIDADO | ClipboardCheck |
| PAGAMENTO_AUTORIZADO | CheckCircle2 |
| DISPUTA_ABERTA | AlertTriangle |
| FRAUDE_SIMULADA | ShieldX |
| HASH_REGISTRADO | Hash |

### StatusTransition

`entities/contract-event/ui/status-transition.tsx` — exibe `statusBefore → statusAfter` com cores por variante do `CONTRACT_STATUS_MAP`:
- neutral → `text-muted-foreground`
- info → `text-blue-400`
- warning → `text-warning`
- success → `text-success`
- danger → `text-danger`

Renderizado somente quando `statusBefore` e `statusAfter` existem.

### DocumentHashViewer

`entities/contract-event/ui/document-hash-viewer.tsx` — ícone `FileText` + `shortenHash(hash, 6)` + `CopyButton`. Inline, font-mono.

### TransactionHashLink

`entities/transaction/ui/transaction-hash-link.tsx` — `shortenHash(hash, 6)` + link `env.explorerUrl/tx/:hash` (target _blank, rel noopener) com `ExternalLink` + `CopyButton`. Font-mono.

### ContractEventCard

`entities/contract-event/ui/contract-event-card.tsx` — card de evento individual:
- Dot colorido: `bg-danger/10` (isAlert), `bg-success/10` (isCritical), `bg-primary/10` (default)
- Ícone: `text-danger` / `text-success` / `text-primary`
- Conector vertical `w-px bg-border` — ausente no último evento (`isLast`)
- Label (`text-danger` se isAlert, `text-foreground` default) + timestamp
- Descrição completa (sem line-clamp — timeline auditável mostra tudo)
- `StatusTransition` quando statusBefore+statusAfter presentes
- `responsibleName` + `RoleBadge` quando responsibleName presente
- `DocumentHashViewer` + `TransactionHashLink` quando hashes presentes
- Padding-bottom (`pb-6`) em todos exceto o último

### ContractTimeline

`app/contracts/[id]/_components/contract-timeline.tsx` — `"use client"`:
- Ordena eventos `asc` por `createdAt` (cronológico — mais antigo primeiro)
- Header: "Timeline auditável" + contador de eventos (ex: "4 eventos")
- Loading: 3 skeleton rows (circle + 3 linhas)
- Vazio: `EmptyState` com `Clock` + "Nenhum evento registrado"
- Eventos: `motion.div` com `initial={{ opacity: 0, y: 12 }}`, `delay: idx * 0.06`, `duration: 0.3`, `ease: "easeOut"`

---

## 8. Estados de interface

| Estado | Implementação |
|---|---|
| loading | 3 skeleton rows: `h-9 w-9 rounded-full` + 3 linhas de Skeleton |
| vazio | EmptyState Clock + "Nenhum evento registrado" |
| preenchido | Lista com Framer Motion stagger + ContractEventCard por evento |

---

## 9. Dados exibidos por evento

| Dado | Componente | Formatação |
|---|---|---|
| `eventType` | EventTypeIcon | Ícone Lucide por type |
| `eventType` | ContractEventCard (label) | `EVENT_TYPE_MAP[type].label` |
| `createdAt` | ContractEventCard | `formatDateTimeBR` |
| `description` | ContractEventCard | texto completo (sem clamp) |
| `statusBefore` → `statusAfter` | StatusTransition | `CONTRACT_STATUS_MAP[s].label` com cores por variante |
| `responsibleName` | ContractEventCard | texto direto |
| `responsibleRole` | RoleBadge | `ROLE_LABELS[role]` + badge ciano |
| `documentHash` | DocumentHashViewer | `shortenHash(val, 6)` + CopyButton |
| `transactionHash` | TransactionHashLink | `shortenHash(val, 6)` + explorer link + CopyButton |

---

## 10. Decisões técnicas

**Ordenação cronológica (asc):** eventos mais antigos primeiro, mostrando a evolução do contrato. Inverso do Block 12 preview (que mostrava os 3 mais recentes).

**Sem `widgets/contract-timeline/`:** o componente foi criado em `app/contracts/[id]/_components/` por ser exclusivo dessa rota. O spec mencionava preferência por essa localização.

**`ContractEventCard` sem `"use client"`:** é um componente puramente presentacional. Renderizado no contexto do `ContractTimeline` (que é `"use client"`), funciona corretamente.

**`RoleBadge` reutilizado:** o componente já existia em `entities/profile/ui/role-badge.tsx`. Não foi duplicado.

**Sem `widgets/` para os sub-componentes:** `EventTypeIcon`, `DocumentHashViewer`, `TransactionHashLink`, `StatusTransition` foram criados em `entities/*/ui/` conforme FSD — componentes de domínio, não widgets.

---

## 11. Integração com a tela de detalhe

`contract-detail-page.tsx` — única mudança:
- Import de `ContractEventsPreview` → `ContractTimeline`
- `<ContractEventsPreview events={events} isLoading={eventsLoading} />` → `<ContractTimeline events={events} isLoading={eventsLoading} />`

Props identicas (`events?: ContractEvent[]`, `isLoading: boolean`) — integração zero-friction.

---

## 12. Atualização dos índices de entidade

`entities/contract-event/index.ts` — adicionadas 4 exportações:
```ts
export * from "./ui/event-type-icon";
export * from "./ui/status-transition";
export * from "./ui/document-hash-viewer";
export * from "./ui/contract-event-card";
```

`entities/transaction/index.ts` — adicionada 1 exportação:
```ts
export * from "./ui/transaction-hash-link";
```

---

## 13. Atualização do README

`web/README.md` — adicionada seção "Timeline auditável" com:
- Arquitetura dos componentes
- Decisão de ordenação cronológica
- Descrição de cada `ContractEventCard`
- Nota sobre conector vertical
- "Próximo bloco" atualizado para Bloco 14

---

## 14. Atualização do checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` — Bloco 13 marcado como concluído com todas as tasks, critérios de aceite, limites intenciais e commit pendente.

---

## 15. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 8 rotas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 16. Commit e push

| Item | Valor |
|---|---|
| Commit realizado | ⏳ pendente (aguarda aprovação) |
| Mensagem prevista | `feat(frontend): implement auditable contract timeline` |
| Push | ⏳ pendente |
| Branch | `main` |
| Arquivos previstos | 11 (6 criados, 4 alterados, 1 removido) |

---

## 17. Limites do bloco

Conforme especificação:

- **Painel de ações final** → Bloco 14 (botões funcionais: confirmar envio/entrega, validar, autorizar, disputar, simular fraude)
- **Modal de disputa** → Bloco 14
- **Simulação de fraude** → Bloco 14

---

## 18. Pendências para o Bloco 14

- `features/confirm-shipment/` — botão + mutation + dialog de confirmação
- `features/confirm-delivery/` — idem
- `features/validate-receipt/` — idem
- `features/authorize-payment/` — idem
- `features/open-dispute/` — modal com campo de motivo
- `features/simulate-fraud/` — botão restrito a GESTOR/FISCAL com documentHash
- `widgets/contract-action-panel/` — painel que compõe as features acima
- Integração na tela de detalhe (substituir nota "Bloco 14" no `ContractNextActionCard`)
- Estados de loading/disabled nos botões
- Tooltip explicativo para ações bloqueadas
- Toast de sucesso/erro (já implementado nas mutations do Bloco 7)

---

## 19. Veredito

**Bloco 13 está concluído e aprovado para avançar para o Bloco 14.**

Todos os critérios de aceite foram atendidos:
- `ContractTimeline` implementado em `app/contracts/[id]/_components/` com Framer Motion
- `ContractEventCard` com ícone, label, descrição, status before→after, responsável, role, hashes
- `EventTypeIcon` com mapa completo de 8 tipos → Lucide icons
- `StatusTransition` com cores por variante do Design System
- `DocumentHashViewer` com `shortenHash(6)` + `CopyButton`
- `TransactionHashLink` com explorer link + `CopyButton`
- `ContractEventsPreview` removido e substituído por `ContractTimeline`
- Entidades `contract-event` e `transaction` com exports de UI atualizados
- Loading skeleton, empty state e animação de entrada implementados
- `npm run lint`: PASSOU
- `npm run build`: PASSOU (8 rotas, TypeScript sem erros)
- Backend e smart contract não foram alterados
