# Feedback Bloco 14 — Painel de Ações do Contrato

## 1. Objetivo do bloco

Implementar o painel funcional de ações do contrato dentro da tela `/contracts/[id]`, permitindo executar as ações previstas no fluxo respeitando regras visuais por perfil/status e usando as mutations já criadas no Bloco 7. O `ContractNextActionCard` (informativo) foi substituído pelo `ContractActionPanel` (funcional).

---

## 2. Pré-validação do Bloco 13

O Bloco 13 estava com código concluído mas **sem commit**. Ao iniciar o Bloco 14, foi necessário:
1. Verificar `git status` e `git log` — confirmado: Bloco 13 sem commit.
2. Identificar que `contract-events-preview.tsx` havia sido deletado do disco mas não do índice git (problema com glob `[id]` no path no Windows).
3. Resolver com `git rm --cached` usando path escapado.
4. Executar `git add -A` + commit.

**Commit do Bloco 13:** `edab7bf` — `feat(frontend): implement auditable contract timeline`  
**Push:** ✅ `origin/main`

---

## 3. Documentos lidos

- `web/src/entities/contract/model/rules.ts` — regras visuais completas
- `web/src/entities/contract/api/use-confirm-shipment.ts` (e demais mutations) — payloads e invalidações
- `web/src/shared/api/contracts-api.ts` — payloads completos: `ContractActionPayload`, `OpenDisputePayload`, `SimulateFraudPayload`
- `web/src/entities/contract/model/api-types.ts` — shapes de payload
- `web/src/shared/ui/dialog.tsx` — API do Dialog disponível
- `web/src/shared/ui/button.tsx` — variantes disponíveis
- `web/src/app/contracts/[id]/_components/contract-next-action-card.tsx` — componente substituído
- `Docs/Cronograma/Tasks_Frontend_implementation.md` — Bloco 14

---

## 4. Arquivos criados

```txt
web/src/features/contract-actions/ui/action-button.tsx
web/src/features/contract-actions/ui/confirm-dialog.tsx
web/src/features/contract-actions/ui/confirm-shipment-action.tsx
web/src/features/contract-actions/ui/confirm-delivery-action.tsx
web/src/features/contract-actions/ui/validate-receipt-action.tsx
web/src/features/contract-actions/ui/authorize-payment-action.tsx
web/src/features/contract-actions/ui/open-dispute-action.tsx
web/src/features/contract-actions/ui/simulate-fraud-action.tsx
web/src/features/contract-actions/ui/register-on-chain-action.tsx
web/src/features/contract-actions/ui/contract-action-panel.tsx
web/src/features/contract-actions/index.ts
Docs/Feedback_chat/feedback_bloco_14_frontend_contract_actions.md
```

---

## 5. Arquivos alterados

```txt
web/src/entities/contract/model/rules.ts                          → getCanonicalNextAction + CONTRACT_ACTION_LABELS adicionados
web/src/app/contracts/[id]/_components/contract-detail-page.tsx   → ContractNextActionCard → ContractActionPanel (+ blockchainStatus passado)
web/README.md                                                      → seção "Painel de ações do contrato" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md                  → Bloco 14 marcado como concluído
```

---

## 6. Arquivos removidos

```txt
web/src/app/contracts/[id]/_components/contract-next-action-card.tsx  → substituído por ContractActionPanel
```

---

## 7. Componentes implementados

### ActionButton

`features/contract-actions/ui/action-button.tsx` — botão reutilizável:
- Props: `label`, `loadingLabel`, `icon`, `onClick`, `isLoading`, `disabled`, `disabledReason`, `variant`, `className`
- Quando `disabled + disabledReason`: exibe texto pequeno abaixo do botão
- Quando `isLoading`: exibe `Loader2 animate-spin` + `loadingLabel`
- Largura total (`w-full`) por padrão

### ConfirmDialog

`features/contract-actions/ui/confirm-dialog.tsx` — dialog de confirmação reutilizável:
- Wrappa `Dialog` do shadcn/ui
- Props: `title`, `description`, `onConfirm`, `isLoading`, `confirmLabel`, `cancelLabel`, `confirmDisabled`, `destructive`, `children`
- Durante loading: fecha com `showCloseButton={false}` e bloqueia `onOpenChange`
- `confirmDisabled`: desabilita o botão confirmar sem loading (usado para validação de formulário)
- `children`: espaço para campos de formulário (Textarea, Input)

### ConfirmShipmentAction / ConfirmDeliveryAction / ValidateReceiptAction

Padrão idêntico:
- `useState(false)` para dialog
- Chama `can*` + `getBlockedActionReason` para `disabledReason`
- `useMutation` do Bloco 7
- `onSuccess: () => setOpen(false)` no mutate callback
- Dialog de confirmação sem campos adicionais

### AuthorizePaymentAction

Mesmo padrão, com texto de dialog enfatizando ser etapa crítica e irreversível. Sem variante destructive (é uma ação positiva, não destrutiva).

### OpenDisputeAction

- `useState` para `open` + `reason` (string)
- Dialog com `Textarea` para o motivo (obrigatório — `reason.trim()` vazio desabilita confirmar via `confirmDisabled`)
- `handleOpenChange`: limpa `reason` ao fechar
- `handleConfirm`: guarda contra `!reason.trim()`, chama `useOpenDispute`
- Botão: `variant="outline"` com classes customizadas `border-warning/50 text-warning hover:bg-warning/10`
- Dialog `destructive` (vermelho no confirmar)

### SimulateFraudAction

- `useState` para `open`, `newHash`, `reason`
- Dialog com `Input` para `newDocumentHash` (obrigatório) + `Textarea` para `reason` (opcional)
- `confirmDisabled={!newHash.trim()}`
- Botão: `variant="outline"` com classes `border-danger/50 text-danger hover:bg-danger/10`
- Dialog `destructive`
- `handleOpenChange`: limpa ambos estados

### RegisterOnChainAction

- Se `blockchainStatus?.registeredOnChain`: renderiza badge verde "Contrato registrado na blockchain"
- Se não: `ActionButton` + `ConfirmDialog` (sem campos, apenas confirmação)
- Usa `useRegisterOnChain()` — variáveis: `contractId: string`

### ContractActionPanel

`features/contract-actions/ui/contract-action-panel.tsx` — painel principal `"use client"`:

Props: `{ contract: Contract; blockchainStatus?: BlockchainStatus }`

Internamente: `currentProfile` de `useProfileStore`.

**Estados:**

| Status | Renderização |
|---|---|
| `PAGAMENTO_AUTORIZADO` | CheckCircle2 verde + "Fluxo concluído" |
| `DISPUTA` | AlertTriangle vermelho + "Pagamento bloqueado" + SimulateFraud se `canDoFraud` |
| Normal + nextAction | Card destacado `border-primary/30 bg-primary/5` + botão Zap + ação correspondente |
| Normal + sem nextAction | Card muted Lock + "Aguardando: {ação}" + razão do bloqueio |

**Seção de ações adicionais** (quando `!isCompleted && !isDisputed`):
- `canOpenDispute` → `<OpenDisputeAction />`
- `canSimulateFraud` → `<SimulateFraudAction />`
- Separador visual antes da seção se há pelo menos uma ação

**Seção blockchain** (quando `!isCompleted && !blockchainStatus?.registeredOnChain`):
- `<RegisterOnChainAction />` com separador visual

---

## 8. Regras visuais utilizadas

| Função | Uso |
|---|---|
| `canConfirmShipment` | `ConfirmShipmentAction` — pode/não pode + razão |
| `canConfirmDelivery` | `ConfirmDeliveryAction` |
| `canValidateReceipt` | `ValidateReceiptAction` |
| `canAuthorizePayment` | `AuthorizePaymentAction` |
| `canOpenDispute` | `ContractActionPanel` — visibilidade da ação |
| `canSimulateFraud` | `ContractActionPanel` — visibilidade da ação |
| `getNextContractAction` | `ContractActionPanel` — qual ação principal renderizar |
| `getCanonicalNextAction` | `ContractActionPanel` — "Aguardando: X" quando perfil não pode executar |
| `getBlockedActionReason` | `ContractActionPanel` + actions — texto explicativo abaixo do botão |
| `CONTRACT_ACTION_LABELS` | `ContractActionPanel` — label legível da ação canônica |

**Adições à camada de rules (`rules.ts`):**

```ts
export const CONTRACT_ACTION_LABELS: Record<ContractAction, string> = {
  CONFIRM_SHIPMENT: "Confirmar envio",
  // ...
};

export function getCanonicalNextAction(contract: Contract): ContractAction | null {
  switch (contract.status) {
    case "CRIADO": return "CONFIRM_SHIPMENT";
    case "ENVIADO": return "CONFIRM_DELIVERY";
    case "ENTREGUE": return "VALIDATE_RECEIPT";
    case "VALIDADO": return "AUTHORIZE_PAYMENT";
    default: return null;
  }
}
```

---

## 9. Mutations utilizadas

| Hook | Ação |
|---|---|
| `useConfirmShipment` | `ConfirmShipmentAction` |
| `useConfirmDelivery` | `ConfirmDeliveryAction` |
| `useValidateReceipt` | `ValidateReceiptAction` |
| `useAuthorizePayment` | `AuthorizePaymentAction` |
| `useOpenDispute` | `OpenDisputeAction` (payload: `{ reason }`) |
| `useSimulateFraud` | `SimulateFraudAction` (payload: `{ newDocumentHash, reason? }`) |
| `useRegisterOnChain` | `RegisterOnChainAction` (variáveis: `contractId`) |

Todas as mutations já invalidam as queries necessárias e exibem toast.success/error (implementado no Bloco 7 — não duplicado).

---

## 10. Confirmações e loading

**Ações com confirmação obrigatória (Dialog):**
- `CONFIRM_SHIPMENT` — confirmação simples
- `CONFIRM_DELIVERY` — confirmação simples
- `VALIDATE_RECEIPT` — confirmação simples
- `AUTHORIZE_PAYMENT` — confirmação com destaque de irreversibilidade
- `OPEN_DISPUTE` — confirmação + Textarea para motivo (required)
- `SIMULATE_FRAUD` — confirmação + Input para newDocumentHash (required) + Textarea (opcional)
- `REGISTER_ON_CHAIN` — confirmação de irreversibilidade

**Loading por ação:**
- Cada componente usa `mutation.isPending` de forma independente
- O botão exibe `Loader2 animate-spin` + `loadingLabel` durante loading
- O dialog bloqueia o close durante loading (`showCloseButton={false}` + guard em `onOpenChange`)
- A página não é bloqueada — loading é por ação

**Botões desabilitados:**
- `disabled={!can}` + `disabledReason={...}` via `getBlockedActionReason`
- Texto de razão aparece abaixo do botão (sem tooltip — melhor acessibilidade mobile)

---

## 11. Integração no detalhe do contrato

`contract-detail-page.tsx` — mudanças:
- Importa `ContractActionPanel` de `@/features/contract-actions`
- Substitui `<ContractNextActionCard contract={contract} />` por `<ContractActionPanel contract={contract} blockchainStatus={blockchainStatus} />`
- `blockchainStatus` já estava disponível no componente (hook `useBlockchainStatus`)

**Decisão sobre `ContractNextActionCard`:**
- Removido completamente (deletado via `git rm`)
- `ContractActionPanel` cobre todos os estados que o card antigo cobria (concluído, disputa, próxima ação, bloqueado) e adiciona funcionalidade real

---

## 12. Limites do bloco

- **Fluxo completo de disputa/fraude** → Bloco 15
- **Modal avançado de disputa** (com tipo de divergência, form completo) → Bloco 15
- **Visual de comparação de hashes** (original vs adulterado) → Bloco 15
- **Tela dedicada de disputas** → Bloco 15
- O `OpenDisputeAction` e `SimulateFraudAction` são funcionais mas básicos neste bloco

---

## 13. Responsividade e visual

- `ActionButton`: largura total (`w-full`), empilha bem no mobile
- `ConfirmDialog`: `DialogContent` com `max-w-[calc(100%-2rem)] sm:max-w-lg` (herda do shadcn/ui)
- Botões de ação adicionais com classes customizadas mas compatíveis com variants do shadcn/ui
- Seções separadas com `<Separator />` para hierarquia visual clara
- Destacado ciano (`border-primary/30 bg-primary/5`) para próxima ação
- Vermelho (`border-danger/50 text-danger`) para simular fraude
- Amarelo (`border-warning/50 text-warning`) para abrir disputa
- Fundo muted (`bg-muted/20 border-border`) para ação bloqueada

---

## 14. Atualização do README

`web/README.md` — seção "Painel de ações do contrato" adicionada com:
- Arquitetura de arquivos
- Regras visuais usadas
- Mutations usadas
- Nota sobre backend como fonte definitiva de segurança

---

## 15. Atualização do checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md`:
- Bloco 13: commit atualizado para `edab7bf` (feito na pré-validação)
- Bloco 14: todas as tasks marcadas como concluídas
- Critérios de aceite marcados
- Limites intenciais documentados

---

## 16. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 8 rotas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 17. Commit e push

| Item | Valor |
|---|---|
| Pré-commit (Bloco 13) | `edab7bf` — `feat(frontend): implement auditable contract timeline` |
| Commit Bloco 14 | ⏳ pendente após criação deste feedback |
| Mensagem prevista | `feat(frontend): implement contract action panel` |
| Push | ⏳ pendente |
| Branch | `main` |
| Arquivos previstos | ~15 (11 criados, 3 alterados, 1 removido) |

---

## 18. Problemas encontrados

**Problema — `alert-dialog` não instalado:**
O shadcn/ui `alert-dialog` não estava disponível em `shared/ui/`. O `Dialog` existente foi usado como substituto para todos os diálogos de confirmação, sem instalar nova dependência. A experiência é equivalente.

**Problema — `label.tsx` não disponível:**
O componente `Label` do shadcn/ui não estava instalado. Foram usados `<p>` e `<span>` como labels nos formulários dos dialogs.

**Problema — git rm com `[id]` no path:**
Assim como no Bloco 13, o path `web/src/app/contracts/[id]/...` requer uso de `git rm -- "web/src/app/contracts/[[]id[]]/..."` com caracteres escapados para funcionar no PowerShell.

---

## 19. Pendências para o Bloco 15

- Fluxo completo de disputa: modal com campo de motivo + tipo de divergência + schema Zod
- Hash comparison visual: exibição lado a lado (original vs adulterado)
- Efeito visual de alerta de fraude
- Estado `DISPUTA` com UX de risco
- Tela dedicada de disputas (`/disputes`)
- Eventos `FRAUDE_SIMULADA` e `DISPUTA_ABERTA` com destaque visual especial na timeline
- Resolução de disputas (quando suportada pelo backend)

---

## 20. Veredito

**Bloco 14 está concluído e aprovado para avançar para o Bloco 15.**

Todos os critérios de aceite foram atendidos:
- `ContractActionPanel` criado em `features/contract-actions/`
- `ActionButton` e `ConfirmDialog` reutilizáveis criados
- 7 action components criados (shipment, delivery, receipt, payment, dispute, fraud, on-chain)
- Regras visuais do Bloco 5 usadas sem duplicação
- Mutations do Bloco 7 consumidas — sem fetch direto
- Confirmação obrigatória para AUTHORIZE_PAYMENT, OPEN_DISPUTE, SIMULATE_FRAUD, REGISTER_ON_CHAIN
- Loading independente por ação via `isPending`
- Motivo de bloqueio exibido abaixo do botão desabilitado
- Perfil atual (`useProfileStore`) respeitado
- Status atual respeitado (`getNextContractAction`, `canOpenDispute`, `canSimulateFraud`)
- `ContractNextActionCard` substituído por `ContractActionPanel` na detail page
- Timeline atualiza após ação via invalidação de `contractEvents` nas mutations
- `web/README.md` atualizado
- `Tasks_Frontend_implementation.md` atualizado com Bloco 14 concluído
- `npm run lint`: PASSOU
- `npm run build`: PASSOU (8 rotas, TypeScript sem erros)
- Backend e smart contract não foram alterados
