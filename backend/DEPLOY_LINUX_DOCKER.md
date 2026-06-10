# Deploy Linux com Docker e Nginx

Guia passo a passo para subir o backend FiscalizaPay em um servidor Linux.

Este guia assume Ubuntu/Debian. Se seu servidor usa outra distribuição, os comandos podem mudar um pouco.

## 0. Ideia geral

Você terá:

```txt
Internet
  -> Nginx na porta 80/443
  -> API FastAPI em 127.0.0.1:8000
  -> PostgreSQL dentro do Docker, sem porta pública
```

O PostgreSQL não fica exposto para a internet.

## 1. Entrar no servidor

No seu computador:

```bash
ssh usuario@IP_DO_SERVIDOR
```

## 2. Atualizar o servidor

```bash
sudo apt update
sudo apt upgrade -y
```

## 3. Instalar ferramentas básicas

```bash
sudo apt install -y git curl ca-certificates nginx
```

## 4. Instalar Docker

```bash
curl -fsSL https://get.docker.com | sh
```

Permitir que seu usuário use Docker:

```bash
sudo usermod -aG docker $USER
```

Depois disso, saia e entre novamente no SSH:

```bash
exit
ssh usuario@IP_DO_SERVIDOR
```

Teste:

```bash
docker --version
docker compose version
```

## 5. Criar pasta do projeto

```bash
sudo mkdir -p /opt/fiscalizapay
sudo chown -R $USER:$USER /opt/fiscalizapay
cd /opt/fiscalizapay
```

## 6. Enviar ou clonar o projeto

Se estiver usando Git:

```bash
git clone URL_DO_REPOSITORIO .
```

Se for enviar por ZIP/SFTP, coloque a pasta do projeto dentro de:

```txt
/opt/fiscalizapay
```

O backend precisa ficar em:

```txt
/opt/fiscalizapay/backend
```

## 7. Configurar `.env`

Entre no backend:

```bash
cd /opt/fiscalizapay/backend
cp .env.example .env
```

Gere uma chave forte:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

Se `python3` não existir:

```bash
sudo apt install -y python3
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

Edite o `.env`:

```bash
nano .env
```

Exemplo para produção:

```env
APP_NAME=FiscalizaPay API
ENVIRONMENT=production
PORT=8000

JWT_SECRET=COLE_A_CHAVE_GERADA_AQUI
JWT_EXPIRES_MINUTES=60

CORS_ORIGINS=https://seu-frontend.com
ALLOWED_HOSTS=api.seudominio.com,127.0.0.1,localhost

DATABASE_URL=postgresql+psycopg://fiscalizapay:fiscalizapay_dev_password@db:5432/fiscalizapay

AUTH_NONCE_EXPIRES_MINUTES=10
CHAIN_ID=11155111

EXPLORER_URL=https://sepolia.etherscan.io
CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
BLOCKCHAIN_ENABLED=false
RPC_URL=
OPERATOR_PRIVATE_KEY=
BLOCKCHAIN_TX_TIMEOUT_SECONDS=120
```

Importante:

- Troque `CORS_ORIGINS` para o domínio real do frontend.
- Troque `ALLOWED_HOSTS` para o domínio real da API.
- Troque a senha do PostgreSQL no `docker-compose.yml` e no `DATABASE_URL` antes de produção real.

## 8. Subir API e PostgreSQL

Dentro de `/opt/fiscalizapay/backend`:

```bash
docker compose up -d --build
```

O que esse comando faz:

- baixa a imagem do PostgreSQL;
- cria o banco;
- constrói a imagem da API;
- roda migrations;
- inicia o FastAPI.

## 9. Verificar containers

```bash
docker compose ps
```

Você deve ver algo parecido:

```txt
fiscalizapay-db    running
fiscalizapay-api   running
```

Ver logs:

```bash
docker compose logs -f api
```

Sair dos logs:

```txt
Ctrl + C
```

## 10. Testar API local no servidor

```bash
curl http://127.0.0.1:8000/health
```

Resposta esperada:

```json
{
  "data": {
    "status": "ok",
    "app": "FiscalizaPay API",
    "environment": "production"
  }
}
```

## 11. Criar perfil para sua wallet real

Você precisa cadastrar no banco a wallet que terá permissão.

Exemplo para cadastrar você como gestor:

```bash
docker compose exec api python -m scripts.create_profile \
  --name "Seu Nome" \
  --role GESTOR \
  --wallet 0xSUA_WALLET_REAL
```

Roles possíveis:

```txt
GESTOR
FORNECEDOR
ENTREGADOR
FISCAL
AUDITOR
```

Você pode cadastrar outras pessoas:

```bash
docker compose exec api python -m scripts.create_profile \
  --name "Fornecedor Teste" \
  --role FORNECEDOR \
  --wallet 0xWALLET_DO_FORNECEDOR
```

## 12. Configurar Nginx

Crie o arquivo:

```bash
sudo nano /etc/nginx/sites-available/fiscalizapay-api
```

Conteúdo:

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

Ative:

```bash
sudo ln -s /etc/nginx/sites-available/fiscalizapay-api /etc/nginx/sites-enabled/fiscalizapay-api
```

Teste:

```bash
sudo nginx -t
```

Recarregue:

```bash
sudo systemctl reload nginx
```

Teste no navegador:

```txt
http://api.seudominio.com/health
```

## 13. HTTPS com Certbot

Instale:

```bash
sudo apt install -y certbot python3-certbot-nginx
```

Gere certificado:

```bash
sudo certbot --nginx -d api.seudominio.com
```

Depois teste:

```txt
https://api.seudominio.com/health
```

## 14. Comandos Docker que você vai usar sempre

Entrar na pasta:

```bash
cd /opt/fiscalizapay/backend
```

Subir:

```bash
docker compose up -d
```

Parar:

```bash
docker compose down
```

Reconstruir depois de atualizar código:

```bash
docker compose up -d --build
```

Ver logs:

```bash
docker compose logs -f api
```

Ver banco:

```bash
docker compose logs -f db
```

Entrar no container da API:

```bash
docker compose exec api sh
```

Entrar no PostgreSQL:

```bash
docker compose exec db psql -U fiscalizapay -d fiscalizapay
```

Sair do PostgreSQL:

```sql
\q
```

Executar migrations:

```bash
docker compose exec api alembic upgrade head
```

Criar perfil:

```bash
docker compose exec api python -m scripts.create_profile --name "Nome" --role GESTOR --wallet 0x...
```

## 15. Atualizar o backend no servidor

Se usa Git:

```bash
cd /opt/fiscalizapay
git pull
cd backend
docker compose up -d --build
```

Se enviou arquivos manualmente, substitua os arquivos e rode:

```bash
cd /opt/fiscalizapay/backend
docker compose up -d --build
```

## 16. Checklist final

```txt
[ ] docker compose ps mostra api e db rodando
[ ] curl http://127.0.0.1:8000/health funciona no servidor
[ ] https://api.seudominio.com/health funciona no navegador
[ ] CORS_ORIGINS aponta para o frontend real
[ ] ALLOWED_HOSTS aponta para o domínio da API
[ ] JWT_SECRET foi trocado
[ ] Wallets reais foram cadastradas com scripts.create_profile
[ ] Frontend usa NEXT_PUBLIC_USE_MOCKS=false
[ ] Frontend envia Authorization: Bearer token
```
