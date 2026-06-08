# Bloco 07 — Substituir Perfil Demo em Modo API Real

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_07_substituir_perfil_demo_modo_api_real`  
**Tipo:** Separação definitiva entre perfil mock e perfil autenticado real  
**Objetivo central:** garantir que, quando `NEXT_PUBLIC_USE_MOCKS=false`, o frontend use exclusivamente o perfil autenticado real carregado via `/auth/me`, sem misturar dados demo/mock com dados reais da API.

---

# 1. Objetivo do Bloco

Substituir o uso de perfil demo/mock pelo perfil autenticado real em modo API real.

Ao final deste bloco, o frontend deve seguir esta regra:

```txt
NEXT_PUBLIC_USE_MOCKS=true
→ usar perfil demo/mock

NEXT_PUBLIC_USE_MOCKS=false
→ usar profile real do backend via /auth/me
```

Este bloco deve eliminar misturas perigosas entre:

```txt
- perfil demo;
- wallet mockada;
- role mockada;
- profile real;
- wallet real;
- role real do backend.
```

A autenticação real já deve estar funcional até este ponto:

```txt
wallet → nonce → assinatura → verify → JWT → Authorization Bearer → /auth/me
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
```

Agora o frontend precisa parar de usar perfil demo quando estiver em modo API real.

Este bloco é essencial para evitar que a aplicação fique visualmente autenticada como um perfil demo enquanto executa requests reais com outro token/profile.

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_07_substituir_perfil_demo_modo_api_real.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_07_substituir_perfil_demo_modo_api_real.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/substituicao_perfil_demo_modo_api_real.md
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
[ ] /auth/me carrega profile real
[ ] Auth store/session possui profile real
[ ] Auth store/session possui role real
[ ] Auth store/session possui walletAddress real
[ ] NEXT_PUBLIC_USE_MOCKS está configurável
[ ] Mock mode ainda funciona
[ ] Backend rodando em http://127.0.0.1:8000
[ ] Frontend rodando em http://localhost:3000
[ ] /health retorna HTTP 200
```

Se alguma premissa estiver quebrada, registrar no feedback e, se necessário, em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

---

# 6. Escopo Permitido

Neste bloco você pode:

```txt
- localizar todos os pontos onde profile demo é usado;
- localizar todos os pontos onde role demo é usada;
- localizar todos os pontos onde wallet mockada é exibida;
- separar comportamento mock e API real;
- criar seletor/função para retornar currentProfile correto;
- usar profile real da auth store/session quando mocks=false;
- manter profile demo somente quando mocks=true;
- ajustar componentes que exibem nome, role e wallet;
- ajustar permissões visuais para usar role real em modo API;
- evitar mistura de mock profile com JWT real;
- documentar pontos alterados;
- preservar modo demo/local fallback.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- integrar contratos reais;
- integrar actions reais;
- integrar auditoria real;
- alterar regra de negócio do backend;
- criar migrations;
- remover completamente mocks do projeto;
- fazer deploy;
- habilitar blockchain real;
- reescrever layout visual sem necessidade;
- alterar roles oficiais sem consultar backend.
```

Contratos, actions e auditoria serão tratados nos próximos blocos:

```txt
Bloco 08 — Integrar Contratos Reais
Bloco 09 — Integrar Actions Reais
Bloco 10 — Integrar Eventos, Timeline e Auditoria
```

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- store de profile demo;
- mockProfiles;
- DEMO_PROFILES;
- profile switcher;
- componentes de sidebar/header;
- cards de identidade do perfil;
- dashboard;
- listagem de contratos;
- criação de contratos;
- permissões visuais;
- app sidebar;
- wallet account card;
- wallet status;
- auth store/session;
- variável NEXT_PUBLIC_USE_MOCKS;
- componentes que usam role diretamente;
- componentes que usam walletAddress diretamente.
```

Procurar no frontend por termos como:

```txt
DEMO_PROFILES
mockProfiles
selectedProfile
currentProfile
profileStore
walletAddress
role
useProfile
useAuth
NEXT_PUBLIC_USE_MOCKS
```

---

# 9. Regra Principal de Separação

Implementar ou garantir uma fonte clara para o perfil atual:

```txt
Se NEXT_PUBLIC_USE_MOCKS=true:
    currentProfile = profile demo/mock selecionado

Se NEXT_PUBLIC_USE_MOCKS=false:
    currentProfile = authSession.profile vindo de /auth/me
```

Evitar qualquer fallback automático para demo quando `mocks=false`, pois isso mascara erro real de autenticação.

Se `mocks=false` e não houver profile autenticado:

```txt
- exibir estado de não autenticado;
- solicitar login;
- não mostrar usuário demo como se fosse real.
```

---

# 10. Componentes que Devem ser Revisados

Revisar e ajustar, se existirem:

```txt
- Header
- Sidebar
- Dashboard
- ProfileSwitcher
- ProfileIdentityCard
- WalletAccountCard
- WalletStatus
- ContractActionPanel
- ContractsPage
- CreateContractPage
- PermissionsShowcase
- RecentContracts
- ContractsList
```

A lista pode variar conforme o projeto real.

---

# 11. Permissões Visuais

Quando `NEXT_PUBLIC_USE_MOCKS=false`, as permissões visuais devem usar:

```txt
authSession.role
```

ou:

```txt
authSession.profile.role
```

Não usar role do perfil demo em modo real.

Validar:

```txt
[ ] GESTOR real vê ações de GESTOR
[ ] FISCAL real vê ações de FISCAL
[ ] AUDITOR real vê ações de AUDITOR
[ ] FORNECEDOR real vê ações de FORNECEDOR
[ ] ENTREGADOR real vê ações de ENTREGADOR
```

Conforme as roles existentes no backend.

---

# 12. Wallet Exibida na UI

Quando `NEXT_PUBLIC_USE_MOCKS=false`, a wallet exibida deve ser:

```txt
authSession.walletAddress
```

ou:

```txt
authSession.profile.walletAddress
```

Não exibir wallet mockada `0x8888...` como se fosse a wallet conectada real.

Se a wallet conectada pela extensão for diferente da wallet retornada por `/auth/me`, documentar e tratar como possível inconsistência.

---

# 13. Profile Switcher

Se existir seletor de perfil demo, aplicar regra:

```txt
NEXT_PUBLIC_USE_MOCKS=true
→ ProfileSwitcher habilitado

NEXT_PUBLIC_USE_MOCKS=false
→ ProfileSwitcher oculto, desabilitado ou substituído por profile real
```

Não permitir troca de role manual em modo API real.

Isso é importante para não simular permissões quando a API está protegida por JWT real.

---

# 14. Estados Visuais Esperados

Em modo API real:

## 14.1 Sem login

```txt
- mostrar estado "não autenticado";
- orientar conectar wallet/login;
- não exibir perfil demo.
```

## 14.2 Login em andamento

```txt
- mostrar loading;
- não misturar dados demo durante loading.
```

## 14.3 Login concluído

```txt
- mostrar nome real;
- mostrar role real;
- mostrar wallet real;
- aplicar permissões reais.
```

## 14.4 Erro ao carregar profile

```txt
- mostrar erro controlado;
- permitir nova tentativa/login;
- não cair silenciosamente para demo.
```

---

# 15. Preservação do Mock Mode

O modo mock deve continuar funcionando integralmente.

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true mantém ProfileSwitcher
[ ] NEXT_PUBLIC_USE_MOCKS=true mantém perfis demo
[ ] NEXT_PUBLIC_USE_MOCKS=true mantém wallets demo
[ ] NEXT_PUBLIC_USE_MOCKS=true mantém permissões mockadas
[ ] NEXT_PUBLIC_USE_MOCKS=true não exige backend autenticado
```

O objetivo não é remover mocks, mas separar corretamente mock de API real.

---

# 16. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/substituicao_perfil_demo_modo_api_real.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Substituição de Perfil Demo em Modo API Real — Bloco 07

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Pontos que Usavam Perfil Demo

## 4. Estratégia de Separação Mock/API Real

## 5. Componentes Ajustados

## 6. Uso do Profile Real

## 7. Uso da Role Real

## 8. Uso da Wallet Real

## 9. Profile Switcher

## 10. Estados Visuais

## 11. Preservação do Mock Mode

## 12. Validações Executadas

## 13. Pendências para os Próximos Blocos

## 14. Conclusão Técnica
```

---

# 17. Validações Obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
docker compose config
docker compose up -d --build
GET http://127.0.0.1:8000/health
login com wallet até carregar /auth/me
validar UI com NEXT_PUBLIC_USE_MOCKS=false
validar UI com NEXT_PUBLIC_USE_MOCKS=true
validar profile real exibido em modo API
validar que profile demo não aparece em modo API
validar que ProfileSwitcher não altera role em modo API
validar permissões visuais com role real
```

Se algum comando não puder ser executado, registrar no feedback:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 18. Critérios de Aceite

O Bloco 07 será considerado concluído quando:

```txt
[ ] Pontos de uso de profile demo foram mapeados
[ ] Em mocks=false, profile real de /auth/me é usado
[ ] Em mocks=false, role real é usada
[ ] Em mocks=false, wallet real é usada
[ ] Em mocks=false, profile demo não aparece como fallback silencioso
[ ] Em mocks=true, modo demo continua funcionando
[ ] ProfileSwitcher não permite troca de role em modo API real
[ ] Componentes principais exibem dados corretos
[ ] Permissões visuais usam role real em modo API
[ ] Arquivo de análise foi criado em analises/
[ ] npm run lint executado ou justificado
[ ] npm run build executado ou justificado
[ ] Backend /health validado ou justificado
[ ] Commit semântico realizado
[ ] Feedback gerado na pasta Feedback
```

---

# 19. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
feat: substituir perfil demo por perfil autenticado em modo api
```

Alternativas:

```txt
fix: separa perfil mock de perfil real autenticado
```

```txt
chore: organiza uso de profile real e mock no frontend
```

O commit deve conter somente alterações relacionadas ao Bloco 07.

Não misturar contratos, actions ou auditoria.

---

# 20. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_07_substituir_perfil_demo_modo_api_real.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 07: Substituir Perfil Demo em Modo API Real

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Pontos de profile demo encontrados

## 5. Estratégia mock/API real

## 6. Componentes ajustados

## 7. Profile real em modo API

## 8. Role e permissões reais

## 9. Wallet real exibida

## 10. Preservação do mock mode

## 11. Validações executadas

## 12. Pendências encontradas

## 13. Commit realizado

## 14. Observações para o próximo bloco
```

---

# 21. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- integrar contracts reais;
- integrar criação de contrato real;
- integrar detalhes de contrato real;
- integrar actions reais;
- integrar eventos/timeline/auditoria;
- tratar blockchain indisponível;
- executar teste ponta a ponta.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 07.

---

# 22. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_07_substituir_perfil_demo_modo_api_real.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/substituicao_perfil_demo_modo_api_real.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_07_substituir_perfil_demo_modo_api_real.md
```

E no frontend deve existir separação clara entre:

```txt
modo mock/demo
modo API real autenticado
```

---

# 23. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 08 — Integrar Contratos Reais
```

Esse próximo bloco deve integrar:

```txt
GET /contracts
POST /contracts
GET /contracts/{id}
```

usando o profile real e o Authorization Bearer já configurados.
