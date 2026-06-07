# Diagnóstico Técnico Inicial — Sessão 01

## 1. Resumo Executivo

Este diagnóstico executa o Bloco 01 da Sessão 01 — Saneamento Backend/Frontend do FiscalizaPay Web3.

O projeto está dividido em:

- `backend/`: API FastAPI com PostgreSQL, SQLAlchemy, Alembic, autenticação por wallet EVM e JWT.
- `web/`: frontend Next.js com MVP visual/demo funcional, mocks, TanStack Query e base Web3 com wagmi/RainbowKit.
- `Docs/`: documentação técnica, contratos, análises e planejamento DDAD.

Estado geral encontrado:

- O backend sobe via Docker e respondeu `GET /health` com sucesso.
- As migrations Alembic executaram com sucesso via container.
- O seed de perfis demo executou com sucesso via container.
- O frontend instalou dependências, passou em lint e build.
- Um servidor Next já estava rodando em `http://localhost:3000` e respondeu `200`.
- A integração real ainda não está pronta, principalmente porque o frontend não implementa o fluxo de autenticação real por wallet/JWT exigido pelo backend.
- A porta real observada do backend no ambiente atual é `127.0.0.1:3005`, enquanto a documentação original e `.env.example` ainda apontam para cenários diferentes (`8000` no backend e `3001` no frontend).
- Há problemas visíveis de encoding/mojibake em arquivos de documentação e mensagens user-facing.

Nível de prontidão atual:

- Backend isolado: bom para MVP técnico local.
- Frontend isolado: bom para MVP visual/demo.
- Integração real frontend/backend: ainda não pronta.

## 2. Estado Atual do Backend

Framework e stack:

- Python 3.12 em Docker.
- FastAPI.
- SQLAlchemy 2.
- Alembic.
- PostgreSQL 16 via Docker Compose.
- PyJWT.
- `eth-account` para assinatura EVM.
- Gunicorn com worker Uvicorn.

Estrutura relevante:

```txt
backend/
  app/
    main.py
    config.py
    database.py
    deps.py
    errors.py
    models.py
    schemas.py
    security.py
    serializers.py
    routers/
      auth.py
      contracts.py
      dashboard.py
      audit.py
    services/
      auth.py
      contracts.py
  alembic/
    versions/0001_initial_schema.py
  scripts/
    seed_demo_profiles.py
    create_profile.py
  Dockerfile
  docker-compose.yml
  .env.example
  .env
```

Configuração:

- Existe `backend/.env.example`.
- Existe `backend/.env` local. O conteúdo não foi exposto neste diagnóstico por poder conter segredo.
- `Settings` lê `.env` via `pydantic-settings`.
- Variáveis principais:
  - `APP_NAME`
  - `ENVIRONMENT`
  - `PORT`
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `JWT_EXPIRES_MINUTES`
  - `CORS_ORIGINS`
  - `ALLOWED_HOSTS`
  - `AUTH_NONCE_EXPIRES_MINUTES`
  - `CHAIN_ID`
  - `EXPLORER_URL`
  - `CONTRACT_ADDRESS`
  - `BLOCKCHAIN_ENABLED`

Porta:

- `Settings.port` tem padrão `8000`.
- `backend/.env.example` usa `PORT=8000`.
- O `docker-compose.yml` atual usa `${PORT:-8000}` para bind e Gunicorn.
- Na validação local, o container ficou publicado em `127.0.0.1:3005->3005/tcp`, indicando que o `.env` local define `PORT=3005`.

Banco e migrations:

- Banco: PostgreSQL.
- Migration inicial existe em `alembic/versions/0001_initial_schema.py`.
- Tabelas criadas:
  - `profiles`
  - `auth_nonces`
  - `contracts`
  - `contract_events`
  - `disputes`
- Constraints de role, status, event type e valor positivo existem.

Seed:

- Existe `scripts/seed_demo_profiles.py`.
- O seed cria perfis demo para:
  - `GESTOR`
  - `FORNECEDOR`
  - `ENTREGADOR`
  - `FISCAL`
  - `AUDITOR`
- As wallets do seed seguem formato EVM válido.

Autenticação:

- Existe `GET /auth/nonce`.
- Existe `POST /auth/verify`.
- Existe `GET /auth/me`.
- Backend gera nonce, monta mensagem de login, valida assinatura EVM e emite JWT.
- O backend busca a role confiável a partir da tabela `profiles`.
- Endpoints protegidos usam `get_current_profile`, `HTTPBearer` e JWT.

Endpoints principais:

```txt
GET /health

GET /auth/nonce
POST /auth/verify
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

Regras de permissões backend:

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

Blockchain:

- `BLOCKCHAIN_ENABLED` existe e o `.env.example` define `false`.
- `GET /contracts/{id}/blockchain-status` retorna `registeredOnChain: false`.
- `POST /contracts/{id}/register-on-chain` exige gestor, mas retorna erro `BLOCKCHAIN_ERROR`, porque smart contract ainda não está configurado.

CORS e hosts:

- CORS é configurado em `app/main.py`.
- `allow_headers` inclui `Authorization`.
- `CORS_ORIGINS` no `.env.example` contém `http://localhost:3000`.
- `ALLOWED_HOSTS` no `.env.example` contém `localhost,127.0.0.1`.
- `TrustedHostMiddleware` só é aplicado em produção.

Riscos backend identificados:

- Mensagens com encoding quebrado aparecem em respostas e documentação.
- Porta local real pode divergir do padrão documentado.
- `register-on-chain` existe no contrato da API, mas ainda não opera blockchain real.
- A validação local depende de Docker, pois Python não está disponível no host.

## 3. Estado Atual do Frontend

Framework e stack:

- Next.js 16.2.6 com App Router.
- React 19.2.4.
- TypeScript.
- TailwindCSS v4.
- shadcn/ui/Radix UI.
- TanStack Query v5.
- Zustand.
- React Hook Form + Zod.
- wagmi, viem e RainbowKit.
- Sonner.
- Lucide React.

Estrutura relevante:

```txt
web/
  src/
    app/
    widgets/
    features/
    entities/
    shared/
      api/
      config/
      constants/
      lib/
      mocks/
      types/
      ui/
```

Rotas principais:

```txt
/
/dashboard
/contracts
/contracts/new
/contracts/[id]
/disputes
/audit
```

Configuração de ambiente:

- Existe `web/.env.example`.
- Não existe `web/.env.local` no momento do diagnóstico.
- `NEXT_PUBLIC_API_BASE_URL` padrão no código: `http://localhost:3001`.
- `NEXT_PUBLIC_API_BASE_URL` no `.env.example`: `http://localhost:3001`.
- `NEXT_PUBLIC_USE_MOCKS` padrão: `true`, a menos que `NEXT_PUBLIC_USE_MOCKS=false` ou `NEXT_PUBLIC_ENABLE_MOCKS=false`.
- Chain padrão: `80002` (Polygon Amoy).
- Explorer padrão: `https://amoy.polygonscan.com`.

Modo mock/demo:

- Mocks estão ativos por padrão.
- O `mockStore` mantém contratos, eventos e status blockchain em memória.
- As mutations atualizam o mockStore e invalidam queries.
- O estado mockado reseta ao recarregar a página.

HTTP client:

- Existe `shared/api/http-client.ts`.
- Possui timeout de 10 segundos.
- Normaliza erros em `HttpClientError`.
- Possui métodos `get`, `post`, `patch` e `delete`.
- Não injeta `Authorization: Bearer`.
- Não existe tratamento especial para 401/403 além de exibir a mensagem de erro.

Services:

- `contracts-api.ts` cobre contratos, actions, eventos e auditoria.
- `dashboard-api.ts` cobre summary.
- `blockchain-api.ts` cobre status e registro on-chain.
- Os services alternam entre mocks e API real com `env.useMocks`.

Autenticação frontend:

- Não foi encontrada camada `auth-api`.
- Não foram encontradas chamadas para `/auth/nonce`, `/auth/verify` ou `/auth/me`.
- Não foi encontrado uso de `Authorization` ou `Bearer` no cliente HTTP.
- Não foi encontrado armazenamento de `accessToken`.
- Não foi encontrado fluxo real de assinatura de mensagem.

Wallet:

- Existe configuração wagmi/RainbowKit em `shared/config/web3.ts` e providers globais.
- A UI atual de wallet usa `useWalletStore`, que é explicitamente demo/visual.
- `WalletConnectButton` chama `connectMockWallet()`.
- Não há login real com MetaMask/backend no fluxo atual.

Regras visuais frontend:

```txt
canConfirmShipment: FORNECEDOR + CRIADO
canConfirmDelivery: ENTREGADOR + ENVIADO
canValidateReceipt: FISCAL + ENTREGUE
canAuthorizePayment: GESTOR + VALIDADO
canOpenDispute: GESTOR, FISCAL, FORNECEDOR, ENTREGADOR
canSimulateFraud: GESTOR, FISCAL
```

Wallets mockadas:

- Foram encontradas wallets inválidas em mocks:
  - `0xLogistica...`
  - `0xAuditor...`
  - `walletAddress: undefined` para auditor no profile store.
- Essas wallets funcionam visualmente, mas quebram validação EVM real.

Riscos frontend identificados:

- API base padrão aponta para `http://localhost:3001`, mas o backend validado está em `http://127.0.0.1:3005` no ambiente atual.
- Login real não existe.
- JWT não é salvo nem enviado.
- Regras visuais divergem do backend para disputa/fraude.
- `register-on-chain` é simulável em mock, mas falha no backend real.
- Vários textos têm encoding quebrado.
- `html lang` está como `en` embora a UI esteja em português.
- `npm install` reportou 24 vulnerabilidades moderadas.
- Há warning de peer dependency envolvendo React 19 e `use-sync-external-store` dentro de `valtio`.

## 4. Estado Atual da Integração

Compatibilidade de rotas:

- As rotas de contratos, actions, dashboard, blockchain status e auditoria esperadas pelo frontend existem no backend.
- Os modelos principais estão em camelCase na API, compatíveis com os tipos do frontend.
- O backend aceita filtro `GET /contracts?status=...`, mas o hook `useContracts(status)` atualmente busca todos e filtra no cliente.

Portas e URL:

- Frontend dev observado: `http://localhost:3000`.
- Backend Docker observado: `http://127.0.0.1:3005`.
- Frontend `.env.example`: `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`.
- Backend `.env.example`: `PORT=8000`.
- Há desalinhamento entre porta documentada do backend, porta real atual e URL padrão do frontend.

CORS:

- Backend permite `http://localhost:3000` no `.env.example`.
- Frontend observado usa `http://localhost:3000`, então a origem local principal está coerente.
- `http://127.0.0.1:3000` não aparece no `.env.example`, embora seja comum em testes locais.

Autenticação:

- Backend exige JWT para quase todos os endpoints de negócio.
- Frontend não implementa login por nonce/signature/JWT.
- Frontend não envia `Authorization: Bearer`.
- Portanto, ao desativar mocks, chamadas protegidas tendem a retornar `401`.

Wallet:

- Backend espera assinatura EVM de mensagem com nonce.
- Frontend tem wallet demo visual e providers Web3, mas não conecta isso ao backend.
- O fluxo atual de wallet não é compatível com o fluxo real do backend.

Permissões:

- Backend é fonte da verdade.
- Frontend diverge em disputa e fraude:
  - Backend: disputa para `GESTOR`, `FISCAL`, `AUDITOR`.
  - Frontend: disputa para `GESTOR`, `FISCAL`, `FORNECEDOR`, `ENTREGADOR`.
  - Backend: fraude para `GESTOR`, `FISCAL`, `AUDITOR`.
  - Frontend: fraude para `GESTOR`, `FISCAL`.

Blockchain:

- Frontend mocka registro on-chain com tx hash.
- Backend real mantém blockchain desabilitada e retorna `BLOCKCHAIN_ERROR` em `register-on-chain`.
- A UI deve ocultar, desabilitar ou explicar a indisponibilidade em modo API real.

## 5. Divergências Encontradas

1. URL/porta da API:
   - Backend validado localmente em `127.0.0.1:3005`.
   - Backend `.env.example` sugere `8000`.
   - Frontend `.env.example` e fallback usam `localhost:3001`.

2. Autenticação:
   - Backend exige JWT.
   - Frontend não possui fluxo de auth real nem envio de token.

3. Wallet:
   - Backend usa wallet real com nonce e assinatura.
   - Frontend usa wallet demo via Zustand.

4. Regras de disputa:
   - Backend permite `GESTOR`, `FISCAL`, `AUDITOR`.
   - Frontend permite `GESTOR`, `FISCAL`, `FORNECEDOR`, `ENTREGADOR`.

5. Regras de simulação de fraude:
   - Backend permite `GESTOR`, `FISCAL`, `AUDITOR`.
   - Frontend permite `GESTOR`, `FISCAL`.

6. Wallets mockadas:
   - Backend seed usa wallets EVM válidas.
   - Frontend mocks ainda contêm wallets textuais inválidas.

7. Blockchain:
   - Frontend simula registro on-chain com sucesso.
   - Backend retorna erro porque smart contract ainda não está configurado.

8. Encoding:
   - Há textos quebrados em README, docs, mensagens backend e strings frontend.

9. CORS local ampliado:
   - Backend `.env.example` permite `localhost:3000`, mas não inclui `127.0.0.1:3000`.

10. Ambiente frontend:
   - Não existe `web/.env.local`; o frontend depende dos fallbacks/build-time envs.

## 6. Riscos Técnicos

- Risco de `401` em todas as chamadas reais protegidas porque o frontend não envia JWT.
- Risco de `403` por regras visuais divergentes entre frontend e backend.
- Risco de chamadas para porta errada ao desativar mocks.
- Risco de erro de CORS se o frontend for acessado por origem diferente da configurada.
- Risco de quebra no login real por wallets mockadas inválidas.
- Risco de UX confusa em blockchain: frontend promete registro on-chain, backend ainda não entrega.
- Risco de mensagens ilegíveis por encoding quebrado.
- Risco operacional moderado pelas vulnerabilidades reportadas pelo `npm install`.
- Risco de dependência do Docker para validações backend, já que Python não está disponível no host.

## 7. Pendências por Prioridade

### P1 — Bloqueantes

Nenhum P1 confirmado neste diagnóstico.

Justificativa:

- Backend subiu via Docker.
- Migrations executaram.
- Seed executou.
- `/health` respondeu `200`.
- Frontend instalou dependências, passou em lint e build.

### P2 — Alta prioridade

- Implementar autenticação frontend real com:
  - `GET /auth/nonce`
  - assinatura de mensagem
  - `POST /auth/verify`
  - persistência de `accessToken`
  - `GET /auth/me`
  - header `Authorization: Bearer`.
- Alinhar URL/porta da API entre `backend/.env.example`, `web/.env.example`, docs e ambiente local.
- Alinhar regras visuais de `open_dispute` e `simulate_fraud` com o backend.
- Corrigir wallets mockadas inválidas no frontend.
- Definir comportamento do botão `register-on-chain` enquanto blockchain real está desabilitada.
- Garantir tratamento explícito para `401` e `403` no frontend.

### P3 — Média prioridade

- Corrigir encoding/mojibake em documentação, mensagens backend e strings frontend.
- Incluir `http://127.0.0.1:3000` em CORS local, se essa origem for suportada oficialmente.
- Criar `web/.env.local` local a partir do exemplo durante setup, sem versionar segredos.
- Revisar `npm audit` e vulnerabilidades moderadas.
- Invalidar `queryKeys.auditEvents` nas mutations que geram eventos.
- Usar o filtro backend `GET /contracts?status=...` quando mocks estiverem desativados.
- Trocar `html lang="en"` para `pt-BR`.

### P4 — Baixa prioridade

- Padronizar estrutura DDAD entre `Blocos`/`Feedback` e a estrutura planejada com `planejamento/blocos`, `feedback`, `bugs`, `analises`.
- Padronizar nomes de scripts `developer`/`production` versus `dev`/`build`, mantendo aliases se forem úteis.
- Melhorar documentação interna sobre quando usar mocks versus API real.
- Revisar comentários com encoding quebrado em arquivos fonte.

## 8. Recomendações para os Próximos Blocos

Bloco 02 — Correção de encoding e mensagens:

- Corrigir textos quebrados primeiro, porque afetam UI, docs e respostas da API.
- Priorizar mensagens user-facing e documentação de setup.

Bloco 03 — Configuração backend `.env.example`:

- Conferir `PORT`, `CORS_ORIGINS`, `ALLOWED_HOSTS`, `DATABASE_URL`, `JWT_SECRET` e flags de blockchain.
- Documentar a porta local oficial.

Bloco 04 — Validação Docker, migrations e seed:

- Manter a validação via Docker documentada.
- Registrar que Python não está disponível no host atual.
- Confirmar idempotência do seed em execuções repetidas.

Bloco 05 — Portas, CORS e hosts:

- Decidir porta oficial local do backend.
- Atualizar frontend para apontar à URL real escolhida.
- Validar CORS com frontend em `localhost:3000`.

Bloco 06 — Regras frontend/backend:

- Backend deve continuar como fonte da verdade.
- Ajustar permissões visuais de disputa/fraude.

Bloco 07 — Wallets mockadas:

- Substituir todas as wallets textuais por endereços EVM válidos.
- Manter coerência com perfis seed quando possível.

Bloco 08 — Relatório de prontidão:

- Só aprovar Sessão 02 depois que auth/JWT, portas, CORS, roles e wallets estiverem saneados.

## 9. Conclusão Técnica

O FiscalizaPay Web3 possui uma boa base técnica separada em backend e frontend. O backend está funcional via Docker, com banco, migrations, seed, healthcheck, autenticação por wallet e JWT. O frontend está funcional como MVP visual/demo, com rotas, mocks, actions, auditoria e build saudável.

O principal bloqueio para integração real não é a existência das rotas, mas a ausência do fluxo de autenticação no frontend. Enquanto o frontend não autenticar por wallet, não armazenar JWT e não enviar `Authorization: Bearer`, a API real protegida não poderá ser consumida corretamente.

Portas/envs, regras de roles, wallets mockadas e encoding devem ser saneados antes da Sessão 02. A recomendação é seguir a ordem planejada da Sessão 01 sem iniciar integração real neste bloco.

Validações executadas:

```txt
npm.cmd install: sucesso, com 24 vulnerabilidades moderadas e warning peer dependency.
npm.cmd run lint: sucesso.
npm.cmd run build: sucesso.
npm.cmd run dev: tentativa em porta temporária detectou servidor Next já ativo em localhost:3000; servidor existente respondeu 200.
docker compose up -d --build: sucesso.
alembic upgrade head: sucesso via docker compose exec -T api.
python seed_demo_profiles.py: não executado no host porque Python não está disponível; equivalente executado com sucesso via docker compose exec -T api python -m scripts.seed_demo_profiles.
GET /health: sucesso em http://127.0.0.1:3005/health, status 200.
```
