# Backend_explain

Analise do backend atual do FiscalizaPay, feita a partir dos arquivos em `backend/`.

## Visao geral

O backend atual e uma API real em Python com FastAPI, SQLAlchemy 2, Alembic e PostgreSQL. Ele ja cobre autenticacao por wallet EVM, emissao de JWT, cadastro e fluxo de contratos, trilha de eventos, dashboard agregado e auditoria.

O ponto mais importante: a blockchain ainda nao esta implementada de fato. O backend ja possui campos e endpoints preparatorios para registro on-chain, mas `register-on-chain` esta deliberadamente desabilitado ate existir smart contract configurado.

## Stack encontrada

- Python 3.12.
- FastAPI para API HTTP.
- Uvicorn/Gunicorn para servir a aplicacao.
- SQLAlchemy 2 como ORM.
- Alembic para migrations.
- PostgreSQL como banco principal.
- Pydantic/Pydantic Settings para schemas e configuracao.
- PyJWT para tokens.
- eth-account para validacao de assinatura EVM.
- Docker e Docker Compose para subir API e banco.

## Estrutura principal

```txt
backend/
  app/
    main.py              # Cria app FastAPI, middlewares, handlers e registra routers
    config.py            # Variaveis de ambiente e settings
    database.py          # Engine SQLAlchemy e SessionLocal
    models.py            # Modelos/tabelas do banco
    schemas.py           # Schemas Pydantic de entrada e saida
    serializers.py       # Conversao ORM -> DTO/API
    security.py          # Wallet, nonce, assinatura e JWT
    deps.py              # Dependencia de usuario autenticado
    errors.py            # Erros padronizados da API
    routers/
      auth.py            # Login por wallet
      contracts.py       # CRUD e acoes de contratos
      dashboard.py       # Resumo agregado
      audit.py           # Eventos auditaveis
    services/
      auth.py            # Regra de autenticacao
      contracts.py       # Regra de negocio dos contratos
  alembic/
    versions/
      0001_initial_schema.py
  scripts/
    seed_demo_profiles.py
    create_profile.py
  Dockerfile
  docker-compose.yml
  requirements.txt
```

## Aplicacao FastAPI

O arquivo `app/main.py` configura a aplicacao com:

- `FastAPI(title=settings.app_name, version="0.1.0")`.
- CORS com origens vindas de `CORS_ORIGINS`.
- `TrustedHostMiddleware` apenas em producao.
- Headers de seguranca em todas as respostas:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: no-referrer`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Tratadores globais para erros da aplicacao, validacao e erro interno.
- Registro dos routers de auth, dashboard, contracts e audit.
- Endpoint publico `GET /health`.

## Configuracao

`app/config.py` usa `BaseSettings` e espera variaveis como:

- `DATABASE_URL`, obrigatoria.
- `JWT_SECRET`, com minimo de 32 caracteres.
- `JWT_EXPIRES_MINUTES`, padrao 60.
- `CORS_ORIGINS`, padrao `http://localhost:3000`.
- `ALLOWED_HOSTS`, usado em producao.
- `AUTH_NONCE_EXPIRES_MINUTES`, padrao 10.
- `CHAIN_ID`, padrao 80002.
- `BLOCKCHAIN_ENABLED`, padrao `false`.
- `CONTRACT_ADDRESS`, ainda vazio por padrao.

O backend depende de `.env` para rodar corretamente, especialmente por causa de `DATABASE_URL` e `JWT_SECRET`.

## Modelo de dados

O banco atual tem cinco entidades principais.

### profiles

Representa os perfis autorizados a usar o sistema.

Campos principais:

- `id`
- `name`
- `role`
- `wallet_address`
- `created_at`
- `updated_at`

Roles aceitas:

- `GESTOR`
- `FORNECEDOR`
- `ENTREGADOR`
- `FISCAL`
- `AUDITOR`

`wallet_address` e unica e indexada. Na pratica, a wallet e a identidade de login, mas a role vem do banco, nao do frontend.

### auth_nonces

Guarda os nonces usados no login por assinatura.

Campos principais:

- `wallet_address`
- `nonce`
- `message`
- `expires_at`
- `used_at`
- `created_at`

Existe indice composto em `wallet_address` + `nonce`. O fluxo impede reutilizacao porque `used_at` precisa estar nulo.

### contracts

Representa contratos fiscalizados.

Campos principais:

- `contract_number`
- `public_agency`
- `supplier_name`
- `supplier_wallet`
- `object`
- `amount`
- `start_date`
- `end_date`
- `deadline`
- `inspector_name`
- `inspector_wallet`
- `logistics_responsible`
- `logistics_wallet`
- `manager_name`
- `manager_wallet`
- `status`
- `document_hash`
- `blockchain_contract_id`
- `created_at`
- `updated_at`

Status aceitos:

- `CRIADO`
- `ENVIADO`
- `ENTREGUE`
- `VALIDADO`
- `PAGAMENTO_AUTORIZADO`
- `DISPUTA`

Ha constraint para `amount > 0`, `contract_number` unico e indices de status/numero.

### contract_events

E a trilha auditavel do contrato. Cada acao importante gera um evento.

Tipos de evento:

- `CONTRATO_CRIADO`
- `ENVIO_CONFIRMADO`
- `ENTREGA_CONFIRMADA`
- `RECEBIMENTO_VALIDADO`
- `PAGAMENTO_AUTORIZADO`
- `DISPUTA_ABERTA`
- `FRAUDE_SIMULADA`
- `HASH_REGISTRADO`

Guarda responsavel, wallet, status anterior, status posterior, hash de documento e campos futuros de blockchain.

### disputes

Registra disputas manuais ou abertas automaticamente por simulacao de fraude.

Campos principais:

- `contract_id`
- `opened_by`
- `opened_by_wallet`
- `reason`
- `original_hash`
- `new_hash`
- `created_at`

## Autenticacao atual

O login atual e baseado em wallet EVM, sem transacao on-chain.

Fluxo:

1. Frontend chama `GET /auth/nonce?walletAddress=0x...`.
2. Backend valida formato da wallet.
3. Backend gera nonce aleatorio com `secrets.token_hex(24)`.
4. Backend monta uma mensagem de login contendo wallet, chain id, nonce e expiracao.
5. Usuario assina essa mensagem na wallet.
6. Frontend envia `POST /auth/verify` com wallet, nonce e assinatura.
7. Backend recupera a wallet pela assinatura usando `eth_account`.
8. Backend compara wallet recuperada com wallet informada.
9. Backend procura `Profile` para essa wallet.
10. Se existir perfil, marca nonce como usado e emite JWT.

O JWT inclui:

- `sub`: id do perfil.
- `walletAddress`: wallet do perfil.
- `role`: role do perfil.
- `exp`: expiracao.

Ponto positivo importante: o frontend nao decide a role. A role confiavel vem da tabela `profiles`.

## Autorizacao e regras de negocio

As permissoes ficam centralizadas em `ACTION_ROLES`, dentro de `app/services/contracts.py`.

Regras atuais:

```txt
create: GESTOR
update: GESTOR
delete: GESTOR
confirm_shipment: FORNECEDOR
confirm_delivery: ENTREGADOR
validate_receipt: FISCAL
authorize_payment: GESTOR
open_dispute: GESTOR, FISCAL, AUDITOR
simulate_fraud: GESTOR, FISCAL, AUDITOR
register_on_chain: GESTOR
```

Alem da role, algumas acoes exigem que a wallet autenticada bata com a wallet vinculada ao contrato:

- Confirmar envio: `supplier_wallet`.
- Confirmar entrega: `logistics_wallet`.
- Validar recebimento: `inspector_wallet`.
- Autorizar pagamento: `manager_wallet`.
- Atualizar/excluir contrato: `manager_wallet`.
- Registrar on-chain: `manager_wallet`.

Importante: a checagem da wallet vinculada so bloqueia se o campo do contrato estiver preenchido. Se a wallet vinculada estiver nula, a role basta.

## Fluxo de status do contrato

O fluxo feliz implementado e:

```txt
CRIADO
  -> ENVIADO
  -> ENTREGUE
  -> VALIDADO
  -> PAGAMENTO_AUTORIZADO
```

Cada transicao valida o status anterior esperado:

- `confirm-shipment` exige `CRIADO` e muda para `ENVIADO`.
- `confirm-delivery` exige `ENVIADO` e muda para `ENTREGUE`.
- `validate-receipt` exige `ENTREGUE` e muda para `VALIDADO`.
- `authorize-payment` exige `VALIDADO` e muda para `PAGAMENTO_AUTORIZADO`.

Disputa pode ser aberta a partir de status nao terminal, mas nao se o contrato ja estiver em:

- `PAGAMENTO_AUTORIZADO`
- `DISPUTA`

Quando disputa abre, o status vira `DISPUTA`.

## Endpoints existentes

### Publicos

```txt
GET /health
GET /auth/nonce
POST /auth/verify
```

### Protegidos por JWT

```txt
GET /auth/me
GET /dashboard/summary
GET /contracts
POST /contracts
GET /contracts/{id}
PATCH /contracts/{id}
DELETE /contracts/{id}
GET /contracts/{id}/events
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
POST /contracts/{id}/open-dispute
POST /contracts/{id}/simulate-fraud
GET /contracts/{id}/blockchain-status
POST /contracts/{id}/register-on-chain
GET /audit/events
```

## Dashboard

`GET /dashboard/summary` retorna contagem agregada de contratos por status:

- total
- criado
- enviado
- entregue
- validado
- pagamentoAutorizado
- disputa

Nao ha filtro por perfil, orgao, gestor ou periodo. Hoje o dashboard ve todos os contratos do banco.

## Auditoria

`GET /audit/events` retorna todos os eventos de todos os contratos, ordenados do mais recente para o mais antigo, enriquecidos com:

- numero do contrato
- objeto do contrato
- status atual do contrato

Nao ha filtros, paginacao ou controle especifico de role. Qualquer perfil autenticado consegue ler auditoria.

## Blockchain

O backend tem preparacao para blockchain, mas nao integracao real.

`GET /contracts/{id}/blockchain-status` retorna:

- id do contrato
- status atual
- documentHash
- `registeredOnChain: false`

`POST /contracts/{id}/register-on-chain`:

- exige role `GESTOR`
- exige wallet do gestor se `manager_wallet` estiver preenchida
- retorna erro `BLOCKCHAIN_ERROR`
- usa HTTP 502
- mensagem indica que smart contract ainda nao esta configurado

Campos como `blockchain_contract_id`, `transaction_hash` e `blockchain_timestamp` ja existem no modelo, mas ainda nao sao preenchidos por uma transacao real.

## Scripts operacionais

### seed_demo_profiles.py

Cria perfis demo com wallets EVM validas:

- Gestor
- Fornecedor
- Entregador
- Fiscal
- Auditor

Essas wallets sao enderecos artificiais compostos por repeticao numerica, uteis para cadastro/demo, mas nao representam necessariamente wallets controladas no navegador.

### create_profile.py

Cria ou atualiza um perfil real via CLI:

```txt
--name
--role
--wallet
```

Valida a wallet usando a mesma funcao de seguranca da API.

## Deploy e Docker

O `Dockerfile`:

- usa `python:3.12-slim`
- instala `curl`
- instala dependencias de `requirements.txt`
- copia o projeto
- expoe porta 8000
- roda Gunicorn com worker Uvicorn

O `docker-compose.yml`:

- sobe PostgreSQL 16 Alpine
- sobe API
- aguarda healthcheck do banco
- executa `alembic upgrade head` antes de iniciar o servidor
- publica API em `127.0.0.1:8000:8000`

Esse bind local e bom para producao atras de Nginx, pois evita expor a API diretamente na interface publica.

## Pontos fortes

- Ja existe separacao razoavel entre routers, services, schemas, models e serializers.
- Autenticacao por assinatura EVM esta bem alinhada ao produto.
- Role nao vem do frontend, vem do banco.
- Nonce tem expiracao e controle de uso unico.
- JWT protege leituras e escritas sensiveis.
- Regras de role e wallet vinculada estao centralizadas.
- Fluxo de status evita transicoes fora de ordem.
- Eventos auditaveis sao gerados nas principais acoes.
- Banco tem constraints importantes para status, role, tipo de evento e valor positivo.
- Docker Compose ja cobre API + banco + migrations.
- O backend ja documenta divergencias com o frontend em `FRONTEND_ALIGNMENT.md`.

## Pontos de atencao

### 1. Encoding quebrado em textos

Varios arquivos exibem acentos quebrados, por exemplo `nÃ£o`, `aÃ§Ã£o`, `usuÃ¡rio`. Isso aparece em README, scripts e mensagens de erro/resposta.

Impacto:

- Mensagens da API podem chegar quebradas ao frontend.
- Documentacao fica menos legivel.
- Pode passar uma sensacao de falta de acabamento na demo.

Recomendacao:

- Normalizar arquivos para UTF-8.
- Revisar mensagens user-facing.

### 2. Nao ha testes automatizados no backend

Nao foram encontrados testes no backend.

Impacto:

- Risco maior ao alterar regras de permissao/status.
- Fluxo de assinatura/JWT pode regredir sem aviso.
- Contrato com frontend fica mais fragil.

Recomendacao:

- Criar testes para auth, permissoes, transicoes de status, disputa, fraude e endpoints principais.

### 3. Listagens nao tem paginacao

`GET /contracts` e `GET /audit/events` retornam tudo.

Impacto:

- Pode funcionar no MVP/demo.
- Pode ficar caro/lento com muitos contratos/eventos.

Recomendacao:

- Adicionar `limit`, `offset` ou paginacao cursor.
- Adicionar filtros em auditoria por contrato, tipo de evento, status, role e periodo.

### 4. Escopo de acesso ainda e global

Qualquer usuario autenticado pode listar todos os contratos, ler qualquer contrato, ver dashboard global e ler auditoria global.

Impacto:

- Para uma demo pode ser aceitavel.
- Para produto real, precisa de multi-tenant/escopo por orgao, contrato, papel ou permissao.

Recomendacao:

- Definir modelo de organizacao/tenant.
- Restringir leitura conforme perfil e relacao com contrato.

### 5. Wallet vinculada opcional enfraquece autorizacao

Em acoes de fluxo, se `supplier_wallet`, `logistics_wallet`, `inspector_wallet` ou `manager_wallet` estiverem vazias, a API aceita qualquer usuario com a role correta.

Impacto:

- Facilita demo e cadastro incompleto.
- Em producao, pode permitir que outro fornecedor/entregador/fiscal com mesma role aja sobre contrato alheio.

Recomendacao:

- Decidir se wallets devem ser obrigatorias para contratos reais.
- Pelo menos bloquear acoes de fluxo quando a wallet esperada estiver ausente em ambiente de producao.

### 6. Blockchain ainda e stub

O endpoint de status sempre retorna `registeredOnChain: false`, e registro on-chain retorna erro.

Impacto:

- Produto ainda nao entrega prova on-chain real.
- Frontend precisa esconder ou marcar essa acao como indisponivel.

Recomendacao:

- Manter claro na UI que e etapa futura.
- Quando smart contract existir, implementar service dedicado para integracao, retries, logs e persistencia de hash/tx.

### 7. Datas aceitam string manual

Datas chegam como string e sao parseadas manualmente com `datetime.fromisoformat`.

Impacto:

- Funciona, mas perde parte da validacao nativa do Pydantic.
- Pode gerar mensagens de erro menos padronizadas.

Recomendacao:

- Considerar usar `datetime` diretamente nos schemas Pydantic.

### 8. Atualizacao de contrato nao gera evento

Criacao e acoes de fluxo geram evento, mas `PATCH /contracts/{id}` nao gera evento de alteracao.

Impacto:

- Uma edicao em contrato ainda `CRIADO` pode mudar dados relevantes sem trilha auditavel detalhada.

Recomendacao:

- Criar evento de contrato atualizado, com resumo dos campos alterados.

### 9. Exclusao remove trilha junto

O relacionamento usa cascade e a migration usa `ondelete="CASCADE"` para eventos/disputas. Ao deletar contrato, eventos e disputas somem.

Impacto:

- Para auditoria real, apagar contrato pode apagar evidencia.
- No MVP, talvez esteja ok enquanto contrato so pode ser excluido em `CRIADO`.

Recomendacao:

- Avaliar soft delete.
- Ou manter eventos mesmo apos exclusao, dependendo da exigencia de auditoria.

### 10. Erro de blockchain usa 502 mesmo sendo funcionalidade desabilitada

`register-on-chain` retorna 502 `BLOCKCHAIN_ERROR`.

Impacto:

- 502 normalmente indica falha de upstream/gateway.
- Como a funcionalidade esta desabilitada por configuracao/fase, 501, 503 ou 409 poderiam comunicar melhor.

Recomendacao:

- Escolher status semantico para "nao implementado/habilitado".

## Estado atual do backend

O backend esta em um bom estado de MVP tecnico para:

- autenticar wallets reais;
- emitir token confiavel;
- proteger endpoints;
- operar contratos em banco real;
- registrar eventos de fluxo;
- expor dashboard e auditoria;
- alinhar o frontend a uma API real.

Ainda nao esta completo como produto final porque faltam:

- testes automatizados;
- escopo de acesso por organizacao/contrato;
- paginacao/filtros;
- auditoria de edicao;
- decisao sobre exclusao e retencao de historico;
- correcao de encoding;
- integracao blockchain real.

## Leitura final

Hoje o backend e mais do que mock: ele ja tem persistencia, autenticacao forte por assinatura EVM, regras de permissao e fluxo de contrato auditavel. A parte Web3, porem, esta limitada a autenticacao por wallet. O registro em blockchain e o smart contract ainda sao placeholders planejados para a proxima etapa.

Para evoluir com seguranca, a melhor proxima ordem seria:

1. Corrigir encoding e mensagens.
2. Adicionar testes dos fluxos criticos.
3. Ajustar frontend para login por wallet + JWT.
4. Adicionar filtros/paginacao.
5. Definir escopo de acesso.
6. Implementar smart contract e integracao on-chain quando o contrato estiver definido.
