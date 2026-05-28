# Feedback Bloco 1 — Criação e Configuração do Frontend

> **Responsável:** Pessoa 2 — Frontend / UI Lead  
> **Bloco:** 1 — Criação e configuração do projeto  
> **Data:** 2026-05-28  
> **Status:** ✅ Aprovado — liberado para Bloco 2

---

## 1. Objetivo do Bloco

Criar a base técnica do frontend do FiscalizaPay Web3 dentro da pasta `web/`, com toda a stack instalada, configurada e validada, pronta para receber providers, design system, entities, mocks e telas nos próximos blocos.

---

## 2. Documentos Consultados

```txt
Docs/Feedback_chat/feedback_bloco_0_frontend_preparacao.md
Docs/Cronograma/Tasks_Frontend_implementation.md
Docs/Planos_implementacao/plano_implementacao_frontend.md
Docs/Governanca_tecnica/decisoes_tecnicas_finais.md
Docs/Base_do_projeto/oraculum_design_system.md
Docs/Contratos_tecnicos/contrato_api_frontend_backend.md
```

---

## 3. Estrutura Criada

```txt
web/
├── src/
│   ├── app/
│   │   ├── globals.css        → design tokens + shadcn vars + TailwindCSS v4
│   │   ├── layout.tsx         → metadados atualizados (FiscalizaPay Web3)
│   │   ├── page.tsx           → placeholder simplificado
│   │   └── favicon.ico
│   ├── pages/
│   │   └── .gitkeep
│   ├── widgets/
│   │   └── .gitkeep
│   ├── features/
│   │   └── .gitkeep
│   ├── entities/
│   │   └── .gitkeep
│   └── shared/
│       ├── api/            .gitkeep
│       ├── config/         .gitkeep
│       ├── constants/      .gitkeep
│       ├── hooks/          .gitkeep
│       ├── lib/
│       │   ├── utils.ts    → cn() function (clsx + tailwind-merge)
│       │   └── .gitkeep
│       ├── mocks/          .gitkeep
│       ├── types/          .gitkeep
│       └── ui/             .gitkeep
├── .env.example               → 5 variáveis NEXT_PUBLIC documentadas
├── .gitignore                 → atualizado com !.env.example
├── .npmrc                     → configuração de peer deps
├── components.json            → shadcn/ui com caminhos FSD customizados
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── README.md                  → documentação do frontend
└── tsconfig.json              → aliases FSD completos
```

---

## 4. Dependências Instaladas

### Core (create-next-app)

```txt
next@16.2.6
react@19.2.4
react-dom@19.2.4
typescript@5.9.3
tailwindcss@4.3.0
@tailwindcss/postcss@4.3.0
eslint@9.39.4
eslint-config-next@16.2.6
```

### Stack adicional

```txt
@tanstack/react-query@5.100.14    → cache e dados remotos
zustand@5.0.14                    → estado global
react-hook-form@7.76.1            → formulários
@hookform/resolvers@5.4.0         → integração RHF + Zod
zod@4.4.3                         → validação de schemas
framer-motion@12.40.0             → animações
lucide-react@1.17.0               → ícones
wagmi@2.19.5                      → estado Web3 (v2)
viem@2.51.3                       → comunicação blockchain (v2)
@rainbow-me/rainbowkit@2.2.11     → UI de conexão de wallet
```

### Peers do shadcn/ui

```txt
class-variance-authority@0.7.1   → variants de componentes (cva)
clsx@2.1.1                       → concatenação condicional de classes
tailwind-merge@3.6.0             → merge inteligente de classes Tailwind
tw-animate-css@1.4.0             → animações CSS para componentes
```

---

## 5. Configurações Realizadas

### 5.1 Next.js 16 + React 19

Projeto criado com:
```bash
npx create-next-app@latest web --ts --tailwind --app --src-dir --eslint --import-alias "@/*" --use-npm
```

- App Router habilitado ✓
- TypeScript strict mode ativo ✓
- `src/` directory habilitado ✓
- Fonte Geist configurada (Google Fonts via `next/font`) ✓
- Turbopack habilitado para builds ✓

### 5.2 TailwindCSS v4 (CSS-first)

**Importante:** Esta versão usa TailwindCSS v4 com abordagem CSS-first. Não existe `tailwind.config.ts`. A configuração é feita no `globals.css` usando:
- `@import "tailwindcss"` — importa o framework
- `@theme inline { ... }` — define tokens como utilidades Tailwind
- `:root { ... }` — CSS variables para shadcn/ui e temas

Tokens configurados em `globals.css`:
```txt
--background, --foreground, --card, --popover
--primary (#22D3EE), --primary-foreground
--secondary, --muted, --muted-foreground
--accent, --destructive, --border, --input, --ring
--radius, --sidebar e variantes
--color-primary-neon (#11DFF2)
--color-success, --color-warning, --color-danger, --color-info
--font-sans (Geist), --font-mono (Geist Mono)
--radius-sm, --radius-md, --radius-lg, --radius-xl
```

Paleta dark é o tema padrão (`color-scheme: dark`).

### 5.3 shadcn/ui

Configurado **manualmente** via `components.json` (sem CLI interativo) com caminhos FSD:

```json
{
  "style": "new-york",
  "tailwind": { "css": "src/app/globals.css", "cssVariables": true },
  "aliases": {
    "components": "@/shared/ui",
    "utils": "@/shared/lib/utils",
    "ui": "@/shared/ui",
    "lib": "@/shared/lib",
    "hooks": "@/shared/hooks"
  }
}
```

Ao adicionar componentes com `npx shadcn@latest add button`, eles serão instalados em `src/shared/ui/`.

### 5.4 TypeScript — Aliases FSD

```json
"paths": {
  "@/*":          ["./src/*"],
  "@/app/*":      ["./src/app/*"],
  "@/pages/*":    ["./src/pages/*"],
  "@/widgets/*":  ["./src/widgets/*"],
  "@/features/*": ["./src/features/*"],
  "@/entities/*": ["./src/entities/*"],
  "@/shared/*":   ["./src/shared/*"]
}
```

### 5.5 Variáveis de ambiente (.env.example)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
```

### 5.6 .gitignore

Adicionada exceção para commitar o `.env.example`:
```txt
.env*
!.env.example
```

### 5.7 shared/lib/utils.ts

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 6. Arquivos Criados ou Alterados

| Arquivo | Operação |
|---|---|
| `web/` | Criado (create-next-app) |
| `web/src/app/globals.css` | Atualizado (design tokens TailwindCSS v4) |
| `web/src/app/page.tsx` | Substituído (placeholder simples) |
| `web/src/app/layout.tsx` | Atualizado (metadados FiscalizaPay) |
| `web/src/pages/.gitkeep` | Criado |
| `web/src/widgets/.gitkeep` | Criado |
| `web/src/features/.gitkeep` | Criado |
| `web/src/entities/.gitkeep` | Criado |
| `web/src/shared/api/.gitkeep` | Criado |
| `web/src/shared/config/.gitkeep` | Criado |
| `web/src/shared/constants/.gitkeep` | Criado |
| `web/src/shared/hooks/.gitkeep` | Criado |
| `web/src/shared/lib/.gitkeep` | Criado |
| `web/src/shared/lib/utils.ts` | Criado (cn function) |
| `web/src/shared/mocks/.gitkeep` | Criado |
| `web/src/shared/types/.gitkeep` | Criado |
| `web/src/shared/ui/.gitkeep` | Criado |
| `web/components.json` | Criado (shadcn config FSD) |
| `web/.env.example` | Criado |
| `web/.gitignore` | Atualizado (!.env.example) |
| `web/.npmrc` | Criado |
| `web/README.md` | Substituído (documentação do projeto) |
| `web/tsconfig.json` | Atualizado (aliases FSD) |

---

## 7. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm run build` | ✅ PASSOU — TypeScript válido, build limpo em 4.0s |
| `npm run lint` | ✅ PASSOU — sem erros ou warnings |
| `npm run dev` | ⚠️ Não executado no ambiente de build — verificar localmente |

Build output:
```txt
▲ Next.js 16.2.6 (Turbopack)
✓ Compiled successfully in 4.0s
✓ TypeScript passed in 2.4s
✓ Static pages generated (4/4)
Route (app): / — Static (prerendered)
```

---

## 8. Pontos de Atenção

### 8.1 TailwindCSS v4 — Mudança de abordagem

**Esta versão usa CSS-first, não tailwind.config.ts.** Os tokens são definidos em `globals.css` via `@theme inline`. Qualquer documentação que mencione `tailwind.config.ts` com `extend.colors` está desatualizada para esta versão.

Para adicionar cores ou tokens no futuro: editar `globals.css` na seção `@theme inline`.

### 8.2 Zod v4

A versão instalada é `zod@4.4.3` (major version 4). Esta é a versão mais recente e tem pequenas diferenças de API em relação à v3. O `@hookform/resolvers@5.4.0` foi criado especificamente para suportar Zod v4.

**Ação no Bloco 4 (tipos):** ao criar schemas Zod, usar a API v4. Principais diferenças:
- `z.string().min(1)` → continua igual
- `z.infer<typeof schema>` → continua igual
- `.optional()`, `.nullable()` → continuam iguais
- Alguns tipos internos foram renomeados

### 8.3 wagmi v3 instalado e revertido

O npm instalou `wagmi@3.x` por padrão, mas `@rainbow-me/rainbowkit@2.x` requer `wagmi@^2.9.0`. Foi necessário reinstalar `wagmi@^2` explicitamente. O downgrade funcionou e o build passou normalmente.

**Ação futura:** ao atualizar dependências, verificar compatibilidade wagmi ↔ RainbowKit antes.

### 8.4 Peer warnings de React 19

O pacote `valtio` (dependência interna do WalletConnect) usa `use-sync-external-store@1.2.0` que declara suporte apenas para React 16-18. Com React 19, o npm emite um warning mas a instalação funciona.

Estes warnings são não-bloqueantes e esperados em projetos Web3 com React 19. O build e lint passam normalmente.

### 8.5 Vulnerabilidades moderadas (24)

São todas de pacotes profundos do WalletConnect e MetaMask SDK — não afetam o código da aplicação. Nenhuma é crítica. Não executar `npm audit fix --force` pois pode gerar breaking changes nos pacotes Web3.

---

## 9. Pendências para o Bloco 2

O próximo bloco deve configurar os providers globais:

```txt
[ ] Criar app/providers/QueryProvider.tsx
    → QueryClient + QueryClientProvider (TanStack Query)

[ ] Criar app/providers/Web3Provider.tsx
    → WagmiProvider + createConfig (chains: polygonAmoy)
    → RainbowKitProvider (tema dark compatível)

[ ] Configurar chains (Polygon Amoy como principal, Sepolia como fallback)

[ ] Instalar e configurar Sonner (toast)
    npm install sonner

[ ] Criar app/providers/index.tsx
    → Combinar todos os providers

[ ] Garantir que providers usam "use client"

[ ] Atualizar app/layout.tsx para envolver com Providers

[ ] Verificar que não há erros de hydration no dev

[ ] Verificar compatibilidade de Zod v4 com createZodResolver
    → Testar com um schema simples antes do Bloco 4
```

---

## 10. Veredito

```txt
✅ Bloco 1 CONCLUÍDO

Build: PASSOU
Lint:  PASSOU
TypeScript: strict mode ativo
TailwindCSS v4: configurado com tokens FiscalizaPay
Feature-Sliced Design: estrutura criada (app/pages/widgets/features/entities/shared)
shadcn/ui: components.json configurado com caminhos FSD
Aliases: @/app, @/pages, @/widgets, @/features, @/entities, @/shared
.env.example: criado com todas as 5 variáveis NEXT_PUBLIC
README: atualizado e documentado
Dependências: todas instaladas (14 pacotes adicionais)

Próximo bloco: Bloco 2 — Providers Globais
```

---

*Bloco 1 concluído em: 2026-05-28*  
*Tempo de execução estimado: ~8 min (principalmente npm installs)*  
*Arquivos criados/modificados: 24*  
*Dependências adicionadas: 14*  
*Build status: ✅ VERDE*
