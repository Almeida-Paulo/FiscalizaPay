# FiscalizaPay Web3 — Arquitetura Base do Frontend

## 1. Objetivo deste documento

Este documento serve como **base técnica e arquitetural para construção do frontend do FiscalizaPay Web3**.

Ele deve ser utilizado como contexto principal para implementação com o Claude Code, Copilot ou qualquer agente de desenvolvimento assistido por IA.

O objetivo não é construir apenas uma interface visual, mas sim uma **camada frontend escalável, performática, modular, preparada para integração com backend, banco de dados, autenticação Web3 e smart contracts**.

O frontend será responsabilidade do desenvolvedor frontend, enquanto o backend, banco, regras de persistência e integração Web3 mais sensível serão responsabilidade de outro desenvolvedor.

Este documento orienta a construção do frontend para que ele já nasça preparado para essa integração.

---

## 2. Contexto do projeto

O **FiscalizaPay Web3** é uma plataforma para gestão, fiscalização e liberação segura de pagamentos em contratos públicos.

A proposta central é garantir que um contrato público só avance para pagamento quando sua entrega ou execução for:

- comprovada;
- fiscalizada;
- validada por múltiplas partes;
- registrada em uma linha do tempo auditável;
- vinculada a hashes e transações blockchain quando necessário.

A aplicação atua como uma camada de confiança entre:

- órgão público;
- fornecedor;
- entregador ou responsável logístico;
- fiscal do contrato;
- gestor público;
- auditor.

O frontend precisa refletir essa lógica de negócio com clareza, segurança visual, boa experiência e arquitetura de código escalável.

---

## 3. Mentalidade arquitetural

Este projeto não deve ser tratado como um simples website institucional.

Ele deve ser tratado como um **sistema web SaaS/Web3 de fiscalização, auditoria e controle de fluxo contratual**.

A construção do frontend deve considerar:

- domínio de negócio forte;
- múltiplos perfis de usuário;
- regras de permissão;
- status de contrato;
- integração com wallet;
- consumo de API;
- exibição de dados auditáveis;
- timeline de eventos;
- estados assíncronos;
- loading, error, empty states;
- escalabilidade de código;
- performance;
- manutenibilidade;
- separação de responsabilidades.

O código não deve ser organizado apenas por tipo técnico, como `components`, `pages` e `utils`.

A aplicação deve ser organizada por domínio, funcionalidade e responsabilidade.

---

## 4. Stack recomendada

A stack recomendada para o frontend é:

```txt
Next.js
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

### 4.1 Next.js

Utilizar **Next.js com App Router**.

Motivos:

- permite melhor organização de rotas;
- suporta Server Components;
- suporta Client Components;
- permite otimização de performance;
- facilita deploy na Vercel;
- permite cache e revalidação;
- é adequado para sistemas modernos e escaláveis.

### 4.2 TypeScript

Todo o projeto deve ser construído em TypeScript.

Objetivos:

- reduzir erros;
- tipar contratos, eventos e perfis;
- facilitar integração com backend;
- melhorar manutenção;
- preparar o projeto para crescimento.

### 4.3 TailwindCSS

Utilizar TailwindCSS para estilização.

Objetivos:

- padronizar estilos;
- acelerar desenvolvimento;
- facilitar responsividade;
- trabalhar com design system;
- manter consistência visual.

### 4.4 shadcn/ui

Utilizar shadcn/ui como base de componentes.

Componentes sugeridos:

- Button;
- Card;
- Dialog;
- Badge;
- Input;
- Textarea;
- Select;
- Table;
- Tabs;
- Sheet;
- Dropdown Menu;
- Tooltip;
- Toast;
- Skeleton.

### 4.5 Framer Motion

Utilizar Framer Motion para animações suaves e profissionais.

Exemplos de uso:

- transição entre cards;
- entrada de modais;
- animação da timeline;
- feedback visual em ações críticas;
- microinterações em botões e badges.

### 4.6 TanStack Query

Utilizar TanStack Query para gerenciar dados vindos do backend.

Responsabilidades:

- buscar contratos;
- buscar detalhes de contrato;
- buscar eventos;
- executar mutations;
- invalidar dados após ações;
- controlar loading;
- controlar error;
- controlar cache;
- evitar chamadas desnecessárias.

### 4.7 Zustand

Utilizar Zustand apenas para estados globais locais e simples.

Exemplos:

- sidebar aberta/fechada;
- tema visual;
- sessão visual do usuário;
- perfil selecionado em modo demo;
- estado de wallet exibido no frontend.

Não utilizar Zustand para substituir dados vindos do backend. Dados remotos devem ser controlados pelo TanStack Query.

### 4.8 React Hook Form + Zod

Utilizar React Hook Form para formulários e Zod para validações.

Exemplos:

- cadastro de contrato;
- abertura de disputa;
- upload ou registro de documento;
- filtros;
- formulários de validação.

### 4.9 wagmi + viem + RainbowKit

Utilizar para camada Web3 no frontend.

Responsabilidades:

- conectar carteira;
- exibir endereço conectado;
- verificar chain/network;
- preparar futura assinatura de mensagem;
- preparar leitura de contrato;
- preparar escrita em contrato quando necessário;
- exibir status de conexão.

Importante: a regra principal de negócio e validações críticas não devem depender apenas do frontend.

---

## 5. Arquitetura recomendada

A arquitetura recomendada para o frontend é uma combinação de:

- DDD aplicado ao frontend;
- Feature-Sliced Design;
- Design System;
- separação entre UI, domínio, features e integração externa.

---

## 6. DDD aplicado ao frontend

DDD significa **Domain-Driven Design**.

No contexto deste projeto, o domínio principal não é botão, modal ou tela.

O domínio é:

- contrato;
- evento de contrato;
- status de contrato;
- validação de entrega;
- autorização de pagamento;
- disputa;
- documento;
- hash;
- transaction hash;
- carteira;
- perfil;
- auditoria.

O código deve refletir a linguagem real do negócio.

Exemplos de nomes corretos:

```ts
createContract()
confirmShipment()
confirmDelivery()
validateReceipt()
authorizePayment()
openDispute()
registerContractEvent()
calculateDocumentHash()
connectWallet()
```

Evitar nomes genéricos como:

```ts
handleClick()
submitData()
updateItem()
doAction()
```

A aplicação deve falar a linguagem do FiscalizaPay.

---

## 7. Feature-Sliced Design

A aplicação deve ser organizada por camadas, fatias de domínio e funcionalidades.

Estrutura recomendada:

```txt
src/
├── app/
│   ├── providers/
│   ├── styles/
│   ├── layout.tsx
│   └── page.tsx
│
├── pages/
│   ├── dashboard/
│   ├── contracts/
│   ├── contract-details/
│   ├── audit/
│   └── disputes/
│
├── widgets/
│   ├── app-sidebar/
│   ├── app-header/
│   ├── dashboard-metrics/
│   ├── contract-timeline/
│   ├── contract-action-panel/
│   ├── wallet-status/
│   └── audit-summary/
│
├── features/
│   ├── create-contract/
│   ├── confirm-shipment/
│   ├── confirm-delivery/
│   ├── validate-receipt/
│   ├── authorize-payment/
│   ├── open-dispute/
│   ├── connect-wallet/
│   └── simulate-fraud/
│
├── entities/
│   ├── contract/
│   ├── contract-event/
│   ├── profile/
│   ├── document/
│   ├── wallet/
│   └── transaction/
│
├── shared/
│   ├── api/
│   ├── config/
│   ├── constants/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── ui/
```

---

## 8. Responsabilidade de cada camada

### 8.1 app

Responsável pela configuração global da aplicação.

Exemplos:

- providers globais;
- layout raiz;
- tema;
- configuração do TanStack Query;
- configuração Web3;
- configuração de fontes;
- metadata;
- estilos globais.

### 8.2 pages

Responsável por compor as telas principais.

Exemplos:

- dashboard;
- listagem de contratos;
- detalhe de contrato;
- auditoria;
- disputas.

As pages não devem conter regras de negócio complexas. Elas devem compor widgets, features e entities.

### 8.3 widgets

Responsável por blocos grandes de interface.

Exemplos:

- sidebar;
- header;
- painel de métricas;
- timeline do contrato;
- painel de ações do contrato;
- resumo de auditoria.

Widgets podem usar features e entities.

### 8.4 features

Responsável por ações do usuário.

Exemplos:

- criar contrato;
- confirmar envio;
- confirmar entrega;
- validar recebimento;
- autorizar pagamento;
- abrir disputa;
- conectar carteira;
- simular fraude.

Cada feature deve ser isolada.

Exemplo:

```txt
features/confirm-delivery/
├── ui/
│   └── ConfirmDeliveryButton.tsx
├── model/
│   └── useConfirmDelivery.ts
├── api/
│   └── confirmDeliveryApi.ts
└── index.ts
```

### 8.5 entities

Responsável pelos modelos principais do domínio.

Exemplos:

```txt
entities/contract/
├── model/
│   ├── types.ts
│   ├── constants.ts
│   └── rules.ts
├── api/
│   └── contractApi.ts
├── ui/
│   ├── ContractCard.tsx
│   ├── ContractStatusBadge.tsx
│   └── ContractAmount.tsx
└── index.ts
```

### 8.6 shared

Responsável por código reutilizável e sem regra de negócio específica.

Exemplos:

- componentes base;
- helpers;
- cliente HTTP;
- configuração de ambiente;
- tipos globais;
- constantes;
- formatações.

---

## 9. Modelagem de domínio no frontend

Criar tipos claros para o domínio.

### 9.1 ContractStatus

```ts
export type ContractStatus =
  | "CRIADO"
  | "ENVIADO"
  | "ENTREGUE"
  | "VALIDADO"
  | "PAGAMENTO_AUTORIZADO"
  | "DISPUTA";
```

### 9.2 UserRole

```ts
export type UserRole =
  | "GESTOR"
  | "FORNECEDOR"
  | "ENTREGADOR"
  | "FISCAL"
  | "AUDITOR";
```

### 9.3 ContractEventType

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

### 9.4 Contract

```ts
export interface Contract {
  id: string;
  contractNumber: string;
  publicAgency: string;
  supplierName: string;
  object: string;
  amount: number;
  startDate: string;
  endDate: string;
  deadline: string;
  inspectorName: string;
  logisticsResponsible: string;
  status: ContractStatus;
  documentHash?: string;
  blockchainContractId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 9.5 ContractEvent

```ts
export interface ContractEvent {
  id: string;
  contractId: string;
  eventType: ContractEventType;
  description: string;
  responsibleRole: UserRole;
  responsibleName: string;
  statusBefore?: ContractStatus;
  statusAfter?: ContractStatus;
  documentHash?: string;
  transactionHash?: string;
  blockchainTimestamp?: string;
  createdAt: string;
}
```

### 9.6 Profile

```ts
export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 10. Regras de negócio no frontend

O frontend pode conter regras visuais e regras auxiliares, mas a validação definitiva deve vir do backend.

Criar arquivo:

```txt
entities/contract/model/rules.ts
```

Exemplo:

```ts
import { Contract } from "./types";
import { Profile } from "@/entities/profile";

export function canConfirmShipment(contract: Contract, profile: Profile) {
  return contract.status === "CRIADO" && profile.role === "FORNECEDOR";
}

export function canConfirmDelivery(contract: Contract, profile: Profile) {
  return contract.status === "ENVIADO" && profile.role === "ENTREGADOR";
}

export function canValidateReceipt(contract: Contract, profile: Profile) {
  return contract.status === "ENTREGUE" && profile.role === "FISCAL";
}

export function canAuthorizePayment(contract: Contract, profile: Profile) {
  return contract.status === "VALIDADO" && profile.role === "GESTOR";
}

export function canOpenDispute(contract: Contract, profile: Profile) {
  return contract.status !== "PAGAMENTO_AUTORIZADO";
}
```

Importante:

Não colocar regras diretamente no JSX.

Evitar:

```tsx
{contract.status === "ENTREGUE" && profile.role === "FISCAL" && (
  <Button>Validar recebimento</Button>
)}
```

Preferir:

```tsx
{canValidateReceipt(contract, profile) && (
  <ValidateReceiptButton contractId={contract.id} />
)}
```

---

## 11. Integração com backend

O frontend deve ser preparado para consumir uma API externa.

A URL da API deve vir de variável de ambiente.

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ENABLE_MOCKS=
```

### 11.1 Cliente HTTP base

Criar:

```txt
shared/api/httpClient.ts
```

Exemplo:

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function httpClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao comunicar com a API");
  }

  return response.json();
}
```

### 11.2 Endpoints esperados do backend

O frontend deve estar preparado para consumir os seguintes endpoints:

```http
GET /dashboard/summary

GET /contracts
POST /contracts
GET /contracts/:id
PATCH /contracts/:id
DELETE /contracts/:id

GET /contracts/:id/events

POST /contracts/:id/confirm-shipment
POST /contracts/:id/confirm-delivery
POST /contracts/:id/validate-receipt
POST /contracts/:id/authorize-payment
POST /contracts/:id/open-dispute
POST /contracts/:id/simulate-fraud

GET /contracts/:id/blockchain-status
POST /contracts/:id/register-on-chain
```

### 11.3 Contrato de resposta esperado

O backend deve retornar dados em formato previsível.

Exemplo:

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
```

Exemplo de erro:

```ts
export interface ApiError {
  message: string;
  code?: string;
  details?: unknown;
}
```

---

## 12. Uso do TanStack Query

Criar hooks por entidade e feature.

Exemplo:

```txt
entities/contract/api/useContracts.ts
entities/contract/api/useContractById.ts
entities/contract-event/api/useContractEvents.ts
features/confirm-delivery/model/useConfirmDelivery.ts
```

### 12.1 Buscar contratos

```ts
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";
import { Contract } from "../model/types";

export function useContracts() {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: () => httpClient<Contract[]>("/contracts"),
  });
}
```

### 12.2 Mutation de confirmação de entrega

```ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/shared/api/httpClient";

export function useConfirmDelivery(contractId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      httpClient(`/contracts/${contractId}/confirm-delivery`, {
        method: "POST",
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contract", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contract-events", contractId] });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
  });
}
```

---

## 13. Estratégia de mocks

Enquanto o backend ainda não estiver pronto, o frontend deve usar mocks controlados.

Criar:

```txt
shared/mocks/contracts.mock.ts
shared/mocks/events.mock.ts
shared/mocks/profiles.mock.ts
```

A aplicação deve permitir alternar entre mock e API real usando:

```env
NEXT_PUBLIC_ENABLE_MOCKS=true
```

Regras:

- não misturar mock dentro de componentes;
- mock deve ficar isolado;
- APIs devem manter o mesmo formato esperado do backend;
- quando o backend estiver pronto, trocar apenas a origem dos dados.

---

## 14. Telas principais do frontend

### 14.1 Dashboard

Objetivo:

Mostrar visão geral dos contratos.

Elementos:

- total de contratos;
- contratos criados;
- aguardando envio;
- aguardando entrega;
- aguardando fiscalização;
- pagamentos autorizados;
- contratos em disputa;
- cards recentes;
- gráficos ou indicadores simples;
- botão para criar contrato;
- status visual por cor.

### 14.2 Listagem de contratos

Objetivo:

Permitir visualizar, buscar e filtrar contratos.

Elementos:

- tabela ou cards;
- filtro por status;
- filtro por órgão;
- filtro por fornecedor;
- busca por número do contrato;
- botão de visualizar detalhes;
- badges de status;
- paginação futura.

### 14.3 Cadastro de contrato

Objetivo:

Cadastrar novo contrato.

Campos:

- número do contrato;
- órgão público;
- fornecedor;
- objeto;
- valor;
- data inicial;
- data final;
- prazo;
- fiscal responsável;
- responsável logístico;
- hash/documento.

Validação:

- campos obrigatórios;
- valor maior que zero;
- datas válidas;
- número de contrato único futuramente validado pelo backend.

### 14.4 Detalhe do contrato

Objetivo:

Exibir visão completa do contrato.

Elementos:

- dados principais;
- status atual;
- atores envolvidos;
- valor;
- prazo;
- documento/hash;
- transaction hash;
- painel de ações;
- timeline;
- alertas de pendência;
- botão de disputa.

### 14.5 Linha do tempo auditável

Objetivo:

Mostrar eventos do contrato em ordem cronológica.

Cada evento deve mostrar:

- tipo do evento;
- responsável;
- papel;
- data/hora;
- status anterior;
- status novo;
- hash do documento;
- transaction hash;
- link para explorer;
- ícone visual.

### 14.6 Tela de disputa

Objetivo:

Permitir abertura e visualização de disputas.

Motivos sugeridos:

- entrega incompleta;
- atraso;
- divergência na nota fiscal;
- documento inválido;
- produto não recebido;
- inconsistência entre entrega e contrato.

### 14.7 Simulação de fraude

Objetivo:

Criar efeito visual forte para apresentação/demo.

Fluxo:

1. Usuário visualiza hash original de um documento.
2. Sistema simula alteração do documento.
3. Novo hash é calculado.
4. Sistema compara os hashes.
5. Sistema exibe alerta de possível fraude.

Essa tela é importante para a demonstração do valor da blockchain no projeto.

---

## 15. Design system

O frontend deve seguir um estilo:

- dark system;
- Web3;
- SaaS moderno;
- tecnológico;
- profissional;
- com cards;
- com timeline;
- com badges;
- com animações suaves;
- com excelente legibilidade.

### 15.1 Paleta base

```txt
Background: #050816
Cards: #0F172A
Bordas: #1E293B
Texto principal: #F8FAFC
Texto secundário: #94A3B8
Destaque primário: #22D3EE
Destaque secundário: #8B5CF6
Sucesso: #22C55E
Alerta: #F59E0B
Erro: #EF4444
```

### 15.2 Componentes essenciais

Criar componentes reutilizáveis:

```txt
ContractStatusBadge
ContractCard
ContractTimeline
ContractEventCard
WalletConnectButton
WalletStatus
TransactionHashLink
DocumentHashViewer
RoleBadge
PermissionGate
ContractActionPanel
DashboardMetricCard
EmptyState
ErrorState
LoadingState
PageHeader
AppSidebar
AppHeader
```

### 15.3 Status visual

Mapear status para cores e labels.

```ts
export const contractStatusMap = {
  CRIADO: {
    label: "Criado",
    color: "default",
  },
  ENVIADO: {
    label: "Enviado",
    color: "info",
  },
  ENTREGUE: {
    label: "Entregue",
    color: "warning",
  },
  VALIDADO: {
    label: "Validado",
    color: "success",
  },
  PAGAMENTO_AUTORIZADO: {
    label: "Pagamento autorizado",
    color: "success",
  },
  DISPUTA: {
    label: "Em disputa",
    color: "danger",
  },
};
```

---

## 16. Web3 no frontend

A integração Web3 deve ser feita com cuidado.

O frontend deve permitir:

- conectar carteira MetaMask;
- exibir endereço conectado;
- exibir rede atual;
- alertar se a rede estiver incorreta;
- preparar assinatura de mensagem;
- futuramente ler dados públicos do smart contract;
- futuramente executar transações autorizadas;
- exibir transaction hash na timeline.

### 16.1 Wallet não substitui autenticação real

A carteira conectada não deve ser considerada automaticamente como autenticação segura.

Fluxo recomendado futuramente:

```txt
1. Usuário conecta carteira
2. Frontend solicita assinatura de mensagem
3. Backend valida assinatura
4. Backend cria sessão
5. Backend retorna perfil e permissões
6. Frontend renderiza ações conforme perfil
```

### 16.2 Separação importante

O frontend pode:

- conectar carteira;
- solicitar assinatura;
- mostrar status;
- iniciar transação quando permitido;
- exibir tx hash.

O backend deve:

- validar permissões;
- validar ordem dos status;
- persistir dados;
- comunicar com banco;
- registrar eventos;
- validar assinatura;
- proteger dados sensíveis.

---

## 17. Performance

O frontend deve ser construído pensando em performance desde o início.

### 17.1 Estratégias

- usar Server Components quando possível;
- usar Client Components apenas onde houver interação;
- evitar estado global desnecessário;
- usar lazy loading em telas secundárias;
- usar skeletons;
- evitar renderização de listas grandes sem paginação;
- usar cache do TanStack Query;
- separar componentes pesados;
- evitar imports desnecessários;
- otimizar imagens e ícones;
- usar dynamic import quando necessário.

### 17.2 Separação Server/Client

Exemplos:

Server Component:

- layout geral;
- dashboard inicial;
- página de listagem;
- carregamento inicial de dados.

Client Component:

- botão de conectar wallet;
- formulário;
- modal;
- tabs interativas;
- ações de contrato;
- animações;
- timeline com interação.

---

## 18. Segurança no frontend

O frontend não é fonte absoluta de segurança.

Mesmo assim, deve seguir boas práticas:

- nunca expor private keys;
- nunca colocar service role key do Supabase no frontend;
- nunca confiar apenas no role vindo do client;
- validar formulários com Zod;
- sanitizar exibição de dados;
- não exibir dados sensíveis sem permissão;
- separar variáveis públicas e privadas;
- usar `NEXT_PUBLIC_` apenas para dados realmente públicos;
- tratar erros da API sem expor detalhes internos.

---

## 19. Responsividade

A aplicação deve funcionar bem em:

- desktop;
- notebook;
- tablet;
- mobile.

Prioridade visual:

1. Desktop para demo e operação principal.
2. Tablet para fiscalização/logística.
3. Mobile para consulta e validações rápidas.

A sidebar deve ser:

- fixa no desktop;
- colapsável em telas médias;
- drawer/sheet em mobile.

---

## 20. Padrão de commits e organização

Sugestão de commits:

```txt
feat: create contract dashboard layout
feat: add contract status badge
feat: implement contract timeline
feat: add wallet connection
feat: implement create contract form
fix: adjust responsive sidebar
refactor: move contract rules to entity layer
chore: configure tanstack query provider
```

---

## 21. Qualidade de código

O projeto deve conter:

- ESLint;
- Prettier;
- TypeScript strict;
- aliases de importação;
- organização por domínio;
- componentes pequenos;
- funções puras para regras;
- hooks isolados;
- API desacoplada da UI;
- mocks isolados.

Aliases sugeridos:

```ts
"@/app/*"
"@/pages/*"
"@/widgets/*"
"@/features/*"
"@/entities/*"
"@/shared/*"
```

---

## 22. Critérios de aceite do frontend

O frontend será considerado bem estruturado quando:

- possuir arquitetura Feature-Sliced;
- usar TypeScript em todo o projeto;
- possuir design system base;
- tiver dashboard funcional;
- listar contratos;
- exibir detalhe de contrato;
- exibir timeline auditável;
- permitir criar contrato;
- permitir ações por status/perfil;
- conectar wallet;
- estiver preparado para API real;
- usar mocks apenas de forma isolada;
- possuir loading/error/empty states;
- estiver responsivo;
- tiver boa aparência Web3/SaaS;
- não misturar regra de negócio diretamente no JSX.

---

## 23. MVP do frontend

O MVP do frontend deve conter:

```txt
1. Layout base com sidebar e header
2. Dashboard com métricas
3. Listagem de contratos
4. Cadastro de contrato
5. Detalhe do contrato
6. Timeline auditável
7. Painel de ações por status
8. Conexão visual com wallet
9. Tela ou fluxo de disputa
10. Simulação de fraude por hash
11. Estrutura de API preparada
12. Mocks temporários
```

---

## 24. Prompt base para o Claude Code

Use o prompt abaixo no Claude Code para orientar a implementação:

```txt
Você é um arquiteto frontend sênior especializado em Next.js, TypeScript, Feature-Sliced Design, Design System, Web3 e sistemas SaaS escaláveis.

Estou construindo o frontend do FiscalizaPay Web3, uma plataforma para gestão, fiscalização e liberação segura de pagamentos em contratos públicos.

O frontend deve ser construído com:

- Next.js App Router
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- TanStack Query
- Zustand
- React Hook Form
- Zod
- wagmi
- viem
- RainbowKit
- Lucide React

A arquitetura deve seguir Feature-Sliced Design com as camadas:

- app
- pages
- widgets
- features
- entities
- shared

O sistema possui os seguintes domínios:

- contratos
- eventos de contrato
- perfis
- documentos
- wallet
- transações
- auditoria
- disputas

O frontend deve estar preparado para integração com backend externo via API REST.

A URL da API deve vir de variável de ambiente:

NEXT_PUBLIC_API_URL

Enquanto o backend não estiver pronto, crie mocks isolados mantendo o mesmo formato esperado da API real.

Endpoints esperados:

GET /dashboard/summary

GET /contracts
POST /contracts
GET /contracts/:id
PATCH /contracts/:id
DELETE /contracts/:id

GET /contracts/:id/events

POST /contracts/:id/confirm-shipment
POST /contracts/:id/confirm-delivery
POST /contracts/:id/validate-receipt
POST /contracts/:id/authorize-payment
POST /contracts/:id/open-dispute
POST /contracts/:id/simulate-fraud

GET /contracts/:id/blockchain-status
POST /contracts/:id/register-on-chain

O frontend deve conter:

- dashboard
- listagem de contratos
- cadastro de contrato
- detalhe do contrato
- timeline auditável
- painel de ações
- conexão de wallet
- tela de disputa
- simulação de fraude por hash

Crie uma base profissional, modular, escalável e preparada para integração com backend.

Não coloque regras de negócio diretamente no JSX.
Crie funções de domínio para permissões e transições de status.

Use design dark system Web3/SaaS com a seguinte paleta:

Background: #050816
Cards: #0F172A
Bordas: #1E293B
Texto principal: #F8FAFC
Texto secundário: #94A3B8
Destaque primário: #22D3EE
Destaque secundário: #8B5CF6
Sucesso: #22C55E
Alerta: #F59E0B
Erro: #EF4444

Priorize código limpo, componentes pequenos, tipagem forte, reuso, responsividade, performance e facilidade de integração.
```

---

## 25. Direção final

Este frontend deve ser construído como uma base profissional de produto.

A prioridade não é apenas entregar telas bonitas.

A prioridade é entregar uma aplicação:

- organizada;
- escalável;
- performática;
- segura;
- preparada para backend;
- preparada para Web3;
- fácil de manter;
- fácil de evoluir;
- visualmente convincente para demo;
- tecnicamente sólida para continuidade.

A mentalidade principal é:

```txt
Não estamos construindo apenas uma interface.
Estamos construindo a camada visual e operacional de um sistema de confiança, auditoria e validação multipartes.
```
