# Feedback - Bloco 01: Auth API no Frontend

## 1. Resumo do que foi feito

Foi criado o Bloco 01 da Sessao 02 - Integracao Backend + Frontend, com foco exclusivo na camada Auth API do frontend.

Foram criadas as funcoes e tipagens para consumir os endpoints reais do backend:

```txt
GET /auth/nonce
POST /auth/verify
GET /auth/me
```

Nao foi implementada store completa, assinatura real com wallet, login visual, contratos, actions, audit, blockchain ou deploy.

## 2. Arquivos criados

```txt
web/src/shared/api/auth-api.ts
Docs/sessoes/sessao_02_integrar_back_e_front/analises/contrato_auth_api_frontend.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_01_auth_api_frontend.md
```

## 3. Arquivos alterados

```txt
web/src/shared/api/index.ts
web/src/shared/api/handle-api-error.ts
```

## 4. Endpoints mapeados

| Endpoint | Metodo | Funcao frontend |
|---|---|---|
| `/auth/nonce` | GET | `getAuthNonce(walletAddress)` |
| `/auth/verify` | POST | `verifyWalletSignature(payload)` |
| `/auth/me` | GET | `getCurrentProfile(accessToken)` |

## 5. Tipagens criadas

```txt
AuthProfile
AuthNonceData
AuthNonceResponse
VerifyWalletSignatureRequest
VerifyWalletSignatureData
VerifyWalletSignatureResponse
AuthMeResponse
AuthSession
```

## 6. Funcoes criadas

```txt
getAuthNonce(walletAddress)
verifyWalletSignature(payload)
getCurrentProfile(accessToken)
toAuthSession(data)
```

As funcoes usam o `httpClient`, que ja resolve `NEXT_PUBLIC_API_BASE_URL` via `env.apiBaseUrl`.

## 7. Tratamento de erros

`web/src/shared/api/handle-api-error.ts` foi ajustado para mensagens mais claras em:

```txt
400 / 422 - dados invalidos
401 - sessao invalida
403 - carteira sem perfil ou permissao negada
5xx - erro interno no servidor
network error - mantido via HttpClientError do httpClient
```

## 8. Preservacao do mock mode

Mock mode preservado:

- Nenhum contrato/action/audit foi alterado.
- Nenhuma UI passou a exigir auth real.
- `NEXT_PUBLIC_USE_MOCKS=true` continua funcionando.
- `NEXT_PUBLIC_USE_MOCKS=false` nao recebeu fallback silencioso para mock.

## 9. Validacoes executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `docker compose config` | OK. |
| `docker compose up -d --build` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| `GET /auth/nonce?walletAddress=0x1111111111111111111111111111111111111111` | OK, HTTP 200. |
| `GET /auth/me` sem Bearer | OK, HTTP 401 esperado. |
| `git status` | Executado; pendencias antigas nao relacionadas ficaram fora do commit. |

## 10. Pendencias encontradas

- Conectar assinatura real via `wagmi`/`viem`.
- Criar Auth Store/Session com Zustand + `sessionStorage`.
- Persistir JWT e perfil autenticado.
- Validar `/auth/me` com Bearer real.
- Implementar injecao central de Authorization Bearer.
- Manter contracts/actions/audit bloqueados ate auth real funcionar.
- Vulnerabilidades moderadas do `npm audit` seguem migradas para etapa futura; nenhum `audit fix --force` foi executado.

## 11. Commit realizado

Commit semantico deste bloco:

```txt
feat: criar camada auth api para integracao com backend
```

## 12. Observacoes para o proximo bloco

O proximo bloco deve conectar a assinatura real da mensagem retornada por `/auth/nonce`, usando `wagmi`/`viem` e assinando exatamente o campo `data.message`.

O fluxo alvo continua:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```
