# Feedback Bloco 19 — Integração com API Real

## 1. Objetivo do bloco

Preparar a infraestrutura de integração com a API real do backend (NestJS), mantendo os mocks como fallback funcional para desenvolvimento e demo. Sem implementar funcionalidades novas — foco em configuração, resiliência do httpClient e documentação.

---

## 2. Documentos lidos

- `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` — contrato de integração API
- `Docs/Feedback_chat/feedback_bloco_18_frontend_responsive_polish.md` — contexto do bloco anterior
- `Docs/Cronograma/Tasks_Frontend_implementation.md` — tasks do Bloco 19

---

## 3. Arquivos criados

```txt
Docs/Contratos_tecnicos/frontend_api_integration_notes.md
Docs/Feedback_chat/feedback_bloco_19_frontend_api_integration.md
```

---

## 4. Arquivos alterados

```txt
web/src/shared/config/env.ts
web/src/shared/api/http-client.ts
web/src/shared/api/contracts-api.ts
web/src/shared/api/dashboard-api.ts
web/src/shared/api/blockchain-api.ts
web/.env.example
web/README.md
Docs/Cronograma/Tasks_Frontend_implementation.md
```

---

## 5. Mudanças implementadas

### `web/src/shared/config/env.ts`

**Antes:**
```ts
apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
enableMocks: process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false",
```

**Depois:**
```ts
apiBaseUrl:
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001",

useMocks:
  process.env.NEXT_PUBLIC_USE_MOCKS !== "false" &&
  process.env.NEXT_PUBLIC_ENABLE_MOCKS !== "false",
```

**Lógica de retrocompatibilidade:**
- `NEXT_PUBLIC_API_BASE_URL` tem prioridade sobre `NEXT_PUBLIC_API_URL` (mantido como alias legado)
- `NEXT_PUBLIC_USE_MOCKS` tem prioridade; `NEXT_PUBLIC_ENABLE_MOCKS` ainda funciona
- Qualquer uma das variáveis de mocks definida como `"false"` desativa os mocks
- Padrão sem nenhuma variável: mocks ativos

---

### `web/src/shared/api/http-client.ts`

**Mudanças:**

1. **`env.apiUrl` → `env.apiBaseUrl`** — alinha com o novo nome de env.

2. **Timeout via `AbortController`** — 10 segundos por padrão. Configurável por chamada via `timeoutMs`:
   ```ts
   const DEFAULT_TIMEOUT_MS = 10_000;
   const controller = new AbortController();
   const timeout = setTimeout(() => controller.abort(), timeoutMs);
   ```

3. **Safe JSON parse** — `response.text()` primeiro; `JSON.parse` em try/catch. JSON inválido lança `HttpClientError` com `code: "INTERNAL_ERROR"` em vez de exceção genérica.

4. **Normalização de erros de rede e timeout:**
   - `AbortError` (timeout) → `HttpClientError({ message: "Tempo limite da requisição excedido. Verifique sua conexão.", code: "INTERNAL_ERROR" })`
   - Falha de fetch (rede) → `HttpClientError({ message: "Erro de conexão com o servidor.", code: "INTERNAL_ERROR" })`

5. **`timeoutMs` como opção por chamada** — útil para operações lentas (ex: registro blockchain pode precisar de 30s).

---

### Services (`contracts-api.ts`, `dashboard-api.ts`, `blockchain-api.ts`)

`env.enableMocks` → `env.useMocks` em todos os services. Mudança puramente de nomenclatura — comportamento idêntico.

---

### `web/.env.example`

Adicionadas as variáveis novas com comentários explicando prioridade e retrocompatibilidade:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
# NEXT_PUBLIC_API_URL=http://localhost:3001  # alias legado

NEXT_PUBLIC_USE_MOCKS=true
# NEXT_PUBLIC_ENABLE_MOCKS=true  # alias legado
```

---

## 6. Validação das invalidações TanStack Query

Revisados todos os mutation hooks em `entities/*/api/`:

| Hook | Invalidações | Status |
|---|---|---|
| `useCreateContract` | `contracts`, `dashboardSummary` | ✅ Correto |
| `useConfirmShipment` | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` | ✅ Correto |
| `useConfirmDelivery` | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` | ✅ Correto |
| `useValidateReceipt` | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` | ✅ Correto |
| `useAuthorizePayment` | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` | ✅ Correto |
| `useOpenDispute` | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` | ✅ Correto |
| `useSimulateFraud` | `contract(id)`, `contracts`, `contractEvents(id)`, `dashboardSummary` | ✅ Correto |
| `useRegisterOnChain` | `blockchainStatus(id)`, `contractEvents(id)` | ✅ Correto |

Nenhuma alteração necessária — todas as invalidações estão alinhadas com o contrato API (`contrato_api_frontend_backend.md` seção 14).

---

## 7. Documentação criada

`Docs/Contratos_tecnicos/frontend_api_integration_notes.md` contém:
- Tabela de variáveis de ambiente com explicação de prioridade
- Configuração para dev/produção com API real
- Guia do httpClient: timeout por chamada, erros normalizados
- Tabela de todos os services mapeados para endpoints
- Mapa de invalidações TanStack Query
- Checklist para integração com backend real

---

## 8. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 9 rotas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 9. Commit e push

| Item | Valor |
|---|---|
| Mensagem | `feat(frontend): integrate real api configuration` |
| Push | ✅ sim |
| Branch | `main` |

---

## 10. Retrocompatibilidade

As variáveis antigas (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ENABLE_MOCKS`) continuam funcionando sem nenhuma alteração nos `.env.local` existentes. A migração para os novos nomes é opcional e gradual.

---

## 11. Pendências para o Bloco 20

- Criar mocks com dados realistas para demo
- Definir fluxo feliz completo (contrato criado → pagamento autorizado)
- Definir fluxo de disputa e fraude para demonstração de impacto
- Preparar roteiro de cliques para apresentação

---

## 12. Veredito

**Bloco 19 está concluído e aprovado para avançar para o Bloco 20.**

Todos os critérios de aceite foram atendidos:
- `env.apiBaseUrl` com suporte a variável nova e alias legado ✅
- `env.useMocks` com suporte a variável nova e alias legado ✅
- httpClient com timeout de 10s via AbortController ✅
- Safe JSON parse com erro normalizado ✅
- Erros de rede normalizados para `HttpClientError` ✅
- Todos os services usando `env.useMocks` (uniforme) ✅
- `.env.example` documentado ✅
- Guia de integração em `frontend_api_integration_notes.md` ✅
- README atualizado com seção "Integração com API real" ✅
- `npm run lint`: PASSOU (0 erros, 0 warnings) ✅
- `npm run build`: PASSOU (9 rotas, TypeScript sem erros) ✅
- Nenhuma funcionalidade de negócio alterada ✅
- Backend e smart contract não foram alterados ✅
