# Feedback - Bloco 03: Verify + JWT

## 1. Resumo do que foi feito

Foi conectado o fluxo de assinatura do Bloco 02 ao endpoint real:

```txt
POST /auth/verify
```

O frontend agora envia `walletAddress`, `nonce` e `signature`, recebe `accessToken`, `tokenType`, `expiresAt` e `profile`, e guarda esses dados apenas em estado temporario do hook.

Nao foi implementada persistencia definitiva do JWT, Auth Store/Session, Bearer global, `/auth/me` completo, contracts, actions, audit, blockchain ou deploy.

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/verify_jwt.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_03_verify_jwt.md
```

## 3. Arquivos alterados

```txt
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
web/src/features/auth-wallet/ui/wallet-signature-button.tsx
```

## 4. Contrato do /auth/verify

Endpoint real:

```http
POST /auth/verify
Content-Type: application/json
```

Fonte de verdade:

```txt
backend/app/routers/auth.py
backend/app/schemas.py
backend/app/services/auth.py
```

## 5. Payload enviado

Payload correto:

```json
{
  "walletAddress": "0x...",
  "nonce": "nonce-retornado",
  "signature": "0x..."
}
```

Nao e enviado:

```txt
message
wallet_address
role
```

## 6. Response recebida

Response esperada e validada:

```txt
data.accessToken
data.tokenType
data.expiresAt
data.profile
```

Validacao local com assinatura valida retornou HTTP 200 e confirmou os campos acima sem imprimir token/signature.

## 7. JWT recebido

O JWT e recebido em `verifyData.accessToken`, mas neste bloco:

- nao e persistido definitivamente;
- nao e salvo em storage;
- nao e injetado no `httpClient`;
- nao e exibido completo;
- nao e logado.

## 8. Tratamento de erros

Foram tratados:

```txt
payload invalido
nonce invalido
nonce expirado
nonce ja utilizado
assinatura invalida
assinatura nao corresponde a wallet
wallet sem perfil cadastrado
backend indisponivel
response sem accessToken
erro inesperado
```

Validados por HTTP:

```txt
payload invalido -> HTTP 400
assinatura invalida -> HTTP 401
```

## 9. Seguranca e logs

Cuidados aplicados:

- Sem `console.log` sensivel.
- Sem token completo em UI.
- Sem token/signature/private key em documentacao.
- Sem alteracao de `.env`.
- Sem persistencia definitiva de JWT.

## 10. Preservacao do mock mode

Mock mode preservado:

- `NEXT_PUBLIC_USE_MOCKS=true` continua usando wallet demo.
- `NEXT_PUBLIC_USE_MOCKS=false` usa wallet real, nonce, assinatura e verify real.
- Nao houve fallback silencioso para mock.
- Perfis demo nao foram unificados.
- Contracts/actions/audit nao foram alterados.

## 11. Validacoes executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `docker compose config` | OK. |
| `docker compose up -d --build` | OK. |
| `GET /health` | OK, HTTP 200. |
| `GET /auth/nonce` | OK, HTTP 200 com campos obrigatorios. |
| `POST /auth/verify` com assinatura valida | OK, HTTP 200; campos obrigatorios confirmados sem imprimir segredos. |
| `POST /auth/verify` com payload invalido | OK, HTTP 400 controlado. |
| `POST /auth/verify` com assinatura invalida | OK, HTTP 401 controlado. |
| `GET http://localhost:3000` | OK, HTTP 200. |
| `git status` | Executado. |
| Assinatura no navegador com wallet real | Nao executado; requer MetaMask/wallet interativa. |

## 12. Pendencias encontradas

- Validar manualmente o fluxo com MetaMask/wallet real no navegador.
- Implementar Auth Store/Session definitiva no Bloco 04.
- Persistir JWT conforme estrategia do Bloco 04.
- Implementar Bearer global no Bloco 05.
- Integrar `/auth/me` completo no Bloco 06.
- Manter contracts/actions/audit bloqueados ate auth real estar completo.

## 13. Commit realizado

Commit semantico realizado:

```txt
feat: validar assinatura e receber jwt no frontend
```

## 14. Observacoes para o proximo bloco

O proximo bloco deve criar a Auth Store/Session definitiva, decidir a persistencia do token e preparar logout/expiracao. O fluxo alvo continua:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```
