# Bloco Extra — Correção de Pendências e Preparação da Sessão 02

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `bloco_extra_correcao_pendencias_pre_sessao_02`  
**Tipo:** Bloco corretivo/preparatório entre Sessão 01 e Sessão 02  
**Objetivo central:** resolver, organizar ou documentar as pendências P2, P3 e P4 identificadas ao final da Sessão 01, preparando o projeto para iniciar a Sessão 02 com menor risco técnico.

---

# 1. Objetivo do Bloco

Este bloco extra tem como objetivo tratar as pendências levantadas no fechamento da Sessão 01, principalmente aquelas que impactam diretamente o início da Sessão 02.

A Sessão 01 foi classificada como:

```txt
PARCIALMENTE PRONTO PARA INTEGRAÇÃO
```

Não existem pendências P1 bloqueantes, mas existem pontos P2, P3 e P4 que precisam ser organizados antes ou durante o início da Sessão 02.

Este bloco deve atuar como uma ponte entre:

```txt
Sessão 01 — Saneamento Backend/Frontend
↓
Sessão 02 — Integração Backend + Frontend
```

---

# 2. Contexto

Ao final do Bloco 08 da Sessão 01, foram identificadas pendências de alta, média e baixa prioridade.

As principais pendências P2 estão diretamente ligadas à autenticação real no frontend:

```txt
- auth wallet/JWT
- consumo de /auth/nonce e /auth/verify
- assinatura de mensagem
- persistência de JWT
- envio de Authorization Bearer
- validação de endpoints protegidos
- decisão sobre perfis demo duplicados
```

Esses itens são base obrigatória para a Sessão 02.

---

# 3. Escopo do Bloco Extra

Este bloco deve executar ou preparar os ajustes necessários para reduzir riscos antes de iniciar a Sessão 02.

## 3.1 Escopo permitido

```txt
- revisar pendências P2, P3 e P4;
- organizar plano de execução da autenticação real;
- preparar estrutura frontend para auth-api, sem integrar tudo de uma vez;
- decidir estratégia para perfis demo duplicados;
- padronizar comando oficial de seed;
- revisar documentação antiga com wallets truncadas/placeholders;
- investigar package-lock modificado sem diff;
- documentar vulnerabilidades npm;
- centralizar ou planejar centralização de wallets demo;
- criar relatório de pendências resolvidas e pendências migradas para Sessão 02.
```

## 3.2 Escopo proibido

```txt
- fazer deploy;
- integrar contracts/actions/audit antes da autenticação;
- alterar regras de negócio do backend sem justificativa;
- habilitar blockchain real;
- expor segredos reais;
- remover mocks sem estratégia de fallback;
- misturar correções não relacionadas no mesmo commit.
```

---

# 4. Pendências P2 — Alta Prioridade

As pendências P2 devem ser tratadas como prioridade máxima deste bloco.

## 4.1 Implementar auth wallet/JWT no frontend

### Objetivo

Preparar ou iniciar a estrutura de autenticação real no frontend.

### Ações esperadas

```txt
[ ] Verificar se já existe camada de auth no frontend
[ ] Verificar se já existe store/session de autenticação
[ ] Criar ou planejar auth-api
[ ] Preparar tipagens de nonce, verify, token e profile
[ ] Garantir que o fluxo não quebre o modo mock
```

### Observação

Caso este item seja grande demais para o bloco extra, ele deve ser migrado oficialmente para:

```txt
Sessão 02 — Bloco 01: Auth API no Frontend
```

---

## 4.2 Consumir `/auth/nonce` e `/auth/verify`

### Objetivo

Preparar a camada de API para autenticação.

### Ações esperadas

```txt
[ ] Mapear contrato real dos endpoints no backend
[ ] Confirmar payload de /auth/nonce
[ ] Confirmar payload de /auth/verify
[ ] Criar funções no frontend para chamar esses endpoints
[ ] Documentar erros esperados
```

Endpoints esperados:

```txt
GET /auth/nonce
POST /auth/verify
```

---

## 4.3 Assinar mensagem com wallet

### Objetivo

Preparar o frontend para assinatura de mensagem de nonce.

### Ações esperadas

```txt
[ ] Verificar stack atual de wallet
[ ] Definir se será usado wagmi, viem ou RainbowKit
[ ] Planejar assinatura de mensagem
[ ] Garantir compatibilidade com MetaMask
[ ] Documentar dependências necessárias
```

### Observação

A implementação real pode ficar para a Sessão 02, mas a decisão técnica deve ser documentada neste bloco.

---

## 4.4 Persistir JWT corretamente

### Objetivo

Definir como o token JWT será armazenado e invalidado no frontend.

### Ações esperadas

```txt
[ ] Definir auth store/session
[ ] Definir onde accessToken será salvo
[ ] Definir estratégia de logout
[ ] Definir tratamento para token expirado
[ ] Evitar armazenamento inseguro desnecessário
```

---

## 4.5 Enviar `Authorization: Bearer <token>`

### Objetivo

Preparar o HTTP client para enviar token em rotas protegidas.

### Ações esperadas

```txt
[ ] Revisar http-client atual
[ ] Adicionar ou planejar interceptor/header Authorization
[ ] Garantir que requests públicas não dependam de token
[ ] Garantir tratamento de 401/403
```

---

## 4.6 Validar endpoints protegidos com JWT real

### Objetivo

Planejar validação real de permissões no backend.

### Endpoints a validar futuramente

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

### Ações esperadas

```txt
[ ] Criar checklist de validação com JWT real
[ ] Mapear roles necessárias por endpoint
[ ] Validar status e wallet vinculada
[ ] Documentar quais endpoints serão integrados em cada bloco da Sessão 02
```

---

## 4.7 Decidir sobre os dois conjuntos de perfis demo

### Objetivo

Decidir se os perfis demo duplicados no frontend serão unificados ou mantidos separados.

### Situação atual

Existem conjuntos diferentes de perfis demo no frontend, com nomes divergentes por role, embora as wallets estejam alinhadas.

### Ações esperadas

```txt
[ ] Mapear os dois conjuntos de perfis demo
[ ] Identificar onde cada conjunto é usado
[ ] Decidir entre unificar ou manter separado
[ ] Se unificar, garantir que não quebre telas existentes
[ ] Se manter separado, documentar a finalidade de cada conjunto
```

### Resultado esperado

Uma decisão documentada:

```txt
DECISÃO: unificar perfis demo
```

ou:

```txt
DECISÃO: manter perfis separados com propósitos distintos
```

---

# 5. Pendências P3 — Média Prioridade

As pendências P3 não bloqueiam a Sessão 02, mas devem ser tratadas, documentadas ou migradas.

## 5.1 Padronizar comando oficial de seed

### Problema

O comando direto de seed falhou sem `PYTHONPATH`, mas funcionou via módulo.

### Ações esperadas

```txt
[ ] Definir comando oficial para seed
[ ] Atualizar README/backend se necessário
[ ] Atualizar documentação da Sessão 01 se necessário
```

Comando recomendado:

```bash
docker compose exec -T api python -m scripts.seed_demo_profiles
```

Alternativa documentada:

```bash
docker compose exec -T api sh -c "PYTHONPATH=/app python scripts/seed_demo_profiles.py"
```

---

## 5.2 Validar navegador real com `NEXT_PUBLIC_USE_MOCKS=false`

### Objetivo

Preparar validação real do frontend em modo API.

### Ações esperadas

```txt
[ ] Garantir variável NEXT_PUBLIC_USE_MOCKS=false documentada
[ ] Planejar teste manual no navegador
[ ] Verificar console limpo
[ ] Registrar erros esperados antes de JWT
```

---

## 5.3 Testar console limpo e telas de erro 401/403

### Ações esperadas

```txt
[ ] Acessar frontend local
[ ] Simular chamada protegida sem token
[ ] Verificar mensagem de 401
[ ] Simular role sem permissão
[ ] Verificar mensagem de 403
[ ] Documentar resultado
```

---

## 5.4 Mapear update/delete caso sejam expostos na UI

### Ações esperadas

```txt
[ ] Verificar se update/delete existem no backend
[ ] Verificar se update/delete aparecem no frontend
[ ] Se não aparecem, documentar como não aplicável
[ ] Se aparecem, mapear roles e riscos
```

---

## 5.5 Revisar documentos antigos com wallets truncadas/placeholders

### Ações esperadas

```txt
[ ] Localizar documentos antigos com exemplos de wallets inválidas
[ ] Decidir se devem ser corrigidos, arquivados ou marcados como histórico
[ ] Evitar alterar feedbacks históricos já fechados
```

---

## 5.6 Investigar processo externo ocupando `127.0.0.1:3000`

### Ações esperadas

```txt
[ ] Verificar se o processo interfere nos testes
[ ] Caso não interfira, documentar como não bloqueante
[ ] Caso interfira, orientar liberação da porta ou uso de localhost
```

---

## 5.7 Revisar vulnerabilidades npm reportadas no Bloco 01

### Ações esperadas

```txt
[ ] Executar npm audit
[ ] Identificar severidade real
[ ] Evitar npm audit fix --force sem análise
[ ] Documentar se há impacto imediato
```

---

# 6. Pendências P4 — Baixa Prioridade

As pendências P4 devem ser documentadas, e só devem ser corrigidas se forem simples e não gerarem risco.

## 6.1 Padronizar estrutura DDAD futura

### Ações esperadas

```txt
[ ] Verificar estrutura atual da Sessão 01
[ ] Decidir padrão oficial: Feedback ou feedback
[ ] Decidir padrão oficial: Blocos ou planejamento/blocos
[ ] Registrar decisão para próximas sessões
```

---

## 6.2 Investigar `web/package-lock.json` marcado como modificado

### Ações esperadas

```txt
[ ] Verificar git diff
[ ] Verificar diferenças de quebra de linha/metadados
[ ] Decidir se deve ser descartado ou commitado em bloco próprio
```

---

## 6.3 Centralizar wallets demo em uma única fonte

### Ações esperadas

```txt
[ ] Verificar duplicação de wallets demo
[ ] Avaliar criação de constante central
[ ] Evitar refatoração ampla se houver risco
[ ] Documentar como melhoria futura se não for feito agora
```

---

## 6.4 Revisar warnings locais do PostgreSQL

### Ações esperadas

```txt
[ ] Registrar warnings atuais como ambiente local
[ ] Não tratar como problema de produção ainda
[ ] Migrar revisão para Sessão 03 — Deploy Produção/Staging
```

---

# 7. Pontos de Atenção Antes da Sessão 02

A execução da Sessão 02 deve seguir a ordem abaixo.

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

Regra obrigatória:

```txt
Não iniciar integração de contratos, actions ou auditoria antes do fluxo auth/JWT estar funcional.
```

---

# 8. Arquivo de análise obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/pendencias_pre_sessao_02.md
```

Estrutura obrigatória:

```md
# Pendências Pré-Sessão 02

## 1. Resumo Executivo

## 2. Pendências P2

## 3. Pendências P3

## 4. Pendências P4

## 5. Itens Resolvidos Neste Bloco

## 6. Itens Migrados para Sessão 02

## 7. Itens Migrados para Sessão 03

## 8. Riscos Restantes

## 9. Recomendação Final
```

---

# 9. Validações obrigatórias

Executar ou tentar executar:

```txt
npm run lint
npm run build
docker compose config
docker compose up -d --build
GET /health
npm audit
git status
git diff -- web/package-lock.json
```

Se algum comando não puder ser executado, registrar:

```txt
Status: não executado
Motivo:
Impacto:
```

Não inventar resultado.

---

# 10. Critérios de Aceite

O bloco extra será considerado concluído quando:

```txt
[ ] Pendências P2 revisadas
[ ] Pendências P3 revisadas
[ ] Pendências P4 revisadas
[ ] Itens resolvidos documentados
[ ] Itens migrados para Sessão 02 documentados
[ ] Itens migrados para Sessão 03 documentados
[ ] Estratégia auth/JWT definida para início da Sessão 02
[ ] Decisão sobre perfis demo documentada
[ ] Comando oficial de seed definido
[ ] Validações executadas ou justificadas
[ ] Commit semântico realizado
[ ] Feedback do bloco gerado na pasta Feedback
```

---

# 11. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
chore: prepara pendencias para inicio da sessao 02
```

Alternativas:

```txt
docs: documenta pendencias pre sessao 02
```

```txt
chore: organiza transicao da sessao 01 para sessao 02
```

O commit deve conter somente alterações relacionadas a este bloco extra.

---

# 12. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_extra_pendencias_pre_sessao_02.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco Extra: Pendências Pré-Sessão 02

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Pendências P2 analisadas

## 5. Pendências P3 analisadas

## 6. Pendências P4 analisadas

## 7. Itens resolvidos

## 8. Itens migrados para Sessão 02

## 9. Itens migrados para Sessão 03

## 10. Validações executadas

## 11. Commit realizado

## 12. Observações finais
```

---

# 13. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/pendencias_pre_sessao_02.md

Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_extra_pendencias_pre_sessao_02.md
```

E deve haver um commit semântico registrando a conclusão do bloco.

---

# 14. Conclusão

Este bloco extra não substitui a Sessão 02.

Ele serve para organizar a transição e reduzir riscos antes de iniciar a integração real.

A Sessão 02 só deve avançar para contratos, actions e auditoria depois que o fluxo abaixo estiver funcional:

```txt
wallet → nonce → assinatura → verify → JWT → Authorization Bearer → /auth/me
```
