# FiscalizaPay Web3 — Decisões Técnicas Finais

> **Status:** Fechado para o MVP  
> **Sessão:** Session Two de Coerência  
> **Referência:** `Docs/analises/fiscalizapay_analise_coerencia_session_two.md`

Todas as decisões deste documento são definitivas para o MVP. Qualquer alteração futura deve ser registrada como nova versão e justificada.

---

## 1. Frontend oficial

```txt
Framework: Next.js com App Router
Linguagem: TypeScript (strict)
Estilo: TailwindCSS
Componentes: shadcn/ui
Animações: Framer Motion
Dados remotos: TanStack Query v5
Estado local: Zustand
Formulários: React Hook Form + Zod
Ícones: Lucide React
```

**Motivo:** Next.js App Router oferece Server Components, roteamento integrado, performance nativa e deploy otimizado na Vercel. É mais maduro para sistemas SaaS/Web3 do que alternativas baseadas em Vite.

**Decisão descartada:** React + Vite + React Router não são mais opção oficial.

---

## 2. Backend oficial

```txt
Runtime: Node.js
Framework: NestJS (preferencialmente)
Linguagem: TypeScript
Alternativa aceitável: Node.js com estrutura modular (Express + middlewares)
```

**Motivo:** NestJS oferece estrutura modular, injeção de dependência, suporte nativo a TypeScript e padrões arquiteturais que facilitam manutenção. Para hackathon, Node.js com Express pode ser uma alternativa caso o tempo seja restrito, mas NestJS é o padrão preferido.

---

## 3. Banco de dados oficial

```txt
Banco: PostgreSQL
Serviço: Supabase
Formato interno: snake_case para nomes de colunas e tabelas
```

**Motivo:** Supabase oferece PostgreSQL gerenciado, painel visual, autenticação, storage e fácil configuração. Ideal para hackathon com alta velocidade de desenvolvimento.

---

## 4. ORM/client oficial

```txt
MVP: Supabase Client (velocidade de desenvolvimento)
Pós-MVP: Prisma ORM (tipagem, migrations, maior controle)
```

**Motivo da escolha do Supabase Client no MVP:** Para hackathon, a velocidade é prioritária. O Supabase Client permite queries sem overhead de migrations e setup de ORM. O Prisma é mais robusto mas adiciona complexidade inicial.

**Regra:** A equipe deve usar Supabase Client no MVP. Se houver tempo e necessidade, pode ser migrado para Prisma em etapas posteriores.

---

## 5. Blockchain/testnet oficial

```txt
Testnet oficial do MVP: Polygon Amoy
Alternativa: Sepolia (Ethereum)
```

**Motivo da escolha do Polygon Amoy:** Custo de gas extremamente baixo, transações rápidas, compatível com EVM, fácil acesso a faucets, demonstra visão prática de adoção Web3 fora do Ethereum mainnet. Ideal para demo de hackathon.

**Caso Polygon Amoy esteja instável durante o hackathon:** Usar Sepolia como fallback. Ambas as opções devem estar documentadas no deploy do smart contract.

---

## 6. Frontend Web3 oficial

```txt
Conexão de wallet: RainbowKit
Gerenciamento de estado Web3: wagmi
Comunicação com blockchain: viem
```

**Motivo:** wagmi + viem é a combinação moderna e tipada para Web3 no frontend React. RainbowKit oferece UI profissional para conexão de wallet com suporte a múltiplas carteiras.

**Decisão descartada:** Ethers.js não é mais opção principal do frontend. Pode existir no backend.

---

## 7. Backend Web3 oficial

```txt
Integração com smart contract: ethers.js ou viem
Decisão: a Pessoa 3 pode escolher conforme familiaridade
Recomendação: ethers.js pela maior maturidade e documentação
```

**Motivo:** O backend precisa chamar funções do smart contract, aguardar confirmação e capturar o `transactionHash`. Ambas as libs são capazes. ethers.js tem mais exemplos disponíveis; viem tem tipagem melhor.

---

## 8. Deploy oficial

```txt
Frontend: Vercel
Backend: Render, Railway ou Fly.io (escolha da Pessoa 3)
Banco: Supabase (cloud, gerenciado)
Smart Contract: Polygon Amoy via Hardhat
```

**Recomendação de deploy do backend:** Render para simplicidade; Railway para integração rápida; Fly.io para maior controle.

---

## 9. Variáveis de ambiente oficiais

### Frontend

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ENABLE_MOCKS=
NEXT_PUBLIC_EXPLORER_URL=
```

> `NEXT_PUBLIC_ENABLE_MOCKS=true` ativa os mocks controlados enquanto o backend não estiver pronto.  
> `NEXT_PUBLIC_EXPLORER_URL` é a URL base do explorer da testnet (ex: `https://amoy.polygonscan.com`).

### Backend

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

### Variáveis descartadas (legado)

```txt
VITE_API_URL        → substituída por NEXT_PUBLIC_API_URL
VITE_CHAIN_ID       → substituída por NEXT_PUBLIC_CHAIN_ID
VITE_CONTRACT_ADDRESS → substituída por NEXT_PUBLIC_CONTRACT_ADDRESS
```

---

## 10. Dados on-chain

O smart contract deve registrar apenas:

```txt
contractId
status
documentHash
actorWallet
timestamp
event emitido
transactionHash
```

---

## 11. Dados off-chain

Ficam no banco de dados (PostgreSQL/Supabase):

```txt
dados completos do contrato
dados do órgão público
dados do fornecedor
dados pessoais e bancários
documentos e anexos
notas fiscais
observações internas
histórico detalhado de eventos
motivos de disputa
```

---

## 12. Autenticação Web3 no MVP

```txt
MVP: autenticação por perfil simulado (Zustand store)
Perfil selecionado via dropdown ou mock de usuário
Wallet conecta visualmente mas não é usada para autenticação real no MVP

Pós-MVP: autenticação completa por assinatura de mensagem
1. Usuário conecta wallet
2. Frontend solicita assinatura de mensagem
3. Backend valida assinatura via ecrecover
4. Backend cria sessão com JWT
5. Permissões derivam do perfil vinculado à wallet
```

**Motivo da decisão:** Autenticação Web3 completa demanda implementação significativa e pode atrasar o MVP. Para o hackathon, o fluxo de negócio é mais importante que a camada de autenticação. O perfil simulado permite demonstrar o fluxo completo sem bloqueios.

---

## 13. Estratégia de mocks

```txt
Mocks ficam em: shared/mocks/
Arquivo de contrato: shared/mocks/contracts.mock.ts
Arquivo de eventos: shared/mocks/events.mock.ts
Arquivo de perfis: shared/mocks/profiles.mock.ts
Arquivo de dashboard: shared/mocks/dashboard.mock.ts

Ativação: NEXT_PUBLIC_ENABLE_MOCKS=true
Formato: mocks devem seguir exatamente a interface da API real
Regra: quando o backend estiver pronto, trocar apenas a origem dos dados
```

---

## 14. Endpoint POST /contracts/:id/events

```txt
Decisão oficial: NÃO será endpoint público do MVP.

Motivo: eventos devem ser criados internamente pelo backend a cada ação do fluxo.
Criar evento não é responsabilidade do frontend nem de um agente externo.
Cada ação (confirm-shipment, confirm-delivery, etc.) já cria seu evento internamente.

Pós-MVP: pode existir como endpoint administrativo restrito para casos específicos.
```

---

## 15. Paleta de cores oficial

```txt
Destaque primário da interface: #22D3EE (FiscalizaPay/TailwindCSS cyan-400)
Cor alternativa neon Oraculum: #11DFF2 (pode ser usada em hover, glow e efeitos)

Uso recomendado:
- Botões, links ativos, badges: #22D3EE
- Efeitos de glow, hover neon, indicadores: #11DFF2
- Ambas funcionam bem no contexto dark system Web3
```

**Motivo:** `#22D3EE` é o `cyan-400` do Tailwind, facilitando uso direto no TailwindCSS. `#11DFF2` é a cor da identidade Oraculum e pode ser usada em elementos de destaque especial.

---

## 16. Decisões descartadas

```txt
React + Vite: descartado como stack principal do frontend
React Router: descartado (Next.js App Router é o roteador oficial)
Ethers.js no frontend: descartado (wagmi/viem é o padrão)
Prisma no MVP: adiado para pós-MVP
Autenticação Web3 completa no MVP: adiada para pós-MVP
POST /contracts/:id/events como endpoint público: descartado do MVP
Status em inglês (CREATED, DISPUTE, etc.): descartados
Arquitetura components/pages/services/hooks: descartada (FSD é o padrão)
```

---

## 17. Estrutura do repositório

Para hackathon, usar estrutura simples (não monorepo):

```txt
fiscalizapay-web3/
├── web/              → frontend Next.js
├── api/              → backend NestJS/Node.js
├── smart-contract/   → Solidity + Hardhat
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   └── hardhat.config.ts
├── docs/             → documentação do projeto
└── README.md
```

**Monorepo:** pode ser considerado pós-MVP se a equipe decidir consolidar o repositório.

---

## 18. Formato de dados entre camadas

```txt
Banco de dados:   snake_case  (contract_number, document_hash, transaction_hash)
API (request):    camelCase   (contractNumber, documentHash, transactionHash)
API (response):   camelCase   (contractNumber, documentHash, transactionHash)
Frontend:         camelCase   (contractNumber, documentHash, transactionHash)
Smart contract:   camelCase/solidity convention
```

---

*Documento fechado na Session Two de Coerência — 2026-05-28*
