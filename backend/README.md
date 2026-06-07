# FiscalizaPay Backend

API real do FiscalizaPay usando Python, FastAPI e PostgreSQL.

Esta etapa **não implementa smart contract ainda**. A autenticação já usa wallet real por assinatura EVM, sem gas e sem transação.

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
Nginx em produção
```

## Segurança principal

- O frontend não envia `role` como fonte de verdade.
- O usuário assina uma mensagem com a wallet.
- O backend valida a assinatura.
- O backend busca a role da wallet na tabela `profiles`.
- O backend valida status, role e wallet vinculada ao contrato.
- Leituras de contratos, dashboard e auditoria também exigem JWT.
- Smart contract fica desabilitado até a próxima etapa.

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
POST /contracts/{id}/register-on-chain

GET /audit/events # requer JWT
```

## Rodando com Docker no computador ou servidor

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
ALLOWED_HOSTS=localhost,127.0.0.1
BLOCKCHAIN_ENABLED=false
```

Para rodar a API fora do Docker, troque o host do banco em `DATABASE_URL` de `db` para `localhost`.

3. Suba banco e API:

```bash
docker compose up -d --build
```

4. Veja se os containers estão de pé:

```bash
docker compose ps
```

5. Teste a API:

```bash
curl http://127.0.0.1:8000/health
```

6. Crie perfis de teste:

```bash
docker compose exec api python -m scripts.seed_demo_profiles
```

Ou cadastre uma wallet real:

```bash
docker compose exec api python -m scripts.create_profile \
  --name "Seu Nome" \
  --role GESTOR \
  --wallet 0xSUA_WALLET_REAL
```

## Como funciona o login por wallet

1. O frontend chama:

```http
GET /auth/nonce?walletAddress=0x...
```

2. A API retorna uma mensagem.
3. O usuário assina essa mensagem na MetaMask.
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

5. A API retorna:

```json
{
  "data": {
    "accessToken": "...",
    "tokenType": "bearer",
    "expiresAt": "...",
    "profile": {
      "role": "GESTOR"
    }
  }
}
```

6. O frontend usa em todas as chamadas protegidas:

```http
Authorization: Bearer TOKEN_AQUI
```

## Regras de permissão

```txt
Criar contrato: GESTOR
Confirmar envio: FORNECEDOR, e wallet deve bater com supplierWallet se preenchida
Confirmar entrega: ENTREGADOR, e wallet deve bater com logisticsWallet se preenchida
Validar recebimento: FISCAL, e wallet deve bater com inspectorWallet se preenchida
Autorizar pagamento: GESTOR, e wallet deve bater com managerWallet se preenchida
Abrir disputa: GESTOR, FISCAL ou AUDITOR
Simular fraude: GESTOR, FISCAL ou AUDITOR
Registrar on-chain: desabilitado até existir smart contract
```

## Deploy básico com Nginx

No servidor Linux, mantenha a API escutando apenas em `127.0.0.1:8000`.

Exemplo de bloco Nginx:

```nginx
server {
    listen 80;
    server_name api.seudominio.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Depois configure HTTPS com Certbot ou outro método disponível no seu servidor.

## Comandos úteis de Docker

```bash
# subir
docker compose up -d

# parar
docker compose down

# reconstruir
docker compose up -d --build

# logs da API
docker compose logs -f api

# logs do banco
docker compose logs -f db

# executar migrations manualmente
docker compose exec api alembic upgrade head

# entrar no container da API
docker compose exec api sh

# entrar no PostgreSQL
docker compose exec db psql -U fiscalizapay -d fiscalizapay
```

## Variáveis importantes para produção

```env
ENVIRONMENT=production
JWT_SECRET=gere_uma_chave_forte
CORS_ORIGINS=https://seu-frontend.com
ALLOWED_HOSTS=api.seudominio.com
DATABASE_URL=postgresql+psycopg://usuario:senha@db:5432/fiscalizapay
CHAIN_ID=80002
BLOCKCHAIN_ENABLED=false
```

## Divergências atuais com o frontend

Para wallet real, o frontend precisa ser ajustado:

- Implementar `/auth/nonce`, assinatura na MetaMask e `/auth/verify`.
- Salvar o JWT e enviar `Authorization: Bearer ...`.
- Não enviar `role` no body como fonte de verdade.
- Ajustar permissões visuais de disputa e fraude para refletir backend:
  - disputa: `GESTOR`, `FISCAL`, `AUDITOR`;
  - fraude: `GESTOR`, `FISCAL`, `AUDITOR`.
- Corrigir wallets mockadas inválidas. Toda wallet real precisa ser `0x` + 40 caracteres hexadecimais.
- Ocultar ou sinalizar `register-on-chain` até o smart contract existir.
