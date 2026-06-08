# Feedback - Bloco 05: Authorization Bearer no HTTP Client

## 1. Resumo do que foi feito

Foi implementada a injecao automatica de:

```txt
Authorization: Bearer <accessToken>
```

no HTTP client central do frontend.

O token vem da Auth Store criada no Bloco 04:

```txt
useAuthStore.getState().accessToken
```

O client agora preserva rotas publicas, autentica rotas protegidas, limpa sessao em 401 protegido e preserva sessao em 403.

Nao foram iniciados:

```txt
/auth/me completo
profile real na UI
contracts/actions/audit
blockchain
deploy
unificacao dos perfis demo
```

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/authorization_bearer_http_client.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_05_authorization_bearer_http_client.md
```

## 3. Arquivos alterados

```txt
web/src/shared/api/http-client.ts
web/src/shared/api/auth-api.ts
```

## 4. Estrategia de HTTP client

Foi adaptado o client existente:

```txt
web/src/shared/api/http-client.ts
```

Nao foi criado outro client.

O client centraliza:

```txt
baseURL
headers padrao
Content-Type
Accept
timeout
parse de response
HttpClientError
Authorization Bearer
tratamento de 401/403
```

## 5. Origem do accessToken

Origem:

```txt
useAuthStore.getState().accessToken
```

Esse acesso usa a API do Zustand e nao chama hook React fora de componente.

Persistencia continua sendo a do Bloco 04:

```txt
sessionStorage
fiscalizapay.auth.session
```

## 6. Rotas publicas e protegidas

Rotas publicas configuradas:

```txt
/health
/auth/nonce
/auth/verify
```

Essas rotas nao recebem Bearer.

Rotas protegidas preparadas:

```txt
/auth/me
/dashboard/summary
/contracts
/contracts/{id}
/contracts/{id}/events
/contracts/{id}/confirm-shipment
/contracts/{id}/confirm-delivery
/contracts/{id}/validate-receipt
/contracts/{id}/authorize-payment
/contracts/{id}/open-dispute
/contracts/{id}/simulate-fraud
/contracts/{id}/blockchain-status
/contracts/{id}/register-on-chain
/audit/events
```

As rotas de dominio nao foram integradas neste bloco; apenas ficaram prontas para usar Bearer quando chamadas.

## 7. Authorization Bearer implementado

Regra implementada:

```txt
se NEXT_PUBLIC_USE_MOCKS=false
e a rota nao e publica
e existe accessToken
entao Authorization: Bearer <accessToken>
```

Se a chamada ja trouxer Authorization explicitamente, o client respeita esse header em modo real.

Se `NEXT_PUBLIC_USE_MOCKS=true`, o client remove Authorization para preservar o fluxo mock.

`getCurrentProfile` agora pode ser chamado sem parametro:

```txt
getCurrentProfile()
```

Nesse caso o Bearer vem automaticamente do `httpClient`.

## 8. Tratamento de 401

Implementado:

```txt
401 em rota protegida -> clearSession()
```

Nao ha retry automatico.

401 em rota publica, como `/auth/verify`, nao limpa sessao automaticamente.

## 9. Tratamento de 403

Implementado:

```txt
403 -> manter sessao
```

O erro continua sendo propagado como `HttpClientError`, para a UI exibir permissao negada quando o fluxo de tela for conectado.

## 10. Seguranca e logs

Cuidados aplicados:

- JWT completo nao foi logado.
- JWT completo nao foi exibido.
- JWT completo nao foi salvo no feedback.
- JWT completo nao foi salvo em arquivo.
- `.env` nao foi alterado.
- `localStorage` nao foi usado.
- `npm audit fix --force` nao foi executado.
- Nenhum `console.log` permanente sensivel foi adicionado.
- Nenhuma private key, seed phrase ou mnemonic foi salva.

## 11. Preservacao do mock mode

Validado:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

continua sem exigir JWT e sem enviar Bearer.

Validado:

```txt
NEXT_PUBLIC_USE_MOCKS=false
```

usa Bearer quando ha token na auth store.

Nao houve fallback silencioso para mock quando mocks=false.

## 12. Validacoes executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=true npm run build` | OK. |
| `docker compose config` em `backend/` | OK. |
| `docker compose up -d --build` em `backend/` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| fluxo real ate `/auth/verify` | OK, JWT recebido sem expor token. |
| `GET /auth/me` com token valido via backend | OK, HTTP 200. |
| `GET /auth/me` sem token via backend | OK, HTTP 401 esperado. |
| `GET /auth/me` com token invalido via backend | OK, HTTP 401 esperado. |
| `GET /auth/me` com token valido via `httpClient` | OK, HTTP 200. |
| `GET /auth/me` sem token via `httpClient` | OK, HTTP 401 esperado. |
| `GET /auth/me` com token invalido via `httpClient` | OK, HTTP 401 esperado e sessao limpa. |
| `/auth/nonce` sem Bearer no `httpClient` | OK. |
| `/auth/verify` sem Bearer no `httpClient` | OK. |
| 403 no `httpClient` | OK, sessao preservada em teste simulado. |
| `NEXT_PUBLIC_USE_MOCKS=true` sem Bearer | OK. |
| `git status` | Executado. |

Resultado seguro do teste real via `httpClient`:

```txt
authMeViaHttpClientStatus=200
authMeViaHttpClientRole=GESTOR
authMeMissingTokenStatus=401
authMeInvalidTokenStatus=401
invalidTokenClearedSession=true
```

## 13. Pendencias encontradas

Pendencias esperadas:

- integrar `/auth/me` oficialmente no Bloco 06;
- carregar profile real na sessao apos login/hydrate;
- substituir perfil demo em modo API real no Bloco 07;
- integrar contratos reais apenas no Bloco 08;
- integrar actions reais apenas no Bloco 09;
- validar 403 real de dominio quando contratos/actions forem integrados.

## 14. Commit realizado

Commit semantico realizado:

```txt
feat: adicionar authorization bearer no http client
```

## 15. Observacoes para o proximo bloco

O Bloco 06 deve usar o `httpClient` ja autenticado para chamar:

```txt
GET /auth/me
```

e transformar o profile retornado pelo backend na fonte real de sessao/permissao do frontend.
