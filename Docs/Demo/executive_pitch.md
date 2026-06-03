# FiscalizaPay — Executive Pitch

> Versões calibradas para diferentes contextos e tempos disponíveis.

---

## Versão 30 segundos — Elevator Pitch

> Para: corredor, evento, primeiro contato

"O Brasil perde estimados R$ 180 bilhões por ano em contratos públicos sem rastreabilidade. FiscalizaPay registra cada etapa — criação, entrega, validação, pagamento — na blockchain. Qualquer tentativa de adulteração de documento é detectada automaticamente. Auditoria em tempo real, antes do dinheiro sair."

---

## Versão 1 minuto — Demo Rápida

> Para: reunião inicial, pitch de 1 slide

"Contratos públicos no Brasil somam R$ 1,2 trilhão por ano. O problema não é falta de lei — é falta de rastreabilidade. Os documentos mudam, as versões se contradizem, as auditorias chegam tarde.

FiscalizaPay resolve isso com blockchain. Cada etapa do contrato gera um registro imutável: quem fez, quando fez, com qual documento. O hash SHA-256 do PDF é gravado na Polygon Amoy no momento da assinatura. Se alguém tentar trocar o documento depois, o hash diverge e o pagamento é bloqueado automaticamente.

Não é teoria. Aqui está o sistema funcionando: seis contratos monitorados, vinte eventos rastreados, um contrato em disputa por fraude detectada — tudo em tempo real, sem backend, com dados mock que simulam o ambiente de produção."

---

## Versão 3 minutos — Pitch Técnico

> Para: banca acadêmica, investidor técnico, CTO

**O problema:**

Compras públicas brasileiras são gerenciadas em sistemas incompatíveis. O órgão usa SIAFI. O fornecedor usa ERP próprio. O fiscal usa formulário físico. O auditor chega meses depois com acesso a documentos que podem ter sido alterados. Não há cadeia de custódia verificável.

O resultado: desvios detectados apenas após o pagamento. Superfaturamento invisível. Documentos adulterados sem prova forense.

**A solução:**

FiscalizaPay é uma plataforma de rastreabilidade de contratos públicos com infraestrutura blockchain. O sistema implementa um protocolo de cinco etapas — Criação, Envio, Entrega, Validação, Pagamento — onde cada transição de estado gera um registro imutável na Polygon Amoy.

O mecanismo central de segurança é o **hash binding**: o SHA-256 do documento físico é registrado na criação do contrato. Qualquer tentativa posterior de substituir o documento gera hash divergente, ativando automaticamente uma disputa e bloqueando o pagamento.

**A arquitetura:**

Frontend em Next.js 16 App Router com Feature-Sliced Design. Backend (em desenvolvimento) em NestJS com PostgreSQL. Smart contract em Solidity na Polygon Amoy. TanStack Query para cache e invalidação. Layer de mock completo para operação sem backend.

**O traction:**

Sistema MVP completo com sete telas funcionais, vinte eventos de demonstração, cinco roles de usuário, detecção automática de fraude e auditoria consolidada. Zero dependência de backend para demonstração.

**O mercado:**

Governo federal, estados e municípios gastam R$ 1,2 tri/ano. TCUs e CGUs precisam de ferramentas de auditoria preventiva. Compliance corporativo em contratos B2G. Internacionalização possível — o problema de opacidade em contratos públicos é global.

**O que pedimos:**

Validação acadêmica do modelo de protocolo. Conexão com órgãos públicos parceiros para piloto. Infraestrutura para deploy em testnet pública.

---

## Versão 5 minutos — Pitch Completo

> Para: banca completa, diretoria, investidor com due diligence, apresentação formal

### Abertura — O problema em números

O Brasil é o 94º país no Índice de Percepção de Corrupção da Transparência Internacional. R$ 1,2 trilhão em compras públicas por ano. Estimativa de R$ 180 bilhões desviados anualmente (15% do total).

Mas o maior problema não é a corrupção intencional — é a **impossibilidade de provar** quando ela acontece.

### O ciclo do problema

Um contrato público passa por quatro atores: o gestor que cria, o fornecedor que entrega, o fiscal que valida e o auditor que fiscaliza. Cada um tem seu sistema, sua versão dos fatos, seu arquivo.

Quando algo dá errado — uma entrega fantasma, um documento substituído, um pagamento prematuro — a auditoria precisa reconstituir a linha do tempo a partir de e-mails, PDFs e planilhas que podem ter sido alterados. Sem prova irrefutável, sem condenação, sem ressarcimento.

### A solução técnica

FiscalizaPay implementa um **protocolo de rastreabilidade imutável**:

1. **Hash binding na criação:** o SHA-256 do documento é registrado na blockchain no momento da criação. Qualquer alteração posterior é detectável matematicamente.

2. **Protocolo sequencial obrigatório:** o smart contract impõe a ordem CRIADO → ENVIADO → ENTREGUE → VALIDADO → PAGAMENTO_AUTORIZADO. Nenhuma etapa pode ser pulada ou executada fora de ordem.

3. **Multi-assinante rastreável:** cada ator assina sua etapa com carteira Web3 (endereço Ethereum rastreável). A identidade de quem fez o quê é pública e imutável.

4. **Auditoria preventiva:** a detecção de fraude ocorre antes do pagamento, não depois. O auditor vê tudo em tempo real, com alertas automáticos.

5. **Registro descentralizado:** os eventos ficam na Polygon Amoy, não no servidor do órgão público. Quem contrata não controla a evidência.

### Demonstração ao vivo

[Aqui o apresentador executa o demo_flow.md — 3 a 5 minutos]

Pontos de destaque:
- CT-2026-005: R$ 12,75 milhões fiscalizados com 6 eventos blockchain
- CT-2026-006: Fraude detectada automaticamente, pagamento bloqueado, R$ 2,34 milhões protegidos
- Auditoria consolidada: 20 eventos de 6 contratos em uma única tela

### Impacto esperado

| Métrica | Modelo atual | Com FiscalizaPay |
|---|---|---|
| Tempo até detecção de fraude | Meses a anos | Segundos |
| Custo de auditoria por contrato | Alto (manual) | Automático |
| Evidência forense disponível | Fraca (documentos mutáveis) | Forte (blockchain imutável) |
| Transparência para cidadão | Baixa | Alta (tx hash público) |
| Rastreabilidade fim a fim | Inexistente | Completa |

### Tecnologia

- **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS v4, Framer Motion
- **Backend:** NestJS, PostgreSQL (em desenvolvimento)
- **Blockchain:** Solidity, Polygon Amoy, wagmi v2, viem v2, RainbowKit
- **Infraestrutura:** Deploy Vercel/Cloudflare, contrato na testnet Amoy → mainnet Polygon

### Roadmap pós-MVP

- **Fase 1 (atual):** MVP Frontend completo, demo funcional, mock layer
- **Fase 2 (próximo):** Backend NestJS + PostgreSQL, API real, deploy testnet
- **Fase 3:** Piloto com órgão público parceiro (prefeitura ou autarquia)
- **Fase 4:** Integração com sistemas existentes (SIAFI, Licitações-e, NF-e)
- **Fase 5:** Internacionalização — América Latina, África lusófona

### Encerramento

> "FiscalizaPay não resolve a corrupção. Mas torna impossível escondê-la. Cada real do dinheiro público, rastreado do contrato ao pagamento — com prova blockchain que nenhum político, fornecedor ou auditor corrupto pode apagar."

---

*Documento criado no Bloco 20 — 2026-06-02*
