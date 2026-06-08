# Wallets Mockadas — Bloco 07

## 1. Resumo Executivo

O Bloco 07 mapeou todas as wallets mockadas/demo do projeto FiscalizaPay (frontend,
backend, seed e documentação) e corrigiu os endereços que não seguiam o padrão EVM
exigido (`^0x[a-fA-F0-9]{40}$`).

O backend (`backend/scripts/seed_demo_profiles.py`) já utilizava endereços válidos no
padrão `0x1111...1111`, `0x2222...2222`, etc., e possui validação própria de wallet em
`backend/app/security.py` (`WALLET_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")`). Esses
endereços do seed foram adotados como **fonte oficial** e o frontend foi alinhado a eles
por role — eliminando endereços inválidos como `0xLogistica...`, `0xAuditor...`,
`0xdeadbeef...` (com tamanho incorreto) e um perfil sem wallet (`undefined`).

O modo mock foi preservado integralmente: nenhuma lógica de exibição, seleção de perfil
ou simulação de blockchain foi alterada — apenas os valores de string das wallets.

## 2. Locais Analisados

```txt
Frontend:
- web/src/shared/mocks/profiles.mock.ts
- web/src/shared/mocks/contracts.mock.ts
- web/src/shared/mocks/contract-events.mock.ts
- web/src/shared/mocks/blockchain.mock.ts
- web/src/shared/mocks/dashboard.mock.ts
- web/src/shared/mocks/mock-store.ts / mock-errors.ts / index.ts
- web/src/entities/wallet/model/store.ts
- web/src/entities/profile/model/store.ts (DEMO_PROFILES)
- web/src/entities/profile/model/types.ts
- web/src/shared/lib/formatters.ts (shortenAddress — apenas formatação, sem valores fixos)
- web/src/entities/wallet/ui/* e web/src/features/wallet-connect/ui/* (apenas consomem o store)
- web/README.md

Backend:
- backend/scripts/seed_demo_profiles.py
- backend/scripts/create_profile.py
- backend/app/security.py (normalize_wallet / WALLET_RE)
- backend/app/models.py (UserRole)
- backend/FRONTEND_ALIGNMENT.md
- backend/README.md
- backend/DEPLOY_LINUX_DOCKER.md

Documentação/Docs:
- Docs/analises/Frontend_explain.md
- Docs/analises/Backend_explain.md
- Docs/Demo/demo_dataset.md
- Docs/Demo/demo_execution_guide.md
- Docs/Contratos_tecnicos/contrato_api_frontend_backend.md
- Docs/Feedback_chat/feedback_bloco_4_frontend_domain_models.md
- Docs/Feedback_chat/feedback_bloco_16_frontend_wallet_profile.md
- Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/validacao_docker_migrations_seed.md
- Docs/sessoes/sessao_01_saneamento_backend_frontend/Blocos/bloco_07_correcao_wallets_mockadas.md
- Docs/sessoes/sessao_01_saneamento_backend_frontend/planejamento_sessao_01_saneamento_backend_frontend.md
```

Buscas realizadas (regex/termos): `0x[a-zA-Z0-9]{6,}`, `wallet`, `walletAddress`,
`wallet_address`, `publicAddress`, `address`, `account`, `demo`, `mock`, `profile`,
`perfil`, `GESTOR`, `FISCAL`, `AUDITOR`, `FORNECEDOR`, `ENTREGADOR`.

Não foram encontrados diretórios de testes automatizados, fixtures dedicadas ou
scripts adicionais de seed além dos listados acima (`find`/`grep` por `*test*`,
`*spec*`, `*fixture*` não retornaram arquivos no frontend; no backend só existe
`seed_demo_profiles.py`).

## 3. Wallets Encontradas

| Perfil | Wallet anterior | Status | Wallet final |
|---|---|---|---|
| GESTOR — `web/src/entities/profile/model/store.ts` (Maria Santos) | `0xdeadbeef12345678901234567890abcdef123456` | Válida no formato (40 hex), mas divergente do backend | `0x1111111111111111111111111111111111111111` |
| FORNECEDOR — `web/src/entities/profile/model/store.ts` (Carlos Silva) | `0x742d35Cc6634C0532925a3b8D4C9C351234abcd` | **Inválida** — 39 caracteres (faltava 1 hex) | `0x2222222222222222222222222222222222222222` |
| ENTREGADOR — `web/src/entities/profile/model/store.ts` (João Logística) | `0xlogistica000000000000000000000000001234` | **Inválida** — contém letras fora de a-f (`l,o,g,i,s,t,c`) | `0x3333333333333333333333333333333333333333` |
| FISCAL — `web/src/entities/profile/model/store.ts` (Ana Fischer) | `0x1234abcdef000000000000000000000000005678` | Válida no formato (40 hex), mas divergente do backend | `0x4444444444444444444444444444444444444444` |
| AUDITOR — `web/src/entities/profile/model/store.ts` (Roberto Auditor) | `undefined` (não encontrado / ausente) | **Inválida** — campo de wallet ausente | `0x5555555555555555555555555555555555555555` |
| GESTOR — `web/src/shared/mocks/profiles.mock.ts` (Maria Santos) | `0xDeadBeef1234567890abcdef1234567890DeaD01` | Válida no formato (40 hex), mas divergente do backend | `0x1111111111111111111111111111111111111111` |
| FORNECEDOR — `web/src/shared/mocks/profiles.mock.ts` (Carlos Rodrigues) | `0x742d35Cc6634C0532925a3b8D4C9C3500000002` | **Inválida** — 39 caracteres (faltava 1 hex) | `0x2222222222222222222222222222222222222222` |
| ENTREGADOR — `web/src/shared/mocks/profiles.mock.ts` (Ricardo Alves) | `0xLogistica1234567890abcdef1234567890000003` | **Inválida** — contém letras fora de a-f (`L,o,g,i,s,t,c`) | `0x3333333333333333333333333333333333333333` |
| FISCAL — `web/src/shared/mocks/profiles.mock.ts` (João Silva) | `0x1234abcd5678ef901234abcd5678ef9012340004` | Válida no formato (40 hex), mas divergente do backend | `0x4444444444444444444444444444444444444444` |
| AUDITOR — `web/src/shared/mocks/profiles.mock.ts` (Ana Ferreira) | `0xAuditor1234567890abcdef1234567890AudiT05` | **Inválida** — contém letras fora de a-f (`A...u,i,t,o,r,T`) | `0x5555555555555555555555555555555555555555` |
| GESTOR — `web/src/shared/mocks/contracts.mock.ts` (`managerWallet`, 6 contratos) | `0xDeadBeef1234567890abcdef1234567890DeaD01` | Válida no formato, mas divergente | `0x1111111111111111111111111111111111111111` |
| FORNECEDOR — `web/src/shared/mocks/contracts.mock.ts` (`supplierWallet`, 6 contratos) | `0x742d35Cc6634C0532925a3b8D4C9C3500000002` | **Inválida** — 39 caracteres | `0x2222222222222222222222222222222222222222` |
| ENTREGADOR — `web/src/shared/mocks/contracts.mock.ts` (`logisticsWallet`, 6 contratos) | `0xLogistica1234567890abcdef1234567890000003` | **Inválida** — letras fora de a-f | `0x3333333333333333333333333333333333333333` |
| FISCAL — `web/src/shared/mocks/contracts.mock.ts` (`inspectorWallet`, 6 contratos) | `0x1234abcd5678ef901234abcd5678ef9012340004` | Válida no formato, mas divergente | `0x4444444444444444444444444444444444444444` |
| GESTOR/FORNECEDOR/ENTREGADOR/FISCAL — `web/src/shared/mocks/contract-events.mock.ts` (constantes `*_WALLET`) | idênticas às de `profiles.mock.ts` acima | Mesma situação (inválidas/divergentes) | mesmos endereços oficiais por role |
| AUDITOR — `web/src/shared/mocks/contract-events.mock.ts` (Ana Ferreira, eventos `FRAUDE_SIMULADA`/`DISPUTA_ABERTA`) | `0xAuditor1234567890abcdef1234567890AudiT05` (literal repetido 2x) | **Inválida** — letras fora de a-f | `0x5555555555555555555555555555555555555555` (extraído para constante `AUDITOR_WALLET`) |
| Wallet conectada (demo) — `web/src/entities/wallet/model/store.ts` (`MOCK_WALLET.address`) | `0x8A4D35Cc6634C0532925a3b8D4C9C351234F92B` | **Inválida** — 39 caracteres (faltava 1 hex) | `0x8888888888888888888888888888888888888888` |
| GESTOR — `backend/scripts/seed_demo_profiles.py` (Maria Santos) | `0x1111111111111111111111111111111111111111` | Válida (já era o padrão oficial) | mantida |
| FORNECEDOR — `backend/scripts/seed_demo_profiles.py` (Carlos Silva) | `0x2222222222222222222222222222222222222222` | Válida (já era o padrão oficial) | mantida |
| ENTREGADOR — `backend/scripts/seed_demo_profiles.py` (João Logística) | `0x3333333333333333333333333333333333333333` | Válida (já era o padrão oficial) | mantida |
| FISCAL — `backend/scripts/seed_demo_profiles.py` (Ana Fiscal) | `0x4444444444444444444444444444444444444444` | Válida (já era o padrão oficial) | mantida |
| AUDITOR — `backend/scripts/seed_demo_profiles.py` (Roberto Auditor) | `0x5555555555555555555555555555555555555555` | Válida (já era o padrão oficial) | mantida |

> Observação: o repositório possui **dois conjuntos** de perfis demo no frontend —
> `DEMO_PROFILES` (`entities/profile/model/store.ts`, usado no seletor de perfil/“modo
> demo”) e `mockProfiles` (`shared/mocks/profiles.mock.ts`, usado em listagens/cards de
> contratos). Os nomes de cada conjunto são diferentes entre si (ex.: GESTOR aparece como
> "Maria Santos" nos dois, mas FISCAL aparece como "Ana Fischer" em um e "João Silva" no
> outro). Isso já existia antes deste bloco e não foi alterado — não havia necessidade de
> unificá-los para corrigir o formato das wallets — mas a wallet de cada role agora é a
> **mesma** nos dois conjuntos e idêntica à do backend (ver seção 7/Pendências, item P3).

## 4. Correções Realizadas

1. Substituição de todas as wallets inválidas/divergentes por endereços oficiais no
   formato `0x` + 40 caracteres hexadecimais, usando como referência os valores já
   válidos do seed backend (`0x1111...1111` … `0x5555...5555`).
2. Alinhamento 1:1 entre frontend e backend: cada role (GESTOR, FORNECEDOR, ENTREGADOR,
   FISCAL, AUDITOR) passa a usar exatamente a mesma wallet nos dois lados.
3. Preenchimento da wallet ausente (`undefined`) do perfil demo AUDITOR em
   `entities/profile/model/store.ts`.
4. Extração de uma constante `AUDITOR_WALLET`/`AUDITOR_NAME` em
   `contract-events.mock.ts`, seguindo o mesmo padrão já usado para os demais roles
   nesse arquivo (eliminando o literal inválido duplicado).
5. Correção da wallet "conectada" simulada (`MOCK_WALLET.address`, usada pelo botão
   "Conectar wallet (demo)"), que tinha 39 caracteres, para um endereço válido de 40
   caracteres hexadecimais, claramente demo (`0x8888...8888`).
6. Atualização das referências de documentação que citavam os valores antigos/truncados:
   - `web/README.md` e `Docs/Demo/demo_execution_guide.md` — endereço da wallet
     conectada simulada (`0x8A4D35...F92B` → `0x8888...8888`);
   - `Docs/Demo/demo_dataset.md` — tabela de perfis (linhas 11-15) e referência ao
     "Auditor registrado" (linha 148), agora com os endereços oficiais completos;
   - `backend/FRONTEND_ALIGNMENT.md` e `Docs/analises/Frontend_explain.md` — adicionada
     nota de resolução ("Atualização Bloco 07") nos itens que listavam
     `0xLogistica...`/`0xAuditor...`/`walletAddress: undefined` como problema,
     apontando para este arquivo de análise como referência atualizada.

Nenhuma lógica de negócio, endpoint, regra de permissão, migration ou fluxo de
autenticação foi alterado — apenas valores de string de endereços de wallet e a
documentação correspondente.

## 5. Wallets Oficiais Demo

| Perfil | Role | Wallet Demo |
|---|---|---|
| Maria Santos | GESTOR | `0x1111111111111111111111111111111111111111` |
| Carlos Silva / Carlos Rodrigues | FORNECEDOR | `0x2222222222222222222222222222222222222222` |
| João Logística / Ricardo Alves | ENTREGADOR | `0x3333333333333333333333333333333333333333` |
| Ana Fischer / João Silva (Fiscal) | FISCAL | `0x4444444444444444444444444444444444444444` |
| Roberto Auditor / Ana Ferreira | AUDITOR | `0x5555555555555555555555555555555555555555` |
| Wallet "conectada" simulada (demo, sem perfil associado) | — | `0x8888888888888888888888888888888888888888` |

> Endereços puramente fictícios para uso em ambiente demo/mock. Não possuem fundos,
> não correspondem a chaves privadas reais e não devem ser usados em produção ou
> testnet com saldo real.

## 6. Validações Executadas

| Validação | Status | Resultado / Observação |
|---|---|---|
| Conferência manual de cada wallet contra `^0x[a-fA-F0-9]{40}$` | Executado | Todas as wallets demo (frontend, backend, docs) agora têm exatamente 42 caracteres (`0x` + 40 hex) e usam apenas `0-9a-fA-F`. |
| Reuso da validação já existente no backend (`WALLET_RE` em `backend/app/security.py:17` e `normalize_wallet`) | Executado (revisão de código) | Validação já existe e está correta; todos os endereços oficiais passam nela. Não foi necessário criar nova validação. |
| `docker compose ps` (verificação de stack) | Executado | Stack já estava rodando: `fiscalizapay-api` (4h) e `fiscalizapay-db` (healthy, 5h). |
| `docker compose config` | Executado — **OK** | Configuração válida; `cd backend && docker compose config` renderiza o compose final (serviços `api`/`db`, env vars, portas) sem erros. |
| `docker compose exec api python -m scripts.seed_demo_profiles` | Executado — **OK** | Saída: `Já existe: Maria Santos | GESTOR | 0x1111...1111`, `Carlos Silva | FORNECEDOR | 0x2222...2222`, `João Logística | ENTREGADOR | 0x3333...3333`, `Ana Fiscal | FISCAL | 0x4444...4444`, `Roberto Auditor | AUDITOR | 0x5555...5555`. Os 5 perfis oficiais já existem no banco com os endereços oficiais — confirma que o seed roda sem erro e que os endereços usados (idênticos aos agora replicados no frontend) são aceitos pelo backend (passam por `normalize_wallet`/`WALLET_RE`). |
| `GET /health` | Executado — **OK** | `curl http://127.0.0.1:8000/health` → `{"data":{"status":"ok","app":"FiscalizaPay API","environment":"development"}}`. |
| `npm run lint` | Executado — **OK** | `cd web && npm run lint` → ESLint sem erros nem warnings. |
| `npm run build` | Executado — **OK** | `cd web && npm run build` → "Compiled successfully", TypeScript OK, 9 páginas geradas estaticamente (`/`, `/dashboard`, `/contracts`, `/contracts/[id]`, `/contracts/new`, `/audit`, `/disputes`, etc.), sem erros de tipagem. |
| `npm run dev` | Não executado | Motivo: validação interativa de UI requer servidor em foreground/long-running; `npm run build` já cobre compilação, tipagem e geração de todas as rotas estaticamente, e os consumidores de `walletAddress`/`MOCK_WALLET` foram revisados manualmente (nenhum componente depende do valor literal da wallet — apenas de `shortenAddress`/exibição/cópia). Impacto: nenhum, build cobre tipagem/sintaxe/rotas. |
| `pytest` | Não executado | Motivo: não há suíte de testes automatizados no backend (`grep` por `*test*` só retornou o próprio `seed_demo_profiles.py`). Impacto: nenhum. |
| `npm test` | Não executado | Motivo: não há suíte de testes automatizados no frontend (nenhum arquivo `*test*`/`*spec*` localizado). Impacto: nenhum. |

## 7. Pendências

### Exceções confirmadas na busca final (não são wallets — nada a corrigir)

A busca final por `0x[a-zA-Z0-9]{6,}` em todo o projeto retornou também os itens
abaixo, verificados manualmente e confirmados como **não sendo wallets mockadas**:

| Arquivo | Valor encontrado | Motivo de não corrigir | Impacto | Recomendação |
|---|---|---|---|---|
| `web/src/shared/lib/formatters.ts:36` | `"0x742d35Cc6634C0532925a3b8D4C9C35..."` (comentário JSDoc) | Exemplo ilustrativo de truncamento da função `shortenAddress`, com reticências indicando que é um trecho parcial — não é um valor de wallet usado em runtime. | Nenhum | Nenhuma — comentário já deixa claro que é exemplo. |
| `backend/DEPLOY_LINUX_DOCKER.md:240` | `--wallet 0xWALLET_DO_FORNECEDOR` | Placeholder de CLI (`create_profile.py --wallet <endereço>`), não um endereço real ou mock. | Nenhum | Nenhuma. |
| `backend/README.md:161` | `"signature": "0xassinatura"` | Placeholder de exemplo mostrando o formato esperado do campo `signature` (assinatura EVM), não uma wallet. | Nenhum | Nenhuma. |
| `web/src/shared/mocks/blockchain.mock.ts` e `contract-events.mock.ts` (`transactionHash`) | ex.: `"0xa1b2c3d4e5f6789...ff02"` (62 caracteres hex) | São hashes de transação simulados (formato de 32 bytes / 64 hex chars), não endereços de wallet (20 bytes / 40 hex chars). Padrão correto para `transactionHash` no domínio do projeto. | Nenhum | Nenhuma — fora do escopo de wallets (formato correto para tx hash). |
| `web/package-lock.json` | ex.: `0xruhYuzQBt8n71g`, `0x1Kzr4RcWe1edC9PquDRRPx3YVCvQv` | Hashes de integridade (`integrity`) de pacotes npm — coincidência de prefixo `0x` em base64/base62, não relacionados a wallets. | Nenhum | Nenhuma — arquivo gerado automaticamente pelo npm. |

### P2 — Alta prioridade

- **Dois conjuntos de perfis demo no frontend com nomes divergentes por role.**
  `DEMO_PROFILES` (`entities/profile/model/store.ts`) e `mockProfiles`
  (`shared/mocks/profiles.mock.ts`) representam o mesmo conjunto de roles, mas com
  nomes de pessoa diferentes (ex.: FISCAL = "Ana Fischer" em um e "João Silva" no
  outro; FORNECEDOR = "Carlos Silva (ABC Ltda)" vs. "Carlos Rodrigues"). As wallets já
  estão alinhadas (mesma wallet por role nos dois conjuntos e no backend), mas os nomes
  exibidos podem confundir durante testes manuais de login real na Sessão 02.
  Recomendação: na Sessão 02, avaliar unificação dos dois conjuntos em uma única fonte
  de perfis demo.

### P3 — Média prioridade

- **Exemplos ilustrativos desatualizados em `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`**: documento de planejamento anterior à implementação dos mocks reais,
  contém trechos de exemplo com wallets truncadas/incompletas e claramente ilustrativas
  — ex.: linha ~1129 `"supplierWallet": "0x742d35Cc6634C0532925a3b8D4C9C35"` (31
  caracteres hex), linha ~1156 `"responsibleWallet": "0xdeadbeef1234"` (12 caracteres
  hex) e linha ~647 `"actorWallet": "0xlogistica..."` (com reticências, placeholder
  explícito) — além de nomes de agência/fornecedor diferentes dos mocks reais atuais
  (ex.: "Prefeitura de São Paulo" vs. "Prefeitura Municipal de São Paulo"). Não foram
  corrigidos porque são **exemplos ilustrativos de estrutura** de um documento de
  planejamento anterior (não são consumidos por código e já divergem do
  `mockContracts`/`mockContractEvents` reais em vários outros aspectos — nomes,
  descrições, IDs). Corrigir só a wallet criaria falsa sensação de exemplo atualizado.
  Impacto: nenhum em runtime; pode confundir quem usar o documento como referência
  literal. Recomendação: numa revisão de documentação futura, padronizar os exemplos
  do contrato técnico para usar reticências (`"0x..."`) ou os endereços oficiais da
  seção 5.
- **Registro histórico em `Docs/Feedback_chat/feedback_bloco_16_frontend_wallet_profile.md`** ainda cita o endereço antigo da wallet conectada
  (`0x8A4D35Cc6634C0532925a3b8D4C9C351234F92B`, 39 caracteres). Não foi alterado por se
  tratar de um **registro histórico/feedback de um bloco já concluído** (alterá-lo
  reescreveria um relato de execução passado). Impacto: nenhum em runtime — é apenas
  documentação de arquivamento. Recomendação: manter como está; se necessário, referenciar
  este documento (`wallets_mockadas.md`) como a fonte atualizada.

### P4 — Baixa prioridade

- **Centralização futura das wallets demo.** Atualmente os endereços oficiais estão
  duplicados em vários arquivos (`profiles.mock.ts`, `contracts.mock.ts`,
  `contract-events.mock.ts`, `entities/profile/model/store.ts`,
  `seed_demo_profiles.py`). Funciona corretamente, mas uma constante única
  compartilhada (ex.: `shared/config/demo-wallets.ts` no frontend e um módulo
  equivalente no backend) reduziria o risco de divergência futura. Fora do escopo deste
  bloco (que pediu apenas correção e padronização, não refatoração estrutural).

> Nenhuma pendência **P1 — Bloqueante** foi identificada: todas as wallets
> obrigatórias (perfis demo do seletor, mocks de contratos/eventos e seed backend)
> estão corrigidas, válidas e alinhadas; o seed backend já rodava com sucesso com os
> endereços oficiais (Bloco 04) e nenhuma tela depende de um valor literal de wallet
> além de `shortenAddress`/exibição.

## 8. Conclusão Técnica

Todas as wallets mockadas/demo identificadas no projeto (frontend, backend, seed e
documentação) agora seguem o padrão EVM `^0x[a-fA-F0-9]{40}$`. O backend já possuía
endereços válidos e uma função de validação (`normalize_wallet` / `WALLET_RE`); esses
endereços foram adotados como referência oficial e replicados no frontend, garantindo
que o mesmo perfil/role utilize a mesma wallet em todos os pontos do sistema (mocks de
perfis, mocks de contratos, mocks de eventos/timeline e seed do backend).

O modo mock permanece intacto — nenhuma rota, store, componente ou regra de negócio
foi alterada, apenas os valores de string das wallets e a documentação que os
referenciava. O projeto está pronto, do ponto de vista de formato de endereço, para a
Sessão 02 (login real por wallet, nonce, assinatura e JWT), restando apenas a pendência
P2 sobre a duplicidade de conjuntos de perfis demo com nomes divergentes — que não
impede o uso atual, mas merece atenção ao planejar a unificação do fluxo de
autenticação real.
