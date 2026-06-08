# Verify + JWT - Bloco 03

## 1. Resumo Executivo

O Bloco 03 conectou o fluxo de assinatura do Bloco 02 ao endpoint real:

```txt
POST /auth/verify
```

O frontend agora consegue enviar `walletAddress`, `nonce` e `signature`, receber `accessToken`, `tokenType`, `expiresAt` e `profile`, e manter esses dados apenas em estado temporario do hook de autenticacao por wallet.

Nao foi criada persistencia definitiva de JWT, store de sessao, Authorization Bearer global, `/auth/me` completo, contratos, actions, audit, blockchain ou deploy.

## 2. Arquivos Analisados

Frontend:

```txt
web/src/shared/api/auth-api.ts
web/src/shared/api/http-client.ts
web/src/shared/api/handle-api-error.ts
web/src/shared/types/api.ts
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
web/src/features/auth-wallet/ui/wallet-signature-button.tsx
web/src/features/wallet-connect/ui/wallet-connect-button.tsx
web/package.json
```

Backend:

```txt
backend/app/routers/auth.py
backend/app/schemas.py
backend/app/security.py
backend/app/services/auth.py
backend/scripts/create_profile.py
```

## 3. Contrato Real do /auth/verify

Endpoint:

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

O backend valida:

- formato EVM de `walletAddress`;
- existencia e validade do `nonce`;
- assinatura EVM da mensagem original associada ao nonce;
- existencia de perfil cadastrado para a wallet;
- marca o nonce como utilizado;
- emite JWT com `sub`, `walletAddress`, `role` e `exp`.

## 4. Payload Enviado

Payload implementado no frontend:

```json
{
  "walletAddress": "0x1111111111111111111111111111111111111111",
  "nonce": "nonce-retornado",
  "signature": "0x..."
}
```

Importante:

- `message` nao e enviado para `/auth/verify`.
- `wallet_address` nao e usado; o campo correto e `walletAddress`.
- A assinatura vem da mensagem retornada por `/auth/nonce`.

Implementacao:

```txt
verifyWalletSignature({
  walletAddress: signed.walletAddress,
  nonce: signed.nonce,
  signature: signed.signature,
})
```

## 5. Response de Sucesso

Resposta esperada:

```json
{
  "data": {
    "accessToken": "jwt",
    "tokenType": "bearer",
    "expiresAt": "iso",
    "profile": {
      "id": "uuid",
      "name": "Maria Santos",
      "role": "GESTOR",
      "walletAddress": "0x...",
      "createdAt": "iso",
      "updatedAt": "iso"
    }
  },
  "message": "Wallet autenticada com sucesso."
}
```

Validacao local com assinatura valida retornou:

```txt
StatusCode=200
hasAccessToken=True
tokenType=bearer
hasExpiresAt=True
profileRole=GESTOR
profileWalletMatches=True
```

Nenhum token, signature ou chave privada foi impresso.

## 6. Responses de Erro

Erros esperados:

| Status | Cenario | Tratamento frontend |
|---|---|---|
| 400/422 | Payload ou wallet invalida | Mensagem de payload/dados invalidos. |
| 401 | Nonce invalido ou ja utilizado | Solicitar nova assinatura. |
| 401 | Nonce expirado | Solicitar nova assinatura. |
| 401 | Assinatura invalida ou divergente da wallet | Repetir assinatura. |
| 403 | Wallet autenticada sem perfil cadastrado | Informar carteira sem perfil. |
| 5xx | Erro interno/backend indisponivel | Erro controlado via `httpClient`/handler. |

Validacoes locais:

```txt
POST /auth/verify com payload invalido -> HTTP 400
POST /auth/verify com assinatura invalida -> HTTP 401
```

## 7. JWT Recebido

O JWT e recebido em:

```txt
verifyResponse.data.accessToken
```

No Bloco 03:

- o token fica apenas em estado temporario (`verifyData`);
- o token nao e salvo em `localStorage`;
- o token nao e salvo em `sessionStorage`;
- o token nao e injetado globalmente no `httpClient`;
- o token nao e impresso no console;
- o token nao e exibido completo na UI.

UI exibe apenas:

- confirmacao `JWT recebido`;
- nome/role do profile;
- `expiresAt`.

## 8. Estado Temporario Utilizado

Estado adicionado ao hook:

```txt
verifyData
verifyError
isVerifying
```

Funcoes adicionadas:

```txt
verifySignedNonce(signed)
signAndVerifyNonceMessage()
```

Tipos adicionados:

```txt
WalletVerifyResult
```

O estado temporario atual contempla:

```txt
walletAddress
nonce
message
signature
accessToken
tokenType
expiresAt
profile
isVerifying
verifyError
```

## 9. Tratamento de Erros

Funcao nova:

```txt
mapVerifyError(error)
```

Casos tratados:

- payload invalido;
- nonce invalido;
- nonce expirado;
- nonce ja utilizado;
- assinatura invalida;
- assinatura divergente da wallet;
- wallet sem perfil cadastrado;
- backend indisponivel;
- response sem `accessToken`;
- erro inesperado.

## 10. Seguranca e Logs

Cuidados aplicados:

- JWT completo nao e exibido.
- JWT completo nao e logado.
- Signature nao e salva em documentacao.
- Chave privada usada em validacao local nao foi impressa.
- Token real nao foi commitado.
- `.env` real nao foi alterado.
- Nenhum segredo, private key, seed phrase ou mnemonic foi salvo.
- Nao ha `console.log` sensivel permanente.

## 11. Preservacao do Mock Mode

Mock mode preservado:

- `NEXT_PUBLIC_USE_MOCKS=true` continua usando a wallet demo existente.
- `NEXT_PUBLIC_USE_MOCKS=false` usa o fluxo real de wallet + nonce + assinatura + verify.
- Nao ha fallback silencioso para mock quando mocks estao desligados.
- Perfis demo nao foram unificados.
- Nenhum contrato/action/audit foi integrado.

## 12. Validacoes Executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `docker compose config` | OK. |
| `docker compose up -d --build` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| `GET /auth/nonce?walletAddress=0x1111111111111111111111111111111111111111` | OK, HTTP 200 com campos obrigatorios. |
| `POST /auth/verify` com assinatura valida | OK, HTTP 200; token/profile confirmados sem imprimir valores sensiveis. |
| `POST /auth/verify` com payload invalido | OK, HTTP 400 controlado. |
| `POST /auth/verify` com assinatura invalida | OK, HTTP 401 controlado. |
| `GET http://localhost:3000` | OK, HTTP 200. |
| `git status` | Executado; pendencias antigas nao rastreadas permaneceram fora do escopo. |
| Assinar `data.message` no navegador | Nao executado; requer wallet/MetaMask interativa no navegador. |

Observacao sobre validacao valida:

- Foi usada uma wallet efemera gerada no container para teste local.
- Um perfil `GESTOR` temporario foi criado/atualizado no banco local de desenvolvimento para permitir o verify real.
- Chave privada, signature e JWT nao foram exibidos.

## 13. Pendencias para Proximos Blocos

- Validar manualmente o fluxo interativo no navegador com MetaMask/wallet real.
- Implementar Auth Store/Session definitiva no Bloco 04.
- Definir persistencia segura do JWT em `sessionStorage` ou estrategia equivalente no Bloco 04.
- Implementar Authorization Bearer global no Bloco 05.
- Validar `/auth/me` completo no Bloco 06.
- Substituir perfil demo em modo API real apenas no bloco planejado.
- Manter contracts/actions/audit bloqueados ate auth + bearer + `/auth/me` estarem funcionando.

## 14. Conclusao Tecnica

O Bloco 03 esta concluido tecnicamente. O frontend envia exatamente `walletAddress`, `nonce` e `signature` para `/auth/verify`, recebe JWT e profile em estado temporario e trata erros principais sem expor dados sensiveis.

O proximo passo e o Bloco 04 - Auth Store/Session.
