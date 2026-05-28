# FiscalizaPay Web3 — Plano de Implementação Backend e Web3

> **Responsável:** Pessoa 3 — Backend / Web3 Lead  
> **Referências:** `contrato_api_frontend_backend.md` | `glossario_tecnico_oficial.md` | `criterios_aceite_mvp.md`

---

## 1. Objetivo

Construir a API backend do FiscalizaPay Web3 e o smart contract, garantindo:

- endpoints no formato exato definido no contrato de API;
- regras de status e permissão aplicadas no servidor (não no frontend);
- eventos registrados automaticamente a cada ação;
- integração com smart contract para provas críticas;
- dados em camelCase para o frontend, snake_case no banco.

---

## 2. Stack

```txt
Runtime:    Node.js
Framework:  NestJS (preferencialmente) ou Node.js com Express modular
Linguagem:  TypeScript (strict)
Banco:      Supabase/PostgreSQL
Client:     Supabase Client (MVP)
Web3:       ethers.js (principal) ou viem
Smart:      Solidity + Hardhat
Testnet:    Polygon Amoy (oficial) / Sepolia (alternativa)
Deploy:     Render, Railway ou Fly.io
```

---

## 3. Estrutura de Pastas (NestJS)

```txt
api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   │
│   ├── contracts/
│   │   ├── contracts.module.ts
│   │   ├── contracts.controller.ts
│   │   ├── contracts.service.ts
│   │   ├── contracts.repository.ts
│   │   ├── dto/
│   │   │   ├── create-contract.dto.ts
│   │   │   ├── update-contract.dto.ts
│   │   │   ├── confirm-shipment.dto.ts
│   │   │   ├── confirm-delivery.dto.ts
│   │   │   ├── validate-receipt.dto.ts
│   │   │   ├── authorize-payment.dto.ts
│   │   │   ├── open-dispute.dto.ts
│   │   │   └── simulate-fraud.dto.ts
│   │   └── types/
│   │       └── contract.types.ts
│   │
│   ├── events/
│   │   ├── events.module.ts
│   │   ├── events.service.ts
│   │   └── events.repository.ts
│   │
│   ├── dashboard/
│   │   ├── dashboard.module.ts
│   │   ├── dashboard.controller.ts
│   │   └── dashboard.service.ts
│   │
│   ├── blockchain/
│   │   ├── blockchain.module.ts
│   │   ├── blockchain.service.ts
│   │   └── abi/
│   │       └── FiscalizaPay.json
│   │
│   ├── common/
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── response.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── types/
│   │       └── api.types.ts     → ApiResponse, ApiError
│   │
│   └── supabase/
│       ├── supabase.module.ts
│       └── supabase.service.ts
│
├── .env
├── package.json
└── tsconfig.json
```

---

## 4. Banco de Dados

### 4.1 Tabelas principais

#### `contracts`

```sql
CREATE TABLE contracts (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number       VARCHAR(100) NOT NULL UNIQUE,
  public_agency         VARCHAR(255) NOT NULL,
  supplier_name         VARCHAR(255) NOT NULL,
  supplier_wallet       VARCHAR(42),
  object                TEXT NOT NULL,
  amount                DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  start_date            TIMESTAMPTZ,
  end_date              TIMESTAMPTZ,
  deadline              TIMESTAMPTZ NOT NULL,
  inspector_name        VARCHAR(255) NOT NULL,
  inspector_wallet      VARCHAR(42),
  logistics_responsible VARCHAR(255) NOT NULL,
  logistics_wallet      VARCHAR(42),
  manager_name          VARCHAR(255),
  manager_wallet        VARCHAR(42),
  status                VARCHAR(30) NOT NULL DEFAULT 'CRIADO',
  document_hash         TEXT,
  blockchain_contract_id VARCHAR(100),
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);
```

#### `contract_events`

```sql
CREATE TABLE contract_events (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id          UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  event_type           VARCHAR(50) NOT NULL,
  description          TEXT NOT NULL,
  responsible_role     VARCHAR(20) NOT NULL,
  responsible_name     VARCHAR(255),
  responsible_wallet   VARCHAR(42),
  status_before        VARCHAR(30),
  status_after         VARCHAR(30),
  document_hash        TEXT,
  transaction_hash     TEXT,
  blockchain_timestamp TIMESTAMPTZ,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);
```

#### `disputes`

```sql
CREATE TABLE disputes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id   UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  opened_by     VARCHAR(20) NOT NULL,
  opened_by_wallet VARCHAR(42),
  reason        TEXT NOT NULL,
  original_hash TEXT,
  new_hash      TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

#### `profiles`

```sql
CREATE TABLE profiles (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name           VARCHAR(255) NOT NULL,
  role           VARCHAR(20) NOT NULL,
  wallet_address VARCHAR(42) UNIQUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Status permitidos (constraint ou enum)

```sql
ALTER TABLE contracts
  ADD CONSTRAINT chk_status
  CHECK (status IN ('CRIADO', 'ENVIADO', 'ENTREGUE', 'VALIDADO', 'PAGAMENTO_AUTORIZADO', 'DISPUTA'));
```

### 4.3 Índices recomendados

```sql
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_events_contract_id ON contract_events(contract_id);
CREATE INDEX idx_events_created_at ON contract_events(created_at);
```

---

## 5. Tabela de Endpoints

| Método | Rota | Módulo | Controller |
|---|---|---|---|
| GET | /dashboard/summary | DashboardModule | DashboardController |
| GET | /contracts | ContractsModule | ContractsController |
| POST | /contracts | ContractsModule | ContractsController |
| GET | /contracts/:id | ContractsModule | ContractsController |
| PATCH | /contracts/:id | ContractsModule | ContractsController |
| DELETE | /contracts/:id | ContractsModule | ContractsController |
| GET | /contracts/:id/events | ContractsModule | ContractsController |
| POST | /contracts/:id/confirm-shipment | ContractsModule | ContractsController |
| POST | /contracts/:id/confirm-delivery | ContractsModule | ContractsController |
| POST | /contracts/:id/validate-receipt | ContractsModule | ContractsController |
| POST | /contracts/:id/authorize-payment | ContractsModule | ContractsController |
| POST | /contracts/:id/open-dispute | ContractsModule | ContractsController |
| POST | /contracts/:id/simulate-fraud | ContractsModule | ContractsController |
| GET | /contracts/:id/blockchain-status | BlockchainModule | (via ContractsController) |
| POST | /contracts/:id/register-on-chain | BlockchainModule | (via ContractsController) |

---

## 6. Regras de Status

O backend deve implementar a seguinte matriz de transições:

```ts
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  CRIADO:                ["ENVIADO", "DISPUTA"],
  ENVIADO:               ["ENTREGUE", "DISPUTA"],
  ENTREGUE:              ["VALIDADO", "DISPUTA"],
  VALIDADO:              ["PAGAMENTO_AUTORIZADO", "DISPUTA"],
  PAGAMENTO_AUTORIZADO:  [], // terminal — sem transições
  DISPUTA:               [], // bloqueado no MVP
};
```

Ao receber qualquer ação, o backend deve:

1. Buscar o contrato.
2. Verificar se o status atual permite a transição desejada.
3. Se não permitir, retornar `{ code: "INVALID_STATUS_TRANSITION", message: "..." }` com HTTP 422.
4. Se permitir, executar a ação, criar o evento e atualizar o status.

---

## 7. Regras de Permissão

```ts
const ACTION_ROLES: Record<string, string[]> = {
  createContract:    ["GESTOR"],
  confirmShipment:   ["FORNECEDOR"],
  confirmDelivery:   ["ENTREGADOR"],
  validateReceipt:   ["FISCAL"],
  authorizePayment:  ["GESTOR"],
  openDispute:       ["GESTOR", "FISCAL", "AUDITOR"],
  simulateFraud:     ["GESTOR", "FISCAL", "AUDITOR"], // ou qualquer no MVP
  registerOnChain:   ["GESTOR"],
};
```

**Regra do MVP:** o `role` é recebido no body da requisição e validado pelo backend. Sem JWT no MVP. Em pós-MVP, o role virá do token de autenticação.

---

## 8. Criação Automática de Eventos

Cada ação deve criar um evento internamente. O endpoint `POST /contracts/:id/events` **não é público no MVP**.

### Helper: createEvent

```ts
async function createEvent(
  contractId: string,
  params: {
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
  }
): Promise<ContractEvent> {
  // inserir em contract_events via Supabase Client
}
```

---

## 9. Fluxo de Ações — Pseudocódigo

### confirm-shipment

```ts
async confirmShipment(id: string, dto: ConfirmShipmentDto) {
  const contract = await this.contractsRepository.findById(id);
  if (!contract) throw NotFoundException;
  if (contract.status !== "CRIADO") throw InvalidStatusTransitionException;
  if (dto.role !== "FORNECEDOR") throw UnauthorizedRoleException;

  await this.contractsRepository.updateStatus(id, "ENVIADO");

  const txHash = await this.blockchainService.confirmShipmentOnChain(id, dto.actorWallet);

  await this.eventsService.create({
    contractId: id,
    eventType: "ENVIO_CONFIRMADO",
    description: dto.description ?? "Envio confirmado.",
    responsibleRole: "FORNECEDOR",
    responsibleName: dto.responsibleName,
    responsibleWallet: dto.actorWallet,
    statusBefore: "CRIADO",
    statusAfter: "ENVIADO",
    transactionHash: txHash,
    blockchainTimestamp: txHash ? new Date().toISOString() : undefined,
  });

  const updatedContract = await this.contractsRepository.findById(id);
  return { data: { ...updatedContract, event: { eventType: "ENVIO_CONFIRMADO", transactionHash: txHash } }, message: "Envio confirmado com sucesso." };
}
```

---

## 10. Disputas

### Fluxo de open-dispute

```ts
async openDispute(id: string, dto: OpenDisputeDto) {
  const contract = await this.contractsRepository.findById(id);
  if (!contract) throw NotFoundException;
  if (contract.status === "PAGAMENTO_AUTORIZADO") throw InvalidStatusTransitionException;
  if (!ACTION_ROLES.openDispute.includes(dto.role)) throw UnauthorizedRoleException;

  await this.contractsRepository.updateStatus(id, "DISPUTA");

  await this.disputesRepository.create({
    contractId: id,
    openedBy: dto.role,
    openedByWallet: dto.actorWallet,
    reason: dto.reason,
  });

  await this.eventsService.create({
    contractId: id,
    eventType: "DISPUTA_ABERTA",
    description: dto.reason,
    responsibleRole: dto.role,
    statusBefore: contract.status,
    statusAfter: "DISPUTA",
  });

  return { data: { id, status: "DISPUTA" }, message: "Disputa registrada. Pagamento bloqueado." };
}
```

---

## 11. Simulação de Fraude

### Fluxo de simulate-fraud

```ts
async simulateFraud(id: string, dto: SimulateFraudDto) {
  const contract = await this.contractsRepository.findById(id);
  if (!contract) throw NotFoundException;
  if (!contract.documentHash) throw ValidationException("Contrato sem documentHash original.");

  const fraudDetected = contract.documentHash !== dto.newDocumentHash;

  if (!fraudDetected) {
    return { data: { fraudDetected: false, message: "Hashes idênticos. Sem adulteração detectada." } };
  }

  // Hashes divergem → abre disputa
  await this.contractsRepository.updateStatus(id, "DISPUTA");

  await this.eventsService.create({
    contractId: id,
    eventType: "FRAUDE_SIMULADA",
    description: "Hash do documento diverge do original. Possível adulteração detectada.",
    responsibleRole: dto.role ?? "GESTOR",
    documentHash: dto.newDocumentHash,
    statusBefore: contract.status,
    statusAfter: "DISPUTA",
  });

  await this.eventsService.create({
    contractId: id,
    eventType: "DISPUTA_ABERTA",
    description: dto.reason ?? "Disputa aberta automaticamente por divergência de hash.",
    responsibleRole: dto.role ?? "GESTOR",
    statusBefore: contract.status,
    statusAfter: "DISPUTA",
  });

  return {
    data: {
      id,
      status: "DISPUTA",
      fraudDetected: true,
      originalHash: contract.documentHash,
      newHash: dto.newDocumentHash,
      events: ["FRAUDE_SIMULADA", "DISPUTA_ABERTA"],
    },
    message: "Fraude detectada: hash do documento diverge do original. Disputa aberta automaticamente.",
  };
}
```

---

## 12. Padrão de Resposta

### Interceptor global de sucesso

```ts
// common/interceptors/response.interceptor.ts
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === "object" && "data" in data) return data;
        return { data };
      })
    );
  }
}
```

### Filtro global de exceções

```ts
// common/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    response.status(status).json({
      message: (exceptionResponse as any).message ?? "Erro interno",
      code: (exceptionResponse as any).code ?? "INTERNAL_ERROR",
      details: (exceptionResponse as any).details,
    });
  }
}
```

---

## 13. CORS

```ts
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Accept"],
});
```

---

## 14. Smart Contract

### 14.1 FiscalizaPay.sol (estrutura base)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FiscalizaPay {
    enum Status { Criado, Enviado, Entregue, Validado, PagamentoAutorizado, Disputa }

    struct PublicContract {
        uint256 id;
        bytes32 documentHash;
        address manager;
        address supplier;
        address deliveryAgent;
        address fiscal;
        Status status;
        uint256 createdAt;
    }

    mapping(uint256 => PublicContract) public contracts;
    uint256 public contractCount;

    event ContractRegistered(uint256 indexed id, bytes32 documentHash, address manager, uint256 timestamp);
    event ShipmentConfirmed(uint256 indexed id, address supplier, uint256 timestamp);
    event DeliveryConfirmed(uint256 indexed id, address deliveryAgent, uint256 timestamp);
    event ReceiptValidated(uint256 indexed id, address fiscal, uint256 timestamp);
    event PaymentAuthorized(uint256 indexed id, address manager, uint256 timestamp);
    event DisputeOpened(uint256 indexed id, address openedBy, uint256 timestamp);

    function registerContract(
        string memory contractIdOffChain,
        bytes32 documentHash,
        address supplier,
        address deliveryAgent,
        address fiscal
    ) external {
        contractCount++;
        contracts[contractCount] = PublicContract({
            id: contractCount,
            documentHash: documentHash,
            manager: msg.sender,
            supplier: supplier,
            deliveryAgent: deliveryAgent,
            fiscal: fiscal,
            status: Status.Criado,
            createdAt: block.timestamp
        });
        emit ContractRegistered(contractCount, documentHash, msg.sender, block.timestamp);
    }

    function confirmShipment(uint256 id) external {
        require(contracts[id].status == Status.Criado, "Status invalido");
        contracts[id].status = Status.Enviado;
        emit ShipmentConfirmed(id, msg.sender, block.timestamp);
    }

    function confirmDelivery(uint256 id) external {
        require(contracts[id].status == Status.Enviado, "Status invalido");
        contracts[id].status = Status.Entregue;
        emit DeliveryConfirmed(id, msg.sender, block.timestamp);
    }

    function validateReceipt(uint256 id) external {
        require(contracts[id].status == Status.Entregue, "Status invalido");
        contracts[id].status = Status.Validado;
        emit ReceiptValidated(id, msg.sender, block.timestamp);
    }

    function authorizePayment(uint256 id) external {
        require(contracts[id].status == Status.Validado, "Status invalido");
        contracts[id].status = Status.PagamentoAutorizado;
        emit PaymentAuthorized(id, msg.sender, block.timestamp);
    }

    function openDispute(uint256 id) external {
        require(contracts[id].status != Status.PagamentoAutorizado, "Status invalido");
        contracts[id].status = Status.Disputa;
        emit DisputeOpened(id, msg.sender, block.timestamp);
    }
}
```

### 14.2 Hardhat — configuração

```ts
// hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    polygonAmoy: {
      url: process.env.RPC_URL ?? "https://rpc-amoy.polygon.technology/",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 80002,
    },
    sepolia: {
      url: process.env.RPC_URL_SEPOLIA ?? "",
      accounts: [process.env.PRIVATE_KEY ?? ""],
      chainId: 11155111,
    },
  },
};

export default config;
```

### 14.3 Deploy

```ts
// scripts/deploy.ts
async function main() {
  const FiscalizaPay = await ethers.getContractFactory("FiscalizaPay");
  const contract = await FiscalizaPay.deploy();
  await contract.waitForDeployment();
  console.log("FiscalizaPay deployed to:", await contract.getAddress());
}

main().catch(console.error);
```

Comandos:

```bash
# deploy Polygon Amoy
npx hardhat run scripts/deploy.ts --network polygonAmoy

# deploy Sepolia (fallback)
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## 15. Integração Backend com Blockchain

### blockchain.service.ts

```ts
@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private wallet: ethers.Wallet;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, this.provider);
    this.contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS!,
      FiscalizaPayABI,
      this.wallet
    );
  }

  async confirmShipmentOnChain(contractId: string, actorWallet?: string): Promise<string | null> {
    try {
      const tx = await this.contract.confirmShipment(contractId);
      const receipt = await tx.wait();
      return receipt.hash; // transactionHash
    } catch (error) {
      console.error("Blockchain error:", error);
      return null; // não bloqueia o fluxo — retorna null
    }
  }

  // ... outros métodos similares
}
```

**Regra importante:** erros na blockchain **não devem bloquear** o fluxo off-chain no MVP. O backend persiste os dados e tenta registrar on-chain. Se falhar, registra o evento sem `transactionHash` e continua.

---

## 16. Ordem de Implementação

### Bloco 1 — Fundação (Day 1)

```txt
[  ] 1. Criar projeto NestJS com TypeScript
         nest new api

[  ] 2. Configurar Supabase Client
         npm install @supabase/supabase-js

[  ] 3. Criar tabelas no Supabase (SQL Editor)

[  ] 4. Configurar variáveis de ambiente (.env)

[  ] 5. Criar supabase.module.ts e supabase.service.ts

[  ] 6. Criar common/types/api.types.ts

[  ] 7. Criar ResponseInterceptor global

[  ] 8. Criar HttpExceptionFilter global

[  ] 9. Configurar CORS
```

### Bloco 2 — Contratos (Day 1-2)

```txt
[  ] 10. Criar ContractsModule com Controller, Service, Repository

[  ] 11. Implementar POST /contracts (createContract)

[  ] 12. Implementar GET /contracts

[  ] 13. Implementar GET /contracts/:id

[  ] 14. Implementar GET /contracts/:id/events

[  ] 15. Implementar DashboardModule com GET /dashboard/summary
```

### Bloco 3 — Ações do Fluxo (Day 2)

```txt
[  ] 16. Implementar POST /contracts/:id/confirm-shipment
[  ] 17. Implementar POST /contracts/:id/confirm-delivery
[  ] 18. Implementar POST /contracts/:id/validate-receipt
[  ] 19. Implementar POST /contracts/:id/authorize-payment
[  ] 20. Implementar POST /contracts/:id/open-dispute
[  ] 21. Implementar POST /contracts/:id/simulate-fraud

[  ] 22. Criar EventsService com createEvent helper
[  ] 23. Verificar que cada ação cria evento automaticamente
```

### Bloco 4 — Smart Contract (Day 2-3)

```txt
[  ] 24. Criar projeto Hardhat em smart-contract/
[  ] 25. Criar FiscalizaPay.sol
[  ] 26. Criar testes básicos com Hardhat
[  ] 27. Deploy em Polygon Amoy (ou Sepolia como fallback)
[  ] 28. Salvar endereço e ABI
[  ] 29. Criar BlockchainService no backend
```

### Bloco 5 — Blockchain + Integração (Day 3-4)

```txt
[  ] 30. Implementar GET /contracts/:id/blockchain-status
[  ] 31. Implementar POST /contracts/:id/register-on-chain
[  ] 32. Integrar BlockchainService nas ações críticas (confirm, validate, authorize)
[  ] 33. Retornar transactionHash nos responses
[  ] 34. Testar fluxo completo ponta a ponta com frontend
```

---

## 17. Variáveis de Ambiente

```env
# Banco
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Blockchain
RPC_URL=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=0x...
CONTRACT_ADDRESS=0x...
CHAIN_ID=80002
EXPLORER_URL=https://amoy.polygonscan.com

# App
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 18. Critérios de Aceite do Backend

```txt
[ ] Servidor NestJS rodando na porta 3001.
[ ] Banco Supabase conectado e tabelas criadas.
[ ] GET /dashboard/summary retorna métricas reais.
[ ] GET /contracts lista contratos do banco.
[ ] POST /contracts cria contrato e evento CONTRATO_CRIADO.
[ ] GET /contracts/:id retorna contrato por ID.
[ ] PATCH /contracts/:id atualiza contrato em status CRIADO.
[ ] DELETE /contracts/:id remove contrato em status CRIADO.
[ ] GET /contracts/:id/events lista eventos do contrato.
[ ] POST /contracts/:id/confirm-shipment muda status para ENVIADO e cria evento.
[ ] POST /contracts/:id/confirm-delivery muda status para ENTREGUE e cria evento.
[ ] POST /contracts/:id/validate-receipt muda status para VALIDADO e cria evento.
[ ] POST /contracts/:id/authorize-payment muda status para PAGAMENTO_AUTORIZADO e cria evento.
[ ] POST /contracts/:id/open-dispute muda status para DISPUTA e cria evento.
[ ] POST /contracts/:id/simulate-fraud compara hashes e abre disputa se divergirem.
[ ] Transições inválidas retornam HTTP 422 com code INVALID_STATUS_TRANSITION.
[ ] Roles inválidas retornam HTTP 403 com code UNAUTHORIZED_ROLE.
[ ] Todos os responses estão em camelCase.
[ ] CORS configurado para o frontend.
[ ] Smart contract deployado na testnet.
[ ] GET /contracts/:id/blockchain-status retorna status on-chain.
[ ] POST /contracts/:id/register-on-chain retorna transactionHash.
[ ] Deploy em produção (Render/Railway) funcionando.
[ ] README explica como rodar o backend e o smart contract.
```

---

*Documento criado na Session Two de Coerência — 2026-05-28*
