# Authorization Bearer no HTTP Client - Bloco 05

## 1. Resumo Executivo

O Bloco 05 adaptou o HTTP client central do frontend para autenticar requests protegidas com JWT.

O fluxo preparado agora e:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> auth store -> httpClient -> Authorization Bearer -> /auth/me
```

Foi implementado:

```txt
Authorization: Bearer <accessToken>
```

automaticamente em rotas protegidas quando:

```txt
NEXT_PUBLIC_USE_MOCKS=false
existe accessToken na auth store
a rota nao e publica
a request nao recebeu Authorization explicito
```

Nao foi implementado neste bloco:

```txt
/auth/me completo como fluxo de produto
substituicao do perfil demo
contracts/actions/audit reais
blockchain real
deploy
```

## 2. Arquivos Analisados

Frontend:

```txt
web/src/shared/api/http-client.ts
web/src/shared/api/handle-api-error.ts
web/src/shared/api/auth-api.ts
web/src/shared/api/index.ts
web/src/shared/types/api.ts
web/src/shared/config/env.ts
web/src/entities/auth/model/store.ts
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
web/src/shared/api/dashboard-api.ts
web/src/shared/api/contracts-api.ts
web/src/shared/api/blockchain-api.ts
```

Backend:

```txt
backend/app/routers/auth.py
backend/app/services/auth.py
backend/app/security.py
backend/app/errors.py
backend/app/main.py
backend/docker-compose.yml
```

Documentacao:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_05_authorization_bearer_http_client.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/auth_store_session.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_04_auth_store_session.md
```

## 3. Estrategia de HTTP Client

Foi reaproveitado o client central existente:

```txt
web/src/shared/api/http-client.ts
```

Nao foi criado segundo client.

O client continua centralizando:

```txt
baseURL
headers padrao
Content-Type
Accept
timeout
parse de response
HttpClientError
tratamento de erro de rede
```

E agora tambem centraliza:

```txt
decisao de rota publica/protegida
injecao automatica de Bearer
limpeza de sessao em 401 protegido
preservacao da sessao em 403
desligamento de Bearer em mock mode
```

## 4. Origem do AccessToken

Origem do token:

```txt
useAuthStore.getState().accessToken
```

Essa leitura e feita diretamente fora de React hook, usando a API segura do Zustand.

Nao foi usado:

```txt
React hook fora de componente
localStorage
token em arquivo
token em variavel global propria
```

## 5. Rotas Publicas

Rotas publicas configuradas no client:

```txt
GET /health
GET /auth/nonce
POST /auth/verify
```

Regra aplicada:

```txt
rotas publicas nao recebem Authorization automaticamente
rotas publicas removem Authorization caso algum caller tente enviar
```

Isso preserva o login inicial:

```txt
/auth/nonce sem token
/auth/verify sem token
```

## 6. Rotas Protegidas

As demais rotas sao tratadas como protegidas pelo client quando `NEXT_PUBLIC_USE_MOCKS=false`.

Exemplos:

```txt
GET /auth/me
GET /dashboard/summary
GET /contracts
POST /contracts
GET /contracts/{id}
PATCH /contracts/{id}
DELETE /contracts/{id}
GET /contracts/{id}/events
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
POST /contracts/{id}/open-dispute
POST /contracts/{id}/simulate-fraud
GET /contracts/{id}/blockchain-status
POST /contracts/{id}/register-on-chain
GET /audit/events
```

Neste bloco essas rotas de dominio nao foram integradas ao frontend real. O client apenas ficou pronto para autentica-las.

## 7. Implementacao do Authorization Bearer

Implementacao no client:

```txt
se mocks=false
e rota protegida
e nao ha Authorization explicito
e existe accessToken na auth store
entao adiciona Authorization: Bearer <accessToken>
```

`getCurrentProfile` foi ajustado para permitir:

```txt
getCurrentProfile()
```

usando o Bearer automatico do `httpClient`.

A assinatura antiga segue possivel:

```txt
getCurrentProfile(accessToken)
```

para manter compatibilidade ate o Bloco 06 organizar o uso oficial de `/auth/me`.

## 8. Tratamento de 401

Regra implementada:

```txt
401 em rota protegida -> clearSession()
401 em rota publica -> nao limpar sessao
```

Motivo:

- `/auth/verify` pode retornar 401 por nonce/assinatura invalida e isso nao deve derrubar uma sessao existente.
- `/auth/me` ou rota protegida com token invalido/expirado deve limpar a sessao.

Nao ha retry automatico.

## 9. Tratamento de 403

Regra implementada:

```txt
403 -> manter sessao
```

O erro segue como `HttpClientError`, permitindo que a camada de UI ou handler mostre:

```txt
Voce nao tem permissao para executar esta acao.
```

Nao ha logout automatico em 403.

## 10. Tratamento de Erros Gerais

O handler existente foi preservado:

```txt
web/src/shared/api/handle-api-error.ts
```

O `httpClient` continua gerando `HttpClientError` para:

```txt
400
401
403
404
409
422
500
network error
timeout
JSON invalido
```

Tambem foi ajustado o caso de response sem body em status nao OK, para nao tratar erro HTTP vazio como sucesso.

## 11. Seguranca e Logs

Cuidados aplicados:

- JWT completo nao foi logado.
- JWT completo nao foi exibido.
- JWT completo nao foi salvo em docs.
- JWT completo nao foi commitado.
- `.env` nao foi alterado.
- `localStorage` nao foi usado.
- Nao foi adicionado `console.log` permanente.
- Chaves privadas/signatures usadas em validacao local nao foram impressas.

Os testes locais imprimiram apenas booleanos, status HTTP e roles.

## 12. Preservacao do Mock Mode

Regra implementada:

```txt
NEXT_PUBLIC_USE_MOCKS=true -> nao enviar Bearer automatico
```

Mesmo se houver token na auth store ou Authorization explicito nos options, o client remove o header em mock mode.

Builds validados:

```txt
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_USE_MOCKS=false
```

Mock mode permanece sem exigir JWT.

## 13. Validacoes Executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=true npm run build` | OK. |
| `docker compose config` em `backend/` | OK. |
| `docker compose up -d --build` em `backend/` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| fluxo real ate `/auth/verify` | OK, JWT recebido sem imprimir token/signature/private key. |
| `GET /auth/me` com token valido no backend | OK, HTTP 200 com profile. |
| `GET /auth/me` sem token no backend | OK, HTTP 401 esperado. |
| `GET /auth/me` com token invalido no backend | OK, HTTP 401 esperado. |
| `GET /auth/me` com token valido via `httpClient` | OK, HTTP 200. |
| `GET /auth/me` sem token via `httpClient` | OK, HTTP 401 esperado. |
| `GET /auth/me` com token invalido via `httpClient` | OK, HTTP 401 esperado e sessao limpa. |
| rotas publicas sem Bearer no `httpClient` | OK, validado com fetch simulado. |
| 403 no `httpClient` | OK, validado com fetch simulado; sessao preservada. |
| `NEXT_PUBLIC_USE_MOCKS=true` sem Bearer | OK, validado com fetch simulado. |
| `git status` | Executado. |

Observacao:

O comportamento 403 foi validado no `httpClient` com fetch simulado para evitar iniciar fluxo de dominio de contratos/actions neste bloco.

## 14. Pendencias para Proximos Blocos

Pendencias esperadas:

- integrar `/auth/me` oficialmente no Bloco 06;
- carregar e validar profile real no ciclo de sessao;
- substituir perfil demo por perfil real no Bloco 07;
- integrar contratos reais no Bloco 08;
- integrar actions reais no Bloco 09;
- integrar timeline/auditoria no Bloco 10;
- tratar blockchain indisponivel no Bloco 11;
- executar teste ponta a ponta no Bloco 12.

## 15. Conclusao Tecnica

O Bloco 05 esta concluido tecnicamente.

O HTTP client agora usa o JWT da auth store para rotas protegidas, preserva `/auth/nonce` e `/auth/verify` como publicas, limpa sessao em 401 protegido, mantem sessao em 403 e respeita mock mode sem enviar Bearer.
