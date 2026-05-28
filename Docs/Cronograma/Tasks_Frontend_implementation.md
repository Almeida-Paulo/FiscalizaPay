# Tasks Frontend Implementation — FiscalizaPay Web3

## 1. Objetivo deste arquivo

Este documento redefine as tasks da **Pessoa 2 — Frontend / UI Lead**, considerando o nível atual do projeto após as sessões de coerência, decisões técnicas finais e organização da documentação.

O objetivo é transformar o checklist antigo em um plano de implementação frontend mais profissional, operacional e compatível com a arquitetura atual do FiscalizaPay Web3.

Este arquivo deve orientar a implementação do frontend sem mexer em backend, banco de dados, smart contract ou regras internas da Pessoa 3.

---

## 2. Diagnóstico do checklist atual

O checklist atual dentro de `fiscalizapay_divisao_etapas_equipe.md` está correto como visão macro, mas está simples demais para o nível atual do projeto.

Ele já contempla pontos importantes como:

- criação do projeto Next.js;
- configuração de TailwindCSS;
- configuração de shadcn/ui;
- configuração de wagmi, viem e RainbowKit;
- TanStack Query;
- Zustand;
- Feature-Sliced Design;
- mocks;
- dashboard;
- listagem;
- cadastro;
- detalhe;
- timeline;
- badges;
- ações por perfil/status;
- integração com API;
- disputa;
- simulação de fraude.

Porém, para iniciar desenvolvimento real com segurança, o checklist precisa ser mais detalhado em:

- ordem de implementação;
- dependência entre tarefas;
- critérios de aceite por bloco;
- organização por arquitetura Feature-Sliced Design;
- separação entre mock e API real;
- componentes compartilhados;
- entities;
- features;
- widgets;
- telas;
- providers;
- design system;
- estados de loading, error e empty;
- validações com Zod;
- query keys;
- integração visual com wallet;
- responsividade;
- qualidade para demo.

---

## 3. Escopo da Pessoa 2

A Pessoa 2 deve atuar apenas no frontend.

### Responsabilidades permitidas

```txt
- Criar base Next.js App Router.
- Configurar stack frontend.
- Criar estrutura Feature-Sliced Design.
- Criar design system visual.
- Criar componentes reutilizáveis.
- Criar mocks compatíveis com a API.
- Criar telas principais.
- Criar fluxo visual do contrato.
- Criar integração com TanStack Query.
- Criar camada de API client.
- Preparar substituição de mocks por API real.
- Criar conexão visual com wallet.
- Exibir documentHash e transactionHash.
- Criar disputa e fraude simulada no frontend.
- Garantir responsividade.
- Preparar demo visual.
```

### Responsabilidades que não pertencem à Pessoa 2

```txt
- Criar backend.
- Criar banco de dados.
- Criar endpoints reais.
- Criar smart contract.
- Fazer deploy em testnet.
- Definir regras finais de permissão no backend.
- Validar segurança real.
- Persistir dados reais.
- Implementar assinatura Web3 real completa.
```

O frontend pode simular ou consumir esses comportamentos, mas a responsabilidade técnica final é da Pessoa 3.

---

## 4. Stack oficial do frontend

A implementação deve seguir obrigatoriamente:

```txt
Next.js App Router
TypeScript
TailwindCSS
shadcn/ui
Framer Motion
TanStack Query
Zustand
React Hook Form
Zod
wagmi
viem
RainbowKit
Lucide React
```

Não usar como stack principal:

```txt
Vite
React Router
Axios como padrão principal se o projeto já usar fetch/httpClient
Ethers.js como lib principal do frontend
```

---

## 5. Arquitetura oficial do frontend

A estrutura deve seguir Feature-Sliced Design:

```txt
src/
├── app/
├── pages/
├── widgets/
├── features/
├── entities/
└── shared/
```

### Responsabilidade de cada camada

```txt
app/
- Providers globais
- Layout raiz
- Configuração de tema
- Configuração TanStack Query
- Configuração Web3
- Estilos globais
- Metadata

pages/
- Composição das telas principais
- Dashboard
- Contratos
- Detalhe do contrato
- Auditoria
- Disputas

widgets/
- AppSidebar
- AppHeader
- DashboardMetrics
- ContractTimeline
- ContractActionPanel
- WalletStatus
- AuditSummary

features/
- create-contract
- confirm-shipment
- confirm-delivery
- validate-receipt
- authorize-payment
- open-dispute
- simulate-fraud
- connect-wallet

entities/
- contract
- contract-event
- profile
- document
- wallet
- transaction

shared/
- api
- config
- constants
- hooks
- lib
- mocks
- types
- ui
```

---

## 6. Bloco 0 — Preparação antes de codar

### Objetivo

Garantir que a Pessoa 2 comece a implementação usando os documentos certos.

### Tasks

- [ ] Ler `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`.
- [ ] Ler `Docs/Governanca_tecnica/decisoes_tecnicas_finais.md`.
- [ ] Ler `Docs/Governanca_tecnica/glossario_tecnico_oficial.md`.
- [ ] Ler `Docs/Governanca_tecnica/criterios_aceite_mvp.md`.
- [ ] Ler `Docs/Planos_implementacao/plano_implementacao_frontend.md`.
- [ ] Ler `Docs/Base_do_projeto/oraculum_design_system.md`.
- [ ] Confirmar que o frontend deve iniciar mockado.
- [ ] Confirmar que `NEXT_PUBLIC_ENABLE_MOCKS=true` será usado no início.
- [ ] Confirmar que a API real será integrada depois.
- [ ] Confirmar que o backend não será alterado pela Pessoa 2.

### Critérios de aceite

- [ ] A Pessoa 2 sabe exatamente quais documentos seguir.
- [ ] Não há dúvida sobre stack, arquitetura, status, roles e endpoints.
- [ ] O desenvolvimento pode começar sem depender do backend.

---

## 7. Bloco 1 — Criação e configuração do projeto

### Objetivo

Criar a base técnica do frontend.

### Tasks

- [ ] Criar projeto com Next.js App Router.
- [ ] Habilitar TypeScript.
- [ ] Configurar TailwindCSS.
- [ ] Configurar shadcn/ui.
- [ ] Configurar alias `@/`.
- [ ] Configurar ESLint.
- [ ] Configurar Prettier, se ainda não existir.
- [ ] Configurar estrutura `src/`.
- [ ] Criar estrutura Feature-Sliced Design.
- [ ] Criar arquivo `.env.example`.
- [ ] Adicionar variáveis públicas esperadas.
- [ ] Configurar fonte/tipografia base.
- [ ] Configurar estilos globais.
- [ ] Configurar tema dark como padrão.
- [ ] Remover boilerplate inicial do Next.js.

### Variáveis frontend esperadas

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_EXPLORER_URL=
```

### Critérios de aceite

- [ ] O projeto roda localmente.
- [ ] O build inicial não quebra.
- [ ] Tailwind está funcionando.
- [ ] shadcn/ui está funcionando.
- [ ] A estrutura FSD existe.
- [ ] O projeto está pronto para receber componentes.

---

## 8. Bloco 2 — Providers globais

### Objetivo

Configurar as bases globais da aplicação.

### Tasks

- [x] Criar `app/providers`.
- [x] Configurar `QueryClientProvider` do TanStack Query.
- [x] Configurar `WagmiProvider`.
- [x] Configurar `RainbowKitProvider`.
- [x] Configurar tema do RainbowKit compatível com dark system.
- [x] Criar provider de toast/sonner.
- [x] Garantir que providers client-side usem `"use client"`.
- [x] Evitar transformar o layout inteiro em Client Component sem necessidade.
- [x] Criar `shared/config/web3.ts` com wagmiConfig.
- [x] Atualizar `.env.example` com NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.
- [x] Atualizar `web/README.md` com seção de providers.
- [x] npm run lint → PASSOU
- [x] npm run build → PASSOU

### Critérios de aceite

- [x] TanStack Query está disponível globalmente.
- [x] Wallet provider está preparado.
- [x] Toasts funcionam.
- [x] App Router permanece organizado.
- [x] Não há erro de hydration.

### Versionamento

- [x] Fazer commit semântico do Bloco 2.
- [ ] Fazer push da branch após validação.

---

## 9. Bloco 3 — Design system e UI base

### Objetivo

Criar os componentes visuais reutilizáveis da aplicação.

### Tasks

- [ ] Aplicar paleta oficial.
- [ ] Criar tokens de cor no Tailwind.
- [ ] Criar padrão de background.
- [ ] Criar padrão de cards.
- [ ] Criar padrão de bordas.
- [ ] Criar padrão de textos.
- [ ] Criar padrão de hover/focus.
- [ ] Criar padrão de badge.
- [ ] Criar padrão de botões de ação.
- [ ] Criar padrão de cards de métricas.
- [ ] Criar padrão de section headers.
- [ ] Criar padrão de empty state.
- [ ] Criar padrão de error state.
- [ ] Criar padrão de loading/skeleton.
- [ ] Criar padrão de modal/dialog.
- [ ] Criar padrão de tabela ou lista.
- [ ] Criar padrão de filtros.
- [ ] Criar padrão de timeline.
- [ ] Criar animações leves com Framer Motion.

### Paleta oficial

```txt
Background: #050816
Cards: #0F172A
Bordas: #1E293B
Texto principal: #F8FAFC
Texto secundário: #94A3B8
Destaque primário: #22D3EE
Neon Oraculum: #11DFF2
Sucesso: #22C55E
Alerta: #F59E0B
Erro: #EF4444
```

### Componentes `shared/ui`

- [ ] `Button`
- [ ] `Card`
- [ ] `Badge`
- [ ] `Input`
- [ ] `Textarea`
- [ ] `Select`
- [ ] `Dialog`
- [ ] `Dropdown`
- [ ] `Tooltip`
- [ ] `Skeleton`
- [ ] `EmptyState`
- [ ] `ErrorState`
- [ ] `LoadingState`
- [ ] `PageHeader`
- [ ] `SectionTitle`

### Critérios de aceite

- [ ] A interface possui identidade visual consistente.
- [ ] Os componentes base não possuem regra de negócio.
- [ ] Os componentes são reutilizáveis.
- [ ] O visual está alinhado ao Oraculum/FiscalizaPay.
- [ ] A aplicação já parece profissional mesmo com dados mockados.

---

## 10. Bloco 4 — Modelos de domínio no frontend

### Objetivo

Criar os tipos oficiais do domínio no frontend.

### Tasks

- [ ] Criar `entities/contract/model/types.ts`.
- [ ] Criar `entities/contract-event/model/types.ts`.
- [ ] Criar `entities/profile/model/types.ts`.
- [ ] Criar `entities/wallet/model/types.ts`.
- [ ] Criar `entities/transaction/model/types.ts`.
- [ ] Criar `shared/types/api.ts`.
- [ ] Criar status oficiais.
- [ ] Criar roles oficiais.
- [ ] Criar event types oficiais.
- [ ] Criar status map visual.
- [ ] Criar role map visual.
- [ ] Criar event type map visual.

### Status oficiais

```ts
export type ContractStatus =
  | "CRIADO"
  | "ENVIADO"
  | "ENTREGUE"
  | "VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA";
```

### Roles oficiais

```ts
export type UserRole =
  | "GESTOR"
  | "FORNECEDOR"
  | "ENTREGADOR"
  | "FISCAL"
  | "AUDITOR";
```

### Event types oficiais

```ts
export type ContractEventType =
  | "CONTRATO_CRIADO"
  | "ENVIO_CONFIRMADO"
  | "ENTREGA_CONFIRMADA"
  | "RECEBIMENTO_VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA_ABERTA"
  | "FRAUDE_SIMULADA"
  | "HASH_REGISTRADO";
```

### Critérios de aceite

- [ ] Nenhum status em inglês é usado como oficial.
- [ ] Nenhuma role em inglês é usada como oficial.
- [ ] Event types seguem SCREAMING_SNAKE_CASE.
- [ ] Os tipos batem com o contrato API.
- [ ] Os componentes usam esses tipos.

---

## 11. Bloco 5 — Regras visuais e permissões no frontend

### Objetivo

Criar regras visuais para habilitar/desabilitar ações no frontend.

### Tasks

- [ ] Criar `entities/contract/model/rules.ts`.
- [ ] Criar `canConfirmShipment`.
- [ ] Criar `canConfirmDelivery`.
- [ ] Criar `canValidateReceipt`.
- [ ] Criar `canAuthorizePayment`.
- [ ] Criar `canOpenDispute`.
- [ ] Criar `canSimulateFraud`.
- [ ] Criar `getNextContractAction`.
- [ ] Criar `getContractProgress`.
- [ ] Criar `getContractStatusLabel`.
- [ ] Criar `getContractStatusVariant`.

### Observação importante

Essas regras são apenas visuais.

O backend continua sendo a fonte definitiva de segurança.

### Critérios de aceite

- [ ] Regras não ficam espalhadas no JSX.
- [ ] Botões respeitam status e perfil.
- [ ] Componentes usam funções de domínio.
- [ ] Permissões visuais estão claras na demo.

---

## 12. Bloco 6 — Cliente HTTP e estratégia de mocks

### Objetivo

Permitir que o frontend funcione antes do backend.

### Tasks

- [ ] Criar `shared/api/httpClient.ts`.
- [ ] Criar `shared/config/env.ts`.
- [ ] Criar `shared/mocks/contracts.mock.ts`.
- [ ] Criar `shared/mocks/contract-events.mock.ts`.
- [ ] Criar `shared/mocks/profiles.mock.ts`.
- [ ] Criar `shared/mocks/dashboard.mock.ts`.
- [ ] Criar camada que alterna entre mock e API real.
- [ ] Usar `NEXT_PUBLIC_ENABLE_MOCKS`.
- [ ] Garantir que mocks sigam o contrato API.
- [ ] Criar dados mockados completos para demo.
- [ ] Criar pelo menos 5 contratos mockados.
- [ ] Criar pelo menos 1 contrato em cada status principal.
- [ ] Criar pelo menos 1 contrato em disputa.
- [ ] Criar timeline completa para contrato demo.

### Critérios de aceite

- [ ] Com backend desligado, o frontend funciona.
- [ ] Os mocks usam os mesmos tipos da API.
- [ ] Alternar mock/API não exige mexer nos componentes.
- [ ] Dados mockados contam uma história boa para apresentação.

---

## 13. Bloco 7 — TanStack Query e hooks de dados

### Objetivo

Criar hooks oficiais para leitura e mutations.

### Tasks

- [ ] Criar `useDashboardSummary`.
- [ ] Criar `useContracts`.
- [ ] Criar `useContractById`.
- [ ] Criar `useContractEvents`.
- [ ] Criar `useBlockchainStatus`.
- [ ] Criar `useCreateContract`.
- [ ] Criar `useConfirmShipment`.
- [ ] Criar `useConfirmDelivery`.
- [ ] Criar `useValidateReceipt`.
- [ ] Criar `useAuthorizePayment`.
- [ ] Criar `useOpenDispute`.
- [ ] Criar `useSimulateFraud`.
- [ ] Definir query keys oficiais.
- [ ] Invalidar queries após mutations.
- [ ] Tratar loading.
- [ ] Tratar error.
- [ ] Tratar success toast.

### Query keys oficiais

```ts
["dashboard-summary"]
["contracts"]
["contract", contractId]
["contract-events", contractId]
["blockchain-status", contractId]
```

### Critérios de aceite

- [ ] Nenhuma tela chama fetch direto.
- [ ] Dados remotos passam por hooks.
- [ ] Mutations invalidam dados corretamente.
- [ ] Loading/error/success são tratados.
- [ ] Hooks funcionam com mock e API real.

---

## 14. Bloco 8 — Layout principal

### Objetivo

Criar a estrutura visual base da aplicação.

### Tasks

- [ ] Criar `widgets/app-sidebar`.
- [ ] Criar `widgets/app-header`.
- [ ] Criar navegação principal.
- [ ] Criar área principal de conteúdo.
- [ ] Criar menu mobile com Sheet.
- [ ] Criar indicador de wallet no header.
- [ ] Criar seletor visual de perfil mockado, se necessário para demo.
- [ ] Criar breadcrumbs ou título contextual.
- [ ] Criar layout responsivo.
- [ ] Criar estados ativos de navegação.

### Rotas mínimas

```txt
/
 /dashboard
 /contracts
 /contracts/new
 /contracts/[id]
 /disputes
 /audit
```

### Critérios de aceite

- [ ] Sidebar funciona no desktop.
- [ ] Menu mobile funciona.
- [ ] Header exibe contexto atual.
- [ ] Wallet status aparece no layout.
- [ ] Navegação é clara.

---

## 15. Bloco 9 — Dashboard

### Objetivo

Criar a tela inicial do sistema.

### Tasks

- [ ] Criar `pages/dashboard`.
- [ ] Criar widget `dashboard-metrics`.
- [ ] Criar cards de métrica.
- [ ] Criar listagem de contratos recentes.
- [ ] Criar indicador de progresso geral.
- [ ] Criar cards por status.
- [ ] Criar seção de alertas.
- [ ] Criar link rápido para novo contrato.
- [ ] Criar link para contratos em disputa.
- [ ] Criar loading state.
- [ ] Criar empty state.
- [ ] Criar error state.

### Métricas mínimas

```txt
Total de contratos
Contratos criados
Aguardando envio
Aguardando entrega
Aguardando fiscalização
Pagamentos autorizados
Contratos em disputa
```

### Critérios de aceite

- [ ] Dashboard funciona com mocks.
- [ ] Cards possuem visual forte.
- [ ] Métricas batem com dados mockados.
- [ ] Usuário consegue navegar para contrato.
- [ ] Dashboard fica bom para print/demo.

---

## 16. Bloco 10 — Listagem de contratos

### Objetivo

Criar tela para visualizar e filtrar contratos.

### Tasks

- [ ] Criar `pages/contracts`.
- [ ] Criar `entities/contract/ui/ContractCard`.
- [ ] Criar `entities/contract/ui/ContractStatusBadge`.
- [ ] Criar `entities/contract/ui/ContractAmount`.
- [ ] Criar busca por número/fornecedor.
- [ ] Criar filtro por status.
- [ ] Criar filtro por órgão público.
- [ ] Criar ordenação por atualização.
- [ ] Criar botão para visualizar detalhe.
- [ ] Criar botão para novo contrato.
- [ ] Criar loading state.
- [ ] Criar empty state.
- [ ] Criar error state.
- [ ] Criar versão responsiva.

### Critérios de aceite

- [ ] Usuário consegue encontrar contratos.
- [ ] Filtros funcionam com mocks.
- [ ] Status aparece com badge.
- [ ] Cards/tabela são responsivos.
- [ ] Clique abre detalhe do contrato.

---

## 17. Bloco 11 — Cadastro de contrato

### Objetivo

Criar formulário para criação de contrato.

### Tasks

- [ ] Criar `pages/contracts/new`.
- [ ] Criar feature `create-contract`.
- [ ] Criar `createContractSchema`.
- [ ] Criar `CreateContractForm`.
- [ ] Usar React Hook Form.
- [ ] Usar Zod resolver.
- [ ] Validar campos obrigatórios.
- [ ] Validar valor maior que zero.
- [ ] Validar endereço de wallet em campos de carteira.
- [ ] Validar prazo/data.
- [ ] Exibir mensagens de erro amigáveis.
- [ ] Exibir toast de sucesso.
- [ ] Redirecionar para detalhe após criar.
- [ ] Criar loading no botão.
- [ ] Criar estado de erro da mutation.

### Campos mínimos

```txt
contractNumber
publicAgency
supplierName
supplierWallet
object
amount
deadline
inspectorName
inspectorWallet
logisticsResponsible
logisticsWallet
managerName
managerWallet
documentHash
```

### Critérios de aceite

- [ ] Formulário não envia dados inválidos.
- [ ] Formulário segue contrato API.
- [ ] UX de erro é clara.
- [ ] UX de sucesso é clara.
- [ ] Após criar, usuário entende o próximo passo.

---

## 18. Bloco 12 — Detalhe do contrato

### Objetivo

Criar a tela mais importante da demo.

### Tasks

- [ ] Criar `pages/contracts/[id]`.
- [ ] Criar resumo principal do contrato.
- [ ] Criar status atual em destaque.
- [ ] Criar próxima ação sugerida.
- [ ] Criar dados das partes envolvidas.
- [ ] Criar seção de valor/prazo.
- [ ] Criar painel de ações.
- [ ] Criar timeline auditável.
- [ ] Criar área de hashes.
- [ ] Criar área de transactionHash.
- [ ] Criar link para explorer.
- [ ] Criar alerta se estiver em disputa.
- [ ] Criar loading state.
- [ ] Criar error state.
- [ ] Criar not found state.

### Critérios de aceite

- [ ] Usuário entende rapidamente o status do contrato.
- [ ] Usuário entende qual é a próxima etapa.
- [ ] Ações são exibidas conforme status/perfil.
- [ ] Timeline aparece na mesma tela.
- [ ] Hash/tx hash ficam visíveis.
- [ ] Tela é convincente para apresentação.

---

## 19. Bloco 13 — Timeline auditável

### Objetivo

Criar componente visual de auditoria do contrato.

### Tasks

- [ ] Criar `widgets/contract-timeline`.
- [ ] Criar `entities/contract-event/ui/ContractEventCard`.
- [ ] Criar ícones por event type.
- [ ] Criar label por event type.
- [ ] Criar status before/after.
- [ ] Exibir responsável.
- [ ] Exibir role.
- [ ] Exibir data/hora.
- [ ] Exibir documentHash.
- [ ] Exibir transactionHash.
- [ ] Criar `TransactionHashLink`.
- [ ] Criar `DocumentHashViewer`.
- [ ] Criar estado vazio.
- [ ] Criar animação de entrada.
- [ ] Destacar evento atual/concluído.

### Critérios de aceite

- [ ] Cada evento é compreensível.
- [ ] Hash é legível e copiável.
- [ ] Tx hash possui link quando possível.
- [ ] Timeline reforça a ideia de auditoria.
- [ ] Timeline é visualmente forte.

---

## 20. Bloco 14 — Painel de ações do contrato

### Objetivo

Criar ações de avanço de status.

### Tasks

- [ ] Criar `widgets/contract-action-panel`.
- [ ] Criar feature `confirm-shipment`.
- [ ] Criar feature `confirm-delivery`.
- [ ] Criar feature `validate-receipt`.
- [ ] Criar feature `authorize-payment`.
- [ ] Criar feature `open-dispute`.
- [ ] Criar feature `simulate-fraud`.
- [ ] Criar botões por ação.
- [ ] Criar dialogs de confirmação.
- [ ] Criar estados de loading nos botões.
- [ ] Criar estados disabled com tooltip explicativo.
- [ ] Criar toast de sucesso.
- [ ] Criar toast de erro.
- [ ] Invalidar queries após ação.
- [ ] Atualizar timeline após ação.

### Critérios de aceite

- [ ] Botões não aparecem de forma aleatória.
- [ ] Usuário entende por que uma ação está bloqueada.
- [ ] Cada ação atualiza o status.
- [ ] Cada ação cria/mostra evento.
- [ ] A demo consegue seguir o fluxo completo.

---

## 21. Bloco 15 — Disputa e fraude simulada

### Objetivo

Criar cena de impacto para demo.

### Tasks

- [ ] Criar modal de abertura de disputa.
- [ ] Criar `openDisputeSchema`.
- [ ] Criar campo de motivo.
- [ ] Criar seleção de tipo de divergência.
- [ ] Criar feature `simulate-fraud`.
- [ ] Criar visual comparando hash original e hash alterado.
- [ ] Criar alerta de hash incompatível.
- [ ] Criar estado `DISPUTA`.
- [ ] Bloquear visualmente autorização de pagamento.
- [ ] Registrar/exibir evento `FRAUDE_SIMULADA`.
- [ ] Registrar/exibir evento `DISPUTA_ABERTA`.
- [ ] Criar animação/efeito visual de alerta.
- [ ] Criar CTA para consultar timeline.

### Critérios de aceite

- [ ] Usuário entende que houve divergência.
- [ ] O impacto visual é forte.
- [ ] Pagamento aparece bloqueado.
- [ ] Timeline prova o ocorrido.
- [ ] Cena serve para apresentação final.

---

## 22. Bloco 16 — Wallet e perfil visual

### Objetivo

Criar integração visual com carteira e perfis.

### Tasks

- [ ] Criar feature `connect-wallet`.
- [ ] Criar `WalletConnectButton`.
- [ ] Criar `WalletStatus`.
- [ ] Exibir endereço curto.
- [ ] Exibir rede atual.
- [ ] Exibir alerta de rede incorreta.
- [ ] Exibir link para explorer da carteira, se aplicável.
- [ ] Criar perfil mockado via Zustand.
- [ ] Criar seletor de perfil para demo.
- [ ] Relacionar perfil visual com permissões.
- [ ] Preparar integração futura com assinatura de mensagem.

### Importante

No MVP, autenticação Web3 real completa não é responsabilidade obrigatória do frontend.

A prioridade é:

```txt
Conectar wallet visualmente
Exibir endereço
Permitir demo por perfil
Preparar integração futura
```

### Critérios de aceite

- [ ] Wallet conecta visualmente.
- [ ] Endereço aparece encurtado.
- [ ] Perfil atual aparece na interface.
- [ ] Botões mudam conforme perfil/status.
- [ ] Não há dependência obrigatória de backend para demonstrar perfil.

---

## 23. Bloco 17 — Auditoria e tela de consulta

### Objetivo

Criar tela ou área para reforçar rastreabilidade.

### Tasks

- [ ] Criar `pages/audit`.
- [ ] Exibir contratos com eventos críticos.
- [ ] Exibir filtros por status.
- [ ] Exibir filtros por evento.
- [ ] Exibir hashes recentes.
- [ ] Exibir tx hashes recentes.
- [ ] Criar cards de auditoria.
- [ ] Criar CTA para abrir detalhe do contrato.
- [ ] Criar empty/loading/error states.

### Critérios de aceite

- [ ] A tela reforça o valor de auditoria.
- [ ] Auditor consegue consultar eventos.
- [ ] Interface mostra rastreabilidade.
- [ ] Tela pode ser usada na demo se houver tempo.

---

## 24. Bloco 18 — Responsividade e polish visual

### Objetivo

Garantir qualidade visual e usabilidade.

### Tasks

- [ ] Revisar desktop.
- [ ] Revisar notebook.
- [ ] Revisar tablet.
- [ ] Revisar mobile.
- [ ] Ajustar sidebar mobile.
- [ ] Ajustar tabelas/cards em telas pequenas.
- [ ] Ajustar formulários.
- [ ] Ajustar espaçamentos.
- [ ] Ajustar contraste.
- [ ] Ajustar animações.
- [ ] Ajustar estados hover/focus.
- [ ] Ajustar acessibilidade básica.
- [ ] Garantir que textos não estourem.
- [ ] Garantir que hashes longos não quebrem layout.
- [ ] Criar copy-to-clipboard para hashes.

### Critérios de aceite

- [ ] A aplicação é utilizável em mobile.
- [ ] A demo fica excelente em desktop.
- [ ] Não existem quebras visuais graves.
- [ ] Hashes e tx hashes são legíveis.
- [ ] Interface mantém padrão profissional.

---

## 25. Bloco 19 — Integração com API real

### Objetivo

Trocar mocks por API real quando Pessoa 3 liberar backend.

### Tasks

- [ ] Confirmar `NEXT_PUBLIC_API_URL`.
- [ ] Desativar mocks com `NEXT_PUBLIC_ENABLE_MOCKS=false`.
- [ ] Testar `GET /dashboard/summary`.
- [ ] Testar `GET /contracts`.
- [ ] Testar `POST /contracts`.
- [ ] Testar `GET /contracts/:id`.
- [ ] Testar `GET /contracts/:id/events`.
- [ ] Testar `POST /contracts/:id/confirm-shipment`.
- [ ] Testar `POST /contracts/:id/confirm-delivery`.
- [ ] Testar `POST /contracts/:id/validate-receipt`.
- [ ] Testar `POST /contracts/:id/authorize-payment`.
- [ ] Testar `POST /contracts/:id/open-dispute`.
- [ ] Testar `POST /contracts/:id/simulate-fraud`.
- [ ] Testar `GET /contracts/:id/blockchain-status`.
- [ ] Testar `POST /contracts/:id/register-on-chain`.
- [ ] Ajustar pequenos detalhes de payload apenas se o contrato API permitir.
- [ ] Reportar divergências para Pessoa 3, sem alterar backend diretamente.

### Critérios de aceite

- [ ] Frontend consome API real.
- [ ] Erros da API aparecem de forma amigável.
- [ ] Timeline atualiza com dados reais.
- [ ] Actions funcionam ponta a ponta.
- [ ] Mocks ainda podem ser reativados para demo/plano B.

---

## 26. Bloco 20 — Preparação da demo frontend

### Objetivo

Deixar o frontend pronto para apresentação.

### Tasks

- [ ] Criar contrato demo com dados realistas.
- [ ] Criar fluxo feliz completo.
- [ ] Criar fluxo de disputa.
- [ ] Criar fluxo de fraude simulada.
- [ ] Preparar tela inicial limpa.
- [ ] Preparar roteiro de cliques.
- [ ] Garantir que botões principais estejam visíveis.
- [ ] Garantir que os dados mockados contem uma história.
- [ ] Garantir que loading não atrapalhe a demo.
- [ ] Criar plano B com mocks ativados.
- [ ] Testar apresentação em tela cheia.
- [ ] Fazer ensaio de 5 minutos.

### Critérios de aceite

- [ ] A demo pode ser feita sem improviso.
- [ ] O fluxo completo funciona.
- [ ] A fraude gera impacto visual.
- [ ] O valor da solução fica claro.
- [ ] Existe plano B caso backend falhe.

---

## 27. Checklist resumido por prioridade

## Prioridade P0 — Fundação obrigatória

- [ ] Criar projeto Next.js App Router.
- [ ] Configurar TypeScript.
- [ ] Configurar TailwindCSS.
- [ ] Configurar shadcn/ui.
- [ ] Criar estrutura Feature-Sliced Design.
- [ ] Configurar providers globais.
- [ ] Criar design tokens.
- [ ] Criar tipos oficiais.
- [ ] Criar mocks compatíveis com API.
- [ ] Criar httpClient.
- [ ] Criar hooks TanStack Query base.

## Prioridade P1 — Produto principal

- [ ] Criar layout base.
- [ ] Criar dashboard.
- [ ] Criar listagem de contratos.
- [ ] Criar cadastro de contrato.
- [ ] Criar detalhe do contrato.
- [ ] Criar timeline auditável.
- [ ] Criar painel de ações.
- [ ] Criar fluxo visual por status.
- [ ] Criar permissões visuais por perfil.
- [ ] Criar loading/error/empty states.

## Prioridade P2 — Diferencial Web3/demo

- [ ] Criar integração visual com wallet.
- [ ] Exibir documentHash.
- [ ] Exibir transactionHash.
- [ ] Criar link para explorer.
- [ ] Criar disputa.
- [ ] Criar simulação de fraude.
- [ ] Criar alerta visual de hash divergente.
- [ ] Criar tela de auditoria, se houver tempo.

## Prioridade P3 — Integração e polish

- [ ] Integrar API real.
- [ ] Ajustar payloads conforme contrato.
- [ ] Revisar responsividade.
- [ ] Revisar acessibilidade básica.
- [ ] Revisar animações.
- [ ] Preparar demo.
- [ ] Criar plano B com mocks.

---

## 28. Definition of Done do Frontend

O frontend pode ser considerado pronto quando:

- [ ] O projeto roda localmente sem erro.
- [ ] O build passa.
- [ ] A arquitetura FSD está respeitada.
- [ ] O design system está aplicado.
- [ ] O dashboard funciona.
- [ ] A listagem funciona.
- [ ] O cadastro funciona.
- [ ] O detalhe funciona.
- [ ] A timeline funciona.
- [ ] As ações por status funcionam.
- [ ] As permissões visuais funcionam.
- [ ] A disputa funciona.
- [ ] A fraude simulada funciona.
- [ ] Wallet conecta visualmente.
- [ ] documentHash aparece.
- [ ] transactionHash aparece ou é simulado claramente.
- [ ] Explorer link aparece quando houver tx hash.
- [ ] Loading states existem.
- [ ] Error states existem.
- [ ] Empty states existem.
- [ ] O frontend funciona com mocks.
- [ ] O frontend está preparado para API real.
- [ ] A interface está responsiva.
- [ ] Existe plano B para demo.
- [ ] A demo pode ser apresentada em menos de 5 minutos.

---

## 29. Ordem recomendada para executar no Claude Code/Codex

Use esta ordem para evitar confusão:

```txt
1. Fundação do projeto
2. FSD + providers + design system
3. Tipos oficiais + mocks + API client
4. Layout base
5. Dashboard
6. Listagem
7. Cadastro
8. Detalhe
9. Timeline
10. Painel de ações
11. Disputa/fraude
12. Wallet
13. Integração API real
14. Responsividade
15. Demo
```

Não peça tudo de uma vez.

Faça por blocos.

---

## 30. Prompt inicial recomendado para iniciar implementação frontend

```txt
Você é um desenvolvedor frontend sênior especialista em Next.js App Router, TypeScript, TailwindCSS, shadcn/ui, Feature-Sliced Design, TanStack Query, Zustand, React Hook Form, Zod, wagmi, viem e RainbowKit.

Estamos iniciando a implementação do frontend do FiscalizaPay Web3.

Antes de codar, leia estes documentos:

- Docs/Contratos_tecnicos/contrato_api_frontend_backend.md
- Docs/Governanca_tecnica/decisoes_tecnicas_finais.md
- Docs/Governanca_tecnica/glossario_tecnico_oficial.md
- Docs/Governanca_tecnica/criterios_aceite_mvp.md
- Docs/Planos_implementacao/plano_implementacao_frontend.md
- Docs/Base_do_projeto/oraculum_design_system.md
- Docs/Cronograma/Tasks_Frontend_implementation.md

Sua primeira tarefa é implementar apenas o Bloco 1 e o Bloco 2 deste arquivo:

- Criação e configuração do projeto
- Providers globais

Não implemente telas ainda.
Não implemente backend.
Não implemente smart contract.
Não altere documentos de backend.

Ao final, entregue um feedback com:
- arquivos criados
- dependências instaladas
- estrutura criada
- pendências
- próximo bloco recomendado
```

---

## 31. Observação final

O checklist anterior era bom para visão de equipe, mas este documento deve ser usado como checklist operacional da Pessoa 2.

A regra principal é:

```txt
Frontend começa mockado, bem estruturado, visualmente forte e pronto para integração.
```

A Pessoa 2 não deve esperar o backend ficar pronto para começar.

O frontend deve nascer com:

```txt
arquitetura correta
mocks corretos
contrato API respeitado
componentes reutilizáveis
design system consistente
fluxo completo demonstrável
```
