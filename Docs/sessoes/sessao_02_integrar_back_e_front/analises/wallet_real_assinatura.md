# Wallet Real + Assinatura - Bloco 02

## 1. Resumo Executivo

O Bloco 02 da Sessao 02 implementou a base de wallet real + assinatura da mensagem de nonce no frontend.

Fluxo implementado:

```txt
wallet real -> getAuthNonce(walletAddress) -> data.message -> useSignMessage -> signature capturada
```

O bloco nao executa `/auth/verify`, nao persiste JWT, nao cria store definitiva de sessao, nao injeta Bearer global e nao integra contratos/actions/audit/blockchain.

## 2. Arquivos Analisados

Frontend:

```txt
web/src/shared/api/auth-api.ts
web/src/shared/config/env.ts
web/src/shared/config/web3.ts
web/src/app/layout.tsx
web/src/app/providers/index.tsx
web/src/app/providers/web3-provider.tsx
web/src/features/wallet-connect/ui/wallet-connect-button.tsx
web/src/entities/wallet/model/store.ts
web/src/entities/wallet/ui/wallet-account-card.tsx
web/src/entities/wallet/ui/wallet-status.tsx
web/package.json
```

Backend:

```txt
backend/app/routers/auth.py
backend/app/schemas.py
backend/app/security.py
```

## 3. Stack de Wallet Identificada

Stack ja existente no projeto:

```txt
wagmi
viem
@rainbow-me/rainbowkit
@tanstack/react-query
```

Providers globais ja configurados:

```txt
RootProviders
Web3Provider
WagmiProvider
QueryProvider
RainbowKitProvider
```

Nenhuma dependencia foi instalada neste bloco.

## 4. Dependencias Usadas ou Instaladas

Dependencias usadas:

```txt
wagmi: useAccount, useConnect, useDisconnect, useSignMessage
viem: tipos e stack interna usada pelo wagmi
RainbowKit: provider global ja existente
```

Dependencias instaladas:

```txt
Nenhuma.
```

Nao foi executado `npm audit fix --force`.

## 5. Fluxo Implementado

Arquivo principal:

```txt
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
```

Fluxo:

1. Identifica conector `injected` do wagmi, com fallback para primeiro conector disponivel.
2. Verifica se existe wallet injetada no navegador quando o conector for `injected`.
3. Conecta a wallet real via `connectAsync`.
4. Le `address` e `chainId` reais.
5. Bloqueia assinatura se a chain conectada divergir de `NEXT_PUBLIC_CHAIN_ID`.
6. Chama `getAuthNonce(walletAddress)`.
7. Usa exatamente `nonceResponse.data.message`.
8. Assina a mensagem via `signMessageAsync({ message })`.
9. Mantem temporariamente `walletAddress`, `nonce`, `message`, `expiresAt` e `signature`.

UI criada:

```txt
web/src/features/auth-wallet/ui/wallet-signature-button.tsx
```

Comportamento:

- Em modo API real (`NEXT_PUBLIC_USE_MOCKS=false`), o header usa `WalletSignatureButton`.
- Em modo mock (`NEXT_PUBLIC_USE_MOCKS=true`), o header continua usando o fluxo demo antigo.

## 6. Contrato do /auth/nonce Utilizado

Chamada:

```http
GET /auth/nonce?walletAddress=<wallet EVM>
```

Wallet:

```txt
0x + 40 caracteres hexadecimais
```

Resposta usada pelo frontend:

```json
{
  "data": {
    "walletAddress": "0x1111111111111111111111111111111111111111",
    "nonce": "hexadecimal",
    "message": "FiscalizaPay Web3\\n\\nAssine esta mensagem...",
    "expiresAt": "2026-06-08T04:13:14.208Z"
  }
}
```

## 7. Mensagem Assinada

Regra aplicada:

```txt
Assinar exatamente nonceResponse.data.message.
```

O frontend nao:

- reconstruiu a mensagem;
- removeu espacos;
- alterou quebras de linha;
- assinou apenas o nonce.

## 8. Estado Temporario Criado

Estado temporario no hook:

```txt
walletAddress
chainId
expectedChainId
isConnected
isCorrectNetwork
isConnecting
isRequestingNonce
isSigning
nonceData
signature
error
selectedConnector
```

Este estado fica no hook do Bloco 02. A store definitiva de sessao permanece para o Bloco 04 - Auth Store/Session.

## 9. Tratamento de Erros

Casos tratados:

| Caso | Tratamento |
|---|---|
| Wallet nao instalada | Mensagem orientando instalar MetaMask ou wallet EVM compativel. |
| Nenhum conector disponivel | Mensagem de conector indisponivel. |
| Usuario recusou conexao | Mensagem `Conexao recusada pelo usuario.` |
| Usuario recusou assinatura | Mensagem `Assinatura recusada pelo usuario.` |
| Wallet desconectada | O fluxo tenta conectar antes de solicitar nonce; se nao houver address, exibe erro. |
| Wallet address invalido | Tratado por `getAuthNonce`, com validacao EVM leve no frontend. |
| Erro ao solicitar nonce | Tratado via `getApiErrorMessage`. |
| Backend indisponivel | Tratado pelo `httpClient` como erro de conexao. |
| `data.message` ausente | Erro `Mensagem de autenticacao invalida ou ausente.` |
| Rede incorreta | Assinatura bloqueada quando `chainId` difere de `NEXT_PUBLIC_CHAIN_ID`. |
| Erro inesperado | Mensagem controlada, sem stack trace em UI. |

## 10. Preservacao do Mock Mode

Mock mode preservado:

- `web/src/features/wallet-connect/ui/wallet-connect-button.tsx` continua usando `useWalletStore` e `connectMockWallet` quando `env.useMocks=true`.
- `WalletSignatureButton` e o fluxo real so sao usados quando `env.useMocks=false`.
- Perfis demo nao foram unificados.
- Nenhum fluxo de contracts/actions/audit foi alterado.
- Nao existe fallback silencioso para mock quando `env.useMocks=false`.

## 11. Validacoes Executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` com `.env.local` atual (`NEXT_PUBLIC_USE_MOCKS=true`) | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `docker compose config` | OK. |
| `docker compose up -d --build` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| `GET /auth/nonce?walletAddress=0x1111111111111111111111111111111111111111` | OK, HTTP 200 com `walletAddress`, `nonce`, `message`, `expiresAt`. |
| `GET http://localhost:3000` | OK, HTTP 200. |
| `git status` | Executado; pendencias antigas nao rastreadas permanecem fora do escopo. |
| Teste de conexao da wallet no navegador | Nao executado. Motivo: ambiente sem wallet/MetaMask interativa disponivel para aprovar conexao. Impacto: exige validacao manual no navegador. |
| Teste de assinatura de `data.message` no navegador | Nao executado. Motivo: depende de wallet real interativa. Impacto: exige validacao manual no proximo passo antes do Bloco 03. |
| Teste de recusa de assinatura | Nao executado. Motivo: depende de modal de wallet real. Impacto: fluxo de erro foi implementado por codigo, mas precisa validacao manual. |
| Teste com wallet desconectada no navegador | Nao executado. Motivo: depende de wallet real interativa. Impacto: hook tenta conectar antes do nonce e exibe erro se nao houver address. |

## 12. Pendencias para Proximos Blocos

- Validar manualmente no navegador com MetaMask ou wallet EVM real.
- Executar assinatura real de `data.message` e confirmar signature capturada.
- Enviar signature para `/auth/verify` no Bloco 03.
- Persistir JWT somente no Bloco 03/04 conforme planejamento.
- Criar Auth Store/Session definitiva no Bloco 04.
- Implementar Authorization Bearer global no bloco especifico.
- Manter contracts/actions/audit bloqueados ate `/auth/me` funcionar com Bearer.

## 13. Conclusao Tecnica

O Bloco 02 esta implementado no frontend e compila nos modos mock e API real. O projeto agora possui um fluxo preparado para conectar wallet real, solicitar nonce ao backend e assinar exatamente `data.message`, capturando a signature em estado temporario.

A validacao interativa com MetaMask/wallet real ainda precisa ser feita manualmente antes de concluir o fluxo de `/auth/verify` no Bloco 03.
