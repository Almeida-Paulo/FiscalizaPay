# Bloco 05 — Alinhamento de Portas, CORS e Hosts

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `bloco_05_alinhamento_portas_cors_hosts`  
**Objetivo central:** alinhar a comunicação local entre frontend e backend, garantindo que portas, URLs, CORS, hosts permitidos e variáveis de ambiente estejam coerentes para a futura integração real.

---

# 1. Contexto do Bloco

Após validar o backend com Docker, migrations, seed e endpoint `/health`, o próximo passo é garantir que o frontend consiga se comunicar com a API sem conflitos de porta, bloqueios de CORS ou URLs inconsistentes.

Este bloco não deve implementar integração funcional profunda ainda. A integração real será feita na Sessão 02.

O foco aqui é preparar o ambiente para que a comunicação frontend/backend esteja tecnicamente possível.

---

# 2. Objetivo

Garantir que:

```txt
- O backend tenha uma URL local padrão definida
- O frontend tenha uma URL local padrão definida
- O frontend aponte para a API correta
- O backend permita a origem do frontend local
- ALLOWED_HOSTS esteja coerente
- CORS_ORIGINS esteja coerente
- As variáveis de ambiente estejam documentadas
- O ambiente esteja pronto para a Sessão 02
```

---

# 3. Decisão Técnica Recomendada

## 3.1 Backend local

Utilizar como padrão:

```txt
http://127.0.0.1:8000
```

ou, se o projeto já estiver usando `localhost`, padronizar e documentar claramente.

Recomendação principal:

```txt
BACKEND_LOCAL_URL=http://127.0.0.1:8000
```

---

## 3.2 Frontend local

Utilizar como padrão:

```txt
http://localhost:3000
```

Caso o frontend esteja usando Vite, a porta pode ser:

```txt
http://localhost:5173
```

Nesse caso, o executor deve identificar a porta real do projeto e documentar no feedback.

---

## 3.3 Variável pública da API no frontend

A variável recomendada depende da stack:

### Para Next.js

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Para Vite

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

O executor deve validar qual padrão o projeto usa antes de alterar.

---

# 4. Escopo do Bloco

## 4.1 Incluído neste bloco

```txt
- Revisar configuração de porta do backend
- Revisar configuração de porta do frontend
- Revisar .env.example do backend
- Revisar .env.example do frontend, caso exista
- Criar .env.example do frontend, caso não exista e seja necessário
- Ajustar CORS_ORIGINS no backend
- Ajustar ALLOWED_HOSTS no backend
- Garantir que o frontend aponte para a URL correta da API
- Validar chamada simples ao backend
- Documentar decisões no feedback
```

---

## 4.2 Fora do escopo deste bloco

```txt
- Implementar login real por wallet
- Implementar JWT no frontend
- Integrar contratos reais
- Integrar actions reais
- Integrar auditoria real
- Publicar backend em produção
- Publicar frontend na Vercel
- Configurar domínio final
```

Essas atividades pertencem às sessões 02 e 03.

---

# 5. Pré-análise Obrigatória

Antes de alterar qualquer arquivo, o executor deve analisar:

```txt
- Qual porta o backend usa localmente
- Qual comando inicia o backend
- Qual porta o frontend usa localmente
- Qual comando inicia o frontend
- Onde o backend configura CORS
- Onde o backend configura ALLOWED_HOSTS
- Onde o frontend define a URL da API
- Se existe .env.example no frontend
- Se existe .env.local ou equivalente
- Se há URLs hardcoded no código
```

---

# 6. Arquivos Prováveis de Análise

A estrutura real pode variar, mas o executor deve procurar por arquivos como:

```txt
backend/.env.example
backend/.env
backend/app/core/config.py
backend/app/main.py
backend/docker-compose.yml
backend/README.md
frontend/.env.example
frontend/.env.local
frontend/src/lib/api.ts
frontend/src/services/api.ts
frontend/src/config/env.ts
frontend/src/config/api.ts
frontend/vite.config.ts
frontend/next.config.js
```

Caso os caminhos sejam diferentes, registrar no feedback.

---

# 7. Implementação Recomendada

## 7.1 Padronizar backend local

Validar que o backend sobe em:

```txt
http://127.0.0.1:8000
```

Validar também:

```txt
GET http://127.0.0.1:8000/health
```

Resultado esperado:

```txt
status 200
```

---

## 7.2 Padronizar frontend local

Identificar a porta real do frontend.

Possíveis cenários:

```txt
Next.js: http://localhost:3000
Vite: http://localhost:5173
```

A porta escolhida deve ser refletida no CORS do backend.

---

## 7.3 Ajustar CORS_ORIGINS

No backend, garantir que as origens locais do frontend estejam permitidas.

Exemplo recomendado:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
```

Caso o projeto use apenas uma porta, pode manter somente a porta real.

---

## 7.4 Ajustar ALLOWED_HOSTS

Garantir que o backend aceite hosts locais.

Exemplo recomendado:

```env
ALLOWED_HOSTS=localhost,127.0.0.1
```

Se o backend ainda não usa essa variável, validar se ela é realmente necessária.

---

## 7.5 Ajustar URL da API no frontend

O frontend deve apontar para a URL real da API local.

Exemplo para Next.js:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Exemplo para Vite:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Evitar URLs hardcoded diretamente em componentes.

---

## 7.6 Centralizar leitura da URL da API

Caso o projeto ainda não tenha uma camada central de configuração, criar ou ajustar um arquivo de configuração.

Exemplo conceitual:

```txt
frontend/src/config/api.ts
```

Responsabilidade:

```txt
- Ler a variável de ambiente da API
- Exportar uma constante baseURL
- Evitar repetição de URL em múltiplos arquivos
```

---

# 8. Validação Técnica

## 8.1 Validar backend

Com o backend em execução:

```bash
docker compose up
```

ou comando equivalente do projeto.

Validar:

```bash
curl http://127.0.0.1:8000/health
```

Resultado esperado:

```txt
API respondendo sem erro
```

---

## 8.2 Validar frontend

Com o frontend em execução:

```bash
npm run dev
```

ou comando equivalente.

Validar:

```txt
- Aplicação abre no navegador
- Console não apresenta erro de variável de ambiente ausente
- Não há erro de CORS em chamadas básicas
- URL da API está correta
```

---

## 8.3 Validar comunicação básica

Se já existir alguma chamada simples ao backend, validar se ela não quebra por CORS.

Exemplo:

```txt
GET /health
GET /auth/nonce
```

Caso ainda não exista chamada no frontend, o executor pode apenas documentar que a validação de CORS será confirmada na Sessão 02.

---

# 9. Critérios de Aceite

O bloco será considerado concluído quando:

```txt
[ ] Porta local do backend identificada e documentada
[ ] Porta local do frontend identificada e documentada
[ ] URL local da API definida
[ ] CORS_ORIGINS revisado ou ajustado
[ ] ALLOWED_HOSTS revisado ou ajustado
[ ] Frontend apontando para a API local correta
[ ] URLs hardcoded analisadas
[ ] .env.example do backend coerente com o ambiente local
[ ] .env.example do frontend criado/revisado, se aplicável
[ ] Backend responde em /health
[ ] Aplicação frontend sobe localmente
[ ] Nenhum erro crítico de CORS identificado
[ ] Feedback do bloco criado na pasta Feedback da Sessão 01
[ ] Commit semântico realizado ao final do bloco
```

---

# 10. Riscos do Bloco

## 10.1 Porta divergente

O frontend pode estar configurado para uma porta diferente da usada localmente.

Mitigação:

```txt
Identificar a porta real antes de alterar CORS.
```

---

## 10.2 CORS permissivo demais

Usar `*` em CORS pode ser ruim para produção.

Mitigação:

```txt
Permitir apenas origens conhecidas no ambiente local.
```

---

## 10.3 URL hardcoded

URLs espalhadas no frontend dificultam deploy e integração.

Mitigação:

```txt
Centralizar a URL da API em variável de ambiente.
```

---

## 10.4 Diferença entre localhost e 127.0.0.1

Alguns ambientes tratam `localhost` e `127.0.0.1` de forma diferente.

Mitigação:

```txt
Permitir ambos no ambiente local ou padronizar apenas um e documentar.
```

---

# 11. Padrão DDAD Obrigatório ao Final do Bloco

Ao finalizar este bloco, o executor deve obrigatoriamente:

```txt
1. Validar tecnicamente as alterações
2. Fazer commit semântico
3. Gerar arquivo .md de feedback
4. Salvar o feedback dentro da pasta Feedback da Sessão 01
```

---

# 12. Commit Semântico Obrigatório

Sugestão de commit:

```bash
git add .
git commit -m "chore: alinhar portas cors e hosts para integracao local"
```

Caso o bloco envolva correção real de bug, pode ser usado:

```bash
git commit -m "fix: corrigir configuracao local de cors e hosts"
```

---

# 13. Feedback Obrigatório

Ao final do bloco, criar o arquivo:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_05_alinhamento_portas_cors_hosts.md
```

---

# 14. Estrutura Recomendada do Feedback

O feedback deve conter:

```md
# Feedback — Bloco 05 — Alinhamento de Portas, CORS e Hosts

## 1. Resumo do que foi feito

Descrever de forma objetiva o que foi ajustado.

## 2. Arquivos alterados

Listar os arquivos alterados.

## 3. Portas identificadas

- Backend local:
- Frontend local:

## 4. Variáveis revisadas ou criadas

Listar variáveis como:

- CORS_ORIGINS
- ALLOWED_HOSTS
- NEXT_PUBLIC_API_BASE_URL ou VITE_API_BASE_URL

## 5. Validações executadas

- Backend subiu?
- Frontend subiu?
- /health respondeu?
- Houve erro de CORS?

## 6. Problemas encontrados

Listar problemas, se houver.

## 7. Pendências

Listar pendências para a Sessão 02 ou Sessão 03.

## 8. Status final

Informar se o bloco foi concluído com sucesso.

## 9. Commit realizado

Informar o hash ou a mensagem do commit.
```

---

# 15. Resultado Esperado Final

Ao concluir este bloco, o projeto deve estar com ambiente local alinhado para integração.

Resultado esperado:

```txt
Backend local funcionando
Frontend local funcionando
Frontend apontando para backend correto
CORS local ajustado
Hosts locais permitidos
Ambiente pronto para avançar aos próximos blocos da Sessão 01
```

---

# 16. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 06 — Alinhamento de Regras Frontend/Backend
```
