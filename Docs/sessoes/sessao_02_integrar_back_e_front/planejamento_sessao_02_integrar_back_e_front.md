# Planejamento — Sessão 02

## Integração Backend + Frontend — FiscalizaPay Web3

**Versão:** 1.0  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Objetivo central:** integrar o frontend com o backend real, substituindo gradualmente o modo demo/mock por comunicação real com API, autenticação por wallet, JWT, contratos, ações, eventos e auditoria.

---

# 1. Contexto da Sessão

A Sessão 02 deve começar somente após a Sessão 01 ter saneado os pontos técnicos essenciais do projeto.

A ordem geral definida para o FiscalizaPay Web3 é:

```txt
Saneamento → Integração → Deploy
```

Nesta sessão, o objetivo deixa de ser apenas preparar o ambiente e passa a ser conectar, de fato, o frontend ao backend.

O frontend não deve mais depender somente de dados mockados quando estiver em modo API real.  
O backend deve ser consumido de forma controlada, com autenticação por wallet, assinatura de nonce, geração de JWT e envio do token nas rotas protegidas.

---

# 2. Objetivo da Sessão 02

Integrar o frontend com o backend real do FiscalizaPay Web3, garantindo que os principais fluxos funcionais trabalhem ponta a ponta.

Ao final desta sessão, o projeto deve estar com:

```txt
- Login por wallet funcionando
- Nonce funcionando
- Assinatura de mensagem funcionando
- JWT recebido e armazenado no frontend
- Authorization Bearer enviado nas requests protegidas
- /auth/me funcionando
- Perfil autenticado substituindo perfil demo quando mocks=false
- Contratos reais carregando da API
- Criação de contrato integrada com backend
- Ações reais de contrato funcionando
- Eventos/timeline reais funcionando
- Auditoria global carregando da API
- Erros 401/403 tratados visualmente
- Mock mode preservado para demo/local fallback
- Teste ponta a ponta documentado
```

---

# 3. Estrutura de Pastas da Sessão

A sessão deve seguir o padrão DDAD adotado no projeto:

```txt
Docs/
└── sessoes/
    └── sessao_02_integrar_back_e_front/
        ├── planejamento/
        │   ├── planejamento_sessao_02.md
        │   └── blocos/
        │       ├── bloco_01_auth_api_frontend.md
        │       ├── bloco_02_wallet_real_assinatura.md
        │       ├── bloco_03_verify_jwt.md
        │       ├── bloco_04_auth_store_session.md
        │       ├── bloco_05_authorization_bearer_http_client.md
        │       ├── bloco_06_integracao_auth_me.md
        │       ├── bloco_07_substituir_perfil_demo_modo_api_real.md
        │       ├── bloco_08_integrar_contratos_reais.md
        │       ├── bloco_09_integrar_actions_reais.md
        │       ├── bloco_10_integrar_eventos_timeline_auditoria.md
        │       ├── bloco_11_blockchain_indisponivel_forma_segura.md
        │       └── bloco_12_teste_ponta_a_ponta.md
        │
        ├── feedback/
        │   ├── feedback_bloco_01_auth_api_frontend.md
        │   ├── feedback_bloco_02_wallet_real_assinatura.md
        │   ├── feedback_bloco_03_verify_jwt.md
        │   ├── feedback_bloco_04_auth_store_session.md
        │   ├── feedback_bloco_05_authorization_bearer_http_client.md
        │   ├── feedback_bloco_06_integracao_auth_me.md
        │   ├── feedback_bloco_07_substituir_perfil_demo_modo_api_real.md
        │   ├── feedback_bloco_08_integrar_contratos_reais.md
        │   ├── feedback_bloco_09_integrar_actions_reais.md
        │   ├── feedback_bloco_10_integrar_eventos_timeline_auditoria.md
        │   ├── feedback_bloco_11_blockchain_indisponivel_forma_segura.md
        │   └── feedback_bloco_12_teste_ponta_a_ponta.md
        │
        ├── bugs/
        │   └── bugs_sessao_02.md
        │
        └── analises/
            ├── contrato_api_integracao.md
            ├── relatorio_erros_auth_integracao.md
            └── relatorio_teste_ponta_a_ponta.md
```

---

# 4. Fluxo DDAD Obrigatório

Cada bloco da Sessão 02 deve seguir o ciclo:

```txt
1. Ler o planejamento do bloco
2. Conferir o resultado da Sessão 01
3. Analisar os arquivos envolvidos
4. Implementar somente o escopo do bloco
5. Validar localmente com backend e frontend rodando
6. Corrigir bugs encontrados
7. Fazer commit semântico
8. Gerar feedback em Markdown
9. Salvar feedback na pasta da sessão
```

Nenhum bloco deve avançar sem validação e feedback documentado.

---

# 5. Premissas Técnicas

Antes de iniciar a Sessão 02, considerar como premissas:

```txt
- Backend local funcionando em http://127.0.0.1:8000
- Frontend local funcionando em http://localhost:3000
- CORS configurado para o frontend local
- ALLOWED_HOSTS configurado corretamente
- .env.example revisado
- Migrations aplicadas
- Seed demo validado, se necessário
- Endpoint /health funcionando
- Wallets mockadas corrigidas ou substituídas
- Regras frontend/backend revisadas
```

Caso qualquer premissa esteja quebrada, registrar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

E corrigir antes de seguir com o bloco correspondente.

---

# 6. Variáveis de Ambiente Esperadas

## 6.1 Frontend

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
```

## 6.2 Backend

```env
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_MINUTES=60
CORS_ORIGINS=http://localhost:3000
ALLOWED_HOSTS=localhost,127.0.0.1
AUTH_NONCE_EXPIRES_MINUTES=10
CHAIN_ID=80002
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

---

# 7. Blocos da Sessão 02

---

## Bloco 01 — Auth API no Frontend

### Objetivo

Criar uma camada de comunicação no frontend para consumir os endpoints de autenticação do backend.

### Endpoints envolvidos

```txt
GET /auth/nonce
POST /auth/verify
GET /auth/me
```

### Tarefas

```txt
[ ] Identificar estrutura atual de services/api no frontend
[ ] Criar ou ajustar auth-api/authService
[ ] Criar função para solicitar nonce
[ ] Criar função para verificar assinatura
[ ] Criar função para buscar usuário autenticado em /auth/me
[ ] Padronizar tratamento de erro da API
[ ] Tipar requests e responses
[ ] Garantir uso de NEXT_PUBLIC_API_BASE_URL
```

### Entregas

```txt
- Camada auth API criada
- Tipagens básicas criadas
- Tratamento inicial de erro implementado
- Feedback do bloco salvo
```

### Commit sugerido

```txt
feat: criar camada auth api para integracao com backend
```

### Critério de aceite

```txt
[ ] Frontend possui função para GET /auth/nonce
[ ] Frontend possui função para POST /auth/verify
[ ] Frontend possui função para GET /auth/me
[ ] API base URL vem de variável de ambiente
[ ] Erros são tratados de forma padronizada
[ ] Mock mode não foi removido
```

---

## Bloco 02 — Wallet Real + Assinatura

### Objetivo

Conectar wallet real no frontend e assinar a mensagem de nonce recebida do backend.

### Tarefas

```txt
[ ] Validar biblioteca atual de wallet usada no frontend
[ ] Usar wagmi/viem/RainbowKit ou stack já instalada
[ ] Ler address conectado
[ ] Solicitar nonce ao backend usando wallet address
[ ] Exibir mensagem clara antes da assinatura, se necessário
[ ] Assinar mensagem do nonce
[ ] Tratar rejeição de assinatura pelo usuário
[ ] Tratar wallet desconectada
```

### Entregas

```txt
- Conexão real de wallet funcionando
- Address real lido pelo frontend
- Assinatura de mensagem funcionando
- Erros de assinatura tratados
```

### Commit sugerido

```txt
feat: integrar wallet real e assinatura de nonce
```

### Critério de aceite

```txt
[ ] Usuário consegue conectar wallet
[ ] Frontend lê o address conectado
[ ] Frontend solicita nonce ao backend
[ ] Usuário consegue assinar a mensagem
[ ] Rejeição de assinatura é tratada
[ ] Wallet desconectada é tratada
```

---

## Bloco 03 — Verify + JWT

### Objetivo

Enviar a assinatura da wallet para o backend, validar o login e receber um JWT.

### Tarefas

```txt
[ ] Enviar wallet address para o fluxo de verify
[ ] Enviar assinatura gerada pela wallet
[ ] Enviar mensagem/nonce conforme contrato esperado pelo backend
[ ] Receber accessToken/JWT
[ ] Validar formato da resposta
[ ] Tratar erros 400, 401 e assinatura inválida
[ ] Não persistir token se verify falhar
```

### Entregas

```txt
- Fluxo verify funcionando
- JWT recebido no frontend
- Tratamento de erro implementado
- Feedback documentado
```

### Commit sugerido

```txt
feat: validar assinatura e receber jwt no frontend
```

### Critério de aceite

```txt
[ ] POST /auth/verify funciona
[ ] JWT é recebido quando assinatura é válida
[ ] JWT não é salvo em caso de erro
[ ] Erro de assinatura inválida é tratado
[ ] Erro de nonce expirado é tratado, se aplicável
```

---

## Bloco 04 — Auth Store/Session

### Objetivo

Criar ou ajustar o estado global de autenticação do frontend.

### Estado mínimo esperado

```txt
accessToken
profile
walletAddress
role
isAuthenticated
isLoading
error
```

### Tarefas

```txt
[ ] Identificar store/context atual de autenticação
[ ] Criar auth store ou adaptar a existente
[ ] Guardar accessToken
[ ] Guardar profile autenticado
[ ] Guardar walletAddress
[ ] Guardar role
[ ] Criar função loginWithWallet
[ ] Criar função logout
[ ] Criar função restoreSession, se aplicável
[ ] Tratar loading e erro
```

### Entregas

```txt
- Estado de sessão autenticada criado
- Login/logout centralizados
- Estrutura pronta para rotas protegidas
```

### Commit sugerido

```txt
feat: criar store de sessao autenticada
```

### Critério de aceite

```txt
[ ] Store/context possui accessToken
[ ] Store/context possui profile
[ ] Store/context possui walletAddress
[ ] Store/context possui role
[ ] Existe login centralizado
[ ] Existe logout centralizado
[ ] Estado de loading e erro funciona
```

---

## Bloco 05 — Authorization Bearer no HTTP Client

### Objetivo

Garantir que toda request protegida envie o token JWT no header Authorization.

### Header esperado

```txt
Authorization: Bearer TOKEN
```

### Tarefas

```txt
[ ] Identificar http client/fetch wrapper/axios usado no frontend
[ ] Injetar Authorization Bearer quando houver token
[ ] Evitar enviar token em endpoints públicos, se necessário
[ ] Tratar resposta 401
[ ] Tratar resposta 403
[ ] Criar fluxo de logout ou expiração de sessão em 401 persistente
```

### Entregas

```txt
- HTTP client autenticado
- Rotas protegidas consumindo JWT
- Tratamento de 401/403 implementado
```

### Commit sugerido

```txt
feat: adicionar authorization bearer no http client
```

### Critério de aceite

```txt
[ ] Requests protegidas enviam Authorization Bearer
[ ] 401 é tratado
[ ] 403 é tratado
[ ] Token expirado não quebra a aplicação silenciosamente
[ ] Usuário recebe feedback visual adequado
```

---

## Bloco 06 — Integração /auth/me

### Objetivo

Validar o token recebido e carregar o perfil autenticado do backend.

### Tarefas

```txt
[ ] Chamar GET /auth/me após login bem-sucedido
[ ] Chamar GET /auth/me ao restaurar sessão, se aplicável
[ ] Guardar profile retornado no auth store
[ ] Mapear role para permissões visuais
[ ] Tratar token inválido
[ ] Tratar perfil não encontrado
```

### Entregas

```txt
- /auth/me integrado
- Profile real carregado no frontend
- Role real disponível para a interface
```

### Commit sugerido

```txt
feat: integrar perfil autenticado via auth me
```

### Critério de aceite

```txt
[ ] /auth/me retorna perfil com token válido
[ ] Profile real aparece no estado do frontend
[ ] Role real é usada na interface
[ ] Token inválido gera logout ou erro controlado
```

---

## Bloco 07 — Substituir Perfil Demo em Modo API Real

### Objetivo

Garantir que, quando `NEXT_PUBLIC_USE_MOCKS=false`, o frontend use o perfil real do backend e não dados demo fixos.

### Tarefas

```txt
[ ] Localizar pontos onde perfil demo é usado
[ ] Separar comportamento mock de comportamento API real
[ ] Usar profile do backend em modo real
[ ] Manter demo profile apenas quando NEXT_PUBLIC_USE_MOCKS=true
[ ] Evitar mistura de estado mock com estado real
[ ] Ajustar componentes que exibem nome, role e wallet
```

### Entregas

```txt
- Perfil real substituindo demo em modo API
- Mock mode preservado
- Componentes exibindo dados corretos
```

### Commit sugerido

```txt
feat: substituir perfil demo por perfil autenticado em modo api
```

### Critério de aceite

```txt
[ ] Em mocks=false, frontend usa profile real
[ ] Em mocks=true, frontend continua funcionando em demo
[ ] Não existe mistura visual entre perfil mock e real
[ ] Role exibida corresponde ao backend
```

---

## Bloco 08 — Integrar Contratos Reais

### Objetivo

Integrar o frontend aos endpoints reais de contratos do backend.

### Endpoints previstos

```txt
GET /contracts
POST /contracts
GET /contracts/{id}
```

### Tarefas

```txt
[ ] Criar ou ajustar contracts-api/contractsService
[ ] Listar contratos reais
[ ] Criar contrato real
[ ] Buscar detalhes de contrato real
[ ] Ajustar tipagens de contrato
[ ] Mapear campos do backend para UI
[ ] Tratar loading/empty/error states
[ ] Preservar dados mockados quando mocks=true
```

### Entregas

```txt
- Lista de contratos integrada
- Criação de contrato integrada
- Detalhe de contrato integrado
- Estados visuais tratados
```

### Commit sugerido

```txt
feat: integrar contratos reais com backend
```

### Critério de aceite

```txt
[ ] GET /contracts funciona no frontend
[ ] POST /contracts funciona no frontend
[ ] GET /contracts/{id} funciona no frontend
[ ] Campos aparecem corretamente na UI
[ ] Loading, vazio e erro são tratados
[ ] Mock mode permanece funcional
```

---

## Bloco 09 — Integrar Actions Reais

### Objetivo

Integrar as ações de contrato com os endpoints reais do backend.

### Endpoints previstos

```txt
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
POST /contracts/{id}/open-dispute
POST /contracts/{id}/simulate-fraud
```

### Tarefas

```txt
[ ] Criar camada de actions de contrato
[ ] Conectar botões da UI aos endpoints reais
[ ] Enviar Authorization Bearer
[ ] Atualizar estado do contrato após ação
[ ] Recarregar timeline/eventos após ação
[ ] Tratar 401 sem token
[ ] Tratar 403 sem permissão
[ ] Tratar erros de regra de negócio
[ ] Exibir feedback visual de sucesso/erro
```

### Entregas

```txt
- Ações reais funcionando
- Permissões respeitadas
- Feedback visual implementado
- Estado atualizado após ações
```

### Commit sugerido

```txt
feat: integrar actions reais de contratos
```

### Critério de aceite

```txt
[ ] Confirmar envio funciona
[ ] Confirmar entrega funciona
[ ] Validar recebimento funciona
[ ] Autorizar pagamento funciona
[ ] Abrir disputa funciona
[ ] Simular fraude funciona
[ ] 401/403 são tratados corretamente
[ ] UI atualiza após cada ação
```

---

## Bloco 10 — Integrar Eventos, Timeline e Auditoria

### Objetivo

Carregar eventos reais de contrato e auditoria global a partir do backend.

### Endpoints previstos

```txt
GET /contracts/{id}/events
GET /audit/events
```

### Tarefas

```txt
[ ] Criar ou ajustar events-api/audit-api
[ ] Integrar timeline do contrato com GET /contracts/{id}/events
[ ] Integrar tela/área de auditoria com GET /audit/events
[ ] Mapear tipos de evento para componentes visuais
[ ] Tratar eventos vazios
[ ] Tratar erro de permissão
[ ] Garantir ordenação correta por data
[ ] Atualizar eventos após actions
```

### Entregas

```txt
- Timeline real integrada
- Auditoria global integrada
- Eventos atualizados após ações
```

### Commit sugerido

```txt
feat: integrar eventos e auditoria reais
```

### Critério de aceite

```txt
[ ] Eventos por contrato carregam corretamente
[ ] Auditoria global carrega corretamente
[ ] Eventos aparecem em ordem correta
[ ] Empty state funciona
[ ] Erros são tratados visualmente
[ ] Timeline atualiza após ações
```

---

## Bloco 11 — Blockchain Indisponível de Forma Segura

### Objetivo

Tratar funcionalidades blockchain ainda indisponíveis sem quebrar a experiência do usuário.

### Contexto

Nesta fase, a blockchain real ainda pode estar desabilitada:

```env
BLOCKCHAIN_ENABLED=false
```

Portanto, endpoints ou ações como `register-on-chain` devem ser tratados como recurso futuro/indisponível, e não como erro crítico do sistema inteiro.

### Tarefas

```txt
[ ] Identificar pontos da UI que chamam blockchain real
[ ] Detectar resposta de indisponibilidade do backend
[ ] Criar mensagem clara para usuário
[ ] Evitar quebrar fluxo principal de contratos
[ ] Desabilitar botão quando necessário
[ ] Exibir status como recurso em preparação
[ ] Documentar limitação técnica
```

### Entregas

```txt
- Blockchain indisponível tratada com segurança
- UI sem erro crítico
- Limitação documentada
```

### Commit sugerido

```txt
fix: tratar blockchain indisponivel de forma segura
```

### Critério de aceite

```txt
[ ] register-on-chain não quebra a aplicação
[ ] Usuário entende que recurso está indisponível
[ ] Fluxo principal continua funcionando
[ ] Limitação está documentada
```

---

## Bloco 12 — Teste Ponta a Ponta

### Objetivo

Executar e documentar o fluxo completo com frontend e backend reais rodando localmente.

### Fluxo obrigatório

```txt
1. Subir backend
2. Subir frontend
3. Conectar wallet
4. Solicitar nonce
5. Assinar mensagem
6. Validar assinatura
7. Receber JWT
8. Carregar /auth/me
9. Listar contratos
10. Criar contrato
11. Confirmar envio
12. Confirmar entrega
13. Validar recebimento
14. Autorizar pagamento
15. Abrir disputa
16. Simular fraude
17. Consultar timeline do contrato
18. Consultar auditoria global
19. Testar comportamento sem token
20. Testar comportamento sem permissão
```

### Tarefas

```txt
[ ] Criar roteiro de teste manual
[ ] Executar fluxo completo
[ ] Registrar prints ou evidências, se necessário
[ ] Registrar erros encontrados
[ ] Corrigir bugs críticos
[ ] Criar relatório final da sessão
```

### Entregas

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/relatorio_teste_ponta_a_ponta.md
Docs/sessoes/sessao_02_integrar_back_e_front/feedback/feedback_bloco_12_teste_ponta_a_ponta.md
```

### Commit sugerido

```txt
test: documentar teste ponta a ponta da integracao
```

### Critério de aceite

```txt
[ ] Fluxo de login testado
[ ] Fluxo de contratos testado
[ ] Fluxo de actions testado
[ ] Timeline testada
[ ] Auditoria testada
[ ] 401 testado
[ ] 403 testado
[ ] Bugs críticos registrados ou corrigidos
[ ] Relatório final criado
```

---

# 8. Critério de Aceite Geral da Sessão 02

A Sessão 02 só deve ser considerada concluída quando:

```txt
[ ] Frontend consegue autenticar com wallet real
[ ] Nonce é solicitado no backend
[ ] Assinatura é enviada para verify
[ ] JWT é recebido corretamente
[ ] Token é usado em rotas protegidas
[ ] /auth/me retorna profile real
[ ] Perfil demo não aparece em modo API real
[ ] Contratos reais são listados
[ ] Contrato real pode ser criado
[ ] Detalhe de contrato real funciona
[ ] Actions reais funcionam
[ ] Eventos reais aparecem na timeline
[ ] Auditoria real funciona
[ ] 401 é tratado
[ ] 403 é tratado
[ ] Blockchain indisponível não quebra a aplicação
[ ] Mock mode permanece funcional
[ ] Teste ponta a ponta está documentado
[ ] Feedback de todos os blocos foi gerado
[ ] Commits semânticos foram feitos
```

---

# 9. Riscos da Sessão 02

## Risco 01 — Contrato de API diferente do esperado

O frontend pode esperar campos diferentes dos retornados pelo backend.

Mitigação:

```txt
Criar/atualizar contrato_api_integracao.md antes de avançar nos blocos de contratos e actions.
```

---

## Risco 02 — JWT não persistido corretamente

O usuário pode logar, mas perder sessão ou não conseguir acessar endpoints protegidos.

Mitigação:

```txt
Centralizar autenticação em auth store e padronizar o HTTP client.
```

---

## Risco 03 — Wallet conectada, mas perfil inexistente no backend

O backend pode não encontrar profile para a wallet conectada.

Mitigação:

```txt
Usar seed demo ou criar fluxo controlado para wallets autorizadas no ambiente de teste.
```

---

## Risco 04 — Erros 401/403 mal tratados

A aplicação pode parecer quebrada quando o problema é autenticação ou permissão.

Mitigação:

```txt
Criar mensagens visuais claras para sessão expirada, usuário não autenticado e usuário sem permissão.
```

---

## Risco 05 — Mistura entre mock mode e API real

O frontend pode exibir dados demo enquanto consome parte da API real.

Mitigação:

```txt
Separar claramente comportamento NEXT_PUBLIC_USE_MOCKS=true e NEXT_PUBLIC_USE_MOCKS=false.
```

---

## Risco 06 — Blockchain real ainda indisponível

A ausência de smart contract funcional pode gerar erro em funcionalidades on-chain.

Mitigação:

```txt
Tratar blockchain como recurso indisponível/futuro até a Sessão específica de blockchain ou deploy final.
```

---

# 10. Ordem Recomendada de Execução

A ordem dos blocos deve ser mantida:

```txt
01. Auth API no Frontend
02. Wallet Real + Assinatura
03. Verify + JWT
04. Auth Store/Session
05. Authorization Bearer no HTTP Client
06. Integração /auth/me
07. Substituir Perfil Demo em Modo API Real
08. Integrar Contratos Reais
09. Integrar Actions Reais
10. Integrar Eventos, Timeline e Auditoria
11. Blockchain Indisponível de Forma Segura
12. Teste Ponta a Ponta
```

Não iniciar contratos/actions antes do fluxo auth estar funcionando.

---

# 11. Definição de Pronto Para Avançar à Sessão 03

A Sessão 03 — Preparo Deploy Produção só deve começar quando:

```txt
[ ] Frontend e backend conversam localmente
[ ] Login real funciona
[ ] JWT funciona
[ ] Requests protegidas funcionam
[ ] Contratos reais funcionam
[ ] Actions reais funcionam
[ ] Auditoria real funciona
[ ] Erros principais estão tratados
[ ] Mock mode continua disponível
[ ] Relatório ponta a ponta foi criado
```

Se qualquer item crítico estiver pendente, ele deve virar bug ou pendência antes do deploy.

---

# 12. Arquivos Importantes da Sessão

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/planejamento/planejamento_sessao_02.md
Docs/sessoes/sessao_02_integrar_back_e_front/planejamento/blocos/
Docs/sessoes/sessao_02_integrar_back_e_front/feedback/
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/contrato_api_integracao.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/relatorio_erros_auth_integracao.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/relatorio_teste_ponta_a_ponta.md
```

---

# 13. Conclusão

A Sessão 02 é a etapa mais importante para transformar o FiscalizaPay Web3 de um MVP visual/técnico em uma aplicação realmente integrada.

Nesta sessão, o foco não é adicionar novas telas sem necessidade.  
O foco é fazer o frontend conversar com o backend real de forma segura, previsível e validável.

A prioridade é:

```txt
Auth real → JWT → Perfil real → Contratos reais → Actions reais → Auditoria real → Teste ponta a ponta
```

Somente após essa sessão o projeto deve avançar para a Sessão 03 — Preparo Deploy Produção.
