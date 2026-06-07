# Feedback - Bloco 05: Alinhamento de Portas, CORS e Hosts

## 1. Resumo do que foi feito

Foi executado o Bloco 05 da Sessao 01, com foco em alinhar backend e frontend para comunicacao local.

Resultado:

```txt
Backend padronizado em http://127.0.0.1:8000
Frontend padronizado em http://localhost:3000
API base do frontend padronizada em http://127.0.0.1:8000
CORS validado para localhost:3000 e 127.0.0.1:3000
```

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/alinhamento_portas_cors_hosts.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_05_alinhamento_portas_cors_hosts.md
```

Tambem foi criado localmente, sem entrar no Git:

```txt
web/.env.local
```

## 3. Arquivos alterados

Arquivos versionados alterados:

```txt
backend/.env.example
backend/app/config.py
backend/docker-compose.yml
backend/README.md
web/.env.example
web/src/shared/config/env.ts
web/README.md
```

Arquivo local ignorado pelo Git alterado para validacao:

```txt
backend/.env
```

Arquivos pendentes fora do escopo permaneceram sem commit.

## 4. Configuracoes definidas

Backend:

```env
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
```

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Framework frontend:

```txt
Next.js
```

Vite:

```txt
Nao se aplica.
```

## 5. Validacoes executadas

Comandos executados:

```bash
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs --tail=120 api
npm run build
npm.cmd run build
```

Health check:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health
```

CORS:

```powershell
GET /health com Origin http://localhost:3000
GET /health com Origin http://127.0.0.1:3000
OPTIONS /health com Origin http://localhost:3000
OPTIONS /health com Origin http://127.0.0.1:3000
```

Frontend:

```txt
http://localhost:3000 -> HTTP 200
npm.cmd run build -> sucesso
Build Next leu .env.local
Bundle gerado contem http://127.0.0.1:8000
```

Validacoes nao executadas:

```txt
Console manual do navegador: nao executado; sem automacao de browser neste bloco.
Chamada visual frontend -> /health: nao executada; nao existe tela/service publico de health no frontend e criar uma feature nova estaria fora do escopo.
npm run dev como novo processo: nao iniciado; ja havia processo Next deste projeto respondendo em localhost:3000.
```

## 6. Resultado da comunicacao local

Resultado backend:

```txt
http://127.0.0.1:8000/health -> HTTP 200
```

Resposta:

```json
{"data":{"status":"ok","app":"FiscalizaPay API","environment":"development"}}
```

Resultado CORS:

```txt
http://localhost:3000 -> permitido
http://127.0.0.1:3000 -> permitido
```

Resultado frontend:

```txt
http://localhost:3000 -> HTTP 200
Aplicacao FiscalizaPay encontrada na resposta
```

Conclusao:

```txt
Comunicacao local esta preparada para a proxima etapa de integracao.
```

## 7. Problemas encontrados

### P1 - Bloqueantes

Nenhum.

### P2 - Alta prioridade

- Frontend usava `http://localhost:3001` como API base padrao.
  - Status: corrigido para `http://127.0.0.1:8000`.

- `.env` local do backend estava com `PORT=3005`.
  - Status: corrigido localmente para `PORT=8000`.

### P3 - Media prioridade

- CORS default do codigo nao incluia `http://127.0.0.1:3000`.
  - Status: corrigido.

- `ALLOWED_HOSTS` nao incluia `0.0.0.0`.
  - Status: corrigido.

- `127.0.0.1:3000` esta ocupado por outro processo Node local.
  - Status: documentado; URL recomendada permanece `http://localhost:3000`.

### P4 - Baixa prioridade

- PowerShell bloqueou `npm.ps1`.
  - Status: contornado com `npm.cmd run build`.

- `web/package-lock.json` segue marcado como modificado sem diff aparente.
  - Status: fora do escopo, nao commitado.

## 8. Pendencias classificadas

```txt
P3: validar fluxo de frontend com mocks desligados quando auth/JWT estiverem alinhados.
P3: validar console do navegador no bloco de integracao real.
P3: investigar processo externo ocupando 127.0.0.1:3000 se ele atrapalhar testes futuros.
P4: investigar web/package-lock.json marcado como modificado sem diff aparente.
```

## 9. Commit realizado

Commit realizado neste bloco:

```txt
chore: alinha portas cors e hosts para integracao local
```

Arquivos previstos no commit:

```txt
backend/.env.example
backend/app/config.py
backend/docker-compose.yml
backend/README.md
web/.env.example
web/src/shared/config/env.ts
web/README.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/alinhamento_portas_cors_hosts.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_05_alinhamento_portas_cors_hosts.md
```

## 10. Observacoes para o proximo bloco

O projeto esta pronto para o Bloco 06.

Focos recomendados:

```txt
Comparar regras frontend/backend.
Revisar divergencias de roles, actions e permissao visual.
Manter auth/JWT real fora do escopo ate o bloco correspondente.
```
