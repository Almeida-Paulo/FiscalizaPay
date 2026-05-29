# Feedback Bloco 7 — TanStack Query e Hooks de Dados

## 1. Objetivo do bloco

Criar a camada de data fetching do FiscalizaPay Web3, composta por: query hooks (leitura reativa), mutation hooks (ações com invalidação de cache), query keys centralizadas, helper de tratamento de erro, e persistência em memória para que mutações em mock mode reflitam nos re-fetches subsequentes do TanStack Query.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_6_frontend_api_mocks.md` (principal — pendências do Bloco 6)
- `Docs/Cronograma/Tasks_Frontend_implementation.md` (seção Bloco 7)
- Código existente dos Blocos 4, 5 e 6 (lido antes de criar qualquer arquivo)

---

## 3. Arquivos criados

```txt
web/src/shared/mocks/mock-store.ts
web/src/shared/api/query-keys.ts
web/src/shared/api/handle-api-error.ts
web/src/entities/contract/api/use-dashboard-summary.ts
web/src/entities/contract/api/use-contracts.ts
web/src/entities/contract/api/use-contract-by-id.ts
web/src/entities/contract/api/use-create-contract.ts
web/src/entities/contract/api/use-confirm-shipment.ts
web/src/entities/contract/api/use-confirm-delivery.ts
web/src/entities/contract/api/use-validate-receipt.ts
web/src/entities/contract/api/use-authorize-payment.ts
web/src/entities/contract/api/use-open-dispute.ts
web/src/entities/contract/api/use-simulate-fraud.ts
web/src/entities/contract/api/index.ts
web/src/entities/contract-event/api/use-contract-events.ts
web/src/entities/contract-event/api/index.ts
web/src/entities/transaction/api/use-blockchain-status.ts
web/src/entities/transaction/api/use-register-on-chain.ts
web/src/entities/transaction/api/index.ts
web/src/app/query-showcase.tsx
```

---

## 4. Arquivos alterados

```txt
web/src/shared/api/contracts-api.ts    → usa mockStore (era arrays estáticos)
web/src/shared/api/dashboard-api.ts   → usa mockStore.getDashboardSummary()
web/src/shared/api/blockchain-api.ts  → usa mockStore + persiste evento HASH_REGISTRADO
web/src/shared/api/index.ts           → exporta queryKeys e getApiErrorMessage
web/src/shared/mocks/index.ts         → exporta mockStore
web/src/app/page.tsx                  → seção Bloco 7 adicionada com QueryShowcase
web/README.md                         → seção "Data Fetching" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md → Bloco 7 marcado como concluído
```

---

## 5. Mock Store

`shared/mocks/mock-store.ts` é um singleton module-level com estado mutável.

**Por quê é necessário:** O TanStack Query invalida e re-busca dados após cada mutation. Em mock mode, sem persistência, o re-fetch retornaria sempre os dados originais estáticos — as mutations não teriam efeito visível na UI.

**Como funciona:**
- Estado inicial copiado dos arrays estáticos dos mocks (`.map(c => ({ ...c }))`)
- Reads: `getContracts()`, `getContractById(id)`, `getEventsByContractId(contractId)`, `getBlockchainStatus(contractId)`, `getDashboardSummary()` (derivado dinamicamente)
- Writes: `addContract()`, `updateContract()`, `removeContract()`, `addEvent()`, `upsertBlockchainStatus()`, `reset()`
- Reseta ao recarregar a página (intencional para demo)

**getDashboardSummary()** computa os contadores dinamicamente a partir de `_contracts` — assim após uma mutation de status, o dashboard já mostra o conteo atualizado no próximo re-fetch.

---

## 6. Query Keys

`shared/api/query-keys.ts`:

```ts
export const queryKeys = {
  dashboardSummary: ["dashboard-summary"] as const,
  contracts: ["contracts"] as const,
  contract: (contractId: string) => ["contract", contractId] as const,
  contractEvents: (contractId: string) => ["contract-events", contractId] as const,
  blockchainStatus: (contractId: string) => ["blockchain-status", contractId] as const,
} as const;
```

---

## 7. Handle API Error

`shared/api/handle-api-error.ts` extrai a mensagem de erro de qualquer `unknown`:
- `HttpClientError` → `error.apiError.message`
- `Error` → `error.message`
- Fallback → `"Não foi possível concluir a operação. Tente novamente."`

Usado em todos os `onError` das mutations.

---

## 8. Query Hooks

| Hook | Arquivo | Query Key |
|---|---|---|
| `useDashboardSummary` | `entities/contract/api/` | `["dashboard-summary"]` |
| `useContracts(status?)` | `entities/contract/api/` | `["contracts"]` |
| `useContractById(id)` | `entities/contract/api/` | `["contract", id]` |
| `useContractEvents(id)` | `entities/contract-event/api/` | `["contract-events", id]` |
| `useBlockchainStatus(id)` | `entities/transaction/api/` | `["blockchain-status", id]` |

Todos com `enabled: !!contractId` (quando recebem ID como parâmetro) para evitar queries com ID vazio.

---

## 9. Mutation Hooks

| Hook | Arquivo | Variables | Invalidações |
|---|---|---|---|
| `useCreateContract` | `entities/contract/api/` | `CreateContractPayload` | `contracts`, `dashboardSummary` |
| `useConfirmShipment` | `entities/contract/api/` | `{ contractId, payload? }` | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` |
| `useConfirmDelivery` | `entities/contract/api/` | `{ contractId, payload? }` | idem |
| `useValidateReceipt` | `entities/contract/api/` | `{ contractId, payload? }` | idem |
| `useAuthorizePayment` | `entities/contract/api/` | `{ contractId, payload? }` | idem |
| `useOpenDispute` | `entities/contract/api/` | `{ contractId, payload }` | idem |
| `useSimulateFraud` | `entities/contract/api/` | `{ contractId, payload }` | idem |
| `useRegisterOnChain` | `entities/transaction/api/` | `contractId: string` | `blockchainStatus(id)`, `contractEvents(id)` |

Todos os hooks:
- `onSuccess` → `toast.success(...)` + invalidações
- `onError` → `toast.error(getApiErrorMessage(error))`

**Padrão de variables:** Para mutations com `contractId + payload`, as variáveis são empacotadas em objeto `{ contractId, payload }`. Isso permite acessar `contractId` no `onSuccess` para invalidar as queries corretas.

---

## 10. Atualização dos Services

Os três services foram reescritos para usar `mockStore`:

**contracts-api.ts:**
- Função helper `persistAction()`: chama `mockStore.updateContract()` + `mockStore.addEvent()` em uma só chamada, garantindo que status e evento sejam persistidos juntos
- `createContract()`: persiste o novo contrato + evento `CONTRATO_CRIADO`
- `updateContract()`: usa `mockStore.updateContract()` e retorna o objeto atualizado
- `deleteContract()`: chama `mockStore.removeContract()`
- `simulateFraud()`: cria dois eventos (`FRAUDE_SIMULADA` + `DISPUTA_ABERTA`) e atualiza status + documentHash
- Todos os eventos criados respeitam o shape completo de `ContractEvent` (incluindo `description` e `responsibleRole` obrigatórios)

**dashboard-api.ts:**
- `getDashboardSummary()` → `mockStore.getDashboardSummary()` (derivado dinamicamente)

**blockchain-api.ts:**
- `getBlockchainStatus()` → `mockStore.getBlockchainStatus()`
- `registerOnChain()` → `mockStore.upsertBlockchainStatus()` + `mockStore.addEvent(HASH_REGISTRADO)`

---

## 11. Showcase Interativo

`app/query-showcase.tsx` é um Client Component que demonstra os hooks em ação:

- **Dashboard summary live:** cards reativas usando `useDashboardSummary()`
- **Lista de contratos:** `useContracts()` com `ContractStatusBadge`
- **Botões de ação por status:**
  - CRIADO → "Confirmar Envio" (`useConfirmShipment`)
  - ENVIADO → "Confirmar Entrega" (`useConfirmDelivery`)
  - ENTREGUE → "Validar Recebimento" (`useValidateReceipt`)
  - VALIDADO → "Autorizar Pagamento" (`useAuthorizePayment`)
- **Registrar on-chain:** `useRegisterOnChain` para CT-2026-001

Ao clicar em qualquer botão:
1. A mutation chama o service → persiste no `mockStore`
2. O `onSuccess` invalida as queries afetadas
3. O TanStack Query re-busca → retorna os dados atualizados do `mockStore`
4. A UI atualiza (status do contrato muda, contadores do dashboard mudam)
5. Toast aparece confirmando a ação

A página **não** é dashboard real — é showcase temporário que será substituído no Bloco 9.

---

## 12. Validações executadas

### npm run lint
```
✓ Sem erros ou warnings
```

### npm run build
```
▲ Next.js 16.2.6 (Turbopack)
✓ Compiled successfully in 7.2s
✓ TypeScript sem erros em 5.5s
✓ Generating static pages (4/4)
```

---

## 13. Commit e push

| Item | Valor |
|---|---|
| Commit realizado | ✅ sim |
| Hash do commit | `b420ddc` |
| Mensagem | `feat(frontend): add data hooks with tanstack query` |
| Push realizado | ✅ sim |
| Branch | `main` |
| Remote | `origin/main` (GitHub) |
| Arquivos no commit | 28 (20 criados, 8 alterados) |

---

## 14. Problemas encontrados e soluções

**Problema 1 — ContractEvent tem shape mais complexo do que o esperado:**
Os campos `performedBy` e `notes` não existem em `ContractEvent`. A interface real requer `description: string` e `responsibleRole: UserRole` como campos obrigatórios. Os imports e todas as chamadas a `mockStore.addEvent()` foram corrigidos antes do build.

**Problema 2 — Services ainda usavam arrays estáticos:**
Os services do Bloco 6 (contracts-api.ts, dashboard-api.ts, blockchain-api.ts) liam de `mockContracts`, `getMockContractById()` etc. e não persistiam mudanças. Todos foram reescritos para usar `mockStore`.

**Problema 3 — `NEXT_STATUS_ACTION` variável não usada:**
Uma variável de placeholder ficou no `query-showcase.tsx` após refatoração. Removida antes do lint.

---

## 15. Pendências para o Bloco 8

Bloco 8 está fora do escopo deste documento (layout principal). As pendências diretas do Bloco 7 são zero — todos os critérios foram atendidos.

Observações para os próximos blocos que consumirão os hooks:
- Os hooks de mutation recebem `{ contractId, payload }` como variáveis — não esquecer esse shape ao chamar `.mutate()`
- `useContracts(status?)` filtra no cliente — para filtro no servidor, substituir o queryFn quando API real estiver disponível
- `useBlockchainStatus(contractId)` lança `notFound` se o contrato não tiver status — tratar `isError` na UI
- `mockStore.reset()` pode ser chamado para restaurar estado inicial (útil em testes de demo)

---

## 16. Veredito

**Bloco 7 está concluído e aprovado para avançar para o Bloco 8.**

Todos os critérios de aceite foram atendidos:
- 5 query hooks criados com queryKeys corretas e `enabled` guard
- 8 mutation hooks com invalidação completa e toasts
- `mockStore` garante persistência entre queries em mock mode
- `queryKeys` centralizadas em `shared/api/query-keys.ts`
- `getApiErrorMessage` reutilizável em todos os `onError`
- Services atualizados para persistir no mockStore
- Showcase interativo demonstra o loop completo: mutação → persistência → invalidação → re-fetch → UI atualizada
- npm run lint: PASSOU
- npm run build: PASSOU
- Commit `b420ddc` e push realizados
- Backend e smart contract não foram alterados
