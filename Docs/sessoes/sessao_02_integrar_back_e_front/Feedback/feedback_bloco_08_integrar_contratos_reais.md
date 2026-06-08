# Feedback — Bloco 08: Integrar Contratos Reais

## 1. Resumo do que foi feito

A pré-análise revelou que a integração de contratos reais (`contracts-api.ts`, tipagens `Contract`/`CreateContractPayload`, hooks `useContracts`/`useContractById`/`useCreateContract`, `ContractsList`, `CreateContractForm`) **já existia e funcionava** em modo `NEXT_PUBLIC_USE_MOCKS=false`, construída em commits anteriores à Sessão 02 e já consumindo `httpClient` com `Authorization: Bearer` (Bloco 05) e `useCurrentProfile()` (Bloco 07). Reescrever essa camada teria sido retrabalho.

O gap real era pontual: `ContractsPage` e `ContractDetailPage` exibiam **uma única mensagem de erro genérica** para qualquer falha de API (401/403/404/500 indistintos), e `ContractDetailPage` tinha um `EmptyState` "Contrato não encontrado" escrito no código, porém **inalcançável** — o branch de erro genérico capturava o 404 antes que o branch `if (!contract)` pudesse ser avaliado.

Este bloco corrigiu exatamente isso, sem tocar na camada de dados:

```txt
ContractsPage      -> troca a mensagem fixa por getApiErrorMessage(error)
                       (habilita 401 "Sessao invalida..."/403/422/500 corretos)
ContractDetailPage -> adiciona type guard contractFetchError.apiError.code === "NOT_FOUND"
                       e move o EmptyState "Contrato não encontrado" (reaproveitado, inalterado)
                       para dentro do branch de erro; demais erros usam getApiErrorMessage()
```

Os três endpoints (`GET /contracts`, `POST /contracts`, `GET /contracts/{id}`) foram validados ponta a ponta contra o backend real, com tokens genuínos emitidos pelo fluxo completo `wallet -> nonce -> assinatura -> verify -> JWT`, cobrindo os 12 cenários do checklist (200/401/403/404/422, com role válida e sem permissão).

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_contratos_reais.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_08_integrar_contratos_reais.md
```

Nenhum arquivo de produção novo foi criado — a camada de dados (`contracts-api.ts`, tipagens, hooks) já existia e não precisou de adições.

## 3. Arquivos alterados

```txt
web/src/app/contracts/_components/contracts-page.tsx
web/src/app/contracts/[id]/_components/contract-detail-page.tsx
```

## 4. Endpoints integrados

Os três endpoints exigidos já estavam conectados em `web/src/shared/api/contracts-api.ts` (commits `f296a49`/`b420ddc`, anteriores à Sessão 02), todos roteando para `httpClient` quando `env.useMocks === false`:

```txt
GET  /contracts        -> getContracts()       -> httpClient.get<Contract[]>("/contracts")
POST /contracts        -> createContract()     -> httpClient.post<Contract>("/contracts", payload)
GET  /contracts/{id}   -> getContractById(id)  -> httpClient.get<Contract>(`/contracts/${id}`)
```

`Authorization: Bearer <accessToken>` é injetado automaticamente pelo `httpClient` (Bloco 05) a partir de `useAuthStore.getState().accessToken`. `useContracts`, `useContractById` e `useCreateContract` já existiam como wrappers `useQuery`/`useMutation` apontando para essas funções.

## 5. Contratos reais listados

`GET /contracts` requer `Authorization: Bearer`, aceita `status?: string` como filtro opcional (400 `VALIDATION_ERROR` se inválido) e não aplica nenhum filtro de visibilidade por role — qualquer perfil autenticado lista todos os contratos. Validado contra o backend real:

```txt
GET /contracts, token GESTOR válido  -> 200, lista retornada (vazia neste ambiente local sem seed de contratos)
GET /contracts, sem token            -> 401 {"message":"Autenticação obrigatória.","code":"UNAUTHORIZED_ROLE"}
GET /contracts, token inválido       -> 401 {"message":"Token de autenticação inválido.","code":"UNAUTHORIZED_ROLE"}
```

`useContracts(status?)` aceita o filtro, mas a UI atual filtra/ordena no cliente (`ContractsFilters`/`sortContracts`) — comportamento pré-existente, fora do escopo deste bloco.

## 6. Criação de contrato real

`POST /contracts` exige `Authorization: Bearer` e role `GESTOR` (`require_role(profile, "create")`). `CreateContractPayload` (frontend) já espelha exatamente o `CreateContractBody` (backend) — mesmos campos, mesmas regras (`object` mín. 10 caracteres, `amount > 0`, `deadline` ISO 8601 obrigatório etc.). Validado contra o backend real:

```txt
POST /contracts, token GESTOR + payload válido        -> 201, contrato criado (id retornado)
POST /contracts, token GESTOR + "object" com 5 chars  -> 400 VALIDATION_ERROR
                {"details":[{"type":"string_too_short","loc":["body","object"],
                             "msg":"String should have at least 10 characters",...}]}
POST /contracts, token FISCAL (role sem permissão)    -> 403
                {"message":"Seu perfil não tem permissão para executar esta ação.",
                 "code":"UNAUTHORIZED_ROLE","details":{"requiredRoles":["GESTOR"],"currentRole":"FISCAL"}}
```

`createContract()`/`useCreateContract()`/`CreateContractPage` já tratavam sucesso (toast + invalidação de queries), erro (`toast.error(getApiErrorMessage(error))`) e gate de permissão (`canCreateContract`) — nenhuma alteração necessária.

## 7. Detalhe de contrato real

`GET /contracts/{id}` exige `Authorization: Bearer`; `contract_id` é validado como UUID pelo FastAPI; retorna 404 `NOT_FOUND` para UUID válido porém inexistente. Validado contra o backend real:

```txt
GET /contracts/{id}, id válido (recém-criado)      -> 200, contractNumber retornado corretamente
GET /contracts/{id}, id inexistente (UUID válido)  -> 404 {"message":"Contrato não encontrado.","code":"NOT_FOUND"}
```

`useContractById(id)` já delegava corretamente para `getContractById()`. O ajuste deste bloco foi exclusivamente na apresentação — ver seção 9.

## 8. Tipagens e mapeamentos

Nenhuma tipagem nova foi criada e nenhum mapper foi necessário. `Contract`/`CreateContractPayload`/`UpdateContractPayload` (frontend) já correspondem 1:1, campo a campo, ao `ContractOut`/`CreateContractBody` (backend) — ambos em camelCase, com a mesma nomenclatura (`contractNumber`, `publicAgency`, `supplierWallet`, `documentHash`, `createdAt` etc.). Confirmado por leitura cruzada dos schemas Pydantic e dos tipos TypeScript.

Adicionar um mapper de identidade (sem nenhuma transformação real) violaria a diretriz de não introduzir abstrações além do necessário — por isso `getContracts`/`getContractById`/`createContract` continuam retornando `ApiResponse<Contract>`/`ApiResponse<Contract[]>` diretamente do `httpClient`, sem camada intermediária.

A única adição foi um type guard local em `ContractDetailPage`:

```ts
const contractNotFound =
  contractFetchError instanceof HttpClientError &&
  contractFetchError.apiError.code === "NOT_FOUND";
```

## 9. Tratamento de estados e erros

**Loading/Empty** — pré-existentes, sem alteração (`ContractsList` já trata skeletons, "Nenhum contrato encontrado." e empty state de filtro sem resultado; `ContractDetailPage` já tinha layout de skeleton completo).

**Error (401/403/404/422/500)** — ajustado neste bloco. Antes, ambas as páginas usavam uma string fixa para qualquer erro. Agora usam `getApiErrorMessage()` (centralizado desde o Bloco 05/06), que mapeia `statusCode` para mensagens corretas: 400/422 -> mensagem do backend; 401 -> "Sessao invalida. Faca login novamente."; 403 -> mensagem específica de wallet sem perfil ou de permissão; 5xx -> "Erro interno no servidor...".

**404 especificamente** — era o gap mais relevante: o `EmptyState` "Contrato não encontrado" existia no código de `ContractDetailPage`, mas era inalcançável (o branch de erro genérico capturava `isError` antes do branch `if (!contract)`, e quando há erro `contract` é sempre `undefined`). A correção criou o type guard `apiError.code === "NOT_FOUND"` e moveu o `EmptyState` (JSX reaproveitado, sem alteração de texto/ação) para dentro do branch de erro, antes do branch genérico.

```txt
Por que checar `code` e não `statusCode === 404`:
  MockErrors (modo mock) NUNCA preenche `statusCode`, só `code` — checar `statusCode`
  quebraria o "contrato não encontrado" em modo mock. O backend real sempre preenche os
  dois (`statusCode: 404, code: "NOT_FOUND"`), então `code` funciona nos dois modos.
```

## 10. Preservação do mock mode

Nenhuma chamada a `env.useMocks` foi alterada — `getContracts`/`getContractById`/`createContract` continuam servindo `mockStore`/`MockErrors` em modo mock, e `getApiErrorMessage` já tratava corretamente erros mock (sem `statusCode`, caindo no fallback `apiError.message`). Validado visualmente com `NEXT_PUBLIC_USE_MOCKS=true`:

```txt
[OK] Listagem de contratos mock (6 contratos, /contracts) — filtros e ordenação funcionando
[OK] Detalhe de contrato mock (/contracts/mock-contract-1) — overview, partes, hashes, blockchain,
     painel de ações e timeline renderizados corretamente
[OK] Nenhuma chamada de rede a /contracts* — dados servidos por mockStore
[OK] Sem mistura mock/real e sem fallback silencioso (decisão de fonte ocorre em
     `if (env.useMocks)`, antes de qualquer chamada de rede)
```

## 11. Validações executadas

| Validação | Resultado |
|---|---|
| `npm run lint` | OK, sem erros nem warnings. |
| `npm run build` | OK, build de produção concluído com sucesso. |
| `docker compose config` / `docker compose up -d --build` | OK — `fiscalizapay-api`/`fiscalizapay-db` `Up`/`healthy`. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200, `{"status":"ok","app":"FiscalizaPay API","environment":"development"}`. |
| login com wallet até `/auth/me` (fluxo completo) | OK — executado com 2 contas reais (`eth_account.Account.create()`, uma `GESTOR` e uma `FISCAL`); `/auth/nonce` (200) -> assinatura -> `/auth/verify` (200, `accessToken` emitido) para ambas. |
| `GET /contracts` com token válido | OK — HTTP 200, lista retornada. |
| `GET /contracts` sem token | OK — HTTP 401 `UNAUTHORIZED_ROLE` / "Autenticação obrigatória.". |
| `GET /contracts` com token inválido | OK — HTTP 401 `UNAUTHORIZED_ROLE` / "Token de autenticação inválido.". |
| `POST /contracts` com token válido e payload válido | OK — HTTP 201, contrato criado. |
| `POST /contracts` com payload inválido controlado (`object` curto) | OK — HTTP 400 `VALIDATION_ERROR` com detalhe Pydantic (`string_too_short`). |
| `POST /contracts` com role sem permissão (`FISCAL`) | OK — HTTP 403 `UNAUTHORIZED_ROLE` / `requiredRoles: ["GESTOR"]`, `currentRole: "FISCAL"`. |
| `GET /contracts/{id}` com id válido | OK — HTTP 200, `contractNumber` correto. |
| `GET /contracts/{id}` com id inexistente | OK — HTTP 404 `NOT_FOUND` / "Contrato não encontrado.". |
| UI com `NEXT_PUBLIC_USE_MOCKS=true` (listagem + detalhe) | OK — confirmado por captura de tela (`01-mock-contracts-list.png`, `02-mock-contract-detail.png`). |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — listagem sem sessão (401) | OK — confirmado por captura de tela (`03-real-contracts-list-noauth.png`): mensagem nova "Erro ao carregar contratos / Sessao invalida. Faca login novamente." substituiu corretamente a antiga genérica. |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — listagem/detalhe/criação **autenticados** | Status: não executado. Motivo: condição de corrida pré-existente entre `AuthSessionHydrator.hydrate()` e o disparo de `useContracts()`/`useContractById()` invalida qualquer sessão (real ou injetada via `sessionStorage`) no primeiro carregamento de uma página protegida — ver seção 12 para evidência detalhada. Impacto: os branches de UI para sucesso/403/404 autenticados foram validados por leitura de código (idênticos ao padrão de `getApiErrorMessage`/`EmptyState` já confirmado para 401), e os endpoints reais (200/401/403/404/422) foram validados ponta a ponta diretamente contra o backend (linhas acima); apenas a captura visual da UI autenticada ficou pendente. |
| `git status` | Executado — escopo confirmado: apenas os 2 arquivos de página + análise técnica alterados/criados; sem mistura com outras pendências do repositório. |

## 12. Pendências encontradas

**Bug pré-existente (não introduzido por este bloco) — condição de corrida na hidratação de sessão:**

Ao injetar uma sessão real (JWT genuíno, emitido pelo backend via fluxo completo `nonce -> assinatura -> verify`) em `sessionStorage` e recarregar `/contracts`, a sessão era apagada antes da página renderizar o estado autenticado. Investigação com CDP `Network.requestWillBeSent`/`responseReceived` capturou a sequência exata:

```txt
>> GET /contracts | Authorization: (none)        — useContracts() (componente filho) dispara
                                                    o fetch ANTES de hydrate() popular accessToken
>> GET /auth/me   | Authorization: Bearer ...    — AuthSessionHydrator roda depois, já com o token
<< 401 /contracts                                 — clearSessionOnUnauthorized() apaga a sessão
<< 200 /auth/me                                   — prova que o token era válido o tempo todo
>> GET /contracts | Authorization: (none)         — nova tentativa, sessão já apagada
<< 401 /contracts
```

Causa raiz: a árvore de providers é `Web3Provider > AuthSessionHydrator > TooltipProvider > {children}`; efeitos de componentes filhos rodam antes dos efeitos do pai, então a primeira requisição de `/contracts` sai sem token, recebe 401, e `clearSessionOnUnauthorized()` apaga `sessionStorage` — mesmo quando a sessão era genuína e válida.

```txt
- Efeito: qualquer reload de página protegida pode invalidar uma sessão real e válida,
  forçando novo login — não é específico de contratos.
- Não é um defeito da integração de contratos em si (os 3 endpoints funcionam corretamente
  quando chamados com token, conforme seção 11).
- Fora do escopo de correção deste bloco (é um problema de ordenação de efeitos entre a
  store de auth e o React Query — pertence à camada de sessão/hidratação, não à de contratos).
- Recomendação para bloco futuro: condicionar queries protegidas a hydrate() já ter
  completado (ex.: `enabled: hasHydrated` no useQuery).
- Bloqueou: capturas de tela autenticadas em modo real (listagem/detalhe com dados reais,
  estado 403 ao criar contrato sem permissão, fluxo de criação ponta a ponta na UI).
- Demais pendências esperadas do bloco: actions reais (Bloco 09), eventos/timeline/auditoria
  (Bloco 10), blockchain indisponível (Bloco 11), teste ponta a ponta (Bloco 12).
```

## 13. Commit realizado

Commit semântico realizado:

```txt
feat: integrar contratos reais com backend
```

Hash: `9cbc8ac`

Escopo do commit (3 arquivos): 2 componentes de página ajustados (`contracts-page.tsx`, `contract-detail-page.tsx`) + análise técnica — sem mistura com actions, timeline, auditoria, blockchain ou outras pendências do repositório.

## 14. Observações para o próximo bloco

A condição de corrida descrita na seção 12 deveria, idealmente, ser corrigida **antes** do Bloco 09 (Actions Reais): o mesmo padrão (`useMutation`/`useQuery` em componente filho de `AuthSessionHydrator`) se repete em `ContractActionPanel`, e qualquer ação que dependa de uma sessão recém-recarregada herdaria o mesmo risco de "sessão apagada silenciosamente". Não foi corrigida aqui por estar fora do escopo de contratos e por afetar a camada de sessão de forma transversal — mas registrar essa recomendação foi considerado mais útil do que ignorá-la.

`useContracts(status?)` já aceita filtro server-side por status, mas a UI filtra no cliente — se o volume de contratos crescer, vale considerar mover o filtro de status para a query string (otimização, não bloqueio).

Os dois conjuntos de wallets/perfis de teste criados para a validação ponta a ponta (`Sonda Validacao GESTOR`/`Sonda Validacao FISCAL` e o contrato `CT-VAL-*` criado por eles) foram removidos do banco ao final desta rodada — nenhum dado de teste permanece no ambiente.
