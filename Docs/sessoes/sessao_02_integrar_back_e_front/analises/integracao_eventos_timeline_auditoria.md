# Integracao de Eventos, Timeline e Auditoria - Bloco 10

Data: 2026-06-08

## 1. Resumo Executivo

O Bloco 10 integrou a leitura de eventos reais do contrato e a auditoria global real ao frontend, preservando o mock mode.

O backend atual ja expunha os endpoints protegidos `GET /contracts/{id}/events` e `GET /audit/events`. A implementacao concentrou a camada de API em arquivos dedicados, conectou os hooks existentes a esses endpoints, propagou erros controlados para a UI e invalidou a auditoria global apos actions reais.

Em `NEXT_PUBLIC_USE_MOCKS=false`, eventos e auditoria usam o `httpClient` central com `Authorization: Bearer`. Em `NEXT_PUBLIC_USE_MOCKS=true`, os dados continuam vindo do `mockStore`.

## 2. Arquivos Analisados

- `backend/app/routers/contracts.py`
- `backend/app/routers/audit.py`
- `backend/app/services/contracts.py`
- `backend/app/schemas.py`
- `backend/app/serializers.py`
- `web/src/shared/api/contracts-api.ts`
- `web/src/shared/api/http-client.ts`
- `web/src/shared/api/handle-api-error.ts`
- `web/src/shared/api/query-keys.ts`
- `web/src/shared/mocks/mock-store.ts`
- `web/src/entities/contract-event/model/types.ts`
- `web/src/entities/contract-event/ui/contract-event-card.tsx`
- `web/src/entities/contract-event/api/use-contract-events.ts`
- `web/src/app/contracts/[id]/_components/contract-detail-page.tsx`
- `web/src/app/contracts/[id]/_components/contract-timeline.tsx`
- `web/src/app/audit/_components/use-audit-events.ts`
- `web/src/app/audit/_components/audit-page.tsx`
- `web/src/app/audit/_components/audit-event-list.tsx`
- `web/src/app/audit/_components/audit-event-card.tsx`
- hooks de actions em `web/src/entities/contract/api/`

## 3. Endpoints Integrados

- `GET /contracts/{id}/events`
- `GET /audit/events`

Ambos sao protegidos por `get_current_profile`, portanto dependem do JWT obtido no fluxo wallet -> nonce -> assinatura -> verify -> Authorization Bearer.

Nao foram usados endpoints de blockchain real, deploy, `register-on-chain` real ou fallback silencioso para mocks em modo real.

## 4. Contrato do GET /contracts/{id}/events

Endpoint real:

```txt
GET http://127.0.0.1:8000/contracts/{contract_id}/events
Authorization: Bearer <jwt>
```

Resposta de sucesso:

```ts
ApiResponse<ContractEvent[]>
```

Campos retornados pelo backend em camelCase:

- `id`
- `contractId`
- `eventType`
- `description`
- `responsibleRole`
- `responsibleName`
- `responsibleWallet`
- `statusBefore`
- `statusAfter`
- `documentHash`
- `transactionHash`
- `blockchainTimestamp`
- `createdAt`

Ordenacao real: crescente por `createdAt`, feita no backend com `sorted(contract.events, key=lambda item: item.created_at)`.

Erros validados:

- sem token: `401`
- token invalido: `401`
- contrato inexistente: `404`

## 5. Contrato do GET /audit/events

Endpoint real:

```txt
GET http://127.0.0.1:8000/audit/events
Authorization: Bearer <jwt>
```

Resposta de sucesso:

```ts
ApiResponse<AuditEventItem[]>
```

`AuditEventItem` estende `ContractEvent` com:

- `contractNumber`
- `contractObject`
- `contractStatus`

Ordenacao real: decrescente por `createdAt`, feita no backend por `ContractEvent.created_at.desc()`.

Na versao atual do backend nao ha query params, paginacao ou filtros server-side para auditoria. Os filtros existentes seguem client-side no frontend.

Erros validados:

- sem token: `401`
- token invalido: `401`

## 6. Tipagens Criadas ou Ajustadas

Nao foi necessario recriar `ContractEvent`, pois a tipagem existente ja corresponde ao serializer real do backend.

Foi movida a tipagem de auditoria para a camada dedicada:

```ts
export type AuditEventItem = ContractEvent & {
  contractNumber: string;
  contractObject: string;
  contractStatus: Contract["status"];
};
```

Arquivos criados:

- `web/src/shared/api/events-api.ts`
- `web/src/shared/api/audit-api.ts`

## 7. Mapeamento Backend para Frontend

O backend ja serializa eventos e auditoria em camelCase por `event_out` e `AuditEventItemOut`. Por isso, nao foi necessario mapper para o modo real.

O unico enriquecimento mantido no frontend ocorre em mock mode: `audit-api.ts` combina eventos do `mockStore` com contratos mockados para formar `contractNumber`, `contractObject` e `contractStatus`.

## 8. Timeline do Contrato

A timeline do detalhe de contrato usa `useContractEvents(id)`, que agora chama `getContractEvents` em `web/src/shared/api/events-api.ts`.

Com `NEXT_PUBLIC_USE_MOCKS=false`:

- chama `GET /contracts/{id}/events`
- usa `httpClient`
- envia Bearer automaticamente
- nao cai para mock em caso de erro

Com `NEXT_PUBLIC_USE_MOCKS=true`:

- usa `mockStore.getEventsByContractId(contractId)`
- preserva eventos mockados
- ordena os eventos por `createdAt`

A UI preserva skeleton de loading, empty state e agora tambem recebe erro real para exibir `ErrorState` controlado.

## 9. Auditoria Global

A pagina de auditoria usa `useAuditEvents()`, que agora chama `getAuditEvents` em `web/src/shared/api/audit-api.ts`.

Com `NEXT_PUBLIC_USE_MOCKS=false`:

- chama `GET /audit/events`
- usa `httpClient`
- envia Bearer automaticamente
- nao cai para mock em caso de erro

Com `NEXT_PUBLIC_USE_MOCKS=true`:

- usa `mockStore.getAllEvents()`
- enriquece com dados dos contratos mockados
- ordena por `createdAt` decrescente

Os filtros existentes foram preservados no frontend.

## 10. Estrategia de Atualizacao apos Actions

Apos actions reais, os hooks de mutation invalidam:

- contrato individual
- lista de contratos
- eventos do contrato
- auditoria global
- resumo do dashboard

Foram atualizados os hooks:

- `use-create-contract.ts`
- `use-confirm-shipment.ts`
- `use-confirm-delivery.ts`
- `use-validate-receipt.ts`
- `use-authorize-payment.ts`
- `use-open-dispute.ts`
- `use-simulate-fraud.ts`

A validacao real confirmou que uma action `confirm-shipment` aumentou os eventos do contrato de 1 para 2 e tambem aumentou os eventos globais de auditoria daquele contrato de 1 para 2.

## 11. Tratamento de Loading/Empty/Error

Timeline:

- loading: skeleton existente
- empty: `Nenhum evento registrado para este contrato.`
- error: `ErrorState` usando `getApiErrorMessage(error)`

Auditoria:

- loading: skeleton existente
- empty: `Nenhum evento de auditoria encontrado.`
- error: `ErrorState` usando `getApiErrorMessage(error)`

O handler central tambem recebeu fallback explicito para `404` e mensagem neutra para `403`.

## 12. Tratamento de 401/403/404

Tratamento no frontend:

- `401`: `Sessao invalida. Faca login novamente.`
- `403`: `Voce nao tem permissao para acessar este recurso.`
- `404`: mensagem do backend ou `Recurso nao encontrado.`

Validado no backend:

- `GET /contracts/{id}/events` sem token: `401`
- `GET /contracts/{id}/events` com token invalido: `401`
- `GET /contracts/{id}/events` com id inexistente: `404`
- `GET /audit/events` sem token: `401`
- `GET /audit/events` com token invalido: `401`

Observacao: na versao atual, `GET /contracts/{id}/events` e `GET /audit/events` exigem autenticacao, mas nao possuem restricao por role. Por isso, nao ha cenario real de `403` nesses dois GETs hoje. O frontend esta preparado para exibir a mensagem controlada caso o backend passe a retornar `403`.

## 13. Preservacao do Mock Mode

Mock mode foi preservado por branch explicita em:

- `web/src/shared/api/events-api.ts`
- `web/src/shared/api/audit-api.ts`

Com `NEXT_PUBLIC_USE_MOCKS=true`, timeline e auditoria continuam lendo do `mockStore`.

Com `NEXT_PUBLIC_USE_MOCKS=false`, as funcoes usam exclusivamente o `httpClient`. Nao ha fallback silencioso para mock se a API real falhar.

## 14. Validacoes Executadas

| Validacao | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` com `NEXT_PUBLIC_USE_MOCKS=false` | OK |
| `npm run build` com `NEXT_PUBLIC_USE_MOCKS=true` | OK |
| `git diff --check` | OK |
| `docker compose config` | OK |
| `docker compose up -d --build` | OK |
| `docker compose ps` | API e DB ativos |
| `GET http://127.0.0.1:8000/health` | OK |
| fluxo nonce -> assinatura -> verify -> JWT | OK |
| `GET /auth/me` com token real | `200`, profile real |
| `GET /contracts` com token real | `200` |
| `GET /contracts/{id}` com token real | `200` |
| `GET /contracts/{id}/events` com token real | `200` |
| `GET /contracts/{id}/events` sem token | `401` |
| `GET /contracts/{id}/events` com token invalido | `401` |
| `GET /contracts/{id}/events` com id inexistente | `404` |
| `GET /audit/events` com token real | `200` |
| `GET /audit/events` sem token | `401` |
| `GET /audit/events` com token invalido | `401` |
| action real `confirm-shipment` | `200` |
| timeline apos action real | eventos passaram de 1 para 2 |
| auditoria apos action real | eventos do contrato passaram de 1 para 2 |
| ordenacao timeline | cronologica |
| ordenacao auditoria | decrescente |

## 15. Pendencias para Proximos Blocos

- Validacao visual manual no navegador em `http://localhost:3000`, se desejado, com o backend em `http://127.0.0.1:8000`.
- Tratamento final de blockchain indisponivel pertence ao Bloco 11.
- Teste ponta a ponta final pertence ao Bloco 12.
- `register-on-chain` real permanece fora de escopo.
- Deploy permanece fora de escopo.

## 16. Conclusao Tecnica

O Bloco 10 esta tecnicamente integrado: timeline e auditoria usam endpoints reais com Bearer em modo API, preservam mock mode, tratam estados de carregamento/vazio/erro e sao atualizadas apos actions reais por invalidacao de cache.

O backend foi confirmado como fonte de verdade para schemas, ordenacao e protecao dos endpoints. Nenhum segredo foi salvo em arquivo, nenhum token foi documentado e nenhum item de blockchain real foi ativado.
