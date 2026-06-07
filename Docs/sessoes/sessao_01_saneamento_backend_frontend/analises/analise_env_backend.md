# Analise de Variaveis de Ambiente do Backend

## 1. Resumo

O backend usa `pydantic-settings` em `backend/app/config.py` para carregar variaveis de ambiente a partir de `.env`.

O arquivo `backend/.env.example` foi revisado para documentar todas as variaveis relevantes usadas pelo backend, com valores ficticios e seguros para ambiente local.

Nenhum segredo real foi adicionado.

## 2. Variaveis encontradas no codigo

Fonte principal:

```txt
backend/app/config.py
```

Variaveis suportadas pela classe `Settings`:

```txt
APP_NAME
ENVIRONMENT
PORT
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_MINUTES
JWT_ALGORITHM
CORS_ORIGINS
ALLOWED_HOSTS
AUTH_NONCE_EXPIRES_MINUTES
CHAIN_ID
EXPLORER_URL
CONTRACT_ADDRESS
BLOCKCHAIN_ENABLED
```

Usos relevantes:

- `DATABASE_URL`: usado por SQLAlchemy e Alembic.
- `JWT_SECRET`, `JWT_EXPIRES_MINUTES`, `JWT_ALGORITHM`: usados para criar e validar JWT.
- `CORS_ORIGINS`: usado no middleware CORS.
- `ALLOWED_HOSTS`: usado no `TrustedHostMiddleware` em producao.
- `AUTH_NONCE_EXPIRES_MINUTES`: usado no fluxo de login por wallet.
- `CHAIN_ID`: usado na mensagem de assinatura da wallet.
- `EXPLORER_URL`, `CONTRACT_ADDRESS`, `BLOCKCHAIN_ENABLED`: reservados para a etapa blockchain.
- `PORT`: usado pelo Docker Compose atual para bind e Gunicorn.

## 3. Variaveis presentes no .env.example

Depois da revisao, `backend/.env.example` documenta:

```txt
APP_NAME
ENVIRONMENT
PORT
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_MINUTES
JWT_ALGORITHM
AUTH_NONCE_EXPIRES_MINUTES
CORS_ORIGINS
ALLOWED_HOSTS
CHAIN_ID
EXPLORER_URL
BLOCKCHAIN_ENABLED
CONTRACT_ADDRESS
```

## 4. Divergencias encontradas

Antes da revisao:

- `JWT_ALGORITHM` era suportado pelo codigo, mas nao estava documentado no `.env.example`.
- `CORS_ORIGINS` documentava apenas `http://localhost:3000`, sem `http://127.0.0.1:3000`.
- O arquivo nao deixava tao explicita a diferenca entre `DATABASE_URL` para Docker (`db`) e execucao fora do Docker (`localhost`).
- O README do backend nao mostrava `DATABASE_URL`, `PORT` ou `BLOCKCHAIN_ENABLED` no trecho minimo de configuracao local.

Observacao sobre Docker Compose:

- O `docker-compose.yml` no working tree atual usa `${PORT:-8000}` para publicar a API e iniciar o Gunicorn.
- Esse arquivo ja estava modificado antes deste bloco e nao foi incluido no commit do Bloco 03 para evitar misturar alteracoes preexistentes.

## 5. Correcoes realizadas

Foram realizadas as seguintes correcoes:

- `backend/.env.example` foi reorganizado por secoes.
- `JWT_ALGORITHM=HS256` foi documentado.
- `JWT_SECRET` recebeu valor ficticio com tamanho compativel com a validacao minima de 32 caracteres.
- `CORS_ORIGINS` passou a incluir `http://localhost:3000` e `http://127.0.0.1:3000`.
- `DATABASE_URL` ganhou comentario para Docker e exemplo alternativo para execucao fora do Docker.
- `BLOCKCHAIN_ENABLED=false` e `CONTRACT_ADDRESS=` foram mantidos como placeholders seguros.
- `backend/README.md` recebeu instrucoes minimas de copia do `.env.example`, incluindo exemplo para Windows PowerShell.

## 6. Pendencias

- Decidir oficialmente, no Bloco 05, a porta local padrao do backend e alinhar frontend/backend/documentacao.
- Decidir se a alteracao preexistente em `backend/docker-compose.yml` deve ser versionada em bloco proprio.
- Revisar variaveis de producao em um bloco futuro de deploy.
- Nao habilitar blockchain real ate existir smart contract configurado.
