# Bloco 12 — Teste Ponta a Ponta

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_12_teste_ponta_a_ponta`  
**Tipo:** Validação final da integração local  
**Objetivo central:** executar e documentar o fluxo completo entre frontend e backend reais, validando autenticação, JWT, perfil real, contratos, actions, timeline, auditoria, erros 401/403 e blockchain indisponível tratada.

---

# 1. Objetivo do Bloco

Executar o teste ponta a ponta da Sessão 02, validando se o FiscalizaPay Web3 está realmente integrado localmente.

Este bloco deve confirmar se os principais fluxos funcionam com:

```txt
NEXT_PUBLIC_USE_MOCKS=false
```

Fluxo principal esperado:

```txt
login real → JWT → profile real → contratos reais → actions reais → timeline → auditoria → blockchain indisponível tratada
```

Este bloco encerra oficialmente a Sessão 02.

---

# 2. Contexto da Sessão 02

Os blocos anteriores implementaram ou prepararam:

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
Bloco 11 — Blockchain Indisponível de Forma Segura
```

Agora o objetivo é validar tudo junto, registrar evidências, apontar bugs e definir se a Sessão 02 está pronta para avançar para a Sessão 03 — Preparo Deploy Produção/Staging.

---

# 3. Estrutura DDAD Obrigatória

Este bloco deve seguir o ciclo DDAD:

```txt
1. Pré-análise
2. Preparação do ambiente
3. Execução do roteiro ponta a ponta
4. Registro de evidências
5. Registro/correção de bugs críticos
6. Relatório final
7. Commit semântico
8. Feedback final em Markdown
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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_12_teste_ponta_a_ponta.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_12_teste_ponta_a_ponta.md
```

O relatório final do teste deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/relatorio_teste_ponta_a_ponta.md
```

Caso sejam encontrados bugs, registrar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
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
[ ] Bloco 11 concluído
[ ] Backend local funcionando em http://127.0.0.1:8000
[ ] Frontend local funcionando em http://localhost:3000
[ ] NEXT_PUBLIC_USE_MOCKS=false configurado para o teste real
[ ] NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
[ ] CORS funcionando
[ ] Banco PostgreSQL local funcionando
[ ] Migrations aplicadas
[ ] Seed demo executado, se necessário
[ ] /health retorna HTTP 200
[ ] Wallet real disponível para teste
[ ] Perfis necessários existem no backend
```

Se qualquer premissa crítica falhar, registrar como bug e avaliar se o teste pode prosseguir parcialmente.

---

# 6. Escopo Permitido

Neste bloco você pode:

```txt
- executar validações completas do fluxo local;
- criar roteiro de teste manual;
- criar relatório final de teste;
- registrar evidências textuais;
- registrar prints/caminhos de evidência, se houver;
- corrigir bugs críticos pequenos encontrados durante o teste;
- registrar bugs não corrigidos em bugs_sessao_02.md;
- validar 401;
- validar 403;
- validar mock mode;
- validar blockchain indisponível;
- validar fluxo principal em modo API real;
- consolidar conclusão da Sessão 02.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- iniciar deploy;
- implementar features novas fora do teste;
- alterar regra de negócio ampla;
- criar migrations sem necessidade;
- habilitar blockchain real;
- remover mock mode;
- mascarar bug crítico como sucesso;
- inventar evidência não executada;
- commitar .env real, JWT, private key, mnemonic ou segredo.
```

Se algo não puder ser testado, documentar claramente.

---

# 8. Preparação do Ambiente

Executar ou validar:

```txt
docker compose config
docker compose up -d --build
docker compose ps
GET http://127.0.0.1:8000/health
npm run lint
npm run build
npm run dev
```

Validar variáveis:

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
```

Validar backend:

```env
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
```

Não expor valores reais sensíveis no relatório.

---

# 9. Roteiro Obrigatório de Teste Ponta a Ponta

Executar o fluxo completo abaixo.

## 9.1 Subir backend

Validar:

```txt
[ ] Backend sobe sem erro crítico
[ ] Banco está healthy
[ ] Migrations estão aplicadas
[ ] Seed demo disponível, se necessário
[ ] /health retorna HTTP 200
```

---

## 9.2 Subir frontend

Validar:

```txt
[ ] Frontend sobe em http://localhost:3000
[ ] Build passa
[ ] Lint passa
[ ] Console não apresenta erro crítico inicial
[ ] NEXT_PUBLIC_USE_MOCKS=false está ativo
```

---

## 9.3 Login real

Executar:

```txt
[ ] Conectar wallet
[ ] Ler address real
[ ] Solicitar nonce
[ ] Assinar mensagem
[ ] Enviar assinatura para /auth/verify
[ ] Receber JWT
[ ] Guardar JWT na auth store/session
[ ] Enviar Authorization Bearer
[ ] Carregar /auth/me
[ ] Exibir profile real
[ ] Exibir role real
[ ] Exibir wallet real
```

Critério:

```txt
Login real deve funcionar sem fallback silencioso para perfil demo.
```

---

## 9.4 Testar /auth/me

Validar:

```txt
[ ] /auth/me funciona com token válido
[ ] /auth/me falha com token ausente
[ ] /auth/me falha com token inválido
[ ] Sessão é limpa ou erro é exibido quando token inválido
```

---

## 9.5 Listar contratos reais

Validar:

```txt
[ ] GET /contracts funciona com token válido
[ ] Lista real aparece na UI
[ ] Empty state funciona se não houver contratos
[ ] Loading state funciona
[ ] Error state funciona
```

---

## 9.6 Criar contrato real

Validar:

```txt
[ ] Formulário envia payload correto
[ ] POST /contracts funciona com token válido
[ ] Erros de validação aparecem corretamente
[ ] Após criação, contrato aparece na listagem ou detalhe
[ ] Role sem permissão recebe 403, se aplicável
```

---

## 9.7 Detalhe do contrato real

Validar:

```txt
[ ] GET /contracts/{id} funciona
[ ] Dados reais aparecem corretamente
[ ] 404 é tratado para id inexistente
[ ] Loading e erro funcionam
```

---

## 9.8 Actions reais

Executar e validar, conforme status adequado do contrato:

```txt
[ ] Confirmar envio
[ ] Confirmar entrega
[ ] Validar recebimento
[ ] Autorizar pagamento
[ ] Abrir disputa
[ ] Simular fraude
```

Para cada action, validar:

```txt
[ ] Authorization Bearer enviado
[ ] Sucesso exibido
[ ] Contrato atualizado/recarregado
[ ] Erro de permissão tratado
[ ] Erro de status/regra tratado
```

Se não for possível executar todas em um único contrato, documentar motivo e quais ações foram testadas.

---

## 9.9 Timeline de contrato

Validar:

```txt
[ ] GET /contracts/{id}/events funciona
[ ] Eventos reais aparecem na timeline
[ ] Eventos aparecem em ordem correta
[ ] Timeline atualiza após actions
[ ] Empty state funciona
[ ] Erros 401/403/404 são tratados
```

---

## 9.10 Auditoria global

Validar:

```txt
[ ] GET /audit/events funciona com role permitida
[ ] Eventos reais aparecem na auditoria
[ ] Ordenação funciona
[ ] Empty state funciona
[ ] 401 é tratado
[ ] 403 é tratado para role sem permissão, se aplicável
```

---

## 9.11 Blockchain indisponível

Validar:

```txt
[ ] BLOCKCHAIN_ENABLED=false não quebra a aplicação
[ ] register-on-chain não simula sucesso em modo real
[ ] Botão/status blockchain informa recurso indisponível ou em preparação
[ ] Explorer só aparece com transactionHash real
[ ] Fluxo principal continua funcionando
```

---

## 9.12 Mock mode

Alterar para:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

Validar:

```txt
[ ] Modo demo continua funcionando
[ ] Profile demo funciona
[ ] Contratos mockados funcionam
[ ] Actions mockadas funcionam, se aplicável
[ ] Eventos/auditoria mockados funcionam, se aplicável
```

Depois, retornar para:

```txt
NEXT_PUBLIC_USE_MOCKS=false
```

se necessário.

---

# 10. Testes de Erro Obrigatórios

Validar ao menos:

```txt
[ ] 401 sem token
[ ] 401 com token inválido
[ ] 403 com role sem permissão
[ ] 404 contrato inexistente
[ ] Payload inválido em criação de contrato
[ ] Action em status inválido
[ ] Backend indisponível, se possível simular sem risco
```

Não precisa quebrar ambiente de forma destrutiva.

---

# 11. Registro de Evidências

Registrar no relatório:

```txt
- comandos executados;
- endpoints testados;
- status HTTP observados;
- telas/fluxos validados;
- bugs encontrados;
- bugs corrigidos;
- bugs pendentes;
- prints ou caminhos de evidência, se existirem;
- limitações do teste.
```

Não incluir:

```txt
- JWT completo;
- private key;
- seed phrase;
- mnemonic;
- .env real;
- credenciais;
- dados sensíveis.
```

---

# 12. Classificação de Resultado

Classificar o teste final como:

```txt
APROVADO
APROVADO COM RESSALVAS
REPROVADO
```

## 12.1 APROVADO

Usar se:

```txt
- login real funciona;
- JWT funciona;
- /auth/me funciona;
- contratos funcionam;
- actions principais funcionam;
- timeline/auditoria funcionam;
- 401/403 são tratados;
- blockchain indisponível não quebra;
- não existem bugs críticos.
```

## 12.2 APROVADO COM RESSALVAS

Usar se:

```txt
- fluxo principal funciona;
- existem bugs P2/P3 não bloqueantes;
- alguma action específica não pôde ser validada por falta de cenário;
- limitações estão documentadas.
```

## 12.3 REPROVADO

Usar se:

```txt
- login real não funciona;
- JWT não funciona;
- /auth/me não funciona;
- contratos reais não funcionam;
- actions reais quebram fluxo principal;
- erros críticos impedem uso da aplicação.
```

---

# 13. Classificação de Bugs

Registrar bugs em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

Classificar:

```txt
P1 — Bloqueante
P2 — Alta prioridade
P3 — Média prioridade
P4 — Baixa prioridade
```

Exemplos de P1:

```txt
- login real não funciona;
- JWT não é recebido;
- /auth/me falha com token válido;
- contratos reais não carregam;
- aplicação quebra em modo API real.
```

Exemplos de P2:

```txt
- action específica falha em cenário importante;
- auditoria não carrega para role permitida;
- 403 mal tratado em fluxo relevante;
- timeline não atualiza após action.
```

Exemplos de P3:

```txt
- mensagens pouco claras;
- loading inconsistente;
- warning no console sem impacto crítico;
- estado vazio incompleto.
```

Exemplos de P4:

```txt
- refinamento visual;
- padronização de labels;
- melhoria futura de UX;
- ajustes cosméticos.
```

---

# 14. Arquivo de Relatório Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/relatorio_teste_ponta_a_ponta.md
```

Estrutura obrigatória:

```md
# Relatório de Teste Ponta a Ponta — Sessão 02

## 1. Resumo Executivo

## 2. Resultado Final

Classificação:

```txt
APROVADO / APROVADO COM RESSALVAS / REPROVADO
```

## 3. Ambiente Testado

## 4. Variáveis de Ambiente Utilizadas

## 5. Comandos Executados

## 6. Fluxo de Autenticação

## 7. Validação de /auth/me

## 8. Validação de Contratos

## 9. Validação de Actions

## 10. Validação de Timeline

## 11. Validação de Auditoria

## 12. Validação de Blockchain Indisponível

## 13. Validação de Mock Mode

## 14. Testes de Erro 401/403/404

## 15. Evidências

## 16. Bugs Encontrados

## 17. Bugs Corrigidos

## 18. Bugs Pendentes

## 19. Riscos Restantes

## 20. Recomendação Final

## 21. Conclusão
```

---

# 15. Validações Obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
docker compose config
docker compose up -d --build
docker compose ps
GET http://127.0.0.1:8000/health
login com wallet
GET /auth/nonce
POST /auth/verify
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
teste de 401
teste de 403
teste de 404
teste de blockchain indisponível
teste de mock mode
```

Se algum comando/teste não puder ser executado, registrar:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 16. Critérios de Aceite

O Bloco 12 será considerado concluído quando:

```txt
[ ] Ambiente backend validado
[ ] Ambiente frontend validado
[ ] Login real testado
[ ] JWT testado
[ ] /auth/me testado
[ ] Contratos reais testados
[ ] Criação de contrato testada
[ ] Detalhe de contrato testado
[ ] Actions reais testadas ou limitações documentadas
[ ] Timeline testada
[ ] Auditoria testada
[ ] 401 testado
[ ] 403 testado
[ ] 404 testado
[ ] Blockchain indisponível testada
[ ] Mock mode testado
[ ] Bugs registrados
[ ] Relatório final criado em analises/
[ ] Resultado final classificado
[ ] Recomendação para Sessão 03 escrita
[ ] Commit semântico realizado
[ ] Feedback gerado na pasta Feedback
```

---

# 17. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
test: documentar teste ponta a ponta da integracao
```

Alternativas:

```txt
docs: gera relatorio final da sessao 02
```

```txt
test: valida fluxo completo frontend backend
```

Se forem corrigidos bugs críticos junto ao teste, usar commit separado para correção antes do commit do relatório, por exemplo:

```txt
fix: corrige falha no fluxo de autenticacao ponta a ponta
```

Depois:

```txt
test: documentar teste ponta a ponta da integracao
```

Não misturar muitas correções técnicas e relatório no mesmo commit se os ajustes forem relevantes.

---

# 18. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_12_teste_ponta_a_ponta.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 12: Teste Ponta a Ponta

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Ambiente testado

## 5. Fluxo de autenticação testado

## 6. Contratos testados

## 7. Actions testadas

## 8. Timeline e auditoria testadas

## 9. Blockchain indisponível testada

## 10. Mock mode testado

## 11. Testes de erro executados

## 12. Resultado final

## 13. Bugs encontrados

## 14. Bugs corrigidos

## 15. Bugs pendentes

## 16. Commit realizado

## 17. Recomendação para Sessão 03
```

---

# 19. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_12_teste_ponta_a_ponta.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/relatorio_teste_ponta_a_ponta.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_12_teste_ponta_a_ponta.md
```

Se houver bugs:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/bugs/bugs_sessao_02.md
```

---

# 20. Definição de Pronto da Sessão 02

A Sessão 02 só deve ser considerada pronta para avançar para a Sessão 03 quando:

```txt
[ ] Frontend e backend conversam localmente
[ ] Login real funciona
[ ] JWT funciona
[ ] Requests protegidas funcionam
[ ] /auth/me funciona
[ ] Perfil real é usado em modo API
[ ] Contratos reais funcionam
[ ] Actions reais funcionam
[ ] Timeline real funciona
[ ] Auditoria real funciona
[ ] Erros principais são tratados
[ ] Blockchain indisponível não quebra aplicação
[ ] Mock mode continua disponível
[ ] Relatório ponta a ponta foi criado
[ ] Não existem bugs P1
```

Se houver bugs P1, não avançar para Sessão 03.

---

# 21. Próximo Passo Após Este Bloco

Se o teste for:

```txt
APROVADO
```

ou:

```txt
APROVADO COM RESSALVAS sem P1
```

Então iniciar:

```txt
Sessão 03 — Preparo Deploy Produção/Staging
```

Se o teste for:

```txt
REPROVADO
```

ou houver P1, criar bloco corretivo antes da Sessão 03.

---

# 22. Conclusão

Este bloco encerra a Sessão 02.

O foco não é adicionar novas funcionalidades, mas validar se tudo que foi implementado realmente funciona em conjunto.

A decisão final deve ser clara:

```txt
Pode avançar para Sessão 03?
Sim / Não / Sim, com ressalvas
```
