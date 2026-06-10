# Ajustes Necessários no Frontend

Este backend foi criado para funcionar com wallets reais em testnet e smart contract Sepolia. A escrita on-chain real existe, mas e controlada por `BLOCKCHAIN_ENABLED`.

## Mudança principal

O frontend não deve mais tratar `role` como fonte de verdade.

Fluxo correto:

```txt
Wallet real assina mensagem
Backend valida assinatura
Backend encontra a role no PostgreSQL
Backend emite JWT
Frontend usa JWT nas próximas chamadas
```

## Endpoints de autenticação

### 1. Solicitar nonce

```http
GET /auth/nonce?walletAddress=0x...
```

Resposta:

```json
{
  "data": {
    "walletAddress": "0x...",
    "nonce": "...",
    "message": "FiscalizaPay Web3...",
    "expiresAt": "2026-06-04T12:00:00.000Z"
  }
}
```

### 2. Assinar no frontend

Usar a wallet conectada para assinar exatamente o campo `message`.

Com wagmi/viem, o fluxo esperado é algo como:

```ts
signMessage({ message: nonceResponse.data.message })
```

### 3. Verificar assinatura

```http
POST /auth/verify
Content-Type: application/json

{
  "walletAddress": "0x...",
  "nonce": "...",
  "signature": "0x..."
}
```

Resposta:

```json
{
  "data": {
    "accessToken": "...",
    "tokenType": "bearer",
    "expiresAt": "...",
    "profile": {
      "id": "...",
      "name": "Maria Santos",
      "role": "GESTOR",
      "walletAddress": "0x..."
    }
  }
}
```

### 4. Enviar token

Todas as mutations protegidas precisam enviar:

```http
Authorization: Bearer ACCESS_TOKEN
```

Endpoints protegidos:

```txt
GET    /dashboard/summary
GET    /contracts
POST   /contracts
GET    /contracts/{id}
PATCH  /contracts/{id}
DELETE /contracts/{id}
GET    /contracts/{id}/events
POST   /contracts/{id}/confirm-shipment
POST   /contracts/{id}/confirm-delivery
POST   /contracts/{id}/validate-receipt
POST   /contracts/{id}/authorize-payment
POST   /contracts/{id}/open-dispute
POST   /contracts/{id}/simulate-fraud
GET    /contracts/{id}/blockchain-status
POST   /contracts/{id}/register-on-chain
GET    /audit/events
```

## Bodies das ações

Não enviar `role` no body.

As ações de fluxo aceitam body opcional:

```json
{
  "notes": "Observação opcional",
  "description": "Descrição opcional",
  "documentHash": "hash opcional"
}
```

Também funcionam sem body:

```http
POST /contracts/{id}/confirm-shipment
Authorization: Bearer ...
```

## Divergências atuais encontradas

### 1. Disputa

Backend seguro implementado:

```txt
GESTOR, FISCAL, AUDITOR
```

Frontend atual permite:

```txt
GESTOR, FISCAL, FORNECEDOR, ENTREGADOR
```

Precisa ajustar.

### 2. Simulação de fraude

Backend seguro implementado:

```txt
GESTOR, FISCAL, AUDITOR
```

Frontend atual permite:

```txt
GESTOR, FISCAL
```

Precisa decidir se auditor pode simular fraude. Eu recomendo permitir, porque a tela de auditoria existe e a demo usa auditoria como fiscalização.

### 3. Wallets mockadas inválidas

Alguns mocks usam valores como:

```txt
0xLogistica...
0xAuditor...
```

Isso não é wallet EVM válida.

Wallet válida precisa ser:

```txt
0x + 40 caracteres hexadecimais
```

Exemplo:

```txt
0x1111111111111111111111111111111111111111
```

> **Atualização (Bloco 07 — Sessão 01):** wallets mockadas corrigidas e padronizadas
> entre frontend e backend. Ver `Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/wallets_mockadas.md`.

### 4. Smart contract

`GET /contracts/{id}/blockchain-status` funciona e retorna:

```json
{
  "data": {
    "contractId": "...",
    "status": "CRIADO",
    "documentHash": "...",
    "registeredOnChain": false
  }
}
```

`POST /contracts/{id}/register-on-chain` chama o smart contract quando `BLOCKCHAIN_ENABLED=true`, `RPC_URL`, `OPERATOR_PRIVATE_KEY` e `CONTRACT_ADDRESS` estiverem configurados.

Com blockchain desabilitada ou sem configuracao completa, o frontend deve ocultar/desabilitar esse botao ou mostrar indisponibilidade controlada.

## Variáveis do frontend

Para usar esta API:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.seudominio.com
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
```
