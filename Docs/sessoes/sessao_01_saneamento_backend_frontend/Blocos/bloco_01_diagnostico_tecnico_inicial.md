# Bloco 01 — Diagnóstico Técnico Inicial

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `bloco_01_diagnostico_tecnico_inicial`  
**Objetivo:** mapear divergências, riscos e ajustes obrigatórios antes de iniciar as correções técnicas entre backend, frontend e documentação.

---

# 1. Contexto do Bloco

Este é o primeiro bloco da Sessão 01.

A Sessão 01 tem como objetivo preparar o backend e o frontend para a integração real da Sessão 02. Antes de corrigir código, variáveis de ambiente, CORS, wallets mockadas ou regras de negócio, é necessário fazer um diagnóstico técnico completo.

Este bloco não deve sair implementando mudanças grandes diretamente. O foco é entender o estado atual do projeto, registrar divergências e preparar uma base confiável para os próximos blocos.

---

# 2. Objetivo Principal

Realizar uma análise técnica inicial do projeto para identificar:

```txt
- divergências entre frontend, backend e documentação
- riscos técnicos para integração
- problemas de configuração
- inconsistências de regras de negócio
- dependências faltantes
- possíveis problemas para deploy futuro
- arquivos que precisarão ser ajustados nos próximos blocos
```

---

# 3. Estrutura de Pastas da Sessão 01

A sessão deve seguir esta estrutura:

```txt
Docs/
└── sessoes/
    └── sessao_01_saneamento_backend_frontend/
        ├── Blocos/
        │   └── bloco_01_diagnostico_tecnico_inicial.md
        ├── Feedback/
        │   └── feedback_bloco_01_diagnostico_tecnico_inicial.md
        └── planejamento_sessao_01_saneamento_backend_frontend.md
```

> Observação: manter o padrão real da pasta já criada no projeto. Se a pasta estiver como `Blocos` e `Feedback` com letra maiúscula, respeitar esse padrão.

---

# 4. Escopo do Diagnóstico

## 4.1 Backend

Analisar o backend atual e registrar:

```txt
- linguagem/framework usado
- estrutura de pastas
- endpoints existentes
- autenticação por wallet
- geração de nonce
- validação de assinatura
- geração de JWT
- endpoints protegidos
- uso de PostgreSQL
- migrations existentes
- seed existente
- Docker/Docker Compose
- variáveis de ambiente
- CORS
- ALLOWED_HOSTS
- healthcheck
- configuração blockchain
- tratamento de erros
```

## 4.2 Frontend

Analisar o frontend atual e registrar:

```txt
- stack usada
- estrutura de pastas
- modo demo/mock atual
- conexão visual com wallet
- existência ou ausência de login real
- variáveis de ambiente frontend
- camada de API existente
- telas que dependem de dados mockados
- regras visuais de permissão
- uso de contratos mockados
- uso de actions mockadas
- uso de auditoria/timeline mockada
```

## 4.3 Integração Frontend/Backend

Mapear se existe ou não comunicação real entre frontend e backend:

```txt
- frontend chama backend atualmente?
- qual base URL está configurada?
- existe HTTP client centralizado?
- existe envio de Authorization Bearer?
- existe fluxo de nonce?
- existe assinatura de mensagem?
- existe POST /auth/verify?
- existe GET /auth/me?
- contratos reais são consumidos?
- actions reais são consumidas?
- auditoria real é consumida?
```

## 4.4 Documentação

Comparar o que está implementado com os documentos do projeto:

```txt
- planejamento geral das sessões
- planejamento da sessão 01
- README do frontend
- README do backend
- documentação de API
- documentação de deploy, se existir
- arquivos .env.example
```

---

# 5. Tarefas do Bloco

## 5.1 Pré-análise

Antes de qualquer alteração:

```txt
[ ] Abrir a estrutura atual do projeto
[ ] Identificar onde está o frontend
[ ] Identificar onde está o backend
[ ] Identificar onde estão os documentos DDAD
[ ] Confirmar estrutura da sessão 01
[ ] Confirmar existência das pastas Blocos e Feedback
```

## 5.2 Diagnóstico Backend

```txt
[ ] Verificar estrutura do backend
[ ] Listar principais arquivos de configuração
[ ] Verificar se existe .env.example
[ ] Verificar se existe Dockerfile
[ ] Verificar se existe docker-compose.yml
[ ] Verificar se existem migrations
[ ] Verificar se existe script de seed
[ ] Verificar endpoints de auth
[ ] Verificar endpoints de contracts
[ ] Verificar endpoints de actions
[ ] Verificar endpoints de audit/events
[ ] Verificar endpoint /health
[ ] Verificar configuração de CORS
[ ] Verificar configuração de ALLOWED_HOSTS
[ ] Verificar configuração de JWT
[ ] Verificar configuração de blockchain
```

## 5.3 Diagnóstico Frontend

```txt
[ ] Verificar stack do frontend
[ ] Verificar variáveis de ambiente
[ ] Verificar modo mock/demo
[ ] Verificar camada de serviços/API
[ ] Verificar conexão atual com wallet
[ ] Verificar se existe assinatura real de mensagem
[ ] Verificar se existe armazenamento de JWT
[ ] Verificar se existe Authorization Bearer
[ ] Verificar telas que usam dados mockados
[ ] Verificar regras visuais de permissões
[ ] Verificar wallets mockadas
```

## 5.4 Diagnóstico de Integração

```txt
[ ] Comparar endpoints esperados com chamadas existentes no frontend
[ ] Identificar gaps de integração
[ ] Identificar possíveis erros 401/403 futuros
[ ] Identificar dependências necessárias para wallet real
[ ] Identificar incompatibilidades de payload
[ ] Identificar diferenças entre nomes de campos frontend/backend
[ ] Identificar diferença entre portas frontend/backend
[ ] Identificar diferença entre origem CORS e URL real do frontend
```

## 5.5 Diagnóstico de Deploy Futuro

```txt
[ ] Verificar se backend está preparado para deploy
[ ] Verificar se frontend está preparado para deploy
[ ] Verificar se banco pode ser migrado para PostgreSQL remoto
[ ] Verificar se variáveis de produção estão documentadas
[ ] Verificar se existe risco de CORS em produção
[ ] Verificar se blockchain está corretamente desabilitado por enquanto
```

---

# 6. Entregáveis do Bloco

Ao final do bloco, devem existir os seguintes entregáveis:

```txt
[ ] Diagnóstico técnico registrado
[ ] Lista de divergências frontend/backend
[ ] Lista de riscos técnicos
[ ] Lista de ajustes obrigatórios para os próximos blocos
[ ] Lista de arquivos que precisarão ser alterados
[ ] Commit semântico realizado
[ ] Arquivo de feedback gerado na pasta Feedback da sessão 01
```

---

# 7. Arquivo de Feedback Obrigatório

Ao finalizar este bloco, gerar um arquivo Markdown de feedback em:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_01_diagnostico_tecnico_inicial.md
```

O feedback deve conter:

```txt
# Feedback — Bloco 01 — Diagnóstico Técnico Inicial

## 1. Resumo do que foi feito

## 2. Arquivos analisados

## 3. Divergências encontradas

## 4. Riscos identificados

## 5. Ajustes obrigatórios para próximos blocos

## 6. Pendências

## 7. Validações realizadas

## 8. Resultado final

## 9. Commit realizado
```

---

# 8. Commit Obrigatório ao Final do Bloco

Ao finalizar todas as análises e gerar o feedback, realizar um commit semântico.

Sugestão de commit:

```bash
git add .
git commit -m "docs: adiciona diagnóstico técnico inicial da sessão 01"
```

Caso o bloco também envolva pequenas correções técnicas, usar:

```bash
git add .
git commit -m "chore: registra diagnóstico técnico inicial da sessão 01"
```

Regra DDAD:

```txt
Todo bloco finalizado deve obrigatoriamente ter:
1. validação do que foi feito
2. commit semântico
3. feedback em Markdown dentro da pasta Feedback da sessão correspondente
```

---

# 9. Critérios de Aceite

O Bloco 01 só pode ser considerado concluído quando:

```txt
[ ] Backend analisado
[ ] Frontend analisado
[ ] Integração atual analisada
[ ] Documentação comparada
[ ] Riscos listados
[ ] Divergências listadas
[ ] Próximos ajustes identificados
[ ] Nenhuma alteração grande feita sem planejamento
[ ] Feedback criado em Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/
[ ] Commit semântico realizado
```

---

# 10. Resultado Esperado

Ao final deste bloco, o projeto deve ter clareza sobre o que precisa ser corrigido antes da integração real.

O resultado esperado não é ter backend e frontend integrados ainda.

O resultado esperado é ter um diagnóstico confiável para orientar os próximos blocos da Sessão 01.

---

# 11. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 02 — Correção de Encoding e Mensagens
```

O Bloco 02 deve usar o diagnóstico gerado aqui como base para corrigir textos quebrados, encoding, mensagens user-facing e documentação afetada.
