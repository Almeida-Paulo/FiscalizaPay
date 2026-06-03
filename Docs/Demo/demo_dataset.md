# FiscalizaPay — Dataset de Demonstração

> Documenta os dados mockados disponíveis para a demo, o fluxo recomendado e as histórias narrativas de cada contrato.

---

## Perfis disponíveis

| ID | Nome | Role | Carteira |
|---|---|---|---|
| profile-gestor-1 | **Maria Santos** | GESTOR | `0xDeadBeef...DeaD01` |
| profile-fornecedor-1 | **Carlos Rodrigues** | FORNECEDOR | `0x742d35Cc...000002` |
| profile-entregador-1 | **Ricardo Alves** | ENTREGADOR | `0xLogistica...000003` |
| profile-fiscal-1 | **João Silva** | FISCAL | `0x1234abcd...340004` |
| profile-auditor-1 | **Ana Ferreira** | AUDITOR | `0xAuditor...AudiT05` |

**Perfil padrão ao abrir o sistema:** GESTOR (Maria Santos)

---

## Contratos disponíveis

### CT-2026-001 — Ponto de entrada do fluxo

| Campo | Valor |
|---|---|
| **ID** | `mock-contract-1` |
| **Número** | CT-2026-001 |
| **Órgão** | Prefeitura Municipal de São Paulo |
| **Fornecedor** | TechSupply Brasil Ltda |
| **Objeto** | 200 computadores e periféricos para escolas municipais |
| **Valor** | R$ 480.000,00 |
| **Status** | **CRIADO** |
| **Deadline** | 30/09/2026 |
| **Hash doc** | `a1b2c3d4e5f6789...8` |

**Uso na demo:** mostrar o estado inicial do ciclo. É o contrato onde o apresentador pode **ao vivo** clicar em "Confirmar Envio" (perfil FORNECEDOR) para demonstrar a transição de status.

**Eventos:** 1 (CONTRATO_CRIADO)

---

### CT-2026-002 — Fluxo em andamento

| Campo | Valor |
|---|---|
| **ID** | `mock-contract-2` |
| **Número** | CT-2026-002 |
| **Órgão** | Secretaria de Saúde do Estado do Rio de Janeiro |
| **Fornecedor** | MedEquip Soluções em Saúde S.A. |
| **Objeto** | 5 unidades de ultrassom portátil |
| **Valor** | R$ 1.250.000,00 |
| **Status** | **ENVIADO** |
| **Blockchain ID** | 7 |
| **Hash doc** | `b2c3d4e5f6789...9` |

**Uso na demo:** mostrar contrato de saúde em trânsito. Pode usar perfil ENTREGADOR para confirmar entrega ao vivo.

**Eventos:** 2 (CONTRATO_CRIADO → ENVIO_CONFIRMADO com tx hash)

---

### CT-2026-003 — Aguardando validação fiscal

| Campo | Valor |
|---|---|
| **ID** | `mock-contract-3` |
| **Número** | CT-2026-003 |
| **Órgão** | Ministério da Educação — FNDE |
| **Fornecedor** | EduTech Materiais Didáticos Ltda |
| **Objeto** | 50.000 livros didáticos do ensino fundamental |
| **Valor** | R$ 375.000,00 |
| **Status** | **ENTREGUE** |
| **Blockchain ID** | 12 |

**Uso na demo:** contrato educacional entregue mas aguardando validação. Perfil FISCAL pode validar ao vivo.

**Eventos:** 3 (CRIADO → ENVIADO → ENTREGUE, todos com tx hash)

---

### CT-2026-004 — Pronto para autorização de pagamento ⭐ Demo de fraude ao vivo

| Campo | Valor |
|---|---|
| **ID** | `mock-contract-4` |
| **Número** | CT-2026-004 |
| **Órgão** | ANVISA |
| **Fornecedor** | FarmaLab Produtos Hospitalares S.A. |
| **Objeto** | Reagentes e materiais de consumo laboratorial — 12 meses |
| **Valor** | R$ 892.000,00 |
| **Status** | **VALIDADO** |
| **Blockchain ID** | 18 |
| **Hash doc** | `d4e5f678...11` |

**Uso na demo:** contrato validado que pode receber:
- Autorização de pagamento (perfil GESTOR) → demonstrar fluxo feliz
- **Simulação de fraude (perfil AUDITOR) → demonstrar detecção ao vivo** ⭐

**Eventos:** 4 (CRIADO → ENVIADO → ENTREGUE → VALIDADO, todos com tx hash)

---

### CT-2026-005 — Caso de sucesso completo ⭐ Exemplo principal

| Campo | Valor |
|---|---|
| **ID** | `mock-contract-5` |
| **Número** | CT-2026-005 |
| **Órgão** | DNIT |
| **Fornecedor** | ConstrutoBras Engenharia e Pavimentação Ltda |
| **Objeto** | Manutenção e recape asfáltico — BR-101 trecho Sul, 45 km |
| **Valor** | **R$ 12.750.000,00** |
| **Status** | **PAGAMENTO_AUTORIZADO** |
| **Blockchain ID** | 25 |
| **Hash doc** | `e5f67890...33` |

**Uso na demo:** ⭐ **Este é o contrato estrela da demonstração.**

Timeline completa com 6 eventos, incluindo `HASH_REGISTRADO` na blockchain. Tx hash em cada etapa. Maior valor do portfólio. Caso de sucesso absoluto.

**Eventos:** 6 (CRIADO → HASH_REGISTRADO → ENVIADO → ENTREGUE → VALIDADO → PAGAMENTO_AUTORIZADO)

**Por que usar:** impacto visual máximo. R$ 12,75 M fiscalizados com rastreabilidade completa, blockchain, todas as partes identificadas.

---

### CT-2026-006 — Caso de fraude pré-instalada ⭐ Demo de disputa

| Campo | Valor |
|---|---|
| **ID** | `mock-contract-6` |
| **Número** | CT-2026-006 |
| **Órgão** | Prefeitura de Belo Horizonte — Secretaria de Obras |
| **Fornecedor** | UrbanCleaning Serviços Ambientais Ltda |
| **Objeto** | Limpeza pública e coleta seletiva de resíduos sólidos |
| **Valor** | R$ 2.340.000,00 |
| **Status** | **DISPUTA** |
| **Blockchain ID** | 31 |
| **Hash doc** | `f6789012...44` (original) / `HASH_ADULTERADO_xyz789...` (fraudado) |

**Uso na demo:** ⭐ **Este é o contrato de fraude pré-instalado nos mocks.**

Já contém os eventos `FRAUDE_SIMULADA` e `DISPUTA_ABERTA` com hash divergente documentado. Ideal para mostrar o mecanismo de detecção sem executar ao vivo.

**Eventos:** 4 (CRIADO → ENVIADO → FRAUDE_SIMULADA → DISPUTA_ABERTA)

**Auditor registrado:** Ana Ferreira (`0xAuditor...AudiT05`)

---

## Dashboard Summary (dados globais)

| Métrica | Valor |
|---|---|
| Total de contratos | 6 |
| CRIADO | 1 |
| ENVIADO | 1 |
| ENTREGUE | 1 |
| VALIDADO | 1 |
| PAGAMENTO_AUTORIZADO | 1 |
| DISPUTA | 1 |
| Valor total fiscalizado | ~R$ 18.087.000,00 |

---

## Eventos totais disponíveis na tela de Auditoria

| Tipo | Quantidade | Contratos |
|---|---|---|
| CONTRATO_CRIADO | 6 | Todos |
| ENVIO_CONFIRMADO | 5 | CT-002, 003, 004, 005, 006 |
| ENTREGA_CONFIRMADA | 3 | CT-003, 004, 005 |
| RECEBIMENTO_VALIDADO | 2 | CT-004, 005 |
| PAGAMENTO_AUTORIZADO | 1 | CT-005 |
| HASH_REGISTRADO | 1 | CT-005 |
| FRAUDE_SIMULADA | 1 | CT-006 |
| DISPUTA_ABERTA | 1 | CT-006 |
| **Total** | **20 eventos** | |

---

## Fluxo recomendado para demo de 8 minutos

```
Landing (30s)
  ↓
Dashboard (1m) — mostrar alertas e métricas
  ↓
CT-2026-006 (1.5m) — fraude pré-instalada, hash divergente
  ↓
CT-2026-005 (2m) — fluxo completo R$ 12.75M, timeline com 6 eventos
  ↓
/contracts (30s) — filtros, grid, badges de status
  ↓
/audit (1m) — visão consolidada, filtro "Disputas e fraudes"
  ↓
CT-2026-004 ao vivo (1.5m) — simular fraude com perfil AUDITOR
  ↓
Encerrar no dashboard (30s)
```

---

## Fluxo alternativo para demo de 3 minutos

```
Dashboard (30s) — mostrar alerta de disputa
  ↓
CT-2026-006 (1m) — fraude detectada, pagamento bloqueado
  ↓
CT-2026-005 (1m) — fluxo completo como contraste positivo
  ↓
Encerrar com proposta de valor
```

---

## Notas para o apresentador

- **Não submeter o formulário de novo contrato durante a demo** — mocks são reiniciados com F5, mas IDs novos podem quebrar o estado de auditoria
- **Para fazer a simulação de fraude ao vivo:** CT-2026-004 (VALIDADO) é o mais seguro — já tem documentHash registrado, disputa não está bloqueada
- **Hashes são encurtados na UI** — `a1b2c3...67` — mas são copiáveis com um clique
- **Transaction hashes são clicáveis** — abririam o Polygonscan em produção; em demo apontam para URL de exemplo
- **O filtro "Disputas e fraudes" na auditoria** é o mais impactante — mostra apenas os eventos críticos

---

*Dataset criado no Bloco 20 — 2026-06-02*
