# Feedback — Bloco 07: Substituir Perfil Demo em Modo API Real

## 1. Resumo do que foi feito

Foi eliminado o uso do perfil demo/mock como fonte de verdade quando `NEXT_PUBLIC_USE_MOCKS=false`.

Regra aplicada:

```txt
NEXT_PUBLIC_USE_MOCKS=true  -> currentProfile = perfil demo (DEMO_PROFILES via useProfileStore)
NEXT_PUBLIC_USE_MOCKS=false -> currentProfile = perfil autenticado real (authStore.profile via /auth/me)
```

A separação foi centralizada em um novo hook único, `useCurrentProfile()`, consumido pelos 7 componentes que antes liam o perfil demo diretamente, mais `ProfileSwitcher` e `PermissionsShowcase`. Não existe nenhum caminho de código em que `mocks=false` resulte em fallback para `DEMO_PROFILES`.

Não foram iniciados contratos/actions/auditoria reais, nem unificação de `DEMO_PROFILES`/`mockProfiles`.

## 2. Arquivos criados

```txt
web/src/entities/profile/model/use-current-profile.ts
Docs/sessoes/sessao_02_integrar_back_e_front/analises/substituicao_perfil_demo_modo_api_real.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_07_substituir_perfil_demo_modo_api_real.md
```

## 3. Arquivos alterados

```txt
web/src/entities/profile/ui/profile-switcher.tsx
web/src/entities/profile/ui/profile-identity-card.tsx
web/src/widgets/app-sidebar/ui/app-sidebar.tsx
web/src/app/dashboard/page.tsx
web/src/app/contracts/_components/contracts-page.tsx
web/src/app/contracts/new/_components/create-contract-page.tsx
web/src/widgets/dashboard-recent-contracts/ui/dashboard-recent-contracts.tsx
web/src/features/contract-actions/ui/contract-action-panel.tsx
web/src/app/permissions-showcase.tsx
```

## 4. Pontos de profile demo encontrados

Mapeamento via busca por `DEMO_PROFILES`, `mockProfiles`, `mockProfileByRole`, `selectedProfile`, `currentProfile`, `useProfileStore`, `walletAddress`, `role`, `useProfile`, `useAuth`, `NEXT_PUBLIC_USE_MOCKS`:

```txt
ProfileIdentityCard       — exibia nome/role/wallet do perfil demo sempre
ProfileSwitcher           — sempre habilitado, mesmo sem relação com modo API
AppSidebar                — canCreateContract calculado sobre o perfil demo
DashboardPage             — idem
ContractsPage             — idem
CreateContractPage        — idem, sem checagem de autenticação real
DashboardRecentContracts  — idem
ContractActionPanel       — regras de ação calculadas sobre o perfil demo, RoleBadge demo
PermissionsShowcase       — showcase inteiro baseado em troca de perfil demo
```

Confirmados dois conjuntos de dados demo separados, mantidos sem unificação (decisão do Bloco Extra):

```txt
DEMO_PROFILES (web/src/entities/profile/model/store.ts)        -> useProfileStore / ProfileSwitcher
mockProfiles / mockProfileByRole (web/src/shared/mocks/profiles.mock.ts) -> dados de API mockada
```

`WalletAccountCard`/`WalletStatus` usam `useWalletStore` (wallet da extensão conectada — fora do escopo, não alterados).

## 5. Estratégia mock/API real

Criado `web/src/entities/profile/model/use-current-profile.ts`, exportando `useCurrentProfile(): ResolvedProfile`:

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

```txt
env.useMocks === true  -> resolve a partir de useProfileStore().currentProfile (DEMO_PROFILES)
env.useMocks === false -> resolve a partir de useAuthStore() (.profile, .role, .walletAddress,
                          .isAuthenticated, .isLoading, .error) — populado via /auth/me (Bloco 06)
```

Sem fallback entre os dois ramos. O hook não foi adicionado ao barrel `entities/profile/index.ts`, seguindo a convenção existente de não reexportar stores client-only.

## 6. Componentes ajustados

```txt
profile-switcher.tsx        -> if (!env.useMocks) return null;
profile-identity-card.tsx   -> reescrito: branch isMockMode (DemoProfileIdentity) vs estados reais
                               (loading / error com retry / não autenticado / autenticado)
app-sidebar.tsx             -> useProfileStore -> useCurrentProfile
dashboard/page.tsx          -> useProfileStore -> useCurrentProfile
contracts-page.tsx          -> useProfileStore -> useCurrentProfile
create-contract-page.tsx    -> renderContent(): trata !isMockMode (loading/error/não-autenticado)
                               antes de avaliar canCreate
dashboard-recent-contracts.tsx -> useProfileStore -> useCurrentProfile
contract-action-panel.tsx   -> useProfileStore -> useCurrentProfile + early-return de
                               loading/error/não-autenticado quando !isMockMode
permissions-showcase.tsx    -> gate: EmptyState "Disponível apenas em modo demo" quando !env.useMocks
```

## 7. Profile real em modo API

Em `mocks=false`, todos os componentes acima passaram a ler `profile` de `useCurrentProfile()`, que delega para `authStore.profile` (preenchido pelo fluxo `wallet → nonce → assinatura → verify → JWT → /auth/me`, já validado no Bloco 06).

Quando `profile === null` (sem sessão), nenhum componente renderiza dado do perfil demo — cada um exibe o estado "não autenticado" correspondente.

Validado visualmente: dashboard, sidebar (sem item "Novo contrato"), dropdown de perfil ("Conecte sua wallet para continuar") e CreateContractPage ("Autenticacao necessaria").

## 8. Role e permissões reais

`canCreateContract`, `canConfirmShipment`, `canAuthorizePayment`, `canOpenDispute`, `canSimulateFraud`, `canRegisterOnChain`, `getNextContractAction`, `getBlockedActionReason` recebem o `profile` resolvido pelo hook — em `mocks=false`, esse `profile.role` vem de `authStore.role` (de `/auth/me`), nunca de `DEMO_PROFILES`. `RoleBadge` em `ContractActionPanel` exibe a role real.

```txt
[OK]      estrutura validada por leitura de código — role nunca vem do perfil demo em modo real
[parcial] os 5 cenários de role real (GESTOR/FISCAL/AUDITOR/FORNECEDOR/ENTREGADOR) não puderam
          ser exercitados visualmente — exigem múltiplas contas/sessões reais autenticadas,
          fora do escopo de criação deste bloco (ver seção 12 e 14_observações)
```

## 9. Wallet real exibida

Em `mocks=false`, `walletAddress` vem de `authStore.walletAddress` (de `/auth/me`), exibido em `ProfileIdentityCard` via `shortenAddress(profile.walletAddress, 6)`. A wallet demo `0x8888...` não é exibida em modo real (branch `isMockMode` inacessível quando `env.useMocks === false`).

`WalletConnectButton` (não alterado) já tratava os modos corretamente: "Conectar wallet (demo)" em mock, "Conectar wallet" em modo real.

Possível divergência entre wallet da extensão (`useWalletStore`) e `authStore.walletAddress` não foi observável neste bloco (requer fluxo de login real completo) — registrada como pendência na seção 12.

## 10. Preservação do mock mode

Validado com `NEXT_PUBLIC_USE_MOCKS=true`:

```txt
mockModeProfileSwitcherVisible=true
mockModeDemoProfileShown=true        ("Maria Santos / GESTOR")
mockModeRoleBadgeDemo=true
mockModeWalletDemoShown=true
mockModeNoAuthMeCalled=true
```

`DEMO_PROFILES`, `mockProfiles`/`mockProfileByRole` e `useProfileStore` permanecem intactos e separados — alteração restrita a um gate de visibilidade no `ProfileSwitcher` e a um branch `isMockMode` nos demais componentes.

## 11. Validações executadas

| Validação | Resultado |
|---|---|
| `npm run lint` | OK, sem erros/warnings. |
| `npm run build` | OK, build de produção concluído. |
| `docker compose config` em `backend/` | OK. |
| `docker compose ps` | OK — `fiscalizapay-api`/`fiscalizapay-db` Up/healthy. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200, `{"status":"ok"}`. |
| UI `NEXT_PUBLIC_USE_MOCKS=true` (dashboard/dropdown/contrato) | OK — perfil demo e ProfileSwitcher preservados (capturas de tela). |
| UI `NEXT_PUBLIC_USE_MOCKS=false` — dashboard | OK — sem dados demo, estados de erro de API exibidos. |
| UI `NEXT_PUBLIC_USE_MOCKS=false` — dropdown de perfil sem login | OK — "Conecte sua wallet para continuar" (captura de tela). |
| UI `NEXT_PUBLIC_USE_MOCKS=false` — CreateContractPage sem login | OK — "Autenticacao necessaria / Conecte sua wallet e faca login..." (captura de tela). |
| UI `NEXT_PUBLIC_USE_MOCKS=false` — ContractActionPanel sem login | Status: não executado. Motivo: a página de detalhe falha ao carregar o contrato antes do painel montar ("Erro ao carregar contrato" — sem endpoint público de contrato e sem sessão JWT real no ambiente). Impacto: branch validado por leitura de código (mesmo padrão de `ProfileIdentityCard`/`CreateContractPage`, já confirmados visualmente); sem regressão identificada. |
| login com wallet até `/auth/me` (fluxo completo) | Status: não executado nesta rodada. Motivo: requer extensão de wallet conectada interativamente; a infraestrutura já foi validada ponta a ponta no Bloco 06 (`authMeValidStatus=200`). Impacto: nenhum — este bloco apenas consome `authStore`/`/auth/me`, já testados. |
| profile demo não aparece em modo API | OK — confirmado visualmente em todas as telas navegadas. |
| ProfileSwitcher não altera role em modo API | OK — retorna `null` quando `!env.useMocks` (código + ausência nas capturas em modo real). |
| permissões visuais com role real | Parcial — estrutura correta validada por leitura de código; os 5 cenários de role específicos não puderam ser exercitados (exigem contas reais por role, fora do escopo de criação deste bloco). |
| `git status` | Executado — escopo confirmado: 9 arquivos alterados + 2 novos (hook + análise), sem mistura com outras pendências do repositório. |

## 12. Pendências encontradas

```txt
- Bloco 08 vai liberar dados reais de contrato — permitirá fotografar o estado "sem login"
  do ContractActionPanel (atualmente bloqueado por "Erro ao carregar contrato").
- Validar os 5 cenários de role real (GESTOR/FISCAL/AUDITOR/FORNECEDOR/ENTREGADOR) assim que
  existirem contas/sessões reais para cada perfil.
- Investigar eventual divergência entre wallet da extensão conectada (useWalletStore) e
  walletAddress de /auth/me, quando o teste ponta a ponta (Bloco 12) estiver disponível.
- Demais pendências esperadas do bloco: integrar contratos reais (Bloco 08), actions reais
  (Bloco 09), eventos/timeline/auditoria (Bloco 10), blockchain indisponível (Bloco 11),
  teste ponta a ponta (Bloco 12).
```

## 13. Commit realizado

Commit semântico realizado:

```txt
feat: substituir perfil demo por perfil autenticado em modo api
```

Hash: `209cc3e`

Escopo do commit (11 arquivos): hook novo + análise técnica + 9 componentes ajustados — sem mistura com contratos/actions/auditoria ou outras pendências do repositório.

## 14. Observações para o próximo bloco

Durante a validação em modo API real, o dev server (`next dev` / Turbopack) retornou 404 persistente em `/contracts/new` ao subir com `NEXT_PUBLIC_USE_MOCKS=false` via variável de ambiente de shell — causado por um diretório `.next` obsoleto deixado por execuções anteriores de `npm run build`. Resolvido removendo `.next` e reiniciando o dev server (não é uma regressão de código; documentado aqui para referência caso reapareça em sessões futuras).

O Bloco 08 deve usar o `currentProfile`/`role`/`walletAddress` resolvidos por `useCurrentProfile()` (já real em modo API) ao integrar `GET /contracts`, `POST /contracts` e `GET /contracts/{id}`, e poderá aproveitar a oportunidade para finalmente fotografar o estado "sem login" do `ContractActionPanel` assim que existir um contrato real acessível.
