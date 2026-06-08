# Frontend_explain

Analise do frontend atual do FiscalizaPay, feita a partir dos arquivos em `web/`.

## Visao geral

O frontend atual e uma aplicacao Next.js com App Router, React, TypeScript, TailwindCSS v4, TanStack Query, Zustand, shadcn/ui, Framer Motion e bibliotecas Web3 preparadas com wagmi, viem e RainbowKit.

Ele esta em um estado bom para MVP visual e demo navegavel. As telas principais ja existem, os dados mockados sao realistas, as acoes de contrato atualizam estado em memoria, e a aplicacao compila em producao.

O ponto mais importante: a interface ainda opera principalmente como demo/mock. Existe cliente HTTP para API real, mas ainda falta a camada de autenticacao real por wallet, assinatura de nonce, armazenamento de JWT e envio de `Authorization: Bearer ...` nas chamadas protegidas. Isso significa que, com `NEXT_PUBLIC_USE_MOCKS=false`, o frontend ainda nao esta totalmente pronto para consumir o backend atual, que exige JWT.

## Validacao tecnica executada

Comandos executados em `web/`:

```txt
npm.cmd run lint
npm.cmd run build
```

Resultado:

- Lint passou sem erros.
- Build de producao passou.
- Next.js compilou com sucesso.
- TypeScript passou.
- Rotas geradas:
  - `/`
  - `/dashboard`
  - `/contracts`
  - `/contracts/new`
  - `/contracts/[id]`
  - `/disputes`
  - `/audit`
  - `/_not-found`

Observacao operacional: `npm run lint` direto no PowerShell foi bloqueado por politica de execucao de scripts (`npm.ps1`). Usar `npm.cmd run lint` funcionou sem alterar configuracao do sistema.

## Stack encontrada

- Next.js 16.2.6 com App Router.
- React 19.2.4.
- TypeScript.
- TailwindCSS v4.
- shadcn/ui/Radix UI para componentes base.
- Framer Motion para animacoes.
- TanStack Query v5 para cache, queries e mutations.
- Zustand para stores locais de demo.
- React Hook Form e Zod para formularios.
- wagmi v2, viem v2 e RainbowKit v2 para base Web3.
- Sonner para toasts.
- Lucide React para icones.

## Estrutura principal

```txt
web/
  src/
    app/               # Rotas App Router, layout raiz, providers e paginas
    widgets/           # Blocos grandes de UI: shell, sidebar, dashboard, listas
    features/          # Acoes de usuario: criar contrato, abrir disputa, fraude, wallet
    entities/          # Modelos de dominio: contract, profile, wallet, transaction, event
    shared/
      api/             # Cliente HTTP, services e query keys
      config/          # Env e Web3 config
      constants/       # Tema e navegacao
      lib/             # Formatadores e utilitarios
      mocks/           # Dados mockados e mockStore mutavel
      types/           # Tipos globais de API
      ui/              # Componentes base reutilizaveis
```

A organizacao segue uma variacao de Feature-Sliced Design. Isso ajuda a separar telas, blocos de interface, features acionaveis, entidades de dominio e infraestrutura compartilhada.

## Rotas e telas existentes

### `/`

Landing simples de entrada da aplicacao.

Tem:

- Nome do produto.
- Descricao curta.
- CTA para dashboard.
- CTA para contratos.

E uma tela funcional, mas ainda bastante simples e mais proxima de entrada de app/demo do que uma landing comercial completa.

### `/dashboard`

Tela de visao geral composta por widgets:

- `DashboardMetrics`
- `DashboardStatusOverview`
- `DashboardAlerts`
- `DashboardRecentContracts`

Mostra metricas gerais, distribuicao por status, alertas e contratos recentes. Usa hooks de dados via TanStack Query.

### `/contracts`

Tela de listagem de contratos.

Tem:

- Busca textual.
- Filtro por status.
- Filtro por orgao publico.
- Ordenacao por data/valor.
- Barra de resumo.
- Lista de cards.
- Estados de loading, erro e vazio.

A filtragem e ordenacao acontecem no cliente.

### `/contracts/new`

Tela de criacao de contrato.

Usa:

- React Hook Form.
- Zod.
- `useCreateContract`.
- Formulario dividido por secoes:
  - Dados do contrato.
  - Fornecedor.
  - Fiscal.
  - Logistica.
  - Gestor.
  - Hash do documento.

Valida wallets opcionais com regex EVM (`0x` + 40 caracteres hexadecimais) e exige os campos centrais do contrato.

### `/contracts/[id]`

Tela de detalhe do contrato.

Usa tres fontes de dados:

- `useContractById`
- `useContractEvents`
- `useBlockchainStatus`

Compoe:

- Header com numero do contrato e status.
- Alerta quando contrato esta em disputa.
- Card de visao geral.
- Painel de acoes.
- Card de partes envolvidas.
- Card de hashes.
- Card de blockchain.
- Timeline auditavel.

Essa e uma das telas mais completas do frontend atual.

### `/disputes`

Lista contratos com status `DISPUTA`.

Tem:

- Resumo de disputas.
- Lista de cards de disputa.
- Link para detalhe do contrato.
- Estado vazio quando nao ha disputas.

Hoje ela usa `useContracts("DISPUTA")`, que busca todos os contratos e filtra no cliente.

### `/audit`

Tela de auditoria consolidada.

Tem:

- Sumario de eventos.
- Busca.
- Filtro por tipo de evento.
- Filtro por status do contrato.
- Toggle de disputas/fraudes.
- Ordenacao por mais recente/mais antigo.
- Lista de eventos enriquecidos com dados do contrato.

Em modo mock, os eventos sao montados a partir de `mockStore.getAllEvents()` junto com os contratos.

## Layout e navegacao

O layout raiz fica em `src/app/layout.tsx`.

Ele envolve a aplicacao com:

- `RootProviders`
- `AppShell`

`AppShell` cria:

- Sidebar fixa no desktop.
- Sheet/drawer lateral no mobile.
- Header fixo superior.
- Area principal com scroll vertical.

Navegacao atual:

- Dashboard
- Contratos
- Novo contrato
- Disputas
- Auditoria

O header mostra:

- Titulo/descricao da pagina atual.
- Botao de wallet demo.
- Dropdown de perfil demo.

Ponto de atencao pequeno: o HTML raiz esta com `lang="en"`, mas a aplicacao e em portugues. O ideal e trocar para `lang="pt-BR"`.

## Design system e UI

O frontend usa um tema escuro baseado no Oraculum Design System.

Tokens principais em `globals.css`:

- Background escuro.
- Primary ciano.
- Success verde.
- Warning amarelo.
- Danger vermelho.
- Sidebar/card em tons escuros.

Componentes compartilhados em `shared/ui/`:

- `button`
- `card`
- `badge`
- `input`
- `textarea`
- `select`
- `dialog`
- `sheet`
- `dropdown-menu`
- `tooltip`
- `skeleton`
- `separator`
- `tabs`
- `PageHeader`
- `SectionTitle`
- `EmptyState`
- `ErrorState`
- `LoadingState`
- `CopyButton`
- `MotionContainer`

O padrao visual e consistente: cards escuros, bordas sutis, acentos ciano, danger para disputa/fraude, success para conclusao.

## Dados e estado

O frontend usa duas camadas principais de estado:

### TanStack Query

Responsavel por:

- Carregar contratos.
- Carregar contrato por id.
- Carregar eventos.
- Carregar status blockchain.
- Carregar dashboard.
- Executar mutations.
- Invalidar cache apos acoes.

Query keys:

```txt
dashboardSummary
contracts
contract(id)
contractEvents(id)
blockchainStatus(id)
auditEvents
```

As mutations invalidam as queries principais apos sucesso. Isso esta bem estruturado para manter a UI atualizada.

### Zustand

Usado para estado local/demo:

- `useProfileStore`: perfil ativo simulado.
- `useWalletStore`: wallet visual/demo.

Esses stores nao representam autenticacao real.

## Mocks

O modo mock e o modo padrao.

Configuracao:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

Tambem existe alias legado:

```txt
NEXT_PUBLIC_ENABLE_MOCKS
```

Comportamento:

- Se nenhuma variavel desativa os mocks, `env.useMocks` fica `true`.
- Para usar API real, e preciso definir `NEXT_PUBLIC_USE_MOCKS=false` ou `NEXT_PUBLIC_ENABLE_MOCKS=false`.

Mocks existentes:

- `contracts.mock.ts`: 6 contratos, um por status importante.
- `contract-events.mock.ts`: timelines coerentes por contrato.
- `blockchain.mock.ts`: status on-chain mockado.
- `profiles.mock.ts`: perfis por role.
- `dashboard.mock.ts`: resumo agregado.
- `mock-store.ts`: estado mutavel em memoria.
- `mock-errors.ts`: erros simulados no formato da API.

O `mockStore` permite que a demo pareca viva:

- Criar contrato adiciona contrato e evento.
- Confirmar envio muda status e adiciona evento.
- Confirmar entrega muda status e adiciona evento.
- Validar recebimento muda status e adiciona evento.
- Autorizar pagamento muda status e adiciona evento.
- Abrir disputa muda status e adiciona evento.
- Simular fraude muda status, troca hash e cria eventos.
- Registrar on-chain gera tx mockado e evento.

Esse estado reseta ao recarregar a pagina.

## Cliente HTTP e API real

O cliente HTTP fica em `shared/api/http-client.ts`.

Ele oferece:

- `get`
- `post`
- `patch`
- `delete`
- timeout padrao de 10 segundos.
- parse JSON.
- tratamento de erro padronizado com `HttpClientError`.
- mensagens amigaveis para timeout, erro de rede e resposta invalida.

Services existentes:

- `contracts-api.ts`
- `dashboard-api.ts`
- `blockchain-api.ts`

Endpoints cobertos pelo frontend:

```txt
GET /contracts
POST /contracts
GET /contracts/{id}
PATCH /contracts/{id}
DELETE /contracts/{id}
GET /contracts/{id}/events
POST /contracts/{id}/confirm-shipment
POST /contracts/{id}/confirm-delivery
POST /contracts/{id}/validate-receipt
POST /contracts/{id}/authorize-payment
POST /contracts/{id}/open-dispute
POST /contracts/{id}/simulate-fraud
GET /contracts/{id}/blockchain-status
POST /contracts/{id}/register-on-chain
GET /dashboard/summary
GET /audit/events
```

Ponto critico: nao ha implementacao frontend para:

- `GET /auth/nonce`
- assinatura da mensagem com wallet real.
- `POST /auth/verify`
- armazenamento de `accessToken`.
- `GET /auth/me`
- envio de header `Authorization`.

Como o backend atual exige JWT nas leituras e actions protegidas, esse e o maior gap de integracao.

## Web3 e wallet

Existe configuracao wagmi/RainbowKit em:

```txt
src/shared/config/web3.ts
src/app/providers/web3-provider.tsx
```

Chains configuradas:

- Polygon Amoy (`80002`)
- Sepolia (`11155111`)

Connectors:

- injected wallet.
- WalletConnect se `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` existir.

Apesar disso, a UI atual de wallet usa `useWalletStore`, que e explicitamente demo/visual.

O botao "Conectar wallet" chama `connectMockWallet()` e mostra uma wallet simulada. Ainda nao ha uso real de:

- `useAccount`
- `signMessage`
- assinatura de nonce
- sessao autenticada

Ou seja: a infraestrutura Web3 esta parcialmente preparada, mas o fluxo real de wallet login ainda nao foi integrado.

## Perfil e permissoes visuais

O frontend tem um seletor de perfil demo.

Roles:

- `GESTOR`
- `FORNECEDOR`
- `ENTREGADOR`
- `FISCAL`
- `AUDITOR`

As regras visuais ficam em `entities/contract/model/rules.ts`.

Regras atuais:

```txt
Confirmar envio: FORNECEDOR + CRIADO
Confirmar entrega: ENTREGADOR + ENVIADO
Validar recebimento: FISCAL + ENTREGUE
Autorizar pagamento: GESTOR + VALIDADO
Abrir disputa: GESTOR, FISCAL, FORNECEDOR, ENTREGADOR
Simular fraude: GESTOR, FISCAL
```

Essas regras controlam somente a UX. O backend e a fonte de seguranca.

Divergencia atual com o backend:

- Backend permite abrir disputa para `GESTOR`, `FISCAL`, `AUDITOR`.
- Frontend permite abrir disputa para `GESTOR`, `FISCAL`, `FORNECEDOR`, `ENTREGADOR` e bloqueia `AUDITOR`.
- Backend permite simular fraude para `GESTOR`, `FISCAL`, `AUDITOR`.
- Frontend permite simular fraude apenas para `GESTOR`, `FISCAL`.

Essa divergencia precisa ser ajustada antes de usar API real.

## Fluxo de contrato no frontend

O fluxo principal implementado:

```txt
CRIADO
  -> ENVIADO
  -> ENTREGUE
  -> VALIDADO
  -> PAGAMENTO_AUTORIZADO
```

Fluxos paralelos:

- Abrir disputa muda status para `DISPUTA`.
- Simular fraude pode detectar divergencia de hash e abrir disputa.
- Registrar on-chain gera status/evento em mock mode.

No frontend, o painel de acoes mostra:

- proxima acao quando o perfil atual pode agir;
- motivo de bloqueio quando o perfil nao pode agir;
- acoes adicionais de disputa/fraude;
- acao de blockchain quando ainda nao registrado.

Em modo API real, o endpoint `register-on-chain` do backend ainda esta desabilitado. Entao essa acao tende a retornar erro ate o smart contract existir.

## Pontos fortes

- Arquitetura bem separada em `app`, `widgets`, `features`, `entities` e `shared`.
- Build e lint passam.
- UX de MVP esta bem completa.
- Dashboard, contratos, detalhe, disputas e auditoria ja existem.
- TanStack Query esta bem aplicado.
- Mutations invalidam cache de forma coerente.
- MockStore permite uma demo interativa, nao apenas dados estaticos.
- Tipos de dominio em TypeScript estao alinhados ao contrato API em camelCase.
- Formularios usam React Hook Form + Zod.
- UI tem estados de loading, erro e vazio.
- Design system escuro esta consistente.
- Base Web3 com wagmi/RainbowKit ja esta configurada.
- O frontend ja possui services para quase todos os endpoints de negocio do backend.

## Pontos de atencao

### 1. Falta autenticacao real com backend

Esse e o principal ponto.

Nao ha fluxo implementado para:

- pedir nonce;
- assinar mensagem;
- verificar assinatura;
- receber JWT;
- persistir sessao;
- enviar `Authorization: Bearer`.

Impacto:

- Com mocks, tudo funciona.
- Com API real, endpoints protegidos devem retornar 401.

Recomendacao:

- Criar camada `auth-api`.
- Integrar `wagmi`/`viem` para `signMessage`.
- Criar store/provider de auth.
- Injetar token no `httpClient`.
- Trocar `useProfileStore` demo por perfil retornado de `/auth/me`.

### 2. API base URL esta desalinhada com backend local

O frontend usa padrao:

```txt
http://localhost:3001
```

O backend atual documentado e Docker Compose expõem:

```txt
http://127.0.0.1:8000
```

Impacto:

- Ao desativar mocks, o frontend pode tentar chamar a porta errada.

Recomendacao:

- Atualizar `.env.example` e docs para `http://127.0.0.1:8000` ou decidir oficialmente uma porta proxy.

### 3. Regras visuais divergem do backend

Disputa e fraude nao batem com a regra atual do backend.

Impacto:

- UI pode esconder uma acao que o backend permite.
- UI pode mostrar uma acao que o backend bloqueia.

Recomendacao:

- Alinhar `canOpenDispute` e `canSimulateFraud` com `ACTION_ROLES` do backend.

### 4. Wallet demo nao e wallet real

O projeto tem RainbowKit e wagmi configurados, mas a tela usa store mockado.

Impacto:

- O botao "Conectar wallet" nao autentica.
- Nao ha assinatura real.
- Nao ha relacao real entre wallet conectada e perfil.

Recomendacao:

- Substituir `connectMockWallet` por fluxo real com `useAccount`, `useSignMessage` e backend auth.

### 5. Alguns mocks usam wallets invalidas

Exemplos encontrados:

```txt
0xLogistica...
0xAuditor...
walletAddress: undefined
```

Impacto:

- Demo visual funciona.
- Mas ao reutilizar esses dados com backend real, a validacao EVM falha.

Recomendacao:

- Corrigir todos os mocks para `0x` + 40 caracteres hexadecimais.

> **Atualizacao (Bloco 07 - Sessao 01):** wallets mockadas corrigidas e padronizadas
> entre frontend e backend. Ver `Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/wallets_mockadas.md`.

### 6. Encoding quebrado em varios textos

Ha textos exibidos com mojibake em README, comentarios e strings, por exemplo:

```txt
fiscalizaÃ§Ã£o
NÃ£o
Ã“rgÃ£o
```

Impacto:

- Pode aparecer na interface e em mensagens de erro.
- Reduz acabamento percebido.

Recomendacao:

- Normalizar arquivos para UTF-8.
- Revisar strings visiveis na UI.

### 7. `lang` do HTML esta como ingles

`src/app/layout.tsx` usa:

```txt
lang="en"
```

Impacto:

- Acessibilidade e leitores de tela ficam menos corretos.
- SEO/metadados ficam desalinhados com a lingua real.

Recomendacao:

- Trocar para `lang="pt-BR"`.

### 8. Listagens filtram tudo no cliente

Contratos e auditoria usam filtragem client-side.

Impacto:

- Bom para demo.
- Pode ficar pesado em producao.
- `useContracts("DISPUTA")` nao usa `GET /contracts?status=DISPUTA`; busca tudo e filtra localmente.

Recomendacao:

- Levar filtros principais para API quando sair da demo.
- Usar query keys com parametros quando filtros forem remotos.

### 9. `auditEvents` nao e invalidado nas mutations

As mutations invalidam contrato, lista, eventos do contrato e dashboard, mas nao invalidam `auditEvents`.

Impacto:

- Se o usuario estiver na tela de auditoria depois de uma action, pode depender de refetch/reload para ver o evento novo.

Recomendacao:

- Invalidar `queryKeys.auditEvents` nas mutations que geram eventos.

### 10. Smart contract real ainda nao existe

O frontend mocka registro on-chain com txHash e bloco. O backend real retorna erro para `register-on-chain`.

Impacto:

- Em modo mock, a historia de blockchain funciona bem.
- Em API real, essa action falha ate a proxima etapa.

Recomendacao:

- Ocultar/desabilitar "Registrar on-chain" quando `BLOCKCHAIN_ENABLED=false` ou quando API indicar indisponibilidade.

## Estado atual do frontend

O frontend esta forte como MVP demonstravel:

- Navegacao pronta.
- Telas principais prontas.
- Fluxo de contrato demonstravel.
- Disputa/fraude demonstraveis.
- Auditoria demonstravel.
- Blockchain simulada.
- Build saudavel.
- Lint saudavel.

Mas ainda nao esta pronto como cliente completo do backend real, principalmente por faltar autenticacao JWT via wallet.

## Melhor proxima ordem de evolucao

1. Corrigir encoding dos arquivos e textos visiveis.
2. Trocar `lang="en"` para `pt-BR`.
3. Atualizar porta padrao da API para a porta real do backend local.
4. Alinhar regras visuais de disputa/fraude com o backend.
5. Corrigir wallets mockadas invalidas.
6. Implementar login real:
   - `/auth/nonce`
   - assinatura via wallet
   - `/auth/verify`
   - guardar token
   - enviar `Authorization`
   - `/auth/me`
7. Substituir perfil demo por perfil autenticado quando `useMocks=false`.
8. Invalidar `auditEvents` nas mutations.
9. Usar filtros/paginacao reais na API.
10. Tratar `register-on-chain` como indisponivel ate o smart contract existir.

## Leitura final

Hoje o frontend e uma demo de MVP bem estruturada e tecnicamente saudavel. Ele comunica bem a proposta do FiscalizaPay, permite navegar por contratos, acionar etapas, abrir disputa, simular fraude e consultar auditoria.

A principal diferenca entre "demo boa" e "frontend integrado ao backend real" esta na autenticacao. Assim que o fluxo wallet -> nonce -> assinatura -> JWT -> Authorization for implementado, o frontend fica muito mais perto de operar sobre a API real do projeto.
