# Oraculum Design System

> Guia de identidade visual para o frontend do sistema **Oraculum** — uma plataforma Web3 voltada para blockchain, smart contracts, fiscalização, compliance, rastreabilidade e validação automatizada.

> **Uso no FiscalizaPay Web3:** Este design system é a base visual do projeto FiscalizaPay. As decisões de paleta abaixo foram consolidadas na Session Two de Coerência. Ver também: `Docs/decisoes_tecnicas_finais.md` seção 15.

---

## 0. Decisão Oficial de Paleta — FiscalizaPay Web3

Esta seção resolve a divergência entre as duas cores de destaque documentadas:

```txt
Destaque primário oficial (interface):  #22D3EE  (cyan-400 do TailwindCSS)
Cor alternativa neon Oraculum:          #11DFF2  (assinatura visual da marca Oraculum)
```

### Regra de uso

```txt
#22D3EE → usar em:
  - botões primários
  - links ativos
  - badges de destaque
  - bordas de foco
  - indicadores de sidebar ativos

#11DFF2 → usar em:
  - efeitos de glow (box-shadow)
  - hover de elementos neon
  - animações de pulse
  - elementos de identidade de marca (logo area)
  - destaque especial em eventos blockchain
```

**Motivo:** `#22D3EE` é o `cyan-400` do Tailwind, permitindo uso direto via classes como `text-cyan-400`, `bg-cyan-400/10`, `border-cyan-400`. `#11DFF2` é a assinatura da marca Oraculum e deve ser usada apenas em elementos de impacto visual, não como cor funcional primária.

### Atualização do Tailwind Config

```ts
// tailwind.config.ts — configuração recomendada para FiscalizaPay
colors: {
  primary: "#22D3EE",           // interface principal
  "primary-neon": "#11DFF2",    // efeitos especiais Oraculum
  "primary-dark": "#0891B2",    // pressed / hover escuro
}
```

---

## 1. Conceito da Identidade

A identidade visual do **Oraculum** deve transmitir:

- Inteligência
- Tecnologia
- Blockchain
- Smart contracts
- Segurança
- Rastreabilidade
- Observabilidade
- Confiança automatizada
- Precisão técnica

O conceito central da marca é:

> **Inteligência, rastreabilidade e confiança automatizada.**

A logo utiliza um símbolo de olho tecnológico conectado a uma estrutura de rede, representando um **oracle inteligente**, capaz de observar, validar e conectar dados reais a contratos inteligentes.

---

## 2. Direção Visual

O sistema deve seguir uma estética:

- Dark mode nativo
- Clean e técnico
- Premium e futurista
- Pouco uso de degradê
- Cores sólidas
- Alto contraste
- Bordas discretas
- Glow sutil apenas em elementos de destaque
- Layout organizado e objetivo

Evitar:

- Excesso de cores vibrantes
- Degradês fortes
- Fundos muito poluídos
- Sombras exageradas
- Cards com excesso de informação
- Elementos visuais muito coloridos ao mesmo tempo

---

## 3. Paleta Principal

### Brand Colors

| Nome | Hex | Uso principal |
|---|---:|---|
| Oraculum Cyan | `#11DFF2` | Cor principal da marca, botões, links ativos, ícones e foco |
| Deep Cyan | `#0BB8C8` | Hover, pressed state e variações da cor principal |
| Soft Cyan | `#7AEFF8` | Highlights, badges suaves, detalhes e linhas de apoio |

### Regra de uso

A cor `#11DFF2` deve ser a assinatura visual da marca. Use com intenção, principalmente em elementos interativos ou pontos importantes da interface.

---

## 4. Paleta Dark / Base do Sistema

| Nome | Hex | Uso principal |
|---|---:|---|
| Midnight Navy | `#050816` | Fundo principal da aplicação |
| Deep Space | `#0A1020` | Sidebar, topbar, seções e áreas secundárias |
| Graphite Blue | `#10192B` | Cards, inputs, modais e containers |
| Steel Night | `#162238` | Hover de cards, item ativo e superfícies elevadas |
| Slate Tech | `#22314A` | Bordas, divisórias, tabelas e contornos |

---

## 5. Cores de Texto

| Nome | Hex | Uso principal |
|---|---:|---|
| Ice White | `#EAF7FA` | Títulos e textos principais |
| Cool Gray | `#A9BCD0` | Subtítulos, labels e textos de apoio |
| Muted Blue Gray | `#6E8099` | Placeholders, legendas e textos menos prioritários |

### Hierarquia recomendada

- Títulos: `#EAF7FA`
- Texto comum: `#A9BCD0`
- Texto auxiliar: `#6E8099`
- Links: `#11DFF2`

---

## 6. Cores de Status

| Nome | Hex | Significado |
|---|---:|---|
| Proof Green | `#22C55E` | Validado, aprovado, contrato executado, pagamento liberado |
| Signal Amber | `#F4B740` | Pendente, em análise, alerta de compliance |
| Alert Red | `#EF4444` | Erro, falha, inconsistência ou reprovação |
| Oracle Blue | `#3B82F6` | Informação, dados analíticos, rastreabilidade e insights |

### Aplicação no contexto do sistema

- **Verde:** validação concluída, evidência aprovada, smart contract liberado.
- **Âmbar:** aguardando análise, documentação pendente, checkpoint incompleto.
- **Vermelho:** divergência, reprovação, erro de integração, falha de regra.
- **Azul:** informações, relatórios, trilhas de auditoria e dados complementares.

---

## 7. CSS Variables

Use estas variáveis como base global do frontend:

```css
:root {
  /* Brand */
  --color-primary: #11DFF2;
  --color-primary-dark: #0BB8C8;
  --color-primary-soft: #7AEFF8;

  /* Backgrounds */
  --color-bg-main: #050816;
  --color-bg-secondary: #0A1020;
  --color-surface: #10192B;
  --color-surface-hover: #162238;
  --color-border: #22314A;

  /* Text */
  --color-text-primary: #EAF7FA;
  --color-text-secondary: #A9BCD0;
  --color-text-muted: #6E8099;

  /* Status */
  --color-success: #22C55E;
  --color-warning: #F4B740;
  --color-error: #EF4444;
  --color-info: #3B82F6;
}
```

---

## 8. Tailwind CSS Theme Suggestion

Caso o projeto utilize Tailwind, adicione a base no `tailwind.config.ts`:

```ts
export default {
  theme: {
    extend: {
      colors: {
        oraculum: {
          primary: '#11DFF2',
          primaryDark: '#0BB8C8',
          primarySoft: '#7AEFF8',
          bg: '#050816',
          bgSecondary: '#0A1020',
          surface: '#10192B',
          surfaceHover: '#162238',
          border: '#22314A',
          text: '#EAF7FA',
          textSecondary: '#A9BCD0',
          textMuted: '#6E8099',
          success: '#22C55E',
          warning: '#F4B740',
          error: '#EF4444',
          info: '#3B82F6',
        },
      },
    },
  },
};
```

---

## 9. Componentes Visuais

### Botão Primário

Uso: ações principais, salvar, confirmar, criar, executar validação.

```css
.button-primary {
  background: #11DFF2;
  color: #050816;
  border: 1px solid #11DFF2;
}

.button-primary:hover {
  background: #0BB8C8;
  border-color: #0BB8C8;
}
```

Recomendação visual:

- Canto arredondado: `10px` a `14px`
- Fonte semibold
- Sem degradê
- Glow sutil apenas no hover

---

### Botão Secundário

Uso: ações alternativas, cancelar, visualizar, voltar.

```css
.button-secondary {
  background: transparent;
  color: #EAF7FA;
  border: 1px solid #22314A;
}

.button-secondary:hover {
  background: #162238;
}
```

---

### Cards

Uso: métricas, tarefas, contratos, checkpoints, status de auditoria.

```css
.card {
  background: #10192B;
  border: 1px solid #22314A;
  color: #EAF7FA;
  border-radius: 16px;
}

.card:hover {
  background: #162238;
}
```

Recomendação:

- Cards devem ter respiro visual.
- Usar bordas finas.
- Evitar sombras pesadas.
- Utilizar ícones em `#11DFF2` apenas nos pontos principais.

---

### Inputs

```css
.input {
  background: #10192B;
  border: 1px solid #22314A;
  color: #EAF7FA;
}

.input::placeholder {
  color: #6E8099;
}

.input:focus {
  border-color: #11DFF2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(17, 223, 242, 0.12);
}
```

---

### Sidebar

A sidebar deve passar sensação de produto profissional e sistema robusto.

| Elemento | Cor |
|---|---:|
| Fundo | `#0A1020` |
| Item normal | `#A9BCD0` |
| Item ativo | `#EAF7FA` |
| Fundo item ativo | `#162238` |
| Indicador ativo | `#11DFF2` |
| Borda lateral | `#22314A` |

---

### Topbar

| Elemento | Cor |
|---|---:|
| Fundo | `#0A1020` |
| Borda inferior | `#22314A` |
| Texto principal | `#EAF7FA` |
| Texto secundário | `#A9BCD0` |
| Ícones ativos | `#11DFF2` |

---

## 10. Badges e Status

### Validado

```css
.badge-success {
  background: rgba(34, 197, 94, 0.12);
  color: #22C55E;
  border: 1px solid rgba(34, 197, 94, 0.28);
}
```

### Pendente

```css
.badge-warning {
  background: rgba(244, 183, 64, 0.12);
  color: #F4B740;
  border: 1px solid rgba(244, 183, 64, 0.28);
}
```

### Erro

```css
.badge-error {
  background: rgba(239, 68, 68, 0.12);
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.28);
}
```

### Informação

```css
.badge-info {
  background: rgba(59, 130, 246, 0.12);
  color: #3B82F6;
  border: 1px solid rgba(59, 130, 246, 0.28);
}
```

---

## 11. Tipografia

### Estilo recomendado

Usar fontes modernas, geométricas e legíveis.

Sugestões:

- **Inter** — recomendada para sistema web
- **Sora** — ótima para títulos e estética tech
- **Manrope** — profissional, moderna e limpa
- **Space Grotesk** — boa para headings Web3

### Combinação recomendada

- Títulos: `Sora` ou `Space Grotesk`
- Corpo: `Inter`

### Escala sugerida

| Uso | Tamanho | Peso |
|---|---:|---:|
| H1 | 40px–48px | 700 |
| H2 | 32px–36px | 700 |
| H3 | 24px–28px | 600 |
| Body | 16px | 400 |
| Small | 14px | 400 |
| Caption | 12px | 400 |

---

## 12. Layout

### Espaçamento

Usar grid consistente com múltiplos de 4:

- 4px
- 8px
- 12px
- 16px
- 24px
- 32px
- 48px
- 64px

### Bordas

| Elemento | Radius recomendado |
|---|---:|
| Botões | 10px–14px |
| Inputs | 10px–12px |
| Cards | 16px–20px |
| Modais | 20px–24px |
| Badges | 999px |

---

## 13. Aplicação por Página

### Dashboard

- Fundo principal: `#050816`
- Cards: `#10192B`
- Bordas: `#22314A`
- Métricas principais: `#EAF7FA`
- Ícones de destaque: `#11DFF2`
- Status de progresso: `#22C55E` ou `#F4B740`

### Página de Contratos

- Contratos aprovados: `#22C55E`
- Contratos pendentes: `#F4B740`
- Contratos com inconsistência: `#EF4444`
- Hash, ID, wallet e dados blockchain: `#3B82F6`

### Página de Auditoria

- Linhas de timeline: `#22314A`
- Eventos importantes: `#11DFF2`
- Evidências aprovadas: `#22C55E`
- Falhas de validação: `#EF4444`

### Página de Smart Contracts

- Estado ativo: `#11DFF2`
- Executado: `#22C55E`
- Aguardando condição: `#F4B740`
- Falha de execução: `#EF4444`

---

## 14. Regras de Consistência

1. Usar `#11DFF2` como cor principal da marca.
2. Evitar múltiplas cores fortes no mesmo componente.
3. Priorizar contraste e legibilidade.
4. Usar status colors apenas para significado funcional.
5. Evitar degradês fortes.
6. Usar glow apenas de forma sutil.
7. Manter a interface limpa, técnica e organizada.
8. Toda ação importante deve ter feedback visual claro.
9. Cards devem ter borda discreta e fundo escuro sólido.
10. O sistema deve parecer confiável, não apenas futurista.

---

## 15. Exemplo de Classe Base Global

```css
body {
  background: #050816;
  color: #EAF7FA;
  font-family: 'Inter', sans-serif;
}

.oraculum-glow {
  box-shadow: 0 0 24px rgba(17, 223, 242, 0.12);
}

.oraculum-border {
  border: 1px solid #22314A;
}

.oraculum-surface {
  background: #10192B;
  border: 1px solid #22314A;
  border-radius: 16px;
}
```

---

## 16. Resumo Final

A identidade do **Oraculum** deve ser construída em torno de uma interface escura, precisa e tecnológica, com o ciano sólido como assinatura visual principal.

A experiência deve comunicar que o sistema é:

- Seguro
- Inteligente
- Rastreável
- Profissional
- Automatizado
- Confiável
- Conectado ao universo Web3

> O Oraculum não deve parecer apenas um sistema bonito. Ele deve parecer uma plataforma capaz de observar, validar e executar regras com confiança.
