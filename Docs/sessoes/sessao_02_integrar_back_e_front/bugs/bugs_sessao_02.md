# Bugs - Sessao 02

Data: 2026-06-08

## Resumo

O teste ponta a ponta do Bloco 12 encontrou um bug P2 no frontend. O bug foi corrigido antes do fechamento da Sessao 02.

Nao ha bugs P1 ou P2 pendentes.

## Bugs Corrigidos

| ID | Prioridade | Status | Descricao | Evidencia | Correcao |
| --- | --- | --- | --- | --- | --- |
| B-S02-001 | P2 | Corrigido | Queries protegidas podiam disparar antes da hidratacao da auth store em modo API real, causando 401 prematuro e risco de limpeza da sessao. | Feedbacks anteriores ja registravam risco de corrida de hidratacao; leitura do codigo confirmou hooks protegidos sem `enabled` condicionado ao token. | Commit `ba36dea fix: aguardar sessao antes de queries protegidas`. |

## Bugs Pendentes

Nenhum bug P1 ou P2 pendente identificado.

## Ressalvas Nao Bloqueantes

| Item | Classificacao | Descricao |
| --- | --- | --- |
| R-S02-001 | Ressalva de ambiente | `http://localhost:3000` estava ocupado por outro app local. FiscalizaPay foi validado em `http://localhost:3001`. |
| R-S02-002 | Ressalva de validacao | Login real foi validado criptograficamente via API com carteiras EVM efemeras, mas sem automacao de extensao de wallet no navegador. |
| R-S02-003 | Ressalva de configuracao local | `web/.env.local` local esta com `NEXT_PUBLIC_USE_MOCKS=true`; os testes reais usaram override para `false`. |
