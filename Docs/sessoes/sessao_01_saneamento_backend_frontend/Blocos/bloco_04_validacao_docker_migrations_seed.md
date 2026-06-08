# Bloco 04 — Validação Docker, Migrations e Seed

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Tipo:** Planejamento de implementação  
**Status:** Planejado  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `bloco_04_validacao_docker_migrations_seed`

---

# 1. Objetivo do Bloco

Validar se o backend do FiscalizaPay consegue subir corretamente em ambiente local usando Docker/Docker Compose, executar migrations, popular dados iniciais via seed e responder aos endpoints mínimos de saúde e operação.

Este bloco é essencial antes da integração com o frontend, pois garante que a API, o banco de dados e a estrutura inicial do backend estão funcionando de forma reproduzível.

---

# 2. Contexto

Após os blocos anteriores da Sessão 01, o backend deve estar com:

```txt
- encoding corrigido;
- mensagens e documentação ajustadas;
- .env.example revisado;
- variáveis mínimas documentadas;
- configuração inicial mais confiável.
```

Agora o foco é validar a execução prática do ambiente.

O objetivo não é criar novas features, mas confirmar se o backend sobe, conecta no banco, executa migrations e permite teste mínimo com dados iniciais.

---

# 3. Resultado Esperado

Ao final deste bloco, deve existir evidência de que:

```txt
- Docker Compose executa corretamente;
- PostgreSQL local sobe sem erro crítico;
- backend FastAPI sobe corretamente;
- migrations Alembic executam até o estado final;
- seed demo executa sem quebrar;
- endpoint /health responde corretamente;
- erros encontrados foram documentados;
- ambiente está pronto para os próximos alinhamentos da Sessão 01.
```

---

# 4. Escopo do Bloco

## 4.1 Incluído neste bloco

```txt
- validar docker-compose.yml;
- validar Dockerfile do backend, se existir;
- validar subida do banco PostgreSQL;
- validar subida da API;
- validar variáveis de ambiente utilizadas no Docker;
- rodar migrations com Alembic;
- rodar seed demo;
- testar endpoint /health;
- registrar problemas encontrados;
- documentar comandos utilizados;
- gerar feedback final em Markdown;
- realizar commit semântico ao final.
```

## 4.2 Fora do escopo deste bloco

```txt
- integração com frontend;
- ajuste de CORS definitivo;
- deploy remoto;
- configuração de Vercel;
- criação de smart contract;
- integração blockchain real;
- mudança de regras de negócio;
- criação de novas telas;
- refatoração ampla de arquitetura.
```

---

# 5. Pré-Análise Obrigatória

Antes de executar qualquer alteração, analisar:

```txt
- estrutura atual do backend;
- existência de docker-compose.yml;
- existência de Dockerfile;
- existência de alembic.ini;
- pasta de migrations;
- scripts de seed disponíveis;
- README do backend;
- variáveis usadas no ambiente;
- nomes dos serviços no docker-compose;
- portas expostas;
- dependências necessárias para subir a API.
```

Também verificar se há divergência entre o `.env.example` criado/revisado no Bloco 03 e o que o Docker realmente utiliza.

---

# 6. Tarefas de Implementação

## 6.1 Validar estrutura Docker

Verificar se existem arquivos como:

```txt
docker-compose.yml
Dockerfile
.dockerignore
```

Caso existam, validar:

```txt
- serviços declarados;
- nome do serviço backend/API;
- nome do serviço PostgreSQL;
- portas expostas;
- volumes;
- networks;
- variáveis de ambiente;
- comando de inicialização;
- dependências entre serviços;
- healthcheck, se existir.
```

Caso algum arquivo esteja ausente ou incompleto, registrar no feedback e aplicar somente ajustes mínimos necessários para o ambiente subir.

---

## 6.2 Validar subida do ambiente local

Executar:

```bash
docker compose up --build
```

Ou, se o projeto utilizar outro padrão:

```bash
docker-compose up --build
```

Validar se:

```txt
- o banco sobe sem erro;
- o backend sobe sem erro;
- a porta da API está acessível;
- o container não reinicia em loop;
- logs não mostram erro crítico de conexão com banco;
- logs não mostram erro crítico de variável ausente.
```

---

## 6.3 Validar conexão com banco

Confirmar se a API consegue conectar no PostgreSQL usando a variável:

```env
DATABASE_URL=
```

Validar se:

```txt
- host do banco está correto para ambiente Docker;
- usuário e senha estão corretos;
- nome do database está correto;
- porta está correta;
- backend não tenta acessar localhost de forma incorreta dentro do container.
```

Observação importante:

Dentro do Docker, o backend normalmente deve acessar o banco pelo nome do serviço, por exemplo:

```txt
postgres
```

E não por:

```txt
localhost
```

---

## 6.4 Executar migrations

Executar o comando de migrations conforme padrão do projeto.

Comando esperado:

```bash
alembic upgrade head
```

Se for necessário executar dentro do container:

```bash
docker compose exec backend alembic upgrade head
```

Ou ajustar o nome do serviço conforme o projeto:

```bash
docker compose exec api alembic upgrade head
```

Validar:

```txt
- migrations executam sem erro;
- tabelas são criadas no banco;
- não há conflito de revision;
- não há erro de import;
- não há erro de DATABASE_URL;
- não há erro de enum/tipos.
```

---

## 6.5 Validar seed demo

Localizar e executar o script de seed do projeto.

Script esperado no planejamento geral:

```bash
seed_demo_profiles.py
```

Executar conforme estrutura real do backend, por exemplo:

```bash
python seed_demo_profiles.py
```

Ou dentro do container:

```bash
docker compose exec backend python seed_demo_profiles.py
```

Validar:

```txt
- seed executa sem erro;
- perfis demo são criados;
- wallets demo são válidas;
- dados não duplicam de forma problemática;
- seed pode ser reexecutado sem quebrar, se possível;
- dados mínimos para teste da API ficam disponíveis.
```

Caso o seed não seja idempotente, registrar no feedback como risco ou pendência.

---

## 6.6 Testar endpoint de saúde

Com o backend rodando, testar:

```bash
curl http://127.0.0.1:8000/health
```

Ou acessar no navegador/Postman/Insomnia:

```txt
http://127.0.0.1:8000/health
```

Validar:

```txt
- status HTTP 200;
- resposta simples e clara;
- API realmente está acessível;
- endpoint não depende de autenticação;
- endpoint funciona após migrations e seed.
```

---

## 6.7 Registrar comandos finais validados

Documentar no feedback os comandos que funcionaram, por exemplo:

```bash
docker compose up --build
alembic upgrade head
python seed_demo_profiles.py
curl http://127.0.0.1:8000/health
```

Se comandos precisarem ser executados dentro do container, registrar a versão correta.

---

# 7. Validação Técnica

Ao final da execução, validar:

```txt
[ ] Docker Compose executa sem erro crítico
[ ] PostgreSQL sobe corretamente
[ ] Backend sobe corretamente
[ ] Backend conecta no banco
[ ] Alembic executa até head
[ ] Tabelas são criadas corretamente
[ ] Seed demo executa corretamente
[ ] /health responde HTTP 200
[ ] Logs foram revisados
[ ] Problemas encontrados foram documentados
```

---

# 8. Critérios de Aceite

O bloco será considerado concluído quando:

```txt
[ ] O ambiente backend sobe localmente via Docker
[ ] O banco PostgreSQL está funcional
[ ] As migrations foram executadas com sucesso
[ ] O seed demo foi executado ou sua falha foi documentada com causa clara
[ ] O endpoint /health foi validado
[ ] Os comandos validados foram registrados
[ ] O feedback do bloco foi criado em Markdown
[ ] O commit semântico foi realizado ao final do bloco
```

---

# 9. Possíveis Problemas e Mitigações

## 9.1 DATABASE_URL incorreta

Problema:

```txt
Backend não conecta no PostgreSQL.
```

Mitigação:

```txt
Verificar se a URL usa o nome do serviço Docker e não localhost dentro do container.
```

---

## 9.2 Migrations quebradas

Problema:

```txt
alembic upgrade head falha por conflito, import ou revision ausente.
```

Mitigação:

```txt
Registrar o erro, corrigir imports/configurações simples e evitar recriar migrations sem análise.
```

---

## 9.3 Seed não idempotente

Problema:

```txt
Seed quebra ao ser executado mais de uma vez por duplicidade de dados.
```

Mitigação:

```txt
Adicionar verificação antes de inserir dados ou documentar como pendência para ajuste.
```

---

## 9.4 Porta já em uso

Problema:

```txt
Porta 8000 ou 5432 já está ocupada.
```

Mitigação:

```txt
Encerrar processo conflitante ou ajustar portas no docker-compose de forma documentada.
```

---

## 9.5 Variáveis ausentes

Problema:

```txt
Backend falha ao iniciar por ausência de JWT_SECRET, DATABASE_URL ou outras envs.
```

Mitigação:

```txt
Comparar .env, .env.example e docker-compose para garantir consistência mínima.
```

---

# 10. Arquivos/Pastas Provavelmente Impactados

```txt
backend/docker-compose.yml
backend/Dockerfile
backend/.env.example
backend/alembic.ini
backend/alembic/
backend/scripts/
backend/README.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/
```

A lista pode variar conforme a estrutura real do projeto.

---

# 11. Registro de Evidências

Durante a execução, registrar no feedback:

```txt
- comando usado para subir Docker;
- status da API;
- resultado das migrations;
- resultado do seed;
- resposta do /health;
- erros encontrados;
- correções feitas;
- pendências remanescentes;
- decisão sobre prontidão para o Bloco 05.
```

---

# 12. Commit Obrigatório ao Final do Bloco

Ao concluir o bloco, realizar um commit semântico com as alterações feitas.

Sugestão de commit:

```bash
git add .
git commit -m "chore: validar docker migrations e seed do backend"
```

Se houver correção técnica relevante, também pode ser usado:

```bash
git commit -m "fix: corrigir configuração docker e migrations do backend"
```

O commit deve ser feito somente após:

```txt
- validações principais concluídas;
- feedback gerado;
- arquivos revisados;
- alterações conferidas.
```

---

# 13. Feedback Obrigatório do Bloco

Após a implementação e validação, criar um arquivo `.md` de feedback dentro da pasta da sessão 01:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_04_validacao_docker_migrations_seed.md
```

O feedback deve conter:

```txt
# Feedback — Bloco 04: Validação Docker, Migrations e Seed

## 1. Resumo do que foi feito

## 2. Arquivos alterados

## 3. Comandos executados

## 4. Resultado das validações

## 5. Problemas encontrados

## 6. Correções aplicadas

## 7. Pendências

## 8. Riscos remanescentes

## 9. Commit realizado

## 10. Status final do bloco
```

---

# 14. Status Final Esperado

Ao finalizar este bloco, o backend deve estar tecnicamente validado para continuar a Sessão 01.

O próximo bloco será:

```txt
Bloco 05 — Alinhamento de Portas, CORS e Hosts
```

Esse próximo bloco deve partir da premissa de que o backend já sobe localmente e possui banco/migrations/seed minimamente funcionais.

