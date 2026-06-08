# Feedback — Bloco 07: Correção de Wallets Mockadas

## 1. Resumo do que foi feito

Foi feita uma varredura completa do projeto (frontend, backend, seed e documentação)
em busca de wallets mockadas/demo, usando os termos `wallet`, `walletAddress`,
`address`, `publicAddress`, `account`, `demo`, `mock`, `profile`/`perfil` e o regex
`0x[a-zA-Z0-9]{6,}`.

O backend (`backend/scripts/seed_demo_profiles.py`) já utilizava endereços EVM válidos
no padrão `0x1111...1111`–`0x5555...5555`, e já possuía validação própria
(`WALLET_RE = re.compile(r"^0x[a-fA-F0-9]{40}$")` e `normalize_wallet` em
`backend/app/security.py`). Esses endereços foram adotados como **fonte oficial** e o
frontend foi alinhado a eles, role a role.

No frontend foram encontradas wallets em três situações problemáticas:
- **Tamanho incorreto** (39 caracteres em vez de 40): `0x742d35Cc...abcd`,
  `0x742d35Cc...0002`, `0x8A4D35Cc...F92B`;
- **Caracteres fora de `0-9a-fA-F`** (nomes de cargo embutidos no endereço):
  `0xlogistica...`, `0xLogistica...`, `0xAuditor...`;
- **Wallet ausente** (`walletAddress: undefined`) no perfil demo AUDITOR de
  `entities/profile/model/store.ts`.

Todas foram substituídas pelos endereços oficiais (`0x1111...1111` a
`0x5555...5555`, mais `0x8888...8888` para a wallet "conectada" simulada),
garantindo que cada role use a **mesma wallet** em frontend e backend. O modo mock
foi preservado integralmente — nenhuma rota, store, componente, regra de permissão ou
migration foi alterada, apenas valores de string de wallet e textos de documentação
que os referenciavam.

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/wallets_mockadas.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_07_correcao_wallets_mockadas.md
```

## 3. Arquivos alterados

```txt
web/src/entities/profile/model/store.ts        (DEMO_PROFILES — 5 wallets corrigidas/preenchidas)
web/src/shared/mocks/profiles.mock.ts          (mockProfiles — 5 wallets corrigidas)
web/src/shared/mocks/contracts.mock.ts         (supplierWallet/inspectorWallet/logisticsWallet/managerWallet — 24 ocorrências em 6 contratos)
web/src/shared/mocks/contract-events.mock.ts   (constantes *_WALLET + criação de AUDITOR_WALLET/AUDITOR_NAME)
web/src/entities/wallet/model/store.ts         (MOCK_WALLET.address — wallet "conectada" simulada)
web/README.md                                  (referência textual ao endereço da wallet conectada)
Docs/Demo/demo_dataset.md                      (tabela de perfis + "Auditor registrado")
Docs/Demo/demo_execution_guide.md              (referência textual ao endereço da wallet conectada)
backend/FRONTEND_ALIGNMENT.md                  (nota de resolução do item "Wallets mockadas inválidas")
Docs/analises/Frontend_explain.md              (nota de resolução do item "Alguns mocks usam wallets invalidas")
```

## 4. Wallets encontradas

Mapeamento completo na tabela da seção 3 do arquivo de análise
(`analises/wallets_mockadas.md`). Resumo:

| Situação | Quantidade de pontos no código | Exemplos |
|---|---|---|
| Wallet com 39 caracteres (faltava 1 hex) | 3 valores distintos, ~30 ocorrências | `0x742d35Cc6634C0532925a3b8D4C9C351234abcd`, `0x742d35Cc6634C0532925a3b8D4C9C3500000002`, `0x8A4D35Cc6634C0532925a3b8D4C9C351234F92B` |
| Wallet com letras fora de `a-f` (nome de cargo embutido) | 3 valores distintos, ~16 ocorrências | `0xlogistica000000000000000000000000001234`, `0xLogistica1234567890abcdef1234567890000003`, `0xAuditor1234567890abcdef1234567890AudiT05` |
| Wallet ausente (`undefined`) | 1 ocorrência | perfil demo AUDITOR em `DEMO_PROFILES` |
| Wallets já válidas, porém divergentes do backend (mesma role com endereço diferente) | 2 valores, ~12 ocorrências | `0xdeadbeef12345678901234567890abcdef123456`, `0xDeadBeef1234567890abcdef1234567890DeaD01`, `0x1234abcdef000000000000000000000000005678`, `0x1234abcd5678ef901234abcd5678ef9012340004` |
| Wallets do seed backend — já válidas e usadas como referência oficial | 5 | `0x1111...1111` a `0x5555...5555` |

## 5. Wallets corrigidas

Todos os pontos acima foram normalizados para os 6 endereços oficiais (5 perfis +
wallet conectada). Ver detalhamento arquivo a arquivo, com "wallet anterior → wallet
final", na tabela da seção 3 de `analises/wallets_mockadas.md`.

## 6. Wallets oficiais demo

| Perfil | Role | Wallet Demo |
|---|---|---|
| Maria Santos | GESTOR | `0x1111111111111111111111111111111111111111` |
| Carlos Silva / Carlos Rodrigues | FORNECEDOR | `0x2222222222222222222222222222222222222222` |
| João Logística / Ricardo Alves | ENTREGADOR | `0x3333333333333333333333333333333333333333` |
| Ana Fischer / João Silva (Fiscal) | FISCAL | `0x4444444444444444444444444444444444444444` |
| Roberto Auditor / Ana Ferreira | AUDITOR | `0x5555555555555555555555555555555555555555` |
| Wallet "conectada" simulada (sem perfil associado) | — | `0x8888888888888888888888888888888888888888` |

> Endereços puramente fictícios para ambiente demo/mock — sem fundos, sem chaves
> privadas reais, não utilizáveis em produção. Documentados em
> `analises/wallets_mockadas.md` (seção 5).

## 7. Validações executadas

| Validação | Resultado |
|---|---|
| Conferência manual contra `^0x[a-fA-F0-9]{40}$` | **OK** — todas as wallets demo têm 42 caracteres (`0x` + 40 hex válidos). |
| Reuso da validação já existente no backend (`WALLET_RE`/`normalize_wallet`, `backend/app/security.py:17`) | **OK** — não foi necessário criar nova validação; todos os endereços oficiais passam nela. |
| `cd backend && docker compose config` | **OK** — configuração renderizada sem erros. |
| `docker compose ps` | Stack já rodando: `fiscalizapay-api` e `fiscalizapay-db` (healthy). |
| `docker compose exec api python -m scripts.seed_demo_profiles` | **OK** — saída confirma os 5 perfis oficiais já existentes no banco com os endereços `0x1111...`–`0x5555...` (idênticos aos agora replicados no frontend). |
| `curl http://127.0.0.1:8000/health` | **OK** — `{"data":{"status":"ok","app":"FiscalizaPay API","environment":"development"}}` |
| `cd web && npm run lint` | **OK** — ESLint sem erros nem warnings. |
| `cd web && npm run build` | **OK** — "Compiled successfully", TypeScript sem erros, 9 rotas geradas estaticamente (`/`, `/dashboard`, `/contracts`, `/contracts/[id]`, `/contracts/new`, `/audit`, `/disputes`, etc.). |
| `npm run dev` | Não executado — requer servidor em foreground/long-running; `npm run build` já cobre compilação/tipagem/rotas, e os consumidores de `walletAddress`/`MOCK_WALLET` (`wallet-account-card`, `wallet-status`, `wallet-connect-button`, `profile-switcher`, `profile-identity-card`, `contract-parties-card`) foram revisados manualmente — nenhum depende do valor literal da wallet, apenas de `shortenAddress`/exibição/cópia. Impacto: nenhum. |
| `pytest` | Não executado — não existe suíte de testes automatizados no backend (apenas `seed_demo_profiles.py` e `create_profile.py` em `scripts/`). Impacto: nenhum. |
| `npm test` | Não executado — não existe suíte de testes automatizados no frontend (nenhum arquivo `*test*`/`*spec*`/`*fixture*` localizado). Impacto: nenhum. |

Busca final por padrões `0x[a-zA-Z0-9]{6,}` em todo o projeto não encontrou nenhuma
wallet mockada remanescente fora do padrão `^0x[a-fA-F0-9]{40}$`. Os demais resultados
do regex foram verificados manualmente e são `transactionHash`/`documentHash`
(formato de 64 caracteres hex, correto para hash de transação — diferente de wallet),
hashes de integridade de pacotes em `package-lock.json`, comentários JSDoc
ilustrativos com reticências, e placeholders de CLI/JSON em documentação (ex.:
`0xWALLET_DO_FORNECEDOR`, `0xassinatura`). Detalhes na tabela "Exceções confirmadas"
da seção 7 de `analises/wallets_mockadas.md`.

## 8. Pendências classificadas

### P1 — Bloqueante
Nenhuma. Todas as wallets obrigatórias (perfis demo, mocks de contratos/eventos e
seed backend) estão corrigidas, válidas e o seed roda sem erro.

### P2 — Alta prioridade
- **Dois conjuntos de perfis demo no frontend com nomes divergentes por role**
  (`DEMO_PROFILES` em `entities/profile/model/store.ts` vs. `mockProfiles` em
  `shared/mocks/profiles.mock.ts` — ex.: FISCAL é "Ana Fischer" em um e "João Silva"
  no outro). As wallets já estão alinhadas entre os dois conjuntos e com o backend;
  apenas os nomes de pessoa exibidos divergem. Recomenda-se avaliar unificação na
  Sessão 02, ao implementar o login real por wallet.

### P3 — Média prioridade
- **Exemplos ilustrativos desatualizados em
  `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`** (wallets truncadas tipo
  `"0x742d35Cc6634C0532925a3b8D4C9C35"`, `"0xdeadbeef1234"`, `"0xlogistica..."`) —
  documento de planejamento anterior aos mocks reais, não consumido por código.
- **Registro histórico em
  `Docs/Feedback_chat/feedback_bloco_16_frontend_wallet_profile.md`** ainda cita o
  endereço antigo (39 caracteres) da wallet conectada — mantido propositalmente por
  ser um relato de execução de um bloco já concluído (não deve ser reescrito).

### P4 — Baixa prioridade
- **Centralização futura das wallets demo**: os 6 endereços oficiais estão hoje
  duplicados como literais em vários arquivos de mock e no seed. Funciona
  corretamente; uma constante compartilhada única reduziria risco de divergência
  futura, mas é uma refatoração estrutural fora do escopo deste bloco.

Detalhamento completo (arquivo, valor encontrado, motivo, impacto, recomendação) em
`analises/wallets_mockadas.md`, seções 7 e "Exceções confirmadas".

## 9. Commit realizado

```txt
chore: padroniza wallets demo entre frontend e backend
```

(Commit aplicado ao final do bloco, após validações e documentação concluídas — ver
hash no histórico do branch `main`.)

## 10. Observações para o próximo bloco

- As wallets demo agora estão **idênticas** entre `DEMO_PROFILES`, `mockProfiles`,
  `mockContracts`, `mockContractEvents` (frontend) e `seed_demo_profiles.py`
  (backend) — base pronta para o fluxo de login real por wallet/nonce/assinatura/JWT
  da Sessão 02.
- A pendência P2 (dois conjuntos de perfis demo com nomes divergentes) **não impede**
  o uso atual, mas vale revisar ao desenhar o fluxo de troca de perfil/login real, para
  decidir se os dois conjuntos serão unificados ou mantidos com propósitos distintos
  (seletor de perfil vs. listagem de contratos).
- O backend já expõe `normalize_wallet`/`WALLET_RE` (`backend/app/security.py:17`) —
  essa é a validação que deve ser reaproveitada (não recriada) quando o frontend passar
  a enviar/receber wallets reais.
- A wallet "conectada" simulada (`0x8888...8888`, em `entities/wallet/model/store.ts`)
  é um valor isolado, não vinculado a nenhum perfil demo — ao integrar `wagmi`/
  `RainbowKit` na Sessão 02, esse mock deverá ser removido/substituído pelo endereço
  real retornado por `useAccount()`.
