# Bloco 08 — Integrar Contratos Reais

## Sessão 02 — Integração Backend + Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_02_integrar_back_e_front`  
**Bloco:** `bloco_08_integrar_contratos_reais`  
**Tipo:** Integração de contratos reais com API backend  
**Objetivo central:** integrar o frontend aos endpoints reais de contratos do backend, substituindo dados mockados por dados reais quando `NEXT_PUBLIC_USE_MOCKS=false`.

---

# 1. Objetivo do Bloco

Integrar o frontend aos endpoints reais de contratos do backend:

```txt
GET /contracts
POST /contracts
GET /contracts/{id}
```

Ao final deste bloco, o frontend deve conseguir:

```txt
1. Listar contratos reais da API
2. Criar contrato real no backend
3. Buscar detalhes de contrato real
4. Enviar Authorization Bearer nas requests protegidas
5. Usar profile real autenticado em modo API
6. Mapear campos do backend para a UI
7. Tratar loading, empty state e erros
8. Preservar mock mode quando NEXT_PUBLIC_USE_MOCKS=true
```

Este bloco não deve integrar actions reais ainda.

As ações de contrato serão tratadas no próximo bloco:

```txt
Bloco 09 — Integrar Actions Reais
```

---

# 2. Contexto da Sessão 02

Os blocos anteriores prepararam a base de autenticação real:

```txt
Bloco 01 — Auth API no Frontend
Bloco 02 — Wallet Real + Assinatura
Bloco 03 — Verify + JWT
Bloco 04 — Auth Store/Session
Bloco 05 — Authorization Bearer no HTTP Client
Bloco 06 — Integração /auth/me
Bloco 07 — Substituir Perfil Demo em Modo API Real
```

Agora o frontend já deve estar autenticado em modo API real e pronto para consumir recursos protegidos.

A partir deste bloco, começa a integração funcional do domínio principal do sistema:

```txt
contratos reais
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
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_08_integrar_contratos_reais.md
```

O feedback deste bloco deve ser salvo em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_08_integrar_contratos_reais.md
```

Caso seja criada análise técnica, salvar em:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_contratos_reais.md
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
[ ] Auth real funciona
[ ] JWT está disponível na auth store/session
[ ] Authorization Bearer é enviado pelo HTTP client
[ ] /auth/me carrega profile real
[ ] Em mocks=false, profile real é usado
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
- criar ou ajustar camada contracts-api/contractsService;
- integrar GET /contracts;
- integrar POST /contracts;
- integrar GET /contracts/{id};
- ajustar tipagens de contrato;
- mapear response do backend para modelo usado pela UI;
- ajustar listagem de contratos;
- ajustar tela de criação de contrato;
- ajustar tela de detalhes de contrato;
- usar Authorization Bearer;
- tratar loading states;
- tratar empty states;
- tratar error states;
- tratar 401 e 403;
- preservar mocks quando NEXT_PUBLIC_USE_MOCKS=true;
- documentar contrato da API de contratos.
```

---

# 7. Escopo Proibido

Neste bloco você não deve:

```txt
- integrar actions reais;
- confirmar envio;
- confirmar entrega;
- validar recebimento;
- autorizar pagamento;
- abrir disputa;
- simular fraude;
- integrar timeline/eventos reais;
- integrar auditoria global;
- habilitar blockchain real;
- alterar regras de negócio do backend;
- criar migrations sem necessidade;
- remover mock mode;
- fazer deploy;
- expor JWT em logs permanentes.
```

Actions reais serão tratadas no:

```txt
Bloco 09 — Integrar Actions Reais
```

Timeline, eventos e auditoria serão tratados no:

```txt
Bloco 10 — Integrar Eventos, Timeline e Auditoria
```

---

# 8. Pré-Análise Obrigatória

Antes de implementar, analisar:

```txt
- services atuais de contratos;
- mocks de contratos;
- tipos de contrato no frontend;
- models/schemas de contrato no backend;
- rotas reais de contrato no backend;
- campos exigidos em POST /contracts;
- campos retornados em GET /contracts;
- campos retornados em GET /contracts/{id};
- componentes de listagem;
- componentes de criação;
- componentes de detalhe;
- estados atuais de loading/erro/vazio;
- uso de NEXT_PUBLIC_USE_MOCKS;
- uso do profile real;
- uso do Authorization Bearer;
- tratamento atual de 401/403.
```

Procurar por termos como:

```txt
contractsService
contractsApi
mockContracts
Contract
ContractStatus
CreateContract
contractId
supplier
buyer
documentHash
amount
status
```

---

# 9. Endpoints a Integrar

## 9.1 `GET /contracts`

### Objetivo

Listar contratos reais disponíveis para o perfil autenticado.

### Validar no backend

Mapear:

```txt
- path real;
- query params suportados;
- paginação, se houver;
- filtros, se houver;
- response real;
- necessidade de Authorization Bearer;
- regras de visibilidade por role.
```

### Resultado esperado no frontend

```txt
- contratos reais aparecem na listagem;
- empty state aparece quando não há contratos;
- erro aparece quando a API falha;
- loading aparece durante carregamento;
- mockContracts continuam funcionando em mocks=true.
```

---

## 9.2 `POST /contracts`

### Objetivo

Criar contrato real no backend.

### Validar no backend

Mapear payload real exigido.

Possíveis campos:

```txt
title
description
supplierWallet
buyerWallet
amount
currency
documentHash
dueDate
metadata
```

Não inventar payload. Usar schema real do backend.

### Resultado esperado no frontend

```txt
- formulário cria contrato real;
- submit envia dados no formato correto;
- sucesso redireciona ou atualiza UI;
- erro de validação é exibido claramente;
- 403 é exibido se role não puder criar contrato;
- mock mode preservado.
```

---

## 9.3 `GET /contracts/{id}`

### Objetivo

Buscar detalhes reais de um contrato específico.

### Validar no backend

Mapear:

```txt
- nome do parâmetro;
- formato do id;
- response real;
- status codes de erro;
- permissão necessária.
```

### Resultado esperado no frontend

```txt
- página de detalhe carrega contrato real;
- campos são exibidos corretamente;
- loading, erro e contrato não encontrado são tratados;
- mock detail continua funcionando em mocks=true.
```

---

# 10. Tipagens Esperadas

Criar ou ajustar tipagens conforme o contrato real.

Exemplo conceitual:

```ts
export type ContractStatus =
  | 'CRIADO'
  | 'ENVIO_CONFIRMADO'
  | 'ENTREGA_CONFIRMADA'
  | 'RECEBIMENTO_VALIDADO'
  | 'PAGAMENTO_AUTORIZADO'
  | 'DISPUTA'
  | 'FRAUDE_SUSPEITA';

export type Contract = {
  id: string;
  title: string;
  description?: string;
  status: ContractStatus;
  supplierWallet?: string;
  buyerWallet?: string;
  amount?: number;
  currency?: string;
  documentHash?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateContractRequest = {
  title: string;
  description?: string;
  supplierWallet?: string;
  buyerWallet?: string;
  amount?: number;
  currency?: string;
  documentHash?: string;
};
```

Atenção:

```txt
Esses tipos são apenas sugestivos.
O executor deve ajustar ao schema real do backend.
```

---

# 11. Mapeamento Backend → Frontend

Criar ou ajustar função de mapper se o backend retornar campos em padrão diferente da UI.

Exemplos de diferença:

```txt
wallet_address → walletAddress
created_at → createdAt
updated_at → updatedAt
supplier_wallet → supplierWallet
document_hash → documentHash
```

Regra:

```txt
- o backend é fonte da verdade;
- a UI pode usar modelo adaptado;
- o mapper deve ser claro e centralizado;
- evitar transformação espalhada em vários componentes.
```

---

# 12. Tratamento de Estados

Cada tela integrada deve tratar:

```txt
loading
empty
success
error
unauthorized
forbidden
not found
validation error
```

## 12.1 Loading

Exibir carregamento enquanto a request está pendente.

## 12.2 Empty

Se `GET /contracts` retornar lista vazia:

```txt
Nenhum contrato encontrado.
```

## 12.3 Error

Se API falhar:

```txt
Não foi possível carregar os contratos.
```

## 12.4 Unauthorized — 401

```txt
Sessão expirada. Faça login novamente.
```

## 12.5 Forbidden — 403

```txt
Você não tem permissão para acessar ou criar contratos.
```

## 12.6 Not Found — 404

```txt
Contrato não encontrado.
```

---

# 13. Preservação do Mock Mode

Validar:

```txt
[ ] NEXT_PUBLIC_USE_MOCKS=true continua usando mockContracts
[ ] NEXT_PUBLIC_USE_MOCKS=true permite demo local
[ ] NEXT_PUBLIC_USE_MOCKS=false usa API real
[ ] Não existe mistura de contratos mock com contratos reais
[ ] Não existe fallback silencioso para mock em caso de erro real
```

Regra importante:

```txt
Se mocks=false e a API falhar, exibir erro.
Não cair automaticamente para contratos mockados.
```

---

# 14. Segurança

Cuidados obrigatórios:

```txt
[ ] JWT não aparece em logs permanentes
[ ] JWT não aparece em feedback
[ ] Erros não expõem stack trace ao usuário
[ ] Dados sensíveis não são commitados
[ ] .env real não entra no commit
```

---

# 15. Arquivo de Análise Obrigatório

Criar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_contratos_reais.md
```

Caso a pasta `analises/` não exista, criar.

Estrutura obrigatória:

```md
# Integração de Contratos Reais — Bloco 08

## 1. Resumo Executivo

## 2. Arquivos Analisados

## 3. Endpoints Integrados

## 4. Contrato do GET /contracts

## 5. Contrato do POST /contracts

## 6. Contrato do GET /contracts/{id}

## 7. Tipagens Criadas ou Ajustadas

## 8. Mapeamento Backend para Frontend

## 9. Telas/Componentes Ajustados

## 10. Tratamento de Loading/Empty/Error

## 11. Tratamento de 401/403/404

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
login com wallet até /auth/me
GET /contracts com token válido
GET /contracts sem token
GET /contracts com token inválido
POST /contracts com token válido e payload válido
POST /contracts com payload inválido controlado
POST /contracts com role sem permissão, se possível
GET /contracts/{id} com id válido
GET /contracts/{id} com id inexistente
validar UI com NEXT_PUBLIC_USE_MOCKS=false
validar UI com NEXT_PUBLIC_USE_MOCKS=true
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

O Bloco 08 será considerado concluído quando:

```txt
[ ] Contrato real de GET /contracts foi mapeado
[ ] Contrato real de POST /contracts foi mapeado
[ ] Contrato real de GET /contracts/{id} foi mapeado
[ ] Contracts API/service foi criado ou ajustado
[ ] Listagem de contratos reais funciona em mocks=false
[ ] Criação de contrato real funciona em mocks=false
[ ] Detalhe de contrato real funciona em mocks=false
[ ] Authorization Bearer é enviado
[ ] Loading state funciona
[ ] Empty state funciona
[ ] Error state funciona
[ ] 401 é tratado
[ ] 403 é tratado
[ ] 404 é tratado
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

# 18. Commit Obrigatório

Ao finalizar este bloco, realizar um commit semântico.

Sugestão principal:

```txt
feat: integrar contratos reais com backend
```

Alternativas:

```txt
feat: conecta listagem e criacao de contratos na api
```

```txt
chore: documenta integracao de contratos reais
```

O commit deve conter somente alterações relacionadas ao Bloco 08.

Não misturar actions, timeline, auditoria ou blockchain.

---

# 19. Feedback Obrigatório

Após finalizar o bloco e realizar o commit, gerar o arquivo:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_08_integrar_contratos_reais.md
```

Estrutura obrigatória:

```md
# Feedback — Bloco 08: Integrar Contratos Reais

## 1. Resumo do que foi feito

## 2. Arquivos criados

## 3. Arquivos alterados

## 4. Endpoints integrados

## 5. Contratos reais listados

## 6. Criação de contrato real

## 7. Detalhe de contrato real

## 8. Tipagens e mapeamentos

## 9. Tratamento de estados e erros

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
- integrar actions reais;
- atualizar status de contrato após actions;
- integrar timeline/eventos reais;
- integrar auditoria global;
- tratar blockchain indisponível;
- executar teste ponta a ponta.
```

Esses itens pertencem aos próximos blocos e não devem ser tratados como falha do Bloco 08.

---

# 21. Resultado Esperado

Ao final deste bloco, devem existir:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_08_integrar_contratos_reais.md

Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_contratos_reais.md

Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_08_integrar_contratos_reais.md
```

E no frontend deve existir integração funcional com contratos reais do backend em modo API.

---

# 22. Próximo Bloco

Após a conclusão deste bloco, seguir para:

```txt
Bloco 09 — Integrar Actions Reais
```

Esse próximo bloco deve integrar os endpoints de actions reais de contrato:

```txt
confirm-shipment
confirm-delivery
validate-receipt
authorize-payment
open-dispute
simulate-fraud
```
