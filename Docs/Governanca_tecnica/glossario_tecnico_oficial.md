# FiscalizaPay Web3 — Glossário Técnico Oficial

> **Status:** Oficial — não usar termos alternativos  
> **Referência:** `Docs/decisoes_tecnicas_finais.md` e `Docs/analises/fiscalizapay_analise_coerencia_decisoes_oficiais.md`

Este documento define os termos técnicos oficiais do projeto FiscalizaPay Web3. Nenhum código, documentação ou mock deve usar terminologia fora deste glossário como padrão.

---

## 1. Status do Contrato

Enum oficial TypeScript:

```ts
export type ContractStatus =
  | "CRIADO"
  | "ENVIADO"
  | "ENTREGUE"
  | "VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA";
```

### Significado de cada status

| Status | Significado | Quem avança |
|---|---|---|
| `CRIADO` | Contrato registrado, aguardando confirmação do fornecedor | Gestor (criou) |
| `ENVIADO` | Fornecedor confirmou envio/execução | Fornecedor |
| `ENTREGUE` | Entregador confirmou entrega no local | Entregador |
| `VALIDADO` | Fiscal validou conformidade da entrega | Fiscal |
| `PAGAMENTO_AUTORIZADO` | Gestor autorizou o pagamento | Gestor |
| `DISPUTA` | Divergência registrada, pagamento bloqueado | Qualquer role autorizada |

### Transições permitidas

```txt
CRIADO → ENVIADO
ENVIADO → ENTREGUE
ENTREGUE → VALIDADO
VALIDADO → PAGAMENTO_AUTORIZADO
Qualquer status (exceto PAGAMENTO_AUTORIZADO) → DISPUTA
```

---

## 2. Roles do Sistema

Enum oficial TypeScript:

```ts
export type UserRole =
  | "GESTOR"
  | "FORNECEDOR"
  | "ENTREGADOR"
  | "FISCAL"
  | "AUDITOR";
```

### Significado de cada role

| Role | Descrição | Principais ações |
|---|---|---|
| `GESTOR` | Gestor público responsável pelo contrato | Criar, autorizar pagamento, abrir disputa |
| `FORNECEDOR` | Empresa ou pessoa que fornece o serviço/produto | Confirmar envio |
| `ENTREGADOR` | Responsável logístico pela entrega | Confirmar entrega |
| `FISCAL` | Fiscal do contrato que valida conformidade | Validar recebimento, abrir disputa |
| `AUDITOR` | Auditor com acesso somente leitura | Visualizar timeline, consultar hashes |

---

## 3. Event Types Oficiais

Enum oficial TypeScript:

```ts
export type ContractEventType =
  | "CONTRATO_CRIADO"
  | "ENVIO_CONFIRMADO"
  | "ENTREGA_CONFIRMADA"
  | "RECEBIMENTO_VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA_ABERTA"
  | "FRAUDE_SIMULADA"
  | "HASH_REGISTRADO";
```

### Mapa de eventos por ação

| Ação | Event type gerado |
|---|---|
| POST /contracts | `CONTRATO_CRIADO` |
| POST /contracts/:id/confirm-shipment | `ENVIO_CONFIRMADO` |
| POST /contracts/:id/confirm-delivery | `ENTREGA_CONFIRMADA` |
| POST /contracts/:id/validate-receipt | `RECEBIMENTO_VALIDADO` |
| POST /contracts/:id/authorize-payment | `PAGAMENTO_AUTORIZADO` |
| POST /contracts/:id/open-dispute | `DISPUTA_ABERTA` |
| POST /contracts/:id/simulate-fraud | `FRAUDE_SIMULADA` + `DISPUTA_ABERTA` |
| POST /contracts/:id/register-on-chain | `HASH_REGISTRADO` |

---

## 4. Entidades do Sistema

### 4.1 Contract

```ts
export interface Contract {
  id: string;
  contractNumber: string;
  publicAgency: string;
  supplierName: string;
  supplierWallet?: string;
  object: string;
  amount: number;
  startDate?: string;
  endDate?: string;
  deadline: string;
  inspectorName: string;
  inspectorWallet?: string;
  logisticsResponsible: string;
  logisticsWallet?: string;
  managerName?: string;
  managerWallet?: string;
  status: ContractStatus;
  documentHash?: string;
  blockchainContractId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.2 ContractEvent

```ts
export interface ContractEvent {
  id: string;
  contractId: string;
  eventType: ContractEventType;
  description: string;
  responsibleRole: UserRole;
  responsibleName?: string;
  responsibleWallet?: string;
  statusBefore?: ContractStatus;
  statusAfter?: ContractStatus;
  documentHash?: string;
  transactionHash?: string;
  blockchainTimestamp?: string;
  createdAt: string;
}
```

### 4.3 Profile

```ts
export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 4.4 DashboardSummary

```ts
export interface DashboardSummary {
  total: number;
  criado: number;
  enviado: number;
  entregue: number;
  validado: number;
  pagamentoAutorizado: number;
  disputa: number;
}
```

### 4.5 BlockchainStatus

```ts
export interface BlockchainStatus {
  contractId: string;
  status: ContractStatus;
  documentHash?: string;
  transactionHash?: string;
  blockNumber?: number;
  timestamp?: string;
  registeredOnChain: boolean;
}
```

---

## 5. Campos Principais

### 5.1 Campos do banco de dados (snake_case)

| Campo (banco) | Campo (API/Frontend) | Tipo | Obrigatório |
|---|---|---|---|
| `id` | `id` | string (UUID) | sim |
| `contract_number` | `contractNumber` | string | sim |
| `public_agency` | `publicAgency` | string | sim |
| `supplier_name` | `supplierName` | string | sim |
| `supplier_wallet` | `supplierWallet` | string | não |
| `object` | `object` | string | sim |
| `amount` | `amount` | number | sim |
| `start_date` | `startDate` | string (ISO) | não |
| `end_date` | `endDate` | string (ISO) | não |
| `deadline` | `deadline` | string (ISO) | sim |
| `inspector_name` | `inspectorName` | string | sim |
| `inspector_wallet` | `inspectorWallet` | string | não |
| `logistics_responsible` | `logisticsResponsible` | string | sim |
| `logistics_wallet` | `logisticsWallet` | string | não |
| `manager_name` | `managerName` | string | não |
| `manager_wallet` | `managerWallet` | string | não |
| `status` | `status` | ContractStatus | sim |
| `document_hash` | `documentHash` | string | não |
| `blockchain_contract_id` | `blockchainContractId` | string | não |
| `created_at` | `createdAt` | string (ISO) | sim |
| `updated_at` | `updatedAt` | string (ISO) | sim |

### 5.2 Campos de eventos (snake_case → camelCase)

| Campo (banco) | Campo (API/Frontend) | Tipo | Obrigatório |
|---|---|---|---|
| `id` | `id` | string (UUID) | sim |
| `contract_id` | `contractId` | string | sim |
| `event_type` | `eventType` | ContractEventType | sim |
| `description` | `description` | string | sim |
| `responsible_role` | `responsibleRole` | UserRole | sim |
| `responsible_name` | `responsibleName` | string | não |
| `responsible_wallet` | `responsibleWallet` | string | não |
| `status_before` | `statusBefore` | ContractStatus | não |
| `status_after` | `statusAfter` | ContractStatus | não |
| `document_hash` | `documentHash` | string | não |
| `transaction_hash` | `transactionHash` | string | não |
| `blockchain_timestamp` | `blockchainTimestamp` | string (ISO) | não |
| `created_at` | `createdAt` | string (ISO) | sim |

---

## 6. Componentes Frontend Oficiais

```txt
AppSidebar             → sidebar da aplicação
AppHeader              → header global
PageHeader             → cabeçalho interno de tela
DashboardMetricCard    → card de métrica do dashboard
ContractCard           → card de contrato na listagem
ContractStatusBadge    → badge visual do status do contrato
ContractTimeline       → linha do tempo de eventos
ContractEventCard      → card de evento individual na timeline
ContractActionPanel    → painel de ações disponíveis por status/role
WalletConnectButton    → botão de conexão de wallet
WalletStatus           → exibição do endereço conectado e rede
TransactionHashLink    → link para explorer da tx hash
DocumentHashViewer     → exibição e comparação de document hash
RoleBadge              → badge visual do papel do usuário
PermissionGate         → wrapper que esconde elementos sem permissão
EmptyState             → estado de lista vazia
ErrorState             → estado de erro
LoadingState           → estado de carregamento (skeleton)
```

---

## 7. Hooks Frontend Oficiais

```txt
useContracts           → busca lista de contratos
useContractById        → busca contrato por ID
useContractEvents      → busca eventos de um contrato
useDashboardSummary    → busca resumo do dashboard
useCreateContract      → mutação de criação de contrato
useConfirmShipment     → mutação de confirmação de envio
useConfirmDelivery     → mutação de confirmação de entrega
useValidateReceipt     → mutação de validação de recebimento
useAuthorizePayment    → mutação de autorização de pagamento
useOpenDispute         → mutação de abertura de disputa
useSimulateFraud       → mutação de simulação de fraude
useBlockchainStatus    → busca status on-chain do contrato
useConnectWallet       → hook de conexão de wallet (wagmi)
```

---

## 8. Query Keys Oficiais (TanStack Query)

```ts
const QUERY_KEYS = {
  dashboardSummary: ["dashboard-summary"] as const,
  contracts: ["contracts"] as const,
  contract: (id: string) => ["contract", id] as const,
  contractEvents: (id: string) => ["contract-events", id] as const,
  blockchainStatus: (id: string) => ["blockchain-status", id] as const,
};
```

---

## 9. DTOs Backend Oficiais

```txt
CreateContractDto      → corpo de criação de contrato
UpdateContractDto      → corpo de atualização parcial de contrato
ConfirmShipmentDto     → corpo de confirmação de envio
ConfirmDeliveryDto     → corpo de confirmação de entrega
ValidateReceiptDto     → corpo de validação de recebimento
AuthorizePaymentDto    → corpo de autorização de pagamento
OpenDisputeDto         → corpo de abertura de disputa
SimulateFraudDto       → corpo de simulação de fraude
```

---

## 10. Schemas Zod Oficiais (Frontend)

```txt
createContractSchema      → validação de criação de contrato
confirmShipmentSchema     → validação de confirmação de envio
confirmDeliverySchema     → validação de confirmação de entrega
validateReceiptSchema     → validação de recebimento
authorizePaymentSchema    → validação de autorização de pagamento
openDisputeSchema         → validação de abertura de disputa
simulateFraudSchema       → validação de simulação de fraude
```

---

## 11. Termos Web3

| Termo | Significado |
|---|---|
| `documentHash` | Hash SHA-256 ou keccak256 do documento/contrato off-chain |
| `transactionHash` | Hash da transação blockchain (começa com `0x`) |
| `blockchainContractId` | ID interno do contrato no smart contract |
| `actorWallet` | Endereço da carteira que executou a ação (formato `0x...`) |
| `blockNumber` | Número do bloco blockchain onde a tx foi incluída |
| `blockchainTimestamp` | Timestamp registrado na blockchain |
| `onChain` | Dados registrados na blockchain |
| `offChain` | Dados armazenados no banco de dados off-chain |
| `testnet` | Rede blockchain de testes (Polygon Amoy oficial) |
| `explorer` | Block explorer para consultar transações (PolygonScan Amoy) |

---

## 12. Termos Proibidos como Oficiais

Os termos abaixo foram descartados e **não devem ser usados** em código, documentação ou mocks como padrão oficial:

### Status descartados

```txt
CREATED             → usar CRIADO
SHIPMENT_CONFIRMED  → usar ENVIADO
DELIVERY_CONFIRMED  → usar ENTREGUE
RECEIPT_VALIDATED   → usar VALIDADO
PAYMENT_AUTHORIZED  → usar PAGAMENTO_AUTORIZADO
DISPUTE             → usar DISPUTA
```

### Variáveis de ambiente descartadas

```txt
VITE_API_URL        → usar NEXT_PUBLIC_API_URL
VITE_CHAIN_ID       → usar NEXT_PUBLIC_CHAIN_ID
VITE_CONTRACT_ADDRESS → usar NEXT_PUBLIC_CONTRACT_ADDRESS
VITE_SUPABASE_URL   → não usado no frontend (apenas no backend)
```

### Stack descartada

```txt
React sem Next.js   → usar Next.js App Router
Vite                → descartado como stack oficial
React Router        → descartado (Next.js App Router é o roteador)
Ethers.js no frontend → descartado (usar wagmi + viem + RainbowKit)
```

### Arquitetura descartada

```txt
components/         → descartado como pasta raiz
services/           → descartado como pasta raiz
hooks/              → descartado como pasta raiz
types/              → descartado como pasta raiz
utils/              → descartado como pasta raiz
```

A arquitetura oficial é Feature-Sliced Design: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`.

### Nomes de campos descartados

```txt
actor_role          → usar responsible_role
actor_wallet        → usar responsible_wallet
status_from         → usar status_before
status_to           → usar status_after
tx_hash             → usar transaction_hash
fiscal_name         → usar inspector_name
fiscal_wallet       → usar inspector_wallet
```

### Eventos descartados

```txt
ContratoCriado      → usar CONTRATO_CRIADO
EnvioConfirmado     → usar ENVIO_CONFIRMADO
EntregaConfirmada   → usar ENTREGA_CONFIRMADA
RecebimentoValidado → usar RECEBIMENTO_VALIDADO
PagamentoAutorizado → usar PAGAMENTO_AUTORIZADO (no event type)
DisputaAberta       → usar DISPUTA_ABERTA
```

---

*Documento fechado na Session Two de Coerência — 2026-05-28*
