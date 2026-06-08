# Bloco 06 — Integração /auth/me

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_06_integracao_auth_me`  
**Tipo:** Integração do perfil autenticado real  
**Objetivo central:** integrar o endpoint `GET /auth/me` ao frontend para validar o JWT, carregar o perfil autenticado real do backend e disponibilizar `profile`, `role` e `walletAddress` para a interface.

---

# 1. Objetivo do Bloco

Integrar oficialmente o endpoint:

```txt
GET /auth/me
```

Ao final deste bloco, o frontend deve conseguir:

```txt
1. Usar o JWT salvo na auth store/session
2. Enviar Authorization Bearer pelo HTTP client
3. Chamar GET /auth/me
4. Receber o perfil autenticado real do backend
5. Salvar profile, role e walletAddress na auth store/session
6. Tratar token inválido
7. Tratar profile não encontrado
8. Executar logout/clearSession quando a sessão for inválida
9. Preservar mock mode
```

Este bloco deve fechar o ciclo mínimo de autenticação real:

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
```

Agora, o frontend precisa validar o token recebido e carregar o perfil real do usuário autenticado.

Sem `/auth/me`, o frontend até pode ter JWT, mas ainda não possui uma fonte confiável para saber:

```txt
- quem é o usuário autenticado;
- qual é sua role real;
- qual wallet está vinculada ao perfil;
- quais permissões visuais devem ser aplicadas.
```

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_06_integracao_auth_me.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_06_integracao_auth_me.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_auth_me.md
```

---

# 5. Premissas Técnicas

Antes de iniciar, validar:

```txt
[ ] Bloco 01 concluído
[ ] Auth API possui função para GET /auth/me
[ ] Bloco 02 concluído
[ ] Wallet real conecta e assina mensagem
[ ] Bloco 03 concluído
[ ] /auth/verify retorna JWT
[ ] Bloco 04 concluído
[ ] Auth store/session existe
[ ] Bloco 05 concluído
[ ] HTTP client envia Authorization Bearer
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
- integrar GET /auth/me no frontend;
- ajustar função getAuthenticatedProfile ou equivalente;
- usar Authorization Bearer já implementado;
- atualizar auth store/session com profile real;
- atualizar role real na sessão;
- atualizar walletAddress real na sessão;
- validar token após login;
- validar token em restoreSession, se aplicável;
- tratar token inválido;
- tratar profile não encontrado;
- limpar sessão quando necessário;
- ajustar componentes mínimos que dependem do profile autenticado;
- documentar contrato do /auth/me;
- preservar mock mode.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- integrar contracts reais;
- integrar actions reais;
- integrar auditoria real;
- substituir todo o perfil demo em todos os componentes ainda;
- remover mocks;
- fazer deploy;
- habilitar blockchain real;
- alterar regras de negócio do backend;
- criar migrations;
- expor JWT em logs permanentes;
- commitar token real ou .env real.
```

A substituição completa do perfil demo pelo perfil real será feita no:

```txt
Bloco 07 — Substituir Perfil Demo em Modo API Real
```

Contratos, actions e auditoria começam apenas a partir dos blocos 08, 09 e 10.

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- função de /auth/me criada no Bloco 01;
- HTTP client ajustado no Bloco 05;
- auth store/session criada no Bloco 04;
- resposta real do backend em GET /auth/me;
- schemas/tipagens de profile;
- role usada pelo backend;
- walletAddress ou wallet_address retornado;
- componentes que usam profile/role;
- comportamento atual com NEXT_PUBLIC_USE_MOCKS=true;
- comportamento atual com NEXT_PUBLIC_USE_MOCKS=false.
```

Usar o backend como fonte de verdade.

Não inventar campos de profile.

---

# 9. Contrato do Endpoint `/auth/me`

Confirmar o contrato real no backend.

Mapear:

```txt
- método HTTP;
- path;
- headers necessários;
- response de sucesso;
- response de erro;
- status codes possíveis.
```

Header esperado:

```txt
Authorization: Bearer <accessToken>
```

Possível response de sucesso:

```json
{
  "id": "uuid",
  "name": "Maria Santos",
  "role": "GESTOR",
  "walletAddress": "0x1111111111111111111111111111111111111111"
}
```

ou:

```json
{
  "data": {
    "id": "uuid",
    "name": "Maria Santos",
    "role": "GESTOR",
    "wallet_address": "0x1111111111111111111111111111111111111111"
  }
}
```

O frontend deve adaptar a tipagem ao contrato real.

---

# 10. Implementação Esperada

## 10.1 Chamar `/auth/me` após login

Após o fluxo de login/verify obter JWT, chamar:

```txt
GET /auth/me
```

O objetivo é substituir qualquer profile incompleto ou temporário por profile real vindo do backend.

Fluxo esperado:

```txt
1. Login/verify retorna JWT
2. JWT é salvo na auth store/session
3. HTTP client usa Authorization Bearer
4. Frontend chama /auth/me
5. Backend retorna profile real
6. Auth store/session salva profile, role e walletAddress
```

---

## 10.2 Chamar `/auth/me` no restoreSession

Se o Bloco 04 implementou persistência do token, o restore deve:

```txt
1. Ler token persistido
2. Configurar sessão temporária
3. Chamar /auth/me
4. Se token válido, restaurar profile real
5. Se token inválido, limpar sessão
```

Se restoreSession ainda não existir, documentar como pendência ou preparar estrutura mínima.

---

## 10.3 Atualizar auth store/session

A store deve ser atualizada com:

```txt
profile
role
walletAddress
isAuthenticated=true
isLoading=false
error=null
```

Se `/auth/me` falhar:

```txt
isAuthenticated=false, quando token inválido
profile=null
role=null
error=mensagem adequada
```

---

# 11. Tratamento de Erros

Tratar pelo menos:

```txt
401 — token ausente, inválido ou expirado
403 — token válido, mas sem permissão
404 — profile não encontrado
422 — schema/payload inválido
500 — erro interno
network error — backend indisponível
```

Mensagens sugeridas:

```txt
Sessão inválida ou expirada. Faça login novamente.
Perfil autenticado não encontrado.
Você não tem permissão para acessar este recurso.
Não foi possível carregar o perfil autenticado.
```

Regras importantes:

```txt
- 401 deve limpar sessão ou pedir novo login;
- 403 não deve necessariamente limpar sessão;
- 404 deve ser tratado como profile não encontrado;
- erro de rede não deve destruir dados sem necessidade, mas deve avisar o usuário.
```

---

# 12. Segurança

Cuidados obrigatórios:

```txt
[ ] Não logar JWT completo
[ ] Não exibir JWT completo na UI
[ ] Não salvar JWT em feedback
[ ] Não commitar .env real
[ ] Não salvar private key, mnemonic ou seed phrase
[ ] Não criar profile fake em modo real se /auth/me falhar
```

---

# 13. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua usando perfil demo/mock
[ ] NEXT_PUBLIC_USE_MOCKS=false usa /auth/me para profile real
[ ] Mock mode não exige JWT
[ ] Seleção de perfil demo continua funcionando, se existir
[ ] Componentes demo não quebram
```

Se houver mistura entre profile mock e real, documentar para o Bloco 07.

---

# 14. Integração com Permissões Visuais

Após carregar `/auth/me`, o frontend deve ter acesso à role real.

Validar:

```txt
[ ] role real está disponível na auth store/session
[ ] role real segue padrão do backend
[ ] permissões visuais podem consumir essa role
[ ] nenhuma role é inventada no frontend
```

A aplicação completa da role real nos componentes será refinada no Bloco 07, mas este bloco deve disponibilizar a informação corretamente.

---

# 15. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_auth_me.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Integração /auth/me — Bloco 06

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Contrato Real do /auth/me

## 4. Header Authorization Utilizado

## 5. Response de Sucesso

## 6. Responses de Erro

## 7. Atualização da Auth Store/Session

## 8. Restore Session

## 9. Integração com Role/Permissões

## 10. Tratamento de Erros

## 11. Segurança e Logs

## 12. Preservação do Mock Mode

## 13. Validações Executadas

## 14. Pendências para os Próximos Blocos

## 15. Conclusão Técnica
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
GET /auth/me com token válido
GET /auth/me sem token
GET /auth/me com token inválido
validar atualização da auth store/session
validar logout/clearSession em token inválido
validar mock mode
```

Se possível, validar também:

```txt
- reload da página com token persistido;
- restoreSession;
- role real refletida no estado;
- profile real exibido em local controlado.
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

O Bloco 06 será considerado concluído quando:

```txt
[ ] Contrato real de /auth/me foi mapeado
[ ] GET /auth/me é chamado com Authorization Bearer
[ ] Token válido retorna profile real
[ ] Profile real é salvo na auth store/session
[ ] Role real é salva na auth store/session
[ ] Wallet real é salva ou confirmada na auth store/session
[ ] Token inválido é tratado
[ ] Sessão é limpa quando necessário
[ ] 401 é tratado corretamente
[ ] 403 é tratado corretamente
[ ] 404/profile não encontrado é tratado
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
feat: integrar perfil autenticado via auth me
```

Alternativas:

```txt
feat: carregar profile real com auth me
```

```txt
chore: documenta integracao do endpoint auth me
```

O commit deve conter somente alterações relacionadas ao Bloco 06.

Não misturar substituição completa de perfil demo, contracts, actions ou auditoria.

---

# 19. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_06_integracao_auth_me.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 06: Integração /auth/me

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Contrato do /auth/me

## 5. Header Authorization

## 6. Profile real carregado

## 7. Atualização da auth store/session

## 8. Tratamento de erros

## 9. Restore session

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
- substituir completamente perfil demo por profile real em modo API;
- revisar todos os componentes que ainda usam profile mock;
- integrar contracts reais;
- integrar actions reais;
- integrar eventos/timeline/auditoria;
- tratar blockchain indisponível;
- executar teste ponta a ponta.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 06.

---

# 21. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_06_integracao_auth_me.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_auth_me.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_06_integracao_auth_me.md
```

E no frontend deve existir integração funcional com `/auth/me`, permitindo carregar o perfil autenticado real do backend.

---

# 22. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 07 — Substituir Perfil Demo em Modo API Real
```

Esse próximo bloco deve garantir que, quando `NEXT_PUBLIC_USE_MOCKS=false`, o frontend use o profile real carregado via `/auth/me`, e não dados demo fixos.
