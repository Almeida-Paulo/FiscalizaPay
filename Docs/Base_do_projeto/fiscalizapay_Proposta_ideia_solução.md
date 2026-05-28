# FiscalizaPay Web3 — Documento Base do Projeto

## 1. Visão Geral

O **FiscalizaPay Web3** é uma plataforma para **gestão, fiscalização e liberação segura de pagamentos em contratos públicos**, utilizando blockchain como camada de prova, rastreabilidade e auditoria.

A proposta central do sistema é garantir que um contrato público só avance para pagamento quando a entrega ou execução for comprovada, fiscalizada e validada por múltiplas partes.

A solução atua como uma camada de confiança entre:

- órgão público;
- fornecedor;
- entregador ou responsável logístico;
- fiscal do contrato;
- gestor público;
- auditor.

O sistema registra cada etapa crítica em uma linha do tempo auditável e, para os eventos mais importantes, gera um registro em blockchain contendo hash, assinatura, status e timestamp.

---

## 2. Problema Atual

A gestão de contratos públicos ainda possui pontos frágeis, principalmente em relação à comprovação de entrega, fiscalização, rastreabilidade e liberação de pagamentos.

### 2.1 Dores principais

Atualmente, muitos contratos públicos dependem de processos manuais, documentos dispersos e validações difíceis de auditar.

Os principais problemas são:

- **Pagamentos liberados antes da validação efetiva da entrega ou execução**  
  O pagamento pode avançar mesmo sem uma comprovação clara de que o serviço ou produto foi entregue corretamente.

- **Falta de rastreabilidade**  
  Muitas vezes não existe uma trilha confiável mostrando quem aprovou, quando aprovou e com base em qual evidência.

- **Documentos dispersos**  
  Contratos, notas fiscais, comprovantes, anexos e validações podem ficar espalhados em sistemas diferentes, e-mails ou pastas manuais.

- **Risco de fraude documental**  
  Documentos podem ser alterados sem que exista uma prova técnica simples para identificar a mudança.

- **Fiscalização lenta**  
  A validação depende de etapas manuais, conferências isoladas e pouca automação.

- **Baixa transparência para auditoria**  
  Auditorias posteriores podem ser caras, demoradas e inconclusivas por falta de histórico confiável.

- **Exposição de dados sensíveis**  
  Dados pessoais, bancários e informações sigilosas podem ficar expostos sem controle adequado.

---

## 3. Pergunta Central do Projeto

> Como garantir que um contrato público só seja pago quando a entrega for comprovada, fiscalizada e validada com segurança?

Essa pergunta orienta toda a solução.

O objetivo não é apenas criar um sistema de contratos, mas criar uma plataforma que una:

- gestão contratual;
- fiscalização;
- compliance;
- trilha auditável;
- proteção de dados;
- registro em blockchain;
- controle de pagamento condicionado.

---

## 4. Solução Proposta

A solução proposta é o **FiscalizaPay Web3**.

A plataforma permite cadastrar contratos, acompanhar etapas de entrega, validar ações por diferentes perfis e registrar eventos críticos em blockchain.

O pagamento só é autorizado quando todas as validações obrigatórias são concluídas.

### 4.1 Fluxo principal

1. **Gestor público cria o contrato**  
   Cadastra dados do contrato, fornecedor, valor, prazo, fiscal responsável e regras.

2. **Fornecedor confirma envio ou execução**  
   O fornecedor assina digitalmente que realizou o envio ou executou o serviço.

3. **Entregador ou logística confirma entrega**  
   O responsável logístico registra que a entrega foi realizada.

4. **Fiscal valida recebimento**  
   O fiscal confere quantidade, qualidade, nota fiscal, prazo e conformidade.

5. **Gestor autoriza pagamento**  
   Após as validações, o gestor autoriza o pagamento.

6. **Sistema registra prova em blockchain**  
   Cada etapa crítica gera hash, assinatura, status e timestamp.

---

## 5. Personas do Sistema

### 5.1 Gestor Público

Responsável por criar o contrato e autorizar o pagamento final.

Principais ações:

- cadastrar contrato;
- acompanhar status;
- visualizar validações;
- autorizar pagamento;
- consultar histórico.

### 5.2 Fornecedor

Responsável por confirmar o envio do produto ou execução do serviço contratado.

Principais ações:

- visualizar contratos vinculados;
- confirmar envio ou execução;
- anexar evidências;
- acompanhar validação.

### 5.3 Entregador ou Responsável Logístico

Responsável por confirmar que a entrega foi realizada no destino.

Principais ações:

- confirmar entrega;
- registrar evidência de entrega;
- informar divergência, se houver.

### 5.4 Fiscal do Contrato

Responsável por validar a conformidade da entrega ou execução.

Principais ações:

- conferir quantidade;
- conferir qualidade;
- validar nota fiscal;
- verificar prazo;
- aprovar recebimento;
- abrir disputa ou pendência.

### 5.5 Auditor

Responsável por consultar a trilha auditável do contrato.

Principais ações:

- visualizar eventos;
- verificar hashes;
- consultar timestamps;
- validar integridade do histórico.

---

## 6. Diferencial da Solução

O principal diferencial do FiscalizaPay Web3 é:

> **Pagamento condicionado à fiscalização comprovada.**

O sistema impede que o pagamento avance sem que as etapas obrigatórias sejam cumpridas.

Além disso, a solução cria uma camada antifraude baseada em:

- validação multipartes;
- blockchain como prova imutável;
- hash dos documentos;
- linha do tempo auditável;
- controle de status;
- privacidade por design.

---

## 7. Arquitetura Geral

A arquitetura da solução é dividida em quatro camadas principais:

1. **Frontend Web**
2. **Backend/API**
3. **Banco de Dados**
4. **Blockchain/Smart Contract**

Fluxo técnico:

```txt
Frontend Web
    ↓
Backend/API
    ↓
Banco de Dados
    ↓
Smart Contract
    ↓
Blockchain/Testnet
```

A aplicação utiliza uma arquitetura híbrida:

- dados completos ficam **off-chain**, no banco de dados;
- provas, hashes e eventos críticos ficam **on-chain**, na blockchain.

---

## 8. Base de Backend

### 8.1 Tecnologias sugeridas

A base do backend pode ser construída com:

- **Node.js**
- **Express.js** ou **NestJS**
- **TypeScript**
- **Supabase/PostgreSQL**
- **Prisma ORM**, opcional
- **Ethers.js** para integração com smart contract

### 8.2 Responsabilidades do backend

O backend será responsável por:

- criar contratos;
- listar contratos;
- buscar contrato por ID;
- registrar eventos;
- atualizar status;
- validar ordem das etapas;
- abrir disputa;
- autorizar pagamento;
- salvar hashes e transaction hashes;
- comunicar com o smart contract;
- enviar dados para o frontend.

### 8.3 Entidades principais do banco

#### Tabela: `contracts`

```txt
id
contract_number
public_agency
supplier_name
object
amount
start_date
end_date
deadline
inspector_name
logistics_responsible
status
document_hash
blockchain_contract_id
created_at
updated_at
```

Finalidade: guardar os dados principais de cada contrato.

#### Tabela: `contract_events`

```txt
id
contract_id
event_type
description
responsible_role
responsible_name
status_before
status_after
document_hash
transaction_hash
blockchain_timestamp
created_at
```

Finalidade: guardar a linha do tempo dos eventos do contrato.

#### Tabela: `profiles`

```txt
id
name
role
wallet_address
created_at
updated_at
```

Finalidade: representar os papéis do sistema:

- gestor;
- fornecedor;
- entregador;
- fiscal;
- auditor.

### 8.4 Status principais do contrato

```txt
CRIADO
ENVIADO
ENTREGUE
VALIDADO
PAGAMENTO_AUTORIZADO
DISPUTA
```

### 8.5 Regras de avanço de status

O sistema deve impedir etapas fora de ordem.

Exemplo:

- Um contrato só pode ir para `ENVIADO` se estiver em `CRIADO`.
- Um contrato só pode ir para `ENTREGUE` se estiver em `ENVIADO`.
- Um contrato só pode ir para `VALIDADO` se estiver em `ENTREGUE`.
- Um contrato só pode ir para `PAGAMENTO_AUTORIZADO` se estiver em `VALIDADO`.
- Um contrato pode ir para `DISPUTA` quando houver divergência.

### 8.6 Endpoints sugeridos

#### Dashboard

```http
GET /dashboard/summary
```

#### Contratos

```http
GET /contracts
POST /contracts
GET /contracts/:id
PATCH /contracts/:id
DELETE /contracts/:id
```

#### Eventos

```http
GET /contracts/:id/events
```

#### Ações do fluxo

```http
POST /contracts/:id/confirm-shipment
POST /contracts/:id/confirm-delivery
POST /contracts/:id/validate-receipt
POST /contracts/:id/authorize-payment
POST /contracts/:id/open-dispute
POST /contracts/:id/simulate-fraud
```

#### Blockchain

```http
GET /contracts/:id/blockchain-status
POST /contracts/:id/register-on-chain
```

---

## 9. Base de Smart Contract

### 9.1 Tecnologias sugeridas

- **Solidity**
- **Hardhat**
- **Ethers.js**
- **Sepolia** ou **Polygon Amoy** como testnet

### 9.2 Objetivo do smart contract

O smart contract será responsável por registrar as etapas críticas do contrato em blockchain.

Ele não precisa armazenar todos os dados sensíveis, apenas:

- ID do contrato;
- status;
- hash do documento;
- endereço das carteiras;
- timestamps;
- eventos emitidos.

### 9.3 Status no smart contract

```solidity
enum Status {
    Criado,
    Enviado,
    Entregue,
    Validado,
    PagamentoAutorizado,
    Disputa
}
```

### 9.4 Funções principais

```solidity
criarContrato()
confirmarEnvio()
confirmarEntrega()
validarRecebimento()
autorizarPagamento()
abrirDisputa()
consultarContrato()
```

### 9.5 Eventos on-chain

```solidity
event ContratoCriado(uint256 contractId, bytes32 documentHash, address createdBy);
event EnvioConfirmado(uint256 contractId, address supplier);
event EntregaConfirmada(uint256 contractId, address logistics);
event RecebimentoValidado(uint256 contractId, address inspector);
event PagamentoAutorizado(uint256 contractId, address manager);
event DisputaAberta(uint256 contractId, address openedBy, string reason);
```

---

## 10. Base de Frontend

### 10.1 Tecnologias sugeridas

A stack oficial do frontend é:

- **Next.js App Router**
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **Framer Motion**
- **TanStack Query**
- **Zustand**
- **React Hook Form**
- **Zod**
- **wagmi**
- **viem**
- **RainbowKit**
- **Lucide React**

> **Stack anterior descartada:** React + Vite foi considerado como opção inicial, mas **Next.js App Router** foi adotado como stack oficial do frontend. Documentos ou referências que ainda citem Vite como stack principal devem ser desconsiderados.

### 10.2 Identidade visual

A interface deve seguir um estilo:

- dark system;
- Web3;
- SaaS moderno;
- profissional;
- tecnológico;
- com cards;
- timeline;
- badges de status;
- animações suaves.

Paleta sugerida:

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

### 10.3 Telas principais

#### 1. Dashboard

Objetivo: mostrar visão geral dos contratos.

Informações:

- contratos ativos;
- aguardando envio;
- aguardando entrega;
- aguardando fiscalização;
- pagamento autorizado;
- em disputa.

#### 2. Cadastro de contrato

Campos:

- número do contrato;
- órgão público;
- fornecedor;
- objeto;
- valor;
- data inicial;
- prazo;
- fiscal responsável;
- responsável logístico;
- hash/documento.

#### 3. Detalhe do contrato

Objetivo: mostrar todas as informações do contrato selecionado.

Deve conter:

- dados principais;
- status atual;
- atores envolvidos;
- ações disponíveis;
- histórico de eventos;
- hashes e transaction hashes.

#### 4. Validação por etapas

Botões por perfil:

- Fornecedor: `Confirmar envio`
- Entregador: `Confirmar entrega`
- Fiscal: `Validar recebimento`
- Gestor: `Autorizar pagamento`
- Qualquer perfil autorizado: `Abrir disputa`

#### 5. Linha do tempo auditável

Cada evento deve mostrar:

- tipo do evento;
- responsável;
- data;
- status;
- hash;
- transaction hash;
- link para explorer da testnet, se possível.

#### 6. Tela de disputa

Objetivo: permitir bloquear o pagamento quando houver divergência.

Exemplos de motivo:

- entrega incompleta;
- atraso;
- divergência na nota fiscal;
- documento inválido;
- produto não recebido.

#### 7. Simulação de fraude

Objetivo: demonstrar o efeito “uau” da solução.

Fluxo:

1. Sistema registra hash de um documento.
2. Usuário simula alteração do documento.
3. Sistema recalcula o hash.
4. Hash não bate.
5. Sistema exibe alerta de possível fraude.

---

## 11. Base para Deploy

### 11.1 Frontend

Opções recomendadas:

- **Vercel**
- **Netlify**

Recomendação principal:

> Usar Vercel para o frontend.

Motivos:

- integração fácil com GitHub;
- deploy rápido;
- compatibilidade nativa com Next.js App Router;
- variáveis de ambiente simples (prefixo `NEXT_PUBLIC_`).

Variáveis de ambiente esperadas:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_ENABLE_MOCKS=
```

### 11.2 Backend

Opções recomendadas:

- **Render**
- **Railway**
- **Fly.io**
- **Supabase Edge Functions**, se quiser manter tudo no Supabase

Recomendação principal:

> Usar Render ou Railway para o backend Node.js.

Variáveis de ambiente esperadas:

```env
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
CHAIN_ID=
```

### 11.3 Banco de dados

Recomendação:

> Usar Supabase/PostgreSQL.

Motivos:

- fácil criação de tabelas;
- painel visual;
- banco PostgreSQL gerenciado;
- API integrada;
- boa velocidade para hackathon;
- fácil integração com frontend e backend.

### 11.4 Blockchain

Recomendação:

> Usar uma testnet, como Sepolia ou Polygon Amoy.

Para hackathon, recomenda-se testnet porque:

- não utiliza dinheiro real;
- permite demonstrar transações;
- gera transaction hash real;
- pode ser consultada em explorer.

### 11.5 Deploy do Smart Contract

Ferramenta recomendada:

- **Hardhat**

Fluxo:

```txt
1. Criar smart contract
2. Configurar rede testnet
3. Configurar wallet de deploy
4. Rodar script de deploy
5. Salvar endereço do contrato
6. Adicionar endereço no backend/frontend
```

Comando exemplo:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

---

## 12. Estrutura Sugerida do Repositório

```txt
fiscalizapay-web3/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── pages/
│   │   ├── widgets/
│   │   ├── features/
│   │   ├── entities/
│   │   └── shared/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── server.ts
│   └── package.json
│
├── smart-contract/
│   ├── contracts/
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.ts
│   └── package.json
│
├── docs/
│   ├── arquitetura.md
│   ├── roadmap.md
│   └── pitch.md
│
└── README.md
```

---

## 13. MVP do Projeto

O MVP deve focar no fluxo central. A regra principal é: **o MVP prova o fluxo central com qualidade e não tenta resolver tudo.**

### 13.1 MVP Obrigatório

Funcionalidades sem as quais o projeto não pode ser apresentado:

```txt
- Criar contrato
- Listar contratos
- Visualizar detalhe do contrato
- Confirmar envio (Fornecedor)
- Confirmar entrega (Entregador)
- Validar recebimento (Fiscal)
- Autorizar pagamento (Gestor)
- Abrir disputa (role autorizada)
- Simular fraude por hash
- Exibir timeline auditável
- Exibir documentHash
- Exibir transactionHash quando existir
- Conectar wallet visualmente (RainbowKit)
```

### 13.2 MVP Diferencial

Funcionalidades que elevam a qualidade da demo, se houver tempo:

```txt
- Link para block explorer da testnet
- Status visual por perfil (PermissionGate)
- Dashboard com métricas (total, por status, em disputa)
- Feedbacks animados com Framer Motion
- Mocks controlados com mesmo formato da API
```

### 13.3 Pós-MVP

Funcionalidades que **não devem ser incluídas** no MVP, apenas documentadas:

```txt
- Upload real de documentos (binário)
- Autenticação Web3 completa (assinatura de mensagem + JWT)
- Relatórios PDF
- Auditoria avançada com exportação
- Score de risco de fornecedor
- Integração com sistemas públicos (SIAFI, COMPRASNET)
- Assinatura digital avançada (ICP-Brasil)
- Permissões institucionais complexas
- Painel analítico com gráficos avançados
```

---

## 13.4 Matriz de Responsabilidade por Camada

Cada camada do sistema tem responsabilidades claramente separadas:

```txt
Frontend:
- Renderizar dashboard, listagem, detalhe e timeline
- Exibir status com badges visuais
- Conectar wallet (wagmi + viem + RainbowKit)
- Validar formulários (React Hook Form + Zod)
- Chamar API e gerenciar cache (TanStack Query)
- Exibir loading, error e empty states
- Exibir documentHash e transactionHash
- Simular fluxo visual com mocks enquanto backend não estiver pronto
- NUNCA ser a camada definitiva de segurança

Backend:
- Validar permissões reais por role
- Validar status atual e impedir avanço fora de ordem
- Criar contrato, atualizar status, criar evento
- Registrar disputa e motivo
- Acionar smart contract quando necessário
- Salvar e retornar transactionHash
- Retornar dados em camelCase para o frontend

Banco de Dados:
- Persistir dados completos do contrato (off-chain)
- Persistir eventos, disputas e perfis
- Persistir documentHash e transactionHash
- Usar snake_case internamente

Smart Contract:
- Registrar provas críticas on-chain
- Emitir eventos blockchain
- Validar transições críticas quando aplicável
- Guardar hash, status, timestamp e carteira

Blockchain/Testnet:
- Prover imutabilidade demonstrável
- Gerar transactionHash real
- Permitir consulta por block explorer
```

---

## 13.5 Fluxos Oficiais do Sistema

### Fluxo Feliz (caminho principal)

```txt
1. Gestor cria contrato → Status: CRIADO
2. Fornecedor confirma envio → Status: ENVIADO
3. Entregador confirma entrega → Status: ENTREGUE
4. Fiscal valida recebimento → Status: VALIDADO
5. Gestor autoriza pagamento → Status: PAGAMENTO_AUTORIZADO
6. Timeline exibe todos os eventos com hashes
7. documentHash e transactionHash ficam visíveis
```

### Fluxo de Disputa

```txt
1. Contrato está em qualquer status antes de PAGAMENTO_AUTORIZADO
2. Usuário autorizado (GESTOR, FISCAL ou AUDITOR) abre disputa
3. Backend registra o motivo e cria evento DISPUTA_ABERTA
4. Status muda para DISPUTA
5. Pagamento fica bloqueado
6. Timeline exibe DISPUTA_ABERTA com motivo
7. Interface exibe alerta visual em vermelho
```

### Fluxo de Fraude Simulada

```txt
1. Sistema possui documentHash original do contrato
2. Usuário aciona simulação de fraude com um novo hash
3. Backend compara hash original com o hash enviado
4. Se forem diferentes → abre disputa automaticamente
5. Status muda para DISPUTA
6. Timeline registra FRAUDE_SIMULADA + DISPUTA_ABERTA
7. Interface exibe comparação visual de hashes e alerta de fraude
8. Pagamento fica bloqueado
```

### Fluxo de Erro por Etapa Fora de Ordem

```txt
Exemplo:
Contrato está em CRIADO.
Usuário tenta confirmar entrega.
Backend rejeita com code: "INVALID_STATUS_TRANSITION".
Frontend exibe:
"Esta etapa não pode ser executada antes da confirmação de envio."
```

### Fluxo de Permissão Negada

```txt
Exemplo:
Usuário FORNECEDOR tenta autorizar pagamento.
Backend rejeita com code: "UNAUTHORIZED_ROLE".
Frontend exibe:
"Apenas o gestor responsável pode autorizar o pagamento."
```

---

## 14. Roadmap de Desenvolvimento

### Bloco 0 — Alinhamento

Responsável principal: Pessoa 1

Entregas:

- problema;
- solução;
- personas;
- fluxo principal;
- regras de negócio;
- escopo do MVP.

### Bloco 1 — Protótipo e UI

Responsável principal: Pessoa 2

Entregas:

- identidade visual;
- layout base;
- dashboard;
- tela de cadastro;
- tela de detalhe;
- timeline.

### Bloco 2 — Backend e Banco

Responsável principal: Pessoa 3

Entregas:

- API;
- banco;
- contratos;
- eventos;
- regras de status.

### Bloco 3 — Smart Contract

Responsável principal: Pessoa 3

Entregas:

- contrato Solidity;
- enum de status;
- eventos on-chain;
- deploy em testnet.

### Bloco 4 — Integração

Responsáveis: Pessoa 2 e Pessoa 3

Entregas:

- frontend consumindo API;
- ações alterando status;
- eventos aparecendo na timeline;
- hash/transação sendo exibidos.

### Bloco 5 — Demo e Pitch

Responsáveis: Todos

Entregas:

- demo ensaiada;
- README;
- apresentação;
- roteiro de pitch;
- prints ou plano B.

---

## 15. Divisão da Equipe

### Pessoa 1 — Product Owner / Documentação / QA

Responsável por:

- problema;
- solução;
- personas;
- regras de negócio;
- roadmap;
- README;
- documentação;
- textos da interface;
- testes de fluxo;
- apoio ao pitch.

### Pessoa 2 — Frontend / UI Lead / Pitch

Responsável por:

- frontend;
- experiência visual;
- dashboard;
- cadastro;
- detalhe do contrato;
- timeline;
- componentes;
- integração com API;
- apresentação visual da demo.

### Pessoa 3 — Backend / Web3 Lead / Pitch Técnico

Responsável por:

- backend;
- banco de dados;
- endpoints;
- regras de status;
- smart contract;
- deploy em testnet;
- integração Web3;
- apresentação técnica.

---

## 16. Pitch Técnico Resumido

> O FiscalizaPay Web3 é uma plataforma onde o pagamento de contratos públicos só avança quando há comprovação, conformidade e rastreabilidade. Cada etapa é validada por múltiplas partes e registrada em blockchain, enquanto dados sensíveis ficam protegidos off-chain. O resultado é menos fraude, mais transparência e pagamento justo.

---

## 17. Resultado Esperado

Ao final do desenvolvimento, o projeto deve entregar:

- uma interface funcional;
- backend com persistência;
- smart contract básico;
- registro de eventos em blockchain;
- timeline auditável;
- fluxo de pagamento condicionado;
- documentação clara;
- demo convincente para o hackathon.

O objetivo é demonstrar que a blockchain não está sendo usada apenas como tendência, mas como uma camada real de confiança, auditoria e integridade para contratos públicos.
