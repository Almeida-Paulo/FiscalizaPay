# Bloco 11 — Blockchain Indisponível de Forma Segura

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_11_blockchain_indisponivel_forma_segura`  
**Tipo:** Tratamento seguro de funcionalidade blockchain ainda indisponível  
**Objetivo central:** garantir que funcionalidades relacionadas à blockchain, especialmente `register-on-chain`, não quebrem a aplicação enquanto `BLOCKCHAIN_ENABLED=false` ou enquanto não existir smart contract real configurado.

---

# 1. Objetivo do Bloco

Tratar de forma segura os pontos da aplicação que dependem de blockchain real.

Nesta fase, a blockchain real ainda pode estar desabilitada no backend:

```env
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

Portanto, qualquer funcionalidade como:

```txt
register-on-chain
registro on-chain
consulta em explorer
hash de transação real
status blockchain real
```

deve ser tratada como recurso indisponível, futuro ou em preparação.

Ao final deste bloco, o frontend deve:

```txt
1. Não quebrar quando blockchain estiver desabilitada
2. Não exibir erro técnico confuso ao usuário
3. Desabilitar ou sinalizar ações on-chain indisponíveis
4. Exibir mensagem clara de recurso em preparação
5. Manter fluxo principal de contratos funcionando
6. Preservar mock mode quando NEXT_PUBLIC_USE_MOCKS=true
7. Documentar limitação técnica
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
Bloco 09 — Integrar Actions Reais
Bloco 10 — Integrar Eventos, Timeline e Auditoria
```

Agora o sistema já deve estar integrado com backend real em autenticação, contratos, actions, eventos e auditoria.

O Bloco 11 existe para evitar que a ausência de blockchain real prejudique a experiência ou a apresentação do sistema.

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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_11_blockchain_indisponivel_forma_segura.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_11_blockchain_indisponivel_forma_segura.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/blockchain_indisponivel_forma_segura.md
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
[ ] Bloco 10 concluído
[ ] Auth real funciona
[ ] Contratos reais funcionam
[ ] Actions reais funcionam
[ ] Eventos/timeline/auditoria reais funcionam
[ ] Backend rodando em http://127.0.0.1:8000
[ ] Frontend rodando em http://localhost:3000
[ ] /health retorna HTTP 200
[ ] BLOCKCHAIN_ENABLED=false está previsto/documentado
[ ] CONTRACT_ADDRESS está vazio ou seguro
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
- identificar pontos da UI que chamam blockchain real;
- identificar services relacionados a blockchain;
- identificar action register-on-chain;
- identificar status blockchain exibido na UI;
- consultar endpoint/status blockchain, se existir;
- tratar resposta de blockchain desabilitada;
- desabilitar botão register-on-chain quando necessário;
- exibir badge de recurso indisponível/em preparação;
- exibir mensagem amigável ao usuário;
- impedir erro crítico na aplicação;
- manter fluxo principal de contratos/actions funcionando;
- preservar mock mode;
- documentar limitação técnica.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- implementar smart contract real;
- fazer deploy de contrato;
- conectar carteira para transação on-chain real;
- enviar transação real para blockchain;
- alterar regras de negócio do backend sem justificativa;
- habilitar BLOCKCHAIN_ENABLED=true sem contrato real;
- preencher CONTRACT_ADDRESS com valor inventado;
- fazer deploy de produção;
- remover mock mode;
- expor private key, mnemonic, seed phrase ou segredo real.
```

Blockchain real deve ficar para uma sessão específica ou etapa futura.

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- componentes que exibem status blockchain;
- botões de register-on-chain;
- services de blockchain;
- actions de contrato relacionadas a blockchain;
- constantes de blockchain;
- variáveis NEXT_PUBLIC_CHAIN_ID;
- variáveis NEXT_PUBLIC_EXPLORER_URL;
- variáveis BLOCKCHAIN_ENABLED no backend;
- variável CONTRACT_ADDRESS no backend;
- endpoints relacionados a blockchain, se existirem;
- mensagens atuais de erro;
- mocks de blockchain;
- comportamento com NEXT_PUBLIC_USE_MOCKS=true;
- comportamento com NEXT_PUBLIC_USE_MOCKS=false.
```

Procurar por termos como:

```txt
blockchain
on-chain
onChain
registerOnChain
register-on-chain
transactionHash
txHash
contractAddress
explorer
polygonscan
CHAIN_ID
BLOCKCHAIN_ENABLED
CONTRACT_ADDRESS
```

---

# 9. Regra de Produto

Enquanto blockchain real estiver indisponível, a aplicação deve comunicar isso como limitação controlada, não como erro crítico.

Mensagem recomendada:

```txt
Registro em blockchain ainda indisponível neste ambiente.
```

ou:

```txt
Recurso blockchain em preparação. O fluxo principal do contrato permanece disponível.
```

Evitar mensagens técnicas como:

```txt
500 Internal Server Error
CONTRACT_ADDRESS missing
BLOCKCHAIN_ENABLED false
```

Esses detalhes podem ir para logs técnicos, não para a UI final.

---

# 10. Estratégia para `register-on-chain`

Se existir botão/action `register-on-chain`, aplicar uma das estratégias abaixo.

## 10.1 Estratégia preferencial

Quando `BLOCKCHAIN_ENABLED=false` ou status equivalente for detectado:

```txt
- botão deve ficar desabilitado;
- exibir tooltip ou texto explicativo;
- não chamar endpoint que já se sabe indisponível;
- não marcar contrato como registrado on-chain.
```

## 10.2 Estratégia alternativa

Se não houver endpoint/status para saber previamente:

```txt
- permitir chamada controlada;
- capturar erro de indisponibilidade;
- exibir mensagem amigável;
- manter contrato estável;
- não travar UI.
```

## 10.3 Nunca fazer

```txt
- simular sucesso on-chain em modo API real;
- gerar transactionHash fake em modo API real;
- alterar status do contrato para on-chain sem confirmação real;
- cair silenciosamente para mock quando mocks=false.
```

---

# 11. Status Blockchain na UI

Se a UI exibir status blockchain, usar estados claros:

```txt
Disponível
Indisponível
Em preparação
Não configurado
Registrado
Não registrado
Falha no registro
```

Para esta fase, o mais provável é:

```txt
Em preparação
```

ou:

```txt
Indisponível neste ambiente
```

---

# 12. Explorer / Polygonscan

Se houver link para explorer:

```txt
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
```

Regras:

```txt
[ ] Só exibir link se houver transactionHash real
[ ] Não criar link com hash fake em modo API real
[ ] Não usar CONTRACT_ADDRESS vazio
[ ] Em ausência de hash, mostrar "Ainda não registrado"
```

---

# 13. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true pode continuar simulando blockchain, se essa for a regra do demo
[ ] NEXT_PUBLIC_USE_MOCKS=false não simula sucesso on-chain
[ ] Mocks não são misturados com API real
[ ] A UI deixa claro quando é demo/mock
```

Regra importante:

```txt
Se mocks=false e blockchain estiver indisponível, exibir indisponibilidade real.
Não cair automaticamente para blockchain mockada.
```

---

# 14. Tratamento de Erros

Tratar pelo menos:

```txt
400 — payload inválido
401 — token ausente/inválido
403 — sem permissão
404 — contrato não encontrado
409 — contrato em status inválido, se aplicável
501 — recurso não implementado, se aplicável
503 — blockchain indisponível, se aplicável
500 — erro interno
network error — backend indisponível
```

Mensagens sugeridas:

```txt
Registro em blockchain indisponível neste ambiente.
Este contrato ainda não pode ser registrado on-chain.
Você não tem permissão para solicitar registro em blockchain.
Contrato não encontrado.
Backend indisponível no momento.
```

---

# 15. Fluxo Principal Não Pode Quebrar

Mesmo com blockchain indisponível, os fluxos abaixo devem continuar funcionando:

```txt
- autenticação;
- listagem de contratos;
- criação de contrato;
- detalhe de contrato;
- actions reais;
- timeline;
- auditoria.
```

Blockchain não pode ser bloqueio para a demo funcional do MVP, a menos que o escopo do produto exija explicitamente.

---

# 16. Segurança

Cuidados obrigatórios:

```txt
[ ] Não expor private key
[ ] Não expor mnemonic
[ ] Não expor seed phrase
[ ] Não commitar .env real
[ ] Não commitar contrato privado
[ ] Não criar transactionHash fake em modo real
[ ] Não exibir stack trace ao usuário
[ ] Não logar JWT completo
```

---

# 17. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/blockchain_indisponivel_forma_segura.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Blockchain Indisponível de Forma Segura — Bloco 11

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Pontos Blockchain Encontrados

## 4. Status Atual do Backend

## 5. Status Atual do Frontend

## 6. Estratégia para register-on-chain

## 7. Tratamento de UI/UX

## 8. Tratamento de Erros

## 9. Explorer e Transaction Hash

## 10. Preservação do Mock Mode

## 11. Impacto no Fluxo Principal

## 12. Segurança

## 13. Validações Executadas

## 14. Pendências Futuras

## 15. Conclusão Técnica
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
login com wallet até /auth/me
GET /contracts com token válido
GET /contracts/{id} com token válido
verificar botão/status register-on-chain
testar comportamento com BLOCKCHAIN_ENABLED=false
testar clique em register-on-chain, se o botão permanecer habilitado
validar mensagem amigável de indisponibilidade
validar que fluxo principal continua funcionando
validar UI com NEXT_PUBLIC_USE_MOCKS=false
validar UI com NEXT_PUBLIC_USE_MOCKS=true
```

Se existir endpoint específico para status blockchain, testar também:

```txt
GET /blockchain/status
```

ou equivalente real.

Se algum comando não puder ser executado, registrar no feedback:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 19. Critérios de Aceite

O Bloco 11 será considerado concluído quando:

```txt
[ ] Pontos blockchain foram mapeados
[ ] register-on-chain foi tratado com segurança
[ ] UI não quebra com BLOCKCHAIN_ENABLED=false
[ ] Usuário recebe mensagem clara
[ ] Nenhum transactionHash fake é gerado em modo real
[ ] Explorer só aparece com hash real
[ ] Fluxo principal continua funcionando
[ ] 401 é tratado
[ ] 403 é tratado
[ ] 404 é tratado
[ ] Indisponibilidade blockchain é tratada
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

# 20. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
fix: tratar blockchain indisponivel de forma segura
```

Alternativas:

```txt
feat: adiciona estado seguro para blockchain indisponivel
```

```txt
chore: documenta limitacao de blockchain na sessao 02
```

O commit deve conter somente alterações relacionadas ao Bloco 11.

Não misturar teste ponta a ponta ou deploy.

---

# 21. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_11_blockchain_indisponivel_forma_segura.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 11: Blockchain Indisponível de Forma Segura

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Pontos blockchain encontrados

## 5. Estratégia aplicada

## 6. Tratamento de register-on-chain

## 7. Tratamento de UI/UX

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
- teste ponta a ponta completo;
- relatório final da Sessão 02;
- validação final de todos os fluxos integrados;
- decisão futura sobre smart contract real;
- sessão específica para blockchain real, se necessária;
- deploy produção/staging na Sessão 03.
```

Esses itens pertencem aos próximos blocos/sessões e não devem ser tratados como falha do Bloco 11.

---

# 23. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_11_blockchain_indisponivel_forma_segura.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/blockchain_indisponivel_forma_segura.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_11_blockchain_indisponivel_forma_segura.md
```

E no frontend deve existir tratamento seguro para recursos blockchain indisponíveis, sem quebrar o fluxo principal da aplicação.

---

# 24. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 12 — Teste Ponta a Ponta
```

Esse próximo bloco deve validar o fluxo completo:

```txt
login real → JWT → profile real → contratos reais → actions reais → timeline → auditoria → blockchain indisponível tratada
```
