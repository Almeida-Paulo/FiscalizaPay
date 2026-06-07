# Alinhamento de Portas, CORS e Hosts - Bloco 05

## 1. Resumo Executivo

O Bloco 05 alinhou a comunicacao local entre backend e frontend do FiscalizaPay Web3.

Padrao local definido:

```txt
Backend: http://127.0.0.1:8000
Frontend: http://localhost:3000
API base frontend: http://127.0.0.1:8000
```

Resultado geral:

- Backend configurado para rodar em `8000`.
- Docker Compose validado publicando `127.0.0.1:8000->8000/tcp`.
- CORS permite `http://localhost:3000` e `http://127.0.0.1:3000`.
- `ALLOWED_HOSTS` documentado com `localhost`, `127.0.0.1` e `0.0.0.0`.
- Frontend Next.js revisado para usar `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`.
- Build do frontend executado com sucesso.
- `/health` respondeu HTTP 200 na porta padrao.

Conclusao resumida:

```txt
Backend e frontend estao alinhados para comunicacao local futura.
```

## 2. Portas Identificadas

Portas do backend:

```txt
Porta recomendada: 8000
Porta observada apos ajuste: 8000
URL local validada: http://127.0.0.1:8000
Health check validado: http://127.0.0.1:8000/health
```

Portas do frontend:

```txt
Porta recomendada: 3000
URL local validada: http://localhost:3000
```

Observacao local:

- `localhost:3000` respondeu com a aplicacao Next.js do FiscalizaPay.
- `127.0.0.1:3000` respondeu por outro processo Node local (`node server/index.cjs`), fora do escopo do projeto validado.
- O backend aceita a origem alternativa `http://127.0.0.1:3000`, mas a URL operacional recomendada do frontend neste ambiente e `http://localhost:3000`.

## 3. Configuracao Backend

Arquivos analisados:

```txt
backend/.env.example
backend/.env
backend/app/config.py
backend/app/main.py
backend/Dockerfile
backend/docker-compose.yml
backend/README.md
```

Configuracao aplicada:

```env
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
```

Detalhes tecnicos:

- `backend/app/config.py` le `CORS_ORIGINS` como string separada por virgula.
- `cors_origin_list` remove espacos e ignora itens vazios.
- `allowed_host_list` usa a mesma estrategia.
- `CORSMiddleware` usa `settings.cors_origin_list`.
- `TrustedHostMiddleware` so e aplicado quando `ENVIRONMENT=production`.
- Em desenvolvimento, `ALLOWED_HOSTS` fica documentado e pronto para producao, mas nao bloqueia requests locais.

## 4. Configuracao Frontend

Arquivos analisados:

```txt
web/.env.example
web/.env.local
web/package.json
web/next.config.ts
web/README.md
web/src/shared/config/env.ts
web/src/shared/api/http-client.ts
```

Framework identificado:

```txt
Next.js 16 App Router
```

Porta de desenvolvimento:

```txt
npm run dev -> next dev -> http://localhost:3000
```

Variavel publica definida:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Observacao:

- O projeto nao usa Vite.
- Portanto, `VITE_API_BASE_URL` nao se aplica.
- `NEXT_PUBLIC_API_BASE_URL` e a variavel correta para este frontend.

## 5. CORS_ORIGINS

Valor padrao local:

```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Validacoes executadas:

```txt
GET /health com Origin http://localhost:3000 -> HTTP 200, allow-origin correto
GET /health com Origin http://127.0.0.1:3000 -> HTTP 200, allow-origin correto
OPTIONS /health com Origin http://localhost:3000 -> HTTP 200, allow-origin correto
OPTIONS /health com Origin http://127.0.0.1:3000 -> HTTP 200, allow-origin correto
```

Conclusao:

```txt
CORS local esta funcional para as duas origens previstas.
```

## 6. ALLOWED_HOSTS

Valor padrao local:

```env
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0
```

Comportamento atual:

- A configuracao existe no backend.
- O parsing de multiplos hosts funciona por virgula.
- O middleware de hosts confiaveis e ativado apenas em `production`.

Conclusao:

```txt
ALLOWED_HOSTS esta revisado e documentado para o ambiente local, sem criar mecanismo adicional desnecessario em desenvolvimento.
```

## 7. API Base URL

Valor definido no frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Arquivos ajustados:

```txt
web/.env.example
web/src/shared/config/env.ts
web/README.md
```

Fluxo atual do client HTTP:

```txt
web/src/shared/config/env.ts -> env.apiBaseUrl
web/src/shared/api/http-client.ts -> `${env.apiBaseUrl}${path}`
services em web/src/shared/api/* -> httpClient
hooks TanStack Query -> services
```

URL antiga removida dos pontos revisados:

```txt
http://localhost:3001
```

Conclusao:

```txt
O frontend agora aponta para o backend local padrao em http://127.0.0.1:8000.
```

## 8. Validacoes Executadas

### Docker Compose

Comando:

```bash
docker compose config
```

Resultado:

```txt
Status: sucesso
API publicada em 127.0.0.1:8000->8000/tcp
PORT efetivo: 8000
CORS_ORIGINS efetivo: http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS efetivo: localhost,127.0.0.1,0.0.0.0
```

Comando:

```bash
docker compose up -d --build
```

Resultado:

```txt
Status: sucesso
Imagem backend-api reconstruida
Container fiscalizapay-api recriado
Container fiscalizapay-db healthy
```

### Health Check

Comando:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health
```

Resultado:

```txt
HTTP 200
{"data":{"status":"ok","app":"FiscalizaPay API","environment":"development"}}
```

### CORS

Comandos equivalentes:

```powershell
Invoke-WebRequest http://127.0.0.1:8000/health -Headers @{ Origin = "http://localhost:3000" }
Invoke-WebRequest http://127.0.0.1:8000/health -Headers @{ Origin = "http://127.0.0.1:3000" }
Invoke-WebRequest -Method Options http://127.0.0.1:8000/health -Headers @{ Origin = "http://localhost:3000"; "Access-Control-Request-Method" = "GET" }
Invoke-WebRequest -Method Options http://127.0.0.1:8000/health -Headers @{ Origin = "http://127.0.0.1:3000"; "Access-Control-Request-Method" = "GET" }
```

Resultado:

```txt
Todos retornaram HTTP 200 com Access-Control-Allow-Origin esperado.
```

### Frontend

Primeira tentativa:

```bash
npm run build
```

Resultado:

```txt
Status: falhou no PowerShell
Motivo: execution policy bloqueou npm.ps1
Impacto: nao bloqueante
Mitigacao: usar npm.cmd
```

Comando executado:

```bash
npm.cmd run build
```

Resultado:

```txt
Status: sucesso
Next.js 16.2.6
Environments: .env.local
Compiled successfully
TypeScript concluido
9 paginas geradas
```

Validacao do frontend local:

```txt
http://localhost:3000 -> HTTP 200
Marcador FiscalizaPay encontrado na resposta
```

Validacao da API base compilada:

```txt
Build gerado contem http://127.0.0.1:8000
Nenhuma referencia antiga a http://localhost:3001 permaneceu nos arquivos revisados.
```

### Logs

Logs recentes da API:

```txt
Gunicorn ouvindo em http://0.0.0.0:8000
Workers Uvicorn iniciados
Application startup complete
Sem ERROR/CRITICAL/Traceback/FATAL nos logs recentes consultados
```

### Validacoes nao executadas

Verificacao manual do console do navegador:

```txt
Status: nao executado
Motivo: nao havia automacao de navegador configurada neste bloco e nao foi implementada feature nova de health no frontend.
Impacto: baixo, pois CORS foi validado por headers Origin/OPTIONS e o frontend respondeu HTTP 200.
```

Chamada frontend visual para `/health`:

```txt
Status: nao executado
Motivo: o frontend nao possui tela ou service publico existente para `/health`; criar UI nova estaria fora do escopo.
Impacto: baixo para o Bloco 05; a base URL e o CORS foram validados tecnicamente.
```

## 9. Problemas Encontrados

### P1 - Bloqueantes

Nenhum P1 encontrado.

Justificativa:

- Backend responde em `http://127.0.0.1:8000/health`.
- CORS permite as origens locais esperadas.
- Frontend responde em `http://localhost:3000`.
- Build do frontend passa.

### P2 - Alta prioridade

- Frontend apontava por padrao para `http://localhost:3001`.
  - Impacto: API base local divergente do backend validado.
  - Status: corrigido.

- Backend local estava efetivamente subindo em `3005` por valor do `.env` local.
  - Impacto: divergencia com o padrao recomendado `8000`.
  - Status: corrigido no `.env` local ignorado pelo Git.

### P3 - Media prioridade

- Default de `CORS_ORIGINS` no backend aceitava apenas `http://localhost:3000`.
  - Impacto: origem alternativa `http://127.0.0.1:3000` nao estava coberta pelo default de codigo.
  - Status: corrigido.

- `ALLOWED_HOSTS` nao incluia `0.0.0.0`.
  - Impacto: documentacao local incompleta para o padrao pedido.
  - Status: corrigido.

- `127.0.0.1:3000` esta ocupado por outro processo Node local.
  - Impacto: neste ambiente, a URL operacional do frontend e `http://localhost:3000`.
  - Status: documentado.

### P4 - Baixa prioridade

- O PowerShell bloqueia `npm.ps1`.
  - Impacto: `npm run build` falha nesse shell.
  - Mitigacao: usar `npm.cmd run build`.

- `web/package-lock.json` permanece marcado como modificado no worktree, mas sem diff de conteudo observado nesta validacao.
  - Impacto: fora do escopo do Bloco 05.
  - Status: nao alterado nem commitado neste bloco.

## 10. Correcoes Realizadas

Backend:

```txt
backend/.env.example
backend/app/config.py
backend/docker-compose.yml
backend/README.md
backend/.env local ignorado pelo Git
```

Frontend:

```txt
web/.env.example
web/.env.local local ignorado pelo Git
web/src/shared/config/env.ts
web/README.md
```

Correcoes principais:

- Backend local padronizado em `8000`.
- Docker Compose validado com `127.0.0.1:8000->8000/tcp`.
- CORS alinhado com as origens locais `localhost:3000` e `127.0.0.1:3000`.
- Hosts locais documentados com `localhost`, `127.0.0.1` e `0.0.0.0`.
- Frontend Next.js ajustado para usar `NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000`.
- Documentacao de backend e frontend atualizada com URLs locais.

## 11. Pendencias

Pendencias classificadas:

```txt
P3: verificar e encerrar, se necessario, o processo Node externo que responde em 127.0.0.1:3000 neste ambiente.
P3: validar em navegador real/console durante o bloco de integracao, quando houver chamada visual para endpoint publico ou fluxo autenticado.
P3: no bloco seguinte, revisar endpoints reais consumidos pelo frontend com mocks desligados e JWT/auth ainda pendentes.
P4: investigar a marcacao de web/package-lock.json como modificado sem diff aparente.
```

## 12. Conclusao Tecnica

O alinhamento local foi concluido com sucesso.

Estado final recomendado:

```txt
Backend local: http://127.0.0.1:8000
Frontend local: http://localhost:3000
CORS local: http://localhost:3000,http://127.0.0.1:3000
API base frontend: http://127.0.0.1:8000
```

Decisao tecnica:

```txt
APROVADO PARA SEGUIR PARA O BLOCO 06 - ALINHAMENTO DE REGRAS FRONTEND/BACKEND
```
