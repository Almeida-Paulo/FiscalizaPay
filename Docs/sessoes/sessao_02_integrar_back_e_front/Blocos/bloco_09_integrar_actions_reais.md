# Bloco 09 — Integrar Actions Reais

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_09_integrar_actions_reais`  
**Tipo:** Integração das ações reais de contrato com API backend  
**Objetivo central:** conectar os botões e fluxos de ações de contrato do frontend aos endpoints reais do backend, respeitando JWT, role, status do contrato, wallet vinculada e tratamento visual de sucesso/erro.

---

# 1. Objetivo do Bloco

Integrar as ações reais de contrato com o backend.

Endpoints previstos:

```txt
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
POST /contracts/{id}/open-dispute
POST /contracts/{id}/simulate-fraud
```

Ao final deste bloco, o frontend deve conseguir:

```txt
1. Executar actions reais de contrato
2. Enviar Authorization Bearer em todas as actions protegidas
3. Respeitar permissões por role
4. Respeitar status atual do contrato
5. Atualizar ou recarregar o contrato após cada action
6. Exibir feedback visual de sucesso
7. Exibir feedback visual de erro
8. Tratar 401, 403, 404 e erros de regra de negócio
9. Preservar mock mode quando NEXT_PUBLIC_USE_MOCKS=true
```

Este bloco não deve integrar timeline/auditoria global como objetivo principal.

Eventos, timeline e auditoria serão tratados no próximo bloco:

```txt
Bloco 10 — Integrar Eventos, Timeline e Auditoria
```

---

# 2. Contexto da Sessão 02

Os blocos anteriores prepararam:

```txt
Bloco 01 — Auth API no Frontend
Bloco 02 — Wallet Real + Assinatura
Bloco 03 — Verify + JWT
Bloco 04 — Auth Store/Session
Bloco 05 — Authorization Bearer no HTTP Client
Bloco 06 — Integração /auth/me
Bloco 07 — Substituir Perfil Demo em Modo API Real
Bloco 08 — Integrar Contratos Reais
```

Agora o frontend já deve estar autenticado, consumindo contratos reais e usando profile real em modo API.

Este bloco conecta as ações de contrato ao backend real.

---

# 3. Estrutura DDAD Obrigatória

Este bloco deve seguir o ciclo DDAD:

```txt
1. Pré-análise
2. Implementação controlada
3. Validação local
4. Commit semântico
5. Feedback final em Markdown
```

Nenhum bloco da Sessão 02 deve ser considerado concluído sem commit e feedback.

---

# 4. Rotas Oficiais de Documentação e Feedback

A estrutura atual da Sessão 02 está organizada assim:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/
├── Blocos/
├── Feedback/
└── planejamento_sessao_02_integrar_back_e_front.md
```

Portanto, o planejamento deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_09_integrar_actions_reais.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_09_integrar_actions_reais.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_actions_reais.md
```

---

# 5. Premissas Técnicas

Antes de iniciar, validar:

```txt
[ ] Bloco 01 concluído
[ ] Bloco 02 concluído
[ ] Bloco 03 concluído
[ ] Bloco 04 concluído
[ ] Bloco 05 concluído
[ ] Bloco 06 concluído
[ ] Bloco 07 concluído
[ ] Bloco 08 concluído
[ ] Auth real funciona
[ ] JWT está disponível na auth store/session
[ ] Authorization Bearer é enviado pelo HTTP client
[ ] /auth/me carrega profile real
[ ] Em mocks=false, profile real é usado
[ ] Contratos reais carregam da API
[ ] Detalhe real de contrato carrega da API
[ ] Backend rodando em http://127.0.0.1:8000
[ ] Frontend rodando em http://localhost:3000
[ ] /health retorna HTTP 200
[ ] Mock mode continua funcionando
```

Se alguma premissa estiver quebrada, registrar no feedback e, se necessário, em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

---

# 6. Escopo Permitido

Neste bloco você pode:

```txt
- criar ou ajustar camada contract-actions-api/actionsService;
- integrar confirm-shipment;
- integrar confirm-delivery;
- integrar validate-receipt;
- integrar authorize-payment;
- integrar open-dispute;
- integrar simulate-fraud;
- conectar botões da UI aos endpoints reais;
- enviar Authorization Bearer;
- atualizar/recarregar contrato após action;
- invalidar/recarregar dados de contrato quando necessário;
- tratar loading por action;
- tratar sucesso por action;
- tratar erro por action;
- tratar 401;
- tratar 403;
- tratar 404;
- tratar erros de regra de negócio;
- preservar actions mockadas quando NEXT_PUBLIC_USE_MOCKS=true;
- documentar contrato da API de actions.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- integrar timeline/eventos reais como objetivo principal;
- integrar auditoria global como objetivo principal;
- habilitar blockchain real;
- integrar register-on-chain como funcionalidade real final;
- alterar regras de negócio do backend sem justificativa;
- criar migrations sem necessidade;
- remover mock mode;
- fazer deploy;
- expor JWT em logs permanentes;
- refatorar visual amplo sem necessidade.
```

Timeline, eventos e auditoria serão tratados no:

```txt
Bloco 10 — Integrar Eventos, Timeline e Auditoria
```

Blockchain indisponível será tratado no:

```txt
Bloco 11 — Blockchain Indisponível de Forma Segura
```

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- services atuais de actions;
- components de botões de action;
- ContractActionPanel ou equivalente;
- regras de permissões frontend;
- ACTION_ROLES do backend;
- status permitidos por action;
- endpoints reais no backend;
- schemas/payloads das actions;
- responses de sucesso;
- responses de erro;
- tipagens de contrato;
- atualização do contrato após mutation;
- comportamento com NEXT_PUBLIC_USE_MOCKS=true;
- comportamento com NEXT_PUBLIC_USE_MOCKS=false;
- tratamento atual de 401/403.
```

Procurar por termos como:

```txt
confirmShipment
confirmDelivery
validateReceipt
authorizePayment
openDispute
simulateFraud
registerOnChain
ContractActionPanel
ACTION_ROLES
canExecuteAction
contract actions
```

---

# 9. Endpoints a Integrar

## 9.1 `POST /contracts/{id}/confirm-shipment`

### Objetivo

Confirmar o envio do contrato.

### Validar no backend

```txt
- role permitida;
- status exigido;
- payload exigido, se houver;
- response de sucesso;
- response de erro.
```

### Resultado esperado

```txt
- botão chama endpoint real;
- contrato é atualizado/recarregado;
- sucesso é exibido;
- erro de permissão é tratado.
```

---

## 9.2 `POST /contracts/{id}/confirm-delivery`

### Objetivo

Confirmar entrega.

### Validar no backend

```txt
- role permitida;
- status exigido;
- payload exigido, se houver;
- response de sucesso;
- response de erro.
```

---

## 9.3 `POST /contracts/{id}/validate-receipt`

### Objetivo

Validar recebimento.

### Validar no backend

```txt
- role permitida;
- status exigido;
- wallet vinculada, se aplicável;
- payload exigido, se houver;
- response de sucesso;
- response de erro.
```

---

## 9.4 `POST /contracts/{id}/authorize-payment`

### Objetivo

Autorizar pagamento.

### Validar no backend

```txt
- role permitida;
- status exigido;
- payload exigido, se houver;
- response de sucesso;
- response de erro.
```

---

## 9.5 `POST /contracts/{id}/open-dispute`

### Objetivo

Abrir disputa.

### Validar no backend

```txt
- roles permitidas;
- status permitido;
- payload exigido, se houver;
- response de sucesso;
- response de erro.
```

A Sessão 01 alinhou que `openDispute` deve ser permitido para:

```txt
GESTOR
FISCAL
AUDITOR
```

Validar no backend real.

---

## 9.6 `POST /contracts/{id}/simulate-fraud`

### Objetivo

Simular fraude.

### Validar no backend

```txt
- roles permitidas;
- status permitido;
- payload exigido, se houver;
- response de sucesso;
- response de erro.
```

A Sessão 01 alinhou que `simulateFraud` deve ser permitido para:

```txt
GESTOR
FISCAL
AUDITOR
```

Validar no backend real.

---

# 10. Tipagens Esperadas

Criar ou ajustar tipagens conforme contrato real.

Exemplo conceitual:

```ts
export type ContractAction =
  | 'confirmShipment'
  | 'confirmDelivery'
  | 'validateReceipt'
  | 'authorizePayment'
  | 'openDispute'
  | 'simulateFraud';

export type ContractActionResponse = {
  contract: Contract;
  message?: string;
  event?: ContractEvent;
};

export type ContractActionError = {
  message: string;
  code?: string;
  details?: unknown;
};
```

Atenção:

```txt
Esses tipos são apenas sugestivos.
O executor deve ajustar ao schema real do backend.
```

---

# 11. Camada de Actions API

Criar ou ajustar camada dedicada.

Possíveis caminhos:

```txt
web/src/shared/api/contract-actions-api.ts
web/src/entities/contract/api/contract-actions-api.ts
web/src/features/contract-actions/api/contract-actions-api.ts
```

Escolher o caminho mais coerente com a arquitetura real.

Funções esperadas:

```ts
confirmShipment(contractId: string)
confirmDelivery(contractId: string)
validateReceipt(contractId: string)
authorizePayment(contractId: string)
openDispute(contractId: string)
simulateFraud(contractId: string)
```

Se algum endpoint exigir payload, adaptar a função.

---

# 12. Atualização da UI após Action

Após cada action bem-sucedida, o frontend deve:

```txt
- atualizar contrato local;
```

ou:

```txt
- recarregar GET /contracts/{id};
```

ou:

```txt
- invalidar cache/query, se houver React Query/SWR;
```

A estratégia deve ser documentada.

Não deixar UI com status antigo após action.

---

# 13. Loading por Action

Evitar loading global confuso.

Cada action deve ter estado controlado:

```txt
- action em andamento;
- botão desabilitado durante execução;
- evitar duplo clique;
- manter demais áreas estáveis;
- exibir feedback de carregamento.
```

Exemplo:

```txt
Confirmando envio...
```

---

# 14. Tratamento de Erros

Tratar pelo menos:

```txt
400 — payload inválido
401 — token ausente/inválido
403 — role sem permissão
404 — contrato não encontrado
409 — conflito de status/regra de negócio, se existir
422 — validação de schema
500 — erro interno
network error — backend indisponível
```

Mensagens sugeridas:

```txt
Não foi possível executar esta ação.
Sessão expirada. Faça login novamente.
Você não tem permissão para executar esta ação.
Contrato não encontrado.
Esta ação não está disponível para o status atual do contrato.
Backend indisponível no momento.
```

---

# 15. Permissões Visuais

As actions devem respeitar:

```txt
- role real do backend/profile autenticado;
- status real do contrato;
- wallet vinculada, se aplicável;
- regras já alinhadas no Bloco 06 da Sessão 01.
```

Em modo API real, não usar role demo.

Em modo mock, manter regras mockadas.

---

# 16. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua executando fluxo mock/demo
[ ] NEXT_PUBLIC_USE_MOCKS=false usa endpoints reais
[ ] Não existe mistura de action mock com contrato real
[ ] Não existe fallback silencioso para mock em erro real
```

Regra importante:

```txt
Se mocks=false e a action real falhar, exibir erro.
Não simular sucesso com mock.
```

---

# 17. Segurança

Cuidados obrigatórios:

```txt
[ ] JWT não aparece em logs permanentes
[ ] JWT não aparece em feedback
[ ] Erros não expõem stack trace ao usuário
[ ] Dados sensíveis não são commitados
[ ] .env real não entra no commit
```

---

# 18. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_actions_reais.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Integração de Actions Reais — Bloco 09

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Endpoints Integrados

## 4. Contrato das Actions

## 5. Roles e Permissões

## 6. Status Permitidos por Action

## 7. Tipagens Criadas ou Ajustadas

## 8. Camada de Actions API

## 9. Componentes Ajustados

## 10. Estratégia de Atualização após Action

## 11. Tratamento de Loading/Sucesso/Erro

## 12. Tratamento de 401/403/404/409

## 13. Preservação do Mock Mode

## 14. Validações Executadas

## 15. Pendências para os Próximos Blocos

## 16. Conclusão Técnica
```

---

# 19. Validações Obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
docker compose config
docker compose up -d --build
GET http://127.0.0.1:8000/health
login com wallet até /auth/me
GET /contracts com token válido
GET /contracts/{id} com token válido
POST confirm-shipment com token válido
POST confirm-delivery com token válido
POST validate-receipt com token válido
POST authorize-payment com token válido
POST open-dispute com token válido
POST simulate-fraud com token válido
POST action sem token
POST action com token inválido
POST action com role sem permissão, se possível
POST action em status inválido, se possível
validar UI com NEXT_PUBLIC_USE_MOCKS=false
validar UI com NEXT_PUBLIC_USE_MOCKS=true
```

Observação:

```txt
Algumas actions dependem do status atual do contrato.
Se não for possível testar todas em um único contrato, criar ou usar contratos em estados adequados.
Documentar o que foi testado e o que ficou pendente.
```

Se algum comando não puder ser executado, registrar no feedback:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 20. Critérios de Aceite

O Bloco 09 será considerado concluído quando:

```txt
[ ] Contrato real das actions foi mapeado
[ ] Actions API/service foi criado ou ajustado
[ ] confirm-shipment integrado
[ ] confirm-delivery integrado
[ ] validate-receipt integrado
[ ] authorize-payment integrado
[ ] open-dispute integrado
[ ] simulate-fraud integrado
[ ] Authorization Bearer é enviado
[ ] Loading por action funciona
[ ] Sucesso por action é exibido
[ ] Erro por action é exibido
[ ] Contrato é atualizado/recarregado após action
[ ] 401 é tratado
[ ] 403 é tratado
[ ] 404 é tratado
[ ] Erro de regra/status é tratado
[ ] Mock mode foi preservado
[ ] Não há fallback silencioso para mock em modo real
[ ] Arquivo de análise foi criado em analises/
[ ] npm run lint executado ou justificado
[ ] npm run build executado ou justificado
[ ] Backend /health validado ou justificado
[ ] Commit semântico realizado
[ ] Feedback gerado na pasta Feedback
```

---

# 21. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
feat: integrar actions reais de contratos
```

Alternativas:

```txt
feat: conecta acoes de contrato aos endpoints reais
```

```txt
chore: documenta integracao de actions reais
```

O commit deve conter somente alterações relacionadas ao Bloco 09.

Não misturar timeline, auditoria ou blockchain.

---

# 22. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_09_integrar_actions_reais.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 09: Integrar Actions Reais

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Endpoints de actions integrados

## 5. Roles e permissões validadas

## 6. Status/regras de contrato validadas

## 7. Atualização de contrato após actions

## 8. Tratamento de loading/sucesso/erro

## 9. Tratamento de 401/403/404/regras

## 10. Preservação do mock mode

## 11. Validações executadas

## 12. Pendências encontradas

## 13. Commit realizado

## 14. Observações para o próximo bloco
```

---

# 23. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- integrar eventos reais por contrato;
- integrar timeline real;
- integrar auditoria global;
- atualizar timeline automaticamente após actions;
- tratar register-on-chain como indisponível;
- executar teste ponta a ponta.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 09.

---

# 24. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_09_integrar_actions_reais.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_actions_reais.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_09_integrar_actions_reais.md
```

E no frontend deve existir integração funcional das actions reais de contratos com o backend em modo API.

---

# 25. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 10 — Integrar Eventos, Timeline e Auditoria
```

Esse próximo bloco deve integrar:

```txt
GET /contracts/{id}/events
GET /audit/events
```

e garantir que timeline e auditoria sejam atualizadas com eventos reais.
