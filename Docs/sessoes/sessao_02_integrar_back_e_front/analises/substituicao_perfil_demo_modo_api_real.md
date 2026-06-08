# Substituição de Perfil Demo em Modo API Real — Bloco 07

## 1. Resumo Executivo

O Bloco 07 eliminou o uso do perfil demo/mock como fonte de verdade quando `NEXT_PUBLIC_USE_MOCKS=false`.

Regra implementada:

```txt
NEXT_PUBLIC_USE_MOCKS=true
→ currentProfile = perfil demo selecionado (useProfileStore / DEMO_PROFILES)

NEXT_PUBLIC_USE_MOCKS=false
→ currentProfile = perfil autenticado real (useAuthStore.profile, carregado via /auth/me no Bloco 06)
```

A separação foi centralizada em um novo hook único, `useCurrentProfile()`, que resolve `profile`, `role`, `walletAddress`, `isMockMode`, `isAuthenticated`, `isLoading` e `error` a partir da store correta conforme `env.useMocks` — sem nenhum fallback automático para o perfil demo quando `mocks=false`.

Não foram iniciados neste bloco:

```txt
contratos reais
actions reais
auditoria real
unificação de DEMO_PROFILES e mockProfiles
```

## 2. Arquivos Analisados

Frontend (perfil/role/wallet):

```txt
web/src/entities/profile/model/store.ts
web/src/entities/profile/model/types.ts
web/src/entities/profile/model/constants.ts
web/src/entities/profile/ui/profile-switcher.tsx
web/src/entities/profile/ui/profile-identity-card.tsx
web/src/entities/profile/ui/role-badge.tsx
web/src/entities/auth/model/store.ts
web/src/entities/auth/model/session.ts
web/src/entities/wallet/model/store.ts
web/src/entities/wallet/ui/wallet-account-card.tsx
web/src/entities/wallet/ui/wallet-status.tsx
web/src/shared/mocks/profiles.mock.ts
web/src/shared/config/env.ts
```

Componentes que consomem perfil/role/wallet para regras visuais:

```txt
web/src/widgets/app-sidebar/ui/app-sidebar.tsx
web/src/app/dashboard/page.tsx
web/src/app/contracts/_components/contracts-page.tsx
web/src/app/contracts/new/_components/create-contract-page.tsx
web/src/widgets/dashboard-recent-contracts/ui/dashboard-recent-contracts.tsx
web/src/features/contract-actions/ui/contract-action-panel.tsx
web/src/app/permissions-showcase.tsx
```

## 3. Pontos que Usavam Perfil Demo

Mapeamento feito via busca por `DEMO_PROFILES`, `mockProfiles`, `mockProfileByRole`, `selectedProfile`, `currentProfile`, `useProfileStore`, `profileStore`, `walletAddress`, `role`, `useProfile`, `useAuth`, `NEXT_PUBLIC_USE_MOCKS`.

Pontos encontrados consumindo `useProfileStore().currentProfile` (perfil demo) independentemente do modo:

```txt
ProfileIdentityCard       — exibia nome, role e wallet do perfil demo
ProfileSwitcher           — trocava o perfil demo (sempre habilitado)
AppSidebar                — usava currentProfile demo para canCreateContract
DashboardPage             — usava currentProfile demo para canCreateContract
ContractsPage             — usava currentProfile demo para canCreateContract
CreateContractPage        — usava currentProfile demo para canCreate / formulário
DashboardRecentContracts  — usava currentProfile demo para canCreateContract
ContractActionPanel       — usava currentProfile demo para regras de ação/role
PermissionsShowcase       — usava currentProfile demo + ProfileSwitcher para showcase de regras
```

Dois conjuntos de dados demo distintos foram confirmados e mantidos separados (decisão do Bloco Extra — não unificar):

```txt
DEMO_PROFILES   em web/src/entities/profile/model/store.ts        (useProfileStore / ProfileSwitcher)
mockProfiles    em web/src/shared/mocks/profiles.mock.ts          (dados mockados de API)
```

`WalletAccountCard` e `WalletStatus` usam `useWalletStore` (wallet da extensão conectada), uma fonte distinta de `authStore.profile.walletAddress` — não fazem parte do escopo deste bloco e não foram alterados.

## 4. Estratégia de Separação Mock/API Real

Foi criado o hook central `useCurrentProfile()` em `web/src/entities/profile/model/use-current-profile.ts`, retornando o tipo `ResolvedProfile`:

```ts
type ResolvedProfile = {
  profile: Profile | null;
  role: UserRole | null;
  walletAddress: string | null;
  isMockMode: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
```

Lógica de resolução:

```txt
se env.useMocks === true:
    profile = useProfileStore().currentProfile (DEMO_PROFILES)
    isMockMode = true
    isAuthenticated = true (perfil demo sempre "ativo")
    isLoading = false, error = null

se env.useMocks === false:
    profile = useAuthStore().profile        (carregado via /auth/me)
    role = useAuthStore().role
    walletAddress = useAuthStore().walletAddress
    isMockMode = false
    isAuthenticated = useAuthStore().isAuthenticated
    isLoading = useAuthStore().isLoading
    error = useAuthStore().error
```

Não existe nenhum caminho de código em que `mocks=false` resulte em `profile` vindo de `useProfileStore`/`DEMO_PROFILES`. O hook não foi exportado no barrel `entities/profile/index.ts`, seguindo a convenção já existente de não reexportar stores client-only.

## 5. Componentes Ajustados

```txt
web/src/entities/profile/ui/profile-switcher.tsx        — gate: retorna null quando !env.useMocks
web/src/entities/profile/ui/profile-identity-card.tsx   — reescrito: branch isMockMode vs estados reais
web/src/widgets/app-sidebar/ui/app-sidebar.tsx          — useProfileStore -> useCurrentProfile
web/src/app/dashboard/page.tsx                          — useProfileStore -> useCurrentProfile
web/src/app/contracts/_components/contracts-page.tsx    — useProfileStore -> useCurrentProfile
web/src/app/contracts/new/_components/create-contract-page.tsx — renderContent() com 4 estados de modo API
web/src/widgets/dashboard-recent-contracts/ui/dashboard-recent-contracts.tsx — useProfileStore -> useCurrentProfile
web/src/features/contract-actions/ui/contract-action-panel.tsx — useProfileStore -> useCurrentProfile + estados de modo API
web/src/app/permissions-showcase.tsx                    — gate mock-only com EmptyState
```

`PermissionsShowcase` é um componente órfão (não referenciado em nenhuma rota da aplicação); ainda assim recebeu o gate `!env.useMocks` por consistência, já que ele simula permissões trocando o perfil demo via `ProfileSwitcher`.

## 6. Uso do Profile Real

Em `mocks=false`, todos os 7 componentes que antes liam `useProfileStore().currentProfile` passaram a ler `profile` de `useCurrentProfile()`, que por sua vez vem de `useAuthStore().profile` — preenchido pelo fluxo `wallet → nonce → assinatura → verify → JWT → /auth/me` implementado nos Blocos 03–06.

Quando não há sessão autenticada (`profile === null`), nenhum componente renderiza dados do perfil demo. Em vez disso, cada um exibe o estado "não autenticado" apropriado (ver seção 10).

Validado visualmente (ver seção 12): com `NEXT_PUBLIC_USE_MOCKS=false` e sem login, a sidebar não exibe o item "Novo contrato" (`canCreate=false` porque `profile=null`), e o dropdown de perfil no header mostra "Conecte sua wallet para continuar".

## 7. Uso da Role Real

`canCreateContract(profile)` e as demais funções de regra (`canConfirmShipment`, `canAuthorizePayment`, `canOpenDispute`, `canSimulateFraud`, `canRegisterOnChain`, `getNextContractAction`, `getBlockedActionReason`) recebem o `profile` resolvido por `useCurrentProfile()`.

Em `mocks=false`, esse `profile` carrega `role` vinda exclusivamente de `authStore.role` (preenchida por `/auth/me`), nunca de `DEMO_PROFILES`. O `RoleBadge` exibido em `ContractActionPanel` também usa `currentProfile.role`, isto é, a role real.

Não foi possível validar visualmente as 5 roles (`GESTOR`, `FISCAL`, `AUDITOR`, `FORNECEDOR`, `ENTREGADOR`) com sessões autenticadas reais — ver seção 12 (depende de múltiplas contas reais com wallets distintas, fora do escopo de criação neste bloco). A correção estrutural (role vem de `authStore.role`, não de perfil demo) foi confirmada por leitura de código e pelo estado "não autenticado" sem vazamento de role demo.

## 8. Uso da Wallet Real

Em `mocks=false`, `walletAddress` retornado por `useCurrentProfile()` vem de `authStore.walletAddress` (preenchido por `/auth/me`), exibido em `ProfileIdentityCard` via `shortenAddress(profile.walletAddress, 6)`.

A wallet mockada `0x8888...` (do `DEMO_PROFILES`) não é exibida em modo API real — confirmado por leitura de código (o branch `isMockMode` que renderiza `DemoProfileIdentity` com a wallet demo só é alcançado quando `env.useMocks === true`).

`WalletConnectButton` (componente pré-existente, não alterado neste bloco) já distinguia os modos corretamente: exibe "Conectar wallet (demo)" em mock mode e "Conectar wallet" em modo API real — comportamento confirmado nas capturas de tela.

Possível inconsistência entre wallet da extensão conectada (`useWalletStore`) e wallet retornada por `/auth/me` (`authStore.walletAddress`): não foi observada nem testada neste bloco, pois requer fluxo de login real completo com troca de conta na extensão — fica registrada como ponto de atenção para os próximos blocos (ver seção 13).

## 9. Profile Switcher

Aplicada a regra do bloco:

```txt
NEXT_PUBLIC_USE_MOCKS=true  -> ProfileSwitcher habilitado, troca o perfil demo normalmente
NEXT_PUBLIC_USE_MOCKS=false -> ProfileSwitcher retorna null (oculto)
```

Implementação em `profile-switcher.tsx`:

```tsx
export function ProfileSwitcher({ className, compact = false }: ProfileSwitcherProps) {
  const { currentProfile, demoProfiles, setCurrentProfile } = useProfileStore();

  if (!env.useMocks) {
    return null;
  }
  // ...
}
```

`ProfileIdentityCard` só renderiza `<ProfileSwitcher />` dentro do branch `isMockMode` (helper `DemoProfileIdentity`); no branch real, exibe um aviso explícito "Perfil autenticado via /auth/me — não pode ser trocado pela UI." Isso garante que não existe caminho de UI para simular role em modo API real.

## 10. Estados Visuais

Os 4 estados exigidos pelo bloco foram implementados em `ProfileIdentityCard`, `ContractActionPanel` e `CreateContractPage` (todos via `useCurrentProfile()`):

```txt
14.1 Sem login   -> "Conecte sua wallet para continuar" / "Faça login com sua wallet para carregar seu perfil real."
14.2 Loading     -> spinner + "Carregando perfil autenticado..."
14.3 Autenticado -> nome real, RoleBadge com role real, wallet real (shortenAddress)
14.4 Erro        -> mensagem de erro controlada + botão "Tentar novamente" (chama refreshAuthenticatedProfile())
```

Validados visualmente via captura de tela (browser real, dev server em `http://localhost:3000`):

```txt
[OK] ProfileIdentityCard / dropdown do header — estado "sem login" confirmado visualmente
[OK] CreateContractPage — estado "Autenticacao necessaria / Conecte sua wallet e faca login..." confirmado visualmente
[não verificado visualmente] ProfileIdentityCard / ContractActionPanel — estados "loading" e "erro" (dependem de timing de rede ou de erro real do backend; verificados por leitura de código)
[não verificado visualmente] ContractActionPanel — estado "sem login" (ver seção 12 para detalhes do bloqueio)
```

## 11. Preservação do Mock Mode

Com `NEXT_PUBLIC_USE_MOCKS=true` (config padrão de `.env.local`), validado visualmente:

```txt
[OK] ProfileSwitcher visível e funcional no dropdown do header
[OK] Perfil demo "Maria Santos / GESTOR" exibido em ProfileIdentityCard
[OK] RoleBadge do perfil demo exibido em ContractActionPanel
[OK] Wallet demo exibida normalmente (fluxo DemoProfileIdentity)
[OK] Nenhuma chamada a /auth/me — não exige backend autenticado
```

`DEMO_PROFILES`, `mockProfiles`/`mockProfileByRole` e `useProfileStore` permanecem intactos e não foram unificados — alteração restrita a um gate de visibilidade (`if (!env.useMocks) return null`) no `ProfileSwitcher` e ao branch `isMockMode` nos demais componentes.

## 12. Validações Executadas

| Validação | Resultado |
|---|---|
| `npm run lint` | OK, sem erros nem warnings. |
| `npm run build` | OK, build de produção concluído com sucesso (rotas estáticas e `/contracts/[id]` dinâmica geradas). |
| `docker compose config` em `backend/` | OK. |
| `docker compose ps` | OK — `fiscalizapay-api` e `fiscalizapay-db` `Up`/`healthy`. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200, `{"status":"ok"}`. |
| UI com `NEXT_PUBLIC_USE_MOCKS=true` (dashboard, dropdown, contrato) | OK, perfil demo e ProfileSwitcher preservados — confirmado por captura de tela. |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — dashboard | OK, sem dados demo; estados de erro de API (sem sessão) exibidos corretamente. |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — dropdown de perfil (sem login) | OK, "Conecte sua wallet para continuar" — confirmado por captura de tela. |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — CreateContractPage (sem login) | OK, "Autenticacao necessaria / Conecte sua wallet e faca login..." — confirmado por captura de tela. |
| UI com `NEXT_PUBLIC_USE_MOCKS=false` — ContractActionPanel (sem login) | Status: não executado. Motivo: a página de detalhe do contrato falha ao carregar o contrato antes de o painel ser montado (`useContracts`/`useContract` retorna erro sem sessão autenticada — "Erro ao carregar contrato"), pois não existe endpoint público de contrato nem sessão JWT real disponível neste ambiente. Impacto: o branch de código "sem login" do `ContractActionPanel` foi validado por leitura (idêntico ao padrão usado em `ProfileIdentityCard`/`CreateContractPage`, já confirmados visualmente), mas não pôde ser fotografado nesta rodada. |
| login com wallet até `/auth/me` (fluxo completo) | Status: não executado nesta rodada. Motivo: o fluxo de assinatura real com wallet (Bloco 02/03) requer extensão de carteira conectada interativamente; este bloco reutiliza a infraestrutura já validada nos Blocos 01–06 (registrada como `authMeValidStatus=200` no feedback do Bloco 06) e focou em validar que o frontend NÃO usa perfil demo quando não há sessão. Impacto: nenhum — o contrato de `/auth/me` e a auth store já foram validados ponta a ponta no Bloco 06; este bloco apenas consome esses dados. |
| validar que profile demo não aparece em modo API | OK — confirmado visualmente (dropdown, sidebar, dashboard, contratos, novo contrato). |
| validar que ProfileSwitcher não altera role em modo API | OK — `ProfileSwitcher` retorna `null` quando `!env.useMocks` (confirmado por leitura de código e ausência do componente nas capturas de tela em modo real). |
| validar permissões visuais com role real | Parcial — estrutura validada por leitura de código (role vem de `authStore.role`); os 5 cenários de role específicos (`GESTOR`/`FISCAL`/`AUDITOR`/`FORNECEDOR`/`ENTREGADOR` reais) não puderam ser exercitados por exigirem múltiplas contas autenticadas reais, fora do escopo de criação deste bloco. |
| `git status` | Executado — escopo confirmado: 9 arquivos alterados + 1 arquivo novo (`use-current-profile.ts`), sem mistura com outras pendências do repositório. |

## 13. Pendências para os Próximos Blocos

```txt
- Bloco 08: integrar contratos reais (GET/POST /contracts, GET /contracts/{id}) — vai liberar a captura do estado "sem login" do ContractActionPanel com dados reais de contrato.
- Bloco 09: integrar actions reais.
- Bloco 10: integrar eventos/timeline/auditoria.
- Bloco 11: tratar blockchain indisponível.
- Bloco 12: teste ponta a ponta completo.
- Validar os 5 cenários de role real (GESTOR/FISCAL/AUDITOR/FORNECEDOR/ENTREGADOR) assim que existirem contas/sessões reais para cada perfil.
- Investigar e documentar eventual divergência entre wallet da extensão conectada (useWalletStore) e walletAddress retornada por /auth/me, quando o fluxo de login real completo estiver disponível para teste de ponta a ponta.
```

## 14. Conclusão Técnica

O Bloco 07 está concluído tecnicamente.

Foi criada uma fonte única e centralizada (`useCurrentProfile()`) que resolve o perfil ativo de forma determinística a partir de `env.useMocks`: perfil demo (`DEMO_PROFILES` via `useProfileStore`) em modo mock, ou perfil autenticado real (`authStore.profile`, vindo de `/auth/me`) em modo API real — sem qualquer fallback silencioso entre os dois.

Os 7 componentes que liam o perfil demo diretamente (`AppSidebar`, `DashboardPage`, `ContractsPage`, `CreateContractPage`, `DashboardRecentContracts`, `ContractActionPanel`, `ProfileIdentityCard`) e o `ProfileSwitcher`/`PermissionsShowcase` foram ajustados para usar essa fonte única e respeitar os 4 estados visuais exigidos (sem login, carregando, autenticado, erro).

Capturas de tela confirmaram visualmente o critério mais crítico do bloco: em modo API real sem sessão autenticada, a UI exibe "Conecte sua wallet para continuar" / "Autenticacao necessaria" — em nenhum momento o perfil demo "Maria Santos/GESTOR" aparece como se fosse real. O modo mock permanece integralmente funcional, com `DEMO_PROFILES`, `mockProfiles` e `ProfileSwitcher` preservados e não unificados, conforme decisão registrada no Bloco Extra.
