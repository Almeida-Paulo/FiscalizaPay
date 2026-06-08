# Feedback - Bloco 10: Integrar Eventos, Timeline e Auditoria

Data: 2026-06-08

## 1. Resumo do que foi feito

Foram integrados os endpoints reais de eventos de contrato e auditoria global ao frontend.

O trabalho separou a camada de eventos/auditoria em APIs dedicadas, conectou os hooks e componentes existentes, manteve o mock mode e garantiu que actions reais invalidem tambem a auditoria global.

## 2. Arquivos criados

- `web/src/shared/api/events-api.ts`
- `web/src/shared/api/audit-api.ts`
- `Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_eventos_timeline_auditoria.md`
- `Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_10_integrar_eventos_timeline_auditoria.md`

## 3. Arquivos alterados

- `web/src/shared/api/contracts-api.ts`
- `web/src/shared/api/index.ts`
- `web/src/shared/api/handle-api-error.ts`
- `web/src/entities/contract-event/api/use-contract-events.ts`
- `web/src/app/contracts/[id]/_components/contract-detail-page.tsx`
- `web/src/app/contracts/[id]/_components/contract-timeline.tsx`
- `web/src/app/audit/_components/use-audit-events.ts`
- `web/src/app/audit/_components/audit-page.tsx`
- `web/src/app/audit/_components/audit-event-list.tsx`
- `web/src/entities/contract/api/use-create-contract.ts`
- `web/src/entities/contract/api/use-confirm-shipment.ts`
- `web/src/entities/contract/api/use-confirm-delivery.ts`
- `web/src/entities/contract/api/use-validate-receipt.ts`
- `web/src/entities/contract/api/use-authorize-payment.ts`
- `web/src/entities/contract/api/use-open-dispute.ts`
- `web/src/entities/contract/api/use-simulate-fraud.ts`

## 4. Endpoints integrados

- `GET /contracts/{id}/events`
- `GET /audit/events`

Ambos usam o `httpClient` central e, em modo real, dependem do JWT enviado como `Authorization: Bearer`.

## 5. Timeline real integrada

A timeline do detalhe de contrato passou a buscar eventos por `web/src/shared/api/events-api.ts`.

Em modo real, usa `GET /contracts/{id}/events`. Em mock mode, usa `mockStore.getEventsByContractId(contractId)`.

A ordem cronologica foi confirmada na validacao real.

## 6. Auditoria global integrada

A auditoria global passou a buscar eventos por `web/src/shared/api/audit-api.ts`.

Em modo real, usa `GET /audit/events`. Em mock mode, usa `mockStore.getAllEvents()` enriquecido com os dados dos contratos mockados.

A ordem decrescente foi confirmada na validacao real.

## 7. Tipagens e mapeamentos

`ContractEvent` ja estava alinhado ao serializer real do backend.

`AuditEventItem` foi movido para `audit-api.ts` e estende `ContractEvent` com:

- `contractNumber`
- `contractObject`
- `contractStatus`

Nao foi necessario mapper para modo real, pois o backend ja retorna camelCase.

## 8. Atualizacao apos actions

As mutations de contrato agora invalidam tambem `queryKeys.auditEvents`.

Isso foi aplicado em criacao de contrato e nas actions:

- confirmar envio
- confirmar entrega
- validar recebimento
- autorizar pagamento
- abrir disputa
- simular fraude

Na validacao real, `confirm-shipment` atualizou o contrato e fez a timeline e a auditoria refletirem o novo evento.

## 9. Tratamento de loading/empty/error

Timeline:

- loading com skeleton
- empty state existente
- error state usando `getApiErrorMessage(error)`

Auditoria:

- loading com skeleton
- empty state existente
- error state usando `getApiErrorMessage(error)`

## 10. Tratamento de 401/403/404

O handler central trata:

- `401`: sessao invalida
- `403`: permissao insuficiente para acessar o recurso
- `404`: mensagem do backend ou fallback de recurso nao encontrado

Foram validados `401` e `404` reais nos endpoints do bloco.

Observacao: o backend atual nao aplica restricao por role em `GET /contracts/{id}/events` nem em `GET /audit/events`; por isso, nao existe `403` real para esses dois GETs na versao atual. O frontend esta preparado para esse status.

## 11. Preservacao do mock mode

`NEXT_PUBLIC_USE_MOCKS=true` continua usando `mockStore` para eventos e auditoria.

`NEXT_PUBLIC_USE_MOCKS=false` usa exclusivamente a API real via `httpClient`, sem fallback silencioso para mock.

## 12. Validacoes executadas

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
| nonce -> assinatura -> verify -> JWT | OK |
| `GET /auth/me` com token real | OK |
| `GET /contracts` com token real | OK |
| `GET /contracts/{id}` com token real | OK |
| `GET /contracts/{id}/events` com token real | OK |
| `GET /contracts/{id}/events` sem token | `401` |
| `GET /contracts/{id}/events` com token invalido | `401` |
| `GET /contracts/{id}/events` com id inexistente | `404` |
| `GET /audit/events` com token real | OK |
| `GET /audit/events` sem token | `401` |
| `GET /audit/events` com token invalido | `401` |
| action real `confirm-shipment` | OK |
| timeline apos action real | 1 evento -> 2 eventos |
| auditoria apos action real | 1 evento -> 2 eventos para o contrato |

## 13. Pendencias encontradas

- Nao ha `403` real para os GETs de eventos/auditoria na implementacao atual do backend, pois esses endpoints exigem autenticacao mas nao filtram por role.
- Validacao visual manual no navegador pode ser feita em `http://localhost:3000`.
- Blockchain indisponivel, teste ponta a ponta final e deploy permanecem para os proximos blocos.

## 14. Commit realizado

Commit semantico deste bloco:

```txt
feat: integrar eventos e auditoria reais
```

## 15. Observacoes para o proximo bloco

O Bloco 11 pode partir do pressuposto de que timeline e auditoria ja refletem actions reais.

O `register-on-chain` real nao foi ativado neste bloco.
