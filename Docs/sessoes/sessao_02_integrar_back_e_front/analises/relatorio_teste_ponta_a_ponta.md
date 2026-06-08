# Relatorio de Teste Ponta a Ponta - Sessao 02

Data: 2026-06-08

## 1. Resumo Executivo

Foi executado o teste ponta a ponta da integracao local entre backend e frontend do FiscalizaPay.

O fluxo real foi validado principalmente contra a API em `NEXT_PUBLIC_USE_MOCKS=false`, usando carteiras EVM efemeras criadas apenas em memoria durante o teste. O roteiro cobriu login por nonce e assinatura, JWT, `/auth/me`, contratos reais, actions reais, timeline, auditoria, erros principais e blockchain indisponivel.

Durante a pre-analise foi encontrado um bug transversal em queries protegidas do frontend: algumas leituras podiam disparar antes da hidratacao da sessao em modo API real. O bug foi corrigido no commit `ba36dea fix: aguardar sessao antes de queries protegidas`.

Nao foram encontrados bugs P1 pendentes.

## 2. Resultado Final

Classificacao:

```txt
APROVADO COM RESSALVAS
```

Pode avancar para Sessao 03?

```txt
Sim, com ressalvas
```

Ressalvas:

- A validacao criptografica do login real foi feita por API com carteiras EVM efemeras, assinando exatamente `data.message` retornado por `/auth/nonce`; nao foi dirigida uma extensao de wallet no navegador por automacao.
- `http://localhost:3000` estava ocupado por outro app local, identificado por conteudo `/lk/...`; o FiscalizaPay estava disponivel em `http://localhost:3001` via `next dev`.
- `web/.env.local` local esta com `NEXT_PUBLIC_USE_MOCKS=true`; os comandos de teste real sobrescreveram a variavel para `false` sem alterar nem commitar `.env.local`.

## 3. Ambiente Testado

- Backend: `http://127.0.0.1:8000`
- Frontend oficial esperado: `http://localhost:3000`
- Frontend FiscalizaPay disponivel no teste: `http://localhost:3001`
- Banco: PostgreSQL via Docker Compose
- API: container `fiscalizapay-api`
- DB: container `fiscalizapay-db`
- Data do teste: 2026-06-08

## 4. Variaveis de Ambiente Utilizadas

Frontend usado nos comandos reais:

```txt
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_EXPLORER_URL=https://amoy.polygonscan.com
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

Mock mode tambem foi validado por build com:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

Backend relevante:

```txt
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS=
CHAIN_ID=80002
EXPLORER_URL=https://amoy.polygonscan.com
```

Observacao: segredos do container, JWTs, assinaturas e chaves privadas nao foram registrados neste relatorio.

## 5. Comandos Executados

```txt
git status --short --untracked-files=all
docker compose config
docker compose up -d --build
docker compose ps
docker compose exec -T api alembic current
docker compose exec -T api python -m scripts.seed_demo_profiles
GET http://127.0.0.1:8000/health
npm run lint
NEXT_PUBLIC_USE_MOCKS=false npm run build
NEXT_PUBLIC_USE_MOCKS=true npm run build
npm run dev
GET http://localhost:3001/
GET http://localhost:3001/dashboard
GET http://localhost:3001/contracts
GET http://localhost:3001/contracts/new
GET http://localhost:3001/audit
GET http://localhost:3001/disputes
```

Tambem foi executado script E2E real contra a API, sem persistir tokens ou material de assinatura.

## 6. Fluxo de Autenticacao

Foram criadas carteiras EVM efemeras em memoria para os papeis:

- `GESTOR`
- `FORNECEDOR`
- `FORNECEDOR` adicional para teste de wallet errada
- `ENTREGADOR`
- `FISCAL`
- `AUDITOR`

Resultados:

| Item | Resultado |
| --- | --- |
| `GET /auth/nonce` | `200` para todos os papeis |
| `data.nonce` | presente |
| `data.message` | presente |
| `data.expiresAt` | presente |
| assinatura de `data.message` | OK |
| `POST /auth/verify` | `200` para todos os papeis |
| `data.accessToken` | presente |
| `data.tokenType` | `bearer` |
| `data.expiresAt` | presente |
| `data.profile` | presente |

A assinatura foi feita exatamente sobre o `data.message` retornado por `/auth/nonce`.

## 7. Validacao de Authorization Bearer

Requests protegidas com token valido retornaram sucesso.

Requests protegidas sem token ou com token invalido retornaram `401`:

- `/auth/me`
- `/contracts`
- `/contracts/{id}/events`
- `/audit/events`
- `/contracts/{id}/blockchain-status`
- `/contracts/{id}/register-on-chain`

`/auth/nonce` e `/auth/verify` permaneceram publicos.

## 8. Validacao de /auth/me

| Cenario | Resultado |
| --- | --- |
| token valido | `200` |
| sem token | `401` |
| token invalido | `401` |
| role real carregada | `GESTOR` |
| wallet real carregada | OK |
| profile real corresponde a wallet autenticada | OK |

## 9. Validacao de Profile Real em Modo API

Com `NEXT_PUBLIC_USE_MOCKS=false`, o codigo usa `useCurrentProfile()` a partir da auth store, alimentada por `/auth/me`, sem fallback para perfil demo.

Foi corrigido no Bloco 12 o risco de queries protegidas dispararem antes da hidratacao da sessao.

`ProfileSwitcher` nao renderiza em modo API real (`env.useMocks=false`) e permanece disponivel em mock mode.

## 10. Validacao de Contratos

| Cenario | Resultado |
| --- | --- |
| `GET /contracts` com token valido | `200` |
| `GET /contracts` com token de fornecedor | `200` |
| `GET /contracts` sem token | `401` |
| `GET /contracts` token invalido | `401` |
| `POST /contracts` payload valido | `201` |
| contrato criado aparece na listagem | OK |
| `GET /contracts/{id}` valido | `200` |
| `GET /contracts/{id}` inexistente | `404` |
| payload invalido em criacao | `400 VALIDATION_ERROR` |
| criacao por role sem permissao | `403 UNAUTHORIZED_ROLE` |

## 11. Validacao de Actions

Actions principais executadas com sucesso:

| Action | Resultado |
| --- | --- |
| `confirm-shipment` | `200` |
| `confirm-delivery` | `200` |
| `validate-receipt` | `200` |
| `authorize-payment` | `200` |
| `open-dispute` | `200`, contrato em `DISPUTA` |
| `simulate-fraud` | `200`, `fraudDetected=true` |

Fluxo principal do contrato de prova:

```txt
CRIADO -> ENVIADO -> ENTREGUE -> VALIDADO -> PAGAMENTO_AUTORIZADO
```

Erros de actions validados:

| Cenario | Resultado |
| --- | --- |
| action em status invalido | `422 INVALID_STATUS_TRANSITION` |
| action com wallet vinculada incorreta | `403 UNAUTHORIZED_ROLE` |
| action com role incorreta | `403 UNAUTHORIZED_ROLE` |

## 12. Validacao de Timeline

| Cenario | Resultado |
| --- | --- |
| `GET /contracts/{id}/events` token valido | `200` |
| eventos iniciais | 1 |
| eventos apos actions principais | 5 |
| ordem cronologica | OK |
| timeline atualizada apos actions | OK |
| sem token | `401` |
| token invalido | `401` |
| contrato inexistente | `404` |
| `transactionHash` fake em modo real | nao encontrado |

Eventos do fluxo principal:

```txt
CONTRATO_CRIADO
ENVIO_CONFIRMADO
ENTREGA_CONFIRMADA
RECEBIMENTO_VALIDADO
PAGAMENTO_AUTORIZADO
```

## 13. Validacao de Auditoria

| Cenario | Resultado |
| --- | --- |
| `GET /audit/events` token valido | `200` |
| total observado no teste | 18 eventos |
| eventos do contrato principal | 5 |
| eventos do contrato em disputa | 2 |
| eventos do contrato com fraude | 3 |
| ordenacao decrescente | OK |
| sem token | `401` |
| token invalido | `401` |
| fornecedor autenticado | `200` |

Observacao: na versao atual do backend, auditoria exige autenticacao, mas nao possui restricao por role. Por isso, `403` nao e aplicavel a `GET /audit/events` hoje.

## 14. Validacao de Blockchain Indisponivel

| Cenario | Resultado |
| --- | --- |
| `GET /contracts/{id}/blockchain-status` | `200` |
| `blockchainAvailable` | `false` |
| `registeredOnChain` | `false` |
| `transactionHash` real | ausente |
| sem token | `401` |
| token invalido | `401` |
| contrato inexistente | `404` |
| `POST /register-on-chain` gestor | `503 BLOCKCHAIN_UNAVAILABLE` |
| `POST /register-on-chain` auditor | `403 UNAUTHORIZED_ROLE` |
| `POST /register-on-chain` sem token | `401` |
| `POST /register-on-chain` token invalido | `401` |
| `POST /register-on-chain` contrato inexistente | `404` |

Blockchain indisponivel nao bloqueou o fluxo principal.

## 15. Validacao de Mock Mode

Mock mode foi validado por build:

```txt
NEXT_PUBLIC_USE_MOCKS=true npm run build
```

Resultado: OK.

Por leitura de codigo, mock mode preserva:

- perfil demo
- `ProfileSwitcher`
- contratos mockados
- actions mockadas
- eventos/timeline mockados
- auditoria mockada
- simulacao blockchain mockada

## 16. Testes de Erro 401/403/404

| Tipo | Cenarios validados |
| --- | --- |
| `401` | `/auth/me`, `/contracts`, `/events`, `/audit/events`, `/blockchain-status`, `/register-on-chain` sem token ou token invalido |
| `403` | criacao de contrato com fornecedor, action com role errada, action com wallet errada, register-on-chain com auditor |
| `404` | contrato inexistente, eventos de contrato inexistente, blockchain status de contrato inexistente, register-on-chain de contrato inexistente |
| `400` | payload invalido em criacao |
| `422` | action em status invalido |
| `503` | blockchain indisponivel |
| network error | simulada chamada para `http://127.0.0.1:8999/health` com erro de conexao |

## 17. Evidencias

Evidencias principais:

- `docker compose ps`: API ativa e DB healthy.
- `GET /health`: `status=ok`.
- `alembic current`: `0001_initial_schema (head)`.
- `seed_demo_profiles`: perfis demo ja existentes.
- `npm run lint`: OK.
- build real e build mock: OK.
- rotas frontend em `localhost:3001`: `/`, `/dashboard`, `/contracts`, `/contracts/new`, `/audit`, `/disputes` retornaram HTTP 200.
- script E2E real: status final `ok`.

Nao foram salvos JWTs, assinaturas, private keys, mnemonics ou seeds.

## 18. Bugs Encontrados

| ID | Prioridade | Status | Descricao |
| --- | --- | --- | --- |
| B-S02-001 | P2 | Corrigido | Queries protegidas podiam disparar antes da hidratacao da auth store em modo API real, causando 401 prematuro e risco de limpeza da sessao. |

## 19. Bugs Corrigidos

Bug B-S02-001 corrigido no commit:

```txt
ba36dea fix: aguardar sessao antes de queries protegidas
```

A correcao adicionou `useProtectedQueryEnabled()` e aplicou o bloqueio em:

- contratos
- detalhe de contrato
- dashboard summary
- eventos de contrato
- auditoria
- blockchain status

## 20. Bugs Pendentes

Nao ha bugs P1 ou P2 pendentes identificados no teste.

Nao foi criado bloqueio para Sessao 03.

## 21. Riscos Restantes

- Validacao visual com extensao de wallet real nao foi automatizada.
- `localhost:3000` estava ocupado por outro app local; FiscalizaPay foi validado em `localhost:3001`.
- A Sessao 03 deve revisar variaveis de ambiente para staging/producao, especialmente `NEXT_PUBLIC_USE_MOCKS=false`.
- Blockchain real permanece fora de escopo e deve continuar desabilitada ate existir contrato real.

## 22. Recomendacao Final

Recomendacao:

```txt
Avancar para Sessao 03 - Sim, com ressalvas
```

Ressalvas nao bloqueantes:

- executar validacao manual com wallet/browser quando a porta oficial estiver livre;
- garantir `NEXT_PUBLIC_USE_MOCKS=false` nos ambientes de staging/producao;
- manter blockchain real fora do deploy ate haver contrato configurado.

## 23. Conclusao

A Sessao 02 esta pronta para avancar para a Sessao 03 com ressalvas documentadas.

O fluxo principal real funciona: autenticacao, JWT, Bearer, `/auth/me`, contratos, actions, timeline, auditoria e tratamento de blockchain indisponivel.

Nao existem bugs P1 pendentes.
