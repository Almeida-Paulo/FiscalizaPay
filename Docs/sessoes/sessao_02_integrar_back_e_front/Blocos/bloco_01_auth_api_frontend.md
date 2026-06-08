# Bloco 01 — Auth API no Frontend

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_01_auth_api_frontend`  
**Tipo:** Implementação de base para autenticação real  
**Objetivo central:** criar a camada de comunicação do frontend com os endpoints de autenticação do backend, preparando o fluxo real de wallet, nonce, assinatura, verify, JWT e `/auth/me`.

---

# 1. Objetivo do Bloco

Criar uma camada de API de autenticação no frontend para consumir os endpoints reais do backend:

```txt
GET /auth/nonce
POST /auth/verify
GET /auth/me
```

Este bloco deve preparar o frontend para a autenticação real, mas **não deve conectar wallet real ainda** e **não deve assinar mensagem ainda**.

A assinatura real da wallet será feita no próximo bloco:

```txt
Bloco 02 — Wallet Real + Assinatura
```

---

# 2. Contexto da Sessão 02

A Sessão 02 tem como objetivo integrar frontend e backend reais, substituindo gradualmente o modo mock por comunicação real com API.

A ordem correta da autenticação é:

```txt
1. Criar camada auth-api no frontend
2. Consumir /auth/nonce
3. Assinar nonce com wallet
4. Enviar assinatura para /auth/verify
5. Receber JWT
6. Guardar JWT em auth store/session
7. Injetar Authorization: Bearer nos requests
8. Validar /auth/me
9. Só depois integrar contracts/actions/audit
```

Este bloco cobre principalmente o item 1 e prepara os itens 2, 4 e 8 em nível de camada de API.

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

Portanto, o feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_01_auth_api_frontend.md
```

O planejamento deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_01_auth_api_frontend.md
```

Caso o projeto tenha futuramente a estrutura `planejamento/blocos`, manter consistência com a estrutura atual apresentada pelo usuário nesta sessão.

---

# 5. Premissas Técnicas

Antes de iniciar a implementação, validar as premissas abaixo:

```txt
[ ] Backend local funcionando em http://127.0.0.1:8000
[ ] Frontend local funcionando em http://localhost:3000
[ ] CORS já configurado para o frontend local
[ ] NEXT_PUBLIC_API_BASE_URL configurado no frontend
[ ] NEXT_PUBLIC_USE_MOCKS existe ou está previsto
[ ] Endpoint /health do backend responde HTTP 200
[ ] Wallets mockadas foram corrigidas na Sessão 01
[ ] Regras frontend/backend foram alinhadas na Sessão 01
```

Se alguma premissa estiver quebrada, registrar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_01_auth_api_frontend.md
```

E, se necessário, também registrar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

Caso a pasta `bugs/` não exista, criar somente se houver bug real a registrar.

---

# 6. Escopo Permitido

Neste bloco você pode:

```txt
- criar camada auth-api/authService no frontend;
- mapear contrato dos endpoints /auth/nonce, /auth/verify e /auth/me;
- criar tipagens TypeScript para request/response de autenticação;
- criar funções de chamada aos endpoints;
- usar o HTTP client existente do projeto;
- garantir uso de NEXT_PUBLIC_API_BASE_URL;
- padronizar tratamento inicial de erro;
- preparar a função de /auth/me para uso futuro com token;
- documentar contrato da API de autenticação;
- preservar modo mock;
- adicionar testes simples ou validações manuais se houver estrutura.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- conectar MetaMask;
- implementar wagmi/RainbowKit;
- assinar mensagem com wallet;
- persistir JWT em store global;
- implementar login completo;
- alterar regras de negócio do backend;
- alterar endpoints backend sem necessidade;
- integrar contratos reais;
- integrar actions reais;
- integrar auditoria real;
- remover mocks;
- fazer deploy;
- habilitar blockchain real.
```

Se encontrar necessidade fora do escopo, documentar no feedback como pendência para blocos futuros.

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar o frontend.

Verificar:

```txt
- estrutura de pastas do frontend;
- existência de shared/api;
- existência de http-client;
- existência de handle-api-error;
- existência de types/api;
- padrão atual de services;
- uso de fetch ou axios;
- variável de ambiente de API base;
- padrão de retorno do backend;
- tratamento atual de 401/403;
- modo mock/API real;
- local onde services de contracts/actions são definidos, se já existirem.
```

Também analisar o backend para confirmar o contrato real de auth:

```txt
- rotas de auth;
- método de /auth/nonce;
- payload de /auth/nonce;
- método de /auth/verify;
- payload de /auth/verify;
- response de /auth/verify;
- response de /auth/me;
- erros possíveis;
- formato do profile retornado.
```

Não inventar payload.  
Usar o código real do backend como fonte de verdade.

---

# 9. Endpoints a Integrar

## 9.1 `GET /auth/nonce`

### Objetivo

Solicitar ao backend uma mensagem/nonce para ser assinada pela wallet.

### Verificar no backend

Confirmar se o endpoint espera:

```txt
- wallet address por query param;
- wallet address por body;
- outro formato.
```

Exemplos possíveis:

```txt
GET /auth/nonce?walletAddress=0x...
```

ou:

```txt
GET /auth/nonce?wallet_address=0x...
```

ou outro formato real do backend.

### Resultado esperado

Criar função no frontend semelhante a:

```ts
requestAuthNonce(walletAddress: string): Promise<AuthNonceResponse>
```

O nome exato deve seguir o padrão do projeto.

---

## 9.2 `POST /auth/verify`

### Objetivo

Enviar assinatura para o backend validar e retornar JWT.

### Verificar no backend

Confirmar payload real esperado, por exemplo:

```json
{
  "walletAddress": "0x...",
  "message": "...",
  "signature": "0x..."
}
```

ou:

```json
{
  "wallet_address": "0x...",
  "signature": "0x..."
}
```

Não assumir formato sem conferir no backend.

### Resultado esperado

Criar função no frontend semelhante a:

```ts
verifyAuthSignature(payload: VerifySignatureRequest): Promise<VerifySignatureResponse>
```

Este bloco deve apenas criar a função.  
A chamada real com assinatura será conectada no Bloco 03.

---

## 9.3 `GET /auth/me`

### Objetivo

Buscar o perfil autenticado com token JWT válido.

### Observação

Neste bloco, a função pode ser criada, mas ainda não precisa funcionar ponta a ponta, pois o Authorization Bearer será implementado no Bloco 05 e a integração completa do `/auth/me` no Bloco 06.

### Resultado esperado

Criar função semelhante a:

```ts
getAuthenticatedProfile(): Promise<AuthMeResponse>
```

Se a função já depender de token no header, deixar preparada para usar o HTTP client existente.

---

# 10. Tipagens Esperadas

Criar ou ajustar tipagens para autenticação.

Sugestão de tipos, adaptando ao contrato real do backend:

```ts
export type AuthNonceRequest = {
  walletAddress: string;
};

export type AuthNonceResponse = {
  nonce?: string;
  message: string;
  expiresAt?: string;
};

export type VerifySignatureRequest = {
  walletAddress: string;
  message?: string;
  signature: string;
};

export type VerifySignatureResponse = {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
  profile?: AuthProfile;
};

export type AuthProfile = {
  id: string;
  name: string;
  role: string;
  walletAddress: string;
};

export type AuthMeResponse = AuthProfile;
```

Atenção:

```txt
Esses nomes são sugestivos.
O executor deve ajustar conforme o padrão real do frontend e o contrato real do backend.
```

---

# 11. Padrão de Arquivos Sugerido

Usar o padrão já existente no projeto.

Possíveis caminhos:

```txt
web/src/shared/api/auth-api.ts
web/src/shared/api/auth.ts
web/src/features/auth/api/auth-api.ts
web/src/entities/auth/api/auth-api.ts
```

Escolher o caminho mais coerente com a arquitetura atual.

Se o projeto já possuir estrutura por feature/entity, respeitar essa arquitetura.

Evitar criar arquivos duplicados ou fora do padrão.

---

# 12. Tratamento de Erros

Padronizar o tratamento inicial de erros da auth API.

Erros esperados:

```txt
400 — payload inválido
401 — não autenticado/token ausente
403 — sem permissão
404 — profile não encontrado
422 — validação de schema
500 — erro interno
```

O tratamento deve reaproveitar o handler existente, se houver.

Não criar múltiplos padrões de erro.

Se existir `handle-api-error`, usar ou adaptar de forma mínima.

Mensagens esperadas:

```txt
- Não foi possível solicitar o nonce.
- Não foi possível validar a assinatura.
- Sessão inválida. Faça login novamente.
- Perfil autenticado não encontrado.
```

---

# 13. Preservação do Mock Mode

Este bloco não deve remover o modo mock.

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua usando mocks
[ ] NEXT_PUBLIC_USE_MOCKS=false aponta para API real
[ ] Nenhum componente passa a depender obrigatoriamente de auth real neste bloco
[ ] UI atual continua funcionando após criação da auth API
```

A auth API deve ser criada como infraestrutura, sem quebrar o comportamento atual.

---

# 14. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/contrato_auth_api_frontend.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Contrato Auth API Frontend — Bloco 01

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Endpoints de Auth Identificados

## 4. Contrato do Endpoint /auth/nonce

## 5. Contrato do Endpoint /auth/verify

## 6. Contrato do Endpoint /auth/me

## 7. Tipagens Criadas

## 8. Tratamento de Erros

## 9. Preservação do Mock Mode

## 10. Pendências para os Próximos Blocos

## 11. Conclusão Técnica
```

---

# 15. Validações Obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
docker compose config
docker compose up -d --build
GET http://127.0.0.1:8000/health
```

Se possível, testar os endpoints auth diretamente:

```txt
GET /auth/nonce
POST /auth/verify com payload inválido controlado
GET /auth/me sem token
```

Atenção:

```txt
Testar payload inválido apenas para validar tratamento de erro.
Não inventar assinatura real neste bloco.
```

Se algum comando não puder ser executado, registrar no feedback:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 16. Critérios de Aceite

O Bloco 01 será considerado concluído quando:

```txt
[ ] Estrutura atual de API frontend foi analisada
[ ] Contrato real dos endpoints auth foi mapeado
[ ] Função para solicitar nonce foi criada
[ ] Função para verificar assinatura foi criada
[ ] Função para buscar /auth/me foi criada
[ ] Tipagens de auth foram criadas ou ajustadas
[ ] API base usa NEXT_PUBLIC_API_BASE_URL
[ ] Tratamento de erros foi padronizado
[ ] Mock mode foi preservado
[ ] Arquivo de análise foi criado em analises/
[ ] npm run lint executado ou justificado
[ ] npm run build executado ou justificado
[ ] Backend /health validado ou justificado
[ ] Commit semântico realizado
[ ] Feedback gerado na pasta Feedback
```

---

# 17. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
feat: criar camada auth api para integracao com backend
```

Alternativas:

```txt
feat: adiciona services de autenticacao no frontend
```

```txt
chore: prepara contrato de auth api no frontend
```

O commit deve conter somente alterações relacionadas ao Bloco 01.

Não misturar implementação de wallet, assinatura, store, contracts ou actions.

---

# 18. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_01_auth_api_frontend.md
```

Estrutura obrigatória do feedback:

```md
# Feedback — Bloco 01: Auth API no Frontend

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Endpoints mapeados

## 5. Tipagens criadas

## 6. Tratamento de erros

## 7. Preservação do mock mode

## 8. Validações executadas

## 9. Pendências encontradas

## 10. Commit realizado

## 11. Observações para o próximo bloco
```

---

# 19. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- conectar wallet real;
- ler address real;
- assinar nonce;
- enviar assinatura real para verify;
- persistir JWT;
- criar auth store/session;
- injetar Authorization Bearer;
- integrar /auth/me completamente;
- substituir perfil demo por perfil real;
- integrar contracts/actions/audit.
```

Esses itens não devem ser tratados como falha do Bloco 01, pois pertencem aos blocos seguintes.

---

# 20. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_01_auth_api_frontend.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/contrato_auth_api_frontend.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_01_auth_api_frontend.md
```

E no frontend deve existir uma camada de auth API pronta para ser usada pelos próximos blocos.

---

# 21. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 02 — Wallet Real + Assinatura
```

Esse próximo bloco deve conectar a wallet real, ler o address conectado, solicitar nonce e assinar a mensagem.
