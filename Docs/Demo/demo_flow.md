# FiscalizaPay — Roteiro de Demonstração

> Duração estimada: 8–12 minutos  
> Público: banca acadêmica, diretoria, investidores, clientes  
> Ambiente: mocks ativos (`NEXT_PUBLIC_USE_MOCKS=true`), navegador desktop ou tablet

---

## Antes de começar

1. Rodar `npm run dev` na pasta `web/`
2. Abrir `http://localhost:3000` no navegador
3. Deixar o navegador em tela cheia (F11)
4. Garantir que o perfil ativo seja **GESTOR (Maria Santos)** — selecionável no canto superior direito

---

## Passo 1 — Visão geral do problema (1 min)

**O que dizer:**
> "Contratos públicos no Brasil somam R$ 1,2 trilhão por ano. Desse valor, estimativas apontam que 15% a 20% se perdem em fraudes, superfaturamento e falta de rastreabilidade. Auditorias chegam depois do dano. FiscalizaPay registra cada etapa na blockchain em tempo real — sem intermediários, sem adulteração possível."

**O que clicar:**
- Acessar `http://localhost:3000` (landing page)
- Mostrar os dois botões de ação ("Acessar Dashboard" e "Ver contratos")
- Clicar em **"Acessar Dashboard"**

---

## Passo 2 — Dashboard: visão do gestor (1 min)

**Rota:** `/dashboard`

**O que mostrar:**
- 6 contratos ativos monitorados simultaneamente
- Cards de métricas: total (6), por status, valor total fiscalizado (~R$ 18 M)
- Barra de progresso de status do portfólio
- Alerta de disputa na seção inferior — **CT-2026-006 em DISPUTA** → clicar no alerta para ir direto ao contrato

**O que dizer:**
> "Em um só painel, o gestor vê todos os contratos, o status de cada um e os alertas ativos. Esse alerta aqui indica que um contrato está em disputa — vamos entender o motivo."

**O que clicar:**
- Mostrar os 4 widgets do dashboard
- Apontar para o alerta de disputa da CT-2026-006
- Clicar no alerta → navega para `/contracts/mock-contract-6`

---

## Passo 3 — Fraude detectada: CT-2026-006 (2 min)

**Rota:** `/contracts/mock-contract-6`

**O que mostrar:**
- Alerta vermelho no topo: "Pagamento bloqueado"
- Status: **DISPUTA**
- Contrato: Prefeitura de Belo Horizonte — Limpeza Pública — R$ 2.340.000,00
- Timeline: 4 eventos
  1. `CONTRATO_CRIADO` — Maria Santos (GESTOR) — 01/03/2026
  2. `ENVIO_CONFIRMADO` — Carlos Rodrigues (FORNECEDOR) — 01/04/2026
  3. `FRAUDE_SIMULADA` — Ana Ferreira (AUDITOR) — 27/05/2026 — hash adulterado detectado
  4. `DISPUTA_ABERTA` — Ana Ferreira (AUDITOR) — 27/05/2026 — pagamento bloqueado
- Hash original do contrato (no card de hashes)
- Hash adulterado na linha `FRAUDE_SIMULADA` (diferente do original)

**O que dizer:**
> "Aqui está o caso crítico. Uma tentativa de adulteração do documento foi detectada automaticamente: o auditor enviou um hash diferente do hash registrado na criação do contrato. O sistema identificou a divergência e bloqueou o pagamento imediatamente — tudo registrado na blockchain com timestamp. Isso é o que chamamos de trilha de auditoria imutável."

**O que clicar:**
- Rolar a timeline até o evento `FRAUDE_SIMULADA`
- Mostrar os hashes (original vs. adulterado) lado a lado na timeline
- Mostrar o badge **DISPUTA** e o alerta vermelho no painel de ações

---

## Passo 4 — Fluxo completo: CT-2026-005 (2 min)

**Rota:** `/contracts/mock-contract-5`

**Como chegar:** clicar em "Contratos" no sidebar → clicar em CT-2026-005

**O que mostrar:**
- Contrato: DNIT — Recape BR-101 trecho Sul 45 km — **R$ 12.750.000,00**
- Status: **PAGAMENTO_AUTORIZADO** (fluxo completo concluído)
- Timeline com 6 eventos completos:
  1. `CONTRATO_CRIADO` — Maria Santos — nov/2025
  2. `HASH_REGISTRADO` — Hash gravado na blockchain Polygon Amoy
  3. `ENVIO_CONFIRMADO` — Carlos Rodrigues — dez/2025 — tx hash
  4. `ENTREGA_CONFIRMADA` — Ricardo Alves — abr/2026 — tx hash
  5. `RECEBIMENTO_VALIDADO` — João Silva (FISCAL) — mai/2026 — tx hash
  6. `PAGAMENTO_AUTORIZADO` — Maria Santos — mai/2026 — tx hash
- Card de blockchain (registrado on-chain, block explorer link)
- 4 partes rastreadas: Gestor, Fornecedor, Entregador, Fiscal

**O que dizer:**
> "Este é o fluxo completo e feliz. Seis etapas, seis registros imutáveis na blockchain. Cada ator assinou sua etapa com carteira Web3. O pagamento de R$ 12,75 milhões só foi liberado após o fiscal confirmar a conformidade. Nenhuma etapa pode ser pulada — o contrato inteligente garante a ordem."

**O que clicar:**
- Rolar pela timeline completa
- Mostrar os transaction hashes clicáveis em cada evento
- Mostrar o card "Status on-chain" (registeredOnChain: true)

---

## Passo 5 — Listagem de contratos (30 seg)

**Rota:** `/contracts`

**O que mostrar:**
- Grid com 6 contratos lado a lado
- Filtros: busca por texto, status, órgão, ordenação
- Cards com status colorido: verde (ativo), azul (progresso), vermelho (disputa)
- Badge DISPUTA destacado em vermelho no CT-2026-006
- Usar o filtro de status "VALIDADO" para mostrar CT-2026-004

**O que dizer:**
> "A listagem reúne todos os contratos com filtros em tempo real. Uma equipe de auditoria pode filtrar apenas contratos em disputa, ou por órgão público, ou por faixa de valor."

---

## Passo 6 — Cadastro de contrato (30 seg — opcional)

**Rota:** `/contracts/new`

**O que mostrar:**
- Formulário estruturado em seções: Identificação, Partes, Valores, Documentação
- Campos de carteira (validação de endereço Ethereum)
- Campo de hash do documento (vincula o PDF ao registro blockchain)

**O que dizer:**
> "O cadastro vincula o hash SHA-256 do documento físico ao contrato digital. A partir desse momento, qualquer alteração no documento gerará um hash diferente — adulteração detectada automaticamente."

**Não submeter o formulário** — apenas mostrar a estrutura.

---

## Passo 7 — Auditoria consolidada (1 min)

**Rota:** `/audit`

**O que mostrar:**
- 4 cards de sumário: total de eventos, eventos com tx blockchain, com hash de documento, disputas e fraudes
- Filtros: tipo de evento, status do contrato, toggle "Disputas e fraudes", ordenação
- Clicar no toggle "Disputas e fraudes" → filtra apenas os eventos FRAUDE_SIMULADA e DISPUTA_ABERTA
- Linha do CT-2026-006 aparece em destaque laranja (alerta)
- Clicar na seta → vai para o detalhe do contrato

**O que dizer:**
> "A tela de auditoria consolida todos os eventos de todos os contratos em uma única visão temporal. O auditor não precisa entrar em cada contrato — pode filtrar por tipo de alerta, por data, por status. Isso é governança centralizada."

---

## Passo 8 — Disputas (30 seg)

**Rota:** `/disputes`

**O que mostrar:**
- 3 cards: total disputas (1), valor bloqueado (R$ 2.340.000), pagamentos bloqueados (1)
- Card da CT-2026-006 com hash do documento em destaque
- Botão "Ver contrato" → detalhe

**O que dizer:**
> "A tela de disputas mostra o volume de recursos bloqueados em tempo real. Qualquer stakeholder autorizado pode acompanhar o status das disputas sem precisar acessar o sistema do órgão público."

---

## Passo 9 — Demonstração de nova fraude (1 min — ao vivo)

**Rota:** `/contracts/mock-contract-4` (status VALIDADO)

**O que fazer:**
1. Navegar para CT-2026-004 (ANVISA — Insumos Laboratoriais)
2. Garantir que o perfil ativo seja **AUDITOR (Ana Ferreira)** — trocar no header
3. No painel de ações, clicar em **"Simular Fraude"**
4. No campo "Novo hash do documento", digitar qualquer texto diferente (ex: `HASH_FALSO_DEMO_2026`)
5. Clicar em **"Confirmar"**
6. Observar: status muda para **DISPUTA**, evento `FRAUDE_SIMULADA` aparece na timeline, alerta vermelho

**O que dizer:**
> "Agora ao vivo: vou simular uma tentativa de adulteração no contrato da ANVISA. Insiro um hash diferente do original — o sistema detecta a divergência e bloqueia o pagamento automaticamente. Em 3 segundos, o contrato passou de VALIDADO para DISPUTA. Isso não pode ser desfeito — está registrado."

---

## Passo 10 — Mensagem final (30 seg)

**O que dizer:**
> "FiscalizaPay transforma contratos públicos opacos em registros auditáveis, imutáveis e transparentes. Blockchain não como buzzword — como infraestrutura de confiança. Cada real do dinheiro público, rastreado do contrato ao pagamento."

**O que mostrar:**
- Voltar ao dashboard
- Mostrar os 6 contratos, o alerta de disputa do CT-2026-006 agora e o novo do CT-2026-004
- Encerrar na landing page com a tagline do produto

---

## Plano B — Se o sistema falhar

- Se `npm run dev` não subir: mostrar prints das telas em PDF/PowerPoint
- Se alguma tela travar: usar `localStorage.clear()` no console do browser e recarregar
- Se a simulação de fraude não funcionar: mostrar CT-2026-006 que já tem fraude registrada nos mocks
- **Os mocks garantem que todos os dados existem sem backend** — sem ponto único de falha

---

## Perfis disponíveis para troca durante a demo

| Perfil | Nome | Role | Quando usar |
|---|---|---|---|
| Maria Santos | GESTOR | Criar contrato, autorizar pagamento, visão geral |
| Carlos Rodrigues | FORNECEDOR | Confirmar envio |
| Ricardo Alves | ENTREGADOR | Confirmar entrega |
| João Silva | FISCAL | Validar recebimento |
| Ana Ferreira | AUDITOR | Simular fraude, abrir disputa |

Trocar perfil: clicar no ícone de usuário no header → "Perfil atual" → selecionar outro perfil.
