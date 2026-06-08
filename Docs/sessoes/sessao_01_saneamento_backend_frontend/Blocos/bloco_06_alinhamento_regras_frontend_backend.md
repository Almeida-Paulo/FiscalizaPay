# Bloco 06 — Alinhamento de Regras Frontend/Backend

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `bloco_06_alinhamento_regras_frontend_backend`  
**Objetivo:** alinhar as permissões, papéis, regras de negócio e comportamentos visuais do frontend com as regras reais existentes no backend.

---

# 1. Objetivo do Bloco

O objetivo deste bloco é garantir que o frontend não apresente ao usuário ações que o backend não permite executar.

Atualmente, o frontend pode estar funcionando de forma visual/demo, enquanto o backend já possui regras reais de permissão por perfil, autenticação e ações protegidas.

Este bloco deve revisar e alinhar:

```txt
- Perfis disponíveis no backend
- Perfis usados no frontend
- Ações permitidas por papel
- Botões exibidos no frontend
- Mensagens de bloqueio/permissão
- Tratamento de respostas 401/403
- Regras visuais em modo mock e modo API real
```

---

# 2. Contexto Técnico

A Sessão 01 tem como foco preparar backend e frontend para integração real.

Antes de integrar as APIs, é necessário garantir que o frontend esteja coerente com as regras do backend.

Exemplo de problema que este bloco deve evitar:

```txt
O frontend exibe o botão "Simular Fraude" para um perfil COMPRADOR,
mas o backend só permite essa ação para GESTOR, FISCAL ou AUDITOR.
```

Esse tipo de divergência gera:

```txt
- erro 403 no backend
- experiência ruim no frontend
- inconsistência na demonstração
- falsa impressão de bug
- dificuldade na integração da Sessão 02
```

---

# 3. Pré-análise Obrigatória

Antes de alterar código, o executor deve analisar os pontos abaixo.

## 3.1 Backend

Verificar onde estão definidas as regras de permissão do backend.

Procurar por arquivos ou estruturas como:

```txt
- ACTION_ROLES
- roles
- permissions
- auth
- dependencies
- services de contrato
- rotas protegidas
- validações de perfil
```

Mapear quais perfis existem no backend.

Exemplo esperado:

```txt
GESTOR
FISCAL
AUDITOR
FORNECEDOR
COMPRADOR
TRANSPORTADOR
```

A lista real deve ser confirmada no código.

---

## 3.2 Frontend

Verificar onde o frontend define ou simula:

```txt
- perfis demo
- roles de usuário
- botões de ação
- cards de contrato
- menus de ações
- permissões visuais
- dados mockados
```

Procurar por arquivos como:

```txt
src/constants/
src/mocks/
src/data/
src/services/
src/hooks/
src/components/
src/pages/
src/features/
```

A estrutura real do projeto deve ser respeitada.

---

## 3.3 Documentação

Verificar se existe documentação anterior descrevendo:

```txt
- papéis do sistema
- fluxo dos contratos
- ações por perfil
- regras de negócio
- matriz de permissões
```

Caso a documentação esteja divergente do backend, a prioridade técnica deve ser:

```txt
1. Backend real
2. Documentação técnica validada
3. Frontend
4. Mock/demo
```

---

# 4. Regras Base a Conferir

Durante este bloco, conferir especialmente as permissões abaixo.

## 4.1 Ações críticas

As ações críticas citadas no planejamento geral são:

```txt
open_dispute: GESTOR, FISCAL, AUDITOR
simulate_fraud: GESTOR, FISCAL, AUDITOR
```

Essas regras devem ser confirmadas no backend antes da implementação.

---

## 4.2 Ações operacionais

Também devem ser conferidas as ações operacionais do fluxo principal:

```txt
confirm-shipment
confirm-delivery
validate-receipt
authorize-payment
open-dispute
simulate-fraud
register-on-chain
```

Para cada ação, identificar:

```txt
- Quem pode executar
- Em qual status do contrato a ação fica disponível
- Qual endpoint é chamado
- Qual resposta de erro pode ocorrer
- Qual comportamento visual o frontend deve ter
```

---

# 5. Entregáveis do Bloco

Ao final do bloco, devem existir os seguintes entregáveis:

```txt
- matriz de regras frontend/backend validada
- frontend ajustado para exibir ações conforme role
- frontend preparado para tratar permissões reais
- mensagens de acesso negado revisadas
- modo mock preservado
- documentação do bloco atualizada
- commit semântico realizado
- feedback final gerado em Markdown
```

---

# 6. Implementação Planejada

## 6.1 Criar ou revisar matriz de permissões

Criar ou revisar uma matriz simples contendo:

```txt
Ação | Endpoint | Perfis permitidos | Status necessário | Observação
```

Arquivo sugerido:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/matriz_regras_frontend_backend.md
```

Caso já exista arquivo semelhante, atualizar o existente ao invés de duplicar.

---

## 6.2 Centralizar regras no frontend

Evitar regras espalhadas diretamente nos componentes.

Se possível, criar ou revisar um arquivo central de permissões.

Sugestões de nomes:

```txt
src/constants/permissions.ts
src/lib/permissions.ts
src/utils/permissions.ts
src/features/contracts/permissions.ts
```

A escolha deve respeitar a arquitetura já existente.

Exemplo conceitual:

```ts
const ACTION_ROLES = {
  open_dispute: ['GESTOR', 'FISCAL', 'AUDITOR'],
  simulate_fraud: ['GESTOR', 'FISCAL', 'AUDITOR'],
}
```

Não copiar esse exemplo cegamente. O executor deve adaptar aos nomes reais usados no projeto.

---

## 6.3 Ajustar exibição de botões por perfil

Os botões de ação do frontend devem aparecer apenas quando:

```txt
- o perfil atual tiver permissão
- o status do contrato permitir a ação
- o modo atual do sistema permitir a ação
```

Caso o botão precise aparecer desabilitado por decisão de UX, deve existir mensagem clara explicando o motivo.

Exemplo:

```txt
Ação disponível apenas para Gestor, Fiscal ou Auditor.
```

---

## 6.4 Ajustar tratamento de erro 401/403

O frontend deve estar preparado para respostas protegidas do backend.

Tratamento esperado:

```txt
401 Unauthorized:
- usuário não autenticado
- token ausente
- token expirado
- solicitar novo login

403 Forbidden:
- usuário autenticado, mas sem permissão
- exibir mensagem amigável
- não quebrar a tela
```

Neste bloco, a integração real ainda não precisa estar completa, mas o frontend deve estar preparado para esse comportamento.

---

## 6.5 Preservar modo mock/demo

O modo mock deve continuar funcionando para apresentação visual.

Porém, ele não pode mascarar regras falsas.

Quando o projeto estiver em modo mock:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

O frontend pode usar dados simulados, mas deve respeitar a mesma matriz de permissões do backend.

Quando estiver em modo API real:

```txt
NEXT_PUBLIC_USE_MOCKS=false
```

O frontend deve usar as regras reais associadas ao perfil autenticado.

---

## 6.6 Revisar nomenclaturas de papéis

Padronizar nomes usados no frontend e backend.

Evitar divergências como:

```txt
manager vs GESTOR
auditor vs AUDITOR
fiscal_user vs FISCAL
buyer vs COMPRADOR
seller vs FORNECEDOR
```

Se houver tradução visual para o usuário, separar:

```txt
valor técnico: GESTOR
label visual: Gestor
```

---

## 6.7 Revisar mensagens user-facing

As mensagens exibidas ao usuário devem ser claras e profissionais.

Exemplos:

```txt
Você não tem permissão para executar esta ação.
Esta ação está disponível apenas para Gestor, Fiscal ou Auditor.
Faça login com uma carteira autorizada para continuar.
A ação não está disponível no status atual do contrato.
```

Evitar mensagens técnicas demais, como:

```txt
403 forbidden
role not allowed
invalid permission
```

---

# 7. Validações Obrigatórias

Após a implementação, validar:

```txt
[ ] Todos os perfis usados no frontend existem no backend
[ ] Todas as ações críticas foram mapeadas
[ ] open_dispute respeita os perfis corretos
[ ] simulate_fraud respeita os perfis corretos
[ ] Botões não aparecem indevidamente para perfis sem permissão
[ ] Mensagens de permissão foram revisadas
[ ] Tratamento de 401/403 não quebra a interface
[ ] Modo mock continua funcionando
[ ] Modo API real fica preparado para a Sessão 02
[ ] Matriz de regras foi criada ou atualizada
```

---

# 8. Testes Recomendados

Executar testes manuais simulando perfis diferentes.

## 8.1 Perfil Gestor

Validar:

```txt
[ ] Visualiza ações administrativas
[ ] Pode abrir disputa, se o backend permitir
[ ] Pode simular fraude, se o backend permitir
```

## 8.2 Perfil Fiscal

Validar:

```txt
[ ] Visualiza ações de fiscalização
[ ] Pode abrir disputa, se o backend permitir
[ ] Pode simular fraude, se o backend permitir
```

## 8.3 Perfil Auditor

Validar:

```txt
[ ] Visualiza ações de auditoria
[ ] Pode acessar auditoria
[ ] Pode executar ações críticas, se o backend permitir
```

## 8.4 Perfis operacionais

Validar:

```txt
[ ] Fornecedor não vê ações críticas indevidas
[ ] Comprador não vê ações críticas indevidas
[ ] Transportador não vê ações críticas indevidas
[ ] Cada perfil visualiza somente o que faz sentido para seu papel
```

---

# 9. Critérios de Aceite

O bloco será considerado concluído quando:

```txt
[ ] A matriz de permissões frontend/backend estiver documentada
[ ] As permissões reais do backend forem refletidas no frontend
[ ] Botões e ações forem exibidos de acordo com role/status
[ ] Mensagens de acesso negado estiverem amigáveis
[ ] Erros 401/403 estiverem previstos no frontend
[ ] Modo mock estiver preservado
[ ] Nenhuma regra crítica estiver hardcoded de forma desorganizada
[ ] O projeto continuar executando sem erros
[ ] O commit semântico for realizado
[ ] O feedback final em Markdown for criado na pasta Feedback
```

---

# 10. Commit Obrigatório ao Final do Bloco

Ao concluir o bloco, realizar um commit semântico.

Sugestão de commit:

```bash
git add .
git commit -m "fix: alinhar regras frontend e backend da sessao 01"
```

Caso o bloco tenha criado uma matriz de permissões e ajustes estruturais, também pode ser usado:

```bash
git commit -m "docs: mapear regras frontend backend da sessao 01"
```

Usar apenas um commit final se tudo fizer parte do mesmo fechamento do bloco.

---

# 11. Feedback Obrigatório do Bloco

Após o commit, gerar um arquivo `.md` de feedback do bloco.

O arquivo deve ser salvo em:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/
```

Nome sugerido:

```txt
feedback_bloco_06_alinhamento_regras_frontend_backend.md
```

## 11.1 Estrutura mínima do feedback

O feedback deve conter:

```txt
# Feedback — Bloco 06 — Alinhamento de Regras Frontend/Backend

## 1. Resumo do que foi feito

## 2. Arquivos alterados

## 3. Regras mapeadas

## 4. Ajustes realizados no frontend

## 5. Ajustes realizados na documentação

## 6. Validações executadas

## 7. Problemas encontrados

## 8. Pendências

## 9. Commit realizado
```

---

# 12. Observações Importantes

Este bloco não deve implementar ainda a integração completa com autenticação real por wallet.

A integração real será tratada na Sessão 02.

Neste momento, o foco é:

```txt
alinhar regra visual + regra backend + documentação
```

Também não é recomendado criar novas regras de negócio sem confirmar se elas existem no backend.

Se alguma regra estiver ausente ou confusa, documentar como pendência no feedback.

---

# 13. Definição de Pronto

O Bloco 06 estará pronto quando o frontend estiver coerente com as regras reais do backend e quando houver documentação suficiente para a Sessão 02 realizar a integração com menor risco.

Checklist final:

```txt
[ ] Backend analisado
[ ] Frontend analisado
[ ] Regras mapeadas
[ ] Matriz criada/atualizada
[ ] Frontend ajustado
[ ] Mock mode preservado
[ ] Mensagens revisadas
[ ] 401/403 previstos
[ ] Validações realizadas
[ ] Commit realizado
[ ] Feedback criado em Markdown na pasta Feedback
```
