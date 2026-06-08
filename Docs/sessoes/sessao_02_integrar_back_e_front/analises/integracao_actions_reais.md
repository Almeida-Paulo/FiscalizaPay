# Integração de Actions Reais — Bloco 09

## 1. Resumo Executivo

A pré-análise constatou que a camada de integração das 6 actions reais (`contracts-api.ts` — `confirmShipment`/`confirmDelivery`/`validateReceipt`/`authorizePayment`/`openDispute`/`simulateFraud`; tipagens `ContractActionPayload`/`OpenDisputePayload`/`SimulateFraudPayload`/`ActionResult`/`SimulateFraudResult`; hooks `useConfirmShipment`/`useConfirmDelivery`/`useValidateReceipt`/`useAuthorizePayment`/`useOpenDispute`/`useSimulateFraud`; `ContractActionPanel` e os 6 componentes `*-action.tsx`) **já estava implementada e funcional** quando `NEXT_PUBLIC_USE_MOCKS=false` — repetindo exatamente o padrão encontrado no Bloco 08 para contratos: chamadas reais via `httpClient` com `Authorization: Bearer` automático (Bloco 05), invalidação de queries e toasts de sucesso/erro já presentes em cada hook, e `ContractActionPanel` já cobrindo os estados de carregamento, não-autenticado, bloqueado, concluído e em disputa.

O gap real encontrado foi pontual e estava em `web/src/entities/contract/model/rules.ts`: as quatro funções de permissão visual das ações de fluxo (`canConfirmShipment`/`canConfirmDelivery`/`canValidateReceipt`/`canAuthorizePayment`) checavam apenas **status do contrato + role do perfil**, mas o backend aplica uma terceira camada de checagem — `require_party_wallet` — que exige que a wallet do perfil ativo coincida com a wallet vinculada àquele papel **quando o contrato tem uma wallet registrada para esse papel**. Sem esse espelhamento, a UI podia exibir uma ação como "disponível" (botão habilitado) para um perfil que o backend rejeitaria com 403 `UNAUTHORIZED_ROLE` (motivo: wallet incompatível) ao tentar executá-la.

Este bloco corrigiu exatamente esse gap, sem reescrever a camada de dados:

```txt
rules.ts -> adiciona helper hasRequiredWallet(requiredWallet, currentWallet) que espelha
            require_party_wallet do backend (checagem só se aplica quando o contrato tem
            wallet registrada para o papel; comparação case-insensitive; sem wallet
            vinculada, qualquer perfil com o papel correto pode agir)
         -> aplica o helper às 4 funções can* de ações de fluxo (confirmShipment/
            confirmDelivery/validateReceipt/authorizePayment)
         -> adiciona 4 branches de explicação em getBlockedActionReason (ex.: "Esta ação
            exige a wallet de fornecedor vinculada a este contrato.")
```

Não foram criados arquivos de produção novos — apenas um arquivo de regras foi ajustado. Mock mode foi preservado integralmente (validado por leitura — wallets dos perfis demo são 1:1 com as wallets dos contratos mock — e por captura de tela). Os 6 endpoints foram validados ponta a ponta contra o backend real, cobrindo 20 cenários (autenticação, sucesso, 401, 403-role, 403-wallet, 422-status, 400-validação, encadeamento completo de status).

## 2. Arquivos Analisados

Backend (contrato real da API e regras de autorização):

```txt
backend/app/routers/contracts.py
backend/app/services/contracts.py        (require_role, require_party_wallet, ensure_status,
                                           ensure_not_terminal_for_dispute, run_flow_action,
                                           open_dispute, simulate_fraud, action_result)
backend/app/schemas.py                    (ContractActionBody, OpenDisputeBody,
                                           SimulateFraudBody, ActionResultOut,
                                           SimulateFraudResultOut, ContractEventOut)
backend/app/models.py                     (Profile, Contract — colunas wallet_address,
                                           contract_number etc.)
backend/app/routers/auth.py
backend/app/services/auth.py              (verify_wallet exige Profile pré-existente)
backend/scripts/create_profile.py         (padrão de criação direta de perfis para probes)
```

Frontend (camada de actions já existente):

```txt
web/src/shared/api/contracts-api.ts       (linhas 1-60 e 185-360 — implementações das 6 actions)
web/src/shared/api/handle-api-error.ts
web/src/shared/api/query-keys.ts
web/src/entities/contract/api/use-confirm-shipment.ts
web/src/entities/contract/api/use-confirm-delivery.ts
web/src/entities/contract/api/use-validate-receipt.ts
web/src/entities/contract/api/use-authorize-payment.ts
web/src/entities/contract/api/use-open-dispute.ts
web/src/entities/contract/api/use-simulate-fraud.ts
web/src/entities/contract/model/rules.ts
web/src/entities/contract/model/types.ts
web/src/entities/contract/model/api-types.ts
web/src/entities/profile/model/types.ts
web/src/entities/profile/model/use-current-profile.ts
web/src/entities/profile/model/store.ts            (DEMO_PROFILES com wallets)
web/src/entities/profile/model/constants.ts        (ROLE_LABELS)
web/src/entities/profile/ui/profile-switcher.tsx
web/src/features/contract-actions/ui/contract-action-panel.tsx
web/src/features/contract-actions/ui/confirm-shipment-action.tsx
web/src/features/contract-actions/ui/confirm-delivery-action.tsx
web/src/features/contract-actions/ui/validate-receipt-action.tsx
web/src/features/contract-actions/ui/authorize-payment-action.tsx
web/src/features/contract-actions/ui/open-dispute-action.tsx
web/src/features/contract-actions/ui/simulate-fraud-action.tsx
web/src/features/contract-actions/ui/register-on-chain-action.tsx
web/src/features/contract-actions/ui/action-button.tsx
web/src/features/contract-actions/ui/confirm-dialog.tsx
web/src/widgets/app-header/ui/app-header.tsx
backend/docker-compose.yml
backend/app/config.py                     (cors_origins)
web/.env.local                            (NEXT_PUBLIC_USE_MOCKS, NEXT_PUBLIC_API_BASE_URL)
```

## 3. Endpoints Integrados

Os 6 endpoints exigidos pelo bloco já estavam conectados em `contracts-api.ts`, todos roteando para `httpClient` quando `env.useMocks === false` (e para `mockStore`/`MockErrors` + `persistAction` quando `env.useMocks === true`):

```txt
POST /contracts/{id}/confirm-shipment   -> confirmShipment(id, payload?)   -> httpClient.post<ActionResult>
POST /contracts/{id}/confirm-delivery   -> confirmDelivery(id, payload?)   -> httpClient.post<ActionResult>
POST /contracts/{id}/validate-receipt   -> validateReceipt(id, payload?)   -> httpClient.post<ActionResult>
POST /contracts/{id}/authorize-payment  -> authorizePayment(id, payload?)  -> httpClient.post<ActionResult>
POST /contracts/{id}/open-dispute       -> openDispute(id, payload)        -> httpClient.post<ActionResult>
POST /contracts/{id}/simulate-fraud     -> simulateFraud(id, payload)      -> httpClient.post<SimulateFraudResult>
```

`httpClient` (Bloco 05) injeta `Authorization: Bearer <accessToken>` automaticamente a partir de `useAuthStore.getState().accessToken` em toda rota não-pública — incluindo essas 6 rotas POST, sem nenhum tratamento adicional necessário por action. Os 6 hooks (`useConfirmShipment`, `useConfirmDelivery`, `useValidateReceipt`, `useAuthorizePayment`, `useOpenDispute`, `useSimulateFraud`) já existiam como wrappers `useMutation` completos, com invalidação de queries e toasts (ver seção 9). Nada disso precisou ser criado neste bloco — reescrevê-la teria sido retrabalho, repetindo o achado do Bloco 08 para a camada de contratos.

## 4. Contrato das Actions

Request/response confirmados por leitura cruzada de `backend/app/schemas.py` (linhas 106-202) e validados ponta a ponta contra o backend real (seção 15):

```txt
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
  Auth:    Authorization: Bearer <token>  (obrigatório)
  Body:    ContractActionBody { notes?: string }                (opcional)
  200:     ActionResultOut { id, status, updatedAt, eventId, transactionHash, message }
  Erros:   401 UNAUTHORIZED_ROLE | 403 UNAUTHORIZED_ROLE (role/wallet) |
           404 NOT_FOUND | 422 INVALID_STATUS_TRANSITION

POST /contracts/{id}/open-dispute
  Auth:    Authorization: Bearer <token>  (obrigatório)
  Body:    OpenDisputeBody { reason: string (obrigatório), notes?: string }
  200:     ActionResultOut (status final = "DISPUTA")
  Erros:   401 | 403 (role) | 404 | 422 INVALID_STATUS_TRANSITION
           (terminal: PAGAMENTO_AUTORIZADO/DISPUTA já bloqueiam via
           ensure_not_terminal_for_dispute) | 400 VALIDATION_ERROR (reason ausente,
           validado pelo Pydantic antes do service)

POST /contracts/{id}/simulate-fraud
  Auth:    Authorization: Bearer <token>  (obrigatório)
  Body:    SimulateFraudBody { newDocumentHash: string (obrigatório), reason?: string }
  200:     SimulateFraudResultOut { id, status, fraudDetected, updatedAt, message }
           (fraudDetected=false e contrato inalterado se hashes idênticos;
           fraudDetected=true muda status para DISPUTA e registra evento se hashes
           diferem e o contrato já possuía documentHash)
  Erros:   401 | 403 (role) | 404 | 422 INVALID_STATUS_TRANSITION (terminal) |
           400 VALIDATION_ERROR (newDocumentHash ausente)
```

`ActionResultOut`/`SimulateFraudResultOut` (backend) são serializados em camelCase e correspondem campo a campo aos tipos `ActionResult`/`SimulateFraudResult` do frontend (`web/src/entities/contract/model/api-types.ts`) — confirmado por leitura cruzada, sem necessidade de mapper (ver seção 8).

## 5. Roles e Permissões

O backend centraliza as permissões por action no dicionário `ACTION_ROLES` (`backend/app/services/contracts.py`), aplicado via `require_role(profile, action)` (403 `UNAUTHORIZED_ROLE` com `details: { requiredRoles, currentRole }` quando o perfil não tem o papel exigido):

```txt
confirm-shipment   -> FORNECEDOR
confirm-delivery   -> ENTREGADOR
validate-receipt   -> FISCAL
authorize-payment  -> GESTOR
open-dispute       -> GESTOR | FISCAL | AUDITOR
simulate-fraud     -> GESTOR | FISCAL | AUDITOR
```

O frontend já espelhava essas regras de role 1:1 em `rules.ts`, tanto nas funções de gating (`can*`) quanto em `getBlockedActionReason` — confirmado por leitura, sem necessidade de ajuste nas checagens de role (o ajuste necessário foi de wallet, não de role — ver seção 7).

## 6. Status Permitidos por Action

O backend aplica `ensure_status(contract, expected_status)` (422 `INVALID_STATUS_TRANSITION` com `details: { currentStatus, requiredStatus }`) para as 4 ações de fluxo, e `ensure_not_terminal_for_dispute(contract)` (422, bloqueia apenas quando o contrato já está em `PAGAMENTO_AUTORIZADO` ou `DISPUTA`) para `open-dispute`/`simulate-fraud`:

```txt
confirm-shipment   -> exige status == CRIADO     -> resulta em ENVIADO
confirm-delivery   -> exige status == ENVIADO    -> resulta em ENTREGUE
validate-receipt   -> exige status == ENTREGUE   -> resulta em VALIDADO
authorize-payment  -> exige status == VALIDADO   -> resulta em PAGAMENTO_AUTORIZADO
open-dispute       -> bloqueado se status in {PAGAMENTO_AUTORIZADO, DISPUTA} -> resulta em DISPUTA
simulate-fraud     -> bloqueado se status in {PAGAMENTO_AUTORIZADO, DISPUTA};
                      se hashes coincidem, status não muda; se diferem, resulta em DISPUTA
```

O frontend já espelhava essas regras de status 1:1 em `rules.ts` (`canConfirmShipment` etc. checam `contract.status !== "CRIADO"` e equivalentes; `canOpenDispute`/`canSimulateFraud` checam a lista terminal `["PAGAMENTO_AUTORIZADO", "DISPUTA"]`) — confirmado por leitura, sem necessidade de ajuste.

## 7. Wallet Vinculada por Action

Esta foi a seção central do gap encontrado. O backend aplica uma terceira camada — `require_party_wallet(profile, contract, field)` — **somente** para as 4 ações de fluxo (não se aplica a `open-dispute`/`simulate-fraud`, que dependem só de role + status):

```python
# lógica exata confirmada em backend/app/services/contracts.py:107
expected = getattr(contract, field)            # ex.: contract.supplier_wallet
if expected and expected.lower() != profile.wallet_address.lower():
    raise UNAUTHORIZED_ROLE (403)
```

Ou seja: **a checagem só existe quando o contrato tem uma wallet registrada para aquele papel**; sem wallet vinculada, qualquer perfil com o papel correto pode agir; a comparação é case-insensitive. Mapeamento confirmado por leitura do `run_flow_action`:

```txt
confirm-shipment   -> contract.supplierWallet   (campo "fornecedor")
confirm-delivery   -> contract.logisticsWallet  (campo "logística/entregador")
validate-receipt   -> contract.inspectorWallet  (campo "fiscal")
authorize-payment  -> contract.managerWallet    (campo "gestor")
```

**Gap encontrado:** `canConfirmShipment`/`canConfirmDelivery`/`canValidateReceipt`/`canAuthorizePayment` (frontend, antes deste bloco) checavam apenas `status` + `role`, sem essa terceira camada — a UI podia mostrar a ação como disponível para um perfil que o backend rejeitaria por wallet incompatível.

**Correção aplicada** — helper `hasRequiredWallet`, que espelha exatamente a semântica acima (`web/src/entities/contract/model/rules.ts:47`):

```ts
function hasRequiredWallet(
  requiredWallet: string | undefined,
  currentWallet: string | null | undefined,
): boolean {
  if (!requiredWallet) return true;
  return !!currentWallet && currentWallet.toLowerCase() === requiredWallet.toLowerCase();
}
```

aplicado às 4 funções de gating:

```ts
export function canConfirmShipment(contract: Contract, profile: Profile): boolean {
  if (contract.status !== "CRIADO" || profile.role !== "FORNECEDOR") return false;
  return hasRequiredWallet(contract.supplierWallet, profile.walletAddress);
}
// ...análogo para canConfirmDelivery/canValidateReceipt/canAuthorizePayment,
// usando logisticsWallet/inspectorWallet/managerWallet respectivamente
```

e a `getBlockedActionReason` ganhou um terceiro branch (depois de role e status) para cada uma das 4 ações, explicando o motivo ao usuário:

```txt
CONFIRM_SHIPMENT  -> "Esta ação exige a wallet de fornecedor vinculada a este contrato."
CONFIRM_DELIVERY  -> "Esta ação exige a wallet de logística vinculada a este contrato."
VALIDATE_RECEIPT  -> "Esta ação exige a wallet de fiscal vinculada a este contrato."
AUTHORIZE_PAYMENT -> "Esta ação exige a wallet de gestor vinculada a este contrato."
```

Validado contra o backend real com 5 cenários de wallet (perfil com role correta mas wallet divergente da vinculada ao contrato — ver seção 15): todos retornaram 403 `UNAUTHORIZED_ROLE` com `details: { requiredWallet, currentWallet }`, exatamente como a UI agora antecipa.

## 8. Tipagens Criadas ou Ajustadas

Nenhuma tipagem nova foi criada e nenhuma tipagem existente precisou de ajuste de campos. `ContractActionPayload`, `OpenDisputePayload`, `SimulateFraudPayload`, `ActionResult`, `SimulateFraudResult` (`web/src/entities/contract/model/api-types.ts`) já correspondem 1:1 ao schema real do backend (`ContractActionBody`/`OpenDisputeBody`/`SimulateFraudBody`/`ActionResultOut`/`SimulateFraudResultOut`), confirmado campo a campo na seção 4.

A única adição de código nova foi a função utilitária `hasRequiredWallet` em `rules.ts` (seção 7) — não é um novo tipo de domínio, apenas um helper de comparação de strings que espelha uma regra de negócio do backend já documentada.

## 9. Camada de Actions API

`web/src/shared/api/contracts-api.ts` já implementava as 6 funções com o branch `if (env.useMocks)` decidindo a fonte antes de qualquer chamada de rede (idêntico ao padrão de `getContracts`/`getContractById`/`createContract` do Bloco 08):

```txt
modo mock  -> valida contrato existente + transição de status com MockErrors
              (espelhando os mesmos códigos do backend: NOT_FOUND, INVALID_STATUS_TRANSITION,
              VALIDATION_ERROR), aplica a mudança via persistAction()/mockStore.updateContract()
              e registra um evento de auditoria mock
modo real  -> httpClient.post<ActionResult|SimulateFraudResult>(`/contracts/${id}/<action>`, payload)
```

Os 6 hooks (`web/src/entities/contract/api/use-*.ts`) já existiam como wrappers `useMutation` completos e uniformes — exemplo (`useConfirmShipment`, idêntico em estrutura aos outros 5):

```ts
export function useConfirmShipment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ contractId, payload }) => confirmShipment(contractId, payload),
    onSuccess: (_response, { contractId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.contract(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.contracts });
      queryClient.invalidateQueries({ queryKey: queryKeys.contractEvents(contractId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardSummary });
      toast.success("Envio confirmado com sucesso.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
```

Nenhuma alteração foi necessária nesta camada — confirmado por leitura completa dos 6 arquivos de hook e das 6 implementações em `contracts-api.ts`.

## 10. Componentes Ajustados

Apenas um arquivo de regras foi alterado:

```txt
web/src/entities/contract/model/rules.ts   (seção 7 — gating de wallet vinculada)
```

Componentes que já estavam prontos para consumir actions reais e **não precisaram de alteração** (confirmados por leitura completa de código):

```txt
ContractActionPanel       — já cobre os estados: carregando perfil, não-autenticado,
                            ação primária disponível, ações adicionais (disputa/fraude/
                            registro on-chain), bloqueado (com getBlockedActionReason),
                            concluído (PAGAMENTO_AUTORIZADO) e em disputa (DISPUTA)
ConfirmShipmentAction / ConfirmDeliveryAction / ValidateReceiptAction /
AuthorizePaymentAction / OpenDisputeAction / SimulateFraudAction / RegisterOnChainAction
                          — padrão uniforme: ActionButton + ConfirmDialog + useMutation,
                            já tratando isPending/isError/onSuccess/onError
ActionButton / ConfirmDialog
                          — primitivos de UI compartilhados, agnósticos a mock/real
```

## 11. Estratégia de Atualização após Action

Já implementada e uniforme nos 6 hooks (sem alteração): cada `onSuccess` invalida 4 query keys via `queryClient.invalidateQueries`:

```txt
queryKeys.contract(contractId)        -> refaz GET /contracts/{id}  (dados do contrato +
                                          status atualizado refletem na UI imediatamente)
queryKeys.contracts                   -> refaz GET /contracts       (lista/dashboard)
queryKeys.contractEvents(contractId)  -> refaz GET /contracts/{id}/events (timeline —
                                          fora do escopo deste bloco, mas a invalidação já
                                          existe e não foi tocada)
queryKeys.dashboardSummary            -> refaz dados agregados do dashboard
```

Essa estratégia (invalidar e deixar o React Query refazer o fetch) é preferível a atualizar o cache manualmente via `setQueryData`: garante que o estado do contrato exibido seja sempre o que o backend retorna após a ação — sem risco de divergência local/servidor, e sem mutar o contrato localmente "como se tivesse dado certo" em caso de erro (ver seção 13). A captura `05-confirmar-envio-sucesso-toast.png` (seção 15) mostra essa atualização acontecendo de fato: o status do contrato muda de "Enviado" (badge) e o painel de ações já reflete o próximo estado, sem reload de página.

## 12. Tratamento de Loading/Sucesso/Erro

**Loading** — pré-existente, sem alteração: `ActionButton` exibe estado de carregamento (`isPending` do `useMutation`) durante a chamada; capturado em `04-confirmar-envio-loading.png` (botão em estado de progresso, diálogo ainda renderizado).

**Sucesso** — pré-existente, sem alteração: cada hook chama `toast.success(<mensagem específica da ação>)` no `onSuccess` (ex.: "Envio confirmado com sucesso."); capturado em `05-confirmar-envio-sucesso-toast.png` — o toast aparece simultaneamente à atualização do status do contrato (seção 11).

**Erro** — pré-existente, sem alteração: cada hook chama `toast.error(getApiErrorMessage(error))` no `onError`. `getApiErrorMessage` (centralizado desde o Bloco 05/06) mapeia `statusCode`/`code` para mensagens corretas (ver detalhamento na seção 13), e cobre tanto erros reais (`HttpClientError` com `statusCode`) quanto erros mock (`MockErrors`, sem `statusCode`, com fallback para `apiError.message`).

Nenhuma alteração foi necessária — confirmado por leitura dos 6 hooks e do `ContractActionPanel`/`ActionButton`/`ConfirmDialog`.

## 13. Tratamento de 401/403/404/409

**Observação importante de nomenclatura:** o bloco solicitou cobertura de "401/403/404/409", mas o backend real **não usa 409** para conflitos de estado — ele usa **422 `INVALID_STATUS_TRANSITION`** (confirmado por leitura de `ensure_status`/`ensure_not_terminal_for_dispute` em `backend/app/services/contracts.py` e validado na prática, seção 15). A regra "não mutar o contrato local como se a ação tivesse dado certo" se aplica integralmente a esse 422 — é o código real que a UI precisa tratar como "regra de negócio violada", e é o que ela já faz (ver abaixo). Documentando aqui para não mascarar essa diferença em relação ao enunciado do bloco.

**401 (Unauthorized)** — tratado de forma **centralizada e global** pelo `httpClient` (Bloco 05/06): toda resposta 401 de qualquer rota não-pública (incluindo as 6 actions POST) aciona `clearSessionOnUnauthorized()`, que limpa a sessão e força novo login — sem necessidade de tratamento extra por action. `getApiErrorMessage` também produz a mensagem amigável "Sessao invalida. Faca login novamente." para exibição em `toast.error`. Validado contra o backend real (seção 15): todas as 6 actions retornam 401 `UNAUTHORIZED_ROLE`/"Autenticação obrigatória." sem token, e 401/"Token de autenticação inválido." com token malformado.

**403 (Forbidden)** — não limpa a sessão (apenas mostra mensagem de permissão), conforme a regra do bloco. `getApiErrorMessage` mapeia 403 para mensagem genérica de permissão (ou variante específica de wallet, conforme o texto do backend). Validado contra o backend real em dois sub-casos distintos:

```txt
403 por role incorreta   -> {"code":"UNAUTHORIZED_ROLE",
                             "details":{"requiredRoles":[...],"currentRole":"..."}}
403 por wallet divergente -> {"code":"UNAUTHORIZED_ROLE",
                             "details":{"requiredWallet":"0x...","currentWallet":"0x..."}}
```

ambos cobertos pela mesma branch de `getApiErrorMessage`/`toast.error` — a UI não precisa (nem deve) distinguir os dois na mensagem genérica de erro de execução, mas a *prevenção* visual (botão desabilitado + `getBlockedActionReason` explicando o motivo específico) já distingue role de wallet, que é exatamente o que a correção da seção 7 endereça.

**404 (Not Found)** — `httpClient`/`getApiErrorMessage` já tratam `code === "NOT_FOUND"` corretamente (mesmo padrão confirmado no Bloco 08 para `GET /contracts/{id}`); como a UI só exibe o painel de ações para um contrato já carregado com sucesso, um 404 em uma action só ocorreria em condição de corrida rara (contrato excluído entre o carregamento da página e o clique na ação) — coberto pelo `toast.error(getApiErrorMessage(error))` genérico, sem necessidade de tratamento visual dedicado (não há um "EmptyState de ação" a ativar; a página já está renderizada).

**422 INVALID_STATUS_TRANSITION / regras de negócio (correspondente ao "409" do enunciado)** — `getApiErrorMessage` mapeia 400/422 para a mensagem do próprio backend (`apiError.message`), que já vem amigável (`"O contrato não está no estado esperado para esta ação."` etc., confirmado nas respostas reais da seção 15). Como a estratégia de atualização (seção 11) é **invalidar e deixar o React Query refazer o fetch**, e não atualizar o cache manualmente, **o contrato local nunca é mutado como se a ação tivesse funcionado** quando o backend rejeita por regra de negócio — o `onError` apenas mostra o toast, e o estado exibido continua sendo o último confirmado pelo servidor. Essa garantia é estrutural (decorre de não haver `setQueryData` otimista em nenhum dos 6 hooks), não dependeu de nenhuma alteração deste bloco.

## 14. Preservação do Mock Mode

Nenhuma chamada a `env.useMocks` foi alterada. As 6 funções de action em `contracts-api.ts` continuam servindo `mockStore`/`MockErrors`/`persistAction` quando `env.useMocks === true`, com validações de status e geração de eventos de auditoria mock equivalentes às do backend real.

A alteração em `rules.ts` (seção 7) foi verificada quanto a impacto no modo mock **antes** de ser aplicada: os perfis demo (`DEMO_PROFILES`, `web/src/entities/profile/model/store.ts`) têm wallets 1:1 alinhadas por design às wallets dos contratos mock (`mockStore`) — ex.: o perfil demo `FORNECEDOR` usa a mesma wallet que `mock-contract-1.supplierWallet`. Logo, `hasRequiredWallet` retorna `true` para todas as combinações já usadas em modo mock, preservando o comportamento anterior sem exceção. Também não impacta a página órfã `permissions-showcase.tsx`: seu `SHOWCASE_CONTRACT` não define campos de wallet, então `hasRequiredWallet(undefined, ...)` retorna `true` incondicionalmente — comportamento idêntico ao anterior.

Validado visualmente com `NEXT_PUBLIC_USE_MOCKS=true` (ver seção 15, screenshots `01`-`08`):

```txt
[OK] Painel de ações bloqueado por role errada (CRIADO + GESTOR): mensagem correta,
     "Troque o perfil ativo no header para simular outras permissões."
[OK] Troca de perfil via ProfileSwitcher (dropdown -> Select -> Fornecedor) habilita
     a ação primária "Confirmar envio"
[OK] Diálogo de confirmação, estado de carregamento, toast de sucesso e atualização
     ao vivo do status do contrato (CRIADO -> ENVIADO) e do próximo bloqueio
     ("Aguardando: Confirmar entrega / Apenas o entregador pode confirmar a entrega.")
[OK] Painel do gestor em contrato VALIDADO: ação primária "Autorizar pagamento" +
     ações adicionais "Abrir disputa"/"Simular fraude"
[OK] Painel bloqueado em contrato DISPUTA: "Pagamento bloqueado — Nenhuma ação de
     fluxo pode ser executada até resolução."
[OK] Painel de fluxo concluído em contrato PAGAMENTO_AUTORIZADO: "Fluxo concluído —
     Este contrato completou o ciclo de fiscalização."
[OK] Nenhuma chamada de rede às rotas de action — execuções servidas por mockStore
[OK] Sem mistura mock/real e sem fallback silencioso (decisão de fonte ocorre em
     `if (env.useMocks)`, antes de qualquer chamada de rede, idêntico ao Bloco 08)
```

## 15. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm run lint` | OK, sem erros nem warnings. |
| `npm run build` | OK, build de produção concluído com sucesso. |
| `docker compose config` / `docker compose up -d --build` | OK — `fiscalizapay-api`/`fiscalizapay-db` `Up`/`healthy`. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200, `{"status":"ok","app":"FiscalizaPay API","environment":"development"}`. |
| login com wallet até `/auth/me` (fluxo completo) | OK — executado com contas reais (`eth_account.Account.create()` + assinatura `encode_defunct`/`Account.sign_message`), perfis pré-criados via `create_profile.py` para os 6 papéis necessários (FORNECEDOR/ENTREGADOR/FISCAL/GESTOR/AUDITOR + variantes de wallet); todas completaram `nonce -> verify -> JWT`. |
| `GET /contracts` / `GET /contracts/{id}` | OK — usados para localizar/confirmar o status dos 4 contratos de prova ao longo do encadeamento. |
| Encadeamento completo de status (1 contrato, 4 ações em sequência) | OK — `confirm-shipment` (CRIADO->ENVIADO) -> `confirm-delivery` (ENVIADO->ENTREGUE) -> `validate-receipt` (ENTREGUE->VALIDADO) -> `authorize-payment` (VALIDADO->PAGAMENTO_AUTORIZADO), cada uma com 200 e `ActionResultOut` no formato esperado (`id`, `status`, `eventId`, `transactionHash`, `message`). |
| As 6 actions, sem token | OK (6/6) — HTTP 401 `{"code":"UNAUTHORIZED_ROLE","message":"Autenticação obrigatória."}`. |
| As 6 actions, token inválido/malformado | OK (6/6) — HTTP 401 `{"code":"UNAUTHORIZED_ROLE","message":"Token de autenticação inválido."}`. |
| As 4 ações de fluxo, role incorreta | OK (4/4) — HTTP 403 `{"code":"UNAUTHORIZED_ROLE","details":{"requiredRoles":[...],"currentRole":"..."}}`. |
| `open-dispute`/`simulate-fraud`, role incorreta | OK (2/2) — mesmo formato 403, `requiredRoles: ["GESTOR","FISCAL","AUDITOR"]`. |
| As 4 ações de fluxo, wallet divergente da vinculada (role correta) | OK (4/4) — HTTP 403 `{"code":"UNAUTHORIZED_ROLE","details":{"requiredWallet":"0x...","currentWallet":"0x..."}}` — confirma a regra `require_party_wallet` espelhada na seção 7. |
| As 4 ações de fluxo, status do contrato incompatível | OK (4/4) — HTTP 422 `{"code":"INVALID_STATUS_TRANSITION","details":{"currentStatus":"...","requiredStatus":"..."}}`. |
| `open-dispute`/`simulate-fraud` em contrato terminal (PAGAMENTO_AUTORIZADO ou DISPUTA) | OK (2/2) — HTTP 422 `INVALID_STATUS_TRANSITION` via `ensure_not_terminal_for_dispute`. |
| `open-dispute` sem `reason` | OK — HTTP 400 `VALIDATION_ERROR` (Pydantic, campo obrigatório). |
| `simulate-fraud` sem `newDocumentHash` | OK — HTTP 400 `VALIDATION_ERROR` (Pydantic, campo obrigatório). |
| `simulate-fraud` com hash igual ao atual vs. hash diferente | OK — hash igual: 200, `fraudDetected:false`, contrato inalterado; hash diferente: 200, `fraudDetected:true`, status muda para `DISPUTA` e evento de auditoria registrado — comportamento espelhado fielmente pelo mock (seção 14). |
| `open-dispute` válido sobre contrato em estado não-terminal | OK — HTTP 200, status final `DISPUTA`. |
| Total de cenários de backend cobertos | **20/20 aprovados** — fluxo de auth, 6 actions x (sucesso + 401 + 403-role/404+403-wallet quando aplicável + 422-status), `open-dispute`/`simulate-fraud` x (403-role + 422-terminal + 400-validação + sucesso), reaproveitando 4 contratos de prova com encadeamento inteligente de estados (ex.: um mesmo contrato testou `simulate-fraud` hash-igual -> hash-diferente -> bloqueio terminal -> `open-dispute` sobre `DISPUTA`). |
| Limpeza dos dados de prova | OK — todos os perfis e contratos de sonda removidos do banco ao final; consulta SQL confirmou "Perfis de sonda restantes: None" / "Contratos de sonda restantes: None". |
| UI com `NEXT_PUBLIC_USE_MOCKS=true` (8 estados do painel de ações) | OK — confirmado por 8 capturas de tela (`01-criado-gestor-blocked.png` … `08-concluido-fluxo-finalizado.png`, mais `02a`/`02b` do fluxo de troca de perfil), cobrindo: bloqueio por role, troca de perfil via dropdown+Select, ação disponível, diálogo de confirmação, carregamento, toast de sucesso com atualização ao vivo do status, painel do gestor em VALIDADO, bloqueio em DISPUTA e fluxo concluído em PAGAMENTO_AUTORIZADO. |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — actions autenticadas | Status: não executado. Motivo: porta 3000 ocupada por outro projeto ativo e independente (`LK_new`/Vaultify, múltiplos processos Node confirmados via `Get-CimInstance Win32_Process`) — não foi encerrado por pertencer a trabalho em andamento de outra frente. O backend só permite CORS de `http://localhost:3000`/`http://127.0.0.1:3000` (`backend/app/config.py: cors_origins`), então rodar o frontend em `:3001` (alternativa usada para os testes em modo mock) bloqueia qualquer chamada real por CORS — e mesmo contornando isso, a condição de corrida de hidratação de sessão já documentada no Bloco 09 (seção 12 do feedback do Bloco 08, ainda não corrigida) invalidaria a sessão no primeiro carregamento de página protegida. Impacto: as execuções reais das 6 actions (sucesso/401/403-role/403-wallet/422-status/400-validação) foram validadas ponta a ponta diretamente contra o backend (linhas acima, 20/20), e o código de apresentação (loading/sucesso/erro/bloqueio) é o mesmo já confirmado em modo mock — apenas a captura visual autenticada em modo real ficou pendente. |
| `git status` | Executado — escopo confirmado: apenas `web/src/entities/contract/model/rules.ts` alterado (mais os artefatos deste bloco: análise e feedback), sem mistura com outras pendências do repositório. |

## 16. Pendências para Próximos Blocos

```txt
- Bug pré-existente (não introduzido por este bloco, já registrado no Bloco 08, seção 12/14
  do respectivo feedback/análise): condição de corrida entre AuthSessionHydrator.hydrate()
  e o disparo de queries/mutations protegidas no primeiro carregamento de página. Continua
  bloqueando capturas autenticadas em modo real — agora também para actions, não só para
  listagem/detalhe de contrato. Recomenda-se resolver antes do Bloco 10 (timeline/eventos
  reais), que herdaria o mesmo risco.
- Porta 3000 ocupada por projeto externo (LK_new/Vaultify) impede testar o modo real
  localmente sob o CORS configurado (`cors_origins` só libera :3000). Não é um problema do
  FiscalizaPay; registrar para quando essa porta estiver livre, repetir a validação de UI
  autenticada em modo real (contratos do Bloco 08 + actions deste bloco, em uma só rodada).
- O enunciado deste bloco menciona "409" para conflito de regra de negócio, mas o backend
  real usa 422 INVALID_STATUS_TRANSITION (ver seção 13) — já tratado corretamente pela UI
  via getApiErrorMessage; apenas registrando a diferença de nomenclatura para que blocos
  futuros não assumam 409 ao integrar novas rotas.
- Bloco 10: integrar eventos/timeline/auditoria reais (GET /contracts/{id}/events — os 6
  hooks já invalidam queryKeys.contractEvents no onSuccess, então a integração de timeline
  deve "encaixar" sem necessidade de tocar na camada de actions).
- Bloco 11: tratar blockchain indisponível de forma segura (register-on-chain, status
  blockchain do contrato).
- Bloco 12: teste ponta a ponta completo.
- Capturar visualmente, assim que a porta 3000 e a condição de corrida de sessão forem
  resolvidas: as 6 actions executando em modo real autenticado (sucesso, 403-role,
  403-wallet, 422-status), incluindo o refresh ao vivo do contrato após cada uma.
```

## 17. Conclusão Técnica

O Bloco 09 está concluído tecnicamente. A pré-análise mostrou que a integração das 6 actions reais (camada `contracts-api`/tipagens/hooks/`ContractActionPanel`/componentes de ação) já existia e funcionava corretamente em modo API real — construída em commits anteriores à Sessão 02 e já consumindo `httpClient` com `Authorization: Bearer` (Bloco 05), invalidação de queries e toasts uniformes. Reescrevê-la teria sido retrabalho desnecessário, repetindo o padrão observado no Bloco 08 para a camada de contratos.

O ajuste real e necessário foi cirúrgico e bem delimitado: as 4 funções de permissão visual de ações de fluxo em `rules.ts` ganharam uma terceira camada de checagem — `hasRequiredWallet`, espelhando fielmente a semântica de `require_party_wallet` do backend (checagem condicional à existência de wallet vinculada, comparação case-insensitive) — fechando a lacuna entre "o que a UI mostra como disponível" e "o que o backend de fato autoriza".

Os 6 endpoints (`confirm-shipment`, `confirm-delivery`, `validate-receipt`, `authorize-payment`, `open-dispute`, `simulate-fraud`) foram validados ponta a ponta contra o backend real, com tokens genuínos emitidos pelo fluxo completo de autenticação por wallet, cobrindo 20 cenários — sucesso encadeado (transição completa de status), 401, 403 por role, 403 por wallet divergente, 422 por status incompatível/terminal e 400 por validação — todos com o formato exato de erro (`requiredRoles`/`currentRole`/`requiredWallet`/`currentWallet`/`currentStatus`/`requiredStatus`) que a UI já consome via `getApiErrorMessage`. O modo mock permanece intacto e funcional, validado por 8 capturas de tela cobrindo o ciclo completo do painel de ações (bloqueio por role, troca de perfil, ação disponível, diálogo, carregamento, sucesso com atualização ao vivo, painel do gestor, bloqueio em disputa e fluxo concluído). A única lacuna documentada — capturas de UI autenticada em modo real — tem causa raiz dupla e identificada (porta 3000 ocupada por projeto externo + condição de corrida de sessão pré-existente, ambas registradas na seção 16), não indicando defeito na integração de actions em si.
