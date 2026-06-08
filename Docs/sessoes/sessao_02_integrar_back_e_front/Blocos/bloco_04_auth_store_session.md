# Bloco 04 — Auth Store/Session

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_04_auth_store_session`  
**Tipo:** Estado global de autenticação e sessão do frontend  
**Objetivo central:** criar ou ajustar a store/session de autenticação do frontend para armazenar JWT, perfil autenticado, wallet, role, loading, erro e ações centralizadas de login/logout.

---

# 1. Objetivo do Bloco

Criar ou ajustar o estado global de autenticação do frontend.

Ao final deste bloco, o frontend deve possuir uma estrutura centralizada para representar a sessão autenticada, contendo no mínimo:

```txt
accessToken
profile
walletAddress
role
isAuthenticated
isLoading
error
```

Também devem existir ações centralizadas para:

```txt
loginWithWallet
logout
setSession
clearSession
restoreSession, se aplicável
```

Este bloco deve conectar os resultados dos blocos anteriores:

```txt
Bloco 01 — Auth API no Frontend
Bloco 02 — Wallet Real + Assinatura
Bloco 03 — Verify + JWT
```

Mas ainda **não deve ser responsável pela injeção global do Authorization Bearer** no HTTP client.  
Isso será feito no próximo bloco:

```txt
Bloco 05 — Authorization Bearer no HTTP Client
```

---

# 2. Contexto da Sessão 02

A Sessão 02 segue o fluxo:

```txt
wallet → nonce → assinatura → verify → JWT → session/store → Authorization Bearer → /auth/me
```

Os três primeiros blocos prepararam:

```txt
- camada Auth API;
- conexão de wallet real;
- assinatura de mensagem;
- envio da assinatura para /auth/verify;
- recebimento de JWT.
```

Agora o Bloco 04 deve organizar o estado de autenticação para que os próximos blocos possam usar o token e o profile de forma previsível.

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_04_auth_store_session.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_04_auth_store_session.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/auth_store_session.md
```

---

# 5. Premissas Técnicas

Antes de iniciar, validar:

```txt
[ ] Bloco 01 concluído
[ ] Auth API criada
[ ] Bloco 02 concluído
[ ] Wallet real conecta e assina mensagem
[ ] Bloco 03 concluído
[ ] /auth/verify retorna JWT
[ ] Frontend possui padrão de store/context/hooks definido
[ ] Mock mode continua funcionando
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
- criar auth store;
- adaptar store existente de perfil/wallet, se for o padrão do projeto;
- criar provider/context de auth, se o projeto usa Context API;
- criar hook de autenticação;
- armazenar accessToken;
- armazenar profile;
- armazenar walletAddress;
- armazenar role;
- armazenar isAuthenticated;
- armazenar isLoading;
- armazenar error;
- criar loginWithWallet;
- criar logout;
- criar setSession;
- criar clearSession;
- criar restoreSession, se aplicável;
- definir persistência temporária ou persistência controlada do token;
- preservar mock mode;
- documentar estratégia de sessão.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- integrar contracts/actions/audit;
- implementar Authorization Bearer global no HTTP client como objetivo principal;
- integrar /auth/me completamente, exceto se necessário de forma mínima para preparar estado;
- remover mocks;
- fazer deploy;
- habilitar blockchain real;
- alterar regras de negócio do backend;
- criar migrations;
- expor JWT em logs permanentes;
- salvar private key, mnemonic ou seed phrase.
```

A injeção global do token em requests protegidas será feita no:

```txt
Bloco 05 — Authorization Bearer no HTTP Client
```

A integração oficial de `/auth/me` será feita no:

```txt
Bloco 06 — Integração /auth/me
```

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- stores existentes no frontend;
- context providers existentes;
- hooks globais existentes;
- stores de profile/wallet/mock;
- estrutura atual de login ou seleção de perfil;
- fluxo criado nos Blocos 01, 02 e 03;
- resposta real de /auth/verify;
- tipagem do profile retornado, se existir;
- uso atual de role nos componentes;
- uso atual de walletAddress nos componentes;
- variável NEXT_PUBLIC_USE_MOCKS;
- padrão de persistência já usado no projeto.
```

Não criar store duplicada se já existir estrutura adequada.

Não quebrar a seleção demo/mock atual.

---

# 9. Estado Mínimo da Sessão

A store/session deve representar no mínimo:

```ts
type AuthState = {
  accessToken: string | null;
  profile: AuthProfile | null;
  walletAddress: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
```

Adaptar nomes conforme padrão real do projeto.

---

# 10. Ações Mínimas Esperadas

A store/session deve ter ações como:

```ts
type AuthActions = {
  loginWithWallet: () => Promise<void>;
  logout: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  restoreSession?: () => void | Promise<void>;
};
```

A implementação deve respeitar o padrão do projeto.

---

# 11. Login Centralizado

Criar ou preparar a função:

```txt
loginWithWallet
```

Essa função deve centralizar o fluxo já preparado:

```txt
1. Verificar wallet conectada
2. Solicitar nonce
3. Assinar mensagem
4. Enviar assinatura para verify
5. Receber JWT
6. Atualizar auth state com accessToken, walletAddress, role/profile se disponível
```

Se algum trecho ainda estiver separado por limitação dos blocos anteriores, documentar no feedback.

---

# 12. Logout

Criar função de logout que:

```txt
[ ] limpe accessToken;
[ ] limpe profile;
[ ] limpe walletAddress, se fizer sentido;
[ ] limpe role;
[ ] defina isAuthenticated=false;
[ ] limpe erros;
[ ] remova token persistido, se houver persistência;
[ ] preserve funcionamento do mock mode.
```

A desconexão da wallet pode ser feita aqui se a stack permitir, mas não é obrigatória se isso pertencer ao hook/provider de wallet.

---

# 13. Persistência do Token

Definir estratégia de persistência.

Opções possíveis:

```txt
- memória apenas;
- sessionStorage;
- localStorage;
```

Recomendação para MVP local:

```txt
sessionStorage ou memória, evitando persistência longa desnecessária.
```

Se usar `localStorage`, documentar justificativa.

Cuidados:

```txt
[ ] não salvar token em arquivo;
[ ] não logar token completo;
[ ] não expor token em feedback;
[ ] mascarar token quando necessário;
[ ] limpar token no logout.
```

---

# 14. Restore Session

Se houver persistência de token, implementar ou preparar:

```txt
restoreSession
```

Responsabilidade:

```txt
- ler token persistido;
- validar se existe;
- marcar sessão como autenticada temporariamente;
- permitir que /auth/me seja chamado no Bloco 06;
- se token inválido, limpar sessão.
```

Não é obrigatório chamar `/auth/me` completamente neste bloco, pois isso pertence ao Bloco 06.

---

# 15. Integração com Profile/Role

Se o `/auth/verify` já retorna profile:

```txt
[ ] salvar profile na store;
[ ] salvar role;
[ ] salvar walletAddress;
[ ] usar esses dados como fonte de sessão real.
```

Se `/auth/verify` retorna apenas token:

```txt
[ ] salvar accessToken;
[ ] salvar walletAddress;
[ ] deixar profile/role como null até o Bloco 06;
[ ] documentar que /auth/me será responsável pelo profile real.
```

Não inventar profile no modo real.

---

# 16. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua usando perfil demo/mock
[ ] NEXT_PUBLIC_USE_MOCKS=false usa auth session real
[ ] Stores antigas de mock não quebram
[ ] Componentes continuam funcionando antes da substituição completa do perfil demo
```

A substituição final do perfil demo por perfil real será feita no:

```txt
Bloco 07 — Substituir Perfil Demo em Modo API Real
```

---

# 17. Tratamento de Erros

A store/session deve tratar:

```txt
- wallet desconectada;
- nonce falhou;
- assinatura recusada;
- verify falhou;
- JWT ausente na response;
- profile ausente, se esperado;
- erro inesperado;
- token expirado, se detectado futuramente.
```

Mensagens sugeridas:

```txt
Não foi possível autenticar sua wallet.
Assinatura recusada pelo usuário.
Sessão expirada. Faça login novamente.
Não foi possível iniciar a sessão.
```

---

# 18. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/auth_store_session.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Auth Store/Session — Bloco 04

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Estratégia de Estado Escolhida

## 4. Estrutura do AuthState

## 5. Ações Criadas

## 6. Estratégia de Persistência do JWT

## 7. Fluxo de Login Centralizado

## 8. Fluxo de Logout

## 9. Restore Session

## 10. Preservação do Mock Mode

## 11. Tratamento de Erros

## 12. Validações Executadas

## 13. Pendências para os Próximos Blocos

## 14. Conclusão Técnica
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
login com wallet até receber JWT
verificar atualização do auth state
executar logout
verificar limpeza da sessão
verificar mock mode
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

O Bloco 04 será considerado concluído quando:

```txt
[ ] Store/context/hook de auth foi criado ou ajustado
[ ] accessToken é representado no estado
[ ] profile é representado no estado
[ ] walletAddress é representado no estado
[ ] role é representada no estado
[ ] isAuthenticated funciona
[ ] isLoading funciona
[ ] error funciona
[ ] loginWithWallet existe ou está preparado
[ ] logout existe
[ ] clearSession existe
[ ] estratégia de persistência foi definida
[ ] token não é exposto em logs permanentes
[ ] mock mode foi preservado
[ ] arquivo de análise foi criado em analises/
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
feat: criar store de sessao autenticada
```

Alternativas:

```txt
feat: adiciona gerenciamento de sessao auth no frontend
```

```txt
chore: estrutura estado de autenticacao do frontend
```

O commit deve conter somente alterações relacionadas ao Bloco 04.

Não misturar Authorization Bearer, `/auth/me`, contracts, actions ou auditoria.

---

# 22. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_04_auth_store_session.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 04: Auth Store/Session

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Estratégia de estado escolhida

## 5. AuthState criado

## 6. Ações de sessão criadas

## 7. Estratégia de persistência

## 8. Login/logout

## 9. Preservação do mock mode

## 10. Tratamento de erros

## 11. Validações executadas

## 12. Pendências encontradas

## 13. Commit realizado

## 14. Observações para o próximo bloco
```

---

# 23. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- injetar Authorization Bearer no HTTP client;
- integrar /auth/me completamente;
- validar restoreSession com /auth/me;
- substituir perfil demo por perfil real;
- integrar contracts/actions/audit;
- tratar blockchain indisponível;
- teste ponta a ponta.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 04.

---

# 24. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_04_auth_store_session.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/auth_store_session.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_04_auth_store_session.md
```

E no frontend deve existir uma store/session de autenticação pronta para ser usada pelo HTTP client e pelo `/auth/me`.

---

# 25. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 05 — Authorization Bearer no HTTP Client
```

Esse próximo bloco deve usar o accessToken da auth store/session e injetar:

```txt
Authorization: Bearer TOKEN
```

nas requests protegidas.
