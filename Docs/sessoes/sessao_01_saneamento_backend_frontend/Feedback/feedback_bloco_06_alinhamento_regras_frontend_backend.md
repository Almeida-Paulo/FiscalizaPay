# Feedback - Bloco 06: Alinhamento de Regras Frontend/Backend

## 1. Resumo do que foi feito

Foi executado o Bloco 06 da Sessao 01, com foco em alinhar roles, permissoes e actions visuais do frontend com as regras reais do backend.

Resultado:

```txt
Frontend ajustado para refletir ACTION_ROLES do backend nas actions principais.
```

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/matriz_regras_frontend_backend.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_06_alinhamento_regras_frontend_backend.md
```

## 3. Arquivos alterados

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

Nenhum arquivo de backend foi alterado.

## 4. Roles analisadas

Backend e frontend usam as mesmas roles:

```txt
GESTOR
FORNECEDOR
ENTREGADOR
FISCAL
AUDITOR
```

Padrao oficial:

```txt
Uppercase em portugues, conforme backend.
```

## 5. Actions analisadas

Actions backend:

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

Actions frontend:

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

Leituras protegidas analisadas:

```txt
dashboard
contracts
contract events
blockchain status
audit events
auth/me
```

## 6. Correcoes realizadas

Correcoes no frontend:

- `openDispute` passou a ser exibido para `GESTOR`, `FISCAL`, `AUDITOR`.
- `openDispute` deixou de ser exibido para `FORNECEDOR` e `ENTREGADOR`.
- `simulateFraud` passou a ser exibido tambem para `AUDITOR`.
- Disputa e fraude passaram a bloquear status `DISPUTA`, alem de `PAGAMENTO_AUTORIZADO`.
- `registerOnChain` passou a ser exibido apenas para `GESTOR`.
- `Novo contrato` e formulario de criacao passaram a ser visiveis/acionaveis apenas para `GESTOR`.
- Descricoes de roles foram ajustadas para refletir as permissoes reais.
- `401` e `403` receberam mensagens visuais simples no handler de erros.

## 7. Validacoes executadas

Frontend:

```txt
npm.cmd run lint -> sucesso
npm.cmd run build -> sucesso
http://localhost:3000 -> HTTP 200
```

Backend/Docker:

```txt
docker compose config -> sucesso
docker compose up -d --build -> sucesso
GET http://127.0.0.1:8000/health -> HTTP 200
docker compose ps -> api Up, db Up/healthy
logs recentes da API -> sem ERROR/CRITICAL/Traceback/FATAL
```

Auth/permissao:

```txt
GET /contracts sem token -> HTTP 401
POST /contracts com token FORNECEDOR -> HTTP 403
```

Corpo observado no 401:

```json
{"message":"Autenticação obrigatória.","code":"UNAUTHORIZED_ROLE"}
```

Corpo observado no 403:

```json
{"message":"Seu perfil não tem permissão para executar esta ação.","code":"UNAUTHORIZED_ROLE","details":{"requiredRoles":["GESTOR"],"currentRole":"FORNECEDOR"}}
```

Testes automatizados:

```txt
npm test: nao executado; nao existe script test em web/package.json.
pytest: nao executado; nao ha pytest/configuracao de testes backend identificada.
```

`npm run dev`:

```txt
Nao foi iniciado como novo processo porque ja havia Next deste projeto respondendo em http://localhost:3000.
Validacao equivalente: HTTP 200 no frontend local.
```

## 8. Pendencias classificadas

```txt
P2: implementar JWT/wallet real no frontend na Sessao 02.
P2: validar wallet vinculada em fluxo real; hoje a UI so antecipa role/status/documentHash.
P3: mapear update/delete caso essas actions sejam expostas na UI.
P3: validar no navegador real durante a integracao com API real e token.
P4: investigar web/package-lock.json marcado como modificado sem diff aparente.
```

## 9. Commit realizado

Commit realizado neste bloco:

```txt
chore: alinha regras de permissao entre frontend e backend
```

Arquivos previstos no commit:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/matriz_regras_frontend_backend.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_06_alinhamento_regras_frontend_backend.md
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

## 10. Observacoes para o proximo bloco

O projeto esta pronto para o Bloco 07.

Foco recomendado:

```txt
Corrigir wallets mockadas invalidas e garantir compatibilidade com validacoes EVM do backend.
```

Nao foram implementados login real, JWT no frontend, assinatura de nonce, deploy, blockchain real ou remocao de mocks.
