# FiscalizaPay — Notas de Integração Frontend/API

> Documento técnico gerado no Bloco 19 — 2026-06-02  
> Referência: `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`

---

## 1. Variáveis de Ambiente

| Variável | Propósito | Padrão |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base da API backend (nova, preferida) | `http://localhost:3001` |
| `NEXT_PUBLIC_API_URL` | Alias legado de `API_BASE_URL` — ainda funciona | `http://localhost:3001` |
| `NEXT_PUBLIC_USE_MOCKS` | Controla se mocks são usados (nova, preferida) | `true` |
| `NEXT_PUBLIC_ENABLE_MOCKS` | Alias legado de `USE_MOCKS` — ainda funciona | — |
| `NEXT_PUBLIC_CHAIN_ID` | ID da chain Polygon/EVM | `80002` (Amoy) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Endereço do smart contract após deploy | — |
| `NEXT_PUBLIC_EXPLORER_URL` | URL do block explorer | `https://amoy.polygonscan.com` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Project ID do WalletConnect | — |

### Lógica de resolução de `useMocks`

```
useMocks = NEXT_PUBLIC_USE_MOCKS !== "false" && NEXT_PUBLIC_ENABLE_MOCKS !== "false"
```

Qualquer uma das variáveis definida como `"false"` desativa os mocks. O padrão sem nenhuma variável é `true` (mocks ativos).

### Para produção com API real

```env
NEXT_PUBLIC_API_BASE_URL=https://api.fiscalizapay.com.br
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_EXPLORER_URL=https://polygonscan.com
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<project-id>
```

---

## 2. httpClient — Timeout e Tratamento de Erros

Arquivo: `web/src/shared/api/http-client.ts`

### Timeout

Cada requisição usa `AbortController` com timeout padrão de **10 segundos**.

```ts
const DEFAULT_TIMEOUT_MS = 10_000;
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), timeoutMs);
```

Para requisições que podem demorar mais (ex: registro blockchain), use `timeoutMs` por chamada:

```ts
httpClient.post("/contracts/id/register-on-chain", body, { timeoutMs: 30_000 });
```

### Erros normalizados

Todos os erros são convertidos para `HttpClientError` com `apiError: ApiError`:

| Situação | `code` | `message` |
|---|---|---|
| API retornou erro HTTP (4xx/5xx) | Conforme API (`ApiError.code`) | Conforme API |
| Timeout (AbortController) | `"INTERNAL_ERROR"` | "Tempo limite da requisição excedido..." |
| Falha de rede / fetch error | `"INTERNAL_ERROR"` | "Erro de conexão com o servidor." |
| JSON inválido na resposta | `"INTERNAL_ERROR"` | "Resposta inválida do servidor." |

### Tratamento no frontend

Use `getApiErrorMessage(error)` (`web/src/shared/api/handle-api-error.ts`) em `onError` dos hooks para exibir mensagens amigáveis via toast.

---

## 3. Serviços Mapeados para a API

Arquivo: `web/src/shared/api/contracts-api.ts`

| Função | Endpoint | Mock | Observações |
|---|---|---|---|
| `getContracts()` | `GET /contracts` | `mockStore.getContracts()` | |
| `getContractById(id)` | `GET /contracts/:id` | `mockStore.getContractById(id)` | |
| `createContract(payload)` | `POST /contracts` | Gera ID + evento `CONTRATO_CRIADO` | |
| `updateContract(id, payload)` | `PATCH /contracts/:id` | Só status `CRIADO` | |
| `deleteContract(id)` | `DELETE /contracts/:id` | Só status `CRIADO` | |
| `getContractEvents(id)` | `GET /contracts/:id/events` | `mockStore.getEventsByContractId(id)` | |
| `getAuditEvents()` | `GET /audit/events` | Join events + contracts enriquecido | Endpoint específico de auditoria |
| `confirmShipment(id, payload)` | `POST /contracts/:id/confirm-shipment` | Status `CRIADO → ENVIADO` | |
| `confirmDelivery(id, payload)` | `POST /contracts/:id/confirm-delivery` | Status `ENVIADO → ENTREGUE` | |
| `validateReceipt(id, payload)` | `POST /contracts/:id/validate-receipt` | Status `ENTREGUE → VALIDADO` | |
| `authorizePayment(id, payload)` | `POST /contracts/:id/authorize-payment` | Status `VALIDADO → PAGAMENTO_AUTORIZADO` | |
| `openDispute(id, payload)` | `POST /contracts/:id/open-dispute` | Qualquer status → `DISPUTA` | |
| `simulateFraud(id, payload)` | `POST /contracts/:id/simulate-fraud` | Detecta hash divergente | |

Arquivo: `web/src/shared/api/blockchain-api.ts`

| Função | Endpoint | Mock |
|---|---|---|
| `getBlockchainStatus(id)` | `GET /contracts/:id/blockchain-status` | `mockStore.getBlockchainStatus(id)` |
| `registerOnChain(id)` | `POST /contracts/:id/register-on-chain` | Gera txHash + evento `HASH_REGISTRADO` |

Arquivo: `web/src/shared/api/dashboard-api.ts`

| Função | Endpoint | Mock |
|---|---|---|
| `getDashboardSummary()` | `GET /dashboard/summary` | `mockStore.getDashboardSummary()` |

---

## 4. TanStack Query — Invalidações

Arquivo: `web/src/shared/api/query-keys.ts`

```ts
queryKeys.dashboardSummary   // ["dashboard-summary"]
queryKeys.contracts          // ["contracts"]
queryKeys.contract(id)       // ["contract", id]
queryKeys.contractEvents(id) // ["contract-events", id]
queryKeys.blockchainStatus(id) // ["blockchain-status", id]
queryKeys.auditEvents        // ["audit-events"]
```

### Mapa de invalidações por mutação

| Mutação | Queries invalidadas |
|---|---|
| `useCreateContract` | `contracts`, `dashboardSummary` |
| Ações de fluxo (`useConfirmShipment`, `useConfirmDelivery`, `useValidateReceipt`, `useAuthorizePayment`, `useOpenDispute`, `useSimulateFraud`) | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` |
| `useRegisterOnChain` | `blockchainStatus(id)`, `contractEvents(id)` |

> `auditEvents` não é invalidado nas mutações pois a rota `/audit` não está presente no MVP de invalidação — o usuário pode recarregar manualmente ou aguardar revalidação automática via `staleTime`.

---

## 5. Checklist de Integração com Backend Real

Quando o backend estiver disponível:

- [ ] Definir `NEXT_PUBLIC_API_BASE_URL` com a URL real no `.env.local` (dev) e nas variáveis de ambiente do deploy
- [ ] Definir `NEXT_PUBLIC_USE_MOCKS=false` para desativar todos os mocks
- [ ] Testar cada endpoint listado na seção 3
- [ ] Verificar que os erros da API seguem o formato `{ message, code, details? }` definido em `contrato_api_frontend_backend.md`
- [ ] Verificar que respostas estão em camelCase
- [ ] Verificar que `transactionHash` aparece nos eventos de ações de fluxo
- [ ] Verificar que `documentHash` aparece corretamente na simulação de fraude
- [ ] Testar timeout: simular resposta lenta (>10s) e verificar mensagem amigável
- [ ] Testar erro de rede: desativar API e verificar mensagem de conexão
- [ ] Verificar invalidação do TanStack Query: após cada ação, os dados devem refletir o novo estado

---

## 6. Fallback para Mock

O `env.useMocks` é avaliado no build time (variáveis `NEXT_PUBLIC_*`). Não é possível alternar entre mock e API em runtime sem rebuild.

Para desenvolvimento paralelo (frontend antes do backend estar pronto): mantenha `NEXT_PUBLIC_USE_MOCKS=true`.

Para testes de integração: use `NEXT_PUBLIC_USE_MOCKS=false` com a URL do backend de staging.

---

*Criado no Bloco 19 — Integração com API Real — 2026-06-02*
