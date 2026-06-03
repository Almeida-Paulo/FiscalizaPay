# FiscalizaPay — Guia de Deploy na Vercel

> Frontend Next.js 16 App Router — Deploy em produção com modo mock para demo.

---

## 1. Rodar localmente (desenvolvimento)

```bash
cd web
npm install
cp .env.example .env.local
npm run developer
```

Acesse: **http://localhost:3000**

O script `developer` é equivalente a `next dev` — hot reload, modo desenvolvimento, mocks ativos por padrão.

---

## 2. Validar build de produção localmente

```bash
cd web
npm run production
```

O script `production` executa `next build` e gera o build otimizado em `.next/`. Equivalente ao que a Vercel executa no deploy.

Se o build passar sem erros, o deploy na Vercel também passará.

Para servir o build localmente após compilar:

```bash
npm run start
```

Acesse: **http://localhost:3000**

---

## 3. Verificar qualidade antes do deploy

```bash
cd web
npm run lint
npm run production
```

Ambos devem passar com 0 erros antes de qualquer deploy.

---

## 4. Deploy na Vercel

### 4.1 Pré-requisitos

- Conta na Vercel (vercel.com)
- Repositório no GitHub conectado à Vercel

### 4.2 Configurações do projeto na Vercel

Ao importar o repositório, configurar:

| Campo | Valor |
|---|---|
| **Framework Preset** | Next.js (detectado automaticamente) |
| **Root Directory** | `web` |
| **Build Command** | `npm run production` |
| **Output Directory** | `.next` (padrão Next.js) |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x ou 20.x |

> **Importante:** o Root Directory deve ser `web/`, não a raiz do repositório, pois o projeto frontend está nesta subpasta.

### 4.3 Variáveis de ambiente na Vercel

Configurar em **Settings → Environment Variables**:

#### Modo demo/mock (recomendado para apresentação)

| Variável | Valor | Obrigatório |
|---|---|---|
| `NEXT_PUBLIC_USE_MOCKS` | `true` | ✅ |
| `NEXT_PUBLIC_CHAIN_ID` | `80002` | ✅ |
| `NEXT_PUBLIC_EXPLORER_URL` | `https://amoy.polygonscan.com` | ✅ |
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:3001` | Opcional em mock |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | _(vazio ou endereço após deploy)_ | Opcional |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | _(seu project ID)_ | Opcional |

Com `NEXT_PUBLIC_USE_MOCKS=true`, todos os dados virão dos mocks locais do frontend — **sem dependência de backend**.

#### Modo API real (quando o backend estiver disponível)

| Variável | Valor |
|---|---|
| `NEXT_PUBLIC_USE_MOCKS` | `false` |
| `NEXT_PUBLIC_API_BASE_URL` | `https://api.fiscalizapay.com.br` (URL real) |
| `NEXT_PUBLIC_CHAIN_ID` | `137` (Polygon mainnet) ou `80002` (Amoy testnet) |
| `NEXT_PUBLIC_EXPLORER_URL` | `https://polygonscan.com` (mainnet) |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x...` (endereço do contrato deployado) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | _(obrigatório para QR code / mobile)_ |

---

## 5. Modo mock na Vercel

O modo mock funciona 100% no ambiente serverless da Vercel porque:

- Os dados mock são arquivos TypeScript estáticos (`shared/mocks/`)
- Não há chamadas HTTP para backend externo
- O estado em memória (mock store) funciona normalmente no client-side
- Recarregar a página reseta o estado — comportamento esperado em serverless

**Para apresentações e demos:** manter `NEXT_PUBLIC_USE_MOCKS=true` na Vercel.

---

## 6. `vercel.json`

Não é necessário um `vercel.json` para este projeto. A Vercel detecta automaticamente:

- Framework: Next.js (pela presença de `next.config.ts` e `package.json`)
- Build command: `npm run build` ou o que for configurado nas Settings
- Output: `.next/`

Caso precise de redirecionamentos, headers ou configurações avançadas no futuro, criar um `vercel.json` na pasta `web/`.

---

## 7. Checklist antes do deploy

```
[ ] cd web && npm install        — dependências instaladas
[ ] npm run lint                 — 0 erros, 0 warnings
[ ] npm run production           — build passou sem erros TypeScript
[ ] .env.local criado a partir de .env.example (apenas para local)
[ ] Variáveis configuradas na Vercel (especialmente NEXT_PUBLIC_USE_MOCKS)
[ ] Root Directory = "web" no projeto Vercel
[ ] Build Command = "npm run production" (ou "npm run build")
```

---

## 8. Solução de problemas

| Problema | Causa | Solução |
|---|---|---|
| Build falha na Vercel com erro TypeScript | Variável de ambiente faltando ou tipo errado | Verificar se `NEXT_PUBLIC_USE_MOCKS` está definida |
| Página em branco na Vercel | Root Directory incorreto | Garantir que Root Directory = `web` |
| WalletConnect não conecta | Project ID não configurado | Adicionar `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` |
| API retorna erro | `NEXT_PUBLIC_USE_MOCKS=false` sem backend | Trocar para `true` ou fornecer URL do backend real |
| `npm run developer` não encontrado | package.json desatualizado | Verificar que o script `developer` existe no package.json |

---

## 9. URLs de referência

- Vercel Dashboard: https://vercel.com/dashboard
- Docs Vercel Next.js: https://vercel.com/docs/frameworks/nextjs
- WalletConnect Cloud: https://cloud.walletconnect.com
- Polygon Amoy Explorer: https://amoy.polygonscan.com

---

*Guia criado no Bloco 21 — 2026-06-02*
