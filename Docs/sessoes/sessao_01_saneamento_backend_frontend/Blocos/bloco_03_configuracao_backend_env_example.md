# Bloco 03 — Configuração Backend `.env.example`

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `bloco_03_configuracao_backend_env_example`  
**Objetivo central:** criar, revisar e padronizar o arquivo `.env.example` do backend para garantir que qualquer pessoa consiga configurar o ambiente local, staging ou produção de forma clara, segura e reproduzível.

---

# 1. Contexto do Bloco

Após corrigir encoding, textos quebrados e mensagens do projeto, o próximo passo é garantir que o backend tenha um arquivo de configuração de ambiente confiável.

O backend depende de variáveis sensíveis e operacionais para funcionar corretamente, como banco de dados, autenticação JWT, CORS, hosts permitidos, expiração de nonce e flags relacionadas à blockchain.

Sem um `.env.example` bem definido, podem ocorrer problemas como:

```txt
- backend não subir localmente
- erros de conexão com banco
- JWT inválido ou ausente
- frontend bloqueado por CORS
- falhas no login por wallet
- configuração incorreta de ambiente
- dificuldade para deploy futuro
- risco de expor segredos reais no repositório
```

Este bloco não deve implementar novas features. O foco é documentação, saneamento e padronização das variáveis de ambiente do backend.

---

# 2. Objetivos do Bloco

## 2.1 Objetivo Principal

Criar ou revisar o arquivo `.env.example` do backend, deixando todas as variáveis obrigatórias documentadas, coerentes e alinhadas com a execução local e futura preparação de deploy.

## 2.2 Objetivos Secundários

```txt
- Identificar todas as variáveis usadas pelo backend
- Padronizar nomes das variáveis
- Garantir que nenhuma credencial real esteja versionada
- Documentar valores de exemplo seguros
- Alinhar CORS e ALLOWED_HOSTS com o frontend local
- Registrar variáveis relacionadas à autenticação por wallet
- Registrar variáveis relacionadas à blockchain
- Preparar base para Docker, migrations, seed e deploy
```

---

# 3. Escopo do Bloco

## 3.1 Incluído no Escopo

```txt
- Backend
- Arquivo .env.example
- Arquivo .env, apenas para comparação local, sem versionar segredos
- README do backend, se necessário
- docker-compose, se houver dependência de variáveis
- configurações de CORS
- configurações de JWT
- configurações de banco de dados
- configurações de nonce/auth wallet
- configurações de blockchain flag
```

## 3.2 Fora do Escopo

```txt
- Deploy em produção
- Integração frontend/backend
- Implementação de login real no frontend
- Alteração de endpoints
- Alteração de regras de negócio
- Alteração de migrations
- Alteração de seed, exceto se houver dependência clara de env
- Exposição de credenciais reais
- Commit de arquivo .env com dados sensíveis
```

---

# 4. Estrutura Esperada do Arquivo `.env.example`

O arquivo `.env.example` deve conter, no mínimo, as seguintes variáveis:

```env
# Database
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/fiscalizapay

# JWT
JWT_SECRET=change-me-in-local-development
JWT_EXPIRES_MINUTES=60

# Security / Hosts
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1

# Wallet Auth
AUTH_NONCE_EXPIRES_MINUTES=10

# Blockchain
CHAIN_ID=80002
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

Caso o backend utilize nomes diferentes, o executor deve:

```txt
1. Identificar os nomes reais usados no código
2. Não inventar variáveis sem uso
3. Padronizar somente se for seguro
4. Registrar qualquer divergência no feedback
```

---

# 5. Pré-Análise Obrigatória

Antes de alterar qualquer arquivo, o executor deve analisar:

```txt
- onde o backend carrega configurações de ambiente
- quais variáveis são lidas no código
- quais variáveis aparecem em docker-compose
- quais variáveis aparecem em README/docs
- quais variáveis aparecem em scripts de seed/migration
- quais variáveis aparecem em exemplos antigos
- se existe .env versionado por engano
- se existe .env.example incompleto ou desatualizado
```

## 5.1 Arquivos Possíveis de Análise

```txt
backend/.env.example
backend/.env
backend/app/core/config.py
backend/app/settings.py
backend/docker-compose.yml
docker-compose.yml
backend/README.md
README.md
backend/alembic.ini
backend/scripts/seed_demo_profiles.py
```

A lista acima é referência. O executor deve adaptar conforme a estrutura real do projeto.

---

# 6. Plano de Implementação

## 6.1 Etapa 01 — Localizar Configuração do Backend

Identificar o arquivo responsável por carregar as variáveis de ambiente.

Verificar pontos como:

```txt
- BaseSettings
- pydantic-settings
- os.getenv
- dotenv
- configurações FastAPI
- configurações SQLAlchemy
- configurações JWT
```

Resultado esperado:

```txt
Lista real das variáveis usadas pelo backend.
```

---

## 6.2 Etapa 02 — Verificar `.env.example` Atual

Caso o arquivo já exista, validar:

```txt
- se está completo
- se possui nomes corretos
- se possui valores de exemplo seguros
- se possui comentários úteis
- se não contém dados reais
- se está alinhado ao código
```

Caso não exista, criar o arquivo.

Caminho sugerido:

```txt
backend/.env.example
```

Se a estrutura do projeto usar outro caminho, registrar no feedback.

---

## 6.3 Etapa 03 — Padronizar Variáveis de Banco

Garantir que a variável de banco esteja clara.

Exemplo:

```env
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/fiscalizapay
```

Validar se o backend espera:

```txt
DATABASE_URL
POSTGRES_USER
POSTGRES_PASSWORD
POSTGRES_DB
POSTGRES_HOST
POSTGRES_PORT
```

Se o projeto usa `DATABASE_URL`, priorizar essa variável no `.env.example`.

---

## 6.4 Etapa 04 — Padronizar Variáveis de JWT

Garantir que as variáveis de autenticação estejam documentadas.

Exemplo:

```env
JWT_SECRET=change-me-in-local-development
JWT_EXPIRES_MINUTES=60
```

Regras:

```txt
- Não usar segredo real
- Não usar valor vazio para JWT_SECRET, se o backend exigir valor
- Indicar que em produção o segredo deve ser forte
- Manter expiração coerente com o backend
```

---

## 6.5 Etapa 05 — Padronizar CORS e Hosts

Garantir alinhamento com o frontend local.

Decisão sugerida para ambiente local:

```txt
Backend local: http://127.0.0.1:8000
Frontend local: http://localhost:3000
```

Variáveis esperadas:

```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1
```

Se o frontend estiver em outra porta, registrar a divergência no feedback.

---

## 6.6 Etapa 06 — Padronizar Auth Wallet / Nonce

Garantir variável de expiração de nonce.

Exemplo:

```env
AUTH_NONCE_EXPIRES_MINUTES=10
```

Validar se o backend usa outro nome.

Registrar qualquer ajuste necessário.

---

## 6.7 Etapa 07 — Padronizar Variáveis Blockchain

Como a blockchain real ainda não está ativa, manter a flag desabilitada por padrão.

Exemplo:

```env
CHAIN_ID=80002
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

Regras:

```txt
- BLOCKCHAIN_ENABLED deve permanecer false neste momento
- CONTRACT_ADDRESS pode ficar vazio enquanto não houver smart contract real
- CHAIN_ID deve refletir a rede prevista para testes
- Não implementar smart contract neste bloco
```

---

## 6.8 Etapa 08 — Revisar README do Backend

Se necessário, atualizar o README do backend com instruções básicas:

```txt
1. Copiar .env.example para .env
2. Ajustar DATABASE_URL
3. Ajustar JWT_SECRET local
4. Subir Docker
5. Rodar migrations
6. Rodar seed
7. Validar /health
```

Exemplo de comando:

```bash
cp .env.example .env
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

---

# 7. Validação Obrigatória

Após criar ou revisar o `.env.example`, validar:

```txt
[ ] Todas as variáveis usadas pelo backend aparecem no .env.example
[ ] Nenhuma variável sem uso foi adicionada sem justificativa
[ ] Nenhum segredo real foi colocado no arquivo
[ ] DATABASE_URL possui exemplo seguro
[ ] JWT_SECRET possui exemplo seguro
[ ] CORS_ORIGINS contempla frontend local
[ ] ALLOWED_HOSTS contempla localhost/127.0.0.1
[ ] AUTH_NONCE_EXPIRES_MINUTES está documentado
[ ] BLOCKCHAIN_ENABLED está false por padrão
[ ] CONTRACT_ADDRESS não contém endereço real sensível sem necessidade
[ ] README foi atualizado se necessário
```

## 7.1 Validação Técnica Recomendada

Se o ambiente estiver disponível, executar:

```bash
cp backend/.env.example backend/.env
```

Ajustar os valores locais, se necessário, e validar:

```bash
docker compose up
```

Ou, se o backend for executado diretamente:

```bash
uvicorn app.main:app --reload
```

Validar endpoint mínimo:

```txt
GET /health
```

Se não for possível executar, registrar justificativa no feedback.

---

# 8. Critérios de Aceite

O bloco só deve ser considerado concluído quando:

```txt
[ ] .env.example criado ou revisado
[ ] Variáveis obrigatórias mapeadas no código
[ ] Variáveis documentadas com exemplos seguros
[ ] CORS local alinhado com frontend
[ ] JWT configurado com placeholder seguro
[ ] Banco configurado com exemplo claro
[ ] Blockchain mantida desabilitada por padrão
[ ] README atualizado, se necessário
[ ] Nenhum segredo real foi versionado
[ ] Validação técnica executada ou justificativa registrada
[ ] Feedback final criado em Markdown
[ ] Commit semântico realizado ao final do bloco
```

---

# 9. Arquivo de Feedback Obrigatório

Ao finalizar este bloco, criar um arquivo `.md` de feedback na pasta:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/
```

Nome sugerido:

```txt
feedback_bloco_03_configuracao_backend_env_example.md
```

## 9.1 Estrutura Recomendada do Feedback

```md
# Feedback — Bloco 03 — Configuração Backend .env.example

## 1. Resumo do que foi feito

## 2. Arquivos analisados

## 3. Arquivos alterados

## 4. Variáveis identificadas no backend

## 5. Variáveis adicionadas ou ajustadas no .env.example

## 6. Validações executadas

## 7. Pendências identificadas

## 8. Riscos ou observações

## 9. Status final do bloco

## 10. Commit realizado
```

---

# 10. Commit Obrigatório

Ao final do bloco, realizar um commit semântico com as alterações implementadas.

## 10.1 Sugestão de Commit

Se o bloco alterar principalmente configuração/documentação:

```bash
git add .
git commit -m "docs: configurar exemplo de variaveis do backend"
```

Se o bloco também ajustar carregamento de configuração no backend:

```bash
git add .
git commit -m "chore: padronizar variaveis de ambiente do backend"
```

Se houver correção funcional relacionada à leitura de env:

```bash
git add .
git commit -m "fix: corrigir carregamento de variaveis do backend"
```

---

# 11. Observações Importantes para o Executor

```txt
- Não commitar arquivo .env com segredos reais.
- Não usar credenciais reais no .env.example.
- Não alterar regra de negócio neste bloco.
- Não implementar integração frontend/backend neste bloco.
- Não ativar blockchain real neste bloco.
- Não alterar endpoints sem necessidade.
- Registrar divergências entre documentação e código no feedback.
- Manter o foco em configuração reproduzível e segura.
```

---

# 12. Resultado Esperado

Ao final do Bloco 03, o backend deve possuir uma base clara e segura de configuração de ambiente.

Resultado esperado:

```txt
- .env.example confiável
- variáveis obrigatórias documentadas
- menor risco de erro ao subir backend local
- base preparada para validação Docker/migrations/seed
- base mais segura para deploy futuro
```

---

# 13. Próximo Bloco

Após concluir este bloco, seguir para:

```txt
Bloco 04 — Validação Docker, Migrations e Seed
```

O Bloco 04 só deve iniciar depois que o feedback do Bloco 03 estiver criado e o commit semântico tiver sido realizado.
