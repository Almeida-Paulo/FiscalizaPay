# Planejamento Geral — Sessões 01, 02 e 03

## FiscalizaPay Web3 — Saneamento, Integração e Deploy Produção

**Versão:** 1.0  
**Metodologia:** DDAD — Document-Driven AI Development  
**Objetivo:** organizar o caminho final para deixar backend e frontend prontos, integrados e preparados para deploy em produção/staging.

---

# 1. Visão Geral

Após a conclusão do frontend MVP e a análise do backend atual, o projeto FiscalizaPay entra em uma nova fase.

O frontend está forte como MVP visual e demonstrável.  
O backend está bom como MVP técnico, com API real, autenticação por wallet, JWT, PostgreSQL, FastAPI e regras de negócio.  
Porém, os dois ainda não estão totalmente integrados.

A estratégia correta agora é dividir a evolução em três sessões:

```txt
sessao_01_saneamento_backend_frontend
sessao_02_integrar_back_e_front
sessao_03_preparo_deploy_producao
```

A ordem recomendada é:

```txt
1. Primeiro corrigir e alinhar backend/frontend
2. Depois integrar os dois
3. Depois preparar deploy produção/staging
```

---

# 2. Por Que Não Fazer Deploy Agora?

Não é recomendado fazer deploy completo antes das sessões 01 e 02.

Motivos:

```txt
- Backend exige JWT, mas frontend ainda não implementa login real
- Frontend usa wallet visual/demo
- Backend usa assinatura EVM real
- Frontend e backend podem estar com portas/envs desalinhadas
- Regras visuais do frontend divergem das regras reais do backend
- Blockchain real ainda está desabilitado
- API real pode retornar 401 em endpoints protegidos
```

Deploy antes da integração pode gerar um ambiente online, mas quebrado funcionalmente.

A ordem correta é:

```txt
Saneamento → Integração → Deploy
```

---

# 3. Estrutura Recomendada das Sessões

```txt
Docs/
└── sessoes/
    ├── sessao_01_saneamento_backend_frontend/
    │   ├── planejamento/
    │   │   └── blocos/
    │   ├── feedback/
    │   ├── bugs/
    │   └── analises/
    │
    ├── sessao_02_integrar_back_e_front/
    │   ├── planejamento/
    │   │   └── blocos/
    │   ├── feedback/
    │   ├── bugs/
    │   └── analises/
    │
    └── sessao_03_preparo_deploy_producao/
        ├── planejamento/
        │   └── blocos/
        ├── feedback/
        ├── bugs/
        └── analises/
```

---

# 4. Sessão 01 — Saneamento Backend/Frontend

## 4.1 Objetivo

Preparar backend e frontend para integração real, corrigindo problemas conhecidos e eliminando inconsistências técnicas.

## 4.2 Resultado Esperado

Ao final da sessão 01:

```txt
- Backend com encoding corrigido
- Backend com .env.example confiável
- Backend com Docker/migrations validados
- CORS e ALLOWED_HOSTS alinhados
- Frontend apontando para porta correta da API
- Regras frontend/backend alinhadas
- Wallets mockadas corrigidas
- Contrato API revisado
- Relatório de prontidão para integração criado
```

## 4.3 Blocos da Sessão 01

### Bloco 01 — Diagnóstico Técnico Inicial

Objetivo:

```txt
Mapear divergências entre frontend, backend e documentação.
```

Entregas:

```txt
- relatório de divergências
- lista de riscos
- lista de ajustes obrigatórios
```

---

### Bloco 02 — Correção de Encoding e Mensagens

Objetivo:

```txt
Corrigir textos quebrados no backend e frontend.
```

Entregas:

```txt
- arquivos normalizados em UTF-8
- mensagens user-facing corrigidas
- README/backend docs corrigidos
```

---

### Bloco 03 — Configuração Backend .env.example

Objetivo:

```txt
Criar ou revisar .env.example real do backend.
```

Variáveis esperadas:

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

---

### Bloco 04 — Validação Docker, Migrations e Seed

Objetivo:

```txt
Garantir que backend sobe localmente com Docker Compose.
```

Validações:

```txt
docker compose up
alembic upgrade head
seed_demo_profiles.py
GET /health
```

---

### Bloco 05 — Alinhamento de Portas, CORS e Hosts

Objetivo:

```txt
Alinhar comunicação frontend/backend local.
```

Decisão sugerida:

```txt
Backend local: http://127.0.0.1:8000
Frontend local: http://localhost:3000
```

Ajustar:

```txt
CORS_ORIGINS
ALLOWED_HOSTS
NEXT_PUBLIC_API_BASE_URL
```

---

### Bloco 06 — Alinhamento de Regras Frontend/Backend

Objetivo:

```txt
Alinhar permissões visuais do frontend com ACTION_ROLES do backend.
```

Regras backend atuais:

```txt
open_dispute: GESTOR, FISCAL, AUDITOR
simulate_fraud: GESTOR, FISCAL, AUDITOR
```

Ajustar frontend se necessário.

---

### Bloco 07 — Correção de Wallets Mockadas

Objetivo:

```txt
Garantir que todas as wallets mockadas sejam endereços EVM válidos.
```

Formato:

```txt
0x + 40 caracteres hexadecimais
```

---

### Bloco 08 — Relatório de Prontidão para Integração

Objetivo:

```txt
Gerar relatório final da sessão 01 informando se backend/frontend estão prontos para integração.
```

Arquivo sugerido:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/relatorio_prontidao_integracao.md
```

## 4.4 Critério de Aceite da Sessão 01

```txt
[ ] Encoding corrigido
[ ] .env.example backend criado/revisado
[ ] Docker backend validado
[ ] Migrations validadas
[ ] Seed demo validado
[ ] /health funcionando
[ ] CORS alinhado
[ ] Frontend apontando para API correta
[ ] Regras frontend/backend alinhadas
[ ] Wallets mockadas válidas
[ ] Relatório de prontidão criado
```

---

# 5. Sessão 02 — Integração Back + Front

## 5.1 Objetivo

Integrar o frontend com o backend real, substituindo gradualmente o modo demo/mock por comunicação real com API protegida por JWT.

## 5.2 Resultado Esperado

Ao final da sessão 02:

```txt
- Login por wallet funcionando
- Nonce funcionando
- Assinatura de mensagem funcionando
- JWT armazenado no frontend
- Authorization Bearer enviado nas requests
- /auth/me funcionando
- Perfil autenticado substituindo perfil demo quando mocks=false
- Contratos reais carregando
- Actions reais funcionando
- Auditoria real carregando
- Frontend/backend integrados ponta a ponta
```

## 5.3 Blocos da Sessão 02

### Bloco 01 — Auth API no Frontend

Objetivo:

```txt
Criar camada auth-api.
```

Endpoints:

```txt
GET /auth/nonce
POST /auth/verify
GET /auth/me
```

---

### Bloco 02 — Wallet Real + Assinatura

Objetivo:

```txt
Usar wagmi/viem/RainbowKit para conexão real de wallet e assinatura da mensagem de nonce.
```

Entregas:

```txt
- conexão real de wallet
- leitura de address
- assinatura de message
```

---

### Bloco 03 — Verify + JWT

Objetivo:

```txt
Enviar assinatura para backend e receber accessToken.
```

Entregas:

```txt
- verify funcionando
- token recebido
- tratamento de erro
```

---

### Bloco 04 — Auth Store/Session

Objetivo:

```txt
Criar estado de sessão autenticada.
```

Deve guardar:

```txt
accessToken
profile
walletAddress
role
isAuthenticated
```

---

### Bloco 05 — Authorization Bearer no HTTP Client

Objetivo:

```txt
Injetar Authorization: Bearer TOKEN em requests protegidas.
```

---

### Bloco 06 — Integração /auth/me

Objetivo:

```txt
Validar token e carregar perfil autenticado.
```

---

### Bloco 07 — Substituir Perfil Demo em Modo API Real

Objetivo:

```txt
Quando NEXT_PUBLIC_USE_MOCKS=false, usar perfil real retornado pelo backend.
```

Manter demo profile apenas em mock mode.

---

### Bloco 08 — Integrar Contratos Reais

Objetivo:

```txt
Validar GET /contracts, POST /contracts e GET /contracts/{id}.
```

---

### Bloco 09 — Integrar Actions Reais

Objetivo:

```txt
Validar ações reais de contrato.
```

Endpoints:

```txt
confirm-shipment
confirm-delivery
validate-receipt
authorize-payment
open-dispute
simulate-fraud
```

---

### Bloco 10 — Integrar Eventos, Timeline e Auditoria

Objetivo:

```txt
Validar eventos por contrato e auditoria global.
```

Endpoints:

```txt
GET /contracts/{id}/events
GET /audit/events
```

---

### Bloco 11 — Blockchain Indisponível de Forma Segura

Objetivo:

```txt
Tratar register-on-chain como indisponível quando backend retornar erro ou BLOCKCHAIN_ENABLED=false.
```

---

### Bloco 12 — Teste Ponta a Ponta

Objetivo:

```txt
Executar fluxo completo com backend real.
```

Fluxo:

```txt
login wallet
criar contrato
confirmar envio
confirmar entrega
validar recebimento
autorizar pagamento
abrir disputa
simular fraude
consultar auditoria
```

## 5.4 Critério de Aceite da Sessão 02

```txt
[ ] Login wallet real funcionando
[ ] Nonce funcionando
[ ] Assinatura funcionando
[ ] JWT funcionando
[ ] Authorization Bearer funcionando
[ ] /auth/me funcionando
[ ] Perfil real funcionando
[ ] Contratos reais carregando
[ ] Actions reais funcionando
[ ] Timeline real funcionando
[ ] Auditoria real funcionando
[ ] Erros 401/403 tratados
[ ] Mock mode preservado
[ ] Teste ponta a ponta documentado
```

---

# 6. Sessão 03 — Preparo Deploy Produção

## 6.1 Objetivo

Preparar o deploy de backend, banco e frontend em ambiente real/staging.

## 6.2 Resultado Esperado

Ao final da sessão 03:

```txt
- Banco PostgreSQL criado em ambiente gerenciado
- Backend publicado em Render/Railway/Fly.io
- Migrations executadas em produção
- Seed demo executado em produção/staging
- Frontend publicado na Vercel
- CORS configurado corretamente
- Variáveis de ambiente configuradas
- Fluxo completo testado em produção/staging
- Documentação final de deploy criada
```

## 6.3 Blocos da Sessão 03

### Bloco 01 — Escolha da Plataforma Backend

Objetivo:

```txt
Escolher entre Render, Railway ou Fly.io.
```

Critérios:

```txt
facilidade
custo
PostgreSQL gerenciado
Docker support
logs
variáveis de ambiente
```

Recomendação inicial:

```txt
Render ou Railway
```

---

### Bloco 02 — Criar Banco PostgreSQL Gerenciado

Objetivo:

```txt
Criar DATABASE_URL real.
```

---

### Bloco 03 — Configurar Backend Produção

Objetivo:

```txt
Configurar envs de produção.
```

Variáveis:

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_MINUTES=
CORS_ORIGINS=
ALLOWED_HOSTS=
AUTH_NONCE_EXPIRES_MINUTES=
CHAIN_ID=80002
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

---

### Bloco 04 — Executar Migrations em Produção

Objetivo:

```txt
Rodar alembic upgrade head no ambiente remoto.
```

---

### Bloco 05 — Seed Demo em Produção/Staging

Objetivo:

```txt
Criar perfis demo/reais para testar login.
```

---

### Bloco 06 — Validar Backend Remoto

Objetivo:

```txt
Testar backend publicado.
```

Endpoints mínimos:

```txt
GET /health
GET /auth/nonce
POST /auth/verify
GET /auth/me
GET /contracts
```

---

### Bloco 07 — Configurar Frontend Vercel com API Real

Objetivo:

```txt
Trocar Vercel de mock mode para API real.
```

Variáveis:

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=https://URL_DO_BACKEND
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
```

---

### Bloco 08 — Configurar CORS Backend → Vercel

Objetivo:

```txt
Permitir que o frontend publicado consiga chamar o backend.
```

CORS:

```txt
https://SEU_FRONTEND.vercel.app
```

---

### Bloco 09 — Teste Completo Produção/Staging

Objetivo:

```txt
Executar fluxo ponta a ponta online.
```

Validar:

```txt
login
contratos
actions
timeline
auditoria
disputa
fraude
```

---

### Bloco 10 — Documentação Final de Deploy

Objetivo:

```txt
Criar guia final de deploy frontend/backend.
```

Arquivo sugerido:

```txt
Docs/Deploy/deploy_fullstack_fiscalizapay.md
```

## 6.4 Critério de Aceite da Sessão 03

```txt
[ ] Backend remoto online
[ ] PostgreSQL remoto online
[ ] Migrations executadas
[ ] Seed executado
[ ] /health remoto funcionando
[ ] Auth remoto funcionando
[ ] Frontend Vercel online
[ ] Frontend usando API real
[ ] CORS configurado
[ ] Fluxo ponta a ponta validado
[ ] Documentação final criada
```

---

# 7. Roadmap Final Recomendado

```txt
Sessão 01 — Saneamento Backend/Frontend
    ↓
Sessão 02 — Integração Back + Front
    ↓
Sessão 03 — Preparo Deploy Produção
```

Não inverter a ordem.

---

# 8. Riscos Principais

## Risco 01 — Deploy antes da integração

Pode gerar dois sistemas online que não conversam.

Mitigação:

```txt
Integrar localmente antes do deploy.
```

## Risco 02 — JWT não implementado no frontend

Pode gerar erro 401 em todas as rotas protegidas.

Mitigação:

```txt
Implementar sessão real na sessão 02.
```

## Risco 03 — CORS incorreto

Frontend Vercel pode ser bloqueado pelo backend.

Mitigação:

```txt
Configurar CORS_ORIGINS com a URL final da Vercel.
```

## Risco 04 — Wallets demo inválidas

Login real pode falhar.

Mitigação:

```txt
Usar wallets EVM reais ou endereços válidos.
```

## Risco 05 — Blockchain indisponível

`register-on-chain` pode falhar em API real.

Mitigação:

```txt
Marcar funcionalidade como indisponível até smart contract existir.
```

---

# 9. Definição de Pronto Geral

O projeto será considerado pronto para produção/staging quando:

```txt
[ ] Frontend publicado
[ ] Backend publicado
[ ] Banco publicado
[ ] Login por wallet funcionando
[ ] JWT funcionando
[ ] Contratos reais funcionando
[ ] Actions reais funcionando
[ ] Auditoria real funcionando
[ ] CORS configurado
[ ] Variáveis de ambiente configuradas
[ ] Deploy documentado
[ ] Demo online validada
```

---

# 10. Conclusão

O FiscalizaPay já possui um frontend forte e um backend tecnicamente promissor.

O próximo desafio não é criar mais telas.

O próximo desafio é:

```txt
Saneamento
Integração
Deploy
```

Essa divisão reduz risco, melhora rastreabilidade e evita retrabalho.

A recomendação oficial é executar as três sessões nesta ordem:

```txt
1. sessao_01_saneamento_backend_frontend
2. sessao_02_integrar_back_e_front
3. sessao_03_preparo_deploy_producao
```

Somente após isso o projeto deve ser considerado pronto para apresentação online completa com frontend e backend reais.
