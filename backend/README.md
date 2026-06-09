# FiscalizaPay Backend

API real do FiscalizaPay usando Python, FastAPI e PostgreSQL.

O projeto ja possui smart contract `FiscalizaPayRegistry` deployado em Sepolia,
mas esta API ainda nao executa escrita on-chain em runtime. A autenticacao ja
usa wallet real por assinatura EVM, sem gas e sem transacao.

## Stack

```txt
Python 3.12
FastAPI
SQLAlchemy 2
Alembic
PostgreSQL
JWT
eth-account
Docker / Docker Compose
Nginx em producao
```

## Seguranca principal

- O frontend nao envia `role` como fonte de verdade.
- O usuario assina uma mensagem com a wallet.
- O backend valida a assinatura.
- O backend busca a role da wallet na tabela `profiles`.
- O backend valida status, role e wallet vinculada ao contrato.
- Leituras de contratos, dashboard e auditoria exigem JWT.
- O contrato Sepolia existe, mas a escrita runtime on-chain ainda esta desabilitada.

## Endpoints

```txt
GET  /health

GET  /auth/nonce?walletAddress=0x...
POST /auth/verify
GET  /auth/me

GET  /dashboard/summary  # requer JWT

GET    /contracts        # requer JWT
POST   /contracts        # requer JWT
GET    /contracts/{id}   # requer JWT
PATCH  /contracts/{id}   # requer JWT
DELETE /contracts/{id}   # requer JWT

GET  /contracts/{id}/events # requer JWT
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
POST /contracts/{id}/open-dispute
POST /contracts/{id}/simulate-fraud

GET  /contracts/{id}/blockchain-status # requer JWT
POST /contracts/{id}/register-on-chain # endpoint reservado; escrita real ainda nao integrada

GET /audit/events # requer JWT
```

## Rodando com Docker

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

2. Edite `.env` e troque pelo menos:

```env
PORT=8000
DATABASE_URL=postgresql+psycopg://fiscalizapay:fiscalizapay_dev_password@db:5432/fiscalizapay
JWT_SECRET=gere_uma_chave_grande_com_pelo_menos_32_caracteres
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
CHAIN_ID=11155111
EXPLORER_URL=https://sepolia.etherscan.io
CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
BLOCKCHAIN_ENABLED=false
```

Para rodar a API fora do Docker, troque o host do banco em `DATABASE_URL` de
`db` para `localhost`.

3. Suba banco e API:

```bash
docker compose up -d --build
```

4. Teste a API:

```bash
curl http://127.0.0.1:8000/health
```

5. Crie perfis de teste:

```bash
docker compose exec -T api python -m scripts.seed_demo_profiles
```

Ou cadastre uma wallet real:

```bash
docker compose exec api python -m scripts.create_profile \
  --name "Seu Nome" \
  --role GESTOR \
  --wallet 0xSUA_WALLET_REAL
```

## Login por wallet

1. O frontend chama:

```http
GET /auth/nonce?walletAddress=0x...
```

2. A API retorna uma mensagem.
3. O usuario assina essa mensagem na MetaMask.
4. O frontend chama:

```http
POST /auth/verify
Content-Type: application/json

{
  "walletAddress": "0x...",
  "nonce": "nonce-retornado",
  "signature": "0xassinatura"
}
```

5. A API retorna JWT e perfil.
6. O frontend envia `Authorization: Bearer TOKEN_AQUI` nas rotas protegidas.

## Regras de permissao

```txt
Criar contrato: GESTOR
Confirmar envio: FORNECEDOR, e wallet deve bater com supplierWallet se preenchida
Confirmar entrega: ENTREGADOR, e wallet deve bater com logisticsWallet se preenchida
Validar recebimento: FISCAL, e wallet deve bater com inspectorWallet se preenchida
Autorizar pagamento: GESTOR, e wallet deve bater com managerWallet se preenchida
Abrir disputa: GESTOR, FISCAL ou AUDITOR
Simular fraude: GESTOR, FISCAL ou AUDITOR
Registrar on-chain: GESTOR, mas escrita real ainda nao implementada
```

## Estado blockchain

Contrato Sepolia:

```txt
0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
https://sepolia.etherscan.io/address/0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
```

`POST /contracts/{id}/register-on-chain` existe para manter o contrato de API
estavel, mas hoje retorna erro quando a escrita real estiver desabilitada ou nao
implementada. Isso e intencional no MVP para evitar custo operacional de faucets
e transacoes durante a demo.

## Comandos uteis de Docker

```bash
docker compose up -d
docker compose down
docker compose up -d --build
docker compose logs -f api
docker compose logs -f db
docker compose exec api alembic upgrade head
docker compose exec api sh
docker compose exec db psql -U fiscalizapay -d fiscalizapay
```
