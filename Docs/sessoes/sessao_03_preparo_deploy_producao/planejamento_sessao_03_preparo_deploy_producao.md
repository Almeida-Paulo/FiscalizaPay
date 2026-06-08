# Planejamento — Sessão 03

## Preparo de Deploy Produção/Staging — FiscalizaPay Web3

**Versão:** 1.0  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** 03  
**Nome da sessão:** `sessao_03_preparo_deploy_producao`  
**Objetivo principal:** preparar backend, banco de dados e frontend para publicação em ambiente online de produção/staging, garantindo que o sistema esteja funcional, configurado, documentado e validado ponta a ponta.

---

# 1. Contexto da Sessão

A Sessão 03 deve acontecer somente após a conclusão da Sessão 01 e da Sessão 02.

A ordem correta do projeto é:

```txt
Sessão 01 — Saneamento Backend/Frontend
Sessão 02 — Integração Backend + Frontend
Sessão 03 — Preparo Deploy Produção/Staging
```

A Sessão 03 não deve ser usada para corrigir problemas estruturais grandes de backend ou frontend.

Ela deve partir do pressuposto de que:

```txt
- Backend já sobe localmente
- Migrations foram validadas localmente
- Seed foi validado localmente
- Frontend já conversa com backend real
- Login por wallet já funciona localmente
- JWT já funciona localmente
- Endpoints principais já foram integrados
- Mock mode foi preservado
- Fluxo ponta a ponta local foi validado
```

Caso algum desses pontos ainda não esteja pronto, o correto é voltar para a Sessão 01 ou Sessão 02 antes de prosseguir com deploy.

---

# 2. Objetivo da Sessão 03

Preparar o FiscalizaPay Web3 para rodar em ambiente remoto, com frontend e backend publicados e se comunicando corretamente.

O foco desta sessão é transformar o projeto integrado localmente em uma aplicação online validável.

---

# 3. Resultado Esperado

Ao final da Sessão 03, espera-se que o projeto tenha:

```txt
- Plataforma de deploy backend escolhida
- Banco PostgreSQL remoto criado
- Backend publicado em ambiente remoto
- Variáveis de ambiente configuradas
- Migrations executadas no ambiente remoto
- Seed demo executado em produção/staging
- Endpoints principais validados online
- Frontend publicado na Vercel
- Frontend apontando para API real remota
- CORS configurado corretamente
- Fluxo ponta a ponta validado online
- Documentação final de deploy criada
- Feedback DDAD da sessão criado
- Commit semântico realizado
```

---

# 4. Estrutura de Pastas da Sessão 03

A estrutura recomendada para esta sessão é:

```txt
Docs/
└── sessoes/
    └── sessao_03_preparo_deploy_producao/
        ├── planejamento/
        │   ├── planejamento_sessao_03_preparo_deploy_producao.md
        │   └── blocos/
        │       ├── bloco_01_escolha_plataforma_backend.md
        │       ├── bloco_02_criar_banco_postgresql_gerenciado.md
        │       ├── bloco_03_configurar_backend_producao.md
        │       ├── bloco_04_executar_migrations_producao.md
        │       ├── bloco_05_seed_demo_producao_staging.md
        │       ├── bloco_06_validar_backend_remoto.md
        │       ├── bloco_07_configurar_frontend_vercel_api_real.md
        │       ├── bloco_08_configurar_cors_backend_vercel.md
        │       ├── bloco_09_teste_completo_producao_staging.md
        │       └── bloco_10_documentacao_final_deploy.md
        │
        ├── feedback/
        │   └── feedback_sessao_03_preparo_deploy_producao.md
        │
        ├── bugs/
        │   └── bugs_sessao_03_preparo_deploy_producao.md
        │
        └── analises/
            ├── analise_prontidao_deploy.md
            └── relatorio_validacao_producao_staging.md
```

---

# 5. Premissas Técnicas

## 5.1 Backend

O backend deve estar preparado para rodar remotamente com:

```txt
- FastAPI
- PostgreSQL remoto
- JWT_SECRET seguro
- CORS configurável
- ALLOWED_HOSTS configurável
- Migrations via Alembic
- Seed demo controlado
- Health check funcional
```

## 5.2 Frontend

O frontend deve estar preparado para rodar na Vercel com:

```txt
- NEXT_PUBLIC_USE_MOCKS=false
- NEXT_PUBLIC_API_BASE_URL apontando para backend remoto
- Wallet login real funcionando
- JWT sendo enviado no Authorization Bearer
- Tratamento de erro 401/403
- Fallback visual para blockchain indisponível
```

## 5.3 Blockchain

Como o smart contract real ainda não está consolidado, a recomendação é manter:

```env
BLOCKCHAIN_ENABLED=false
```

A funcionalidade `register-on-chain` deve ser tratada visualmente como indisponível ou experimental até a existência de smart contract real e contrato publicado.

---

# 6. Blocos da Sessão 03

---

## Bloco 01 — Escolha da Plataforma Backend

### Objetivo

Definir a plataforma onde o backend será publicado.

### Plataformas recomendadas

```txt
- Render
- Railway
- Fly.io
```

### Critérios de escolha

```txt
- Facilidade de deploy
- Suporte a Docker
- Suporte a PostgreSQL gerenciado
- Facilidade de configurar variáveis de ambiente
- Logs acessíveis
- Custo inicial baixo
- Facilidade para reiniciar serviço
- Compatibilidade com FastAPI
```

### Recomendação inicial

Para MVP/staging, priorizar:

```txt
1. Render
2. Railway
```

### Entregas

```txt
- Plataforma escolhida
- Justificativa documentada
- Link do serviço criado ou preparado
```

### Critério de aceite

```txt
[ ] Plataforma backend escolhida
[ ] Justificativa registrada
[ ] Serviço backend criado/preparado
[ ] Estratégia de deploy definida
```

---

## Bloco 02 — Criar Banco PostgreSQL Gerenciado

### Objetivo

Criar o banco de dados remoto que será usado pelo backend em produção/staging.

### Entregas

```txt
- Banco PostgreSQL remoto criado
- DATABASE_URL gerada
- Acesso administrativo validado
- Região documentada
- Nome do banco documentado
```

### Cuidados

```txt
- Não versionar DATABASE_URL real
- Não expor senha do banco em documentos públicos
- Usar conexão SSL se a plataforma exigir
- Separar banco local de banco remoto
```

### Critério de aceite

```txt
[ ] PostgreSQL remoto criado
[ ] DATABASE_URL disponível em ambiente seguro
[ ] Conexão validada
[ ] Banco separado do ambiente local
```

---

## Bloco 03 — Configurar Backend Produção

### Objetivo

Configurar o backend para rodar corretamente no ambiente remoto.

### Variáveis esperadas

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_MINUTES=60
CORS_ORIGINS=
ALLOWED_HOSTS=
AUTH_NONCE_EXPIRES_MINUTES=10
CHAIN_ID=80002
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

### Recomendações

```txt
- JWT_SECRET deve ser forte e exclusivo do ambiente remoto
- CORS_ORIGINS deve receber a URL final do frontend
- ALLOWED_HOSTS deve receber o domínio do backend remoto
- BLOCKCHAIN_ENABLED deve permanecer false até contrato real existir
- CONTRACT_ADDRESS pode ficar vazio enquanto blockchain estiver desabilitado
```

### Entregas

```txt
- Variáveis cadastradas na plataforma
- Configuração de start command validada
- Configuração de build/deploy validada
- Logs iniciais analisados
```

### Critério de aceite

```txt
[ ] DATABASE_URL configurada
[ ] JWT_SECRET configurado
[ ] CORS_ORIGINS configurado
[ ] ALLOWED_HOSTS configurado
[ ] BLOCKCHAIN_ENABLED=false configurado
[ ] Backend inicia sem erro crítico
```

---

## Bloco 04 — Executar Migrations em Produção

### Objetivo

Criar a estrutura de tabelas no banco PostgreSQL remoto.

### Comando esperado

```bash
alembic upgrade head
```

### Entregas

```txt
- Migrations executadas no banco remoto
- Tabelas criadas
- Logs salvos/analisados
- Erros documentados, se existirem
```

### Validações

```txt
- Verificar se as tabelas principais existem
- Verificar se não houve erro de conexão
- Verificar se DATABASE_URL aponta para o banco remoto correto
```

### Critério de aceite

```txt
[ ] Alembic executado em produção/staging
[ ] Tabelas criadas no banco remoto
[ ] Nenhum erro crítico de migration
[ ] Resultado documentado
```

---

## Bloco 05 — Seed Demo em Produção/Staging

### Objetivo

Popular o ambiente remoto com dados mínimos para teste e demonstração.

### Seed esperado

```bash
python seed_demo_profiles.py
```

### Entregas

```txt
- Perfis demo criados
- Wallets de teste válidas
- Dados mínimos disponíveis
- Seed documentado
```

### Cuidados

```txt
- Não criar dados sensíveis reais
- Usar apenas dados demo
- Garantir wallets EVM válidas
- Documentar quais perfis foram criados
```

### Critério de aceite

```txt
[ ] Seed executado
[ ] Perfis demo criados
[ ] Wallets válidas
[ ] Ambiente pronto para login/teste
```

---

## Bloco 06 — Validar Backend Remoto

### Objetivo

Confirmar que a API publicada está acessível e funcional.

### Endpoints mínimos para validar

```txt
GET /health
GET /auth/nonce
POST /auth/verify
GET /auth/me
GET /contracts
```

### Validações esperadas

```txt
- /health retorna sucesso
- /auth/nonce gera nonce corretamente
- /auth/verify valida assinatura e retorna token
- /auth/me retorna perfil autenticado
- /contracts responde com token válido
- Endpoints protegidos retornam 401 sem token
```

### Entregas

```txt
- Relatório de validação da API remota
- Evidência dos endpoints testados
- Lista de erros encontrados, se houver
```

### Critério de aceite

```txt
[ ] Backend remoto online
[ ] /health funcionando
[ ] Auth remoto funcionando
[ ] JWT remoto funcionando
[ ] Endpoints protegidos protegidos corretamente
[ ] Relatório de validação criado
```

---

## Bloco 07 — Configurar Frontend Vercel com API Real

### Objetivo

Publicar ou configurar o frontend na Vercel usando a API real remota.

### Variáveis esperadas

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=https://URL_DO_BACKEND
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
```

### Entregas

```txt
- Projeto frontend configurado na Vercel
- Variáveis de ambiente cadastradas
- Build executado com sucesso
- URL pública do frontend gerada
```

### Validações

```txt
- Frontend abre online
- Frontend aponta para backend remoto
- Mock mode está desativado
- Login wallet tenta usar API real
- Erros são tratados visualmente
```

### Critério de aceite

```txt
[ ] Frontend publicado na Vercel
[ ] NEXT_PUBLIC_USE_MOCKS=false
[ ] NEXT_PUBLIC_API_BASE_URL configurado
[ ] Build sem erro crítico
[ ] Frontend abre online
```

---

## Bloco 08 — Configurar CORS Backend → Vercel

### Objetivo

Permitir que o frontend publicado consiga chamar a API remota sem bloqueio de CORS.

### Configuração esperada

```txt
CORS_ORIGINS=https://SEU_FRONTEND.vercel.app
```

Caso exista domínio customizado:

```txt
CORS_ORIGINS=https://SEU_DOMINIO.com,https://SEU_FRONTEND.vercel.app
```

### Também validar

```txt
ALLOWED_HOSTS=https://URL_DO_BACKEND
```

ou conforme a estratégia do backend.

### Entregas

```txt
- CORS ajustado
- ALLOWED_HOSTS ajustado
- Frontend chamando backend sem bloqueio
- Erros de preflight resolvidos
```

### Critério de aceite

```txt
[ ] URL da Vercel adicionada ao CORS
[ ] Backend reiniciado após ajuste
[ ] Frontend consegue chamar API
[ ] Nenhum erro de CORS no navegador
```

---

## Bloco 09 — Teste Completo Produção/Staging

### Objetivo

Validar o fluxo completo online, simulando a apresentação real do produto.

### Fluxo a testar

```txt
1. Acessar frontend publicado
2. Conectar wallet
3. Solicitar nonce
4. Assinar mensagem
5. Receber JWT
6. Carregar /auth/me
7. Criar contrato
8. Confirmar envio
9. Confirmar entrega
10. Validar recebimento
11. Autorizar pagamento
12. Abrir disputa
13. Simular fraude
14. Consultar timeline
15. Consultar auditoria
16. Validar comportamento de blockchain indisponível
```

### Entregas

```txt
- Relatório de teste ponta a ponta online
- Bugs encontrados documentados
- Evidências do fluxo validado
- Lista de pendências, se existirem
```

### Critério de aceite

```txt
[ ] Login online funcionando
[ ] JWT online funcionando
[ ] Contratos online funcionando
[ ] Actions online funcionando
[ ] Timeline online funcionando
[ ] Auditoria online funcionando
[ ] Erros 401/403 tratados
[ ] Blockchain indisponível tratado corretamente
[ ] Relatório ponta a ponta criado
```

---

## Bloco 10 — Documentação Final de Deploy

### Objetivo

Criar a documentação final de deploy fullstack do FiscalizaPay.

### Arquivo sugerido

```txt
Docs/Deploy/deploy_fullstack_fiscalizapay.md
```

### Conteúdo mínimo

```txt
- Visão geral da arquitetura publicada
- Plataforma do backend
- Plataforma do banco
- Plataforma do frontend
- Variáveis de ambiente necessárias
- Como rodar migrations
- Como rodar seed
- Como validar backend
- Como validar frontend
- Como testar login wallet
- Como testar fluxo completo
- Como tratar erros comuns
- Checklist final de produção/staging
```

### Entregas

```txt
- Documento final de deploy criado
- Checklist final preenchido
- Riscos restantes documentados
- Próximos passos documentados
```

### Critério de aceite

```txt
[ ] deploy_fullstack_fiscalizapay.md criado
[ ] Variáveis documentadas sem expor segredos
[ ] Processo de deploy backend documentado
[ ] Processo de deploy frontend documentado
[ ] Processo de validação documentado
[ ] Checklist final criado
```

---

# 7. Checklist Geral da Sessão 03

```txt
[ ] Bloco 01 — Plataforma backend escolhida
[ ] Bloco 02 — PostgreSQL remoto criado
[ ] Bloco 03 — Backend produção configurado
[ ] Bloco 04 — Migrations executadas em produção/staging
[ ] Bloco 05 — Seed demo executado
[ ] Bloco 06 — Backend remoto validado
[ ] Bloco 07 — Frontend Vercel configurado com API real
[ ] Bloco 08 — CORS backend/frontend configurado
[ ] Bloco 09 — Teste completo produção/staging executado
[ ] Bloco 10 — Documentação final de deploy criada
```

---

# 8. Critério de Aceite da Sessão 03

A Sessão 03 só deve ser considerada concluída quando:

```txt
[ ] Backend remoto está online
[ ] PostgreSQL remoto está online
[ ] Migrations foram executadas
[ ] Seed foi executado
[ ] /health remoto funciona
[ ] Auth remoto funciona
[ ] JWT remoto funciona
[ ] Frontend Vercel está online
[ ] Frontend usa API real
[ ] CORS está configurado
[ ] Fluxo ponta a ponta online foi validado
[ ] Documentação final de deploy foi criada
[ ] Feedback DDAD da sessão foi criado
[ ] Commit semântico foi realizado
```

---

# 9. Bugs e Pendências

Durante a execução da Sessão 03, qualquer erro encontrado deve ser registrado em:

```txt
Docs/sessoes/sessao_03_preparo_deploy_producao/bugs/bugs_sessao_03_preparo_deploy_producao.md
```

Formato recomendado:

```md
# Bug — Sessão 03

## Identificação

**Data:**  
**Bloco:**  
**Ambiente:** local/staging/produção  
**Severidade:** P1/P2/P3/P4  

## Descrição

Descrever o problema encontrado.

## Evidência

Adicionar print, log, endpoint, erro do console ou resposta da API.

## Impacto

Explicar como isso afeta o deploy ou funcionamento do sistema.

## Possível causa

Hipótese técnica.

## Solução aplicada ou sugerida

Descrever a correção.

## Status

```txt
Aberto / Em correção / Corrigido / Validado
```
```

---

# 10. Feedback DDAD da Sessão

Ao final da sessão, deve ser criado o feedback em:

```txt
Docs/sessoes/sessao_03_preparo_deploy_producao/feedback/feedback_sessao_03_preparo_deploy_producao.md
```

Conteúdo mínimo:

```txt
- O que foi feito
- Arquivos alterados/criados
- Ambientes configurados
- Endpoints validados
- Variáveis configuradas
- Bugs encontrados
- Bugs corrigidos
- Pendências restantes
- Riscos para produção
- Evidências de validação
- Status final da sessão
```

---

# 11. Commit Semântico

Ao final da Sessão 03, realizar commit semântico.

Sugestão:

```bash
git add .
git commit -m "chore: prepare production deploy for fiscalizapay"
```

Caso a sessão tenha criado documentação e ajustes de infraestrutura:

```bash
git commit -m "docs: add production deploy planning and validation"
```

Caso tenha alterado frontend/backend para deploy real:

```bash
git commit -m "chore: configure fullstack staging deployment"
```

---

# 12. Riscos da Sessão 03

## Risco 01 — Deploy feito antes da integração estar estável

### Impacto

Frontend e backend podem estar online, mas quebrados funcionalmente.

### Mitigação

Só iniciar Sessão 03 após Sessão 02 estar validada localmente.

---

## Risco 02 — CORS incorreto

### Impacto

Frontend publicado não consegue consumir API.

### Mitigação

Adicionar a URL final da Vercel em `CORS_ORIGINS` e validar no navegador.

---

## Risco 03 — Variáveis de ambiente incorretas

### Impacto

Backend pode subir, mas falhar em auth, banco ou endpoints protegidos.

### Mitigação

Criar checklist de envs e validar logs após deploy.

---

## Risco 04 — DATABASE_URL apontando para ambiente errado

### Impacto

Dados podem ser criados no banco errado ou migrations podem rodar no ambiente incorreto.

### Mitigação

Validar host, banco e usuário antes de rodar migrations.

---

## Risco 05 — JWT_SECRET fraco ou exposto

### Impacto

Risco de segurança no ambiente publicado.

### Mitigação

Usar segredo forte, não versionar e cadastrar apenas em ambiente seguro da plataforma.

---

## Risco 06 — Blockchain indisponível quebrando fluxo

### Impacto

Usuário pode tentar registrar on-chain e receber erro crítico.

### Mitigação

Manter `BLOCKCHAIN_ENABLED=false` e tratar visualmente como funcionalidade experimental/indisponível.

---

# 13. Definition of Done — Sessão 03

A Sessão 03 estará pronta quando:

```txt
[ ] Backend remoto acessível publicamente
[ ] Banco remoto conectado ao backend
[ ] Migrations aplicadas no banco remoto
[ ] Seed demo disponível
[ ] Frontend publicado na Vercel
[ ] Frontend apontando para backend remoto
[ ] Login wallet funcionando online
[ ] JWT funcionando online
[ ] Contratos funcionando online
[ ] Actions funcionando online
[ ] Auditoria funcionando online
[ ] CORS sem erro
[ ] Variáveis de ambiente documentadas
[ ] Deploy documentado
[ ] Teste completo produção/staging registrado
[ ] Feedback DDAD criado
[ ] Commit semântico realizado
```

---

# 14. Próximo Passo Após a Sessão 03

Depois da Sessão 03, o projeto estará pronto para uma apresentação online mais segura.

Os próximos passos naturais seriam:

```txt
- Sessão 04 — Smart Contract real e integração blockchain
- Sessão 05 — Hardening de segurança e observabilidade
- Sessão 06 — Preparação de pitch/demo final
```

Porém, essas sessões só devem ser abertas após o ambiente fullstack remoto estar validado.

---

# 15. Conclusão

A Sessão 03 é a fase que transforma o FiscalizaPay de um projeto integrado localmente em uma aplicação online validável.

Ela não deve ser tratada apenas como “subir na internet”.

Ela envolve:

```txt
- infraestrutura
- banco remoto
- backend remoto
- frontend remoto
- CORS
- envs
- migrations
- seed
- validação ponta a ponta
- documentação
- feedback
- commit
```

A execução correta da Sessão 03 reduz o risco de apresentação quebrada, facilita manutenção futura e cria uma base real para evoluir o projeto para blockchain, produção e pitch técnico.
