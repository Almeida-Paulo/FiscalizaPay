# Feedback Session One — Coerência e Decisões Oficiais

## 1. Objetivo da sessão

Esta sessão teve como objetivo analisar todos os documentos `.md` existentes no projeto FiscalizaPay Web3 e alinhar cada um deles com o arquivo de decisões oficiais, eliminando inconsistências de stack, nomenclatura, arquitetura, endpoints, status e responsabilidades antes do início da implementação.

---

## 2. Arquivo base utilizado

O arquivo principal utilizado como fonte oficial de todas as decisões foi:

```txt
fiscalizapay_analise_coerencia_decisoes_oficiais.md
```

Esse arquivo define a hierarquia dos documentos, decisões técnicas consolidadas, riscos identificados e orienta o Claude Code e a equipe sobre quais padrões devem ser seguidos durante o desenvolvimento.

---

## 3. Documentos analisados

Foram analisados os seguintes arquivos `.md` do projeto:

```txt
Docs/fiscalizapay_analise_coerencia_decisoes_oficiais.md  → base de referência
Docs/fiscalizapay_Proposta_ideia_solução.md               → corrigido
Docs/fiscalizapay_frontend_arquitetura_base.md            → corrigido
Docs/fiscalizapay_divisao_etapas_equipe.md                → corrigido
Docs/oraculum_design_system.md                            → analisado (sem correções críticas)
```

---

## 4. Inconsistências encontradas

### 4.1 Stack frontend

| Documento | Problema encontrado |
|---|---|
| `fiscalizapay_Proposta_ideia_solução.md` | Listava "React", "Vite ou Next.js" e "Ethers.js" como tecnologias do frontend |
| `fiscalizapay_divisao_etapas_equipe.md` | Stack da Pessoa 2 listava: React, Vite, React Router, TanStack Query **ou** Axios, Ethers.js |
| `fiscalizapay_divisao_etapas_equipe.md` | Arquitetura MVP descrita como "React + TypeScript + TailwindCSS + shadcn/ui" sem Next.js |

Nenhum desses documentos listava wagmi, viem, RainbowKit, Zustand, React Hook Form ou Zod — tecnologias oficiais do frontend.

### 4.2 Arquitetura frontend (Feature-Sliced Design)

| Documento | Problema encontrado |
|---|---|
| `fiscalizapay_Proposta_ideia_solução.md` | Estrutura de pastas do frontend com: `components/`, `pages/`, `services/`, `hooks/`, `types/`, `utils/` |
| `fiscalizapay_divisao_etapas_equipe.md` | Mesma estrutura antiga: `components/`, `pages/`, `services/`, `hooks/`, `types/`, `utils/` |

A estrutura Feature-Sliced Design (`app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`) estava definida apenas no `fiscalizapay_frontend_arquitetura_base.md`.

### 4.3 Status

| Documento | Problema encontrado |
|---|---|
| `fiscalizapay_divisao_etapas_equipe.md` | Status em inglês no enum do backend: `CREATED`, `SHIPMENT_CONFIRMED`, `DELIVERY_CONFIRMED`, `RECEIPT_VALIDATED`, `PAYMENT_AUTHORIZED`, `DISPUTE` |
| `fiscalizapay_divisao_etapas_equipe.md` | Fluxo de status descrito em inglês: `CREATED → SHIPMENT_CONFIRMED → ...` |

### 4.4 Eventos de contrato

| Documento | Problema encontrado |
|---|---|
| `fiscalizapay_divisao_etapas_equipe.md` | Event types em PascalCase: `ContratoCriado`, `EnvioConfirmado`, `EntregaConfirmada`, `RecebimentoValidado`, `PagamentoAutorizado`, `DisputaAberta` — divergindo do padrão oficial em SCREAMING_SNAKE_CASE |

### 4.5 Endpoints

| Documento | Problema encontrado |
|---|---|
| `fiscalizapay_Proposta_ideia_solução.md` | `PUT /contracts/:id` em vez de `PATCH /contracts/:id` |
| `fiscalizapay_Proposta_ideia_solução.md` | `POST /contracts/:id/events` não está no contrato oficial |
| `fiscalizapay_Proposta_ideia_solução.md` | Faltava `GET /dashboard/summary` |
| `fiscalizapay_Proposta_ideia_solução.md` | Faltava `POST /contracts/:id/simulate-fraud` |
| `fiscalizapay_frontend_arquitetura_base.md` | `PUT /contracts/:id` em vez de `PATCH /contracts/:id` |
| `fiscalizapay_frontend_arquitetura_base.md` | `POST /contracts/:id/events` listado como endpoint esperado |
| `fiscalizapay_frontend_arquitetura_base.md` | Faltavam `GET /dashboard/summary` e `POST /simulate-fraud` na seção 11.2 e no prompt base (seção 24) |
| `fiscalizapay_divisao_etapas_equipe.md` | Faltava `DELETE /contracts/:id` |
| `fiscalizapay_divisao_etapas_equipe.md` | Faltava `POST /contracts/:id/simulate-fraud` na seção oficial da API |
| `fiscalizapay_divisao_etapas_equipe.md` | Faltavam os endpoints de blockchain (`GET /blockchain-status` e `POST /register-on-chain`) na seção da API |

### 4.6 API e formato dos dados

| Documento | Problema encontrado |
|---|---|
| `fiscalizapay_Proposta_ideia_solução.md` | Variáveis de ambiente com prefixo `VITE_` (`VITE_API_URL`, `VITE_CHAIN_ID`, etc.) em vez de `NEXT_PUBLIC_` |
| `fiscalizapay_divisao_etapas_equipe.md` | Tabela `contract_events` com campos `actor_role`, `actor_wallet`, `status_from`, `status_to`, `tx_hash` em vez dos nomes oficiais |
| `fiscalizapay_divisao_etapas_equipe.md` | Tabela `contracts` faltando colunas: `start_date`, `end_date`, `inspector_name`, `inspector_wallet`, `logistics_responsible`, `logistics_wallet`, `blockchain_contract_id`; usando `fiscal_name` em vez de `inspector_name` |

### 4.7 Tipagem TypeScript

| Documento | Problema encontrado |
|---|---|
| `fiscalizapay_frontend_arquitetura_base.md` | `ContractEvent.eventType` tipado como `string` em vez de `ContractEventType` |
| `fiscalizapay_frontend_arquitetura_base.md` | Tipo `ContractEventType` não estava definido no documento, apenas referenciado |

### 4.8 Responsabilidades frontend/backend

Nenhuma inconsistência grave neste ponto — os documentos já separavam as responsabilidades de forma razoável. A separação foi reforçada através das correções de stack e endpoints.

### 4.9 Blockchain

Todos os documentos já indicavam corretamente que dados sensíveis ficam off-chain e que a blockchain registra apenas provas críticas. Sem inconsistências neste ponto.

### 4.10 Hierarquia dos documentos

Hierarquia estava implícita mas não explícita nos documentos analisados. O arquivo de decisões oficiais resolve isso formalmente.

---

## 5. Correções aplicadas

### 5.1 `fiscalizapay_Proposta_ideia_solução.md`

| Trecho/Tema corrigido | Decisão oficial aplicada |
|---|---|
| Seção 10.1 — Stack frontend | Substituída por Next.js App Router + TypeScript + TailwindCSS + shadcn/ui + Framer Motion + TanStack Query + Zustand + React Hook Form + Zod + wagmi + viem + RainbowKit + Lucide React. Adicionada nota: "Stack anterior descartada: React + Vite" |
| Seção 11.1 — Variáveis de ambiente | `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CHAIN_ID`, `VITE_CONTRACT_ADDRESS` → `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CHAIN_ID`, `NEXT_PUBLIC_CONTRACT_ADDRESS`, `NEXT_PUBLIC_ENABLE_MOCKS` |
| Seção 11.1 — Vercel | Removida menção de compatibilidade com Vite; substituída por "compatibilidade nativa com Next.js App Router" |
| Seção 12 — Estrutura frontend | `components/`, `pages/`, `services/`, `hooks/`, `types/`, `utils/` → Feature-Sliced Design: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/` |
| Seção 8.6 — Endpoints | `PUT /contracts/:id` → `PATCH /contracts/:id`; removido `POST /contracts/:id/events`; adicionados `GET /dashboard/summary` e `POST /contracts/:id/simulate-fraud` |

### 5.2 `fiscalizapay_frontend_arquitetura_base.md`

| Trecho/Tema corrigido | Decisão oficial aplicada |
|---|---|
| Seção 9 — Modelagem de domínio | Adicionada definição do tipo `ContractEventType` (nova seção 9.3) com todos os event types oficiais em SCREAMING_SNAKE_CASE |
| Seção 9.4 (renumerada 9.5) — ContractEvent | `eventType: string` → `eventType: ContractEventType` |
| Seção 9.5 (renumerada 9.6) — Profile | Renumerada após inserção da nova seção 9.3 |
| Seção 11.2 — Endpoints esperados | `PUT /contracts/:id` → `PATCH /contracts/:id`; removido `POST /contracts/:id/events`; adicionados `GET /dashboard/summary` e `POST /contracts/:id/simulate-fraud` |
| Seção 24 — Prompt base (endpoints) | Mesmas correções de endpoints aplicadas ao prompt base usado com Claude Code |

### 5.3 `fiscalizapay_divisao_etapas_equipe.md`

| Trecho/Tema corrigido | Decisão oficial aplicada |
|---|---|
| Seção 3 — Arquitetura MVP | "React + TypeScript + TailwindCSS + shadcn/ui" → "Next.js App Router + TypeScript + TailwindCSS + shadcn/ui"; Ethers.js → wagmi + viem + RainbowKit (frontend) / ethers.js ou viem (backend) |
| Pessoa 2 — Stack sugerida | Stack completamente substituída: removidos React, Vite, React Router, Ethers.js; adicionados Next.js App Router, Framer Motion, Zustand, React Hook Form, Zod, wagmi, viem, RainbowKit |
| Seção 3 — Status do backend | Enum inglês (`CREATED`, `SHIPMENT_CONFIRMED`, etc.) → tipo oficial em português (`CRIADO`, `ENVIADO`, `ENTREGUE`, `VALIDADO`, `PAGAMENTO_AUTORIZADO`, `DISPUTA`) |
| Seção 3 — Fluxo de status | Fluxo em inglês → fluxo em português (CRIADO → ENVIADO → ENTREGUE → VALIDADO → PAGAMENTO_AUTORIZADO / DISPUTA) |
| Seção 6 (Pessoa 2) — Eventos da timeline | `ContratoCriado`, `EnvioConfirmado`, etc. → `CONTRATO_CRIADO`, `ENVIO_CONFIRMADO`, `ENTREGA_CONFIRMADA`, `RECEBIMENTO_VALIDADO`, `PAGAMENTO_AUTORIZADO`, `DISPUTA_ABERTA`, `FRAUDE_SIMULADA`, `HASH_REGISTRADO` |
| Tabela `contracts` | Adicionadas colunas: `start_date`, `end_date`, `inspector_name`, `inspector_wallet`, `logistics_responsible`, `logistics_wallet`, `blockchain_contract_id`; corrigido `fiscal_name` → `inspector_name` |
| Tabela `contract_events` | `actor_role` → `responsible_role`; `actor_wallet` → `responsible_wallet`; adicionado `responsible_name`; `status_from`/`status_to` → `status_before`/`status_after`; `tx_hash` → `transaction_hash`; adicionado `blockchain_timestamp` |
| Seção de API REST | Reorganizada com ordem oficial: dashboard primeiro; adicionados `DELETE /contracts/:id`, `POST /simulate-fraud` e endpoints de blockchain |
| Seção 10 — Estrutura de pastas | `components/`, `pages/`, `services/`, `hooks/`, `types/`, `utils/` → Feature-Sliced Design: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/` |
| Pessoa 2 — Checklist | Atualizado para refletir Next.js, FSD, wagmi/viem/RainbowKit, status em português, simulate-fraud e mocks isolados |

---

## 6. Decisões oficiais reforçadas

As seguintes decisões oficiais estão agora refletidas de forma consistente em todos os documentos:

### Frontend oficial

```txt
Next.js App Router — único framework frontend oficial
TypeScript em todo o projeto
TailwindCSS para estilização
shadcn/ui como base de componentes
Framer Motion para animações
TanStack Query para dados remotos
Zustand para estado global local
React Hook Form + Zod para formulários
wagmi + viem + RainbowKit para Web3 no frontend
Lucide React para ícones
```

### Arquitetura frontend oficial

```txt
Feature-Sliced Design (FSD)
app/ — configuração global, providers, layout
pages/ — composição das telas principais
widgets/ — blocos grandes de interface
features/ — ações do usuário isoladas
entities/ — modelos do domínio
shared/ — código reutilizável sem regra de negócio
```

### Status oficiais

```txt
CRIADO
ENVIADO
ENTREGUE
VALIDADO
PAGAMENTO_AUTORIZADO
DISPUTA
```

### Roles oficiais

```txt
GESTOR
FORNECEDOR
ENTREGADOR
FISCAL
AUDITOR
```

### Event types oficiais

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

### Endpoints oficiais

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

### Dados on-chain

```txt
contractId
status
documentHash
actorWallet
timestamp
event emitido
transactionHash
```

### Dados off-chain

```txt
dados completos do contrato
dados do órgão público
dados do fornecedor
dados pessoais e bancários
documentos e notas fiscais
observações internas
histórico detalhado
motivos de disputa
```

### Responsabilidade frontend/backend

```txt
Frontend:
- renderizar telas e exibir dados
- conectar carteira (wagmi/viem/RainbowKit)
- validar formulários (React Hook Form + Zod)
- chamar API e gerenciar cache (TanStack Query)
- exibir loading, error e empty states
- exibir transactionHash e documentHash
- aplicar regras visuais de permissão
- NUNCA ser a camada definitiva de segurança

Backend:
- validar permissões reais
- validar sequência de status
- persistir dados no banco
- criar e registrar eventos
- comunicar com smart contract
- retornar transactionHash
- impedir ações inválidas

Smart Contract:
- registrar provas críticas on-chain
- emitir eventos
- impedir transições inválidas on-chain
```

### Formato dos dados

```txt
Banco de dados: snake_case (contract_number, document_hash, transaction_hash)
API e frontend: camelCase (contractNumber, documentHash, transactionHash)
```

---

## 7. Pontos que ainda precisam de atenção

Os itens abaixo não foram alterados nesta sessão por dependerem de decisão da equipe ou de contexto externo:

1. **Payloads finais dos endpoints** — os campos exatos de cada request/response body precisam ser definidos em um contrato de API dedicado (ex: `contrato_api_frontend_backend.md`).

2. **ORM do backend** — o documento de decisões oficiais define "Prisma **ou** Supabase Client". A equipe precisa decidir qual usar antes de iniciar o backend.

3. **Testnet de deploy** — a decisão entre Sepolia e Polygon Amoy está documentada como "ou", mas precisa ser definida pela Pessoa 3 antes do deploy do smart contract.

4. **Autenticação Web3 no MVP** — o documento oficial define um fluxo de autenticação por assinatura de mensagem, mas a implementação completa foi listada como opcional para o MVP. A equipe precisa decidir se haverá autenticação real ou apenas simulação controlada de perfil.

5. **Paleta de cores — divergência entre documentos** — `fiscalizapay_Proposta_ideia_solução.md` e `fiscalizapay_frontend_arquitetura_base.md` usam `#22D3EE` como destaque primário, enquanto `oraculum_design_system.md` usa `#11DFF2`. A equipe deve confirmar qual hex é o oficial antes do desenvolvimento do design system.

6. **Integração Web3 no frontend** — a profundidade da integração com smart contract via wagmi/viem (leitura vs escrita vs apenas tx hash exibido) precisa ser definida pela equipe antes da implementação da feature `connect-wallet`.

7. **Endpoint `POST /contracts/:id/events`** — presente em alguns documentos, removido da lista oficial por não estar no contrato oficial. Confirmar com o backend se este endpoint é necessário ou se os eventos são criados internamente pelo backend a cada ação.

---

## 8. Resultado final da sessão

Todos os documentos analisados estão agora **coerentes entre si e alinhados com as decisões oficiais** definidas em `fiscalizapay_analise_coerencia_decisoes_oficiais.md`.

As principais inconsistências que poderiam gerar retrabalho durante o desenvolvimento foram eliminadas:

- Stack frontend unificada em Next.js App Router.
- Feature-Sliced Design padronizado em todos os documentos.
- Status em português padronizados em todos os documentos.
- Event types em SCREAMING_SNAKE_CASE padronizados.
- Endpoints unificados com PATCH, dashboard/summary e simulate-fraud.
- Variáveis de ambiente com prefixo `NEXT_PUBLIC_`.
- Campos de banco de dados corrigidos para consistência com a interface TypeScript oficial.

---

## 9. Próxima recomendação

Com os documentos alinhados, o próximo passo recomendado é:

### Opção A — Criar o contrato de API
Criar `Docs/contrato_api_frontend_backend.md` definindo os payloads exatos de cada endpoint (request body, response body, tipos, exemplos de erro), garantindo que Pessoa 2 e Pessoa 3 não tomem decisões independentes sobre formato de dados.

### Opção B — Iniciar o frontend mockado
Com a arquitetura e stack definidas, a Pessoa 2 pode iniciar a criação do projeto Next.js com App Router, configurar a estrutura Feature-Sliced Design, implementar o design system com as cores do Oraculum e criar os primeiros mocks.

### Opção C — Criar o backend base
Com endpoints e status padronizados, a Pessoa 3 pode iniciar a API NestJS, configurar Supabase/PostgreSQL, criar as tabelas e implementar os endpoints de contratos e eventos com as regras de transição de status.

**Recomendação principal:** Criar o contrato de API (Opção A) antes de iniciar a implementação paralela, para garantir que frontend e backend falem a mesma linguagem desde o início.

---

*Sessão concluída em: 2026-05-28*  
*Documentos modificados: 3*  
*Inconsistências corrigidas: 20+*  
*Decisões oficiais consolidadas: 10 categorias*
