# Feedback — Bloco 03: Configuração Backend .env.example

## 1. Resumo do que foi feito

Foi executado o Bloco 03 da Sessão 01 com foco em revisar e padronizar a configuração de ambiente do backend.

Atividades realizadas:

- Mapeamento das variáveis usadas em `backend/app/config.py`.
- Revisão de `backend/.env.example`.
- Documentação de variáveis obrigatórias e opcionais do backend.
- Inclusão de comentários de segurança e uso local.
- Alinhamento do exemplo de CORS com `localhost` e `127.0.0.1`.
- Documentação da diferença entre `DATABASE_URL` para Docker e execução fora do Docker.
- Atualização mínima do README do backend na seção de configuração de ambiente.
- Criação de análise técnica das variáveis de ambiente.
- Validação do backend com Docker, Alembic, seed e healthcheck.

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/analise_env_backend.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_03_configuracao_backend_env_example.md
```

## 3. Arquivos alterados

```txt
backend/.env.example
backend/README.md
```

Nenhum arquivo de código, rota, model, migration, schema, regra de negócio ou frontend foi alterado.

## 4. Variáveis documentadas

Variáveis documentadas no `backend/.env.example`:

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

Observações:

- `DATABASE_URL` usa host `db` para Docker Compose.
- O exemplo alternativo com `localhost` foi deixado comentado para execução fora do Docker.
- `JWT_SECRET` usa valor fictício com mais de 32 caracteres.
- `BLOCKCHAIN_ENABLED=false` foi mantido como padrão seguro.
- `CONTRACT_ADDRESS` foi mantido vazio enquanto não existe smart contract real.

## 5. Ajustes de segurança realizados

- Nenhum segredo real foi adicionado.
- `JWT_SECRET` foi documentado com valor fictício.
- Comentários deixam claro que segredos reais, private keys, mnemonics e credenciais de produção não devem ser commitados.
- `CONTRACT_ADDRESS` permanece vazio.
- Blockchain permanece desabilitada por padrão.

## 6. Validações executadas

```txt
docker compose config
Status: executado com sucesso.
Observação: a saída foi redigida localmente para não reproduzir JWT_SECRET ou DATABASE_URL reais.

docker compose up -d --build
Status: executado com sucesso.
Resultado: containers de banco e API iniciados.

alembic upgrade head
Status: executado com sucesso via container.
Comando: docker compose exec -T api alembic upgrade head.

python scripts/seed_demo_profiles.py
Status: falhou no host.
Motivo: Python não está disponível no host.
Impacto: não bloqueante; validação equivalente executada no container.

docker compose exec -T api python -m scripts.seed_demo_profiles
Status: executado com sucesso.
Resultado: seed idempotente; perfis demo já existiam.

GET /health
Status: executado com sucesso.
URL: http://127.0.0.1:3005/health.
Resultado: HTTP 200.
```

## 7. Pendências encontradas

- A porta real do ambiente local atual é `3005`, vinda do `.env` local. O `.env.example` mantém `PORT=8000` como padrão; a decisão final de porta deve ser consolidada no Bloco 05.
- `backend/docker-compose.yml` já estava modificado antes deste bloco para usar `${PORT:-8000}`. Essa alteração não foi incluída no commit do Bloco 03 para evitar misturar mudanças preexistentes.
- A senha de PostgreSQL de desenvolvimento segue fixa no `docker-compose.yml`; revisão de credenciais de produção deve ficar para etapa de deploy.
- O frontend ainda aponta por padrão para outra porta; isso é escopo do Bloco 05.

## 8. Commit realizado

Commit semântico realizado neste bloco:

```txt
chore: configura env example do backend
```

## 9. Observações para o próximo bloco

O próximo bloco deve validar Docker, migrations e seed de forma focada.

Sugestões:

- Confirmar se a alteração preexistente de `backend/docker-compose.yml` deve ser versionada.
- Registrar oficialmente a porta local usada nos próximos blocos.
- Continuar evitando commit de `.env` real ou qualquer segredo local.
