# FiscalizaPay — Guia de Execução da Demo

> Como preparar e rodar o ambiente de demonstração do FiscalizaPay.

---

## Pré-requisitos

| Item | Versão mínima |
|---|---|
| Node.js | 18.x ou superior |
| npm | 9.x ou superior |
| Navegador | Chrome 120+, Edge 120+, Firefox 121+ |
| Resolução recomendada | 1280×800 ou superior |

---

## 1. Instalação

```bash
# Clonar o repositório
git clone https://github.com/LukasAlexandre/FiscalizaPay.git
cd FiscalizaPay/web

# Instalar dependências
npm install
```

---

## 2. Configurar variáveis de ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env.local
```

Para a demo, **não é necessário alterar nada**. O `.env.local` gerado a partir do `.env.example` já tem:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CONTRACT_ADDRESS=0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83
NEXT_PUBLIC_EXPLORER_URL=https://sepolia.etherscan.io
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

> `NEXT_PUBLIC_USE_MOCKS=true` garante que **todos os dados virão dos mocks locais** — sem dependência de backend, sem dependência de internet, sem dependência de wallet real.

---

## 3. Rodar em modo de desenvolvimento

```bash
npm run dev
```

Aguardar a mensagem:

```
▲ Next.js 16.2.6
- Local: http://localhost:3000
```

Abrir no navegador: **http://localhost:3000**

---

## 4. Verificar build de produção (opcional)

```bash
npm run build
npm run start
```

Isso verifica que o sistema compila sem erros antes de uma apresentação importante.

---

## 5. Modo mock — como funciona

Com `NEXT_PUBLIC_USE_MOCKS=true`:

- Todos os dados vêm de `web/src/shared/mocks/`
- Nenhuma requisição HTTP é feita para o backend
- Estado muda em memória (mock store) ao executar ações
- **Recarregar o browser (F5) reseta o estado para os mocks originais** — use isso para resetar a demo após uma simulação ao vivo

---

## 6. Navegação recomendada

### Rota de entrada
`http://localhost:3000` → landing page

### Rotas principais

| Rota | Finalidade |
|---|---|
| `/` | Landing page — entrada da apresentação |
| `/dashboard` | Visão geral do gestor — métricas e alertas |
| `/contracts` | Lista de contratos com filtros |
| `/contracts/mock-contract-5` | CT-2026-005 — fluxo completo (estrela da demo) |
| `/contracts/mock-contract-6` | CT-2026-006 — fraude pré-instalada (disputa) |
| `/contracts/mock-contract-4` | CT-2026-004 — candidato para simulação ao vivo |
| `/contracts/mock-contract-1` | CT-2026-001 — contrato em CRIADO (pode avançar ao vivo) |
| `/contracts/new` | Cadastro de novo contrato |
| `/disputes` | Lista de disputas ativas |
| `/audit` | Auditoria consolidada de todos os eventos |

---

## 7. Ordem da apresentação

### Demo completa (8–12 min)

```
1. http://localhost:3000           — landing, problema, botão "Acessar Dashboard"
2. /dashboard                      — métricas, alerta CT-2026-006
3. /contracts/mock-contract-6      — fraude detectada, hash divergente
4. /contracts/mock-contract-5      — fluxo completo R$ 12.75M
5. /contracts                      — listagem, filtros
6. /audit                          — visão consolidada, filtro "Disputas e fraudes"
7. /contracts/mock-contract-4      — simular fraude ao vivo (perfil AUDITOR)
8. /dashboard                      — encerrar com dashboard atualizado
```

### Demo rápida (3 min)

```
1. /dashboard                      — alertas e métricas
2. /contracts/mock-contract-6      — fraude, pagamento bloqueado
3. /contracts/mock-contract-5      — fluxo completo como contraste
```

---

## 8. Troca de perfil durante a demo

O perfil ativo é exibido no header (canto superior direito). Clicar no ícone de usuário → dropdown → selecionar perfil.

| Para demonstrar | Usar perfil |
|---|---|
| Criar contrato | GESTOR (Maria Santos) |
| Confirmar envio | FORNECEDOR (Carlos Rodrigues) |
| Confirmar entrega | ENTREGADOR (Ricardo Alves) |
| Validar recebimento | FISCAL (João Silva) |
| Simular fraude / abrir disputa | AUDITOR (Ana Ferreira) |
| Autorizar pagamento | GESTOR (Maria Santos) |

---

## 9. Resetar estado após demo ao vivo

Se simulou fraude ou executou uma ação durante a apresentação:

```
Pressionar F5 (recarregar o browser)
```

O estado dos mocks retorna ao inicial (definido em `shared/mocks/mock-store.ts`).

---

## 10. Conectar wallet (visual — opcional)

Para mostrar o componente de wallet no header:

1. Clicar em "Conectar wallet (demo)" no header
2. O sistema simulara uma conexao com endereco `0x8888...8888` na Sepolia
3. O `NetworkBadge` ficará verde (rede correta)

Não é necessário MetaMask ou carteira real. É uma simulação visual via Zustand store.

---

## 11. Dicas para apresentação presencial

- **Abrir o browser em tela cheia** (F11) — remove a barra de endereço
- **Desativar notificações do sistema** antes de começar
- **Aumentar zoom do browser** para 110-125% em telas de projetor
- **Fechar outras abas** para evitar distração
- **Ter o roteiro em papel** — `Docs/Demo/demo_flow.md` impresso

---

## 12. Solução de problemas

| Problema | Solução |
|---|---|
| `npm run dev` não inicia | Verificar que está na pasta `web/`, não na raiz do projeto |
| Porta 3000 ocupada | `npm run dev -- --port 3001` |
| Página em branco | Verificar console do browser (F12) — geralmente falta de `.env.local` |
| Estado inconsistente após ação | Pressionar F5 para resetar mocks |
| Build falhou | Rodar `npm run lint` primeiro para ver erros de TypeScript |
| WalletConnect não conecta | Normal — `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` está vazio; apenas MetaMask (demo visual) funciona |

---

## 13. Build de produção para deploy rápido

Para subir o sistema em um servidor de apresentação:

```bash
npm run build
npm run start
# Disponível em http://localhost:3000
```

Para deploy em Vercel (recomendado):

```bash
npx vercel --prod
```

Variáveis de ambiente necessárias no Vercel:
- `NEXT_PUBLIC_USE_MOCKS=true` (manter mocks para demo)
- Demais variáveis opcionais para demo

---

*Guia criado no Bloco 20 — 2026-06-02*
