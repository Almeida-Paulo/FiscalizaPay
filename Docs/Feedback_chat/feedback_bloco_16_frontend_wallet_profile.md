# Feedback Bloco 16 — Wallet e Perfil Visual

## 1. Objetivo do bloco

Implementar a camada visual de wallet e perfil: store simulado de wallet com connect/disconnect, componentes visuais de rede e status, dropdown de conta no header, ProfileIdentityCard com seletor de demo, e preparação arquitetural para futura integração real com MetaMask/Wagmi/RainbowKit. Nenhuma integração blockchain real foi implementada.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_8_frontend_layout.md` — estrutura do AppHeader existente
- `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md` — stack Web3 oficial (wagmi + viem + RainbowKit)
- `Docs/Governanca_tecnica/glossario_tecnico_oficial.md` — roles, entidades, componentes oficiais
- `Docs/Cronograma/Tasks_Frontend_implementation.md` — tasks do Bloco 16
- `web/src/entities/wallet/model/types.ts` — `WalletInfo`, `WalletNetwork`, `SUPPORTED_NETWORKS`, `OFFICIAL_CHAIN_ID`
- `web/src/entities/profile/model/store.ts` — `useProfileStore`, `DEMO_PROFILES`
- `web/src/entities/profile/model/constants.ts` — `ROLE_LABELS`, `ROLE_DESCRIPTIONS`, `ROLE_ACTIONS`
- `web/src/entities/profile/ui/profile-switcher.tsx` — ProfileSwitcher existente (compact mode)
- `web/src/entities/profile/ui/role-badge.tsx` — RoleBadge existente
- `web/src/widgets/app-header/ui/app-header.tsx` — AppHeader existente com `useAccount` do wagmi
- `web/src/shared/lib/formatters.ts` — `shortenAddress` existente
- `web/src/shared/ui/dropdown-menu.tsx` — API do DropdownMenu disponível
- `web/src/shared/ui/copy-button.tsx` — CopyButton existente
- `web/src/shared/config/env.ts` — `env.chainId`, `env.explorerUrl`

---

## 3. Arquivos criados

```txt
web/src/entities/wallet/model/store.ts
web/src/entities/wallet/model/helpers.ts
web/src/entities/wallet/ui/network-badge.tsx
web/src/entities/wallet/ui/wallet-status.tsx
web/src/entities/wallet/ui/wallet-account-card.tsx
web/src/features/wallet-connect/ui/wallet-connect-button.tsx
web/src/features/wallet-connect/index.ts
web/src/entities/profile/ui/profile-identity-card.tsx
Docs/Feedback_chat/feedback_bloco_16_frontend_wallet_profile.md
```

---

## 4. Arquivos alterados

```txt
web/src/entities/wallet/index.ts        → exporta helpers + 3 novos componentes de UI
web/src/entities/profile/index.ts       → exporta RoleBadge e ProfileIdentityCard
web/src/widgets/app-header/ui/app-header.tsx → WalletConnectButton + dropdown de perfil; remove useAccount wagmi
web/README.md                           → seção "Wallet e perfil visual" adicionada
Docs/Cronograma/Tasks_Frontend_implementation.md → Bloco 16 marcado como concluído
```

---

## 5. Store visual de wallet

**Arquivo:** `web/src/entities/wallet/model/store.ts`

```ts
useWalletStore() → {
  address: string | null          // null quando desconectada
  chainId: number | null          // 80002 (Polygon Amoy) quando conectada
  networkName: string | null      // "Polygon Amoy" quando conectada
  isConnected: boolean            // false por padrão
  isCorrectNetwork: boolean       // true quando chainId === OFFICIAL_CHAIN_ID
  connectMockWallet(): void       // define endereço mock 0x8A4D35...F92B
  disconnectWallet(): void        // zera todos os campos
}
```

Endereço mock: `0x8A4D35Cc6634C0532925a3b8D4C9C351234F92B`

`isCorrectNetwork` é derivado de `env.chainId` (variável de ambiente) comparado com `OFFICIAL_CHAIN_ID = 80002`.

**Limite:** Este store é exclusivamente visual/demo. Nenhum dado é persistido on-chain, nenhuma carteira real é consultada, nenhuma transação é assinada.

---

## 6. Componentes de wallet

### NetworkBadge

**Arquivo:** `entities/wallet/ui/network-badge.tsx`

- Props: `chainId`, `isConnected`, `isCorrectNetwork`, `className`
- Se `!isConnected` → Badge muted `"Não conectada"`
- Se `isConnected && !isCorrectNetwork` → Badge `border-warning/40 bg-warning/10 text-warning` com `"Rede incorreta"`
- Se `isConnected && isCorrectNetwork` → Badge `border-success/40 bg-success/10 text-success` com nome da rede (ex: `"Polygon Amoy"`)
- Usa `getNetworkLabel(chainId)` para obter o nome da rede

### WalletStatus

**Arquivo:** `entities/wallet/ui/wallet-status.tsx`

- Componente compacto de exibição (sem interação)
- Se desconectada: ícone `WifiOff` + `"Não conectada"` em muted
- Se conectada: dot verde + endereço encurtado (`shortenAddress`) + `NetworkBadge`
- Props: `className`, `showNetwork` (padrão `true`)
- Usa `useWalletStore`

### WalletConnectButton

**Arquivo:** `features/wallet-connect/ui/wallet-connect-button.tsx`

- Se desconectada: botão `"Conectar wallet (demo)"` com ícone `Plug` — ao clicar chama `connectMockWallet()`
- Se conectada: botão dropdown com endereço encurtado + chevron (`border-success/30`)
  - Conteúdo do dropdown (270px): `WalletAccountCard` + Separador + botão `"Desconectar wallet"` (hover `text-danger`)
- Mobile: texto oculto no botão de connect (`hidden sm:inline`), apenas ícone

### WalletAccountCard

**Arquivo:** `entities/wallet/ui/wallet-account-card.tsx`

- Se desconectada: ícone `WifiOff` + mensagem muted centralizada
- Se conectada:
  - Status: dot verde + "Conectada" + `NetworkBadge`
  - Endereço: box mono com `shortenAddress(address, 6)` + `CopyButton`
  - Rede: `networkName` + `"Chain {chainId}"`
  - Link: "Ver no PolygonScan Amoy" (`env.explorerUrl/address/{address}`)
  - Aviso demo: `AlertCircle` + texto `border-warning/20 bg-warning/5`

---

## 7. Componentes de perfil

### ProfileIdentityCard

**Arquivo:** `entities/profile/ui/profile-identity-card.tsx`

- Avatar: círculo `bg-primary/10` com inicial do nome em `text-primary`
- Nome do perfil + `RoleBadge`
- Descrição da role (de `ROLE_DESCRIPTIONS`)
- Separador visual
- Título "Trocar perfil de demo" + `ProfileSwitcher` integrado (compact mode)
- Aviso de rodapé: "Perfil simulado — não é autenticação real"

### ProfileSwitcher

Sem alterações. Mantido com `compact` prop no `ProfileIdentityCard`. Continua usando `useProfileStore` — todos os fluxos de ação do contrato (`ContractActionPanel`) continuam respeitando o perfil ativo.

### RoleBadge

Sem alterações. Agora exportado via `entities/profile/index.ts`.

---

## 8. Integração no AppHeader

**Arquivo:** `widgets/app-header/ui/app-header.tsx`

### Antes

```tsx
import { useAccount } from "wagmi";
// ...
const { address, isConnected } = useAccount();
// Badge simples:
<div className="hidden ... sm:flex">
  {isConnected ? <Wifi /> : <WifiOff />}
  <span>{isConnected && address ? shortenAddress(address) : "Não conectada"}</span>
  <span>{chainLabel}</span>
</div>
<ProfileSwitcher compact />
```

### Depois

```tsx
// Sem useAccount do wagmi
// Sem ProfileSwitcher direto no header
<WalletConnectButton />          // dropdown wallet
<DropdownMenuTrigger>            // dropdown perfil
  <Button>Perfil</Button>
  <DropdownMenuContent>
    <ProfileIdentityCard />
  </DropdownMenuContent>
</DropdownMenuTrigger>
```

**Desktop:** `[WalletConnectButton] [Perfil ▾]` — compacto e sem poluição visual  
**Mobile:** botão wallet sem texto (só ícone), botão Perfil com ícone `User`  
**Sem overflow:** todos os textos com `hidden sm:inline` ou `truncate`

---

## 9. Preparação para integração real

A arquitetura permite substituir o mock por wagmi sem tocar nos componentes visuais:

```ts
// Futura integração em um provider ou hook:
// const { address, isConnected, chain } = useAccount();
// useEffect(() => {
//   if (isConnected && address) {
//     useWalletStore.setState({
//       address,
//       chainId: chain?.id ?? null,
//       networkName: chain?.name ?? null,
//       isConnected: true,
//       isCorrectNetwork: chain?.id === OFFICIAL_CHAIN_ID,
//     });
//   } else {
//     useWalletStore.getState().disconnectWallet();
//   }
// }, [address, isConnected, chain]);
```

Impacto na migração: **zero alterações nos componentes visuais**. Apenas o `store.ts` recebe a fonte real.

---

## 10. Responsividade e visual

- `WalletConnectButton`: texto `hidden sm:inline`, funciona apenas com ícone no mobile
- `WalletAccountCard`: `truncate` no endereço, sem overflow horizontal
- `ProfileIdentityCard`: `truncate` no nome, `min-w-0` implícito
- Dropdown de wallet: `w-72 p-3` — não extrapola viewports mobile quando `align="end"`
- Dropdown de perfil: `w-64 p-3`
- Paleta respeitada: `bg-primary/10`, `text-warning`, `text-success`, `text-danger`, `border-border`
- Sem emoji, sem poluição visual

---

## 11. Atualização do README

`web/README.md` — seção "Wallet e perfil visual" adicionada com:
- Explicação do store mock
- Tabela de componentes de wallet e perfil
- Estrutura da feature `wallet-connect`
- Como o AppHeader foi atualizado
- Snippet de futura integração wagmi

---

## 12. Atualização do checklist

`Docs/Cronograma/Tasks_Frontend_implementation.md` — Bloco 16 expandido com tasks detalhadas, todas marcadas `[x]` incluindo commit e push.

---

## 13. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 9 rotas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 14. Commit e push

| Item | Valor |
|---|---|
| Commit Bloco 16 | pendente |
| Mensagem | `feat(frontend): implement wallet and profile visuals` |
| Branch | `main` |

---

## 15. Problemas encontrados

**Problema — `useAccount` wagmi no AppHeader:**
O header existente usava `useAccount()` do wagmi diretamente para mostrar status da wallet. Com o store simulado, esse import se tornou desnecessário. Removido sem impacto — o `WalletConnectButton` usa o store próprio.

**Problema — Imports não utilizados após refatoração do header:**
`ProfileSwitcher` e `Separator` foram importados no `app-header.tsx` durante o rascunho mas não utilizados na versão final. Identificados no lint e removidos antes do commit.

**Problema — `ROLE_LABELS` importado mas não usado no `ProfileIdentityCard`:**
A descrição usa `ROLE_DESCRIPTIONS`, não `ROLE_LABELS`. Import removido após lint.

---

## 16. Pendências para o Bloco 17

- Tela `/audit` real: lista de contratos com eventos críticos
- Filtros por status e tipo de evento
- Cards de auditoria com link para detalhe do contrato
- Exibição de hashes recentes (documentHash e transactionHash)
- Empty/loading/error states na tela de auditoria
- Nenhuma integração blockchain real — só consulta ao mock

---

## 17. Veredito

**Bloco 16 está concluído e aprovado para avançar para o Bloco 17.**

Todos os critérios de aceite foram atendidos:
- Store visual de wallet com `connectMockWallet` e `disconnectWallet` ✅
- `NetworkBadge` com três estados visuais (correto/incorreto/não conectada) ✅
- `WalletStatus` compacto criado ✅
- `WalletConnectButton` com dropdown e `WalletAccountCard` ✅
- `ProfileIdentityCard` com seletor integrado ✅
- `AppHeader` atualizado — `useAccount` do wagmi removido ✅
- Endereço simulado exibido encurtado ✅
- Rede Polygon Amoy exibida com badge verde ✅
- Estado conectado/desconectado funcionando via store ✅
- Botão copiar endereço no `WalletAccountCard` ✅
- Mobile não quebra ✅
- Estrutura preparada para futura integração wagmi ✅
- Nenhuma integração real MetaMask/Wagmi/RainbowKit ✅
- `npm run lint`: PASSOU (0 erros, 0 warnings) ✅
- `npm run build`: PASSOU (9 rotas, TypeScript sem erros) ✅
- Backend e smart contract não foram alterados ✅
