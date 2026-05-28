# Feedback Bloco 0 — Preparação Frontend

> **Responsável:** Pessoa 2 — Frontend / UI Lead  
> **Bloco:** 0 — Preparação antes de codar  
> **Data:** 2026-05-28  
> **Status:** Concluído — liberado para Bloco 1

---

## 1. Objetivo do Bloco

O Bloco 0 teve como objetivo preparar o terreno para o desenvolvimento frontend antes de qualquer linha de código.

A meta foi confirmar que:

- todos os documentos obrigatórios existem e estão no lugar certo;
- a stack oficial está clara e sem ambiguidades;
- a arquitetura foi entendida;
- o contrato de API foi lido;
- a estratégia de mocks foi validada;
- os riscos antes do Bloco 1 estão mapeados;
- a Pessoa 2 sabe exatamente onde o frontend começa.

---

## 2. Documentos Lidos

Todos os documentos obrigatórios foram localizados e verificados:

| Documento | Caminho | Status |
|---|---|---|
| Contrato API Frontend/Backend | `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` | ✅ Lido |
| Decisões Técnicas Finais | `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md` | ✅ Lido |
| Glossário Técnico Oficial | `Docs/Governanca_tecnica/glossario_tecnico_oficial.md` | ✅ Lido |
| Critérios de Aceite do MVP | `Docs/Governanca_tecnica/criterios_aceite_mvp.md` | ✅ Lido |
| Plano de Implementação Frontend | `Docs/Planos_implementacao/plano_implementacao_frontend.md` | ✅ Lido |
| Oraculum Design System | `Docs/Base_do_projeto/oraculum_design_system.md` | ✅ Lido |
| Tasks Frontend Implementation | `Docs/Cronograma/Tasks_Frontend_implementation.md` | ✅ Lido |

---

## 3. Decisões Confirmadas

### 3.1 Stack Frontend Oficial

```txt
✅ Next.js com App Router      → framework e roteamento oficial
✅ TypeScript (strict)         → tipagem em todo o projeto
✅ TailwindCSS                 → estilização
✅ shadcn/ui                   → base de componentes
✅ Framer Motion               → animações e transições
✅ TanStack Query v5           → dados remotos e cache
✅ Zustand                     → estado global local
✅ React Hook Form + Zod       → formulários e validação
✅ wagmi + viem + RainbowKit   → integração Web3
✅ Lucide React                → ícones
```

Stack descartada e confirmada como NÃO oficial:

```txt
❌ Vite
❌ React Router
❌ Ethers.js como lib principal do frontend
```

### 3.2 Arquitetura Frontend Oficial

```txt
✅ Feature-Sliced Design (FSD) é a arquitetura oficial
```

Estrutura confirmada:

```txt
web/
└── src/
    ├── app/       → providers globais, layout, estilos
    ├── pages/     → composição de telas
    ├── widgets/   → blocos grandes de interface
    ├── features/  → ações do usuário isoladas
    ├── entities/  → modelos do domínio
    └── shared/    → código reutilizável sem regra de negócio
```

Pasta raiz do frontend: `web/` (no mesmo nível de `Docs/`, `api/`, `smart-contract/`)

### 3.3 Status Oficiais

```txt
✅ CRIADO
✅ ENVIADO
✅ ENTREGUE
✅ VALIDADO
✅ PAGAMENTO_AUTORIZADO
✅ DISPUTA
```

Confirmado: nenhum status em inglês deve ser usado como oficial.

### 3.4 Roles Oficiais

```txt
✅ GESTOR
✅ FORNECEDOR
✅ ENTREGADOR
✅ FISCAL
✅ AUDITOR
```

### 3.5 Event Types Oficiais

```txt
✅ CONTRATO_CRIADO
✅ ENVIO_CONFIRMADO
✅ ENTREGA_CONFIRMADA
✅ RECEBIMENTO_VALIDADO
✅ PAGAMENTO_AUTORIZADO
✅ DISPUTA_ABERTA
✅ FRAUDE_SIMULADA
✅ HASH_REGISTRADO
```

Padrão confirmado: `SCREAMING_SNAKE_CASE`.

### 3.6 Estratégia de Mocks

```txt
✅ Frontend inicia 100% mockado
✅ Variável de controle: NEXT_PUBLIC_ENABLE_MOCKS=true
✅ Mocks ficam em: shared/mocks/
✅ Mocks devem seguir exatamente o formato da API real
✅ Trocar mock por API real não exige alterar componentes
✅ Backend não será alterado pela Pessoa 2
```

### 3.7 Variáveis de Ambiente Frontend

```env
✅ NEXT_PUBLIC_API_URL=           → URL base da API backend
✅ NEXT_PUBLIC_CHAIN_ID=          → ID da chain (Polygon Amoy = 80002)
✅ NEXT_PUBLIC_CONTRACT_ADDRESS=  → endereço do smart contract
✅ NEXT_PUBLIC_ENABLE_MOCKS=      → true/false para ativar mocks
✅ NEXT_PUBLIC_EXPLORER_URL=      → URL base do block explorer
```

Backend rodará em: `http://localhost:3001` (desenvolvimento)

### 3.8 Contrato API Confirmado

Todos os 15 endpoints oficiais estão documentados em `contrato_api_frontend_backend.md`:

```txt
✅ GET    /dashboard/summary
✅ GET    /contracts
✅ POST   /contracts
✅ GET    /contracts/:id
✅ PATCH  /contracts/:id
✅ DELETE /contracts/:id
✅ GET    /contracts/:id/events
✅ POST   /contracts/:id/confirm-shipment
✅ POST   /contracts/:id/confirm-delivery
✅ POST   /contracts/:id/validate-receipt
✅ POST   /contracts/:id/authorize-payment
✅ POST   /contracts/:id/open-dispute
✅ POST   /contracts/:id/simulate-fraud
✅ GET    /contracts/:id/blockchain-status
✅ POST   /contracts/:id/register-on-chain
```

Decisão confirmada: `POST /contracts/:id/events` **não é endpoint público no MVP**.

### 3.9 Design System Confirmado

```txt
✅ Paleta dark: background #050816, cards #0F172A, bordas #1E293B
✅ Destaque primário: #22D3EE (cyan-400 TailwindCSS)
✅ Neon alternativo: #11DFF2 (apenas glow e hover)
✅ Sucesso: #22C55E | Alerta: #F59E0B | Erro: #EF4444
✅ Fonte: Inter (corpo) + Space Grotesk/Sora (títulos)
```

### 3.10 Responsabilidade da Pessoa 2

```txt
✅ Criar e manter apenas o frontend (pasta web/)
✅ Não alterar backend, banco, smart contract ou documentos da Pessoa 3
✅ Reportar divergências de payload para a Pessoa 3 sem corrigir diretamente
✅ Manter mocks no mesmo formato do contrato API
✅ Ativar integração com API real quando Pessoa 3 liberar backend
```

---

## 4. Possíveis Inconsistências Encontradas

### 4.1 Referências internas com caminhos incompletos

Alguns documentos da sessão de coerência referenciam arquivos com caminhos sem a subfolder. Por exemplo:

| Documento | Referência interna incorreta | Caminho real |
|---|---|---|
| `glossario_tecnico_oficial.md` | `Docs/decisoes_tecnicas_finais.md` | `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md` |
| `criterios_aceite_mvp.md` | `Docs/decisoes_tecnicas_finais.md` | `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md` |
| `plano_implementacao_frontend.md` | `contrato_api_frontend_backend.md` (sem path) | `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` |
| `oraculum_design_system.md` | `Docs/decisoes_tecnicas_finais.md` | `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md` |

**Impacto para implementação:** zero. As referências são apenas para leitura humana. O desenvolvedor já conhece a estrutura de pastas.

**Ação recomendada:** não bloqueia o Bloco 1. Pode ser corrigido em uma sessão de polish de documentação no futuro.

### 4.2 Checklist duplicado da Pessoa 2

O arquivo `Docs/Cronograma/fiscalizapay_divisao_etapas_equipe.md` ainda contém um checklist de Pessoa 2 desatualizado, anterior à criação do `Tasks_Frontend_implementation.md`.

**Impacto:** pode gerar confusão sobre qual checklist é oficial.

**Decisão:** `Tasks_Frontend_implementation.md` é o checklist operacional oficial da Pessoa 2 para o MVP. O checklist antigo em `fiscalizapay_divisao_etapas_equipe.md` é contexto histórico apenas.

### 4.3 Versão do Node.js não especificada

O `decisoes_tecnicas_finais.md` define "Node.js" como runtime mas não especifica a versão mínima.

**Recomendação:** Node.js 18.17 LTS (mínimo para Next.js 14+) ou Node.js 20 LTS (recomendado).

**Impacto:** baixo. Documentar na criação do projeto.

---

## 5. Riscos Antes do Bloco 1

| Risco | Severidade | Ação recomendada |
|---|---|---|
| `web/` não existe — projeto Next.js ainda não foi criado | Alta | Criar no Bloco 1 com `npx create-next-app@latest` |
| `.env.example` não existe ainda | Média | Criar no Bloco 1 com as variáveis definidas |
| Versão do Node.js não documentada | Baixa | Usar Node 18.17+ ou 20 LTS |
| Dependências listadas mas não instaladas | Alta | Instalar todas no Bloco 1 após criar o projeto |
| Estrutura de pastas (`web/`) não criada ainda | Alta | Criar a FSD no Bloco 1 após setup base |
| Nenhum `README.md` na raiz do repositório | Baixa | Criar na etapa de documentação final (Pessoa 1) |
| Dois checklists para Pessoa 2 (antigo + novo) | Média | Confirmar que `Tasks_Frontend_implementation.md` é o oficial |
| Referência de paths internos inconsistente em docs | Baixa | Não bloqueia implementação |

---

## 6. Checklist de Entrada para o Bloco 1

Todos os itens abaixo estão confirmados. O Bloco 1 pode iniciar.

```txt
[x] Stack confirmada:
    → Next.js App Router + TypeScript + TailwindCSS + shadcn/ui
    → TanStack Query + Zustand + React Hook Form + Zod
    → wagmi + viem + RainbowKit + Framer Motion + Lucide React

[x] Documentos lidos:
    → contrato_api_frontend_backend.md
    → decisoes_tecnicas_finais.md
    → glossario_tecnico_oficial.md
    → criterios_aceite_mvp.md
    → plano_implementacao_frontend.md
    → oraculum_design_system.md
    → Tasks_Frontend_implementation.md

[x] Pasta do frontend definida: web/ (raiz do repositório)

[x] Arquitetura definida: Feature-Sliced Design
    → app / pages / widgets / features / entities / shared

[x] Variáveis de ambiente conhecidas:
    → NEXT_PUBLIC_API_URL, NEXT_PUBLIC_CHAIN_ID,
    → NEXT_PUBLIC_CONTRACT_ADDRESS, NEXT_PUBLIC_ENABLE_MOCKS,
    → NEXT_PUBLIC_EXPLORER_URL

[x] Estratégia de mocks confirmada:
    → Frontend inicia com NEXT_PUBLIC_ENABLE_MOCKS=true
    → Mocks em shared/mocks/ seguindo contrato API
    → Trocar para API real não exige alterar componentes

[x] Backend não será alterado:
    → Divergências de payload são reportadas para Pessoa 3
    → Pessoa 2 não modifica api/, banco, smart contract

[x] Status em português confirmados:
    → CRIADO, ENVIADO, ENTREGUE, VALIDADO,
    → PAGAMENTO_AUTORIZADO, DISPUTA

[x] Roles confirmadas: GESTOR, FORNECEDOR, ENTREGADOR, FISCAL, AUDITOR

[x] Event types confirmados em SCREAMING_SNAKE_CASE

[x] Paleta confirmada: #22D3EE (primary), #11DFF2 (neon), #050816 (bg)

[x] Nenhum código foi implementado neste bloco
```

---

## 7. Próximo Bloco Recomendado

```txt
Bloco 1 — Criação e configuração do projeto
```

### O que deverá ser feito no Bloco 1

```txt
1. Criar projeto Next.js com App Router e TypeScript:
   npx create-next-app@latest web --typescript --tailwind --app --src-dir --eslint

2. Configurar TailwindCSS com design tokens do Oraculum/FiscalizaPay:
   → cores, background, bordas, texto

3. Instalar e inicializar shadcn/ui:
   npx shadcn@latest init

4. Instalar dependências principais:
   npm install @tanstack/react-query zustand
   npm install react-hook-form @hookform/resolvers zod
   npm install framer-motion lucide-react
   npm install wagmi viem @rainbow-me/rainbowkit

5. Configurar aliases TypeScript no tsconfig.json:
   @/app/* @/pages/* @/widgets/* @/features/* @/entities/* @/shared/*

6. Criar estrutura Feature-Sliced Design dentro de src/:
   app/ pages/ widgets/ features/ entities/ shared/

7. Criar .env.example com as 5 variáveis públicas

8. Remover boilerplate inicial do Next.js (page.tsx, globals.css, etc.)

9. Configurar ESLint e Prettier

10. Confirmar que o projeto roda localmente sem erros:
    npm run dev
```

### Pré-requisitos confirmados antes de iniciar o Bloco 1

```txt
→ Node.js 18.17+ ou 20 LTS instalado na máquina
→ npm ou pnpm disponível no terminal
→ Diretório de trabalho: c:\...\FiscalizaPay\FiscalizaPay\
→ Projeto criado em: web\ (subpasta do repositório atual)
→ Documentos de referência lidos e disponíveis
```

---

## 8. Resumo Executivo do Bloco 0

```txt
Documentos verificados:     7/7
Decisões confirmadas:       10/10 categorias
Inconsistências críticas:   0
Inconsistências menores:    3 (sem impacto em implementação)
Riscos mapeados:            8 (todos com ação recomendada)
Código implementado:        0 (conforme regra do Bloco 0)
Status:                     APROVADO — Bloco 1 pode iniciar
```

---

*Bloco 0 concluído em: 2026-05-28*
