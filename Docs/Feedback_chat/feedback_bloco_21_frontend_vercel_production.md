# Feedback Bloco 21 — Deploy Vercel e Preparação Production

## 1. Objetivo do bloco

Preparar o frontend para deploy na Vercel: scripts padronizados no `package.json`, documentação completa de deploy e validação de build de produção. Sem novas funcionalidades, sem alterações em backend ou smart contract.

---

## 2. Arquivos alterados

```txt
web/package.json
web/README.md
Docs/Cronograma/Tasks_Frontend_implementation.md
```

---

## 3. Arquivos criados

```txt
Docs/Deploy/vercel_deploy_guide.md
Docs/Feedback_chat/feedback_bloco_21_frontend_vercel_production.md
```

---

## 4. Scripts adicionados

Arquivo: `web/package.json`

| Script | Comando | Finalidade |
|---|---|---|
| `developer` | `next dev` | Desenvolvimento local com hot reload |
| `production` | `next build` | Build de produção — mesmo comando que a Vercel executa |

Scripts anteriores mantidos sem alteração: `dev`, `build`, `start`, `lint`.

**Antes:**
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

**Depois:**
```json
"scripts": {
  "developer": "next dev",
  "production": "next build",
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

---

## 5. Variáveis de ambiente necessárias na Vercel

O `.env.example` já continha todas as variáveis necessárias — nenhuma alteração foi necessária.

### Modo demo/mock (deploy padrão para apresentações)

```env
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Modo API real (quando backend disponível)

```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=https://api.fiscalizapay.com.br
NEXT_PUBLIC_CHAIN_ID=137
NEXT_PUBLIC_EXPLORER_URL=https://polygonscan.com
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=<project-id>
```

---

## 6. Configuração da Vercel

| Campo | Valor |
|---|---|
| **Framework Preset** | Next.js (detectado automaticamente) |
| **Root Directory** | `web` |
| **Build Command** | `npm run production` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x ou 20.x |

### `vercel.json`

Não foi criado. A Vercel detecta Next.js automaticamente pela presença de `next.config.ts` e `package.json` na pasta `web/`. Não há necessidade de configuração adicional para o caso de uso atual.

---

## 7. Por que o modo mock funciona na Vercel

A Vercel executa Next.js em ambiente serverless. O modo mock funciona porque:

- Os dados mock são módulos TypeScript estáticos (`shared/mocks/*.ts`) — compilados no bundle
- Não há requisições HTTP externas com `NEXT_PUBLIC_USE_MOCKS=true`
- O mock store (Zustand in-memory) funciona no client-side normalmente
- Recarregar a página reseta o estado — comportamento esperado e documentado

---

## 8. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run production` | ✅ Turbopack — TypeScript sem erros — 9 rotas |
| `npm run developer` | Não executado (ambiente headless) — equivalente a `next dev` |

Saída do `npm run production`:

```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /audit
├ ○ /contracts
├ ƒ /contracts/[id]
├ ○ /contracts/new
├ ○ /dashboard
└ ○ /disputes

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 9. Instruções para configurar a Vercel

1. Acessar [vercel.com/import](https://vercel.com/import)
2. Importar o repositório `LukasAlexandre/FiscalizaPay`
3. Na tela de configuração:
   - **Root Directory:** `web`
   - **Build Command:** `npm run production`
   - **Framework:** Next.js (auto-detectado)
4. Em **Environment Variables**, adicionar as variáveis da seção 5 (modo mock)
5. Clicar em **Deploy**

O build levará ~15-20 segundos. Após o deploy, o sistema estará disponível na URL `*.vercel.app` gerada.

---

## 10. Commit e push

| Item | Valor |
|---|---|
| Mensagem | `chore(frontend): prepare vercel production deploy` |
| Push | ✅ sim |
| Branch | `main` |

---

## 11. Veredito

**Bloco 21 concluído.**

Todos os critérios de aceite foram atendidos:
- `npm run developer` existe ✅
- `npm run production` existe ✅
- `npm run build` continua funcionando ✅
- `npm run lint` continua funcionando ✅
- `.env.example` com todas as variáveis Vercel documentadas ✅
- Guia `Docs/Deploy/vercel_deploy_guide.md` criado ✅
- README atualizado com seção "Deploy Vercel" ✅
- Checklist atualizado com Bloco 21 ✅
- `npm run lint`: PASSOU (0 erros, 0 warnings) ✅
- `npm run production`: PASSOU (9 rotas, TypeScript sem erros) ✅
- Backend não alterado ✅
- Smart contract não alterado ✅
