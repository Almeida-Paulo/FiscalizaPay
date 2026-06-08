# Contrato Auth API Frontend - Bloco 01

## 1. Resumo Executivo

O Bloco 01 da Sessao 02 criou a camada base de Auth API no frontend para consumir os endpoints reais do backend FastAPI:

```txt
GET /auth/nonce
POST /auth/verify
GET /auth/me
```

O fluxo completo ainda nao foi conectado a UI, wallet real, store de sessao ou contratos. Este bloco preparou funcoes, tipagens, exportacoes e tratamento de erro para que os proximos blocos implementem:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```

## 2. Arquivos Analisados

Frontend:

```txt
web/src/shared/api/http-client.ts
web/src/shared/api/handle-api-error.ts
web/src/shared/types/api.ts
web/src/shared/api/index.ts
web/src/shared/config/env.ts
web/src/entities/profile/model/types.ts
web/src/entities/profile/model/store.ts
web/src/entities/wallet/model/store.ts
web/package.json
```

Backend:

```txt
backend/app/routers/auth.py
backend/app/schemas.py
backend/app/security.py
```

Documentacao de transicao:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/pendencias_pre_sessao_02.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/relatorio_prontidao_integracao.md
```

## 3. Endpoints de Auth Identificados

| Endpoint | Metodo | Protegido por Bearer | Funcao frontend criada |
|---|---|---|---|
| `/auth/nonce` | GET | Nao | `getAuthNonce(walletAddress)` |
| `/auth/verify` | POST | Nao | `verifyWalletSignature(payload)` |
| `/auth/me` | GET | Sim | `getCurrentProfile(accessToken)` |

Fonte de verdade: `backend/app/routers/auth.py`.

## 4. Contrato do GET /auth/nonce

Chamada:

```http
GET /auth/nonce?walletAddress=<wallet EVM>
```

Parametro:

| Campo | Origem | Regra |
|---|---|---|
| `walletAddress` | Query string | 42 caracteres, prefixo `0x`, formato `0x` + 40 hex. |

Resposta:

```json
{
  "data": {
    "walletAddress": "0x1111111111111111111111111111111111111111",
    "nonce": "hexadecimal",
    "message": "FiscalizaPay Web3\\n\\nAssine esta mensagem...",
    "expiresAt": "2026-06-08T04:03:17.955Z"
  }
}
```

Implementacao frontend:

```ts
getAuthNonce(walletAddress: string): Promise<AuthNonceResponse>
```

Observacao: o frontend faz validacao leve de formato antes da chamada; o backend continua sendo a fonte definitiva via `normalize_wallet`.

## 5. Contrato do POST /auth/verify

Chamada:

```http
POST /auth/verify
Content-Type: application/json
```

Payload:

```json
{
  "walletAddress": "0x1111111111111111111111111111111111111111",
  "nonce": "nonce-retornado",
  "signature": "0x..."
}
```

Resposta:

```json
{
  "data": {
    "accessToken": "jwt",
    "tokenType": "bearer",
    "expiresAt": "2026-06-08T04:31:00.000Z",
    "profile": {
      "id": "uuid",
      "name": "Maria Santos",
      "role": "GESTOR",
      "walletAddress": "0x1111111111111111111111111111111111111111",
      "createdAt": "iso",
      "updatedAt": "iso"
    }
  },
  "message": "Wallet autenticada com sucesso."
}
```

Implementacao frontend:

```ts
verifyWalletSignature(payload: VerifyWalletSignatureRequest): Promise<VerifyWalletSignatureResponse>
```

Erros esperados no backend:

```txt
401 - nonce invalido ou ja utilizado
401 - nonce expirado
401 - assinatura invalida ou assinatura nao corresponde a wallet
403 - wallet autenticada, mas sem perfil cadastrado
```

## 6. Contrato do GET /auth/me

Chamada:

```http
GET /auth/me
Authorization: Bearer <accessToken>
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Maria Santos",
    "role": "GESTOR",
    "walletAddress": "0x1111111111111111111111111111111111111111",
    "createdAt": "iso",
    "updatedAt": "iso"
  }
}
```

Implementacao frontend:

```ts
getCurrentProfile(accessToken: string): Promise<AuthMeResponse>
```

Decisao deste bloco: a funcao recebe `accessToken` explicitamente. A injecao global de Bearer no `httpClient` fica para o bloco especifico de Authorization Bearer/Auth Store.

## 7. Tipagens Criadas

Arquivo:

```txt
web/src/shared/api/auth-api.ts
```

Tipos criados:

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

Tambem foi criado o helper:

```txt
toAuthSession(data)
```

Ele converte a resposta de `/auth/verify` em um formato pronto para futura store de sessao, sem implementar a store neste bloco.

## 8. Tratamento de Erros

Arquivo ajustado:

```txt
web/src/shared/api/handle-api-error.ts
```

Melhorias:

- Mensagem generica corrigida para ASCII legivel.
- `400`/`422`: retorna mensagem da API ou texto de dados invalidos.
- `401`: "Sessao invalida. Faca login novamente."
- `403` com wallet sem perfil: "Carteira autenticada, mas sem perfil cadastrado."
- `403` generico: permissao negada.
- `5xx`: erro interno no servidor.
- Falhas de rede continuam vindo do `httpClient` como `HttpClientError`.

## 9. Estrategia de Sessao Planejada

Nao implementada neste bloco.

Planejamento herdado do Bloco Extra:

```txt
Zustand + sessionStorage
accessToken
expiresAt
profile
walletAddress
role
isAuthenticated
logout
limpeza em 401/token expirado
```

O tipo `AuthSession` foi criado para servir como base da futura store.

## 10. Estrategia de Authorization Bearer Planejada

Neste bloco:

- `/auth/nonce` e `/auth/verify` permanecem publicos.
- `/auth/me` ja aceita Bearer via `getCurrentProfile(accessToken)`.
- O `httpClient` nao recebeu injecao global de token.

Proximo passo:

- Criar store de auth.
- Definir helper central de leitura de token.
- Injetar Bearer em chamadas protegidas.
- Preservar requests publicas sem Bearer.

## 11. Preservacao do Mock Mode

O mock mode foi preservado.

Pontos confirmados:

- `web/src/shared/config/env.ts` continua usando `NEXT_PUBLIC_USE_MOCKS` e `NEXT_PUBLIC_ENABLE_MOCKS`.
- Nenhuma rota de contracts/actions/audit foi alterada.
- Nenhuma UI passou a exigir auth real neste bloco.
- `NEXT_PUBLIC_USE_MOCKS=true` continua compilando e funcionando sem auth.
- `NEXT_PUBLIC_USE_MOCKS=false` ainda depende dos proximos blocos para Bearer/store; nao houve fallback silencioso para mock.

## 12. Validacoes Executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK, ESLint sem erros. |
| `npm run build` | OK, Next build e TypeScript passaram. |
| `docker compose config` | OK. |
| `docker compose up -d --build` | OK, API e banco iniciados. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| `GET /auth/nonce?walletAddress=0x1111111111111111111111111111111111111111` | OK, HTTP 200 com `walletAddress`, `nonce`, `message`, `expiresAt`. |
| `GET /auth/me` sem Bearer | OK, HTTP 401 esperado. |
| `git status` | Executado; arquivos antigos nao rastreados permanecem fora do escopo. |

`npm audit fix --force` nao foi executado. As vulnerabilidades moderadas ja foram migradas para etapa futura.

## 13. Pendencias para Proximos Blocos

- Implementar assinatura real com wallet usando `wagmi`/`viem`, assinando exatamente `data.message`.
- Criar store de auth/sessao com Zustand + `sessionStorage`.
- Conectar login/logout na UI.
- Validar `/auth/me` com token real.
- Implementar injecao central de Authorization Bearer.
- So depois iniciar integracao real de dashboard/contracts/actions/audit.

## 14. Conclusao Tecnica

O Bloco 01 esta tecnicamente concluido. A camada `auth-api` foi criada com tipagens e funcoes para os tres endpoints reais de autenticacao, sem iniciar escopo de contratos, actions, audit ou blockchain.

Proximo bloco recomendado: assinatura real de mensagem com wallet ou Auth Store/Session, conforme a ordem definida no planejamento da Sessao 02.
