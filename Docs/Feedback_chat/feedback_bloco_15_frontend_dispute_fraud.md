# Feedback Bloco 15 — Disputa e Fraude Simulada

## 1. Objetivo do bloco

Implementar o fluxo completo de disputa e simulação de fraude: modal avançado com tipo de divergência e schema Zod, comparação visual de hashes, tela dedicada de disputas (`/disputes`), e upgrade dos dialogs do Bloco 14 para usar as novas features.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_14_frontend_contract_actions.md` — contexto completo do Bloco 14
- `web/src/entities/contract/model/api-types.ts` — shapes de payload (OpenDisputePayload, SimulateFraudPayload)
- `web/src/entities/contract/api/use-open-dispute.ts` — mutation existente
- `web/src/shared/ui/select.tsx` — API do Select disponível (Controller necessário com RHF)
- `web/src/shared/lib/formatters.ts` — `formatCurrencyBRL` (não `formatCurrency`)
- `web/src/features/contract-actions/ui/open-dispute-action.tsx` — dialog inline a substituir
- `web/src/features/contract-actions/ui/simulate-fraud-action.tsx` — dialog inline a substituir
- `web/src/app/disputes/page.tsx` — placeholder existente
- `web/src/app/contracts/[id]/_components/contract-dispute-alert.tsx` — mantido sem alteração

---

## 3. Arquivos criados

```txt
web/src/features/open-dispute/model/open-dispute-schema.ts
web/src/features/open-dispute/ui/open-dispute-form.tsx
web/src/features/open-dispute/ui/open-dispute-dialog.tsx
web/src/features/open-dispute/index.ts
web/src/features/simulate-fraud/model/simulate-fraud-schema.ts
web/src/features/simulate-fraud/ui/simulate-fraud-form.tsx
web/src/features/simulate-fraud/ui/simulate-fraud-dialog.tsx
web/src/features/simulate-fraud/index.ts
web/src/app/disputes/_components/dispute-card.tsx
web/src/app/disputes/_components/disputes-summary.tsx
web/src/app/disputes/_components/disputes-page.tsx
Docs/Feedback_chat/feedback_bloco_15_frontend_dispute_fraud.md
```

---

## 4. Arquivos alterados

```txt
web/src/features/contract-actions/ui/open-dispute-action.tsx   → usa OpenDisputeDialog (substituiu dialog inline)
web/src/features/contract-actions/ui/simulate-fraud-action.tsx → usa SimulateFraudDialog (substituiu dialog inline)
web/src/app/disputes/page.tsx                                  → delega para DisputesPage (era placeholder)
web/README.md                                                  → seção "Disputa e fraude simulada" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md               → Bloco 15 marcado como concluído
```

---

## 5. Arquivos não alterados

- `web/src/app/contracts/[id]/_components/contract-dispute-alert.tsx` — mantido sem alteração (adequado como alerta inline)
- `web/src/entities/contract/model/rules.ts` — nenhuma adição necessária (Block 14 adicionou tudo)
- `web/src/features/contract-actions/ui/contract-action-panel.tsx` — nenhuma alteração necessária (já integra OpenDisputeAction e SimulateFraudAction)

---

## 6. Componentes implementados

### `open-dispute-schema.ts`

- `DISPUTE_TYPES` — const array `["DOCUMENT_HASH_MISMATCH", "DELIVERY_NOT_CONFIRMED", "INSPECTION_REJECTED", "PAYMENT_BLOCKED", "OTHER"]`
- `DisputeType` — tipo derivado (`typeof DISPUTE_TYPES[number]`)
- `DISPUTE_TYPE_LABELS` — record legível por tipo
- `openDisputeSchema` — `disputeType: z.enum(DISPUTE_TYPES)`, `reason: z.string().min(10)`, `notes: z.string().optional()`
- `OpenDisputeValues` — tipo inferido

### `open-dispute-form.tsx`

- `useForm<OpenDisputeValues>` + `zodResolver`
- `defaultValues: { reason: "", notes: "" }` (sem `disputeType` — undefined inicial força seleção)
- `Controller` do RHF para o `Select` do shadcn/ui (necessário pois não é input HTML nativo)
- `useWatch({ control, name: "reason" })` para o contador de caracteres (evita `watch` — incompatível com React Compiler)
- Props: `id` (form id para submit externo), `onSubmit`, `disabled`
- Alerta amarelo no topo: "Ao abrir uma disputa, o pagamento será bloqueado..."

### `open-dispute-dialog.tsx`

- `useId()` para gerar form id único (evita colisões)
- `handleOpenChange`: guard `if (isLoading) return`
- `showCloseButton={!isLoading}` passado ao `DialogContent`
- Botão submit via `form={formId}` no `DialogFooter` (submit fora do form element)
- Botão confirmar com `variant="destructive"` + loading state com `Loader2`

### `simulate-fraud-schema.ts`

- `alteredDocumentHash: z.string().min(16, "...")` — required, mínimo 16 chars
- `fraudReason: z.string().min(10, "...")` — required
- `notes: z.string().optional()`
- `generateFakeHash(originalHash)` — gera hex aleatório de mesmo tamanho que o original

### `simulate-fraud-form.tsx`

- `useForm<SimulateFraudValues>` + `zodResolver`
- `useWatch({ control, name: "alteredDocumentHash" })` para reatividade da comparação visual
- `hashDiffers` — booleano que detecta divergência em tempo real
- **Comparação visual:** grid 2 colunas — hash original (estático) vs hash alterado (reativo)
  - Hash original: `border-border bg-muted/20`, texto `text-foreground/70`
  - Hash alterado quando diverge: `border-danger/50 bg-danger/5`, texto `text-danger`
- Botão "Gerar hash falso" — usa `generateFakeHash`, `setValue` com `shouldValidate: true`
- Alerta de rodapé: "Os hashes divergem — uma disputa será aberta ao confirmar."
- Props: `id`, `originalHash`, `onSubmit`, `disabled`

### `simulate-fraud-dialog.tsx`

- Mesmo padrão do `open-dispute-dialog.tsx`
- `sm:max-w-xl` (mais largo que o padrão para acomodar a comparação de hashes)
- Passa `originalHash` para o form

### `dispute-card.tsx`

- Props: `contract: Contract`
- Borda `border-danger/30 bg-danger/5`, hover `hover:border-danger/50`
- Ícone `AlertTriangle` em círculo `bg-danger/10`
- Badge "Em disputa" com `border-danger/40 text-danger`
- Informações: `contractNumber`, `publicAgency` (Building2), `supplierName` (Package)
- Valor com `formatCurrencyBRL`, data com `toLocaleDateString("pt-BR")`
- Hash do documento em box mono se presente
- Botão seta (`ArrowRight`) para `/contracts/${contract.id}`

### `disputes-summary.tsx`

- Props: `contracts: Contract[]`
- 3 cards em grid `sm:grid-cols-3`:
  1. Total de disputas (`AlertTriangle`, `border-danger/30`)
  2. Valor total bloqueado (`DollarSign`, `border-warning/30`)
  3. "Pagamentos bloqueados" (`ShieldOff`, `bg-danger/5`) — CTA visual permanente

### `disputes-page.tsx`

- Client Component `"use client"`
- `useContracts("DISPUTA")` para filtrar contratos em disputa
- Loading: 3 skeletons de summary + 2 skeletons de card
- Empty: `EmptyState` com `CheckCircle2` verde — "Nenhuma disputa ativa"
- Data: `DisputesSummary` + lista de `DisputeCard`

---

## 7. Upgrades nos action components do Bloco 14

### `open-dispute-action.tsx`

- Antes: dialog inline com `Textarea` para motivo (sem tipo de disputa)
- Depois: importa `OpenDisputeDialog` e `OpenDisputeValues` de `@/features/open-dispute`
- `handleSubmit(values: OpenDisputeValues)` — passa `reason` e `disputeType` ao payload
- Sem `useState` para campos de formulário (gerenciados pelo RHF dentro do dialog)
- `setOpen(false)` em `onSuccess`

### `simulate-fraud-action.tsx`

- Antes: dialog inline com `Input` (hash) + `Textarea` (motivo) sem comparação visual
- Depois: importa `SimulateFraudDialog` e `SimulateFraudValues` de `@/features/simulate-fraud`
- `handleSubmit(values: SimulateFraudValues)` — mapeia `alteredDocumentHash` → `newDocumentHash`, `fraudReason` → `reason`
- Passa `originalHash={contract.documentHash ?? ""}` para o dialog

---

## 8. Integração da página `/disputes`

```tsx
// app/disputes/page.tsx — antes
export default function DisputesPage() {
  return (
    <div>
      <PageHeader title="Disputas" description="..." />
      <Card><EmptyState title="Disputas em breve" description="..." /></Card>
    </div>
  );
}

// app/disputes/page.tsx — depois
import { DisputesPage } from "./_components/disputes-page";
export default function Page() {
  return <DisputesPage />;
}
```

---

## 9. Problemas encontrados e resoluções

**Problema — `formatCurrency` não existe:**
O helper correto é `formatCurrencyBRL` em `shared/lib/formatters.ts`. Identificado ao verificar o arquivo antes de criar o `dispute-card.tsx`. Corrigido antes do primeiro uso.

**Problema — `watch` incompatível com React Compiler:**
A regra `react-hooks/incompatible-library` emite warning quando `watch()` de `useForm()` é usado diretamente, pois o React Compiler não consegue memoizar seu retorno. Solução: usar `useWatch({ control, name })` em lugar do `watch` destrutivo — hook dedicado, compatível com o compilador.

**Problema — `AlertTriangle` importado mas não usado em `disputes-page.tsx`:**
O import foi incluído no rascunho inicial mas o componente usa `CheckCircle2` no estado vazio. Removido antes do commit.

---

## 10. Responsividade e visual

- `DisputeCard`: `truncate` em textos longos, `min-w-0` no container para evitar overflow
- `DisputesSummary`: `grid-cols-1` → `sm:grid-cols-3`
- `SimulateFraudForm`: comparação de hashes em `grid-cols-1` → `sm:grid-cols-2`
- `OpenDisputeDialog`: `sm:max-w-lg`
- `SimulateFraudDialog`: `sm:max-w-xl` (mais largo para comportar a comparação)
- Botões de ação adicionais no `DisputeCard` com `sr-only` para acessibilidade

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
| Commit Bloco 15 | pendente |
| Mensagem | `feat(frontend): implement dispute and fraud simulation flow` |
| Branch | `main` |
| Arquivos criados | 12 |
| Arquivos alterados | 5 |

---

## 13. Limites do bloco

- **Resolução de disputas** (quando suportada pelo backend) → Bloco futuro
- **Modal avançado de resolução** (com status final, conclusão) → Bloco futuro
- **Notificações push por evento de disputa** → fora do escopo MVP
- **Tela de auditoria** (`/audit`) → Bloco 17
- **Integração com wallet real** → Bloco 16

---

## 14. Pendências para o Bloco 16

- `features/connect-wallet/`
- `WalletConnectButton` e `WalletStatus` (substituir indicador visual atual)
- Exibir endereço encurtado da wallet conectada
- Alertar rede incorreta (não Polygon Amoy)
- Relacionar wallet conectada com perfil mockado (opcional para demo)

---

## 15. Veredito

**Bloco 15 está concluído e aprovado para avançar para o Bloco 16.**

Todos os critérios de aceite foram atendidos:
- Modal de disputa com schema Zod (reason min 10, disputeType required, notes opcional)
- Select de tipo de disputa via RHF Controller + shadcn/ui Select
- Modal de fraude com comparação visual de hashes lado a lado
- Botão "Gerar hash falso" funcional
- Alerta de divergência em tempo real (sem submit)
- Tela `/disputes` real: summary (3 cards) + lista de `DisputeCard`
- Loading, empty e data states implementados
- `open-dispute-action.tsx` e `simulate-fraud-action.tsx` upgradados para usar os novos dialogs
- `npm run lint`: PASSOU (0 erros, 0 warnings)
- `npm run build`: PASSOU (9 rotas, TypeScript sem erros)
- Backend e smart contract não foram alterados
