# Planejamento — Sessão 01

## Saneamento Backend/Frontend — FiscalizaPay Web3

**Versão:** 1.0  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Objetivo central:** preparar backend e frontend para uma integração real, corrigindo inconsistências técnicas antes de iniciar a comunicação ponta a ponta entre as aplicações.

---

# 1. Contexto da Sessão

A Sessão 01 nasce a partir do planejamento geral das sessões 01, 02 e 03, onde foi definido que o FiscalizaPay Web3 deve seguir a ordem:

```txt
Saneamento → Integração → Deploy
```

Neste momento, o projeto possui:

```txt
- Frontend forte para demonstração/MVP visual
- Backend promissor como MVP técnico
- API com autenticação por wallet/JWT
- PostgreSQL, FastAPI e regras de negócio
- Integração real entre frontend e backend ainda incompleta
- Blockchain real ainda desabilitada/pendente
```

O objetivo da Sessão 01 não é criar novas funcionalidades visuais.  
O foco é deixar o projeto tecnicamente limpo, coerente, configurável e pronto para a Sessão 02, onde ocorrerá a integração real entre frontend e backend.

---

# 2. Objetivo da Sessão 01

Preparar o backend e o frontend para integração real, eliminando riscos técnicos antes de conectar os dois sistemas.

Ao final desta sessão, o projeto deve estar com:

```txt
- Backend validado localmente
- Frontend apontando corretamente para a API
- Variáveis de ambiente organizadas
- CORS e hosts alinhados
- Wallets mockadas corrigidas
- Regras frontend/backend conferidas
- Encoding e mensagens corrigidas
- Docker, migrations e seed validados
- Relatório final de prontidão para integração criado
```

---

# 3. Estrutura de Pastas da Sessão

A sessão deve seguir o padrão DDAD adotado no projeto:

```txt
Docs/
└── sessoes/
    └── sessao_01_saneamento_backend_frontend/
        ├── planejamento/
        │   ├── planejamento_sessao_01.md
        │   └── blocos/
        │       ├── bloco_01_diagnostico_tecnico_inicial.md
        │       ├── bloco_02_correcao_encoding_mensagens.md
        │       ├── bloco_03_configuracao_backend_env_example.md
        │       ├── bloco_04_validacao_docker_migrations_seed.md
        │       ├── bloco_05_alinhamento_portas_cors_hosts.md
        │       ├── bloco_06_alinhamento_regras_frontend_backend.md
        │       ├── bloco_07_correcao_wallets_mockadas.md
        │       └── bloco_08_relatorio_prontidao_integracao.md
        │
        ├── feedback/
        │   ├── feedback_bloco_01_diagnostico_tecnico_inicial.md
        │   ├── feedback_bloco_02_correcao_encoding_mensagens.md
        │   ├── feedback_bloco_03_configuracao_backend_env_example.md
        │   ├── feedback_bloco_04_validacao_docker_migrations_seed.md
        │   ├── feedback_bloco_05_alinhamento_portas_cors_hosts.md
        │   ├── feedback_bloco_06_alinhamento_regras_frontend_backend.md
        │   ├── feedback_bloco_07_correcao_wallets_mockadas.md
        │   └── feedback_bloco_08_relatorio_prontidao_integracao.md
        │
        ├── bugs/
        │   └── bugs_sessao_01.md
        │
        └── analises/
            ├── analise_divergencias_backend_frontend.md
            └── relatorio_prontidao_integracao.md
```

---

# 4. Fluxo DDAD Obrigatório

Cada bloco da Sessão 01 deve seguir o ciclo:

```txt
1. Ler planejamento do bloco
2. Analisar estado atual do projeto
3. Implementar somente o escopo do bloco
4. Validar tecnicamente
5. Corrigir bugs encontrados
6. Fazer commit semântico
7. Gerar feedback em Markdown
8. Salvar feedback na pasta da sessão
```

Nenhum bloco deve avançar sem feedback documentado.

---

# 5. Blocos da Sessão 01

---

## Bloco 01 — Diagnóstico Técnico Inicial

### Objetivo

Mapear divergências técnicas entre frontend, backend e documentação antes de qualquer alteração.

### Tarefas

```txt
[ ] Analisar estrutura atual do backend
[ ] Analisar estrutura atual do frontend
[ ] Verificar documentação existente
[ ] Identificar divergências entre API e telas
[ ] Identificar variáveis de ambiente ausentes
[ ] Identificar riscos para integração real
[ ] Criar relatório de divergências
```

### Pontos de análise

```txt
- Backend sobe localmente?
- Frontend possui variável de API configurada?
- Endpoints documentados existem no backend?
- Frontend usa mock ou API real?
- Existe conflito entre login demo e login real?
- Existem erros de encoding?
- Existem wallets mockadas inválidas?
- Existem regras visuais diferentes das regras do backend?
```

### Entregas

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/analise_divergencias_backend_frontend.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/feedback/feedback_bloco_01_diagnostico_tecnico_inicial.md
```

### Commit sugerido

```txt
docs: diagnosticar divergencias iniciais backend frontend
```

### Critério de aceite

```txt
[ ] Relatório de divergências criado
[ ] Riscos técnicos listados
[ ] Pendências classificadas por prioridade
[ ] Próximos blocos confirmados como necessários
```

---

## Bloco 02 — Correção de Encoding e Mensagens

### Objetivo

Corrigir textos quebrados, problemas de acentuação e mensagens inconsistentes no backend, frontend e documentação essencial.

### Tarefas

```txt
[ ] Procurar textos com caracteres quebrados
[ ] Corrigir mensagens user-facing
[ ] Corrigir logs relevantes
[ ] Corrigir mensagens de erro da API, se existirem
[ ] Corrigir README ou documentação técnica com encoding quebrado
[ ] Garantir arquivos em UTF-8
```

### Escopo permitido

```txt
- Textos quebrados
- Acentuação
- Mensagens de erro
- Mensagens de sucesso
- Documentação básica afetada
```

### Fora de escopo

```txt
- Alterar regra de negócio
- Alterar layout inteiro
- Criar novas telas
- Reescrever fluxo de autenticação
```

### Entregas

```txt
- Arquivos normalizados em UTF-8
- Mensagens corrigidas
- Feedback técnico do bloco
```

### Commit sugerido

```txt
fix: corrigir encoding e mensagens do projeto
```

### Critério de aceite

```txt
[ ] Não existem textos quebrados visíveis
[ ] Arquivos principais estão em UTF-8
[ ] Mensagens importantes estão legíveis
[ ] Feedback do bloco foi gerado
```

---

## Bloco 03 — Configuração Backend `.env.example`

### Objetivo

Criar ou revisar um `.env.example` confiável para o backend, facilitando execução local e futura configuração de deploy.

### Variáveis esperadas

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_MINUTES=60
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1
AUTH_NONCE_EXPIRES_MINUTES=10
CHAIN_ID=80002
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

### Tarefas

```txt
[ ] Verificar variáveis usadas no backend
[ ] Criar ou corrigir .env.example
[ ] Conferir nomes reais utilizados pela aplicação
[ ] Garantir que não exista segredo real no arquivo exemplo
[ ] Documentar uso básico das variáveis
```

### Cuidados obrigatórios

```txt
- Não commitar secrets reais
- Não expor DATABASE_URL real
- Não expor JWT_SECRET real
- Manter .env.example apenas como modelo
```

### Entregas

```txt
backend/.env.example
Docs/sessoes/sessao_01_saneamento_backend_frontend/feedback/feedback_bloco_03_configuracao_backend_env_example.md
```

### Commit sugerido

```txt
chore: configurar env example do backend
```

### Critério de aceite

```txt
[ ] .env.example existe
[ ] Variáveis principais documentadas
[ ] Nenhum segredo real exposto
[ ] Backend consegue ser configurado a partir do exemplo
```

---

## Bloco 04 — Validação Docker, Migrations e Seed

### Objetivo

Garantir que o backend sobe localmente com banco, migrations e seed inicial funcionando.

### Comandos esperados

```bash
docker compose up
alembic upgrade head
python seed_demo_profiles.py
```

### Validações mínimas

```txt
[ ] Backend sobe sem erro crítico
[ ] PostgreSQL sobe corretamente
[ ] Migrations executam sem erro
[ ] Seed cria dados necessários
[ ] GET /health retorna sucesso
```

### Pontos de atenção

```txt
- Porta do backend
- Porta do banco
- DATABASE_URL local
- Ordem de subida dos containers
- Dependência entre API e banco
- Erros de migration duplicada
```

### Entregas

```txt
- Ambiente local validado
- Comandos documentados no feedback
- Bugs encontrados registrados em bugs_sessao_01.md
```

### Commit sugerido

```txt
chore: validar docker migrations e seed do backend
```

### Critério de aceite

```txt
[ ] docker compose up validado
[ ] migrations validadas
[ ] seed validado
[ ] /health funcionando
[ ] feedback gerado
```

---

## Bloco 05 — Alinhamento de Portas, CORS e Hosts

### Objetivo

Garantir que frontend e backend consigam se comunicar localmente sem bloqueio de CORS, porta incorreta ou host inválido.

### Decisão sugerida

```txt
Backend local: http://127.0.0.1:8000
Frontend local: http://localhost:3000
```

### Variáveis esperadas

Backend:

```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
ALLOWED_HOSTS=localhost,127.0.0.1
```

Frontend:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_USE_MOCKS=true
```

### Tarefas

```txt
[ ] Conferir porta real do backend
[ ] Conferir porta real do frontend
[ ] Ajustar CORS_ORIGINS
[ ] Ajustar ALLOWED_HOSTS
[ ] Ajustar variável de API no frontend
[ ] Testar chamada simples do frontend para backend
```

### Entregas

```txt
- Configuração local alinhada
- Comunicação básica frontend/backend validada
- Feedback técnico do bloco
```

### Commit sugerido

```txt
fix: alinhar portas cors e hosts entre frontend e backend
```

### Critério de aceite

```txt
[ ] Frontend sabe a URL da API
[ ] Backend aceita origem local do frontend
[ ] CORS não bloqueia chamadas locais
[ ] Hosts locais estão permitidos
[ ] Feedback gerado
```

---

## Bloco 06 — Alinhamento de Regras Frontend/Backend

### Objetivo

Garantir que as permissões exibidas no frontend estejam coerentes com as regras reais do backend.

### Regras conhecidas do backend

```txt
open_dispute: GESTOR, FISCAL, AUDITOR
simulate_fraud: GESTOR, FISCAL, AUDITOR
```

### Tarefas

```txt
[ ] Identificar regras de permissão no backend
[ ] Identificar regras visuais no frontend
[ ] Comparar ACTION_ROLES com permissões da UI
[ ] Corrigir botões ou ações liberadas incorretamente
[ ] Documentar divergências corrigidas
```

### Cuidados

```txt
- Não liberar ação no frontend que o backend bloqueia
- Não esconder ação que o usuário autorizado deveria ver
- Não alterar regra do backend sem justificativa
- Priorizar backend como fonte da verdade
```

### Entregas

```txt
- Regras visuais alinhadas
- Relatório de regras revisadas
- Feedback do bloco
```

### Commit sugerido

```txt
fix: alinhar permissoes visuais com regras do backend
```

### Critério de aceite

```txt
[ ] Permissões backend revisadas
[ ] Permissões frontend revisadas
[ ] Divergências corrigidas
[ ] Backend tratado como fonte da verdade
[ ] Feedback gerado
```

---

## Bloco 07 — Correção de Wallets Mockadas

### Objetivo

Garantir que todas as wallets mockadas usadas no frontend ou seeds sejam endereços EVM válidos.

### Formato obrigatório

```txt
0x + 40 caracteres hexadecimais
```

Exemplo válido:

```txt
0x1111111111111111111111111111111111111111
```

### Tarefas

```txt
[ ] Localizar wallets mockadas no frontend
[ ] Localizar wallets mockadas no backend/seed
[ ] Corrigir endereços inválidos
[ ] Garantir consistência entre perfil demo e backend
[ ] Validar se o login futuro não será quebrado por wallet inválida
```

### Cuidados

```txt
- Não usar carteira real pessoal em seed público
- Não usar endereço incompleto
- Não usar texto como endereço
- Não misturar maiúsculas/minúsculas sem necessidade
```

### Entregas

```txt
- Wallets mockadas válidas
- Seeds e mocks coerentes
- Feedback do bloco
```

### Commit sugerido

```txt
fix: corrigir wallets mockadas para formato evm valido
```

### Critério de aceite

```txt
[ ] Todas as wallets mockadas seguem padrão EVM
[ ] Frontend e backend usam endereços coerentes
[ ] Nenhuma wallet mockada inválida permanece
[ ] Feedback gerado
```

---

## Bloco 08 — Relatório de Prontidão para Integração

### Objetivo

Encerrar a Sessão 01 com um relatório técnico dizendo se o projeto está pronto para a Sessão 02 — Integração Back + Front.

### Arquivo obrigatório

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/relatorio_prontidao_integracao.md
```

### Conteúdo mínimo do relatório

```txt
# Relatório de Prontidão para Integração

## 1. Resumo da Sessão 01
## 2. O que foi corrigido
## 3. O que foi validado
## 4. Pendências restantes
## 5. Riscos para a Sessão 02
## 6. Decisão final
## 7. Checklist de aceite
```

### Decisão final esperada

O relatório deve terminar com uma das opções:

```txt
APROVADO PARA SESSÃO 02
```

ou

```txt
NÃO APROVADO PARA SESSÃO 02
```

Se não aprovado, deve listar exatamente o que impede o avanço.

### Entregas

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/relatorio_prontidao_integracao.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/feedback/feedback_bloco_08_relatorio_prontidao_integracao.md
```

### Commit sugerido

```txt
docs: gerar relatorio de prontidao para integracao
```

### Critério de aceite

```txt
[ ] Relatório final criado
[ ] Todos os blocos anteriores revisados
[ ] Pendências listadas
[ ] Decisão final registrada
[ ] Feedback do bloco gerado
```

---

# 6. Checklist Geral da Sessão 01

```txt
[ ] Bloco 01 — Diagnóstico técnico inicial concluído
[ ] Bloco 02 — Encoding e mensagens corrigidos
[ ] Bloco 03 — .env.example backend configurado
[ ] Bloco 04 — Docker, migrations e seed validados
[ ] Bloco 05 — Portas, CORS e hosts alinhados
[ ] Bloco 06 — Regras frontend/backend alinhadas
[ ] Bloco 07 — Wallets mockadas corrigidas
[ ] Bloco 08 — Relatório de prontidão criado
```

---

# 7. Critério de Pronto da Sessão 01

A Sessão 01 só pode ser considerada concluída quando:

```txt
[ ] Backend sobe localmente
[ ] Banco local funciona
[ ] Migrations executam
[ ] Seed executa
[ ] /health responde corretamente
[ ] .env.example está confiável
[ ] CORS local está correto
[ ] ALLOWED_HOSTS local está correto
[ ] Frontend possui URL correta da API
[ ] Encoding está corrigido
[ ] Wallets mockadas são válidas
[ ] Regras visuais batem com backend
[ ] Relatório de prontidão foi criado
[ ] Todos os feedbacks dos blocos foram gerados
[ ] Commits semânticos foram feitos
```

---

# 8. Riscos da Sessão 01

## Risco 01 — Backend não subir localmente

Impacto:

```txt
Impede validação da API antes da integração.
```

Mitigação:

```txt
Priorizar Docker, DATABASE_URL, migrations e logs.
```

---

## Risco 02 — Variáveis divergentes entre documentação e código

Impacto:

```txt
Pode quebrar deploy e execução local.
```

Mitigação:

```txt
Usar o código como fonte real e atualizar .env.example.
```

---

## Risco 03 — Frontend continuar preso ao mock

Impacto:

```txt
Dificulta Sessão 02 e esconde erros reais de integração.
```

Mitigação:

```txt
Preparar variável NEXT_PUBLIC_USE_MOCKS e NEXT_PUBLIC_API_BASE_URL.
```

---

## Risco 04 — Permissões desalinhadas

Impacto:

```txt
Usuário pode ver ação no frontend e receber 403 no backend.
```

Mitigação:

```txt
Backend deve ser fonte da verdade para permissões.
```

---

## Risco 05 — Wallets mockadas inválidas

Impacto:

```txt
Pode quebrar autenticação real por assinatura na Sessão 02.
```

Mitigação:

```txt
Validar todos os endereços no padrão EVM.
```

---

# 9. Ordem Recomendada de Execução

```txt
1. Diagnóstico técnico inicial
2. Correção de encoding e mensagens
3. Configuração do .env.example
4. Validação Docker/migrations/seed
5. Alinhamento portas/CORS/hosts
6. Alinhamento de regras frontend/backend
7. Correção de wallets mockadas
8. Relatório de prontidão para integração
```

Não inverter a ordem sem justificativa técnica.

---

# 10. Prompt Base para Implementação da Sessão 01

Use este prompt no Claude Code/Copilot quando for iniciar a Sessão 01:

```txt
Você está atuando como executor técnico seguindo a metodologia DDAD — Document-Driven AI Development.

Projeto: FiscalizaPay Web3.
Sessão atual: sessao_01_saneamento_backend_frontend.

Objetivo da sessão:
Preparar backend e frontend para integração real, corrigindo inconsistências técnicas antes da Sessão 02.

Regras obrigatórias:
1. Siga o planejamento da sessão e implemente um bloco por vez.
2. Não crie funcionalidades fora do escopo do bloco atual.
3. Antes de alterar código, analise o estado atual do projeto.
4. Após cada bloco, valide tecnicamente o que foi feito.
5. Após cada bloco, faça um commit semântico compatível com a alteração.
6. Após cada bloco, gere um feedback em Markdown na pasta:
   Docs/sessoes/sessao_01_saneamento_backend_frontend/feedback
7. Caso encontre bugs fora do escopo, registre em:
   Docs/sessoes/sessao_01_saneamento_backend_frontend/bugs/bugs_sessao_01.md
8. Backend deve ser considerado fonte da verdade para regras de negócio e permissões.
9. Não exponha secrets reais em arquivos versionados.
10. Ao final da sessão, gere o relatório:
   Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/relatorio_prontidao_integracao.md

Fluxo de cada bloco:
- Prévia
- Implementação
- Validação
- Commit
- Feedback

Comece pelo Bloco 01 — Diagnóstico Técnico Inicial.
```

---

# 11. Conclusão

A Sessão 01 é uma etapa de saneamento e preparação técnica.

Ela evita que a equipe tente integrar ou publicar um sistema ainda desalinhado.  
O resultado esperado não é uma nova feature visual, mas sim uma base confiável para a Sessão 02.

A decisão correta é:

```txt
Primeiro estabilizar.
Depois integrar.
Depois fazer deploy.
```

Ao final desta sessão, o FiscalizaPay deve estar tecnicamente pronto para iniciar a integração real entre backend e frontend.
