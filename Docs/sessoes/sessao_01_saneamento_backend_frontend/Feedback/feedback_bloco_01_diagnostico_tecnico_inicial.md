# Feedback — Bloco 01: Diagnóstico Técnico Inicial

## 1. Resumo do que foi feito

Foi executado o diagnóstico técnico inicial da Sessão 01 — Saneamento Backend/Frontend do FiscalizaPay Web3.

Atividades realizadas:

- Estrutura geral do projeto analisada.
- Backend analisado em rotas, serviços, autenticação, banco, migrations, Docker, CORS, hosts, seed e blockchain.
- Frontend analisado em stack, rotas, mocks, stores, services HTTP, wallet demo, regras visuais e envs.
- Integração frontend/backend comparada.
- Divergências e riscos documentados.
- Pendências classificadas em P1, P2, P3 e P4.
- Validações técnicas executadas sem implementar correções de código.

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/diagnostico_tecnico_inicial.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_01_diagnostico_tecnico_inicial.md
```

## 3. Arquivos alterados

Nenhum arquivo de código foi alterado neste bloco.

Foi criada a pasta:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/
```

Observação: antes deste bloco já havia alterações não relacionadas no working tree, incluindo `backend/docker-compose.yml`, `web/package-lock.json` e documentos de planejamento em `Docs/sessoes/`. O commit deste bloco deve incluir apenas os dois arquivos do Bloco 01 listados acima.

## 4. Validações executadas

Frontend:

```txt
npm.cmd install
Status: executado com sucesso.
Resultado: dependências já estavam atualizadas.
Observações: 24 vulnerabilidades moderadas reportadas pelo npm audit; warning de peer dependency envolvendo React 19.

npm.cmd run lint
Status: executado com sucesso.
Resultado: ESLint sem erros.

npm.cmd run build
Status: executado com sucesso.
Resultado: build Next.js concluído, TypeScript validado e rotas geradas.

npm.cmd run dev
Status: tentativa executada.
Resultado: a porta temporária não iniciou porque já existia um servidor Next rodando em localhost:3000.
Validação complementar: http://localhost:3000 respondeu HTTP 200.
```

Backend:

```txt
docker compose up -d --build
Status: executado com sucesso.
Resultado: containers fiscalizapay-db e fiscalizapay-api ficaram ativos.
Porta observada: 127.0.0.1:3005->3005/tcp.

alembic upgrade head
Status: executado com sucesso via container.
Comando: docker compose exec -T api alembic upgrade head.
Motivo: Python não está disponível no host.

python seed_demo_profiles.py
Status: não executado diretamente no host.
Motivo: Python não está disponível no host.
Validação equivalente: docker compose exec -T api python -m scripts.seed_demo_profiles.
Resultado: perfis demo criados com sucesso.

GET /health
Status: executado com sucesso.
URL: http://127.0.0.1:3005/health.
Resultado: HTTP 200 com {"status":"ok","app":"FiscalizaPay API","environment":"development"}.
```

## 5. Problemas encontrados

- Frontend não possui fluxo real de autenticação por wallet/JWT.
- Frontend não envia `Authorization: Bearer`.
- URL padrão do frontend aponta para `http://localhost:3001`, divergente do backend observado em `127.0.0.1:3005`.
- Regras visuais de disputa e fraude divergem das regras do backend.
- Wallets mockadas inválidas existem no frontend.
- Blockchain é simulada no frontend, mas está desabilitada no backend.
- Há textos com encoding quebrado em documentação, strings e mensagens.
- `web/.env.local` não existe no ambiente atual.
- `npm install` reportou 24 vulnerabilidades moderadas.
- Python não está disponível no host; validações backend dependeram de Docker.

## 6. Pendências classificadas

P1 — Bloqueantes:

- Nenhuma pendência P1 confirmada, pois backend e frontend passaram nas validações essenciais isoladas.

P2 — Alta prioridade:

- Implementar autenticação frontend real com nonce, assinatura, verify, JWT e `Authorization`.
- Alinhar porta/URL da API entre backend, frontend e documentação.
- Alinhar permissões visuais com `ACTION_ROLES` do backend.
- Corrigir wallets mockadas inválidas.
- Ajustar comportamento de blockchain enquanto `register-on-chain` estiver indisponível.
- Tratar explicitamente `401` e `403` no frontend.

P3 — Média prioridade:

- Corrigir encoding/mojibake.
- Ampliar CORS local se `127.0.0.1:3000` for origem suportada.
- Revisar vulnerabilidades npm.
- Invalidar auditoria após mutations que geram eventos.
- Usar filtro real de status no backend quando mocks estiverem desativados.
- Ajustar `lang="en"` para `pt-BR`.

P4 — Baixa prioridade:

- Padronizar estrutura DDAD.
- Melhorar documentação de mock versus API real.
- Padronizar scripts e comentários internos.

## 7. Commit realizado

Commit semântico realizado neste bloco:

```txt
docs: adiciona diagnostico tecnico inicial da sessao 01
```

## 8. Observações para o próximo bloco

O próximo bloco deve focar em encoding e mensagens, conforme planejamento da Sessão 01.

Recomendação prática:

- Corrigir primeiro textos user-facing do backend e frontend.
- Depois atualizar documentação essencial de setup.
- Evitar ainda implementar autenticação real no Bloco 02; isso deve ficar para a etapa específica de integração.
