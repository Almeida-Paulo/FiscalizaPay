# Pendencias Pre-Sessao 02

## 1. Resumo Executivo

Este bloco extra revisou as pendencias P2, P3 e P4 deixadas pelo relatorio de prontidao da Sessao 01 e preparou a transicao para a Sessao 02 - Integracao Backend + Frontend.

Conclusao: a Sessao 02 pode iniciar, mas deve comecar obrigatoriamente pelo fluxo de autenticacao:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```

Nao foi iniciada integracao de contracts/actions/audit. O unico ajuste aplicado fora desta analise foi documental: `backend/README.md` passou a registrar o comando oficial de seed com `docker compose exec -T api python -m scripts.seed_demo_profiles` e uma alternativa explicita com `PYTHONPATH=/app`.

## 2. Status Geral

Status do bloco extra:

```txt
CONCLUIDO COM PENDENCIAS MIGRADAS
```

Validacoes obrigatorias executadas:

| Validacao | Status | Observacao |
|---|---|---|
| `git status` | OK | Workspace tinha pendencias antigas nao relacionadas. Depois da investigacao, `web/package-lock.json` deixou de aparecer como modificado; documentos antigos nao rastreados permanecem fora do escopo. |
| Estrutura da Sessao 01 | OK parcial | Existem `analises/`, `Blocos/` e `Feedback/`. Nao existem `bugs/` nem `planejamento/blocos/`; convencao futura documentada como P4. |
| Feedback do Bloco 08 | OK | Relatorio final classifica a Sessao 01 como `PARCIALMENTE PRONTO PARA INTEGRACAO`. |
| `npm run lint` | OK | ESLint sem erros. |
| `npm run build` | OK | Next build e TypeScript passaram; 9 rotas geradas. |
| `docker compose config` | OK | Configuracao renderizada sem erro. |
| `docker compose up -d --build` | OK | API recriada/iniciada e banco healthy. |
| `GET /health` | OK | HTTP 200 em `http://127.0.0.1:8000/health`. |
| `npm audit` | OK com achados | 24 vulnerabilidades moderadas; correcao recomendada envolve `--force` e alteracoes potencialmente quebraveis. |
| `git diff -- web/package-lock.json` | OK | Sem diff de conteudo; hash do arquivo igual ao indice. Marcador local foi limpo apos refresh do indice, sem commit. |
| Seed oficial | OK | `docker compose exec -T api python -m scripts.seed_demo_profiles` executado com sucesso e idempotente. |
| `/auth/nonce` | OK | `GET /auth/nonce?walletAddress=0x111...111` retornou `walletAddress`, `nonce`, `message` e `expiresAt`. |
| `/auth/me` sem Bearer | OK | Retornou HTTP 401, comportamento esperado para rota protegida. |

## 3. Pendencias P2

| Item | Status | Decisao | Destino |
|---|---|---|---|
| Auth wallet/JWT no frontend | Revisado | Nao criar implementacao parcial neste bloco. Criar camada `auth-api`, store de sessao, hooks de login e Bearer no primeiro bloco da integracao. | Sessao 02 - Bloco 01 |
| Consumir `/auth/nonce` e `/auth/verify` | Contrato mapeado | Usar codigo real do backend: nonce por query string, verify por body JSON, token em `data.accessToken`. | Sessao 02 - Bloco 01 |
| Assinar mensagem com wallet | Estrategia definida | Usar `wagmi`/`viem`, preferencialmente `useSignMessage`, assinando exatamente `data.message` retornado pelo backend. | Sessao 02 - Bloco 01 |
| Persistir JWT corretamente | Estrategia definida | Usar Zustand + `sessionStorage` para `accessToken`, `profile`, `walletAddress`, `role`, `expiresAt` e `isAuthenticated`; logout limpa tudo. | Sessao 02 - Bloco 01 |
| Enviar `Authorization: Bearer <token>` | Estrategia definida | Adaptar `httpClient` para receber/injetar token sem quebrar requests publicas de auth e health. | Sessao 02 - Bloco 01 |
| Validar endpoints protegidos com JWT real | Checklist criado | Nao iniciar contracts/actions/audit antes de `/auth/me` funcionar com Bearer. | Sessao 02 - Blocos pos-auth |
| Perfis demo duplicados | Decisao tomada | DECISAO: manter perfis separados com propositos distintos ate auth real substituir a sessao visual. | Sessao 02, revisar apos auth |

## 4. Pendencias P3

| Item | Status | Decisao | Destino |
|---|---|---|---|
| Padronizar comando oficial de seed | Resolvido | README do backend atualizado com comando oficial via modulo e alternativa com `PYTHONPATH`. | Resolvido neste bloco |
| Validar navegador real com `NEXT_PUBLIC_USE_MOCKS=false` | Planejado | Variavel existe; validacao completa depende de auth/JWT. Antes disso, endpoints protegidos devem retornar 401. | Sessao 02 - pos-auth |
| Console limpo e erros 401/403 | Planejado | `handle-api-error.ts` ja mapeia 401/403; validar visualmente no navegador com API real. | Sessao 02 |
| Mapear update/delete | Revisado | Backend e client possuem PATCH/DELETE; UI nao expoe fluxo principal agora. Marcar como nao aplicavel para o primeiro bloco. | Sessao 02, bloco especifico se exposto na UI |
| Documentos antigos com wallets/placeholders | Revisado | Feedback historico nao deve ser alterado. `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` esta marcado como oficial, mas ainda cita Node/Nest, porta 3001 e wallets truncadas; deve ser regenerado na Sessao 02 com o contrato real FastAPI. | Sessao 02 |
| Processo externo em `127.0.0.1:3000` | Revisado | `localhost:3000` responde FiscalizaPay; `127.0.0.1:3000` responde outro Node local. Padrao oficial de frontend: `http://localhost:3000`. | Documentado; sem acao agora |
| Vulnerabilidades npm | Revisado | `npm audit` encontrou 24 moderadas. Nao aplicar `npm audit fix --force`; exige avaliacao de Next/wagmi/WalletConnect. | Sessao 03 ou bloco proprio de seguranca antes de deploy |

## 5. Pendencias P4

| Item | Status | Decisao | Destino |
|---|---|---|---|
| Padronizar estrutura DDAD futura | Definido | Para novas sessoes, usar `planejamento/blocos/`, `Feedback/`, `bugs/` e `analises/`. Nao reorganizar Sessao 01 agora. | Sessao 02 em diante |
| `web/package-lock.json` modificado | Resolvido localmente | Sem diff de conteudo e hash igual ao indice. Refresh do indice limpou o marcador; nada foi commitado. | Resolvido neste bloco |
| Centralizar wallets demo | Adiado | Refatorar literais antes da auth pode aumentar risco. Manter como melhoria futura apos o fluxo real estabilizar. | Sessao 02 pos-auth ou melhoria futura |
| Warnings locais do PostgreSQL | Migrado | Tratar como observacao de ambiente local; revisar somente em preparacao de deploy/producao. | Sessao 03 |

## 6. Estrategia Auth/JWT para Sessao 02

Ordem recomendada:

1. Criar `web/src/shared/api/auth-api.ts` com `getAuthNonce`, `verifyWalletSignature` e `getCurrentProfile`.
2. Criar `web/src/entities/auth/model/store.ts` para estado de sessao.
3. Criar hook/feature de login por wallet, por exemplo `web/src/features/auth-wallet/model/use-wallet-login.ts`.
4. Conectar wallet via wagmi/RainbowKit.
5. Chamar `/auth/nonce` com `walletAddress`.
6. Assinar exatamente o campo `message` retornado.
7. Enviar `walletAddress`, `nonce` e `signature` para `/auth/verify`.
8. Persistir `accessToken`, `expiresAt` e `profile`.
9. Chamar `/auth/me` com Bearer para confirmar sessao.
10. So depois habilitar chamadas reais de dashboard/contracts/actions/audit com `NEXT_PUBLIC_USE_MOCKS=false`.

Nao criar contracts/actions/audit reais antes desse fluxo funcionar.

## 7. Contrato dos Endpoints Auth

### GET `/auth/nonce`

Origem no backend: `backend/app/routers/auth.py`.

Metodo:

```http
GET /auth/nonce?walletAddress=<wallet EVM>
```

Parametro:

| Campo | Origem | Regra |
|---|---|---|
| `walletAddress` | Query string | `min_length=42`, `max_length=42`; validado por `normalize_wallet` como `0x` + 40 hex. |

Resposta:

```json
{
  "data": {
    "walletAddress": "0x1111111111111111111111111111111111111111",
    "nonce": "hexadecimal",
    "message": "FiscalizaPay Web3\\n\\nAssine esta mensagem...",
    "expiresAt": "2026-06-08T03:41:34.336Z"
  }
}
```

Erros esperados:

- `400`/`422` para wallet fora do formato.

### POST `/auth/verify`

Origem no backend: `backend/app/routers/auth.py` e `backend/app/schemas.py`.

Metodo:

```http
POST /auth/verify
Content-Type: application/json
```

Payload real:

```json
{
  "walletAddress": "0x1111111111111111111111111111111111111111",
  "nonce": "nonce-retornado",
  "signature": "0x..."
}
```

Resposta:

```json
{
  "data": {
    "accessToken": "jwt",
    "tokenType": "bearer",
    "expiresAt": "2026-06-08T04:31:00.000Z",
    "profile": {
      "id": "uuid",
      "name": "Maria Santos",
      "role": "GESTOR",
      "walletAddress": "0x1111111111111111111111111111111111111111",
      "createdAt": "iso",
      "updatedAt": "iso"
    }
  },
  "message": "Wallet autenticada com sucesso."
}
```

Erros esperados pelo codigo:

- `401 UNAUTHORIZED_ROLE`: nonce invalido ou ja utilizado.
- `401 UNAUTHORIZED_ROLE`: nonce expirado.
- `401 UNAUTHORIZED_ROLE`: assinatura nao corresponde a wallet.
- `403 UNAUTHORIZED_ROLE`: wallet autenticada, mas sem perfil cadastrado.

### GET `/auth/me`

Metodo:

```http
GET /auth/me
Authorization: Bearer <accessToken>
```

Resposta:

```json
{
  "data": {
    "id": "uuid",
    "name": "Maria Santos",
    "role": "GESTOR",
    "walletAddress": "0x1111111111111111111111111111111111111111",
    "createdAt": "iso",
    "updatedAt": "iso"
  }
}
```

Erros esperados:

- `401 UNAUTHORIZED_ROLE`: autenticacao obrigatoria.
- `401 UNAUTHORIZED_ROLE`: token expirado.
- `401 UNAUTHORIZED_ROLE`: token invalido.
- `401 UNAUTHORIZED_ROLE`: perfil autenticado nao encontrado.

## 8. Estrategia de Sessao no Frontend

Estado minimo:

```ts
type AuthState = {
  accessToken: string | null;
  expiresAt: string | null;
  profile: Profile | null;
  walletAddress: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
  hydrate: () => void;
};
```

Decisao de persistencia:

- Usar `sessionStorage` no MVP de integracao.
- Evitar `localStorage` inicialmente para reduzir persistencia longa de token.
- Hidratar estado somente em componentes/client hooks.
- Validar expiracao pelo `expiresAt`.
- Em 401, limpar sessao e orientar novo login.
- Em 403, manter sessao e exibir permissao negada.

## 9. Estrategia de Authorization Bearer

O `httpClient` atual centraliza headers e ja aceita headers customizados por request.

Estrategia para a Sessao 02:

- Manter `/auth/nonce` e `/auth/verify` como requests publicas sem Bearer.
- Adicionar um mecanismo central para incluir Bearer nas chamadas protegidas.
- Preferencia: helper simples de leitura do token de sessao, evitando acoplamento circular entre store e `httpClient`.
- Se nao houver token em modo API real, deixar backend retornar 401 e tratar via `getApiErrorMessage`.
- Nao enviar Bearer quando `env.useMocks=true`.

Checklist de endpoints protegidos com JWT real:

| Endpoint | Role | Status | Wallet vinculada |
|---|---|---|---|
| `GET /auth/me` | Qualquer perfil autenticado | N/A | N/A |
| `GET /dashboard/summary` | Qualquer perfil autenticado | N/A | N/A |
| `GET /contracts` | Qualquer perfil autenticado | N/A | N/A |
| `POST /contracts` | `GESTOR` | N/A | Manager vira a wallet do perfil se nao informado |
| `GET /contracts/{id}` | Qualquer perfil autenticado | N/A | N/A |
| `PATCH /contracts/{id}` | `GESTOR` | `CRIADO` | `manager_wallet` |
| `DELETE /contracts/{id}` | `GESTOR` | `CRIADO` | `manager_wallet` |
| `GET /contracts/{id}/events` | Qualquer perfil autenticado | N/A | N/A |
| `POST /contracts/{id}/confirm-shipment` | `FORNECEDOR` | `CRIADO` | `supplier_wallet` |
| `POST /contracts/{id}/confirm-delivery` | `ENTREGADOR` | `ENVIADO` | `logistics_wallet` |
| `POST /contracts/{id}/validate-receipt` | `FISCAL` | `ENTREGUE` | `inspector_wallet` |
| `POST /contracts/{id}/authorize-payment` | `GESTOR` | `VALIDADO` | `manager_wallet` |
| `POST /contracts/{id}/open-dispute` | `GESTOR`, `FISCAL`, `AUDITOR` | Nao pode estar `PAGAMENTO_AUTORIZADO` nem `DISPUTA` | N/A |
| `POST /contracts/{id}/simulate-fraud` | `GESTOR`, `FISCAL`, `AUDITOR` | Nao pode estar `PAGAMENTO_AUTORIZADO` nem `DISPUTA`; exige `documentHash` original | N/A |
| `GET /contracts/{id}/blockchain-status` | Qualquer perfil autenticado | N/A | N/A |
| `POST /contracts/{id}/register-on-chain` | `GESTOR` | N/A | `manager_wallet`; retorna `BLOCKCHAIN_ERROR` enquanto smart contract estiver desabilitado |
| `GET /audit/events` | Qualquer perfil autenticado | N/A | N/A |

## 10. Decisao sobre Perfis Demo

```txt
DECISAO: manter perfis separados com propositos distintos
```

Conjuntos encontrados:

- `web/src/entities/profile/model/store.ts`
  - Exporta `DEMO_PROFILES`.
  - Alimenta `useProfileStore`.
  - Usado pelo seletor visual de perfil, header/sidebar/dashboard/contracts/actions durante demo.
  - Papel: simular sessao e permissao visual sem auth real.

- `web/src/shared/mocks/profiles.mock.ts`
  - Exporta `mockProfiles` e `mockProfileByRole`.
  - Papel: dataset de mocks de dominio, alinhado as wallets demo e aos contratos mockados.
  - Hoje quase nao e consumido diretamente fora de exports de mocks.

Motivo para manter:

- As wallets ja estao alinhadas com o backend.
- Os nomes divergentes nao quebram runtime.
- Unificar agora pode misturar seletor visual de sessao com dataset de dominio.
- A auth real deve substituir gradualmente `useProfileStore` como fonte de verdade na Sessao 02.

Regra para Sessao 02:

- O backend e o JWT passam a ser fonte de verdade de `profile`, `role` e `walletAddress`.
- `DEMO_PROFILES` permanece apenas para mock mode.
- `mockProfiles` permanece apenas para dados mockados, se ainda necessario.

## 11. Comando Oficial de Seed

Comando oficial:

```bash
docker compose exec -T api python -m scripts.seed_demo_profiles
```

Alternativa suportada:

```bash
docker compose exec -T api sh -c "PYTHONPATH=/app python scripts/seed_demo_profiles.py"
```

Motivo:

- O comando direto `python scripts/seed_demo_profiles.py` falha sem `PYTHONPATH` dentro do container.
- A execucao via modulo usa o pacote Python corretamente.
- O comando foi validado e o README do backend foi atualizado.

## 12. Itens Resolvidos Neste Bloco

- Comando oficial de seed definido e documentado no `backend/README.md`.
- Alternativa com `PYTHONPATH=/app` documentada no `backend/README.md`.
- Contrato real de `/auth/nonce`, `/auth/verify` e `/auth/me` mapeado a partir do codigo backend.
- Estrategia de sessao JWT definida para o frontend.
- Estrategia de Authorization Bearer definida.
- Decisao sobre perfis demo duplicados documentada.
- `web/package-lock.json` investigado: sem diff de conteudo, hash igual ao indice e marcador local limpo sem commit.
- Ambiente local revalidado: Docker, health, build, lint e seed OK.

## 13. Itens Migrados para Sessao 02

- Criar `auth-api` no frontend.
- Criar store de sessao/auth.
- Implementar login wallet com nonce/signature/JWT.
- Integrar `useSignMessage` do wagmi/viem.
- Injetar `Authorization: Bearer <token>` no `httpClient`.
- Validar `/auth/me` com token real.
- Validar modo API real com `NEXT_PUBLIC_USE_MOCKS=false`.
- Testar visualmente 401/403 no navegador.
- Testar endpoints protegidos com role, status e wallet vinculada.
- Regenerar ou substituir `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md`, que ainda tem referencias antigas a Node/Nest, porta 3001 e wallets truncadas.
- Revisar update/delete em bloco proprio se a UI expuser essas acoes.

## 14. Itens Migrados para Sessao 03

- Revisar vulnerabilidades do `npm audit` antes de deploy/producao, sem `--force` automatico.
- Revisar warnings locais do PostgreSQL em contexto de producao.
- Revisar seed demo para staging/producao, se a estrategia de ambiente exigir.
- Revisar docs de deploy e variaveis finais de producao.

## 15. Riscos Restantes

- Sem auth frontend, qualquer tentativa de API real em contracts/actions/audit deve retornar 401.
- O token em `sessionStorage` reduz persistencia longa, mas ainda exige cuidado contra XSS.
- `npm audit` tem vulnerabilidades moderadas em cadeias de Next/wagmi/WalletConnect; fix automatico com `--force` pode quebrar o app.
- O documento tecnico antigo em `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` ainda pode confundir a integracao se usado como fonte principal antes de ser atualizado.
- `127.0.0.1:3000` responde outro processo Node local; usar `localhost:3000` como padrao do frontend.

## 16. Recomendacao Final

Iniciar a Sessao 02 pelo Bloco 01 - Auth API no Frontend.

Nao iniciar integracao de contracts/actions/audit antes de validar:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```

Depois que `/auth/me` funcionar com Bearer, seguir para leitura de dashboard/contracts e somente entao para actions protegidas com role, status e wallet vinculada.
