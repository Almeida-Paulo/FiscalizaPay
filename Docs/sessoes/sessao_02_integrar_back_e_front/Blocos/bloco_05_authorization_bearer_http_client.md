# Bloco 05 — Authorization Bearer no HTTP Client

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_05_authorization_bearer_http_client`  
**Tipo:** Integração do JWT no cliente HTTP do frontend  
**Objetivo central:** garantir que as requests protegidas do frontend enviem o token JWT no header `Authorization: Bearer <token>`, usando a sessão criada no Bloco 04.

---

# 1. Objetivo do Bloco

Implementar ou ajustar o HTTP client do frontend para enviar o JWT nas chamadas protegidas da API.

Header esperado:

```txt
Authorization: Bearer TOKEN
```

Ao final deste bloco, o frontend deve conseguir:

```txt
1. Ler o accessToken da auth store/session
2. Injetar Authorization Bearer nas requests protegidas
3. Manter endpoints públicos funcionando sem token
4. Tratar 401 de forma controlada
5. Tratar 403 de forma controlada
6. Evitar loop infinito de logout/retry
7. Preservar mock mode
```

Este bloco prepara o caminho para:

```txt
Bloco 06 — Integração /auth/me
```

---

# 2. Contexto da Sessão 02

A Sessão 02 segue o fluxo:

```txt
wallet → nonce → assinatura → verify → JWT → session/store → Authorization Bearer → /auth/me
```

Os blocos anteriores prepararam:

```txt
Bloco 01 — Auth API no Frontend
Bloco 02 — Wallet Real + Assinatura
Bloco 03 — Verify + JWT
Bloco 04 — Auth Store/Session
```

Agora o token salvo na sessão deve ser usado pelo HTTP client para acessar rotas protegidas.

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_05_authorization_bearer_http_client.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_05_authorization_bearer_http_client.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/authorization_bearer_http_client.md
```

---

# 5. Premissas Técnicas

Antes de iniciar, validar:

```txt
[ ] Bloco 01 concluído
[ ] Auth API criada no frontend
[ ] Bloco 02 concluído
[ ] Wallet real conecta e assina mensagem
[ ] Bloco 03 concluído
[ ] /auth/verify retorna JWT
[ ] Bloco 04 concluído
[ ] Auth store/session possui accessToken
[ ] Auth store/session possui logout/clearSession
[ ] HTTP client centralizado existe ou será criado
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
- revisar o HTTP client atual;
- criar wrapper centralizado de fetch/axios, se ainda não existir;
- injetar Authorization Bearer quando houver token;
- evitar token em endpoints públicos, se necessário;
- integrar o client com auth store/session;
- tratar 401;
- tratar 403;
- acionar logout/clearSession em 401 persistente, se fizer sentido;
- padronizar mensagens de erro;
- ajustar services para usarem o client centralizado;
- documentar quais rotas são públicas e quais são protegidas;
- preservar mock mode.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- integrar contracts/actions/audit como objetivo principal;
- implementar /auth/me completamente;
- substituir perfil demo por perfil real;
- alterar regras de negócio do backend;
- criar migrations;
- remover mocks;
- fazer deploy;
- habilitar blockchain real;
- expor JWT em logs permanentes;
- commitar .env real ou token real.
```

A integração oficial de `/auth/me` será feita no:

```txt
Bloco 06 — Integração /auth/me
```

Contratos e actions serão tratados apenas a partir dos blocos 08 e 09.

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- web/src/shared/api/http-client.ts ou equivalente;
- handle-api-error existente;
- types/api existentes;
- services de auth criados no Bloco 01;
- auth store/session criada no Bloco 04;
- services que já chamam API real;
- uso atual de fetch/axios;
- variável NEXT_PUBLIC_API_BASE_URL;
- tratamento atual de 401 e 403;
- comportamento com NEXT_PUBLIC_USE_MOCKS=true e false.
```

Evitar criar múltiplos HTTP clients concorrentes.

O ideal é centralizar o comportamento em um único lugar.

---

# 9. Estratégia de Authorization Bearer

## 9.1 Header esperado

Toda request protegida deve enviar:

```txt
Authorization: Bearer <accessToken>
```

Exemplo conceitual:

```ts
headers: {
  Authorization: `Bearer ${accessToken}`,
}
```

## 9.2 Token ausente

Se uma request protegida for chamada sem token:

```txt
- retornar erro controlado;
- exibir mensagem adequada;
- não quebrar a aplicação silenciosamente.
```

## 9.3 Endpoints públicos

Endpoints públicos como `/health`, `/auth/nonce` e `/auth/verify` não precisam de token.

Possíveis rotas públicas:

```txt
GET /health
GET /auth/nonce
POST /auth/verify
```

Possíveis rotas protegidas:

```txt
GET /auth/me
GET /contracts
POST /contracts
GET /contracts/{id}
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
POST /contracts/{id}/open-dispute
POST /contracts/{id}/simulate-fraud
GET /contracts/{id}/events
GET /audit/events
```

Validar no backend o contrato real.

---

# 10. Integração com Auth Store/Session

O HTTP client deve obter o token de forma segura e previsível.

Possibilidades:

```txt
- importar store diretamente, se o padrão do projeto permitir;
- receber token como parâmetro opcional;
- usar função getAccessToken();
- usar context/hook apenas nos services/componentes, evitando hook fora de React.
```

Atenção:

```txt
Não usar React hook diretamente fora de componente/hook válido.
```

Se o projeto usa Zustand, pode haver um método seguro como:

```ts
useAuthStore.getState().accessToken
```

Se usa Context API, talvez seja melhor passar token ao client via função/service.

Escolher a abordagem mais coerente com a arquitetura real.

---

# 11. Tratamento de 401

Quando o backend retornar 401:

```txt
- interpretar como não autenticado, token ausente, token inválido ou sessão expirada;
- exibir mensagem clara;
- limpar sessão se o token estiver inválido/expirado;
- evitar retry infinito;
- redirecionar para login somente se o projeto já tiver fluxo adequado.
```

Mensagem sugerida:

```txt
Sessão inválida ou expirada. Faça login novamente.
```

Registrar no feedback se o logout automático foi implementado ou apenas preparado.

---

# 12. Tratamento de 403

Quando o backend retornar 403:

```txt
- interpretar como usuário autenticado, mas sem permissão;
- não limpar sessão automaticamente;
- exibir mensagem clara;
- preservar estado da aplicação.
```

Mensagem sugerida:

```txt
Você não tem permissão para executar esta ação.
```

---

# 13. Evitar Vazamento de Token

Cuidados obrigatórios:

```txt
[ ] Não logar JWT completo
[ ] Não exibir JWT completo na UI
[ ] Não salvar JWT em arquivo versionado
[ ] Não commitar .env real
[ ] Não incluir token em feedback
[ ] Mascarar token se necessário
```

---

# 14. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua usando mocks
[ ] NEXT_PUBLIC_USE_MOCKS=false usa HTTP client real
[ ] Mock mode não exige JWT
[ ] Componentes demo não quebram
```

Se algum service ainda mistura mock com API real, documentar para o Bloco 07 ou Bloco 08.

---

# 15. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/authorization_bearer_http_client.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Authorization Bearer no HTTP Client — Bloco 05

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Estratégia de HTTP Client

## 4. Origem do AccessToken

## 5. Rotas Públicas

## 6. Rotas Protegidas

## 7. Implementação do Authorization Bearer

## 8. Tratamento de 401

## 9. Tratamento de 403

## 10. Segurança e Logs

## 11. Preservação do Mock Mode

## 12. Validações Executadas

## 13. Pendências para os Próximos Blocos

## 14. Conclusão Técnica
```

---

# 16. Validações Obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
docker compose config
docker compose up -d --build
GET http://127.0.0.1:8000/health
login com wallet até receber JWT
chamada protegida com token
chamada protegida sem token
chamada protegida com token inválido
chamada protegida com role sem permissão, se possível
verificar mock mode
```

Endpoints úteis para validação:

```txt
GET /auth/me
GET /contracts
POST /contracts
```

Observação:

```txt
A integração completa de /auth/me será feita no Bloco 06.
Neste bloco, /auth/me pode ser usado apenas como teste técnico do header Authorization.
```

Se algum comando não puder ser executado, registrar no feedback:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 17. Critérios de Aceite

O Bloco 05 será considerado concluído quando:

```txt
[ ] HTTP client foi analisado
[ ] AccessToken da auth store/session é acessado corretamente
[ ] Authorization Bearer é enviado em requests protegidas
[ ] Endpoints públicos continuam funcionando
[ ] 401 é tratado de forma controlada
[ ] 403 é tratado de forma controlada
[ ] Não há vazamento de JWT em logs permanentes
[ ] Mock mode foi preservado
[ ] Arquivo de análise foi criado em analises/
[ ] npm run lint executado ou justificado
[ ] npm run build executado ou justificado
[ ] Backend /health validado ou justificado
[ ] Commit semântico realizado
[ ] Feedback gerado na pasta Feedback
```

---

# 18. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
feat: adicionar authorization bearer no http client
```

Alternativas:

```txt
feat: autenticar requests protegidas com jwt
```

```txt
chore: padroniza headers autenticados no frontend
```

O commit deve conter somente alterações relacionadas ao Bloco 05.

Não misturar `/auth/me`, contracts, actions ou auditoria.

---

# 19. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_05_authorization_bearer_http_client.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 05: Authorization Bearer no HTTP Client

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Estratégia de HTTP client

## 5. Origem do accessToken

## 6. Rotas públicas e protegidas

## 7. Authorization Bearer implementado

## 8. Tratamento de 401 e 403

## 9. Segurança e logs

## 10. Preservação do mock mode

## 11. Validações executadas

## 12. Pendências encontradas

## 13. Commit realizado

## 14. Observações para o próximo bloco
```

---

# 20. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- integrar /auth/me oficialmente;
- carregar profile real após login;
- restaurar sessão validando token;
- substituir perfil demo por perfil real;
- integrar contracts/actions/audit;
- tratar blockchain indisponível;
- executar teste ponta a ponta.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 05.

---

# 21. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_05_authorization_bearer_http_client.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/authorization_bearer_http_client.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_05_authorization_bearer_http_client.md
```

E no frontend, o HTTP client deve estar preparado para autenticar requests protegidas usando o JWT da sessão.

---

# 22. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 06 — Integração /auth/me
```

Esse próximo bloco deve validar o token recebido, carregar o perfil real do backend e disponibilizar a role real para a interface.
