# Bloco 10 — Integrar Eventos, Timeline e Auditoria

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_10_integrar_eventos_timeline_auditoria`  
**Tipo:** Integração de eventos reais, timeline do contrato e auditoria global  
**Objetivo central:** integrar o frontend aos endpoints reais de eventos e auditoria do backend, garantindo que a timeline de cada contrato e a auditoria global exibam dados reais quando `NEXT_PUBLIC_USE_MOCKS=false`.

---

# 1. Objetivo do Bloco

Integrar eventos reais de contrato e auditoria global com o backend.

Endpoints previstos:

```txt
GET /contracts/{id}/events
GET /audit/events
```

Ao final deste bloco, o frontend deve conseguir:

```txt
1. Carregar eventos reais de um contrato
2. Exibir timeline real do contrato
3. Carregar auditoria global real
4. Exibir eventos em ordem correta
5. Atualizar timeline após actions reais
6. Tratar empty state
7. Tratar loading state
8. Tratar erros de API
9. Tratar 401/403/404
10. Preservar mock mode quando NEXT_PUBLIC_USE_MOCKS=true
```

Este bloco complementa o Bloco 09, garantindo que as actions reais gerem reflexo visual em eventos, timeline e auditoria.

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
Bloco 09 — Integrar Actions Reais
```

Agora o frontend já deve conseguir autenticar, carregar contratos reais e executar actions reais.

O Bloco 10 deve garantir que os eventos gerados por esses fluxos sejam exibidos corretamente.

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_10_integrar_eventos_timeline_auditoria.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_10_integrar_eventos_timeline_auditoria.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_eventos_timeline_auditoria.md
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
[ ] Bloco 09 concluído
[ ] Auth real funciona
[ ] JWT está disponível na auth store/session
[ ] Authorization Bearer é enviado pelo HTTP client
[ ] /auth/me carrega profile real
[ ] Contratos reais carregam da API
[ ] Actions reais funcionam
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
- criar ou ajustar camada events-api;
- criar ou ajustar camada audit-api;
- integrar GET /contracts/{id}/events;
- integrar GET /audit/events;
- ajustar tipagens de eventos;
- ajustar tipagens de auditoria;
- mapear response do backend para modelo usado pela UI;
- integrar timeline do contrato com eventos reais;
- integrar tela ou área de auditoria global;
- ordenar eventos por data;
- atualizar/recarregar timeline após actions;
- tratar loading, empty e error states;
- tratar 401, 403 e 404;
- preservar mocks quando NEXT_PUBLIC_USE_MOCKS=true;
- documentar contrato de eventos e auditoria.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- alterar o fluxo de actions reais como objetivo principal;
- integrar register-on-chain como funcionalidade real final;
- habilitar blockchain real;
- alterar regras de negócio do backend sem justificativa;
- criar migrations sem necessidade;
- remover mock mode;
- fazer deploy;
- expor JWT em logs permanentes;
- reescrever layout visual amplo sem necessidade.
```

Blockchain indisponível será tratado no:

```txt
Bloco 11 — Blockchain Indisponível de Forma Segura
```

Teste ponta a ponta será tratado no:

```txt
Bloco 12 — Teste Ponta a Ponta
```

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- services atuais de eventos;
- services atuais de auditoria;
- mocks de eventos;
- mocks de auditoria;
- componentes de timeline;
- componentes de audit log;
- página de detalhe de contrato;
- página ou seção de auditoria;
- tipagens de ContractEvent;
- tipagens de AuditEvent;
- endpoints reais no backend;
- schemas/payloads de eventos;
- responses de sucesso;
- responses de erro;
- ordenação atual dos eventos;
- comportamento após actions reais;
- comportamento com NEXT_PUBLIC_USE_MOCKS=true;
- comportamento com NEXT_PUBLIC_USE_MOCKS=false;
- tratamento atual de 401/403/404.
```

Procurar por termos como:

```txt
events
contractEvents
audit
auditEvents
timeline
ContractTimeline
AuditLog
contract-events
audit-events
GET /contracts/{id}/events
GET /audit/events
```

---

# 9. Endpoints a Integrar

## 9.1 `GET /contracts/{id}/events`

### Objetivo

Carregar eventos reais de um contrato específico para exibir na timeline.

### Validar no backend

Mapear:

```txt
- path real;
- parâmetro de contrato;
- query params suportados;
- ordenação padrão;
- response real;
- necessidade de Authorization Bearer;
- status codes de erro;
- regras de visibilidade por role.
```

### Resultado esperado no frontend

```txt
- timeline real aparece no detalhe do contrato;
- eventos aparecem em ordem correta;
- empty state aparece quando não há eventos;
- loading aparece durante carregamento;
- erro aparece quando API falha;
- mock events continuam funcionando em mocks=true.
```

---

## 9.2 `GET /audit/events`

### Objetivo

Carregar auditoria global real a partir do backend.

### Validar no backend

Mapear:

```txt
- path real;
- query params suportados;
- paginação, se houver;
- filtros, se houver;
- ordenação padrão;
- response real;
- necessidade de Authorization Bearer;
- regras de acesso por role.
```

### Resultado esperado no frontend

```txt
- auditoria global exibe eventos reais;
- filtros existentes continuam funcionando, se houver;
- empty state aparece quando não há eventos;
- loading aparece durante carregamento;
- erro aparece quando API falha;
- mock audit continua funcionando em mocks=true.
```

---

# 10. Tipagens Esperadas

Criar ou ajustar tipagens conforme o contrato real.

Exemplo conceitual:

```ts
export type ContractEvent = {
  id: string;
  contractId: string;
  type: string;
  message?: string;
  actorWallet?: string;
  actorRole?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type AuditEvent = {
  id: string;
  entityType?: string;
  entityId?: string;
  action: string;
  actorWallet?: string;
  actorRole?: string;
  message?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};
```

Atenção:

```txt
Esses tipos são apenas sugestivos.
O executor deve ajustar ao schema real do backend.
```

---

# 11. Mapeamento Backend → Frontend

Criar ou ajustar função de mapper se o backend retornar campos em padrão diferente da UI.

Exemplos de diferença:

```txt
contract_id → contractId
actor_wallet → actorWallet
actor_role → actorRole
created_at → createdAt
entity_type → entityType
entity_id → entityId
```

Regra:

```txt
- o backend é fonte da verdade;
- a UI pode usar modelo adaptado;
- o mapper deve ser claro e centralizado;
- evitar transformação espalhada em vários componentes.
```

---

# 12. Timeline do Contrato

A timeline deve exibir eventos reais relacionados ao contrato.

Validar:

```txt
[ ] eventos carregam no detalhe do contrato
[ ] eventos aparecem em ordem cronológica correta
[ ] cada tipo de evento possui label compreensível
[ ] eventos vazios exibem empty state
[ ] erro exibe mensagem controlada
[ ] timeline atualiza após actions reais
```

Sugestões de labels:

```txt
Contrato criado
Envio confirmado
Entrega confirmada
Recebimento validado
Pagamento autorizado
Disputa aberta
Fraude simulada
Registro blockchain solicitado
```

Usar os tipos reais retornados pelo backend.

---

# 13. Auditoria Global

A auditoria global deve exibir eventos reais do sistema.

Validar:

```txt
[ ] eventos globais carregam da API
[ ] eventos aparecem em ordem correta
[ ] dados do ator aparecem quando disponíveis
[ ] filtros continuam funcionando, se existirem
[ ] empty state funciona
[ ] erro é tratado
[ ] 401/403 são tratados
```

Se a auditoria for restrita a roles específicas, respeitar a regra do backend.

Não exibir auditoria mock em modo API real.

---

# 14. Atualização Após Actions

Após uma action real executada no Bloco 09, o frontend deve:

```txt
- recarregar eventos do contrato;
```

ou:

```txt
- invalidar cache/query de eventos;
```

ou:

```txt
- atualizar estado local de forma segura.
```

A estratégia escolhida deve ser documentada.

Recomendação:

```txt
Após action bem-sucedida, recarregar GET /contracts/{id}/events.
```

Se houver auditoria global visível na mesma tela, considerar também recarregar `GET /audit/events`.

---

# 15. Tratamento de Estados

Cada área integrada deve tratar:

```txt
loading
empty
success
error
unauthorized
forbidden
not found
```

## 15.1 Loading

Exibir carregamento enquanto eventos/auditoria estão sendo carregados.

## 15.2 Empty

Mensagem sugerida para timeline:

```txt
Nenhum evento registrado para este contrato.
```

Mensagem sugerida para auditoria:

```txt
Nenhum evento de auditoria encontrado.
```

## 15.3 Error

Mensagem sugerida:

```txt
Não foi possível carregar os eventos.
```

ou:

```txt
Não foi possível carregar a auditoria.
```

## 15.4 Unauthorized — 401

```txt
Sessão expirada. Faça login novamente.
```

## 15.5 Forbidden — 403

```txt
Você não tem permissão para visualizar estes eventos.
```

## 15.6 Not Found — 404

```txt
Contrato não encontrado.
```

---

# 16. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua usando eventos mockados
[ ] NEXT_PUBLIC_USE_MOCKS=true continua usando auditoria mockada
[ ] NEXT_PUBLIC_USE_MOCKS=false usa API real
[ ] Não existe mistura de eventos mock com contrato real
[ ] Não existe fallback silencioso para mock em erro real
```

Regra importante:

```txt
Se mocks=false e a API falhar, exibir erro.
Não cair automaticamente para eventos/auditoria mockados.
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
[ ] Auditoria não expõe dados além do contrato real do backend
```

---

# 18. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_eventos_timeline_auditoria.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Integração de Eventos, Timeline e Auditoria — Bloco 10

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Endpoints Integrados

## 4. Contrato do GET /contracts/{id}/events

## 5. Contrato do GET /audit/events

## 6. Tipagens Criadas ou Ajustadas

## 7. Mapeamento Backend para Frontend

## 8. Timeline do Contrato

## 9. Auditoria Global

## 10. Estratégia de Atualização após Actions

## 11. Tratamento de Loading/Empty/Error

## 12. Tratamento de 401/403/404

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
GET /contracts/{id}/events com token válido
GET /contracts/{id}/events sem token
GET /contracts/{id}/events com token inválido
GET /contracts/{id}/events com id inexistente
GET /audit/events com token válido
GET /audit/events sem token
GET /audit/events com token inválido
executar action real e validar atualização da timeline
validar UI com NEXT_PUBLIC_USE_MOCKS=false
validar UI com NEXT_PUBLIC_USE_MOCKS=true
```

Observação:

```txt
Se a auditoria global for restrita a roles específicas, validar ao menos uma role permitida e uma role não permitida, se possível.
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

O Bloco 10 será considerado concluído quando:

```txt
[ ] Contrato real de GET /contracts/{id}/events foi mapeado
[ ] Contrato real de GET /audit/events foi mapeado
[ ] Events API/service foi criado ou ajustado
[ ] Audit API/service foi criado ou ajustado
[ ] Timeline real carrega eventos do contrato
[ ] Auditoria global carrega eventos reais
[ ] Eventos aparecem em ordem correta
[ ] Tipagens foram criadas ou ajustadas
[ ] Mappers foram criados ou ajustados, se necessário
[ ] Loading state funciona
[ ] Empty state funciona
[ ] Error state funciona
[ ] 401 é tratado
[ ] 403 é tratado
[ ] 404 é tratado
[ ] Timeline atualiza após actions reais
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
feat: integrar eventos e auditoria reais
```

Alternativas:

```txt
feat: conecta timeline e auditoria aos endpoints reais
```

```txt
chore: documenta integracao de eventos timeline e auditoria
```

O commit deve conter somente alterações relacionadas ao Bloco 10.

Não misturar blockchain ou teste ponta a ponta.

---

# 22. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_10_integrar_eventos_timeline_auditoria.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 10: Integrar Eventos, Timeline e Auditoria

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Endpoints integrados

## 5. Timeline real integrada

## 6. Auditoria global integrada

## 7. Tipagens e mapeamentos

## 8. Atualização após actions

## 9. Tratamento de loading/empty/error

## 10. Tratamento de 401/403/404

## 11. Preservação do mock mode

## 12. Validações executadas

## 13. Pendências encontradas

## 14. Commit realizado

## 15. Observações para o próximo bloco
```

---

# 23. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- tratar register-on-chain como indisponível;
- exibir blockchain como recurso futuro/preparação;
- validar fluxo completo ponta a ponta;
- documentar relatório final da Sessão 02.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 10.

---

# 24. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_10_integrar_eventos_timeline_auditoria.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_eventos_timeline_auditoria.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_10_integrar_eventos_timeline_auditoria.md
```

E no frontend deve existir integração funcional com eventos reais, timeline real do contrato e auditoria global real do backend em modo API.

---

# 25. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 11 — Blockchain Indisponível de Forma Segura
```

Esse próximo bloco deve garantir que funcionalidades como `register-on-chain` não quebrem a aplicação enquanto `BLOCKCHAIN_ENABLED=false`.
