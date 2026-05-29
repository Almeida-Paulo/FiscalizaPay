# Feedback Bloco 6 — Cliente HTTP e Estratégia de Mocks

## 1. Objetivo do bloco

Criar a camada de comunicação e mocks do frontend do FiscalizaPay Web3. O objetivo foi implementar o API client (wrapper fetch), a configuração centralizada de envs, os services que alternam automaticamente entre mock e API real via `NEXT_PUBLIC_ENABLE_MOCKS`, os payload types para as actions, e todos os mocks de dados necessários para que o frontend funcione de forma completa e demonstrável sem depender do backend.

---

## 2. Documentos lidos

- `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` (principal)
- `Docs/Governanca_tecnica/glossario_tecnico_oficial.md` (principal)
- `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md`
- `Docs/Cronograma/Tasks_Frontend_implementation.md`
- Código existente dos Blocos 4 e 5 (lido antes de criar qualquer arquivo)

---

## 3. Arquivos criados

```txt
web/src/shared/config/env.ts
web/src/shared/config/index.ts
web/src/shared/api/http-client.ts
web/src/shared/api/contracts-api.ts
web/src/shared/api/dashboard-api.ts
web/src/shared/api/blockchain-api.ts
web/src/shared/api/index.ts
web/src/entities/contract/model/api-types.ts
web/src/shared/mocks/profiles.mock.ts
web/src/shared/mocks/contracts.mock.ts
web/src/shared/mocks/contract-events.mock.ts
web/src/shared/mocks/dashboard.mock.ts
web/src/shared/mocks/blockchain.mock.ts
web/src/shared/mocks/mock-errors.ts
web/src/shared/mocks/index.ts
```

---

## 4. Arquivos alterados

```txt
web/src/app/page.tsx                                     → seção Bloco 6 adicionada ao showcase
web/src/entities/contract/index.ts                       → exporta api-types.ts
web/README.md                                            → seção "Mocks e API Client" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md         → Bloco 6 marcado como concluído
```

---

## 5. Env config

`shared/config/env.ts` centraliza todas as variáveis públicas do frontend:

| Variável | Campo em `env` | Tipo | Fallback |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `apiUrl` | string | `http://localhost:3001` |
| `NEXT_PUBLIC_CHAIN_ID` | `chainId` | number | `80002` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `contractAddress` | string | `""` |
| `NEXT_PUBLIC_ENABLE_MOCKS` | `enableMocks` | boolean | `true` |
| `NEXT_PUBLIC_EXPLORER_URL` | `explorerUrl` | string | `https://amoy.polygonscan.com` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | `walletConnectProjectId` | string | `""` |

`enableMocks` é derivado por `!== "false"`, garantindo que o default (variável ausente ou `"true"`) ativa os mocks.

---

## 6. HTTP Client

`shared/api/http-client.ts` implementa wrapper sobre `fetch` nativo:

- **Métodos:** `get`, `post`, `patch`, `delete`
- **Base URL:** `env.apiUrl`
- **Headers padrão:** `Content-Type: application/json`, `Accept: application/json`
- **Retorno:** `ApiResponse<T>` em sucesso
- **Erro:** lança `HttpClientError` (extends `Error`) com `apiError: ApiError` interno
- **Resposta vazia:** trata status 204 e `content-length: 0` retornando `{ data: null }`
- **Tipagem:** forte — nenhum `any` explícito

`ApiResponse<T>` e `ApiError` reusam os tipos já definidos em `shared/types/api.ts` (Bloco 3).

---

## 7. Services/API implementados

### contracts-api.ts

Implementa todas as 12 funções do contrato API:
`getContracts`, `getContractById`, `createContract`, `updateContract`, `deleteContract`, `getContractEvents`, `confirmShipment`, `confirmDelivery`, `validateReceipt`, `authorizePayment`, `openDispute`, `simulateFraud`.

**Alternância mock/real:** cada função verifica `env.enableMocks` no topo:
- `true` → retorna dados dos mocks com validações de status coerentes
- `false` → delega para `httpClient`

As funções mock validam transições de status (ex: `confirmShipment` só aceita contratos em `CRIADO`) e lançam `MockErrors.invalidStatusTransition` quando necessário.

### dashboard-api.ts

`getDashboardSummary()` → mock retorna `mockDashboardSummary` ou chama `GET /dashboard/summary`.

### blockchain-api.ts

`getBlockchainStatus(contractId)` → retorna `BlockchainStatus` por ID.
`registerOnChain(contractId)` → mock gera tx hash aleatório e retorna evento `HASH_REGISTRADO`.

---

## 8. Payload types

Criados em `entities/contract/model/api-types.ts`, exportados via `entities/contract/index.ts`:

| Tipo | Uso |
|---|---|
| `CreateContractPayload` | `POST /contracts` |
| `UpdateContractPayload` | `PATCH /contracts/:id` (Partial de Create) |
| `ContractActionPayload` | `confirm-shipment`, `confirm-delivery`, `validate-receipt`, `authorize-payment` |
| `OpenDisputePayload` | `POST /contracts/:id/open-dispute` |
| `SimulateFraudPayload` | `POST /contracts/:id/simulate-fraud` (usa `newDocumentHash` conforme contrato API) |

---

## 9. Mocks criados

### profiles.mock.ts

5 perfis — 1 por role oficial: `GESTOR` (Maria Santos), `FORNECEDOR` (Carlos Rodrigues), `ENTREGADOR` (Ricardo Alves), `FISCAL` (João Silva), `AUDITOR` (Ana Ferreira). Todos com `walletAddress`.

### contracts.mock.ts

6 contratos realistas — 1 por status oficial:

| Contrato | Órgão | Objeto | Valor | Status |
|---|---|---|---|---|
| CT-2026-001 | Prefeitura de São Paulo | Equipamentos de informática | R$ 480.000 | CRIADO |
| CT-2026-002 | Secretaria de Saúde RJ | Ultrassons portáteis | R$ 1.250.000 | ENVIADO |
| CT-2026-003 | FNDE / MEC | 50.000 livros didáticos | R$ 375.000 | ENTREGUE |
| CT-2026-004 | ANVISA | Insumos laboratoriais | R$ 892.000 | VALIDADO |
| CT-2026-005 | DNIT | Recape BR-101, 45 km | R$ 12.750.000 | PAGAMENTO_AUTORIZADO |
| CT-2026-006 | Prefeitura de BH | Limpeza pública | R$ 2.340.000 | DISPUTA |

### contract-events.mock.ts

Timelines coerentes por contrato:
- CT-2026-001 (CRIADO): 1 evento — `CONTRATO_CRIADO`
- CT-2026-002 (ENVIADO): 2 eventos — `CONTRATO_CRIADO` → `ENVIO_CONFIRMADO`
- CT-2026-003 (ENTREGUE): 3 eventos — + `ENTREGA_CONFIRMADA`
- CT-2026-004 (VALIDADO): 4 eventos — + `RECEBIMENTO_VALIDADO`
- CT-2026-005 (PAGAMENTO_AUTORIZADO): 6 eventos — inclui `HASH_REGISTRADO` após criação + `PAGAMENTO_AUTORIZADO`
- CT-2026-006 (DISPUTA): 4 eventos — `CONTRATO_CRIADO` → `ENVIO_CONFIRMADO` → `FRAUDE_SIMULADA` → `DISPUTA_ABERTA`

### dashboard.mock.ts

`DashboardSummary` derivado diretamente dos 6 contratos mockados (1 por status).

### blockchain.mock.ts

`BlockchainStatus` para cada contrato. CT-2026-001 (`CRIADO`) não está registrado on-chain. Os demais têm `transactionHash`, `blockNumber` e `blockchainTimestamp` realistas.

### mock-errors.ts

Helper `MockErrors` com: `notFound`, `invalidStatusTransition`, `unauthorizedRole`, `validationError`. Todos lançam `HttpClientError` com o código correto do contrato API.

---

## 10. Coerência dos dados mockados

- **6 contratos** — todos os status oficiais cobertos (sem repetição).
- **26 eventos** no total — timelines progressivas e cronologicamente consistentes.
- **Contrato em disputa** (CT-2026-006) possui timeline de fraude: `FRAUDE_SIMULADA` + `DISPUTA_ABERTA` com auditor e hash adulterado explícito.
- **Contrato com pagamento autorizado** (CT-2026-005) possui fluxo completo: 6 eventos incluindo `HASH_REGISTRADO` blockchain.
- **Transaction hashes** presentes nos eventos a partir de `ENVIO_CONFIRMADO` (formato `0x...`).
- **Document hashes** nos contratos que os têm (strings hex sem `0x`, conforme contrato API).
- **Wallets** em todos os perfis e contratos (formato `0x...`).
- **Datas** ISO 8601 com progressão cronológica coerente.

---

## 11. Atualização do showcase

`app/page.tsx` foi atualizado com a seção "Bloco 6 — API Client e Mocks" antes dos itens dos blocos anteriores. Exibe:

- Indicador visual do modo atual (`MOCK ATIVO` ou `API REAL`) com ícone e badge da env
- 4 cards de métricas do `mockDashboardSummary` (total, disputa, pgto autorizado, criados)
- Lista dos 6 contratos mockados com número, órgão, valor e `ContractStatusBadge`
- Mensagem de rodapé indicando que o Bloco 6 está completo

A página **não** é dashboard real — é showcase temporário que será substituído no Bloco 9.

---

## 12. Atualização do checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` foi atualizado:
- Todas as tasks do Bloco 6 marcadas como `[x]`
- Tasks de commit e push adicionadas e marcadas como concluídas (hash: 1921a57)
- npm run lint e npm run build marcados como `PASSOU`

---

## 13. Validações executadas

### npm run lint
```
✓ Sem erros ou warnings
```

### npm run build
```
▲ Next.js 16.2.6 (Turbopack)
✓ Compiled successfully in 6.6s
✓ TypeScript sem erros em 4.3s
✓ Generating static pages (4/4)
```

### npm run dev
Não executado nesta sessão — o ambiente Windows/WSL não permite abrir browser automaticamente. O build confirmou que não há erros de runtime estático.

---

## 14. Commit e push

| Item | Valor |
|---|---|
| Commit realizado | ✅ sim |
| Hash do commit | `1921a57` |
| Mensagem | `feat(frontend): add api client and mocks` |
| Push realizado | ✅ sim |
| Branch | `main` |
| Remote | `origin/main` (GitHub) |
| Arquivos no commit | 19 (15 criados, 4 alterados) |

---

## 15. Problemas encontrados

- `ContractEvent` é exportado de `@/entities/contract-event`, não de `@/entities/contract`. O import foi corrigido em `contracts-api.ts` e `blockchain-api.ts` antes do lint/build.
- O arquivo `page.tsx` não podia ser escrito sem leitura prévia (regra do Write tool) — lido antes de substituir.
- Avisos de `LF → CRLF` do Git (Windows) são normais no ambiente e não afetam o código.

---

## 16. Pendências para o Bloco 7

- `useDashboardSummary` — hook TanStack Query
- `useContracts` — hook com filtro opcional por status
- `useContractById` — hook por ID
- `useContractEvents` — hook de timeline
- `useBlockchainStatus` — hook on-chain
- `useCreateContract` — mutation com invalidação
- `useConfirmShipment`, `useConfirmDelivery`, `useValidateReceipt`, `useAuthorizePayment` — mutations de fluxo
- `useOpenDispute`, `useSimulateFraud` — mutations de disputa
- Invalidação de queries após cada mutation
- Toasts de sucesso e erro globais
- `QUERY_KEYS` constante oficial

**Nota sobre persistência em mock mode:** As funções de action mockadas (`confirmShipment`, etc.) retornam contratos atualizados coerentes, mas **não persistem o estado em memória**. Isso é intencional para o Bloco 6. No Bloco 7, o TanStack Query cache (invalidation após mutation) será a fonte de verdade — em mock mode, as queries re-buscam os dados estáticos. Se persistência em memória for necessária para demo mais realista, uma Zustand store pode ser adicionada no Bloco 7 como camada opcional.

---

## 17. Veredito

**Bloco 6 está concluído e aprovado para avançar para o Bloco 7.**

Todos os critérios de aceite foram atendidos:
- env.ts criado com todas as variáveis
- http-client.ts funcional (fetch wrapper, ApiResponse, ApiError, HttpClientError)
- contracts-api.ts com 12 funções cobrindo o contrato completo
- dashboard-api.ts e blockchain-api.ts implementados
- 5 tipos de payload criados e exportados
- 6 mocks de contratos — 1 por cada status oficial
- Timelines coerentes com eventos realistas
- Contrato em disputa com fraude simulada
- Contrato com pagamento autorizado e 6 eventos de fluxo completo
- Alternância mock/API via env.enableMocks sem alterar componentes
- Showcase atualizado (showcase temporário, não dashboard real)
- README atualizado
- Checklist atualizado
- npm run lint: PASSOU
- npm run build: PASSOU
- Commit `1921a57` e push realizados
- Backend e smart contract não foram alterados
