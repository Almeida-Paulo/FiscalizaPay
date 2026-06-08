# Feedback - Bloco 02: Wallet Real + Assinatura

## 1. Resumo do que foi feito

Foi implementado o fluxo base de wallet real + assinatura de nonce no frontend.

O fluxo agora preparado e:

```txt
wallet real -> /auth/nonce -> data.message -> assinatura via wallet -> signature capturada
```

Nao foi implementado `/auth/verify`, JWT, store definitiva, Bearer global, contratos, actions, audit, blockchain ou deploy.

## 2. Arquivos criados

```txt
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
web/src/features/auth-wallet/ui/wallet-signature-button.tsx
web/src/features/auth-wallet/index.ts
Docs/sessoes/sessao_02_integrar_back_e_front/analises/wallet_real_assinatura.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_02_wallet_real_assinatura.md
```

## 3. Arquivos alterados

```txt
web/src/features/wallet-connect/ui/wallet-connect-button.tsx
```

Alteracao:

- Em `env.useMocks=true`, mantem wallet demo existente.
- Em `env.useMocks=false`, usa o novo `WalletSignatureButton` com wallet real.

## 4. Stack de wallet utilizada

Stack ja existente:

```txt
wagmi
viem
@rainbow-me/rainbowkit
```

Hooks usados:

```txt
useAccount
useConnect
useDisconnect
useSignMessage
```

Nenhuma dependencia foi instalada.

## 5. Fluxo implementado

1. Conecta wallet real via wagmi.
2. Le `address` e `chainId`.
3. Confere rede esperada (`NEXT_PUBLIC_CHAIN_ID`, fallback 80002).
4. Solicita nonce com `getAuthNonce(walletAddress)`.
5. Recebe `data.nonce`, `data.message`, `data.expiresAt`.
6. Assina exatamente `data.message` com `useSignMessage`.
7. Captura `signature`.
8. Exibe estado temporario no dropdown da wallet real.

## 6. Nonce solicitado

Contrato usado:

```http
GET /auth/nonce?walletAddress=<wallet EVM>
```

Validacao executada:

```txt
GET /auth/nonce?walletAddress=0x1111111111111111111111111111111111111111 -> HTTP 200
```

Resposta confirmou:

```txt
walletAddress
nonce
message
expiresAt
```

## 7. Mensagem assinada

Regra implementada:

```txt
signMessageAsync({ message: nonceResponse.data.message })
```

Nao ha montagem manual da mensagem no frontend.

## 8. Signature capturada

A signature retornada por `signMessageAsync` e armazenada no estado temporario do hook e exibida no dropdown como hash encurtado.

Validacao interativa da assinatura real ainda precisa ser feita no navegador com MetaMask/wallet EVM.

## 9. Tratamento de erros

Foram tratados:

```txt
wallet nao instalada
nenhum conector disponivel
wallet desconectada
conexao recusada pelo usuario
assinatura recusada pelo usuario
walletAddress invalido
erro ao solicitar nonce
backend indisponivel
data.message ausente
rede incorreta
erro inesperado
```

## 10. Preservacao do mock mode

Mock mode preservado:

- `NEXT_PUBLIC_USE_MOCKS=true` continua usando wallet demo.
- `NEXT_PUBLIC_USE_MOCKS=false` usa wallet real e `/auth/nonce`.
- Perfis demo nao foram unificados.
- Nenhum contrato/action/audit foi alterado.
- Nao ha fallback silencioso para mock quando mocks estao desligados.

## 11. Validacoes executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `docker compose config` | OK. |
| `docker compose up -d --build` | OK. |
| `GET /health` | OK, HTTP 200. |
| `GET /auth/nonce` com wallet demo valida | OK, HTTP 200. |
| `GET http://localhost:3000` | OK, HTTP 200. |
| `git status` | Executado. |
| Teste de conexao wallet no navegador | Nao executado: exige wallet/MetaMask interativa. |
| Teste de assinatura no navegador | Nao executado: exige wallet/MetaMask interativa. |
| Teste de recusa de assinatura | Nao executado: exige wallet/MetaMask interativa. |
| Teste com wallet desconectada | Nao executado: exige wallet/MetaMask interativa. |

## 12. Pendencias encontradas

- Validar manualmente conexao e assinatura com MetaMask ou wallet EVM real.
- Executar Bloco 03 para enviar `walletAddress`, `nonce` e `signature` para `/auth/verify`.
- Persistir JWT somente nos blocos planejados de Verify/Auth Store.
- Implementar Bearer global somente no bloco especifico.

## 13. Commit realizado

Commit semantico realizado:

```txt
feat: integrar wallet real e assinatura de nonce
```

## 14. Observacoes para o proximo bloco

O Bloco 03 deve consumir a signature capturada e chamar:

```txt
POST /auth/verify
```

Ainda nao iniciar contracts/actions/audit. O fluxo alvo continua:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```
