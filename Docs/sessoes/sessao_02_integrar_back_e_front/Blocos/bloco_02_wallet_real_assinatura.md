# Bloco 02 — Wallet Real + Assinatura

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_02_wallet_real_assinatura`  
**Tipo:** Integração inicial de wallet real e assinatura de nonce  
**Objetivo central:** conectar uma wallet real no frontend, ler o endereço conectado, solicitar nonce ao backend e assinar a mensagem retornada, preparando o fluxo para o verify/JWT no Bloco 03.

---

# 1. Objetivo do Bloco

Implementar ou ajustar o fluxo de conexão com wallet real no frontend e assinatura da mensagem de nonce retornada pelo backend.

Este bloco deve permitir que o usuário:

```txt
1. Conecte uma wallet real
2. O frontend leia o address conectado
3. O frontend solicite nonce ao backend usando o address
4. O usuário assine a mensagem/nonce
5. O frontend capture a assinatura gerada
6. Erros de wallet desconectada ou assinatura recusada sejam tratados
```

Este bloco **não deve finalizar o login completo** e **não deve persistir JWT**.

A validação da assinatura e recebimento do JWT será feita no próximo bloco:

```txt
Bloco 03 — Verify + JWT
```

---

# 2. Contexto da Sessão 02

A Sessão 02 tem como objetivo integrar frontend e backend reais.

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

O Bloco 01 criou ou preparou a camada Auth API.

Este Bloco 02 deve usar essa camada para solicitar o nonce, mas ainda não deve executar o verify final com JWT.

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_02_wallet_real_assinatura.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_02_wallet_real_assinatura.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/wallet_real_assinatura.md
```

---

# 5. Premissas Técnicas

Antes de iniciar a implementação, validar:

```txt
[ ] Bloco 01 concluído
[ ] Auth API criada no frontend
[ ] Função de solicitar nonce disponível
[ ] Backend rodando em http://127.0.0.1:8000
[ ] Frontend rodando em http://localhost:3000
[ ] CORS funcionando
[ ] Endpoint /health respondendo HTTP 200
[ ] NEXT_PUBLIC_API_BASE_URL configurado
[ ] Modo mock preservado
[ ] Biblioteca de wallet identificada ou definida
```

Se alguma premissa estiver quebrada, registrar no feedback e em `bugs/bugs_sessao_02.md`, se for bug real.

---

# 6. Escopo Permitido

Neste bloco você pode:

```txt
- instalar ou configurar biblioteca de wallet se ainda não existir;
- usar wagmi, viem, RainbowKit ou stack já existente;
- criar provider/config de wallet, se necessário;
- conectar wallet real no frontend;
- ler address conectado;
- solicitar nonce ao backend usando Auth API do Bloco 01;
- assinar mensagem retornada pelo backend;
- capturar assinatura gerada;
- tratar wallet desconectada;
- tratar recusa de assinatura pelo usuário;
- tratar rede incorreta, se a stack permitir;
- exibir feedback visual simples para sucesso/erro;
- documentar estratégia de wallet e assinatura.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- enviar assinatura para /auth/verify como fluxo final de login;
- persistir JWT;
- criar auth store/session completa;
- injetar Authorization Bearer;
- integrar /auth/me completamente;
- substituir perfil demo por perfil real;
- integrar contratos reais;
- integrar actions reais;
- integrar auditoria real;
- remover mocks;
- fazer deploy;
- habilitar blockchain real;
- expor private key, mnemonic ou seed phrase.
```

Se algum item fora do escopo for necessário, documentar como pendência para os próximos blocos.

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- estrutura de providers do frontend;
- layout raiz da aplicação;
- componentes atuais de wallet;
- stores de wallet/mock wallet existentes;
- uso atual de wallet demo;
- dependências instaladas no package.json;
- existência de wagmi, viem, ethers ou RainbowKit;
- Auth API criada no Bloco 01;
- contrato real do endpoint /auth/nonce;
- tratamento atual de erros;
- variável NEXT_PUBLIC_CHAIN_ID;
- variável NEXT_PUBLIC_EXPLORER_URL;
- comportamento com NEXT_PUBLIC_USE_MOCKS=true e false.
```

Não duplicar providers se já existir estrutura.

Não criar uma segunda solução de wallet se o projeto já usa uma stack definida.

---

# 9. Stack Recomendada

A stack recomendada para este projeto é:

```txt
wagmi + viem
```

Opcionalmente:

```txt
RainbowKit
```

A escolha deve respeitar o que já existe no projeto.

## 9.1 Se wagmi/viem já existir

Usar a stack existente.

Verificar hooks como:

```txt
useAccount
useConnect
useDisconnect
useSignMessage
```

## 9.2 Se nenhuma stack existir

Avaliar instalação controlada.

Exemplo conceitual:

```bash
npm install wagmi viem
```

Se decidir usar RainbowKit:

```bash
npm install @rainbow-me/rainbowkit wagmi viem
```

Atenção:

```txt
Não instalar dependências sem necessidade.
Não alterar a arquitetura global sem documentação.
```

---

# 10. Fluxo Esperado da Wallet

O fluxo mínimo esperado:

```txt
1. Usuário clica em conectar wallet
2. Frontend abre conector da wallet
3. Usuário aprova conexão
4. Frontend lê o address conectado
5. Frontend solicita nonce ao backend para esse address
6. Backend retorna mensagem/nonce
7. Frontend solicita assinatura da mensagem
8. Usuário assina ou recusa
9. Frontend guarda temporariamente message, address e signature para o próximo bloco
```

---

# 11. Solicitação de Nonce

Usar a função criada no Bloco 01.

Exemplo conceitual:

```ts
const nonceResponse = await requestAuthNonce(address);
```

A mensagem assinada deve ser a mensagem real retornada pelo backend.

Não criar mensagem manual se o backend já retorna uma mensagem oficial.

Se o backend retornar apenas `nonce`, verificar no contrato se a mensagem deve ser montada no frontend ou se já vem pronta.

Documentar a decisão.

---

# 12. Assinatura da Mensagem

Usar assinatura de mensagem simples.

Exemplo conceitual com wagmi:

```ts
const signature = await signMessageAsync({
  message: nonceResponse.message,
});
```

A mensagem assinada deve ser exatamente a mensagem esperada pelo backend no `/auth/verify`.

Não alterar quebras de linha, espaços ou conteúdo da mensagem.

Esse ponto é crítico: se a mensagem assinada for diferente da mensagem verificada pelo backend, o verify falhará.

---

# 13. Estado Temporário do Fluxo

Neste bloco, pode ser criado estado temporário para armazenar:

```txt
walletAddress
nonce
message
signature
status
error
```

Esse estado pode ficar em um hook, componente ou store existente, desde que não vire ainda a store global final de auth.

A store global definitiva será tratada no:

```txt
Bloco 04 — Auth Store/Session
```

---

# 14. Tratamento de Erros

Tratar pelo menos:

```txt
- wallet não conectada;
- usuário recusou conexão;
- usuário recusou assinatura;
- nonce não pôde ser solicitado;
- backend indisponível;
- mensagem de nonce ausente;
- endereço de wallet inválido;
- rede incorreta, se aplicável;
- erro inesperado.
```

Mensagens sugeridas:

```txt
Conecte sua wallet para continuar.
Assinatura recusada pelo usuário.
Não foi possível solicitar o nonce.
Não foi possível assinar a mensagem.
Backend indisponível no momento.
```

Não expor detalhes sensíveis ou stack trace para o usuário.

---

# 15. Preservação do Mock Mode

O modo mock deve continuar funcionando.

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true mantém fluxo demo/mock atual
[ ] NEXT_PUBLIC_USE_MOCKS=false habilita fluxo real de wallet/API
[ ] Componentes existentes não quebram em modo demo
[ ] Perfil demo não é removido neste bloco
```

Se a UI atual não tiver separação clara entre mock e real, documentar pendência para o Bloco 07.

---

# 16. UI/UX Mínima Esperada

Este bloco pode ajustar ou criar uma UI mínima para:

```txt
- botão conectar wallet;
- exibição do endereço conectado;
- botão solicitar nonce/assinar;
- estado carregando;
- mensagem de erro;
- mensagem de assinatura realizada.
```

Não gastar esforço com redesign visual amplo.

A prioridade é funcionalidade e segurança do fluxo.

---

# 17. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/wallet_real_assinatura.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Wallet Real + Assinatura — Bloco 02

## 1. Resumo Executivo

## 2. Stack de Wallet Identificada

## 3. Arquivos Analisados

## 4. Arquivos Criados ou Alterados

## 5. Fluxo Implementado

## 6. Contrato do Nonce Utilizado

## 7. Assinatura da Mensagem

## 8. Tratamento de Erros

## 9. Preservação do Mock Mode

## 10. Validações Executadas

## 11. Pendências para os Próximos Blocos

## 12. Conclusão Técnica
```

---

# 18. Validações Obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
docker compose config
docker compose up -d --build
GET http://127.0.0.1:8000/health
GET /auth/nonce com wallet válida
teste de conexão da wallet no navegador
teste de assinatura de mensagem no navegador
teste de recusa de assinatura
```

Se algum comando não puder ser executado, registrar no feedback:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 19. Critérios de Aceite

O Bloco 02 será considerado concluído quando:

```txt
[ ] Stack de wallet foi identificada ou definida
[ ] Wallet real conecta no frontend
[ ] Address conectado é lido corretamente
[ ] Frontend solicita nonce ao backend
[ ] Mensagem/nonce retornada é usada para assinatura
[ ] Usuário consegue assinar a mensagem
[ ] Assinatura é capturada no frontend
[ ] Recusa de assinatura é tratada
[ ] Wallet desconectada é tratada
[ ] Mock mode foi preservado
[ ] Arquivo de análise foi criado em analises/
[ ] npm run lint executado ou justificado
[ ] npm run build executado ou justificado
[ ] Backend /health validado ou justificado
[ ] Commit semântico realizado
[ ] Feedback gerado na pasta Feedback
```

---

# 20. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
feat: integrar wallet real e assinatura de nonce
```

Alternativas:

```txt
feat: adiciona fluxo de conexao e assinatura de wallet
```

```txt
chore: prepara assinatura de nonce no frontend
```

O commit deve conter somente alterações relacionadas ao Bloco 02.

Não misturar verify/JWT, auth store, contracts, actions ou auditoria.

---

# 21. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_02_wallet_real_assinatura.md
```

Estrutura obrigatória do feedback:

```md
# Feedback — Bloco 02: Wallet Real + Assinatura

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Stack de wallet utilizada

## 5. Fluxo implementado

## 6. Testes de conexão da wallet

## 7. Testes de assinatura

## 8. Tratamento de erros

## 9. Preservação do mock mode

## 10. Validações executadas

## 11. Pendências encontradas

## 12. Commit realizado

## 13. Observações para o próximo bloco
```

---

# 22. Pendências Esperadas para Próximos Blocos

Ao final deste bloco, é normal que ainda estejam pendentes:

```txt
- enviar assinatura para /auth/verify;
- receber JWT;
- persistir JWT;
- criar auth store/session;
- injetar Authorization Bearer;
- integrar /auth/me completamente;
- substituir perfil demo por perfil real;
- integrar contracts/actions/audit.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 02.

---

# 23. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_02_wallet_real_assinatura.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/wallet_real_assinatura.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_02_wallet_real_assinatura.md
```

E no frontend deve existir um fluxo funcional para conectar wallet real, solicitar nonce ao backend e assinar a mensagem retornada.

---

# 24. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 03 — Verify + JWT
```

Esse próximo bloco deve enviar a assinatura capturada para o backend, validar o login e receber o JWT.
