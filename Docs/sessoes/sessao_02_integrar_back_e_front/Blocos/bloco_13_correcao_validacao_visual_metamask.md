# Bloco 13 — Correção e Validação Visual da MetaMask

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_13_correcao_validacao_visual_metamask`  
**Tipo:** Bloco corretivo final antes da Sessão 03  
**Objetivo central:** corrigir e validar a experiência real de conexão com MetaMask no navegador, garantindo que o modo API real esteja ativo, que o botão de wallet real apareça, que o fluxo de assinatura funcione visualmente e que a Sessão 02 possa ser encerrada com segurança antes da Sessão 03.

---

# 1. Objetivo do Bloco

Executar um bloco adicional corretivo para resolver as pendências finais identificadas nos feedbacks da Sessão 02, principalmente:

```txt
- MetaMask não aparece como opção de conexão;
- validação visual/manual com extensão de wallet real não foi executada;
- ambiente local ainda pode estar em NEXT_PUBLIC_USE_MOCKS=true;
- porta oficial localhost:3000 estava ocupada por outro projeto;
- frontend real foi validado em localhost:3001;
- necessidade de confirmar providers/connectors wagmi/RainbowKit;
- necessidade de validar o fluxo real no navegador:
  wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me.
```

Ao final deste bloco, a Sessão 02 só deve avançar para a Sessão 03 se a conexão real com MetaMask estiver funcionando ou se houver uma causa técnica externa claramente documentada.

---

# 2. Contexto dos Feedbacks da Sessão 02

Os feedbacks indicam que a integração técnica backend/frontend foi aprovada com ressalvas.

Pontos já concluídos:

```txt
[OK] Auth API criada
[OK] /auth/nonce integrado
[OK] /auth/verify integrado
[OK] JWT recebido
[OK] Auth Store/Session criada com Zustand + sessionStorage
[OK] Authorization Bearer no HTTP Client
[OK] /auth/me integrado
[OK] Profile real em modo API
[OK] Contratos reais integrados
[OK] Actions reais integradas
[OK] Eventos, timeline e auditoria integrados
[OK] Blockchain indisponível tratada de forma segura
[OK] Teste ponta a ponta técnico aprovado com ressalvas
```

Pendências reais antes da Sessão 03:

```txt
[Pendente] Teste visual/manual com MetaMask real no navegador
[Pendente] Confirmar se NEXT_PUBLIC_USE_MOCKS=false está ativo no ambiente usado pelo usuário
[Pendente] Confirmar se o botão exibido é o botão real e não o botão demo
[Pendente] Confirmar se wagmi/RainbowKit Providers estão ativos no app real
[Pendente] Confirmar se connectors incluem injected/MetaMask
[Pendente] Confirmar se a porta aberta pelo usuário é realmente o FiscalizaPay
[Pendente] Validar popup da MetaMask
[Pendente] Validar assinatura de data.message
[Pendente] Validar verify/JWT pelo navegador real
```

---

# 3. Decisão de Controle

Antes da Sessão 03, executar obrigatoriamente este bloco.

A Sessão 03 só deve iniciar se:

```txt
[ ] MetaMask conectar corretamente no navegador
[ ] assinatura real funcionar
[ ] JWT real for recebido pelo navegador
[ ] /auth/me carregar profile real
[ ] não houver fallback silencioso para mock em modo API
```

Ou, caso a MetaMask não funcione:

```txt
[ ] causa raiz documentada
[ ] bug classificado
[ ] plano de correção criado
[ ] decisão de avançar ou bloquear Sessão 03 registrada
```

---

# 4. Estrutura DDAD Obrigatória

Este bloco deve seguir o ciclo DDAD:

```txt
1. Pré-análise
2. Correção controlada
3. Validação visual/manual
4. Validação técnica local
5. Registro de evidências
6. Commit semântico
7. Feedback final em Markdown
```

Nenhum avanço para a Sessão 03 deve ocorrer sem feedback final deste bloco.

---

# 5. Rotas Oficiais de Documentação e Feedback

O planejamento deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_13_correcao_validacao_visual_metamask.md
```

O feedback final deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_13_correcao_validacao_visual_metamask.md
```

A análise técnica deve ser salva em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/correcao_validacao_visual_metamask.md
```

Se forem encontrados bugs, atualizar:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

---

# 6. Premissas Técnicas

Antes de iniciar, validar:

```txt
[ ] Backend rodando em http://127.0.0.1:8000
[ ] /health retornando HTTP 200
[ ] Frontend rodando no projeto FiscalizaPay
[ ] Porta aberta no navegador é realmente o FiscalizaPay
[ ] NEXT_PUBLIC_USE_MOCKS=false no ambiente do frontend
[ ] NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
[ ] NEXT_PUBLIC_CHAIN_ID=80002
[ ] NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
[ ] MetaMask instalada no navegador
[ ] MetaMask desbloqueada
[ ] MetaMask com pelo menos uma conta disponível
[ ] Rede Amoy/Polygon Amoy ou rede esperada configurada, se exigida
```

---

# 7. Principais Hipóteses do Problema

## 7.1 App está em mock mode

Sintoma:

```txt
- aparece botão demo;
- não aparece MetaMask;
- fluxo não chama wallet real;
- NEXT_PUBLIC_USE_MOCKS=true.
```

Correção esperada:

```env
NEXT_PUBLIC_USE_MOCKS=false
```

Depois limpar cache e reiniciar o frontend.

---

## 7.2 Usuário abriu a porta errada

Sintoma:

```txt
- localhost:3000 mostra outro projeto;
- FiscalizaPay está em localhost:3001;
- botão não corresponde ao código atual;
- visual não bate com a aplicação esperada.
```

Correção esperada:

```txt
- identificar processo ocupando 3000;
- subir FiscalizaPay na porta correta;
- abrir a URL correta;
- documentar qual porta foi usada.
```

Comandos úteis no Windows:

```powershell
netstat -ano | findstr :3000
Get-Process -Id <PID>
```

Rodar frontend em porta alternativa:

```bash
npm run dev -- -p 3001
```

---

## 7.3 Cache `.next` antigo

Sintoma:

```txt
- mudança de env não reflete;
- ainda aparece modo demo mesmo após alterar .env;
- rotas antigas aparecem;
- comportamento inconsistente.
```

Correção esperada:

PowerShell:

```powershell
Remove-Item -Recurse -Force .next
```

Bash:

```bash
rm -rf .next
```

Depois reiniciar:

```bash
npm run dev
```

ou:

```bash
npm run dev -- -p 3001
```

---

## 7.4 Provider wagmi/RainbowKit não está montado corretamente

Sintoma:

```txt
- nenhum connector aparece;
- botão real renderiza, mas não abre modal;
- hooks wagmi não encontram contexto;
- erro de provider no console.
```

Analisar:

```txt
web/src/app/providers/index.tsx
Web3Provider
RainbowKitProvider
WagmiProvider
QueryClientProvider
AuthSessionHydrator
```

Validar ordem dos providers e se o app real está envolvido pelo provider correto.

---

## 7.5 Connectors não incluem injected/MetaMask

Sintoma:

```txt
- botão real aparece;
- modal abre;
- MetaMask não aparece;
- apenas WalletConnect ou nenhum conector aparece.
```

Analisar config wagmi/RainbowKit:

```txt
connectors
injected
metaMask
walletConnect
rainbowkit wallets
chains
transports
```

Garantir que há suporte para wallet injetada.

---

## 7.6 MetaMask não está disponível no navegador usado

Sintoma:

```txt
- window.ethereum ausente;
- navegador não tem extensão;
- navegador anônimo sem extensão habilitada;
- extensão desativada.
```

Validar no console:

```js
window.ethereum
```

Resultado esperado:

```txt
objeto disponível
```

Se for `undefined`, o problema é ambiente/navegador, não necessariamente código.

---

## 7.7 ChainId incorreto bloqueando fluxo

Sintoma:

```txt
- wallet conecta;
- assinatura não avança;
- mensagem de rede incorreta;
- chainId diferente de 80002.
```

Validar:

```txt
NEXT_PUBLIC_CHAIN_ID=80002
MetaMask na rede Polygon Amoy
```

Se a aplicação só exige assinatura de mensagem, rede incorreta pode ser aviso, mas não deve impedir a abertura da MetaMask, salvo regra implementada.

---

# 8. Pré-Análise Obrigatória

Antes de corrigir, analisar:

```txt
web/.env.local
web/.env
web/package.json
web/src/app/providers/index.tsx
web/src/shared/config/env.ts
web/src/features/wallet-connect/ui/wallet-connect-button.tsx
web/src/features/auth-wallet/ui/wallet-signature-button.tsx
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
web/src/entities/auth/model/store.ts
web/src/entities/auth/ui/auth-session-hydrator.tsx
web/src/shared/api/auth-api.ts
web/src/shared/api/http-client.ts
web/src/shared/config/web3, se existir
web/src/shared/wallet, se existir
```

Procurar por:

```txt
NEXT_PUBLIC_USE_MOCKS
env.useMocks
WalletSignatureButton
WalletConnectButton
RainbowKitProvider
WagmiProvider
createConfig
getDefaultConfig
connectors
injected
metaMask
useConnect
useAccount
useSignMessage
```

---

# 9. Escopo Permitido

Neste bloco você pode:

```txt
- corrigir env local de desenvolvimento;
- adicionar documentação clara de como rodar em modo API real;
- ajustar renderização do botão de wallet real;
- corrigir provider wagmi/RainbowKit, se estiver ausente ou mal posicionado;
- adicionar/ajustar connector injected/MetaMask;
- melhorar mensagens de erro do fluxo de wallet;
- adicionar diagnóstico visual de modo atual: MOCK/API REAL, se útil;
- limpar fallback silencioso de mock;
- corrigir teste/manual setup;
- criar checklist de smoke test MetaMask;
- registrar prints/evidências, se possível;
- atualizar bugs_sessao_02.md.
```

---

# 10. Escopo Proibido

Neste bloco você não deve:

```txt
- iniciar Sessão 03;
- fazer deploy;
- implementar blockchain real;
- habilitar BLOCKCHAIN_ENABLED=true;
- preencher CONTRACT_ADDRESS com valor inventado;
- mexer em contracts/actions/audit sem relação com o bug;
- aplicar npm audit fix --force;
- remover mock mode;
- unificar perfis demo;
- commitar .env com segredos reais;
- salvar JWT, private key, seed phrase ou mnemonic.
```

---

# 11. Correções Esperadas

## 11.1 Garantir modo API real local

Validar e, se necessário, ajustar:

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
```

Se `web/.env.local` estiver propositalmente em mock mode, criar documentação para modo real, por exemplo:

```txt
web/.env.local.api.example
```

ou documentar no feedback.

---

## 11.2 Garantir que o botão real aparece

Com `NEXT_PUBLIC_USE_MOCKS=false`, deve renderizar:

```txt
WalletSignatureButton
```

e não o fluxo demo.

Critério:

```txt
- não deve aparecer "Conectar wallet (demo)";
- deve aparecer botão de conectar wallet real;
- ao clicar, deve abrir MetaMask/RainbowKit/modal.
```

---

## 11.3 Garantir connector MetaMask/injected

Se a configuração wagmi/RainbowKit não incluir injected/MetaMask, ajustar.

Critério:

```txt
- MetaMask aparece no modal;
- ou browser injected wallet aparece;
- ou clique aciona diretamente MetaMask.
```

---

## 11.4 Garantir assinatura real

Fluxo esperado:

```txt
1. Usuário clica em conectar wallet
2. MetaMask abre
3. Usuário conecta
4. Frontend lê walletAddress
5. Frontend chama GET /auth/nonce
6. Frontend recebe data.message
7. MetaMask abre pedido de assinatura
8. Usuário assina exatamente data.message
9. Frontend recebe signature
10. Frontend chama POST /auth/verify
11. Frontend recebe JWT
12. Auth store/session salva token
13. /auth/me carrega profile real
```

---

# 12. Validações Obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
NEXT_PUBLIC_USE_MOCKS=false npm run build
docker compose config
docker compose up -d --build
GET http://127.0.0.1:8000/health
GET http://localhost:3000 ou porta real usada
verificar valor efetivo de NEXT_PUBLIC_USE_MOCKS no app
validar se botão demo desapareceu
validar se botão real aparece
validar window.ethereum no console
validar conexão MetaMask
validar assinatura de data.message
validar POST /auth/verify pelo navegador
validar sessionStorage fiscalizapay.auth.session
validar GET /auth/me após login
validar profile real na UI
validar logout/clearSession
validar NEXT_PUBLIC_USE_MOCKS=true ainda funciona
git status
```

Se a porta `3000` estiver ocupada, documentar e usar:

```bash
npm run dev -- -p 3001
```

---

# 13. Evidências Obrigatórias

Registrar no feedback:

```txt
- porta usada no teste;
- valor efetivo de NEXT_PUBLIC_USE_MOCKS;
- se MetaMask apareceu ou não;
- se window.ethereum existe;
- se o popup de conexão abriu;
- se o popup de assinatura abriu;
- se /auth/nonce foi chamado;
- se /auth/verify retornou JWT;
- se /auth/me retornou profile;
- se sessionStorage foi preenchido;
- se UI mostrou profile real;
- se mock mode ainda funciona.
```

Se possível, salvar prints/caminhos de evidência.

Não registrar:

```txt
- JWT completo;
- signature completa;
- private key;
- seed phrase;
- mnemonic;
- .env real com segredo.
```

---

# 14. Critérios de Aceite

O Bloco 13 será considerado concluído quando:

```txt
[ ] Causa de MetaMask não aparecer foi identificada
[ ] NEXT_PUBLIC_USE_MOCKS=false foi validado no app real
[ ] Porta correta do FiscalizaPay foi identificada
[ ] Cache .next foi limpo se necessário
[ ] Provider wagmi/RainbowKit foi validado
[ ] Connector MetaMask/injected foi validado
[ ] Botão real aparece em modo API
[ ] MetaMask abre ao clicar
[ ] Wallet conecta
[ ] /auth/nonce é chamado
[ ] data.message é assinado
[ ] /auth/verify retorna JWT
[ ] sessionStorage recebe sessão
[ ] /auth/me retorna profile real
[ ] UI exibe profile real
[ ] logout limpa sessão
[ ] mock mode continua funcionando
[ ] Nenhum contrato/action/audit foi quebrado
[ ] Arquivo de análise foi criado
[ ] Feedback foi criado
[ ] Commit semântico foi realizado
```

Se MetaMask não conectar por causa externa, o bloco só pode ser aceito parcialmente se:

```txt
[ ] causa externa comprovada
[ ] evidência registrada
[ ] plano de correção criado
[ ] bug registrado em bugs_sessao_02.md
[ ] decisão explícita sobre avançar ou não para Sessão 03
```

---

# 15. Classificação de Resultado

Classificar o bloco como:

```txt
APROVADO
APROVADO COM RESSALVAS
REPROVADO
```

## APROVADO

Usar se:

```txt
- MetaMask aparece;
- wallet conecta;
- assinatura abre;
- verify retorna JWT;
- /auth/me carrega profile real;
- UI mostra profile real;
- mock mode continua funcionando.
```

## APROVADO COM RESSALVAS

Usar se:

```txt
- causa do problema foi identificada;
- app está pronto tecnicamente;
- mas há limitação externa do ambiente/navegador/porta;
- não há bug P1/P2 pendente.
```

## REPROVADO

Usar se:

```txt
- MetaMask não aparece por bug do app;
- wagmi/RainbowKit não está montado;
- connector MetaMask não existe;
- wallet conecta mas assinatura não abre;
- verify não recebe JWT;
- /auth/me falha com token válido;
- mock/API real continuam misturados.
```

Se REPROVADO, não iniciar Sessão 03.

---

# 16. Documento de Análise Obrigatório

Criar:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/correcao_validacao_visual_metamask.md
```

Estrutura obrigatória:

```md
# Correção e Validação Visual da MetaMask — Bloco 13

## 1. Resumo Executivo

## 2. Problema Reportado

## 3. Feedbacks Analisados

## 4. Hipóteses Investigadas

## 5. Ambiente Validado

## 6. Porta Utilizada

## 7. Variáveis de Ambiente Efetivas

## 8. Provider wagmi/RainbowKit

## 9. Connectors Disponíveis

## 10. Renderização do Botão de Wallet

## 11. Validação de window.ethereum

## 12. Fluxo MetaMask

## 13. Fluxo Nonce/Assinatura/Verify

## 14. Auth Store/sessionStorage

## 15. Integração /auth/me

## 16. Preservação do Mock Mode

## 17. Correções Aplicadas

## 18. Validações Executadas

## 19. Bugs Encontrados

## 20. Resultado Final

## 21. Decisão sobre Sessão 03

## 22. Conclusão Técnica
```

---

# 17. Feedback Obrigatório

Criar:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_13_correcao_validacao_visual_metamask.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 13: Correção e Validação Visual da MetaMask

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Causa raiz identificada

## 5. Correções aplicadas

## 6. Ambiente testado

## 7. Porta utilizada

## 8. Variáveis efetivas

## 9. MetaMask detectada

## 10. Conexão da wallet

## 11. Assinatura da mensagem

## 12. Verify/JWT

## 13. /auth/me e profile real

## 14. Mock mode

## 15. Validações executadas

## 16. Bugs encontrados

## 17. Bugs pendentes

## 18. Resultado final

## 19. Commit realizado

## 20. Decisão sobre Sessão 03
```

---

# 18. Atualização de Bugs

Se a MetaMask não aparecer por bug real do app, registrar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

Formato sugerido:

```md
## B-S02-002 — MetaMask não aparece em modo API real

**Prioridade:** P1 ou P2  
**Status:** Aberto / Corrigido  
**Origem:** Bloco 13  
**Descrição:**  
**Causa raiz:**  
**Impacto:**  
**Correção aplicada:**  
**Validação:**  
```

Prioridade:

```txt
P1 se impede login real completamente.
P2 se é contornável por configuração/porta/documentação.
```

---

# 19. Commit Obrigatório

Se houver correção de código:

```txt
fix: corrigir conexao visual com metamask
```

ou:

```txt
fix: habilitar wallet real em modo api
```

Se for apenas documentação/validação:

```txt
test: validar fluxo visual com metamask
```

ou:

```txt
docs: documenta validacao visual da metamask
```

Se houver bug corrigido + relatório, preferir commits separados:

```txt
fix: corrigir conexao visual com metamask
test: documentar validacao visual da metamask
```

---

# 20. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_13_correcao_validacao_visual_metamask.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/correcao_validacao_visual_metamask.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_13_correcao_validacao_visual_metamask.md
```

Se houver bug:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

---

# 21. Definição de Pronto Para Avançar à Sessão 03

Só avançar para a Sessão 03 se:

```txt
[ ] Bloco 13 aprovado
[ ] MetaMask validada ou causa externa documentada
[ ] Não existem bugs P1
[ ] Não existem bugs P2 pendentes relacionados a login/wallet/auth
[ ] Sessão 02 possui relatório final atualizado
[ ] Decisão explícita: Pode avançar para Sessão 03? Sim / Sim com ressalvas / Não
```

Recomendação:

```txt
Se MetaMask não aparecer por configuração local, corrigir configuração e aprovar.
Se MetaMask não aparecer por bug no app, corrigir antes da Sessão 03.
Se MetaMask não aparecer por ambiente externo do navegador, documentar e validar em outro navegador antes de deploy.
```

---

# 22. Observação Final

Este bloco é o fechamento real da Sessão 02.

A Sessão 02 já validou tecnicamente o backend e a integração por scripts, mas o usuário reportou falha na experiência visual com MetaMask. Como a wallet é a porta de entrada do produto, a Sessão 03 não deve começar sem essa validação.

Regra final:

```txt
Sem MetaMask validada, sem deploy.
```
