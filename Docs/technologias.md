# Tecnologias usadas no FiscalizaPay

## Visao geral

O FiscalizaPay e uma plataforma Web3 para fiscalizacao de contratos publicos, com frontend web, backend API, banco relacional, autenticacao por wallet, historico auditavel e smart contract para registro on-chain de hashes.

## Frontend

| Tecnologia | Uso no projeto |
| --- | --- |
| Next.js 16 | Aplicacao web com App Router. |
| React 19 | Componentizacao da interface. |
| TypeScript | Tipagem da aplicacao frontend. |
| TailwindCSS 4 | Estilizacao e design system. |
| shadcn/ui / Radix UI | Componentes acessiveis de UI. |
| Lucide React | Icones da interface. |
| Framer Motion | Animacoes e transicoes visuais. |
| TanStack Query | Cache, loading, error e invalidacao de chamadas API. |
| Zustand | Estado local de autenticacao, perfil e mocks. |
| React Hook Form | Formularios. |
| Zod | Validacao de schemas no frontend. |
| Sonner | Toasts e feedbacks de acao. |
| Wagmi | Integracao com wallets EVM. |
| Viem | Tipos e comunicacao Web3. |
| RainbowKit | Base de experiencia de conexao wallet. |
| ESLint | Padronizacao e analise estatica. |

## Backend

| Tecnologia | Uso no projeto |
| --- | --- |
| Python | Linguagem do backend atual. |
| FastAPI | API HTTP. |
| Uvicorn | Servidor ASGI em desenvolvimento. |
| Gunicorn | Servidor para execucao em producao Linux. |
| SQLAlchemy | ORM e acesso ao banco. |
| Alembic | Migrations do banco. |
| PostgreSQL | Banco de dados relacional. |
| Psycopg | Driver PostgreSQL. |
| Pydantic / pydantic-settings | Schemas, validacao e configuracao por ambiente. |
| PyJWT | Emissao e validacao de JWT. |
| eth-account | Recuperacao de wallet a partir de assinatura EVM. |
| Docker / Docker Compose | Execucao local da API e banco. |

## Blockchain e smart contracts

| Tecnologia | Uso no projeto |
| --- | --- |
| Solidity 0.8.28 | Smart contract `FiscalizaPayRegistry`. |
| Hardhat 3 | Compilacao, testes e deploy do contrato. |
| Hardhat Ignition | Modulo de deploy reprodutivel. |
| OpenZeppelin Contracts | `Ownable` para controle de escrita no contrato. |
| Viem | Testes/interacao Web3 no workspace de contratos. |
| Sepolia | Testnet atual do MVP, com contrato deployado. |
| Polygon Amoy | Testnet alternativa/fallback mantida na configuracao Hardhat. |
| Etherscan Sepolia | Explorer publico para consultar contrato na Sepolia. |

## Smart contract deployado

Contrato: `FiscalizaPayRegistry`

Rede registrada no artefato de deploy: Sepolia  
Chain ID: `11155111`  
Endereco: `0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`  
Explorer: `https://sepolia.etherscan.io/address/0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`

Observacao importante: o artefato de deploy existe em `contracts/ignition/deployments/chain-11155111/deployed_addresses.json`, mas a API real ainda trata `register-on-chain` como indisponivel/nao implementado. Portanto, ha smart contract deployado, mas a integracao runtime backend -> contrato ainda precisa ser implementada e validada.

## Arquitetura

| Camada | Responsabilidade |
| --- | --- |
| Frontend | Interface, dashboard, criacao/listagem/detalhe de contratos, carteira, timeline, alertas e acoes. |
| Backend | Regras de negocio, autenticacao, autorizacao por perfil/wallet, persistencia, eventos e API. |
| Banco | Contratos, perfis, eventos, disputas e nonces de autenticacao. |
| Smart contract | Registro imutavel de hash de documento por contrato. |
| Explorer | Verificacao publica de endereco, transacoes e eventos on-chain. |

## Principais variaveis de ambiente

| Variavel | Camada | Finalidade |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend | URL da API. |
| `NEXT_PUBLIC_CHAIN_ID` | Frontend | Chain esperada pela wallet. |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | Frontend | Endereco publico do smart contract. |
| `NEXT_PUBLIC_USE_MOCKS` | Frontend | Ativa/desativa mocks. |
| `NEXT_PUBLIC_EXPLORER_URL` | Frontend | URL base do explorer. |
| `DATABASE_URL` | Backend | Conexao PostgreSQL. |
| `JWT_SECRET` | Backend | Assinatura de JWT. |
| `CHAIN_ID` | Backend | Chain usada na mensagem de login. |
| `CONTRACT_ADDRESS` | Backend | Endereco do contrato para integracao on-chain. |
| `BLOCKCHAIN_ENABLED` | Backend | Habilita/desabilita escrita blockchain real. |
| `SEPOLIA_RPC_URL` | Contracts | RPC de deploy Sepolia. |
| `AMOY_RPC_URL` | Contracts | RPC de deploy Polygon Amoy. |
| `DEPLOYER_PRIVATE_KEY` | Contracts | Chave da wallet deployer/owner. |

## Ferramentas e organizacao

- Monorepo com pastas `web`, `backend`, `contracts` e `Docs`.
- Feature-Sliced Design no frontend.
- API REST com resposta padronizada `{ data, message? }`.
- Erros padronizados `{ message, code, details? }`.
- Migrations versionadas com Alembic.
- Scripts de seed e criacao de perfis reais.
- Documentacao tecnica em `Docs`.
