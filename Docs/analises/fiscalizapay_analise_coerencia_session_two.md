# FiscalizaPay Web3 — Plano Final para Projeto 10/10 Antes da Implementação

## 1. Objetivo deste documento

Este documento define tudo que o **Claude Code** precisa analisar, complementar, padronizar e documentar para elevar o projeto **FiscalizaPay Web3** ao nível **10/10 de prontidão para implementação**.

Após a sessão anterior de coerência, o projeto evoluiu para o seguinte nível:

```txt
Coerência da ideia: 9.5/10
Coerência da solução: 9.5/10
Coerência do fluxo de negócio: 9.5/10
Coerência da arquitetura geral: 9/10
Coerência frontend/backend: 8.5/10
Coerência de nomenclatura técnica: 9/10
Prontidão para implementação: 8.5/10
```

O objetivo agora é transformar essas notas em:

```txt
Coerência da ideia: 10/10
Coerência da solução: 10/10
Coerência do fluxo de negócio: 10/10
Coerência da arquitetura geral: 10/10
Coerência frontend/backend: 10/10
Coerência de nomenclatura técnica: 10/10
Prontidão para implementação: 10/10
```

Este arquivo deve ser usado como base para uma nova sessão do Claude Code antes de iniciar a implementação real.

---

## 2. Diagnóstico atual

O projeto já está forte em:

- visão de produto;
- problema;
- solução;
- narrativa;
- stack frontend;
- arquitetura frontend;
- divisão de equipe;
- fluxo principal;
- status oficiais;
- roles oficiais;
- endpoints oficiais;
- separação frontend/backend/blockchain;
- uso de blockchain como camada de prova;
- planejamento de MVP.

Porém, ainda existem lacunas importantes que impedem a implementação de começar com segurança total.

As lacunas principais são:

```txt
1. Contrato de API ainda não detalhado.
2. Payloads dos endpoints ainda não definidos.
3. Responses e erros ainda não padronizados.
4. DTOs e schemas ainda não definidos.
5. Banco de dados ainda precisa de modelagem final.
6. Decisão Prisma vs Supabase Client ainda pendente.
7. Testnet oficial ainda não escolhida.
8. Nível de autenticação Web3 do MVP ainda não fechado.
9. Paleta oficial ainda possui pequena divergência.
10. Endpoint POST /contracts/:id/events ainda precisa de decisão.
11. Critérios de aceite técnicos ainda precisam ser mais objetivos.
12. Sequência de implementação por blocos ainda precisa ser operacional.
13. Mocks do frontend precisam seguir contrato oficial.
14. Fluxos de erro precisam estar documentados.
15. Estados de tela precisam ser definidos.
```

---

## 3. Meta final da próxima sessão

A próxima sessão com o Claude Code deve produzir e/ou atualizar documentos para deixar o projeto pronto para desenvolvimento real.

A meta é que, ao final da sessão, exista clareza total sobre:

- o que o frontend deve consumir;
- o que o backend deve retornar;
- como os dados serão nomeados;
- quais são os payloads;
- quais são os erros esperados;
- quais são os campos obrigatórios e opcionais;
- quais endpoints existem;
- quais endpoints foram descartados;
- como os mocks devem ser montados;
- como a timeline deve se comportar;
- como a disputa deve funcionar;
- como a simulação de fraude deve funcionar;
- qual testnet será usada;
- qual paleta oficial será usada;
- qual ORM/client será usado no backend;
- como medir se o MVP está pronto.

---

## 4. O que falta para Coerência da Ideia chegar a 10/10

### Nota atual

```txt
Coerência da ideia: 9.5/10
```

### Por que ainda não é 10/10

A ideia está muito clara, mas ainda pode ser melhor blindada contra expansão indevida do escopo.

O projeto possui várias possibilidades futuras, como:

- score de fornecedor;
- auditoria avançada;
- relatórios PDF;
- upload real de documentos;
- autenticação Web3 completa;
- painel analítico;
- exportação de evidências;
- integração com sistemas públicos.

Essas ideias são boas, mas podem confundir o MVP se não forem classificadas corretamente.

### O que o Claude Code deve fazer

Criar ou atualizar uma seção chamada:

```txt
Escopo Oficial do MVP vs Pós-MVP
```

Essa seção deve separar:

#### MVP obrigatório

```txt
- Criar contrato
- Listar contratos
- Visualizar detalhe do contrato
- Confirmar envio
- Confirmar entrega
- Validar recebimento
- Autorizar pagamento
- Abrir disputa
- Simular fraude por hash
- Exibir timeline auditável
- Exibir documentHash
- Exibir transactionHash quando existir
- Conectar wallet visualmente
```

#### MVP diferencial

```txt
- Link para explorer
- Status visual por perfil
- Dashboard com métricas
- Feedbacks animados
- Mocks controlados
```

#### Pós-MVP

```txt
- Upload real de documentos
- Autenticação Web3 completa
- Relatórios PDF
- Auditoria avançada
- Score de fornecedor
- Integração com sistemas públicos
- Assinatura digital avançada
- Permissões institucionais complexas
```

### Critério para 10/10

A ideia chega a 10/10 quando todos os documentos deixam claro:

```txt
O MVP não tenta resolver tudo.
O MVP prova o fluxo central com qualidade.
O pós-MVP fica documentado sem atrapalhar a execução inicial.
```

---

## 5. O que falta para Coerência da Solução chegar a 10/10

### Nota atual

```txt
Coerência da solução: 9.5/10
```

### Por que ainda não é 10/10

A solução está correta, mas ainda precisa detalhar com precisão o que acontece em cada camada.

### O que o Claude Code deve fazer

Criar uma matriz de responsabilidades por camada:

```txt
Camada Frontend
Camada Backend
Camada Banco
Camada Smart Contract
Camada Blockchain/Testnet
```

### Matriz esperada

```txt
Frontend:
- Renderizar dashboard
- Renderizar listagem
- Renderizar detalhe
- Renderizar timeline
- Exibir status
- Conectar wallet
- Validar formulários
- Chamar API
- Exibir loading/error/empty states
- Exibir hashes e tx hashes
- Simular fluxo visual com mocks enquanto backend não estiver pronto

Backend:
- Validar permissões reais
- Validar status atual
- Impedir avanço fora de ordem
- Criar contrato
- Atualizar contrato
- Criar evento
- Registrar disputa
- Acionar smart contract quando necessário
- Salvar transactionHash
- Retornar dados em camelCase para o frontend

Banco:
- Persistir dados completos
- Persistir eventos
- Persistir disputas
- Persistir perfis
- Persistir hashes e tx hashes
- Usar snake_case internamente

Smart Contract:
- Registrar provas críticas
- Emitir eventos
- Validar transições críticas quando aplicável
- Guardar hash/status/timestamp/carteira

Blockchain/Testnet:
- Prover imutabilidade demonstrável
- Gerar transactionHash
- Permitir consulta por explorer
```

### Critério para 10/10

A solução chega a 10/10 quando cada documento deixa claro:

```txt
Quem faz o quê.
Onde cada dado vive.
Qual camada valida cada regra.
Qual camada apenas exibe.
```

---

## 6. O que falta para Coerência do Fluxo de Negócio chegar a 10/10

### Nota atual

```txt
Coerência do fluxo de negócio: 9.5/10
```

### Por que ainda não é 10/10

O fluxo principal está correto, mas faltam fluxos alternativos e fluxos de erro documentados.

### O que o Claude Code deve documentar

Criar seção:

```txt
Fluxos Oficiais do Sistema
```

### 6.1 Fluxo feliz

```txt
1. Gestor cria contrato
2. Status: CRIADO
3. Fornecedor confirma envio
4. Status: ENVIADO
5. Entregador confirma entrega
6. Status: ENTREGUE
7. Fiscal valida recebimento
8. Status: VALIDADO
9. Gestor autoriza pagamento
10. Status: PAGAMENTO_AUTORIZADO
11. Timeline exibe todos os eventos
12. Hash/transactionHash ficam visíveis
```

### 6.2 Fluxo de disputa

```txt
1. Contrato está em qualquer status antes de PAGAMENTO_AUTORIZADO
2. Usuário autorizado abre disputa
3. Backend registra motivo
4. Status muda para DISPUTA
5. Pagamento fica bloqueado
6. Timeline registra DISPUTA_ABERTA
7. Interface exibe alerta visual
```

### 6.3 Fluxo de fraude simulada

```txt
1. Sistema possui documentHash original
2. Usuário aciona simulação de fraude
3. Sistema gera ou recebe novo hash divergente
4. Backend compara hash original com novo hash
5. Se diferente, abre disputa
6. Status muda para DISPUTA
7. Timeline registra FRAUDE_SIMULADA e DISPUTA_ABERTA
8. Pagamento fica bloqueado
```

### 6.4 Fluxo de erro por etapa fora de ordem

```txt
Exemplo:
Contrato está em CRIADO.
Usuário tenta confirmar entrega.
Backend rejeita.
Frontend exibe erro:
"Esta etapa não pode ser executada antes da confirmação de envio."
```

### 6.5 Fluxo de permissão negada

```txt
Exemplo:
Usuário FORNECEDOR tenta autorizar pagamento.
Backend rejeita.
Frontend exibe erro:
"Apenas o gestor responsável pode autorizar o pagamento."
```

### Critério para 10/10

O fluxo chega a 10/10 quando os documentos cobrem:

```txt
Fluxo feliz
Fluxo de disputa
Fluxo de fraude
Fluxo de erro
Fluxo de permissão
Bloqueio de pagamento
Atualização da timeline
```

---

## 7. O que falta para Arquitetura Geral chegar a 10/10

### Nota atual

```txt
Coerência da arquitetura geral: 9/10
```

### Por que ainda não é 10/10

A arquitetura está clara, mas faltam decisões finais sobre:

- monorepo ou repositórios separados;
- ORM/client do backend;
- testnet oficial;
- padrão de variáveis de ambiente;
- estratégia de mocks;
- estratégia de deploy.

### Decisões que o Claude Code deve aplicar

#### 7.1 Estrutura oficial de repositório

Se o projeto estiver em monorepo, usar:

```txt
fiscalizapay-web3/
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   ├── ui/
│   ├── types/
│   ├── validators/
│   ├── config/
│   └── contracts-abi/
│
├── smart-contract/
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.ts
│
├── docs/
│   ├── fiscalizapay_analise_coerencia_decisoes_oficiais.md
│   ├── contrato_api_frontend_backend.md
│   ├── decisao_tecnica_final.md
│   └── feedback_session_one_coerencia.md
│
└── README.md
```

Se o projeto atual não estiver preparado para monorepo, manter estrutura simples, mas documentar a decisão.

#### 7.2 Decidir ORM/client

Escolher uma opção oficial:

```txt
Opção A: Prisma
Opção B: Supabase Client
```

Recomendação para hackathon:

```txt
Supabase Client se o foco for velocidade.
Prisma se o foco for tipagem, migrations e padrão mais robusto.
```

Decisão sugerida:

```txt
Usar Supabase/PostgreSQL como banco.
Usar Supabase Client para velocidade no MVP.
Documentar Prisma como possível evolução pós-MVP.
```

#### 7.3 Decidir testnet

Escolher uma opção oficial:

```txt
Sepolia
Polygon Amoy
```

Recomendação:

```txt
Sepolia se quiser ecossistema Ethereum mais tradicional.
Polygon Amoy se quiser demonstrar custo baixo e rede compatível com visão mais prática.
```

Decisão sugerida:

```txt
Usar Polygon Amoy como testnet oficial do MVP.
Manter Sepolia como alternativa.
```

#### 7.4 Variáveis de ambiente oficiais

Frontend:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ENABLE_MOCKS=
NEXT_PUBLIC_EXPLORER_URL=
```

Backend:

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
CHAIN_ID=
EXPLORER_URL=
```

### Critério para 10/10

Arquitetura geral chega a 10/10 quando:

```txt
estrutura do repositório está definida
ORM/client está definido
testnet está definida
variáveis de ambiente estão padronizadas
deploy está descrito
mocks estão planejados
```

---

## 8. O que falta para Coerência Frontend/Backend chegar a 10/10

### Nota atual

```txt
Coerência frontend/backend: 8.5/10
```

### Por que ainda não é 10/10

Ainda falta o documento mais importante para integração:

```txt
contrato_api_frontend_backend.md
```

Sem ele, frontend e backend podem implementar formatos diferentes.

### O que o Claude Code deve criar

Criar obrigatoriamente:

```txt
docs/contrato_api_frontend_backend.md
```

Esse documento deve conter:

```txt
1. Padrões gerais da API
2. Headers esperados
3. Formato de sucesso
4. Formato de erro
5. Tipos TypeScript oficiais
6. Endpoints
7. Request body
8. Response body
9. Exemplos de sucesso
10. Exemplos de erro
11. Regras de status por endpoint
12. Eventos criados por endpoint
13. Query keys sugeridas para TanStack Query
14. Como mocks devem seguir a API
```

### 8.1 Padrão de sucesso

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

### 8.2 Padrão de erro

```ts
export interface ApiError {
  message: string;
  code:
    | "VALIDATION_ERROR"
    | "NOT_FOUND"
    | "INVALID_STATUS_TRANSITION"
    | "UNAUTHORIZED_ROLE"
    | "BLOCKCHAIN_ERROR"
    | "INTERNAL_ERROR";
  details?: unknown;
}
```

### 8.3 Endpoints que devem estar detalhados

```http
GET    /dashboard/summary

GET    /contracts
POST   /contracts
GET    /contracts/:id
PATCH  /contracts/:id
DELETE /contracts/:id

GET    /contracts/:id/events

POST   /contracts/:id/confirm-shipment
POST   /contracts/:id/confirm-delivery
POST   /contracts/:id/validate-receipt
POST   /contracts/:id/authorize-payment
POST   /contracts/:id/open-dispute
POST   /contracts/:id/simulate-fraud

GET    /contracts/:id/blockchain-status
POST   /contracts/:id/register-on-chain
```

### 8.4 Endpoint que precisa de decisão

Decidir oficialmente se será mantido ou removido:

```http
POST /contracts/:id/events
```

Recomendação:

```txt
Remover do MVP como endpoint público.
Eventos devem ser criados internamente pelo backend a cada ação.
Manter criação manual de eventos apenas como possível endpoint administrativo pós-MVP.
```

### 8.5 Query keys sugeridas para frontend

```ts
["dashboard-summary"]
["contracts"]
["contract", contractId]
["contract-events", contractId]
["blockchain-status", contractId]
```

### Critério para 10/10

Frontend/backend chega a 10/10 quando:

```txt
cada endpoint possui request/response definidos
cada erro esperado está documentado
frontend sabe exatamente o que mockar
backend sabe exatamente o que retornar
eventos criados por cada ação estão definidos
```

---

## 9. O que falta para Coerência de Nomenclatura Técnica chegar a 10/10

### Nota atual

```txt
Coerência de nomenclatura técnica: 9/10
```

### Por que ainda não é 10/10

Status e roles foram padronizados, mas ainda faltam decisões finais sobre:

- nomes de tabelas;
- nomes de colunas;
- nomes de DTOs;
- nomes de schemas Zod;
- nomes de hooks;
- nomes de mutations;
- nomes de query keys;
- nomes de componentes;
- padrão de event types;
- padrão de variáveis de ambiente;
- paleta oficial.

### O que o Claude Code deve criar

Criar ou atualizar seção:

```txt
Glossário Técnico Oficial
```

### 9.1 Status oficiais

```txt
CRIADO
ENVIADO
ENTREGUE
VALIDADO
PAGAMENTO_AUTORIZADO
DISPUTA
```

### 9.2 Roles oficiais

```txt
GESTOR
FORNECEDOR
ENTREGADOR
FISCAL
AUDITOR
```

### 9.3 Event types oficiais

```txt
CONTRATO_CRIADO
ENVIO_CONFIRMADO
ENTREGA_CONFIRMADA
RECEBIMENTO_VALIDADO
PAGAMENTO_AUTORIZADO
DISPUTA_ABERTA
FRAUDE_SIMULADA
HASH_REGISTRADO
```

### 9.4 Componentes oficiais do frontend

```txt
AppSidebar
AppHeader
PageHeader
DashboardMetricCard
ContractCard
ContractStatusBadge
ContractTimeline
ContractEventCard
ContractActionPanel
WalletConnectButton
WalletStatus
TransactionHashLink
DocumentHashViewer
RoleBadge
PermissionGate
EmptyState
ErrorState
LoadingState
```

### 9.5 Hooks oficiais

```txt
useContracts
useContractById
useContractEvents
useDashboardSummary
useCreateContract
useConfirmShipment
useConfirmDelivery
useValidateReceipt
useAuthorizePayment
useOpenDispute
useSimulateFraud
useBlockchainStatus
useConnectWallet
```

### 9.6 Schemas Zod oficiais

```txt
createContractSchema
openDisputeSchema
simulateFraudSchema
confirmShipmentSchema
confirmDeliverySchema
validateReceiptSchema
authorizePaymentSchema
```

### 9.7 DTOs oficiais

```txt
CreateContractDto
UpdateContractDto
OpenDisputeDto
SimulateFraudDto
ConfirmShipmentDto
ConfirmDeliveryDto
ValidateReceiptDto
AuthorizePaymentDto
```

### 9.8 Paleta oficial

Resolver divergência entre:

```txt
#22D3EE
#11DFF2
```

Decisão sugerida:

```txt
Destaque primário oficial: #22D3EE
Cor alternativa/neon Oraculum: #11DFF2
```

### Critério para 10/10

Nomenclatura chega a 10/10 quando todos os nomes técnicos estão documentados e não existem nomes alternativos concorrentes.

---

## 10. O que falta para Prontidão de Implementação chegar a 10/10

### Nota atual

```txt
Prontidão para implementação: 8.5/10
```

### Por que ainda não é 10/10

O projeto está quase pronto, mas ainda faltam entregáveis concretos antes do código.

### Entregáveis obrigatórios antes de começar a implementação

O Claude Code deve criar ou atualizar:

```txt
docs/contrato_api_frontend_backend.md
docs/decisoes_tecnicas_finais.md
docs/glossario_tecnico_oficial.md
docs/criterios_aceite_mvp.md
docs/plano_implementacao_frontend.md
docs/plano_implementacao_backend_web3.md
```

Se a equipe quiser manter menos arquivos, pode consolidar parte disso em um único documento, mas o conteúdo precisa existir.

---

## 11. Documento obrigatório: contrato_api_frontend_backend.md

Este é o documento mais importante para a próxima etapa.

### Estrutura obrigatória

```md
# FiscalizaPay Web3 — Contrato API Frontend/Backend

## 1. Objetivo

## 2. Padrões gerais

## 3. Tipos oficiais

## 4. Formato de resposta de sucesso

## 5. Formato de resposta de erro

## 6. Endpoints de dashboard

## 7. Endpoints de contratos

## 8. Endpoints de eventos

## 9. Endpoints de ações do fluxo

## 10. Endpoints de disputa/fraude

## 11. Endpoints blockchain

## 12. Eventos gerados por cada ação

## 13. Regras de transição de status

## 14. Query keys do frontend

## 15. Mocks esperados

## 16. Critérios de aceite da integração
```

---

## 12. Documento obrigatório: decisoes_tecnicas_finais.md

### Estrutura obrigatória

```md
# FiscalizaPay Web3 — Decisões Técnicas Finais

## 1. Frontend oficial

## 2. Backend oficial

## 3. Banco de dados oficial

## 4. ORM/client oficial

## 5. Blockchain/testnet oficial

## 6. Deploy oficial

## 7. Variáveis de ambiente

## 8. Dados on-chain

## 9. Dados off-chain

## 10. Decisões descartadas

## 11. Motivo das decisões
```

### Decisões que precisam ficar fechadas

```txt
Frontend: Next.js App Router
Backend: NestJS ou Node.js com estrutura modular
Banco: Supabase/PostgreSQL
Client/ORM: Supabase Client no MVP
Testnet: Polygon Amoy no MVP
Frontend Web3: wagmi + viem + RainbowKit
Backend Web3: ethers.js ou viem
Deploy frontend: Vercel
Deploy backend: Render/Railway/Fly.io
```

---

## 13. Documento obrigatório: glossario_tecnico_oficial.md

### Estrutura obrigatória

```md
# FiscalizaPay Web3 — Glossário Técnico Oficial

## 1. Status

## 2. Roles

## 3. Event types

## 4. Entidades

## 5. Campos principais

## 6. Componentes frontend

## 7. Hooks frontend

## 8. DTOs backend

## 9. Schemas frontend/backend

## 10. Termos Web3

## 11. Termos proibidos ou descartados
```

### Termos proibidos como oficiais

```txt
CREATED
SHIPMENT_CONFIRMED
DELIVERY_CONFIRMED
RECEIPT_VALIDATED
PAYMENT_AUTHORIZED
DISPUTE
VITE_API_URL
VITE_CHAIN_ID
React Router como roteador oficial
Vite como stack oficial
Ethers.js como lib Web3 principal do frontend
components/pages/services/hooks/types/utils como arquitetura raiz oficial
```

---

## 14. Documento obrigatório: criterios_aceite_mvp.md

### Estrutura obrigatória

```md
# FiscalizaPay Web3 — Critérios de Aceite do MVP

## 1. Critérios de produto

## 2. Critérios de frontend

## 3. Critérios de backend

## 4. Critérios de blockchain

## 5. Critérios de integração

## 6. Critérios de demo

## 7. Critérios de documentação

## 8. Definition of Done
```

### Critérios mínimos

```txt
- Um contrato pode ser criado.
- O contrato aparece na listagem.
- O contrato possui detalhe.
- A timeline exibe eventos.
- O status muda corretamente.
- Etapas fora de ordem são bloqueadas.
- Roles não autorizadas são bloqueadas.
- Disputa bloqueia pagamento.
- Simulação de fraude abre disputa.
- Pelo menos um hash é exibido.
- Pelo menos um transactionHash é exibido ou simulado de forma clara.
- Wallet conecta visualmente.
- Frontend consome API real ou mocks no mesmo formato.
- README explica como rodar.
```

---

## 15. Documento obrigatório: plano_implementacao_frontend.md

### Estrutura obrigatória

```md
# FiscalizaPay Web3 — Plano de Implementação Frontend

## 1. Objetivo

## 2. Stack

## 3. Estrutura de pastas

## 4. Ordem de implementação

## 5. Componentes base

## 6. Entidades

## 7. Features

## 8. Widgets

## 9. Telas

## 10. Mocks

## 11. Integração com API

## 12. Integração wallet

## 13. Estados de tela

## 14. Critérios de aceite
```

### Ordem recomendada

```txt
1. Criar projeto Next.js
2. Configurar Tailwind
3. Configurar shadcn/ui
4. Configurar aliases
5. Criar estrutura FSD
6. Criar design tokens
7. Criar componentes shared/ui
8. Criar entities
9. Criar mocks
10. Criar layout
11. Criar dashboard
12. Criar listagem
13. Criar detalhe
14. Criar timeline
15. Criar ações
16. Criar disputa
17. Criar simulação de fraude
18. Configurar TanStack Query
19. Integrar API real
20. Configurar wallet
```

---

## 16. Documento obrigatório: plano_implementacao_backend_web3.md

### Estrutura obrigatória

```md
# FiscalizaPay Web3 — Plano de Implementação Backend e Web3

## 1. Objetivo

## 2. Stack

## 3. Estrutura de pastas

## 4. Banco de dados

## 5. Tabelas

## 6. Endpoints

## 7. Regras de status

## 8. Regras de permissão

## 9. Eventos

## 10. Disputas

## 11. Simulação de fraude

## 12. Smart contract

## 13. Deploy testnet

## 14. Integração com frontend

## 15. Critérios de aceite
```

---

## 17. Prompt recomendado para o Claude Code

Use o prompt abaixo para executar a próxima sessão.

```txt
Você é um arquiteto de software sênior e gerente técnico do projeto FiscalizaPay Web3.

Sua tarefa é elevar a documentação e o planejamento do projeto ao nível 10/10 de prontidão para implementação.

Leia obrigatoriamente os documentos existentes do projeto, principalmente:

- fiscalizapay_analise_coerencia_decisoes_oficiais.md
- feedback_session_one_coerencia.md
- fiscalizapay_Proposta_ideia_solução.md
- fiscalizapay_frontend_arquitetura_base.md
- fiscalizapay_divisao_etapas_equipe.md
- oraculum_design_system.md, se existir

Use como referência principal o arquivo:

- fiscalizapay_plano_final_projeto_10_10.md

Objetivo da sessão:

Transformar as notas atuais:

Coerência da ideia: 9.5/10
Coerência da solução: 9.5/10
Coerência do fluxo de negócio: 9.5/10
Coerência da arquitetura geral: 9/10
Coerência frontend/backend: 8.5/10
Coerência de nomenclatura técnica: 9/10
Prontidão para implementação: 8.5/10

em um estado 10/10 para iniciar o desenvolvimento com segurança.

Não implemente código de aplicação nesta etapa.

Esta sessão é apenas para documentação, planejamento, contrato técnico, alinhamento e preparação.

Crie ou atualize os seguintes documentos:

1. docs/contrato_api_frontend_backend.md
2. docs/decisoes_tecnicas_finais.md
3. docs/glossario_tecnico_oficial.md
4. docs/criterios_aceite_mvp.md
5. docs/plano_implementacao_frontend.md
6. docs/plano_implementacao_backend_web3.md

Cada documento deve seguir a estrutura definida em fiscalizapay_plano_final_projeto_10_10.md.

Regras obrigatórias:

- Frontend oficial: Next.js App Router.
- Arquitetura frontend oficial: Feature-Sliced Design.
- Status oficiais: CRIADO, ENVIADO, ENTREGUE, VALIDADO, PAGAMENTO_AUTORIZADO, DISPUTA.
- Roles oficiais: GESTOR, FORNECEDOR, ENTREGADOR, FISCAL, AUDITOR.
- Event types oficiais: CONTRATO_CRIADO, ENVIO_CONFIRMADO, ENTREGA_CONFIRMADA, RECEBIMENTO_VALIDADO, PAGAMENTO_AUTORIZADO, DISPUTA_ABERTA, FRAUDE_SIMULADA, HASH_REGISTRADO.
- API/frontend usam camelCase.
- Banco usa snake_case.
- Dados sensíveis ficam off-chain.
- Blockchain registra apenas provas críticas.
- Frontend usa wagmi + viem + RainbowKit.
- Backend usa ethers.js ou viem.
- Vite não é stack oficial.
- Status em inglês não são oficiais.
- POST /contracts/:id/events não deve ser endpoint público do MVP, a menos que você justifique tecnicamente no documento.
- Eventos devem ser criados internamente pelo backend a cada ação do fluxo.

No documento contrato_api_frontend_backend.md, detalhe cada endpoint com:

- método
- rota
- objetivo
- role autorizada
- status permitido antes da ação
- status após a ação
- request body
- response body
- eventos gerados
- erros possíveis
- exemplo de sucesso
- exemplo de erro
- query key sugerida para TanStack Query

No documento decisoes_tecnicas_finais.md, feche as decisões pendentes:

- ORM/client do backend
- testnet oficial
- paleta oficial
- profundidade da autenticação Web3 no MVP
- estratégia de mocks
- estratégia de deploy

No documento criterios_aceite_mvp.md, defina uma Definition of Done objetiva para produto, frontend, backend, blockchain, integração e demo.

Ao final, crie também um arquivo:

docs/feedback_session_two_projeto_10_10.md

Esse arquivo deve explicar:

- documentos criados
- documentos alterados
- decisões fechadas
- pendências eliminadas
- pendências restantes, se houver
- nova avaliação das notas
- se o projeto está pronto ou não para iniciar implementação

Não avance para código. Apenas documentação e planejamento.
```

---

## 18. Critério final de aceitabilidade

Após o Claude Code executar a próxima sessão, o projeto só deve ser considerado 10/10 se os arquivos abaixo existirem e estiverem completos:

```txt
docs/contrato_api_frontend_backend.md
docs/decisoes_tecnicas_finais.md
docs/glossario_tecnico_oficial.md
docs/criterios_aceite_mvp.md
docs/plano_implementacao_frontend.md
docs/plano_implementacao_backend_web3.md
docs/feedback_session_two_projeto_10_10.md
```

E se as seguintes decisões estiverem fechadas:

```txt
Status oficiais
Roles oficiais
Event types oficiais
Stack frontend oficial
Arquitetura frontend oficial
Endpoints oficiais
Payloads oficiais
Formato de erro oficial
Formato de sucesso oficial
ORM/client do backend
Testnet oficial
Paleta oficial
Estratégia de mocks
Escopo MVP vs pós-MVP
Critérios de aceite do MVP
```

---

## 19. Checklist final para aprovar início do desenvolvimento

Use este checklist antes de iniciar código:

```txt
[ ] Existe contrato API frontend/backend.
[ ] Todos os endpoints possuem request e response.
[ ] Todos os erros esperados estão documentados.
[ ] Todos os status estão em português.
[ ] Todos os roles estão padronizados.
[ ] Todos os event types estão padronizados.
[ ] A stack frontend está fechada.
[ ] A arquitetura frontend está fechada.
[ ] A testnet está definida.
[ ] O ORM/client está definido.
[ ] A paleta oficial está definida.
[ ] O escopo MVP está separado do pós-MVP.
[ ] O plano frontend existe.
[ ] O plano backend/Web3 existe.
[ ] Os critérios de aceite existem.
[ ] A Definition of Done existe.
[ ] O feedback da sessão 2 confirma prontidão.
```

Se todos os itens estiverem marcados, o projeto pode iniciar implementação.

---

## 20. Resultado esperado

Ao final da próxima sessão, o projeto deve sair de:

```txt
Pronto para planejar implementação
```

para:

```txt
Pronto para iniciar desenvolvimento com segurança
```

O resultado esperado é uma documentação suficiente para que:

- Pessoa 2 implemente frontend sem depender de suposições;
- Pessoa 3 implemente backend sem criar contratos de dados diferentes;
- Pessoa 1 valide o produto e a demo com clareza;
- Claude Code consiga executar etapas futuras sem misturar decisões antigas;
- o MVP seja desenvolvido com menos retrabalho;
- o projeto mantenha coerência técnica e narrativa.

---

## 21. Mensagem final

O FiscalizaPay Web3 já possui uma base forte.

A próxima etapa não é mudar a ideia.

A próxima etapa é fechar os detalhes que transformam uma boa ideia em um sistema implementável.

A regra principal é:

```txt
Antes de codar, fechar contrato, nomenclatura, payload, critério de aceite e decisão técnica.
```

Depois disso, o desenvolvimento pode começar com muito mais segurança.
