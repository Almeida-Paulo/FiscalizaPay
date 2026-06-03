# FiscalizaPay — Storytelling da Demo

> Documento de narrativa para apresentações, pitches e demos ao vivo.

---

## O problema que ninguém quer admitir

O Brasil gasta **R$ 1,2 trilhão por ano em compras e contratos públicos**. É o maior orçamento de contratação pública da América Latina.

Desse valor, estima-se que entre **15% e 20% se perde em fraudes, desvios e superfaturamento** — segundo dados do TCU, CGU e pesquisas acadêmicas sobre corrupção em licitações.

Mas o problema não é só corrupção intencional.

**O problema é sistêmico:**

- Contratos são assinados em papel, armazenados em pastas, digitalizados mal
- Auditorias acontecem **após o pagamento** — o dano já foi feito
- Cada etapa do contrato (entrega, validação, pagamento) é registrada em sistemas diferentes, sem conexão
- O fornecedor diz que entregou. O fiscal diz que não recebeu. O gestor diz que autorizou. Não há prova irrefutável de nenhum dos três
- Adulteração de documentos é possível sem deixar rastro auditável

---

## Por que auditorias falham

Auditorias públicas no modelo atual sofrem de três problemas estruturais:

**1. Chegam tarde**  
A auditoria ocorre meses ou anos após o pagamento. O recurso já foi sacado, o fornecedor já encerrou a empresa, o dano é irreparável.

**2. Dependem de quem controla o arquivo**  
Documentos estão em posse do órgão contratante. Quem fiscaliza e quem guarda a prova são os mesmos — conflito de interesse estrutural.

**3. Não têm cadeia de custódia**  
Um PDF pode ser alterado. Uma planilha pode ser substituída. Sem hash criptográfico e timestamp imutável, não há como provar que o documento de hoje é o mesmo documento assinado no início do contrato.

---

## Por que rastreabilidade é difícil

Contratos públicos envolvem múltiplos atores com sistemas incompatíveis:

- **Órgão público (gestor):** sistema de licitação próprio (SIAFI, e-Licita, sistemas estaduais)
- **Fornecedor:** ERP privado, nota fiscal eletrônica
- **Entregador/Logística:** sistema de rastreio privado, DANFE, romaneio
- **Fiscal:** formulários físicos, laudos em PDF
- **Auditor:** acesso posterior, via solicitação formal, sem visibilidade em tempo real

Nenhum desses sistemas conversa com os outros. A rastreabilidade existe no papel — na prática, cada ator tem sua versão da verdade.

---

## Como FiscalizaPay resolve

**FiscalizaPay cria uma trilha de auditoria imutável, compartilhada e verificável.**

### O mecanismo central

Cada etapa do contrato — criação, envio, entrega, validação, pagamento — gera um **evento registrado na blockchain**.

Esses eventos:
- São imutáveis (não podem ser alterados após o registro)
- Têm timestamp verificável por qualquer pessoa
- Carregam o hash SHA-256 do documento físico associado
- Identificam o ator que executou a ação (carteira Web3 rastreável)

### O fluxo obrigatório

```
CRIADO → ENVIADO → ENTREGUE → VALIDADO → PAGAMENTO_AUTORIZADO
```

Nenhuma etapa pode ser pulada. O sistema de contrato inteligente (smart contract) garante que:
- O pagamento só é liberado após a validação pelo fiscal
- A validação só é possível após a confirmação de entrega
- A confirmação de entrega só é possível após o envio

**É um protocolo, não um processo manual.**

---

## Benefícios para cada stakeholder

### Para o gestor público
- Dashboard em tempo real de todos os contratos
- Alertas de disputa e fraude antes do pagamento
- Relatório de auditoria gerado automaticamente
- Conformidade com LGPD, LAI e TCU sem retrabalho

### Para o fornecedor
- Prova imutável de que entregou o que foi contratado
- Proteção contra contestações indevidas
- Pagamento transparente — sabe exatamente em que etapa está

### Para o fiscal
- Registro blockchain de cada validação realizada
- Proteção jurídica — há prova de que fez seu trabalho
- Sem dependência do arquivo do órgão

### Para o auditor
- Visão consolidada de todos os contratos em uma tela
- Filtro por tipo de alerta, período, órgão, valor
- Cada evento com hash, timestamp e assinante rastreável

---

## Blockchain: o que significa na prática

> "Blockchain" não é buzzword aqui. É infraestrutura de confiança.

**O que o blockchain garante:**

1. **Imutabilidade** — Um registro na Polygon Amoy não pode ser apagado ou editado. Jamais.
2. **Descentralização** — Não está no servidor do órgão público. Não está no servidor do fornecedor. Está em uma rede global de validadores.
3. **Verificabilidade pública** — Qualquer pessoa com o transaction hash pode verificar o registro no block explorer (Polygonscan). Sem intermediário.
4. **Timestamp confiável** — O bloco tem horário validado pela rede, não por um servidor controlado por uma das partes.

**O que o blockchain não resolve (honestidade intelectual):**
- Não impede que um fornecedor minta ao registrar o envio — mas registra a mentira com timestamp e carteira rastreável
- Não substitui a validação física do fiscal — mas registra que o fiscal validou (ou não)
- Não é perfeito — mas é infinitamente melhor do que pastas em papel

---

## Documentos auditáveis: o papel do hash

Quando um contrato é criado, o gestor registra o **hash SHA-256 do documento PDF**.

O hash é uma impressão digital matemática do arquivo. Se um único caractere do PDF for alterado, o hash muda completamente.

**Fluxo de detecção de fraude:**

```
Hash original: a1b2c3d4e5f6...  (registrado na criação)
Hash suspeito: HASH_ADULTERADO_xyz... (apresentado pelo auditor)
Comparação: DIVERGÊNCIA DETECTADA
Resultado: DISPUTA_ABERTA automaticamente, pagamento bloqueado
```

No FiscalizaPay, esse processo é automático. O auditor não precisa fazer análise manual — o sistema detecta em segundos.

---

## Automação: menos burocracia, mais controle

| Processo manual | Com FiscalizaPay |
|---|---|
| Auditoria posterior ao pagamento | Alerta em tempo real antes do pagamento |
| Verificação manual de documentos | Hash automático, detecção instantânea |
| Relatórios em Excel | Dashboard sempre atualizado |
| Comunicação por e-mail entre partes | Timeline compartilhada e imutável |
| Arquivo físico susceptível a perda | Registro distribuído, permanente |

---

## Transparência: quem vê o quê

| Role | Dashboard | Contratos | Timeline | Auditoria | Disputas |
|---|---|---|---|---|---|
| GESTOR | ✅ | ✅ criação/edição | ✅ | ✅ | ✅ abre disputa |
| FORNECEDOR | — | ✅ leitura | ✅ | — | — |
| ENTREGADOR | — | ✅ leitura | ✅ | — | — |
| FISCAL | ✅ | ✅ | ✅ | ✅ | ✅ abre disputa |
| AUDITOR | ✅ | ✅ | ✅ | ✅ completo | ✅ fraude |

---

## Confiabilidade: o sistema é resistente a falhas

- **Mocks integrados:** se o backend falhar durante a demo, os dados mock garantem funcionamento completo
- **Frontend desacoplado:** o sistema de UI funciona 100% independente da API
- **Fallback documentado:** `NEXT_PUBLIC_USE_MOCKS=true` garante demonstração sem infraestrutura de produção
- **Build estático:** pode ser servido de qualquer CDN global (Vercel, Cloudflare Pages)

---

## A proposta de valor em uma frase

> "FiscalizaPay transforma cada contrato público em um protocolo de confiança verificável — do cadastro ao pagamento, com rastreabilidade blockchain, detecção automática de fraude e auditoria em tempo real."

---

*Documento criado no Bloco 20 — 2026-06-02*
