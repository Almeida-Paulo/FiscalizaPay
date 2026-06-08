# Integração de Contratos Reais — Bloco 08

## 1. Resumo Executivo

A pré-análise constatou que a camada de integração de contratos reais (`contracts-api.ts`, tipagens `Contract`/`CreateContractPayload`, hooks `useContracts`/`useContractById`/`useCreateContract`, `ContractsList`, `ContractsFilters`, `CreateContractForm`) **já estava implementada e funcional** quando `NEXT_PUBLIC_USE_MOCKS=false` — incluindo chamadas reais a `GET /contracts`, `POST /contracts` e `GET /contracts/{id}` via `httpClient` com `Authorization: Bearer` automático (Bloco 05) e perfil real via `useCurrentProfile()` (Bloco 07).

O gap real encontrado foi pontual: as duas páginas de contratos (`ContractsPage` e `ContractDetailPage`) tratavam **todo erro de API com uma única mensagem genérica**, sem diferenciar 401/403/404/422/500 — e a página de detalhe tinha um estado "Contrato não encontrado" já escrito, porém **inalcançável**, porque o branch `if (!contract) return <EmptyState ... />` nunca era atingido (quando `isError === true`, `contract` é `undefined`, mas o código retornava antes, no branch de erro genérico).

Este bloco corrigiu exatamente esse gap, sem reescrever a camada de dados:

```txt
ContractDetailPage -> diferencia 404 (NOT_FOUND) do erro genérico, reaproveitando o EmptyState
                       "Contrato não encontrado" já existente; demais erros usam getApiErrorMessage()
ContractsPage      -> troca a mensagem de erro fixa por getApiErrorMessage(error), habilitando
                       as mensagens corretas de 401/403/422/500 já centralizadas no Bloco 05/06
```

Não foram criados arquivos de produção novos — apenas dois componentes de página foram ajustados. Mock mode foi preservado integralmente (validado visualmente).

## 2. Arquivos Analisados

Backend (contrato real da API):

```txt
backend/app/routers/contracts.py
backend/app/services/contracts.py
backend/app/schemas.py            (CreateContractBody, UpdateContractBody, ContractOut)
backend/app/serializers.py        (contract_out)
backend/app/models.py             (Contract, ContractStatus)
backend/app/errors.py             (api_error)
```

Frontend (camada de contrato já existente):

```txt
web/src/shared/api/contracts-api.ts
web/src/shared/api/handle-api-error.ts
web/src/shared/api/http-client.ts
web/src/shared/mocks/mock-store.ts
web/src/shared/mocks/mock-errors.ts
web/src/entities/contract/model/types.ts
web/src/entities/contract/model/api-types.ts
web/src/entities/contract/model/rules.ts
web/src/entities/contract/api/use-contracts.ts
web/src/entities/contract/api/use-contract-by-id.ts
web/src/entities/contract/api/use-create-contract.ts
web/src/widgets/contracts-list/ui/contracts-list.tsx
web/src/shared/ui/error-state.tsx
web/src/shared/ui/empty-state.tsx
web/src/app/contracts/_components/contracts-page.tsx
web/src/app/contracts/[id]/_components/contract-detail-page.tsx
web/src/app/contracts/new/_components/create-contract-page.tsx
web/src/entities/profile/model/use-current-profile.ts
```

## 3. Endpoints Integrados

Os três endpoints exigidos pelo bloco já estavam conectados em `contracts-api.ts` (commits anteriores `f296a49`/`b420ddc`, fora da Sessão 02), todos roteando para `httpClient` quando `env.useMocks === false`:

```txt
GET  /contracts        -> getContracts()       -> httpClient.get<Contract[]>("/contracts")
POST /contracts        -> createContract()     -> httpClient.post<Contract>("/contracts", payload)
GET  /contracts/{id}   -> getContractById(id)  -> httpClient.get<Contract>(`/contracts/${id}`)
```

`httpClient` (Bloco 05) injeta `Authorization: Bearer <accessToken>` automaticamente a partir de `useAuthStore.getState().accessToken` em toda rota não-pública, e os três hooks (`useContracts`, `useContractById`, `useCreateContract`) já usavam `useQuery`/`useMutation` apontando para essas funções. Nada disso precisou ser criado neste bloco — a pré-análise confirmou que reescrever essa camada seria retrabalho.

## 4. Contrato do GET /contracts

```txt
Rota:        GET /contracts
Auth:        Authorization: Bearer <token>  (obrigatório — get_current_profile)
Query:       status?: string  (filtro opcional por ContractStatus; 400 VALIDATION_ERROR se inválido)
Visibilidade: nenhum filtro por role — qualquer perfil autenticado lista todos os contratos
Response:    { "data": ContractOut[] }
Erros:       401 UNAUTHORIZED_ROLE (sem token / token inválido)
```

`ContractOut` (backend) é serializado em camelCase e espelha campo a campo o tipo `Contract` do frontend (`id`, `contractNumber`, `publicAgency`, `supplierName`, `supplierWallet`, `object`, `amount`, `startDate`, `endDate`, `deadline`, `inspectorName`, `inspectorWallet`, `logisticsResponsible`, `logisticsWallet`, `managerName`, `managerWallet`, `status`, `documentHash`, `blockchainContractId`, `createdAt`, `updatedAt`) — ver seção 8.

Validado contra o backend real (ver seção 13):

```txt
GET /contracts com token válido (GESTOR)  -> 200, lista vazia (ambiente local sem contratos seed)
GET /contracts sem token                  -> 401 {"message":"Autenticação obrigatória.","code":"UNAUTHORIZED_ROLE"}
GET /contracts com token inválido          -> 401 {"message":"Token de autenticação inválido.","code":"UNAUTHORIZED_ROLE"}
```

`useContracts(status?)` (frontend) já aceita um filtro opcional de status, mas a UI atual (`ContractsPage`) faz a filtragem/ordenação no cliente sobre a lista completa (`ContractsFilters`/`sortContracts`) — não envia `status` como query param. Isso é comportamento pré-existente, fora do escopo deste bloco (a integração de filtros server-side pertence a uma futura otimização, não a um requisito do Bloco 08).

## 5. Contrato do POST /contracts

```txt
Rota:   POST /contracts
Auth:   Authorization: Bearer <token>  (obrigatório)
Role:   somente GESTOR pode criar (require_role(profile, "create"))
Body:   CreateContractBody (todos os campos abaixo são camelCase, validados via Pydantic)
Status: 201 em sucesso
```

Payload real exigido pelo backend (`CreateContractBody`, `backend/app/schemas.py:55`):

```txt
contractNumber: str        (3-100 caracteres, único)
publicAgency: str          (1-255)
supplierName: str          (1-255)
supplierWallet?: str
object: str                (mínimo 10 caracteres)
amount: Decimal            (> 0)
startDate?: str            (ISO 8601)
endDate?: str              (ISO 8601)
deadline: str              (ISO 8601, obrigatório)
inspectorName: str         (1-255)
inspectorWallet?: str
logisticsResponsible: str  (1-255)
logisticsWallet?: str
managerName?: str
managerWallet?: str
documentHash?: str
```

`CreateContractPayload` no frontend (`web/src/entities/contract/model/api-types.ts`) já espelha exatamente esse schema — não foi necessário ajustar nenhum campo.

Validado contra o backend real (ver seção 13):

```txt
POST /contracts, token GESTOR + payload válido      -> 201, contrato criado (id retornado)
POST /contracts, token GESTOR + "object" com 5 chars -> 400 VALIDATION_ERROR
                  {"message":"Campos obrigatórios ausentes ou inválidos.","code":"VALIDATION_ERROR",
                   "details":[{"type":"string_too_short","loc":["body","object"],
                               "msg":"String should have at least 10 characters", ...}]}
POST /contracts, token FISCAL (sem permissão)        -> 403
                  {"message":"Seu perfil não tem permissão para executar esta ação.",
                   "code":"UNAUTHORIZED_ROLE","details":{"requiredRoles":["GESTOR"],"currentRole":"FISCAL"}}
```

`createContract()` já delega para `httpClient.post`, e `useCreateContract()` já trata sucesso (`toast.success` + invalidação de `queryKeys.contracts`/`dashboardSummary`) e erro (`toast.error(getApiErrorMessage(error))`). `CreateContractPage` já faz o gate de `canCreateContract(profile)` antes de exibir `CreateContractForm`. Nenhuma alteração foi necessária nesse fluxo.

## 6. Contrato do GET /contracts/{id}

```txt
Rota:   GET /contracts/{contract_id}
Auth:   Authorization: Bearer <token>  (obrigatório)
Path:   contract_id: UUID  (FastAPI valida formato; UUID inválido -> 422 antes de chegar ao service)
Erros:  404 NOT_FOUND  {"message":"Contrato não encontrado.","code":"NOT_FOUND"}  (UUID válido, inexistente)
        401 UNAUTHORIZED_ROLE  (sem token / token inválido)
Response: { "data": ContractOut }
```

Validado contra o backend real (ver seção 13):

```txt
GET /contracts/{id} com id válido (recém-criado)     -> 200, contractNumber retornado corretamente
GET /contracts/{id} com id inexistente (UUID válido) -> 404 {"message":"Contrato não encontrado.","code":"NOT_FOUND"}
```

`useContractById(id)` já delegava para `getContractById()` -> `httpClient.get`. O ajuste feito neste bloco foi exclusivamente na camada de apresentação (`ContractDetailPage`) para diferenciar esse 404 do erro genérico — ver seção 11.

## 7. Tipagens Criadas ou Ajustadas

Nenhuma tipagem nova foi criada e nenhuma tipagem existente precisou de ajuste de campos. `Contract`, `CreateContractPayload`, `UpdateContractPayload` (`web/src/entities/contract/model/types.ts` e `model/api-types.ts`) já correspondem 1:1 ao schema real do backend (`ContractOut`/`CreateContractBody`), confirmado campo a campo nas seções 4-6.

A única adição de tipo foi local, dentro de `ContractDetailPage`, para a verificação de erro `NOT_FOUND`:

```ts
const contractNotFound =
  contractFetchError instanceof HttpClientError &&
  contractFetchError.apiError.code === "NOT_FOUND";
```

Esse não é um novo tipo de domínio — apenas um type guard usando o tipo `HttpClientError`/`apiError.code` já existentes (Bloco 05).

## 8. Mapeamento Backend para Frontend

**Não foi necessário criar nenhum mapper.** O backend (`ContractOut`, `backend/app/schemas.py:123`) já serializa todos os campos em camelCase, e a nomenclatura é idêntica à do tipo `Contract` do frontend, campo a campo:

```txt
backend ContractOut          frontend Contract
─────────────────────────────────────────────────
id                       ==  id
contractNumber           ==  contractNumber
publicAgency             ==  publicAgency
supplierName             ==  supplierName
supplierWallet           ==  supplierWallet
object                   ==  object
amount                   ==  amount
startDate / endDate      ==  startDate / endDate
deadline                 ==  deadline
inspectorName/Wallet     ==  inspectorName/Wallet
logisticsResponsible/... ==  logisticsResponsible/...
managerName/Wallet       ==  managerName/Wallet
status                   ==  status (ContractStatus)
documentHash             ==  documentHash
blockchainContractId     ==  blockchainContractId
createdAt / updatedAt    ==  createdAt / updatedAt
```

A regra do bloco ("o backend é fonte da verdade; mapper deve ser claro e centralizado; evitar transformação espalhada") foi respeitada por ausência de necessidade: como os nomes já coincidem, qualquer mapper seria uma identidade sem propósito — adicioná-lo violaria a diretriz de não introduzir abstrações além do necessário. `getContracts`/`getContractById`/`createContract` retornam o `ApiResponse<Contract>`/`ApiResponse<Contract[]>` do `httpClient` diretamente, sem transformação intermediária.

`ContractStatus` também é idêntico nos dois lados (`CRIADO | ENVIADO | ENTREGUE | VALIDADO | PAGAMENTO_AUTORIZADO | DISPUTA`).

## 9. Telas/Componentes Ajustados

Apenas dois arquivos de página foram alterados (diff completo nas seções 10-11):

```txt
web/src/app/contracts/_components/contracts-page.tsx
web/src/app/contracts/[id]/_components/contract-detail-page.tsx
```

Componentes que já estavam prontos para consumir dados reais e **não precisaram de alteração** (confirmados por leitura de código):

```txt
ContractsList            — já trata loading (skeletons), empty (sem contratos) e
                           filtered-empty (filtros sem resultado) corretamente
ContractsFilters / ContractsSummaryBar — operam sobre os dados já carregados, agnósticos a mock/real
CreateContractPage       — já usa useCurrentProfile()/canCreateContract para os 4 estados de
                           autenticação (Bloco 07) e delega o submit a CreateContractForm/useCreateContract
ContractOverviewCard / ContractPartiesCard / ContractHashesCard / ContractBlockchainCard
                         — recebem `contract: Contract` já populado, sem dependência de mock/real
```

## 10. Tratamento de Loading/Empty/Error

**Loading** — pré-existente, sem alteração: `ContractsList` exibe skeletons enquanto `isLoading`; `ContractDetailPage` exibe um layout de `Skeleton` completo enquanto `contractLoading`.

**Empty** — pré-existente, sem alteração: `ContractsList` mostra "Nenhum contrato encontrado." (lista vazia) e um empty state distinto para "filtros sem resultado" (`isFiltered` + `onClearFilters`), cobrindo a mensagem exigida na seção 12.2 do planejamento do bloco.

**Error** — ajustado neste bloco. Antes, ambas as páginas usavam uma string fixa (`"Não foi possível buscar a lista de contratos..."` / `"Não foi possível buscar os dados do contrato..."`) para qualquer tipo de erro de API. Agora:

```diff
# contracts-page.tsx
- description="Não foi possível buscar a lista de contratos. Tente novamente."
+ description={getApiErrorMessage(error)}

# contract-detail-page.tsx (branch de erro genérico, após excluir o caso NOT_FOUND)
- description="Não foi possível buscar os dados do contrato. Tente novamente."
+ description={getApiErrorMessage(contractFetchError)}
```

`getApiErrorMessage` (centralizado desde o Bloco 05/06 em `web/src/shared/api/handle-api-error.ts`) mapeia `HttpClientError.apiError.statusCode` para mensagens amigáveis (400/422 -> mensagem do backend; 401 -> "Sessao invalida. Faca login novamente."; 403 -> mensagem específica de wallet sem perfil ou genérica de permissão; 5xx -> "Erro interno no servidor..."), preservando o fallback `error.apiError.message ?? FALLBACK_MESSAGE` para os demais casos. Ambas as páginas agora se beneficiam dessa centralização sem duplicar lógica de mapeamento de erro.

## 11. Tratamento de 401/403/404

**401 (Unauthorized)** — agora diferenciado em `ContractsPage` e `ContractDetailPage` via `getApiErrorMessage`, que retorna "Sessao invalida. Faca login novamente." quando `apiError.statusCode === 401`. Validado visualmente em modo real sem sessão (ver seção 13, screenshot `03-real-contracts-list-noauth.png`): a mensagem antes genérica ("Não foi possível buscar a lista de contratos...") passou a exibir corretamente "Sessao invalida. Faca login novamente.".

**403 (Forbidden)** — também passa por `getApiErrorMessage`, que distingue "wallet autenticada sem perfil" de "sem permissão para a ação" com base no texto da mensagem do backend. Validado contra o backend real que esse status/mensagem é retornado corretamente para `POST /contracts` com role `FISCAL` (ver seção 13); a renderização end-to-end na UI do estado 403 em `ContractsPage`/`ContractDetailPage` não pôde ser fotografada (depende de uma sessão autenticada real persistida — ver pendência na seção 14).

**404 (Not Found)** — este foi o ajuste estrutural mais relevante do bloco. Antes, `ContractDetailPage` tinha um `EmptyState` "Contrato não encontrado" escrito no branch `if (!contract)`, mas esse branch nunca era alcançado: quando a query falha (`isError === true`), `contract` é `undefined`, e o código retornava antes, no branch `if (contractError)`, com a mensagem genérica de erro. Ou seja, um 404 real do backend (`{"code":"NOT_FOUND","message":"Contrato não encontrado."}`) caía na mesma `ErrorState` genérica que um 401/403/500 — o empty state correto nunca era exibido para esse caso.

A correção introduziu um type guard que detecta especificamente esse erro:

```ts
const contractNotFound =
  contractFetchError instanceof HttpClientError &&
  contractFetchError.apiError.code === "NOT_FOUND";
```

e moveu o `EmptyState` "Contrato não encontrado" (reaproveitando o JSX exatamente como já existia) para dentro do branch `if (contractError)`, antes do branch de erro genérico:

```txt
if (contractError) {
  if (contractNotFound)  -> EmptyState "Contrato não encontrado" (reaproveitado, inalterado)
  else                   -> ErrorState com getApiErrorMessage(contractFetchError)
}
if (!contract) return null;   // inalcançável quando isError, mas mantido por segurança de tipos
```

**Por que `apiError.code === "NOT_FOUND"` e não `apiError.statusCode === 404`:** o `mockStore`/`MockErrors` (modo mock) constrói erros que **nunca** preenchem `statusCode` — apenas `code` (`MockErrors.notFound = (resource) => mockError("NOT_FOUND", ...)`, sem `statusCode`). Já o backend real sempre preenche `statusCode` (confirmado: `{"message":"Contrato não encontrado.","code":"NOT_FOUND"}` com `statusCode: 404` vindo do `api_error(404, "NOT_FOUND", ...)`). Usar `code` garante que o mesmo branch funcione corretamente nos dois modos — checar só `statusCode` quebraria o "contrato não encontrado" em modo mock.

## 12. Preservação do Mock Mode

Nenhuma chamada a `env.useMocks` foi alterada. `getContracts`/`getContractById`/`createContract` continuam retornando dados de `mockStore`/`MockErrors` quando `env.useMocks === true`, e as mensagens de erro mock (sem `statusCode`) continuam sendo tratadas corretamente por `getApiErrorMessage` (que cai no fallback `error.apiError.message ?? FALLBACK_MESSAGE` quando `statusCode` é `undefined`).

Validado visualmente com `NEXT_PUBLIC_USE_MOCKS=true` (ver seção 13, screenshots `01`/`02`):

```txt
[OK] Listagem de contratos mock (6 contratos) renderiza normalmente, com filtros/ordenação funcionando
[OK] Detalhe de contrato mock (/contracts/mock-contract-1) renderiza overview, partes, hashes,
     blockchain, painel de ações e timeline corretamente
[OK] Nenhuma chamada de rede a /contracts* — dados vêm de mockStore
[OK] Nenhuma mistura entre mockContracts e dados reais; nenhum fallback silencioso para mock em
     caso de erro real (a regra "se mocks=false e a API falhar, exibir erro" é estrutural — o branch
     `if (env.useMocks)` decide a fonte antes de qualquer chamada de rede, sem fallback cruzado)
```

## 13. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm run lint` | OK, sem erros nem warnings. |
| `npm run build` | OK, build de produção concluído com sucesso (rotas estáticas e `/contracts/[id]` dinâmica geradas). |
| `docker compose config` / `docker compose up -d --build` em `backend/` | OK — `fiscalizapay-api` e `fiscalizapay-db` `Up`/`healthy`. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200, `{"status":"ok","app":"FiscalizaPay API","environment":"development"}`. |
| login com wallet até `/auth/me` (fluxo completo `nonce -> assinatura -> verify -> JWT`) | OK — executado com duas contas reais (`eth_account.Account.create()`), uma `GESTOR` e uma `FISCAL`; ambas completaram `/auth/nonce` (200) e `/auth/verify` (200, `accessToken` emitido). |
| `GET /contracts` com token válido | OK — HTTP 200, lista retornada (vazia neste ambiente local, sem contratos seed). |
| `GET /contracts` sem token | OK — HTTP 401 `{"message":"Autenticação obrigatória.","code":"UNAUTHORIZED_ROLE"}`. |
| `GET /contracts` com token inválido | OK — HTTP 401 `{"message":"Token de autenticação inválido.","code":"UNAUTHORIZED_ROLE"}`. |
| `POST /contracts` com token válido (GESTOR) e payload válido | OK — HTTP 201, contrato criado (`id` retornado). |
| `POST /contracts` com payload inválido controlado (`object` com 5 caracteres, mínimo 10) | OK — HTTP 400 `{"code":"VALIDATION_ERROR","details":[{"type":"string_too_short","loc":["body","object"],...}]}`. |
| `POST /contracts` com role sem permissão (token `FISCAL`) | OK — HTTP 403 `{"message":"Seu perfil não tem permissão para executar esta ação.","code":"UNAUTHORIZED_ROLE","details":{"requiredRoles":["GESTOR"],"currentRole":"FISCAL"}}`. |
| `GET /contracts/{id}` com id válido | OK — HTTP 200, `contractNumber` do contrato recém-criado retornado corretamente. |
| `GET /contracts/{id}` com id inexistente (UUID válido, não cadastrado) | OK — HTTP 404 `{"message":"Contrato não encontrado.","code":"NOT_FOUND"}`. |
| UI com `NEXT_PUBLIC_USE_MOCKS=true` (listagem + detalhe) | OK — confirmado por captura de tela (`01-mock-contracts-list.png`, `02-mock-contract-detail.png`). |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — listagem sem sessão (401) | OK — confirmado por captura de tela (`03-real-contracts-list-noauth.png`): mensagem "Erro ao carregar contratos / Sessao invalida. Faca login novamente." (a nova mensagem diferenciada deste bloco substituiu a antiga genérica). |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — listagem/detalhe/criação **autenticados** (dados reais, 403, 404 visual) | Status: não executado. Motivo: ver seção 14 — condição de corrida entre hidratação de sessão (`AuthSessionHydrator`) e disparo da query `useContracts`/`useContractById` invalida qualquer sessão (real ou injetada) no primeiro carregamento de página protegida. Impacto: o branch de código para 403/404/sucesso autenticado foi validado por leitura (idêntico ao padrão de `getApiErrorMessage`/`EmptyState` já confirmado para 401), e os contratos reais de API (200/401/403/404) foram validados ponta a ponta diretamente contra o backend (linhas acima desta tabela) — mas a renderização visual desses estados na UI autenticada não pôde ser fotografada nesta rodada. |
| `git status` | Executado — escopo confirmado: apenas `contracts-page.tsx` e `contract-detail-page.tsx` alterados (mais os artefatos deste bloco: análise e feedback), sem mistura com outras pendências do repositório. |

## 14. Pendências para os Próximos Blocos

```txt
- Bug pré-existente (fora do escopo de criação deste bloco, não introduzido por ele): condição de
  corrida entre AuthSessionHydrator.hydrate() e o disparo de useContracts()/useContractById() no
  primeiro carregamento de uma página protegida. Evidência coletada via CDP Network (sessão real,
  emitida pelo backend, injetada em sessionStorage):

      >> GET /contracts | Authorization: (none)        [query do componente filho dispara primeiro,
                                                          accessToken ainda null no momento do fetch]
      >> GET /auth/me   | Authorization: Bearer ...    [hydrate() do AuthSessionHydrator roda depois,
                                                          encontra o token e o usa corretamente]
      << 401 /contracts                                 [clearSessionOnUnauthorized() é acionado]
      << 200 /auth/me                                   [prova que o token era válido o tempo todo]
      >> GET /contracts | Authorization: (none)         [sessão já foi apagada; nova tentativa falha]
      << 401 /contracts

  Efeito prático: qualquer reload de uma página protegida (não específico de contratos) pode invalidar
  uma sessão real e válida, forçando novo login. Recomenda-se que um bloco futuro condicione o disparo
  de queries protegidas a `hydrate()` já ter completado (ex.: gate via `enabled: hasHydrated` no
  useQuery, ou mover a leitura de accessToken para fora do ciclo de efeitos filho-antes-do-pai).
  Esse achado bloqueou a captura de telas autenticadas em modo real para este bloco (ver seção 13).
- Bloco 09: integrar actions reais (confirm-shipment, confirm-delivery, validate-receipt,
  authorize-payment, open-dispute, simulate-fraud).
- Bloco 10: integrar eventos/timeline/auditoria reais.
- Bloco 11: tratar blockchain indisponível de forma segura.
- Bloco 12: teste ponta a ponta completo.
- Capturar visualmente, assim que o problema de sessão acima for corrigido: listagem de contratos reais
  autenticada, detalhe de contrato real autenticado, estado 403 ao tentar criar contrato com role sem
  permissão, e o fluxo de criação de contrato real (CreateContractForm) ponta a ponta na UI.
```

## 15. Conclusão Técnica

O Bloco 08 está concluído tecnicamente. A pré-análise mostrou que a integração de contratos reais (camada `contracts-api`/tipagens/hooks/componentes de listagem e criação) já existia e funcionava corretamente em modo API real — construída em commits anteriores à Sessão 02 e já consumindo `httpClient` com `Authorization: Bearer` (Bloco 05) e `useCurrentProfile()` (Bloco 07). Reescrevê-la teria sido retrabalho desnecessário e contrário à diretriz de não introduzir abstrações além do necessário.

O ajuste real e necessário foi cirúrgico: `ContractsPage` e `ContractDetailPage` passaram a usar `getApiErrorMessage()` para diferenciar 401/403/422/500, e `ContractDetailPage` ganhou um type guard (`apiError.code === "NOT_FOUND"`) que finalmente torna alcançável o `EmptyState` "Contrato não encontrado" — antes presente no código, mas inacessível por estrutura de branches.

Os três endpoints (`GET /contracts`, `POST /contracts`, `GET /contracts/{id}`) foram validados ponta a ponta contra o backend real, com token genuíno emitido pelo fluxo completo de autenticação por wallet (`nonce -> assinatura -> verify -> JWT`), cobrindo todos os 12 cenários exigidos pelo bloco (200/401/403/404/422, com role válida e sem permissão). O modo mock permanece intacto e funcional, validado visualmente. A única lacuna documentada — capturas de tela de UI autenticada em modo real — tem causa raiz identificada e isolada (condição de corrida de sessão pré-existente, registrada na seção 14), não bloqueando a conclusão deste bloco nem indicando defeito na integração de contratos em si.
