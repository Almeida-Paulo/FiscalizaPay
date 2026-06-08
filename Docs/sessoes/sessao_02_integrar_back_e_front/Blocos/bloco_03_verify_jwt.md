# Bloco 03 — Verify + JWT

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_03_verify_jwt`  
**Tipo:** Validação de assinatura e recebimento de token JWT  
**Objetivo central:** enviar a assinatura gerada pela wallet para o backend, validar o login e receber o JWT, preparando o frontend para sessão autenticada nos próximos blocos.

---

# 1. Objetivo do Bloco

Implementar o fluxo de verificação da assinatura no frontend, usando o endpoint real do backend:

```txt
POST /auth/verify
```

Ao final deste bloco, o frontend deve conseguir:

```txt
1. Receber o address conectado da wallet
2. Receber a mensagem/nonce assinada no Bloco 02
3. Enviar address, mensagem/nonce e assinatura para o backend
4. Receber o JWT/accessToken em caso de sucesso
5. Tratar erro de assinatura inválida
6. Tratar erro de nonce expirado ou inválido
7. Não persistir token quando o verify falhar
```

Este bloco **não deve ainda criar a store definitiva de sessão**.  
A store/session será feita no próximo bloco:

```txt
Bloco 04 — Auth Store/Session
```

---

# 2. Contexto da Sessão 02

A Sessão 02 segue a ordem:

```txt
1. Auth API no Frontend
2. Wallet Real + Assinatura
3. Verify + JWT
4. Auth Store/Session
5. Authorization Bearer no HTTP Client
6. Integração /auth/me
7. Substituir Perfil Demo em Modo API Real
8. Integrar Contratos Reais
9. Integrar Actions Reais
10. Integrar Eventos, Timeline e Auditoria
11. Blockchain Indisponível de Forma Segura
12. Teste Ponta a Ponta
```

O Bloco 01 criou a camada Auth API.  
O Bloco 02 conectou a wallet real e assinou a mensagem/nonce.  
Agora o Bloco 03 deve validar a assinatura no backend e receber o JWT.

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_03_verify_jwt.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_03_verify_jwt.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/verify_jwt.md
```

---

# 5. Premissas Técnicas

Antes de iniciar, validar:

```txt
[ ] Bloco 01 concluído
[ ] Auth API existe no frontend
[ ] Função para POST /auth/verify existe ou foi preparada
[ ] Bloco 02 concluído
[ ] Wallet real conecta no frontend
[ ] Address conectado é lido corretamente
[ ] Nonce/mensagem é solicitada ao backend
[ ] Mensagem é assinada pela wallet
[ ] Assinatura é capturada no frontend
[ ] Backend rodando em http://127.0.0.1:8000
[ ] Frontend rodando em http://localhost:3000
[ ] CORS funcionando
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
- conectar o resultado da assinatura ao endpoint /auth/verify;
- ajustar tipagens de VerifySignatureRequest e VerifySignatureResponse;
- validar o contrato real de /auth/verify no backend;
- enviar wallet address, mensagem/nonce e signature conforme contrato real;
- receber accessToken/JWT;
- armazenar o token apenas de forma temporária/local para validação do bloco;
- exibir feedback visual de sucesso/erro;
- tratar assinatura inválida;
- tratar nonce expirado;
- tratar payload inválido;
- tratar backend indisponível;
- documentar contrato de verify/JWT;
- manter mock mode preservado.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- criar a store global definitiva de autenticação;
- persistir JWT em localStorage/sessionStorage como solução final;
- injetar Authorization Bearer globalmente no HTTP client;
- integrar /auth/me completamente;
- substituir perfil demo por perfil real;
- integrar contracts/actions/audit;
- remover mocks;
- fazer deploy;
- habilitar blockchain real;
- expor token em logs permanentes;
- commitar segredos, private keys ou mnemonics.
```

A persistência oficial do JWT será feita no:

```txt
Bloco 04 — Auth Store/Session
```

A injeção global do token será feita no:

```txt
Bloco 05 — Authorization Bearer no HTTP Client
```

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- Auth API criada no Bloco 01;
- fluxo de wallet e assinatura criado no Bloco 02;
- contrato real do endpoint /auth/verify no backend;
- schemas de request e response do backend;
- nomes reais dos campos esperados;
- formato do JWT retornado;
- tratamento atual de erros;
- componentes ou hooks usados no login com wallet;
- estratégia atual de mock mode;
- possíveis logs que expõem token ou assinatura.
```

Usar o backend como fonte de verdade.

Não inventar payload.

---

# 9. Contrato do Endpoint `/auth/verify`

Confirmar no backend o formato real esperado.

Possíveis formatos:

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
  "message": "...",
  "signature": "0x..."
}
```

ou outro formato real.

O executor deve mapear exatamente:

```txt
- método HTTP;
- path;
- payload;
- campos obrigatórios;
- response de sucesso;
- response de erro;
- status codes possíveis.
```

---

# 10. Response Esperado

Confirmar no backend o formato real retornado.

Possíveis exemplos:

```json
{
  "accessToken": "jwt...",
  "tokenType": "bearer",
  "expiresIn": 3600,
  "profile": {
    "id": "uuid",
    "name": "Maria Santos",
    "role": "GESTOR",
    "walletAddress": "0x..."
  }
}
```

ou:

```json
{
  "access_token": "jwt...",
  "token_type": "bearer"
}
```

ou outro formato real.

O frontend deve adaptar a tipagem ao contrato real.

---

# 11. Implementação Esperada

## 11.1 Conectar assinatura ao verify

A partir do fluxo do Bloco 02, obter:

```txt
walletAddress
message ou nonce
signature
```

E chamar a função da Auth API:

```ts
const response = await verifyAuthSignature({
  walletAddress,
  message,
  signature,
});
```

O nome da função deve seguir o padrão real do projeto.

---

## 11.2 Guardar token apenas temporariamente

Neste bloco, o token pode ser exibido de forma controlada para debug técnico ou guardado em estado local temporário.

Não criar ainda uma estratégia final de persistência.

Evitar:

```txt
- console.log permanente do JWT;
- exibição completa do token na UI;
- armazenamento final em localStorage sem estratégia definida.
```

Se precisar exibir algo, exibir apenas token mascarado:

```txt
eyJhbGciOi...****
```

---

## 11.3 Tratamento de erros

Tratar pelo menos:

```txt
400 — payload inválido
401 — assinatura inválida ou nonce inválido
403 — wallet sem permissão/perfil, se aplicável
404 — perfil não encontrado, se aplicável
422 — validação de schema
500 — erro interno
```

Mensagens sugeridas:

```txt
Não foi possível validar a assinatura.
Assinatura inválida. Tente novamente.
Nonce expirado. Solicite uma nova assinatura.
Carteira não autorizada para este ambiente.
Backend indisponível no momento.
```

---

# 12. Segurança

Cuidados obrigatórios:

```txt
[ ] Não expor JWT completo em logs permanentes
[ ] Não commitar token real
[ ] Não salvar private key
[ ] Não solicitar seed phrase
[ ] Não salvar assinatura em arquivo versionado
[ ] Não alterar .env com segredos reais
[ ] Não deixar debug sensível permanente
```

---

# 13. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua funcionando
[ ] NEXT_PUBLIC_USE_MOCKS=false usa fluxo real
[ ] Modo mock não exige wallet real obrigatoriamente
[ ] Nenhum componente demo foi quebrado
```

Se houver conflito entre mock e fluxo real, documentar para o Bloco 07.

---

# 14. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/verify_jwt.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Verify + JWT — Bloco 03

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Contrato Real do /auth/verify

## 4. Payload Enviado

## 5. Response de Sucesso

## 6. Responses de Erro

## 7. JWT Recebido

## 8. Tratamento de Erros

## 9. Segurança e Logs

## 10. Preservação do Mock Mode

## 11. Validações Executadas

## 12. Pendências para os Próximos Blocos

## 13. Conclusão Técnica
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
GET /auth/nonce com wallet válida
assinar mensagem no navegador
POST /auth/verify com assinatura válida
POST /auth/verify com payload inválido controlado
POST /auth/verify com assinatura inválida controlada
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

O Bloco 03 será considerado concluído quando:

```txt
[ ] Contrato real de /auth/verify foi mapeado
[ ] Payload de verify está correto
[ ] Assinatura gerada pela wallet é enviada ao backend
[ ] Backend retorna JWT com assinatura válida
[ ] JWT não é salvo quando verify falha
[ ] Erro de payload inválido é tratado
[ ] Erro de assinatura inválida é tratado
[ ] Erro de nonce expirado/inválido é tratado, se aplicável
[ ] Token não é exposto em logs permanentes
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
feat: validar assinatura e receber jwt no frontend
```

Alternativas:

```txt
feat: integrar verify de autenticacao com backend
```

```txt
chore: documenta contrato de verify jwt
```

O commit deve conter somente alterações relacionadas ao Bloco 03.

Não misturar auth store, authorization bearer, contracts, actions ou auditoria.

---

# 18. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_03_verify_jwt.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 03: Verify + JWT

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Contrato do /auth/verify

## 5. Payload enviado

## 6. Response recebida

## 7. JWT recebido

## 8. Tratamento de erros

## 9. Segurança e logs

## 10. Preservação do mock mode

## 11. Validações executadas

## 12. Pendências encontradas

## 13. Commit realizado

## 14. Observações para o próximo bloco
```

---

# 19. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- criar auth store/session;
- persistir accessToken corretamente;
- implementar logout;
- implementar restoreSession, se aplicável;
- injetar Authorization Bearer;
- integrar /auth/me completamente;
- substituir perfil demo por perfil real;
- integrar contracts/actions/audit.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 03.

---

# 20. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_03_verify_jwt.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/verify_jwt.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_03_verify_jwt.md
```

E no frontend deve existir o fluxo funcional para enviar a assinatura ao backend e receber o JWT.

---

# 21. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 04 — Auth Store/Session
```

Esse próximo bloco deve criar a sessão autenticada, persistir o token corretamente, guardar profile/wallet/role e centralizar login/logout.
