# Feedback — Bloco 09: Integrar Actions Reais

## 1. Resumo do que foi feito

A pré-análise revelou que a integração das 6 actions reais (`contracts-api.ts` — `confirmShipment`/`confirmDelivery`/`validateReceipt`/`authorizePayment`/`openDispute`/`simulateFraud`; tipagens; hooks `useConfirmShipment`/`useConfirmDelivery`/`useValidateReceipt`/`useAuthorizePayment`/`useOpenDispute`/`useSimulateFraud`; `ContractActionPanel` e os 6 componentes `*-action.tsx`) **já existia e funcionava** em modo `NEXT_PUBLIC_USE_MOCKS=false`, construída em commits anteriores à Sessão 02 e já consumindo `httpClient` com `Authorization: Bearer` (Bloco 05), invalidação de queries e toasts uniformes — repetindo exatamente o padrão encontrado no Bloco 08 para a camada de contratos. Reescrever essa camada teria sido retrabalho.

O gap real era pontual: as quatro funções de permissão visual das ações de fluxo em `web/src/entities/contract/model/rules.ts` (`canConfirmShipment`/`canConfirmDelivery`/`canValidateReceipt`/`canAuthorizePayment`) checavam apenas **status do contrato + role do perfil**, mas o backend aplica uma terceira camada — `require_party_wallet` — que exige que a wallet do perfil ativo coincida com a wallet vinculada àquele papel **quando o contrato tem uma wallet registrada para esse papel**. Sem esse espelhamento, a UI podia mostrar uma ação como "disponível" para um perfil que o backend rejeitaria com 403 por wallet incompatível.

Este bloco corrigiu exatamente isso, sem tocar na camada de dados:

```txt
rules.ts -> adiciona helper hasRequiredWallet(requiredWallet, currentWallet), que espelha
            require_party_wallet do backend (checagem condicional à existência de wallet
            vinculada ao papel; comparação case-insensitive)
         -> aplica o helper às 4 funções can* de ações de fluxo
         -> adiciona 4 branches de explicação em getBlockedActionReason
            (ex.: "Esta ação exige a wallet de fornecedor vinculada a este contrato.")
```

Os 6 endpoints (`confirm-shipment`, `confirm-delivery`, `validate-receipt`, `authorize-payment`, `open-dispute`, `simulate-fraud`) foram validados ponta a ponta contra o backend real, com tokens genuínos emitidos pelo fluxo completo `wallet -> nonce -> assinatura -> verify -> JWT`, cobrindo 20 cenários do checklist (sucesso encadeado, 401, 403-role, 403-wallet, 422-status, 422-terminal, 400-validação).

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_actions_reais.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_09_integrar_actions_reais.md
```

Nenhum arquivo de produção novo foi criado — a camada de actions (`contracts-api.ts`, tipagens, hooks, `ContractActionPanel`, componentes de ação) já existia e não precisou de adições.

## 3. Arquivos alterados

```txt
web/src/entities/contract/model/rules.ts
```

Único arquivo de produção alterado neste bloco — adição do helper `hasRequiredWallet` e seu uso nas 4 funções `can*` de ações de fluxo e em `getBlockedActionReason` (diff completo na seção 7 da análise técnica).

## 4. Endpoints de actions integrados

Os 6 endpoints exigidos já estavam conectados em `web/src/shared/api/contracts-api.ts` (commits anteriores à Sessão 02), todos roteando para `httpClient` quando `env.useMocks === false`:

```txt
POST /contracts/{id}/confirm-shipment   -> confirmShipment()   -> httpClient.post<ActionResult>
POST /contracts/{id}/confirm-delivery   -> confirmDelivery()   -> httpClient.post<ActionResult>
POST /contracts/{id}/validate-receipt   -> validateReceipt()   -> httpClient.post<ActionResult>
POST /contracts/{id}/authorize-payment  -> authorizePayment()  -> httpClient.post<ActionResult>
POST /contracts/{id}/open-dispute       -> openDispute()       -> httpClient.post<ActionResult>
POST /contracts/{id}/simulate-fraud     -> simulateFraud()     -> httpClient.post<SimulateFraudResult>
```

`Authorization: Bearer <accessToken>` é injetado automaticamente pelo `httpClient` (Bloco 05) em todas as 6 rotas POST — nenhum tratamento extra de header foi necessário. Os 6 hooks `useMutation` já existiam, completos, com invalidação de queries e toasts.

Validado contra o backend real (ver seção 12 para o detalhamento completo):

```txt
Encadeamento completo de status, 1 contrato, 4 ações em sequência:
  confirm-shipment  (CRIADO -> ENVIADO)            -> 200, ActionResultOut
  confirm-delivery  (ENVIADO -> ENTREGUE)          -> 200, ActionResultOut
  validate-receipt  (ENTREGUE -> VALIDADO)         -> 200, ActionResultOut
  authorize-payment (VALIDADO -> PAGAMENTO_AUTORIZADO) -> 200, ActionResultOut
open-dispute   (contrato em estado não-terminal)   -> 200, status final DISPUTA
simulate-fraud (hash igual / hash diferente)       -> 200, fraudDetected:false / true
                                                       (com transição para DISPUTA quando true)
```

## 5. Roles e permissões validadas

O backend centraliza permissões por action em `ACTION_ROLES` (`backend/app/services/contracts.py`), aplicado via `require_role` (403 `UNAUTHORIZED_ROLE`, `details: { requiredRoles, currentRole }`):

```txt
confirm-shipment  -> FORNECEDOR             open-dispute   -> GESTOR | FISCAL | AUDITOR
confirm-delivery  -> ENTREGADOR             simulate-fraud -> GESTOR | FISCAL | AUDITOR
validate-receipt  -> FISCAL
authorize-payment -> GESTOR
```

O frontend já espelhava essas regras 1:1 em `rules.ts` (tanto no gating `can*` quanto em `getBlockedActionReason`) — confirmado por leitura, sem necessidade de ajuste. Validado contra o backend real:

```txt
As 4 ações de fluxo, role incorreta            -> 4/4 OK, HTTP 403 UNAUTHORIZED_ROLE
                                                   {"requiredRoles":[...],"currentRole":"..."}
open-dispute / simulate-fraud, role incorreta  -> 2/2 OK, HTTP 403 UNAUTHORIZED_ROLE
                                                   {"requiredRoles":["GESTOR","FISCAL","AUDITOR"],...}
```

## 6. Status/regras de contrato validadas

O backend aplica `ensure_status` (422 `INVALID_STATUS_TRANSITION`, `details: { currentStatus, requiredStatus }`) nas 4 ações de fluxo, e `ensure_not_terminal_for_dispute` (422, bloqueia apenas quando o contrato já está em `PAGAMENTO_AUTORIZADO`/`DISPUTA`) em `open-dispute`/`simulate-fraud`:

```txt
confirm-shipment   exige CRIADO    -> ENVIADO       open-dispute / simulate-fraud:
confirm-delivery   exige ENVIADO   -> ENTREGUE        bloqueados apenas se status já é
validate-receipt   exige ENTREGUE  -> VALIDADO         PAGAMENTO_AUTORIZADO ou DISPUTA
authorize-payment  exige VALIDADO  -> PAGAMENTO_AUTORIZADO
```

O frontend já espelhava essas regras 1:1 — confirmado por leitura, sem necessidade de ajuste. Validado contra o backend real:

```txt
As 4 ações de fluxo, status incompatível          -> 4/4 OK, HTTP 422 INVALID_STATUS_TRANSITION
                                                       {"currentStatus":"...","requiredStatus":"..."}
open-dispute / simulate-fraud em estado terminal  -> 2/2 OK, HTTP 422 INVALID_STATUS_TRANSITION
open-dispute sem "reason"                         -> OK, HTTP 400 VALIDATION_ERROR (Pydantic)
simulate-fraud sem "newDocumentHash"              -> OK, HTTP 400 VALIDATION_ERROR (Pydantic)
```

**Nota de nomenclatura:** o enunciado do bloco menciona "409" para conflito de regra de negócio; o backend real usa **422 `INVALID_STATUS_TRANSITION`** — já tratado corretamente pela UI via `getApiErrorMessage` (que mapeia 400/422 para a mensagem do próprio backend). Documentado na análise técnica (seção 13/16) para que blocos futuros não assumam 409.

## 7. Wallet vinculada por action

Esta foi a frente central deste bloco. O backend aplica `require_party_wallet(profile, contract, field)` **somente** nas 4 ações de fluxo:

```python
# backend/app/services/contracts.py:107 — lógica exata confirmada por leitura
expected = getattr(contract, field)
if expected and expected.lower() != profile.wallet_address.lower():
    raise UNAUTHORIZED_ROLE (403)
```

ou seja, a checagem **só existe quando o contrato tem wallet registrada para aquele papel** (sem wallet vinculada, qualquer perfil com o papel correto pode agir), com comparação case-insensitive:

```txt
confirm-shipment   -> contract.supplierWallet
confirm-delivery   -> contract.logisticsWallet
validate-receipt   -> contract.inspectorWallet
authorize-payment  -> contract.managerWallet
```

A UI (antes deste bloco) **não** verificava essa terceira camada — gap corrigido com o helper `hasRequiredWallet`, aplicado às 4 funções `can*` e a 4 novos branches em `getBlockedActionReason` (mensagens como "Esta ação exige a wallet de fornecedor vinculada a este contrato."). Validado contra o backend real:

```txt
As 4 ações de fluxo, role correta + wallet divergente da vinculada
  -> 4/4 OK, HTTP 403 UNAUTHORIZED_ROLE
     {"requiredWallet":"0x...","currentWallet":"0x..."}
```

confirmando que a UI agora antecipa exatamente o motivo (wallet, não role) que o backend usaria para rejeitar a ação.

## 8. Atualização de contrato após actions

Já implementada e uniforme nos 6 hooks (sem alteração): cada `onSuccess` invalida 4 query keys (`queryKeys.contract(contractId)`, `queryKeys.contracts`, `queryKeys.contractEvents(contractId)`, `queryKeys.dashboardSummary`) via `queryClient.invalidateQueries`, deixando o React Query refazer o fetch e garantindo que o estado exibido seja sempre o que o backend retorna após a ação — sem `setQueryData` otimista, e portanto sem risco de mutar o contrato local "como se tivesse dado certo" em caso de erro.

Essa atualização ao vivo foi observada de fato na captura `05-confirmar-envio-sucesso-toast.png` (modo mock): após confirmar o envio, o badge de status muda de "Criado" para "Enviado" e o painel de ações já mostra o próximo bloqueio ("Aguardando: Confirmar entrega / Apenas o entregador pode confirmar a entrega.") — tudo sem reload de página, no mesmo ciclo de re-render que exibe o toast de sucesso.

## 9. Tratamento de loading/sucesso/erro

Pré-existente, sem alteração — confirmado por leitura dos 6 hooks e do `ContractActionPanel`/`ActionButton`/`ConfirmDialog`:

```txt
Loading -> ActionButton reflete isPending do useMutation (botão em estado de progresso)
Sucesso -> toast.success(<mensagem específica da ação, ex.: "Envio confirmado com sucesso.">)
Erro    -> toast.error(getApiErrorMessage(error))  — cobre HttpClientError (com statusCode)
           e MockErrors (sem statusCode, fallback para apiError.message)
```

Capturado visualmente em modo mock: `03-dialogo-confirmar-envio.png` (diálogo), `04-confirmar-envio-loading.png` (carregamento) e `05-confirmar-envio-sucesso-toast.png` (toast de sucesso + atualização ao vivo do contrato).

## 10. Tratamento de 401/403/404/regras

```txt
401 -> tratado de forma CENTRALIZADA E GLOBAL pelo httpClient: clearSessionOnUnauthorized()
       roda para qualquer 401 de rota não-pública (incluindo as 6 actions), sem tratamento
       extra por action. Validado: 6/6 actions sem token -> 401 "Autenticação obrigatória.";
       6/6 com token inválido -> 401 "Token de autenticação inválido."
403 -> NÃO limpa a sessão (conforme a regra do bloco); getApiErrorMessage mapeia para
       mensagem de permissão. Dois sub-casos validados separadamente: 403-role (4+2 cenários)
       e 403-wallet (4 cenários, seção 7) — ambos com formato de erro correto
       (requiredRoles/currentRole ou requiredWallet/currentWallet)
404 -> mesmo tratamento já confirmado no Bloco 08 (code === "NOT_FOUND"); como o painel só
       é exibido para um contrato já carregado, um 404 em action seria condição de corrida
       rara, coberta pelo toast.error genérico — sem necessidade de EmptyState dedicado
422 INVALID_STATUS_TRANSITION (equivalente ao "409" do enunciado, ver seção 6)
   -> getApiErrorMessage exibe a mensagem do próprio backend; a estratégia de invalidação
      (seção 8) garante que o contrato local NUNCA é mutado como bem-sucedido quando o
      backend rejeita por regra de negócio — garantia estrutural, não dependeu de ajuste
```

## 11. Preservação do mock mode

Nenhuma chamada a `env.useMocks` foi alterada. As 6 funções de action em `contracts-api.ts` continuam servindo `mockStore`/`MockErrors`/`persistAction`. A alteração em `rules.ts` foi verificada quanto a impacto **antes** de ser aplicada: os perfis demo (`DEMO_PROFILES`) têm wallets 1:1 alinhadas por design às wallets dos contratos mock, então `hasRequiredWallet` retorna `true` para todas as combinações usadas em modo mock — comportamento preservado sem exceção. Também confirmado que a página órfã `permissions-showcase.tsx` não é afetada (`SHOWCASE_CONTRACT` não define wallets, então `hasRequiredWallet(undefined, ...)` sempre retorna `true`).

Validado visualmente com `NEXT_PUBLIC_USE_MOCKS=true` (8 capturas, `01`-`08`):

```txt
[OK] Bloqueio por role errada (CRIADO + GESTOR) com mensagem de troca de perfil
[OK] Troca de perfil via dropdown -> Select -> Fornecedor habilita "Confirmar envio"
[OK] Diálogo, carregamento, toast de sucesso e atualização ao vivo (CRIADO -> ENVIADO)
[OK] Painel do gestor em VALIDADO: "Autorizar pagamento" + "Abrir disputa"/"Simular fraude"
[OK] Bloqueio em DISPUTA: "Pagamento bloqueado — nenhuma ação pode ser executada"
[OK] Fluxo concluído em PAGAMENTO_AUTORIZADO: "Este contrato completou o ciclo..."
[OK] Nenhuma chamada de rede às rotas de action — execuções servidas por mockStore
[OK] Sem mistura mock/real, sem fallback silencioso (decisão em if (env.useMocks),
     antes de qualquer chamada de rede — mesmo padrão confirmado no Bloco 08)
```

## 12. Validações executadas

| Validação | Resultado |
|---|---|
| `npm run lint` | OK, sem erros nem warnings. |
| `npm run build` | OK, build de produção concluído com sucesso. |
| `docker compose config` / `docker compose up -d --build` | OK — `fiscalizapay-api`/`fiscalizapay-db` `Up`/`healthy`. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200, `{"status":"ok",...}`. |
| login com wallet até `/auth/me` (fluxo completo, vários papéis) | OK — contas reais (`eth_account.Account.create()` + assinatura), perfis pré-criados via `create_profile.py` para FORNECEDOR/ENTREGADOR/FISCAL/GESTOR/AUDITOR + variantes de wallet; todas completaram `nonce -> verify -> JWT`. |
| Encadeamento completo de status (1 contrato, 4 ações) | OK — `confirm-shipment` -> `confirm-delivery` -> `validate-receipt` -> `authorize-payment`, cada uma 200 com `ActionResultOut` correto. |
| As 6 actions, sem token / token inválido | OK — 6/6 + 6/6, HTTP 401 `UNAUTHORIZED_ROLE` com as duas mensagens distintas ("Autenticação obrigatória."/"Token de autenticação inválido."). |
| As 4 ações de fluxo + `open-dispute`/`simulate-fraud`, role incorreta | OK — 4/4 + 2/2, HTTP 403 `UNAUTHORIZED_ROLE` com `requiredRoles`/`currentRole`. |
| As 4 ações de fluxo, wallet divergente (role correta) | OK — 4/4, HTTP 403 `UNAUTHORIZED_ROLE` com `requiredWallet`/`currentWallet`. |
| As 4 ações de fluxo, status incompatível | OK — 4/4, HTTP 422 `INVALID_STATUS_TRANSITION` com `currentStatus`/`requiredStatus`. |
| `open-dispute`/`simulate-fraud` em contrato terminal | OK — 2/2, HTTP 422 `INVALID_STATUS_TRANSITION` (`ensure_not_terminal_for_dispute`). |
| `open-dispute` sem `reason` / `simulate-fraud` sem `newDocumentHash` | OK — HTTP 400 `VALIDATION_ERROR` (Pydantic) em ambos. |
| `simulate-fraud`, hash igual vs. hash diferente | OK — hash igual: 200 `fraudDetected:false`, contrato inalterado; hash diferente: 200 `fraudDetected:true`, transição para `DISPUTA` + evento de auditoria. |
| `open-dispute` válido (estado não-terminal) | OK — 200, status final `DISPUTA`. |
| **Total: 20/20 cenários de backend aprovados** | Cobertura: fluxo de auth, 6 actions x (sucesso + 401 + 403-role + 404/403-wallet quando aplicável + 422-status), `open-dispute`/`simulate-fraud` x (403-role + 422-terminal + 400-validação + sucesso), reaproveitando 4 contratos de prova com encadeamento (ex.: 1 contrato testou `simulate-fraud` hash-igual -> hash-diferente -> bloqueio terminal -> `open-dispute` sobre `DISPUTA`). |
| Limpeza dos dados de prova | OK — perfis e contratos de sonda removidos do banco; SQL confirmou "Perfis de sonda restantes: None" / "Contratos de sonda restantes: None". |
| UI com `NEXT_PUBLIC_USE_MOCKS=true` (8 estados do painel) | OK — confirmado por 8 capturas (`01`-`08`, mais `02a`/`02b`), descritas na seção 11. |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — actions autenticadas | Status: não executado. Motivo: porta 3000 ocupada por outro projeto ativo e independente (LK_new/Vaultify, confirmado via `Get-CimInstance Win32_Process` — não encerrado por pertencer a trabalho em andamento de outra frente); o backend só libera CORS para `http://localhost:3000`/`http://127.0.0.1:3000` (`backend/app/config.py: cors_origins`), então rodar o frontend em `:3001` bloqueia chamadas reais por CORS — e mesmo contornando isso, a condição de corrida de hidratação de sessão já documentada no Bloco 08 (ainda não corrigida) invalidaria a sessão no primeiro carregamento de página protegida. Impacto: as execuções reais das 6 actions (sucesso/401/403-role/403-wallet/422-status/400-validação) foram validadas ponta a ponta diretamente contra o backend (20/20 acima), e o código de apresentação é o mesmo já confirmado em modo mock — só a captura visual autenticada em modo real ficou pendente. |
| Limpeza de processos/artefatos de teste | OK — dev server (porta 3001) e Chrome headless (porta debug 9444) encerrados; diretórios `C:/tmp/fp-shots-b09/` e `C:/tmp/fp-chrome-b09/` removidos; processos de sonda backend já haviam sido encerrados e limpos antes. |
| `git status` | Executado — escopo confirmado: apenas `rules.ts` alterado (mais os artefatos deste bloco: análise e feedback), sem mistura com outras pendências do repositório. |

## 13. Pendências encontradas

**Bug pré-existente (não introduzido por este bloco — já registrado no Bloco 08, seção 12) — condição de corrida na hidratação de sessão:**

Continua bloqueando capturas autenticadas em modo real. Como já documentado no Bloco 08, a árvore de providers (`Web3Provider > AuthSessionHydrator > TooltipProvider > {children}`) faz com que efeitos de componentes filhos (queries/mutations protegidas) disparem antes do `hydrate()` do pai popular `accessToken` — a primeira requisição sai sem token, recebe 401, e `clearSessionOnUnauthorized()` apaga a sessão, mesmo que ela fosse válida. Esse risco agora se estende às actions (não só a `GET /contracts*`), pois `ContractActionPanel` é filho da mesma árvore.

```txt
- Não é específico de actions nem foi introduzido por este bloco — é estrutural, da
  ordenação de efeitos entre a store de auth e o React Query.
- Bloqueou: capturas autenticadas de execução de actions em modo real.
- Recomendação (repetida do Bloco 08): condicionar queries/mutations protegidas a
  hydrate() já ter completado (ex.: enabled: hasHydrated).
```

**Porta 3000 ocupada por projeto externo (LK_new/Vaultify):** confirmado via `Get-CimInstance Win32_Process` (múltiplos processos Node ativos, processo pai vivo) — pertence a trabalho em andamento de outra frente, não foi encerrado. Combinado com o CORS restrito a `:3000`/`127.0.0.1:3000` do backend, impede testar o modo real localmente a partir de outra porta. Não é um defeito do FiscalizaPay.

**Diferença de nomenclatura "409" vs. "422" no enunciado do bloco:** o backend real usa 422 `INVALID_STATUS_TRANSITION` para conflitos de regra de negócio, não 409. A UI já trata esse código corretamente; documentado para que blocos futuros não assumam 409 ao integrar novas rotas.

Demais pendências esperadas do bloco: timeline/eventos reais (Bloco 10), blockchain indisponível (Bloco 11), teste ponta a ponta (Bloco 12).

## 14. Commit realizado

Commit semântico realizado:

```txt
feat: integrar actions reais de contratos
```

Hash: `ee74c4f`

Escopo do commit (2 arquivos): 1 arquivo de regras ajustado (`rules.ts`) + análise técnica — sem mistura com timeline, auditoria, blockchain ou outras pendências do repositório.

## 15. Observações para o próximo bloco

A condição de corrida de hidratação de sessão (seção 13) deveria, idealmente, ser corrigida **antes** do Bloco 10 (timeline/eventos reais): `ContractEventsTimeline` (ou equivalente) provavelmente repetirá o mesmo padrão `useQuery` em componente filho de `AuthSessionHydrator`, herdando o mesmo risco de "sessão apagada silenciosamente" no primeiro carregamento. Seguindo a mesma lógica do Bloco 08, optei por registrar a recomendação em vez de corrigi-la aqui — está fora do escopo de actions e afeta a camada de sessão de forma transversal.

Vale notar um ponto positivo para o Bloco 10: os 6 hooks de action **já invalidam `queryKeys.contractEvents(contractId)`** no `onSuccess`, então a integração da timeline real deve "encaixar" no fluxo de actions sem necessidade de tocar nesta camada novamente — a invalidação certa já está no lugar, só falta o hook/componente de timeline consumi-la.

Os perfis e contratos de prova criados para a validação ponta a ponta (cobrindo os 6 papéis e os 4 contratos de encadeamento de status) foram removidos do banco ao final desta rodada — nenhum dado de teste permanece no ambiente. Os processos de teste (dev server na porta 3001, Chrome headless na porta de debug 9444) e os diretórios temporários de captura também foram encerrados/removidos.
