# FiscalizaPay Web3 — Contrato API Frontend/Backend

> **Status:** Oficial — implementação deve seguir este documento  
> **Sessão:** Session Two de Coerência  
> **Referência:** `Docs/decisoes_tecnicas_finais.md` | `Docs/glossario_tecnico_oficial.md`

Este documento define o contrato de integração entre o frontend (Next.js) e o backend (NestJS/Node.js). Toda implementação deve seguir os formatos aqui definidos.

---

## 1. Objetivo

Garantir que frontend e backend implementem a mesma interface de dados, sem divergências de formato, nomenclatura ou expectativa de resposta.

---

## 2. Padrões Gerais

### 2.1 URL base

```txt
Desenvolvimento: http://localhost:3001
Produção:        variável NEXT_PUBLIC_API_URL
```

### 2.2 Headers obrigatórios

```http
Content-Type: application/json
Accept: application/json
```

### 2.3 Formato dos dados

```txt
API recebe (request body): camelCase
API retorna (response body): camelCase
Banco de dados internamente: snake_case
```

### 2.4 Formato de datas

```txt
Todas as datas em formato ISO 8601: "2026-05-28T14:00:00.000Z"
```

### 2.5 Formato de hashes

```txt
documentHash:    string hex sem prefixo (ex: "abc123def456...")
transactionHash: string hex com prefixo 0x (ex: "0xabc123...")
walletAddress:   string hex com prefixo 0x (ex: "0x742d35Cc...")
```

---

## 3. Tipos Oficiais

```ts
export type ContractStatus =
  | "CRIADO"
  | "ENVIADO"
  | "ENTREGUE"
  | "VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA";

export type UserRole =
  | "GESTOR"
  | "FORNECEDOR"
  | "ENTREGADOR"
  | "FISCAL"
  | "AUDITOR";

export type ContractEventType =
  | "CONTRATO_CRIADO"
  | "ENVIO_CONFIRMADO"
  | "ENTREGA_CONFIRMADA"
  | "RECEBIMENTO_VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA_ABERTA"
  | "FRAUDE_SIMULADA"
  | "HASH_REGISTRADO";

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

export interface DashboardSummary {
  total: number;
  criado: number;
  enviado: number;
  entregue: number;
  validado: number;
  pagamentoAutorizado: number;
  disputa: number;
}

export interface BlockchainStatus {
  contractId: string;
  status: ContractStatus;
  documentHash?: string;
  transactionHash?: string;
  blockNumber?: number;
  blockchainTimestamp?: string;
  registeredOnChain: boolean;
}
```

---

## 4. Formato de Resposta de Sucesso

Todo endpoint de sucesso deve retornar:

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

Exemplos:

```json
{ "data": { ...contract } }
{ "data": [ ...contracts ] }
{ "data": { ...contract }, "message": "Contrato criado com sucesso." }
```

---

## 5. Formato de Resposta de Erro

Todo endpoint de erro deve retornar:

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

| Código | Uso | HTTP Status |
|---|---|---|
| `VALIDATION_ERROR` | Campos obrigatórios ausentes ou inválidos | 400 |
| `NOT_FOUND` | Contrato não encontrado | 404 |
| `INVALID_STATUS_TRANSITION` | Ação executada no status errado | 422 |
| `UNAUTHORIZED_ROLE` | Role não tem permissão para a ação | 403 |
| `BLOCKCHAIN_ERROR` | Erro na comunicação com a blockchain | 502 |
| `INTERNAL_ERROR` | Erro interno do servidor | 500 |

Exemplo:

```json
{
  "message": "Esta ação requer que o contrato esteja no status CRIADO.",
  "code": "INVALID_STATUS_TRANSITION",
  "details": { "currentStatus": "ENTREGUE", "requiredStatus": "CRIADO" }
}
```

---

## 6. Endpoint: GET /dashboard/summary

**Objetivo:** retornar métricas de contratos por status para o dashboard.

**Role:** qualquer usuário autenticado (GESTOR, AUDITOR, etc.)

**Query key:** `["dashboard-summary"]`

### Request

```http
GET /dashboard/summary
```

Sem body.

### Response (sucesso 200)

```json
{
  "data": {
    "total": 12,
    "criado": 3,
    "enviado": 2,
    "entregue": 1,
    "validado": 2,
    "pagamentoAutorizado": 3,
    "disputa": 1
  }
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `INTERNAL_ERROR` | Falha ao consultar banco |

---

## 7. Endpoints: Contratos

### 7.1 GET /contracts

**Objetivo:** listar todos os contratos.

**Query key:** `["contracts"]`

**Query params opcionais:**

```txt
status?  → filtrar por status (CRIADO, ENVIADO, etc.)
page?    → paginação futura (padrão: 1)
limit?   → itens por página (padrão: 20)
```

### Request

```http
GET /contracts?status=CRIADO
```

### Response (sucesso 200)

```json
{
  "data": [
    {
      "id": "uuid-1",
      "contractNumber": "CT-2026-001",
      "publicAgency": "Prefeitura de São Paulo",
      "supplierName": "Empresa ABC Ltda",
      "supplierWallet": "0x742d35Cc...",
      "object": "Fornecimento de equipamentos de informática",
      "amount": 150000.00,
      "deadline": "2026-08-31T23:59:59.000Z",
      "inspectorName": "João Silva",
      "logisticsResponsible": "Transportadora XYZ",
      "status": "CRIADO",
      "documentHash": "abc123def456...",
      "createdAt": "2026-05-28T10:00:00.000Z",
      "updatedAt": "2026-05-28T10:00:00.000Z"
    }
  ]
}
```

---

### 7.2 POST /contracts

**Objetivo:** criar um novo contrato.

**Role:** GESTOR

**Evento gerado:** `CONTRATO_CRIADO`

**Status inicial:** `CRIADO`

### Request Body

```ts
interface CreateContractBody {
  contractNumber: string;       // obrigatório
  publicAgency: string;         // obrigatório
  supplierName: string;         // obrigatório
  supplierWallet?: string;
  object: string;               // obrigatório
  amount: number;               // obrigatório, > 0
  startDate?: string;           // ISO 8601
  endDate?: string;             // ISO 8601
  deadline: string;             // obrigatório, ISO 8601
  inspectorName: string;        // obrigatório
  inspectorWallet?: string;
  logisticsResponsible: string; // obrigatório
  logisticsWallet?: string;
  managerName?: string;
  managerWallet?: string;
  documentHash?: string;
}
```

### Request (exemplo)

```json
{
  "contractNumber": "CT-2026-001",
  "publicAgency": "Prefeitura de São Paulo",
  "supplierName": "Empresa ABC Ltda",
  "supplierWallet": "0x742d35Cc...",
  "object": "Fornecimento de equipamentos de informática",
  "amount": 150000.00,
  "deadline": "2026-08-31T23:59:59.000Z",
  "inspectorName": "João Silva",
  "inspectorWallet": "0x1234abcd...",
  "logisticsResponsible": "Transportadora XYZ",
  "managerName": "Maria Santos",
  "managerWallet": "0xdeadbeef...",
  "documentHash": "sha256-do-contrato-pdf"
}
```

### Response (sucesso 201)

```json
{
  "data": {
    "id": "uuid-gerado",
    "contractNumber": "CT-2026-001",
    "publicAgency": "Prefeitura de São Paulo",
    "supplierName": "Empresa ABC Ltda",
    "object": "Fornecimento de equipamentos de informática",
    "amount": 150000.00,
    "deadline": "2026-08-31T23:59:59.000Z",
    "inspectorName": "João Silva",
    "logisticsResponsible": "Transportadora XYZ",
    "status": "CRIADO",
    "documentHash": "sha256-do-contrato-pdf",
    "createdAt": "2026-05-28T10:00:00.000Z",
    "updatedAt": "2026-05-28T10:00:00.000Z"
  },
  "message": "Contrato criado com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `VALIDATION_ERROR` | Campos obrigatórios ausentes ou inválidos |
| `UNAUTHORIZED_ROLE` | Usuário não é GESTOR |

---

### 7.3 GET /contracts/:id

**Objetivo:** buscar detalhes de um contrato por ID.

**Query key:** `["contract", contractId]`

### Request

```http
GET /contracts/uuid-1
```

### Response (sucesso 200)

```json
{
  "data": {
    "id": "uuid-1",
    "contractNumber": "CT-2026-001",
    "publicAgency": "Prefeitura de São Paulo",
    "supplierName": "Empresa ABC Ltda",
    "supplierWallet": "0x742d35Cc...",
    "object": "Fornecimento de equipamentos de informática",
    "amount": 150000.00,
    "deadline": "2026-08-31T23:59:59.000Z",
    "inspectorName": "João Silva",
    "inspectorWallet": "0x1234abcd...",
    "logisticsResponsible": "Transportadora XYZ",
    "managerName": "Maria Santos",
    "managerWallet": "0xdeadbeef...",
    "status": "ENVIADO",
    "documentHash": "abc123...",
    "blockchainContractId": "42",
    "createdAt": "2026-05-28T10:00:00.000Z",
    "updatedAt": "2026-05-28T11:30:00.000Z"
  }
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `NOT_FOUND` | Contrato não encontrado |

---

### 7.4 PATCH /contracts/:id

**Objetivo:** atualizar dados editáveis de um contrato (apenas quando status = CRIADO).

**Role:** GESTOR

### Request Body

```ts
interface UpdateContractBody {
  contractNumber?: string;
  publicAgency?: string;
  supplierName?: string;
  supplierWallet?: string;
  object?: string;
  amount?: number;
  startDate?: string;
  endDate?: string;
  deadline?: string;
  inspectorName?: string;
  inspectorWallet?: string;
  logisticsResponsible?: string;
  logisticsWallet?: string;
  managerName?: string;
  managerWallet?: string;
  documentHash?: string;
}
```

### Response (sucesso 200)

```json
{
  "data": { ...contrato atualizado },
  "message": "Contrato atualizado com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `NOT_FOUND` | Contrato não encontrado |
| `INVALID_STATUS_TRANSITION` | Contrato não está em CRIADO |
| `UNAUTHORIZED_ROLE` | Usuário não é GESTOR |

---

### 7.5 DELETE /contracts/:id

**Objetivo:** excluir contrato (apenas quando status = CRIADO e sem eventos).

**Role:** GESTOR

### Response (sucesso 200)

```json
{
  "data": null,
  "message": "Contrato excluído com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `NOT_FOUND` | Contrato não encontrado |
| `INVALID_STATUS_TRANSITION` | Contrato não está em CRIADO |
| `UNAUTHORIZED_ROLE` | Usuário não é GESTOR |

---

## 8. Endpoint: GET /contracts/:id/events

**Objetivo:** listar todos os eventos de um contrato em ordem cronológica.

**Query key:** `["contract-events", contractId]`

### Request

```http
GET /contracts/uuid-1/events
```

### Response (sucesso 200)

```json
{
  "data": [
    {
      "id": "evt-uuid-1",
      "contractId": "uuid-1",
      "eventType": "CONTRATO_CRIADO",
      "description": "Contrato CT-2026-001 criado por Maria Santos.",
      "responsibleRole": "GESTOR",
      "responsibleName": "Maria Santos",
      "responsibleWallet": "0xdeadbeef...",
      "statusBefore": null,
      "statusAfter": "CRIADO",
      "documentHash": "abc123...",
      "transactionHash": null,
      "blockchainTimestamp": null,
      "createdAt": "2026-05-28T10:00:00.000Z"
    },
    {
      "id": "evt-uuid-2",
      "contractId": "uuid-1",
      "eventType": "ENVIO_CONFIRMADO",
      "description": "Envio confirmado pela Empresa ABC Ltda.",
      "responsibleRole": "FORNECEDOR",
      "responsibleName": "Carlos Fornecedor",
      "responsibleWallet": "0x742d35Cc...",
      "statusBefore": "CRIADO",
      "statusAfter": "ENVIADO",
      "documentHash": null,
      "transactionHash": "0xabc123txhash...",
      "blockchainTimestamp": "2026-05-28T11:30:00.000Z",
      "createdAt": "2026-05-28T11:30:00.000Z"
    }
  ]
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `NOT_FOUND` | Contrato não encontrado |

---

## 9. Endpoints de Ações do Fluxo

### 9.1 POST /contracts/:id/confirm-shipment

**Objetivo:** fornecedor confirma envio ou execução do serviço.

**Role:** FORNECEDOR

**Status antes:** `CRIADO`

**Status depois:** `ENVIADO`

**Evento gerado:** `ENVIO_CONFIRMADO`

### Request Body

```ts
interface ConfirmShipmentBody {
  role: "FORNECEDOR";        // obrigatório
  actorWallet?: string;      // endereço da carteira do fornecedor
  description?: string;      // observação opcional
}
```

```json
{
  "role": "FORNECEDOR",
  "actorWallet": "0x742d35Cc...",
  "description": "Produto enviado via transportadora XYZ, código de rastreio: BR123456789."
}
```

### Response (sucesso 200)

```json
{
  "data": {
    "id": "uuid-1",
    "status": "ENVIADO",
    "updatedAt": "2026-05-28T11:30:00.000Z",
    "event": {
      "id": "evt-uuid-2",
      "eventType": "ENVIO_CONFIRMADO",
      "transactionHash": "0xabc123txhash...",
      "createdAt": "2026-05-28T11:30:00.000Z"
    }
  },
  "message": "Envio confirmado com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `INVALID_STATUS_TRANSITION` | Contrato não está em CRIADO |
| `UNAUTHORIZED_ROLE` | Role não é FORNECEDOR |
| `NOT_FOUND` | Contrato não encontrado |

---

### 9.2 POST /contracts/:id/confirm-delivery

**Objetivo:** entregador/logística confirma entrega no local.

**Role:** ENTREGADOR

**Status antes:** `ENVIADO`

**Status depois:** `ENTREGUE`

**Evento gerado:** `ENTREGA_CONFIRMADA`

### Request Body

```ts
interface ConfirmDeliveryBody {
  role: "ENTREGADOR";
  actorWallet?: string;
  description?: string;
}
```

```json
{
  "role": "ENTREGADOR",
  "actorWallet": "0xlogistica...",
  "description": "Entrega realizada no almoxarifado central. Recibo assinado."
}
```

### Response (sucesso 200)

```json
{
  "data": {
    "id": "uuid-1",
    "status": "ENTREGUE",
    "updatedAt": "2026-05-28T14:00:00.000Z",
    "event": {
      "id": "evt-uuid-3",
      "eventType": "ENTREGA_CONFIRMADA",
      "transactionHash": "0xdef456txhash...",
      "createdAt": "2026-05-28T14:00:00.000Z"
    }
  },
  "message": "Entrega confirmada com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `INVALID_STATUS_TRANSITION` | Contrato não está em ENVIADO |
| `UNAUTHORIZED_ROLE` | Role não é ENTREGADOR |
| `NOT_FOUND` | Contrato não encontrado |

---

### 9.3 POST /contracts/:id/validate-receipt

**Objetivo:** fiscal valida conformidade da entrega.

**Role:** FISCAL

**Status antes:** `ENTREGUE`

**Status depois:** `VALIDADO`

**Evento gerado:** `RECEBIMENTO_VALIDADO`

### Request Body

```ts
interface ValidateReceiptBody {
  role: "FISCAL";
  actorWallet?: string;
  description?: string;
}
```

```json
{
  "role": "FISCAL",
  "actorWallet": "0x1234abcd...",
  "description": "Itens conferidos. Quantidade, qualidade e nota fiscal estão conformes."
}
```

### Response (sucesso 200)

```json
{
  "data": {
    "id": "uuid-1",
    "status": "VALIDADO",
    "updatedAt": "2026-05-28T16:00:00.000Z",
    "event": {
      "id": "evt-uuid-4",
      "eventType": "RECEBIMENTO_VALIDADO",
      "transactionHash": "0xghi789txhash...",
      "createdAt": "2026-05-28T16:00:00.000Z"
    }
  },
  "message": "Recebimento validado com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `INVALID_STATUS_TRANSITION` | Contrato não está em ENTREGUE |
| `UNAUTHORIZED_ROLE` | Role não é FISCAL |
| `NOT_FOUND` | Contrato não encontrado |

---

### 9.4 POST /contracts/:id/authorize-payment

**Objetivo:** gestor autoriza o pagamento final.

**Role:** GESTOR

**Status antes:** `VALIDADO`

**Status depois:** `PAGAMENTO_AUTORIZADO`

**Evento gerado:** `PAGAMENTO_AUTORIZADO`

### Request Body

```ts
interface AuthorizePaymentBody {
  role: "GESTOR";
  actorWallet?: string;
  description?: string;
}
```

```json
{
  "role": "GESTOR",
  "actorWallet": "0xdeadbeef...",
  "description": "Pagamento autorizado após confirmação de conformidade pelo fiscal."
}
```

### Response (sucesso 200)

```json
{
  "data": {
    "id": "uuid-1",
    "status": "PAGAMENTO_AUTORIZADO",
    "updatedAt": "2026-05-28T17:00:00.000Z",
    "event": {
      "id": "evt-uuid-5",
      "eventType": "PAGAMENTO_AUTORIZADO",
      "transactionHash": "0xjkl012txhash...",
      "createdAt": "2026-05-28T17:00:00.000Z"
    }
  },
  "message": "Pagamento autorizado com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `INVALID_STATUS_TRANSITION` | Contrato não está em VALIDADO |
| `UNAUTHORIZED_ROLE` | Role não é GESTOR |
| `NOT_FOUND` | Contrato não encontrado |

---

## 10. Endpoints de Disputa e Fraude

### 10.1 POST /contracts/:id/open-dispute

**Objetivo:** registrar uma disputa por divergência.

**Roles:** GESTOR, FISCAL, AUDITOR

**Status antes:** qualquer, exceto `PAGAMENTO_AUTORIZADO`

**Status depois:** `DISPUTA`

**Evento gerado:** `DISPUTA_ABERTA`

### Request Body

```ts
interface OpenDisputeBody {
  role: "GESTOR" | "FISCAL" | "AUDITOR";
  actorWallet?: string;
  reason: string; // obrigatório
}
```

```json
{
  "role": "FISCAL",
  "actorWallet": "0x1234abcd...",
  "reason": "Quantidade entregue diverge do contrato. Recebidos 50 itens de 100 previstos."
}
```

### Response (sucesso 200)

```json
{
  "data": {
    "id": "uuid-1",
    "status": "DISPUTA",
    "updatedAt": "2026-05-28T15:00:00.000Z",
    "event": {
      "id": "evt-uuid-6",
      "eventType": "DISPUTA_ABERTA",
      "transactionHash": null,
      "createdAt": "2026-05-28T15:00:00.000Z"
    }
  },
  "message": "Disputa registrada. Pagamento bloqueado."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `INVALID_STATUS_TRANSITION` | Contrato já está em PAGAMENTO_AUTORIZADO |
| `UNAUTHORIZED_ROLE` | Role não tem permissão para abrir disputa |
| `VALIDATION_ERROR` | Campo `reason` ausente |
| `NOT_FOUND` | Contrato não encontrado |

---

### 10.2 POST /contracts/:id/simulate-fraud

**Objetivo:** simular alteração de documento para demonstrar detecção de fraude.

**Roles:** qualquer

**Status antes:** qualquer

**Status depois:** `DISPUTA` (se hash divergir)

**Eventos gerados:** `FRAUDE_SIMULADA` + `DISPUTA_ABERTA`

### Request Body

```ts
interface SimulateFraudBody {
  newDocumentHash: string; // obrigatório — hash do "documento alterado"
  reason?: string;
}
```

```json
{
  "newDocumentHash": "hash-divergente-simulado-xyz789",
  "reason": "Simulação de adulteração do documento original do contrato."
}
```

### Response — Fraude detectada (sucesso 200)

```json
{
  "data": {
    "id": "uuid-1",
    "status": "DISPUTA",
    "fraudDetected": true,
    "originalHash": "abc123def456...",
    "newHash": "hash-divergente-simulado-xyz789",
    "updatedAt": "2026-05-28T15:30:00.000Z",
    "events": [
      {
        "id": "evt-uuid-7",
        "eventType": "FRAUDE_SIMULADA",
        "createdAt": "2026-05-28T15:30:00.000Z"
      },
      {
        "id": "evt-uuid-8",
        "eventType": "DISPUTA_ABERTA",
        "createdAt": "2026-05-28T15:30:00.000Z"
      }
    ]
  },
  "message": "Fraude detectada: hash do documento diverge do original. Disputa aberta automaticamente."
}
```

### Response — Hashes idênticos (sucesso 200)

```json
{
  "data": {
    "fraudDetected": false,
    "message": "Hashes idênticos. Nenhuma adulteração detectada."
  }
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `VALIDATION_ERROR` | `newDocumentHash` ausente |
| `NOT_FOUND` | Contrato não encontrado |
| `VALIDATION_ERROR` | Contrato não possui documentHash original |

---

## 11. Endpoints de Blockchain

### 11.1 GET /contracts/:id/blockchain-status

**Objetivo:** consultar status atual do contrato na blockchain.

**Query key:** `["blockchain-status", contractId]`

### Request

```http
GET /contracts/uuid-1/blockchain-status
```

### Response (sucesso 200 — registrado)

```json
{
  "data": {
    "contractId": "uuid-1",
    "status": "VALIDADO",
    "documentHash": "abc123def456...",
    "transactionHash": "0xghi789txhash...",
    "blockNumber": 12345678,
    "blockchainTimestamp": "2026-05-28T16:00:00.000Z",
    "registeredOnChain": true
  }
}
```

### Response (sucesso 200 — não registrado)

```json
{
  "data": {
    "contractId": "uuid-1",
    "registeredOnChain": false
  }
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `NOT_FOUND` | Contrato não encontrado |
| `BLOCKCHAIN_ERROR` | Falha ao consultar a blockchain |

---

### 11.2 POST /contracts/:id/register-on-chain

**Objetivo:** registrar o estado atual do contrato na blockchain.

**Role:** GESTOR ou backend automático após ação crítica

**Evento gerado:** `HASH_REGISTRADO`

### Request

```http
POST /contracts/uuid-1/register-on-chain
```

Sem body obrigatório.

### Response (sucesso 200)

```json
{
  "data": {
    "contractId": "uuid-1",
    "transactionHash": "0xmno345txhash...",
    "blockNumber": 12345680,
    "blockchainTimestamp": "2026-05-28T17:05:00.000Z",
    "registeredOnChain": true,
    "event": {
      "id": "evt-uuid-9",
      "eventType": "HASH_REGISTRADO",
      "transactionHash": "0xmno345txhash...",
      "createdAt": "2026-05-28T17:05:00.000Z"
    }
  },
  "message": "Contrato registrado na blockchain com sucesso."
}
```

### Erros possíveis

| Código | Situação |
|---|---|
| `NOT_FOUND` | Contrato não encontrado |
| `BLOCKCHAIN_ERROR` | Falha ao registrar na blockchain |
| `INTERNAL_ERROR` | Erro interno |

---

## 12. Eventos Gerados por Cada Ação

| Ação | Evento | Status antes | Status depois |
|---|---|---|---|
| `POST /contracts` | `CONTRATO_CRIADO` | — | `CRIADO` |
| `POST /contracts/:id/confirm-shipment` | `ENVIO_CONFIRMADO` | `CRIADO` | `ENVIADO` |
| `POST /contracts/:id/confirm-delivery` | `ENTREGA_CONFIRMADA` | `ENVIADO` | `ENTREGUE` |
| `POST /contracts/:id/validate-receipt` | `RECEBIMENTO_VALIDADO` | `ENTREGUE` | `VALIDADO` |
| `POST /contracts/:id/authorize-payment` | `PAGAMENTO_AUTORIZADO` | `VALIDADO` | `PAGAMENTO_AUTORIZADO` |
| `POST /contracts/:id/open-dispute` | `DISPUTA_ABERTA` | qualquer (exceto PGTO_AUT.) | `DISPUTA` |
| `POST /contracts/:id/simulate-fraud` | `FRAUDE_SIMULADA` + `DISPUTA_ABERTA` | qualquer | `DISPUTA` |
| `POST /contracts/:id/register-on-chain` | `HASH_REGISTRADO` | mantém status atual | mantém |

---

## 13. Regras de Transição de Status

O backend deve rejeitar qualquer transição não prevista abaixo:

```txt
CRIADO
  → ENVIADO (apenas via confirm-shipment por FORNECEDOR)
  → DISPUTA (via open-dispute ou simulate-fraud)

ENVIADO
  → ENTREGUE (apenas via confirm-delivery por ENTREGADOR)
  → DISPUTA (via open-dispute ou simulate-fraud)

ENTREGUE
  → VALIDADO (apenas via validate-receipt por FISCAL)
  → DISPUTA (via open-dispute ou simulate-fraud)

VALIDADO
  → PAGAMENTO_AUTORIZADO (apenas via authorize-payment por GESTOR)
  → DISPUTA (via open-dispute ou simulate-fraud)

PAGAMENTO_AUTORIZADO
  → [fim de fluxo — nenhuma transição permitida]

DISPUTA
  → [bloqueado — nenhuma transição permitida no MVP]
  → [pós-MVP: resolução de disputa pode reabrir o fluxo]
```

---

## 14. Query Keys do Frontend (TanStack Query)

```ts
const QUERY_KEYS = {
  dashboardSummary: ["dashboard-summary"] as const,
  contracts: ["contracts"] as const,
  contractsFiltered: (status: ContractStatus) => ["contracts", { status }] as const,
  contract: (id: string) => ["contract", id] as const,
  contractEvents: (id: string) => ["contract-events", id] as const,
  blockchainStatus: (id: string) => ["blockchain-status", id] as const,
};
```

### Invalidações após mutações

| Mutação | Queries a invalidar |
|---|---|
| Criar contrato | `["contracts"]`, `["dashboard-summary"]` |
| Atualizar contrato | `["contracts"]`, `["contract", id]` |
| Excluir contrato | `["contracts"]`, `["dashboard-summary"]` |
| Qualquer ação de fluxo | `["contract", id]`, `["contract-events", id]`, `["contracts"]`, `["dashboard-summary"]` |
| Registrar on-chain | `["blockchain-status", id]`, `["contract-events", id]` |

---

## 15. Mocks Esperados

Os mocks do frontend devem seguir exatamente os formatos desta seção.

### Localização

```txt
shared/mocks/contracts.mock.ts    → lista e detalhe de contratos
shared/mocks/events.mock.ts       → eventos de contratos
shared/mocks/dashboard.mock.ts    → dados do dashboard
shared/mocks/profiles.mock.ts     → perfis de usuário (demo)
```

### Exemplo de mock de contrato

```ts
// shared/mocks/contracts.mock.ts
export const mockContracts: Contract[] = [
  {
    id: "mock-contract-1",
    contractNumber: "CT-2026-001",
    publicAgency: "Prefeitura de São Paulo",
    supplierName: "Empresa Tech ABC Ltda",
    supplierWallet: "0x742d35Cc6634C0532925a3b8D4C9C35",
    object: "Fornecimento de equipamentos de informática",
    amount: 150000.00,
    deadline: "2026-08-31T23:59:59.000Z",
    inspectorName: "João Silva",
    logisticsResponsible: "Transportadora Rápida Ltda",
    managerName: "Maria Santos",
    status: "CRIADO",
    documentHash: "a1b2c3d4e5f6789012345678901234567890abcdef",
    createdAt: "2026-05-28T10:00:00.000Z",
    updatedAt: "2026-05-28T10:00:00.000Z",
  },
];
```

### Exemplo de mock de evento

```ts
// shared/mocks/events.mock.ts
export const mockEvents: ContractEvent[] = [
  {
    id: "mock-event-1",
    contractId: "mock-contract-1",
    eventType: "CONTRATO_CRIADO",
    description: "Contrato CT-2026-001 criado por Maria Santos.",
    responsibleRole: "GESTOR",
    responsibleName: "Maria Santos",
    responsibleWallet: "0xdeadbeef1234",
    statusBefore: undefined,
    statusAfter: "CRIADO",
    documentHash: "a1b2c3d4e5f6789012345678901234567890abcdef",
    transactionHash: undefined,
    blockchainTimestamp: undefined,
    createdAt: "2026-05-28T10:00:00.000Z",
  },
];
```

---

## 16. Critérios de Aceite da Integração

A integração está correta quando:

- [ ] Todos os endpoints respondem nos formatos definidos neste documento.
- [ ] Todos os erros retornam o formato `{ message, code, details? }`.
- [ ] Os dados retornados estão em camelCase.
- [ ] Os mocks do frontend seguem exatamente os mesmos tipos TypeScript.
- [ ] A invalidação do TanStack Query funciona após cada mutação.
- [ ] O `transactionHash` aparece nos eventos quando existe.
- [ ] O `documentHash` aparece na simulação de fraude.
- [ ] Os erros da API são exibidos com mensagem amigável no frontend.
- [ ] O status muda corretamente após cada ação.
- [ ] Tentativas de ação no status errado retornam `INVALID_STATUS_TRANSITION`.

---

*Documento criado na Session Two de Coerência — 2026-05-28*
