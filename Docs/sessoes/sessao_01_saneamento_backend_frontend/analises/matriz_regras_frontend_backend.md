# Matriz de Regras Frontend/Backend - Bloco 06

## 1. Resumo Executivo

O Bloco 06 analisou e alinhou as regras visuais do frontend com as regras reais do backend para roles, permissoes e actions do FiscalizaPay Web3.

Fonte de verdade adotada:

```txt
backend/app/services/contracts.py -> ACTION_ROLES
backend/app/models.py -> UserRole
```

Resultado geral:

- Roles do backend e frontend usam o mesmo padrao em uppercase.
- Actions protegidas do backend foram mapeadas.
- Frontend foi ajustado para refletir as roles reais em actions criticas.
- Modo mock foi preservado.
- Tratamento visual simples para 401/403 foi preparado no client HTTP.
- Validacoes de lint, build, Docker, health, 401 e 403 foram executadas.

Conclusao resumida:

```txt
As regras visuais principais estao alinhadas ao backend para a integracao futura.
```

## 2. Roles Encontradas no Backend

Arquivo principal:

```txt
backend/app/models.py
```

Enum real:

```txt
GESTOR
FORNECEDOR
ENTREGADOR
FISCAL
AUDITOR
```

Observacoes:

- As roles tambem aparecem em constraints das tabelas `profiles`, `contract_events` e `disputes`.
- O seed demo cria um perfil para cada role.
- O backend usa role em uppercase como padrao oficial.

## 3. Roles Encontradas no Frontend

Arquivos principais:

```txt
web/src/entities/profile/model/types.ts
web/src/entities/profile/model/constants.ts
web/src/entities/profile/model/store.ts
web/src/shared/mocks/profiles.mock.ts
```

Roles encontradas:

```txt
GESTOR
FORNECEDOR
ENTREGADOR
FISCAL
AUDITOR
```

Conclusao:

```txt
Os nomes das roles do frontend ja estavam compativeis com o backend.
```

## 4. Actions Encontradas no Backend

Fonte:

```txt
backend/app/services/contracts.py
```

Actions em `ACTION_ROLES`:

```txt
create
update
delete
confirm_shipment
confirm_delivery
validate_receipt
authorize_payment
open_dispute
simulate_fraud
register_on_chain
```

Leituras protegidas por JWT, sem role especifica:

```txt
GET /dashboard/summary
GET /contracts
GET /contracts/{id}
GET /contracts/{id}/events
GET /contracts/{id}/blockchain-status
GET /audit/events
GET /auth/me
```

Endpoints publicos de auth:

```txt
GET /auth/nonce
POST /auth/verify
```

## 5. Actions Encontradas no Frontend

Arquivos principais:

```txt
web/src/entities/contract/model/rules.ts
web/src/features/contract-actions/ui/*
web/src/features/create-contract/ui/create-contract-form.tsx
web/src/shared/api/contracts-api.ts
web/src/shared/api/blockchain-api.ts
```

Actions visuais/servicos encontrados:

```txt
createContract
confirmShipment
confirmDelivery
validateReceipt
authorizePayment
openDispute
simulateFraud
registerOnChain
```

Observacao:

- `update` e `delete` existem no client API, mas nao foram encontrados como botoes principais ativos na UI analisada.
- `query-showcase.tsx` existe como componente demonstrativo nao importado por rota ativa.

## 6. Matriz de Permissoes

| Acao | Endpoint | Roles permitidas no backend | Exibicao no frontend apos Bloco 06 | Status |
|---|---|---|---|---|
| Listar contratos | `GET /contracts` | JWT valido, qualquer role cadastrada | Hooks/telas de contratos | OK |
| Ver contrato | `GET /contracts/{id}` | JWT valido, qualquer role cadastrada | Cards/listas/detalhe | OK |
| Criar contrato | `POST /contracts` | `GESTOR` | `GESTOR` ve botao/form; demais recebem bloqueio visual | OK |
| Atualizar contrato | `PATCH /contracts/{id}` | `GESTOR` + wallet do gestor + status `CRIADO` | Sem botao principal ativo mapeado | Documentado |
| Excluir contrato | `DELETE /contracts/{id}` | `GESTOR` + wallet do gestor + status `CRIADO` | Sem botao principal ativo mapeado | Documentado |
| Confirmar envio | `POST /contracts/{id}/confirm-shipment` | `FORNECEDOR` + wallet do fornecedor + status `CRIADO` | `FORNECEDOR` em status `CRIADO` | OK |
| Confirmar entrega | `POST /contracts/{id}/confirm-delivery` | `ENTREGADOR` + wallet de logistica + status `ENVIADO` | `ENTREGADOR` em status `ENVIADO` | OK |
| Validar recebimento | `POST /contracts/{id}/validate-receipt` | `FISCAL` + wallet do fiscal + status `ENTREGUE` | `FISCAL` em status `ENTREGUE` | OK |
| Autorizar pagamento | `POST /contracts/{id}/authorize-payment` | `GESTOR` + wallet do gestor + status `VALIDADO` | `GESTOR` em status `VALIDADO` | OK |
| Abrir disputa | `POST /contracts/{id}/open-dispute` | `GESTOR`, `FISCAL`, `AUDITOR` + contrato nao finalizado/nem em disputa | `GESTOR`, `FISCAL`, `AUDITOR` quando status permite | OK |
| Simular fraude | `POST /contracts/{id}/simulate-fraud` | `GESTOR`, `FISCAL`, `AUDITOR` + `documentHash` + contrato nao finalizado/nem em disputa | `GESTOR`, `FISCAL`, `AUDITOR` com `documentHash` e status permitido | OK |
| Status blockchain | `GET /contracts/{id}/blockchain-status` | JWT valido, qualquer role cadastrada | Card/status blockchain | OK |
| Registrar on-chain | `POST /contracts/{id}/register-on-chain` | `GESTOR` + wallet do gestor; backend retorna `502` enquanto contrato real esta desabilitado | Botao exibido apenas para `GESTOR` | Parcial esperado |
| Dashboard | `GET /dashboard/summary` | JWT valido, qualquer role cadastrada | Dashboard | OK |
| Auditoria | `GET /audit/events` | JWT valido, qualquer role cadastrada | Tela de auditoria | OK |
| Perfil atual | `GET /auth/me` | JWT valido | Integracao real futura | Sessao 02 |

## 7. Divergencias Encontradas

### D1 - Abrir disputa

Antes:

```txt
Frontend: GESTOR, FISCAL, FORNECEDOR, ENTREGADOR
Backend: GESTOR, FISCAL, AUDITOR
```

Status:

```txt
Corrigido no frontend.
```

### D2 - Simular fraude

Antes:

```txt
Frontend: GESTOR, FISCAL
Backend: GESTOR, FISCAL, AUDITOR
```

Status:

```txt
Corrigido no frontend.
```

### D3 - Disputa/fraude em contrato ja em disputa

Antes:

```txt
Frontend bloqueava PAGAMENTO_AUTORIZADO, mas nao bloqueava DISPUTA nas funcoes base.
Backend bloqueia PAGAMENTO_AUTORIZADO e DISPUTA.
```

Status:

```txt
Corrigido no frontend.
```

### D4 - Registrar on-chain

Antes:

```txt
Frontend exibia botao para qualquer perfil.
Backend permite apenas GESTOR.
```

Status:

```txt
Corrigido no painel de acoes do contrato.
```

### D5 - Criar contrato

Antes:

```txt
Frontend exibia "Novo contrato" e formulario para qualquer perfil demo.
Backend permite create apenas para GESTOR.
```

Status:

```txt
Corrigido nas areas visuais principais.
```

## 8. Correcoes Realizadas

Arquivos ajustados:

```txt
web/src/entities/contract/model/rules.ts
web/src/entities/profile/model/constants.ts
web/src/features/contract-actions/ui/contract-action-panel.tsx
web/src/app/permissions-showcase.tsx
web/src/app/contracts/_components/contracts-page.tsx
web/src/app/contracts/new/_components/create-contract-page.tsx
web/src/app/dashboard/page.tsx
web/src/widgets/app-sidebar/ui/app-sidebar.tsx
web/src/widgets/contracts-list/ui/contracts-list.tsx
web/src/widgets/dashboard-recent-contracts/ui/dashboard-recent-contracts.tsx
web/src/shared/api/http-client.ts
web/src/shared/api/handle-api-error.ts
web/src/shared/types/api.ts
```

Correcoes principais:

- `canOpenDispute` agora permite `GESTOR`, `FISCAL`, `AUDITOR`.
- `canSimulateFraud` agora permite `GESTOR`, `FISCAL`, `AUDITOR`.
- Disputa e fraude agora bloqueiam contratos em `PAGAMENTO_AUTORIZADO` e `DISPUTA`.
- `canRegisterOnChain` foi adicionado para restringir o botao a `GESTOR`.
- `canCreateContract` foi adicionado para restringir criacao a `GESTOR`.
- Sidebar, dashboard, lista de contratos e pagina de criacao passaram a respeitar `canCreateContract`.
- Descricoes de roles foram atualizadas para refletir as actions reais.
- `HttpClientError` passou a preservar `statusCode`.
- `getApiErrorMessage` passou a tratar `401` e `403` com mensagens visuais simples.

## 9. Pendencias

Pendencias classificadas:

```txt
P2: integrar JWT/wallet real no frontend na Sessao 02; hoje o modo API real ainda nao envia Authorization.
P2: validar regras com wallet vinculada em fluxo real; frontend ainda so valida role/status/documentHash visualmente.
P3: mapear UI futura para update/delete se essas actions forem expostas ao usuario.
P3: substituir ou remover componentes showcase nao roteados se deixarem de ser uteis.
P4: investigar web/package-lock.json marcado como modificado sem diff aparente.
```

## 10. Conclusao Tecnica

O backend foi mantido como fonte de verdade e nao teve regras de negocio alteradas.

O frontend foi ajustado de forma controlada para nao exibir actions criticas a perfis que o backend recusaria.

Estado final:

```txt
Roles alinhadas: sim
Actions protegidas mapeadas: sim
Divergencias principais corrigidas: sim
Modo mock preservado: sim
401/403 previstos visualmente: sim
```

Decisao tecnica:

```txt
APROVADO PARA SEGUIR PARA O BLOCO 07 - CORRECAO DE WALLETS MOCKADAS
```
