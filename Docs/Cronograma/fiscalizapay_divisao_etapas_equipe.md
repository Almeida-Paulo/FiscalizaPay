# FiscalizaPay Web3 — Divisão de Etapas por Pessoa e Funcionalidade

> **Projeto:** FiscalizaPay Web3  
> **Contexto:** Hackathon Desafio 3 — Web3 / Blockchain / Smart Contracts  
> **Objetivo do sistema:** garantir que o pagamento de contratos públicos só avance quando houver comprovação, conformidade e rastreabilidade.

---

## 1. Visão geral do produto

O **FiscalizaPay Web3** é uma plataforma de gestão, fiscalização e liberação segura de pagamentos em contratos públicos. O sistema organiza o fluxo de validação de um contrato, registra eventos críticos em blockchain e mantém dados sensíveis fora da blockchain.

A lógica central é simples:

```text
Contrato criado
→ Fornecedor confirma envio
→ Entregador confirma entrega
→ Fiscal valida recebimento
→ Gestor autoriza pagamento
→ Blockchain registra hash + timestamp
```

A proposta combina:

- **Gestão de contratos**
- **Fiscalização por múltiplas partes**
- **Compliance e rastreabilidade**
- **Smart contracts**
- **Registro imutável em blockchain**
- **Linha do tempo auditável**

---

## 2. Papéis do sistema

### 2.1 Gestor Público

Responsável por criar o contrato e autorizar o pagamento final.

Permissões principais:

- Criar contrato
- Definir fornecedor, fiscal, valor, prazo e regras
- Visualizar status geral
- Autorizar pagamento
- Abrir ou acompanhar disputa

### 2.2 Fornecedor

Responsável por confirmar o envio ou execução do serviço/produto contratado.

Permissões principais:

- Visualizar contrato atribuído
- Confirmar envio ou execução
- Anexar comprovante, quando necessário
- Assinar digitalmente a etapa

### 2.3 Entregador / Logística

Responsável por confirmar a entrega no local correto.

Permissões principais:

- Confirmar entrega
- Informar data, hora e responsável pela entrega
- Gerar evento de entrega na timeline

### 2.4 Fiscal do Contrato

Responsável por validar a conformidade da entrega.

Permissões principais:

- Conferir quantidade
- Conferir qualidade
- Conferir nota fiscal
- Conferir prazo
- Validar ou rejeitar recebimento
- Abrir disputa em caso de divergência

### 2.5 Auditor

Responsável por consultar a trilha auditável.

Permissões principais:

- Visualizar timeline
- Consultar hashes
- Verificar transações blockchain
- Conferir integridade dos documentos

---

## 3. Arquitetura do MVP

```text
Frontend Web
Next.js App Router + TypeScript + TailwindCSS + shadcn/ui
        ↓
Backend API
Node.js + NestJS (preferencialmente) + Supabase/PostgreSQL
        ↓
Integração Web3
wagmi + viem + RainbowKit (frontend) / ethers.js ou viem (backend)
        ↓
Smart Contract
Solidity + Hardhat + Testnet
```

### 3.1 On-chain

Informações que devem ser registradas na blockchain:

- ID do contrato
- Status atual
- Hash do documento
- Carteiras autorizadas
- Assinaturas das partes
- Eventos críticos
- Timestamp de cada validação
- Hash da tentativa de alteração, se houver disputa

### 3.2 Off-chain

Informações que devem ficar no banco de dados:

- Dados completos do contrato
- Dados do órgão público
- Dados do fornecedor
- Dados pessoais e bancários
- Documentos e anexos
- Notas fiscais
- Observações internas
- Histórico detalhado para interface

---

## 4. Divisão oficial da equipe

## Pessoa 1 — Product Owner / Documentation Lead

### Foco

Documentação, fluxo de negócio, narrativa do produto, regras da solução e apoio ao pitch.

### Responsabilidade principal

Garantir que o sistema tenha uma lógica clara, que a equipe saiba exatamente o que desenvolver e que o produto seja bem explicado no README, na demo e na apresentação.

### Funcionalidades sob responsabilidade

#### 1. Fluxo principal do produto

Definir e documentar o fluxo completo:

```text
Gestor cria contrato
Fornecedor confirma envio
Entregador confirma entrega
Fiscal valida recebimento
Gestor autoriza pagamento
Blockchain registra prova
```

Critérios de aceite:

- O fluxo deve estar claro no README.
- Cada etapa precisa ter um responsável.
- Cada etapa precisa ter uma condição para avançar.
- Cada etapa precisa gerar um evento na timeline.

#### 2. Regras de negócio

Documentar regras como:

- Pagamento não pode ser autorizado antes da validação do fiscal.
- O fornecedor não pode validar a própria entrega.
- O fiscal pode aprovar ou abrir disputa.
- A disputa bloqueia o pagamento.
- O hash do documento deve provar integridade.
- Dados sensíveis não devem ir para a blockchain.

Critérios de aceite:

- Criar seção `Regras de Negócio` no README.
- As regras precisam ser simples para a Pessoa 2 aplicar no frontend e a Pessoa 3 aplicar no backend/smart contract.

#### 3. Personas e permissões

Documentar os papéis:

- Gestor
- Fornecedor
- Entregador
- Fiscal
- Auditor

Critérios de aceite:

- Cada persona precisa ter descrição.
- Cada persona precisa ter permissões.
- Cada persona precisa estar ligada a uma etapa do fluxo.

#### 4. Conteúdo da interface

Escrever os textos que aparecem na interface:

- Título das telas
- Descrição dos cards
- Labels dos botões
- Mensagens de status
- Mensagens de confirmação
- Textos de erro
- Texto explicativo da timeline

Exemplos:

```text
Pagamento bloqueado: aguardando validação do fiscal.
Entrega confirmada com sucesso.
Hash registrado na blockchain.
Documento alterado: hash incompatível.
```

#### 5. README e documentação técnica

Criar um README completo com:

- Nome do projeto
- Problema
- Solução
- Arquitetura
- Tecnologias
- Fluxo da aplicação
- Como rodar o projeto
- Como rodar o smart contract
- Como testar a demo
- Roadmap futuro

#### 6. Roteiro da apresentação

Preparar narrativa para a demo:

1. Problema real
2. Por que blockchain faz sentido
3. Fluxo do contrato
4. Demonstração no sistema
5. Registro de hash/timestamp
6. Tentativa de fraude
7. Bloqueio por divergência
8. Conclusão: pagamento com rastreabilidade

### Entregas da Pessoa 1

- `README.md`
- `docs/visao_produto.md`
- `docs/regras_negocio.md`
- `docs/personas.md`
- `docs/roteiro_demo.md`
- Textos finais para interface
- Roteiro final de apresentação

---

## Pessoa 2 — Frontend / UI Lead / Apresentador

### Foco

Construção visual do sistema, experiência do usuário, navegação, telas e integração com API/wallet.

### Responsabilidade principal

Transformar o FiscalizaPay Web3 em uma aplicação visualmente forte, funcional e apresentável para a demo.

### Stack oficial

- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand
- React Hook Form
- Zod
- wagmi
- viem
- RainbowKit
- Lucide React

> **Stack descartada:** React + Vite, React Router e Ethers.js no frontend foram substituídos pela stack oficial acima.

---

### Funcionalidades sob responsabilidade

## 1. Layout base do sistema

Criar a estrutura visual principal:

- Header
- Sidebar ou navegação superior
- Área principal de conteúdo
- Cards de estatísticas
- Feedback visual de status
- Tema escuro seguindo a identidade Oraculum/FiscalizaPay

Critérios de aceite:

- Interface responsiva.
- Visual dark profissional.
- Boa hierarquia visual.
- Componentes reutilizáveis.
- Paleta consistente com tecnologia, blockchain e segurança.

---

## 2. Dashboard

Tela inicial com visão geral dos contratos.

Componentes:

- Total de contratos
- Contratos criados
- Aguardando fornecedor
- Aguardando entrega
- Aguardando fiscalização
- Pagamento autorizado
- Em disputa
- Progresso geral

Cards sugeridos:

```text
Total de contratos
Aguardando envio
Aguardando fiscalização
Pagamentos autorizados
Contratos em disputa
```

Critérios de aceite:

- Deve carregar dados mockados inicialmente.
- Depois deve consumir dados da API.
- Deve permitir clicar em um contrato e abrir detalhes.

---

## 3. Tela de cadastro de contrato

Formulário para o gestor criar um contrato.

Campos necessários:

- Número do contrato
- Órgão público
- Nome do fornecedor
- Carteira do fornecedor
- Objeto do contrato
- Valor
- Prazo
- Fiscal responsável
- Carteira do fiscal
- Gestor responsável
- Carteira do gestor
- Hash/documento inicial, se disponível

Critérios de aceite:

- Validação visual dos campos.
- Botão `Criar contrato`.
- Feedback de sucesso.
- Após criar, redirecionar para detalhe do contrato.

---

## 4. Tela de listagem de contratos

Tabela ou cards com contratos cadastrados.

Colunas sugeridas:

- Número
- Fornecedor
- Valor
- Status
- Próxima ação
- Última atualização
- Ação: ver detalhes

Critérios de aceite:

- Filtro por status.
- Busca por número/fornecedor.
- Badge visual por status.

---

## 5. Tela de detalhe do contrato

Tela mais importante da demo.

Deve mostrar:

- Dados principais do contrato
- Status atual
- Próxima etapa
- Responsável pela etapa
- Valor do contrato
- Prazo
- Botões de ação por perfil
- Timeline dos eventos
- Hashes/transações

Ações possíveis:

```text
Confirmar envio
Confirmar entrega
Validar recebimento
Autorizar pagamento
Abrir disputa
```

Critérios de aceite:

- Botões aparecem ou ficam habilitados de acordo com o status.
- A timeline atualiza após cada ação.
- Cada ação deve chamar a API.
- A interface deve exibir hash/tx quando retornar do backend.

---

## 6. Timeline auditável

Componente visual para mostrar cada etapa registrada.

Cada item da timeline deve exibir:

- Nome do evento
- Responsável
- Data/hora
- Status
- Hash
- Tx hash
- Link para explorer, se houver

Eventos esperados:

```text
CONTRATO_CRIADO
ENVIO_CONFIRMADO
ENTREGA_CONFIRMADA
RECEBIMENTO_VALIDADO
PAGAMENTO_AUTORIZADO
DISPUTA_ABERTA
FRAUDE_SIMULADA
HASH_REGISTRADO
```

Critérios de aceite:

- Timeline deve ser clara e visual.
- Eventos concluídos devem parecer finalizados.
- Evento atual deve ficar em destaque.
- Eventos futuros devem aparecer como pendentes.

---

## 7. Tela de disputa

Tela ou modal para divergências.

Funcionalidades:

- Abrir disputa
- Informar motivo
- Bloquear pagamento
- Exibir status `Em disputa`
- Mostrar divergência na timeline

Critérios de aceite:

- Deve ser possível simular tentativa de fraude.
- O sistema deve mostrar que o hash não bate.
- Pagamento deve ficar bloqueado visualmente.

---

## 8. Integração com carteira

Funcionalidades:

- Botão `Conectar carteira`
- Exibir endereço conectado
- Mostrar perfil com base na carteira
- Preparar integração com MetaMask

Critérios de aceite:

- Interface deve reconhecer wallet conectada.
- Deve exibir endereço curto.
- Deve estar pronta para consumir retorno da Pessoa 3.

### Entregas da Pessoa 2

- Frontend React funcional
- Dashboard
- Cadastro de contrato
- Listagem de contratos
- Detalhe do contrato
- Timeline auditável
- Ações por perfil
- Tela/modal de disputa
- Integração visual com API
- Integração visual com wallet
- Demonstração visual pronta para apresentação

---

## Pessoa 3 — Backend / Web3 Lead / Apresentador

### Foco

API, banco de dados, regras de status, smart contract, deploy em testnet e integração Web3.

### Responsabilidade principal

Garantir que o sistema tenha base técnica real, com persistência de dados, regras de validação e prova on-chain.

### Stack sugerida

- Node.js
- Express ou NestJS
- TypeScript
- Supabase ou PostgreSQL
- Prisma ou client do Supabase
- Solidity
- Hardhat
- Ethers.js
- Testnet Sepolia ou Polygon Amoy

---

### Funcionalidades sob responsabilidade

## 1. Modelagem do banco de dados

Tabelas sugeridas:

### `contracts`

Campos:

```text
id
contract_number
public_agency
supplier_name
supplier_wallet
object
amount
start_date
end_date
deadline
inspector_name
inspector_wallet
logistics_responsible
logistics_wallet
manager_name
manager_wallet
status
document_hash
blockchain_contract_id
created_at
updated_at
```

### `contract_events`

Campos:

```text
id
contract_id
event_type
responsible_role
responsible_name
responsible_wallet
description
status_before
status_after
document_hash
transaction_hash
blockchain_timestamp
created_at
```

### `disputes`

Campos:

```text
id
contract_id
opened_by
reason
old_hash
new_hash
status
created_at
resolved_at
```

### `users` ou `actors`

Campos:

```text
id
name
role
wallet_address
created_at
```

Critérios de aceite:

- Banco precisa representar contratos e eventos.
- Timeline deve vir da tabela de eventos.
- Status do contrato deve ser atualizado a cada etapa.

---

## 2. API REST

Endpoints sugeridos:

### Dashboard

```http
GET /dashboard/summary
```

### Contratos

```http
GET /contracts
POST /contracts
GET /contracts/:id
PATCH /contracts/:id
DELETE /contracts/:id
```

### Eventos por etapa

```http
POST /contracts/:id/confirm-shipment
POST /contracts/:id/confirm-delivery
POST /contracts/:id/validate-receipt
POST /contracts/:id/authorize-payment
POST /contracts/:id/open-dispute
POST /contracts/:id/simulate-fraud
```

### Timeline

```http
GET /contracts/:id/events
```

### Blockchain

```http
GET /contracts/:id/blockchain-status
POST /contracts/:id/register-on-chain
```

Critérios de aceite:

- Cada endpoint precisa validar status anterior.
- Não pode pular etapa.
- Deve retornar erro claro quando a ação for inválida.
- Deve salvar evento no banco.
- Deve retornar tx hash quando houver registro on-chain.

---

## 3. Regras de status no backend

Status oficiais (em português):

```ts
export type ContractStatus =
  | "CRIADO"
  | "ENVIADO"
  | "ENTREGUE"
  | "VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA";
```

Fluxo permitido:

```text
CRIADO
→ ENVIADO
→ ENTREGUE
→ VALIDADO
→ PAGAMENTO_AUTORIZADO
```

Fluxo alternativo:

```text
Qualquer etapa com divergência
→ DISPUTA
```

> **Status em inglês descartados:** CREATED, SHIPMENT_CONFIRMED, DELIVERY_CONFIRMED, RECEIPT_VALIDATED, PAYMENT_AUTHORIZED e DISPUTE não devem ser usados. Use apenas os status oficiais em português acima.

Critérios de aceite:

- Backend bloqueia etapas fora de ordem.
- Backend bloqueia pagamento sem validação.
- Backend registra histórico de cada mudança.
- Backend retorna dados prontos para a timeline.

---

## 4. Smart Contract Solidity

Contrato sugerido: `FiscalizaPay.sol`

### Enum de status

```solidity
enum Status {
    Criado,
    Enviado,
    Entregue,
    Validado,
    PagamentoAutorizado,
    Disputa
}
```

### Struct do contrato

```solidity
struct PublicContract {
    uint256 id;
    string documentHash;
    address manager;
    address supplier;
    address deliveryAgent;
    address fiscal;
    Status status;
    uint256 createdAt;
}
```

### Eventos

```solidity
event ContractCreated(uint256 indexed id, string documentHash, address manager, uint256 timestamp);
event ShipmentConfirmed(uint256 indexed id, address supplier, uint256 timestamp);
event DeliveryConfirmed(uint256 indexed id, address deliveryAgent, uint256 timestamp);
event ReceiptValidated(uint256 indexed id, address fiscal, uint256 timestamp);
event PaymentAuthorized(uint256 indexed id, address manager, uint256 timestamp);
event DisputeOpened(uint256 indexed id, address actor, string reason, uint256 timestamp);
```

### Funções principais

```solidity
function createContract(...) external;
function confirmShipment(uint256 id) external;
function confirmDelivery(uint256 id) external;
function validateReceipt(uint256 id) external;
function authorizePayment(uint256 id) external;
function openDispute(uint256 id, string memory reason) external;
```

Critérios de aceite:

- O contrato deve impedir avanço fora de ordem.
- Apenas carteira autorizada deve executar sua etapa.
- Cada ação deve emitir evento.
- O backend deve armazenar o hash da transação.

---

## 5. Integração backend + blockchain

Usar `ethers.js` no backend para:

- Conectar ao provider da testnet
- Instanciar contrato pelo ABI
- Chamar funções do smart contract
- Aguardar confirmação da transação
- Capturar `tx.hash`
- Salvar `tx_hash` no banco

Critérios de aceite:

- Cada ação crítica deve gerar ou simular transação.
- O retorno da API deve incluir `txHash`.
- O frontend deve conseguir exibir o hash.

---

## 6. Simulação de fraude

Criar endpoint ou lógica para simular divergência de hash:

```http
POST /contracts/:id/simulate-fraud
```

Comportamento:

1. Sistema recebe novo hash diferente do hash original.
2. Backend compara os hashes.
3. Se forem diferentes, abre disputa.
4. Pagamento fica bloqueado.
5. Evento `DisputaAberta` aparece na timeline.

Critérios de aceite:

- Demo precisa mostrar o efeito “uau”.
- A divergência precisa ficar clara visualmente.
- O pagamento não pode ser autorizado enquanto estiver em disputa.

### Entregas da Pessoa 3

- Banco modelado
- API funcional
- Endpoints por etapa
- Regras de status
- Smart contract Solidity
- Deploy em testnet
- ABI disponível para integração
- Integração com ethers.js
- Retorno de hash/transação
- Simulação de disputa/fraude
- Explicação técnica para apresentação

---

## 5. Ordem de execução recomendada

## Etapa 0 — Alinhamento rápido

Responsável: **Pessoa 1**  
Apoio: Pessoa 2 e Pessoa 3

Tarefas:

- Confirmar escopo do MVP
- Confirmar fluxo principal
- Confirmar tecnologias
- Confirmar nomes das telas
- Confirmar papéis do sistema
- Separar tarefas no checklist

Entrega esperada:

- Fluxo validado
- Escopo travado
- Equipe alinhada

---

## Etapa 1 — Design system e base visual

Responsável: **Pessoa 2**  
Apoio: Pessoa 1

Tarefas:

- Aplicar paleta Oraculum/FiscalizaPay
- Criar layout base
- Criar componentes de card
- Criar badges de status
- Criar botões de ação
- Criar estrutura de páginas

Entrega esperada:

- Frontend com identidade visual pronta
- Navegação inicial funcionando

---

## Etapa 2 — Modelagem de dados e API base

Responsável: **Pessoa 3**

Tarefas:

- Criar estrutura do backend
- Configurar Supabase/PostgreSQL
- Criar tabelas
- Criar endpoints de contratos
- Criar endpoints de eventos
- Criar endpoint de dashboard

Entrega esperada:

- API rodando localmente
- Banco pronto
- Frontend já consegue consumir dados

---

## Etapa 3 — Frontend com dados mockados

Responsável: **Pessoa 2**

Tarefas:

- Criar dashboard mockado
- Criar listagem de contratos mockada
- Criar tela de detalhe mockada
- Criar timeline mockada
- Criar botões de ação mockados

Entrega esperada:

- Demo visual navegável mesmo sem backend finalizado

---

## Etapa 4 — Smart contract

Responsável: **Pessoa 3**

Tarefas:

- Criar contrato Solidity
- Criar enum de status
- Criar struct
- Criar eventos
- Criar funções por etapa
- Criar testes básicos
- Fazer deploy em testnet
- Exportar ABI e endereço do contrato

Entrega esperada:

- Smart contract deployado
- Endereço e ABI documentados

---

## Etapa 5 — Integração frontend + backend

Responsáveis: **Pessoa 2 + Pessoa 3**

Tarefas Pessoa 2:

- Substituir mocks por chamadas reais
- Integrar dashboard com API
- Integrar cadastro com API
- Integrar detalhe com API
- Integrar timeline com API

Tarefas Pessoa 3:

- Ajustar payloads
- Corrigir CORS
- Padronizar respostas
- Retornar tx hash
- Validar regras de status

Entrega esperada:

- Sistema funcional ponta a ponta

---

## Etapa 6 — Integração Web3

Responsável: **Pessoa 3**  
Apoio: Pessoa 2

Tarefas:

- Conectar ethers.js
- Enviar transações para testnet
- Retornar tx hash para frontend
- Exibir link da transação
- Validar evento on-chain

Entrega esperada:

- Pelo menos uma etapa com registro real ou simulado on-chain
- Hash visível na interface

---

## Etapa 7 — Disputa e tentativa de fraude

Responsáveis: **Pessoa 2 + Pessoa 3**  
Apoio: Pessoa 1

Tarefas:

- Criar ação de simular alteração de documento
- Comparar hash antigo com novo
- Abrir disputa
- Bloquear pagamento
- Exibir alerta visual na interface
- Registrar evento na timeline

Entrega esperada:

- Cena de impacto para a apresentação final

---

## Etapa 8 — Documentação final e pitch

Responsável: **Pessoa 1**  
Apoio: Todos

Tarefas:

- Finalizar README
- Criar roteiro da demo
- Organizar prints
- Escrever explicação técnica
- Criar pitch final
- Ensaiar com Pessoa 2 e Pessoa 3

Entrega esperada:

- Apresentação pronta
- Repositório organizado
- Demo com narrativa clara

---

## 6. Funcionalidades do MVP por prioridade

## Prioridade 1 — Obrigatório

Essencial para a demo funcionar.

- Dashboard
- Criar contrato
- Listar contratos
- Ver detalhe do contrato
- Confirmar envio
- Confirmar entrega
- Validar recebimento
- Autorizar pagamento
- Timeline de eventos
- Registro de hash/transação

## Prioridade 2 — Importante

Aumenta qualidade e diferenciação.

- Conectar carteira
- Perfil por carteira
- Disputa
- Hash do documento
- Link para explorer
- Filtros por status
- Feedback visual profissional

## Prioridade 3 — Bônus

Só fazer se sobrar tempo.

- Upload real de documento
- Comparação real de arquivo/hash
- Autenticação por perfil
- Auditoria avançada
- Score de risco
- Exportação de relatório PDF

---

## 7. Checklist por pessoa

## Pessoa 1 — Checklist

- [ ] Definir problema central
- [ ] Definir proposta de valor
- [ ] Documentar personas
- [ ] Documentar fluxo principal
- [ ] Documentar regras de negócio
- [ ] Escrever textos da interface
- [ ] Escrever README
- [ ] Escrever roteiro da demo
- [ ] Escrever roadmap futuro
- [ ] Validar se a demo conta uma história clara

## Pessoa 2 — Checklist

- [ ] Criar projeto Next.js com App Router e TypeScript
- [ ] Configurar TailwindCSS
- [ ] Configurar shadcn/ui
- [ ] Configurar wagmi + viem + RainbowKit
- [ ] Configurar TanStack Query e Zustand
- [ ] Criar estrutura Feature-Sliced Design (app/pages/widgets/features/entities/shared)
- [ ] Criar mocks isolados em shared/mocks
- [ ] Criar layout base (sidebar + header)
- [ ] Criar dashboard com métricas
- [ ] Criar listagem de contratos
- [ ] Criar cadastro de contrato
- [ ] Criar detalhe do contrato
- [ ] Criar timeline auditável
- [ ] Criar badges de status (CRIADO, ENVIADO, ENTREGUE, VALIDADO, PAGAMENTO_AUTORIZADO, DISPUTA)
- [ ] Criar painel de ações por perfil/status
- [ ] Integrar com API real (substituir mocks)
- [ ] Exibir documentHash e transactionHash
- [ ] Criar tela/modal de disputa
- [ ] Criar simulação de fraude por hash
- [ ] Preparar apresentação visual

## Pessoa 3 — Checklist

- [ ] Criar backend
- [ ] Configurar banco
- [ ] Criar modelagem de contratos
- [ ] Criar modelagem de eventos
- [ ] Criar endpoints REST
- [ ] Criar regras de status
- [ ] Criar smart contract
- [ ] Criar eventos Solidity
- [ ] Fazer deploy em testnet
- [ ] Integrar ethers.js
- [ ] Retornar tx hash para frontend
- [ ] Criar simulação de fraude
- [ ] Preparar explicação técnica

---

## 8. Critérios de pronto do MVP

O projeto pode ser considerado pronto para apresentação quando:

- [ ] Um contrato pode ser criado.
- [ ] O contrato aparece no dashboard/listagem.
- [ ] O fornecedor consegue confirmar envio.
- [ ] O entregador consegue confirmar entrega.
- [ ] O fiscal consegue validar recebimento.
- [ ] O gestor consegue autorizar pagamento.
- [ ] Cada etapa aparece na timeline.
- [ ] Cada etapa tem data, responsável e status.
- [ ] Pelo menos um hash/transação aparece na interface.
- [ ] A tentativa de fraude bloqueia o pagamento.
- [ ] O README explica como rodar o projeto.
- [ ] A equipe consegue apresentar o fluxo em menos de 5 minutos.

---

## 9. Roteiro sugerido para demo

1. Mostrar o problema: contratos pagos sem validação clara.
2. Mostrar o dashboard do FiscalizaPay.
3. Criar contrato de exemplo.
4. Fornecedor confirma envio.
5. Entregador confirma entrega.
6. Fiscal valida recebimento.
7. Gestor autoriza pagamento.
8. Mostrar timeline com hashes.
9. Simular alteração de documento.
10. Mostrar bloqueio por hash divergente.
11. Finalizar com a frase:

```text
No FiscalizaPay, o pagamento só avança quando existe comprovação, conformidade e rastreabilidade.
```

---

## 10. Sugestão de estrutura de pastas

```text
fiscalizapay-web3/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── pages/
│   │   ├── widgets/
│   │   ├── features/
│   │   ├── entities/
│   │   └── shared/
│   └── README.md
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── database/
│   │   ├── web3/
│   │   └── types/
│   └── README.md
│
├── contracts/
│   ├── contracts/
│   │   └── FiscalizaPay.sol
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.ts
│
├── docs/
│   ├── visao_produto.md
│   ├── regras_negocio.md
│   ├── arquitetura.md
│   ├── personas.md
│   └── roteiro_demo.md
│
└── README.md
```

---

## 11. Observações finais

A equipe deve priorizar o fluxo principal antes de qualquer funcionalidade extra. O valor da solução não está apenas em cadastrar contratos, mas em provar que cada etapa foi validada por uma parte responsável e registrada de forma auditável.

O diferencial da apresentação será mostrar que:

- O sistema impede pagamento sem fiscalização.
- O histórico fica rastreável.
- O hash prova integridade.
- A blockchain atua como camada de confiança.
- A interface torna o processo simples para o usuário.
