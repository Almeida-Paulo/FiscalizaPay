# FiscalizaPay â€” Notas de IntegraÃ§Ã£o Frontend/API

> Documento tÃ©cnico gerado no Bloco 19 â€” 2026-06-02  
> ReferÃªncia: `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`

---

## 1. VariÃ¡veis de Ambiente

| VariÃ¡vel | PropÃ³sito | PadrÃ£o |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base da API backend (nova, preferida) | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_API_URL` | Alias legado de `API_BASE_URL` â€” ainda funciona | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_USE_MOCKS` | Controla se mocks sÃ£o usados (nova, preferida) | `true` |
| `NEXT_PUBLIC_ENABLE_MOCKS` | Alias legado de `USE_MOCKS` â€” ainda funciona | â€” |
| `NEXT_PUBLIC_CHAIN_ID` | ID da chain Polygon/EVM | `11155111` (Sepolia) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | EndereÃ§o do smart contract apÃ³s deploy | `0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83` |
| `NEXT_PUBLIC_EXPLORER_URL` | URL do block explorer | `https://sepolia.etherscan.io` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Project ID do WalletConnect | â€” |

### LÃ³gica de resoluÃ§Ã£o de `useMocks`

```
useMocks = NEXT_PUBLIC_USE_MOCKS !== "false" && NEXT_PUBLIC_ENABLE_MOCKS !== "false"
```

Qualquer uma das variÃ¡veis definida como `"false"` desativa os mocks. O padrÃ£o sem nenhuma variÃ¡vel Ã© `true` (mocks ativos).

### Para produÃ§Ã£o com API real

```env
NEXT_PUBLIC_API_BASE_URL=https://api.fiscalizapay.com.br
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<project-id>
```

---

## 2. httpClient â€” Timeout e Tratamento de Erros

Arquivo: `web/src/shared/api/http-client.ts`

### Timeout

Cada requisiÃ§Ã£o usa `AbortController` com timeout padrÃ£o de **10 segundos**.

```ts
const DEFAULT_TIMEOUT_MS = 10_000;
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);
```

Para requisiÃ§Ãµes que podem demorar mais (ex: registro blockchain), use `timeoutMs` por chamada:

```ts
httpClient.post("/contracts/id/register-on-chain", body, { timeoutMs: 30_000 });
```

### Erros normalizados

Todos os erros sÃ£o convertidos para `HttpClientError` com `apiError: ApiError`:

| SituaÃ§Ã£o | `code` | `message` |
|---|---|---|
| API retornou erro HTTP (4xx/5xx) | Conforme API (`ApiError.code`) | Conforme API |
| Timeout (AbortController) | `"INTERNAL_ERROR"` | "Tempo limite da requisiÃ§Ã£o excedido..." |
| Falha de rede / fetch error | `"INTERNAL_ERROR"` | "Erro de conexÃ£o com o servidor." |
| JSON invÃ¡lido na resposta | `"INTERNAL_ERROR"` | "Resposta invÃ¡lida do servidor." |

### Tratamento no frontend

Use `getApiErrorMessage(error)` (`web/src/shared/api/handle-api-error.ts`) em `onError` dos hooks para exibir mensagens amigÃ¡veis via toast.

---

## 3. ServiÃ§os Mapeados para a API

Arquivo: `web/src/shared/api/contracts-api.ts`

| FunÃ§Ã£o | Endpoint | Mock | ObservaÃ§Ãµes |
|---|---|---|---|
| `getContracts()` | `GET /contracts` | `mockStore.getContracts()` | |
| `getContractById(id)` | `GET /contracts/:id` | `mockStore.getContractById(id)` | |
| `createContract(payload)` | `POST /contracts` | Gera ID + evento `CONTRATO_CRIADO` | |
| `updateContract(id, payload)` | `PATCH /contracts/:id` | SÃ³ status `CRIADO` | |
| `deleteContract(id)` | `DELETE /contracts/:id` | SÃ³ status `CRIADO` | |
| `getContractEvents(id)` | `GET /contracts/:id/events` | `mockStore.getEventsByContractId(id)` | |
| `getAuditEvents()` | `GET /audit/events` | Join events + contracts enriquecido | Endpoint especÃ­fico de auditoria |
| `confirmShipment(id, payload)` | `POST /contracts/:id/confirm-shipment` | Status `CRIADO â†’ ENVIADO` | |
| `confirmDelivery(id, payload)` | `POST /contracts/:id/confirm-delivery` | Status `ENVIADO â†’ ENTREGUE` | |
| `validateReceipt(id, payload)` | `POST /contracts/:id/validate-receipt` | Status `ENTREGUE â†’ VALIDADO` | |
| `authorizePayment(id, payload)` | `POST /contracts/:id/authorize-payment` | Status `VALIDADO â†’ PAGAMENTO_AUTORIZADO` | |
| `openDispute(id, payload)` | `POST /contracts/:id/open-dispute` | Qualquer status â†’ `DISPUTA` | |
| `simulateFraud(id, payload)` | `POST /contracts/:id/simulate-fraud` | Detecta hash divergente | |

Arquivo: `web/src/shared/api/blockchain-api.ts`

| FunÃ§Ã£o | Endpoint | Mock |
|---|---|---|
| `getBlockchainStatus(id)` | `GET /contracts/:id/blockchain-status` | `mockStore.getBlockchainStatus(id)` |
| `registerOnChain(id)` | `POST /contracts/:id/register-on-chain` | Gera txHash + evento `HASH_REGISTRADO` |

Arquivo: `web/src/shared/api/dashboard-api.ts`

| FunÃ§Ã£o | Endpoint | Mock |
|---|---|---|
| `getDashboardSummary()` | `GET /dashboard/summary` | `mockStore.getDashboardSummary()` |

---

## 4. TanStack Query â€” InvalidaÃ§Ãµes

Arquivo: `web/src/shared/api/query-keys.ts`

```ts
queryKeys.dashboardSummary   // ["dashboard-summary"]
queryKeys.contracts          // ["contracts"]
queryKeys.contract(id)       // ["contract", id]
queryKeys.contractEvents(id) // ["contract-events", id]
queryKeys.blockchainStatus(id) // ["blockchain-status", id]
queryKeys.auditEvents        // ["audit-events"]
```

### Mapa de invalidaÃ§Ãµes por mutaÃ§Ã£o

| MutaÃ§Ã£o | Queries invalidadas |
|---|---|
| `useCreateContract` | `contracts`, `dashboardSummary` |
| AÃ§Ãµes de fluxo (`useConfirmShipment`, `useConfirmDelivery`, `useValidateReceipt`, `useAuthorizePayment`, `useOpenDispute`, `useSimulateFraud`) | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` |
| `useRegisterOnChain` | `blockchainStatus(id)`, `contractEvents(id)` |

> `auditEvents` nÃ£o Ã© invalidado nas mutaÃ§Ãµes pois a rota `/audit` nÃ£o estÃ¡ presente no MVP de invalidaÃ§Ã£o â€” o usuÃ¡rio pode recarregar manualmente ou aguardar revalidaÃ§Ã£o automÃ¡tica via `staleTime`.

---

## 5. Checklist de IntegraÃ§Ã£o com Backend Real

Quando o backend estiver disponÃ­vel:

- [ ] Definir `NEXT_PUBLIC_API_BASE_URL` com a URL real no `.env.local` (dev) e nas variÃ¡veis de ambiente do deploy
- [ ] Definir `NEXT_PUBLIC_USE_MOCKS=false` para desativar todos os mocks
- [ ] Testar cada endpoint listado na seÃ§Ã£o 3
- [ ] Verificar que os erros da API seguem o formato `{ message, code, details? }` definido em `contrato_api_frontend_backend.md`
- [ ] Verificar que respostas estÃ£o em camelCase
- [ ] Verificar que `transactionHash` aparece nos eventos de aÃ§Ãµes de fluxo
- [ ] Verificar que `documentHash` aparece corretamente na simulaÃ§Ã£o de fraude
- [ ] Testar timeout: simular resposta lenta (>10s) e verificar mensagem amigÃ¡vel
- [ ] Testar erro de rede: desativar API e verificar mensagem de conexÃ£o
- [ ] Verificar invalidaÃ§Ã£o do TanStack Query: apÃ³s cada aÃ§Ã£o, os dados devem refletir o novo estado

---

## 6. Fallback para Mock

O `env.useMocks` Ã© avaliado no build time (variÃ¡veis `NEXT_PUBLIC_*`). NÃ£o Ã© possÃ­vel alternar entre mock e API em runtime sem rebuild.

Para desenvolvimento paralelo (frontend antes do backend estar pronto): mantenha `NEXT_PUBLIC_USE_MOCKS=true`.

Para testes de integraÃ§Ã£o: use `NEXT_PUBLIC_USE_MOCKS=false` com a URL do backend de staging.

---

*Criado no Bloco 19 â€” IntegraÃ§Ã£o com API Real â€” 2026-06-02*

