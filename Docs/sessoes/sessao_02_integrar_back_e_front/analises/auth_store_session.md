# Auth Store/Session - Bloco 04

## 1. Resumo Executivo

O Bloco 04 criou uma store global de autenticacao para o frontend usando Zustand e `sessionStorage`.

O fluxo real preparado nos blocos anteriores agora consegue transformar a resposta de sucesso de `/auth/verify` em uma sessao autenticada persistida para a aba atual do navegador.

Foi implementado:

```txt
/auth/verify -> toAuthSession -> authStore.setSession -> sessionStorage
```

Nao foi implementado neste bloco:

```txt
Authorization Bearer global
/auth/me completo
contracts/actions/audit
deploy
blockchain real
substituicao final dos perfis demo
```

## 2. Arquivos Analisados

Frontend:

```txt
web/src/entities/profile/model/store.ts
web/src/entities/wallet/model/store.ts
web/src/entities/profile/model/types.ts
web/src/app/providers/index.tsx
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
web/src/features/auth-wallet/ui/wallet-signature-button.tsx
web/src/features/wallet-connect/ui/wallet-connect-button.tsx
web/src/shared/api/auth-api.ts
web/package.json
```

Backend:

```txt
backend/app/routers/auth.py
backend/app/schemas.py
backend/app/security.py
backend/app/services/auth.py
backend/scripts/create_profile.py
backend/docker-compose.yml
```

Documentacao:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_04_auth_store_session.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/verify_jwt.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_03_verify_jwt.md
```

## 3. Estrategia de Estado Escolhida

A estrategia escolhida foi manter o padrao ja usado no frontend:

```txt
Zustand store em entities/*/model/store.ts
```

Nova store criada:

```txt
web/src/entities/auth/model/store.ts
```

Tambem foi criado um hidratador client-side:

```txt
web/src/entities/auth/ui/auth-session-hydrator.tsx
```

Esse hidratador foi conectado ao provider raiz:

```txt
web/src/app/providers/index.tsx
```

Assim, quando a aplicacao carrega no navegador, a store tenta restaurar a sessao salva em `sessionStorage`, sem chamar `/auth/me`.

## 4. Estrutura do AuthState

A store representa:

```ts
type AuthState = {
  accessToken: string | null;
  expiresAt: string | null;
  profile: AuthProfile | null;
  walletAddress: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
};
```

Campos adicionais ao minimo do bloco:

```txt
expiresAt
```

Motivo: permitir validar expiracao durante `setSession` e `hydrate`.

## 5. Acoes Criadas

A store expoe:

```ts
type AuthActions = {
  login: (session: AuthSession) => void;
  logout: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  hydrate: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};
```

Detalhes:

- `login` atua como alias semantico de `setSession`.
- `setSession` valida token, profile, role, wallet e expiracao antes de persistir.
- `hydrate` restaura apenas sessoes validas e nao expiradas.
- `logout` e `clearSession` limpam estado e `sessionStorage`.
- `setLoading` e `setError` preparam a store para os proximos blocos.

## 6. Estrategia de Persistencia do JWT

A persistencia escolhida foi:

```txt
sessionStorage
```

Chave:

```txt
fiscalizapay.auth.session
```

Campos persistidos:

```txt
accessToken
expiresAt
profile
walletAddress
role
isAuthenticated
```

Decisoes de seguranca:

- `localStorage` nao foi usado.
- O JWT nao e impresso em console.
- O JWT completo nao e exibido na interface.
- O JWT nao foi salvo em arquivos de documentacao.
- Sessao expirada e removida do storage.

## 7. Fluxo de Login Centralizado

O fluxo real ficou assim:

```txt
Wallet real
-> GET /auth/nonce
-> assinatura da mensagem
-> POST /auth/verify
-> resposta com accessToken/profile
-> toAuthSession
-> useAuthStore.getState().setSession(...)
```

Implementacao conectada em:

```txt
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
```

Quando `/auth/verify` retorna sucesso e contem `accessToken`, o hook converte a resposta com `toAuthSession` e salva na auth store.

Observacao: uma action `loginWithWallet` dentro da store nao foi criada porque o fluxo de wallet depende de hooks React/wagmi. A centralizacao real ficou dividida de forma segura:

```txt
hook de wallet executa nonce/sign/verify
auth store centraliza sessao/persistencia/logout/hydrate
```

## 8. Fluxo de Logout

`logout` e `clearSession` fazem:

```txt
remove fiscalizapay.auth.session do sessionStorage
accessToken = null
expiresAt = null
profile = null
walletAddress = null
role = null
isAuthenticated = false
isLoading = false
error = null
```

O fluxo de desconectar wallet real tambem chama `clearSession`, evitando manter sessao autenticada depois da desconexao.

## 9. Restore Session

O restore foi implementado como:

```txt
hydrate()
```

Responsabilidades:

- ler `sessionStorage`;
- validar estrutura minima da sessao;
- validar `accessToken`;
- validar `expiresAt`;
- limpar sessao invalida ou expirada;
- restaurar sessao valida;
- nao chamar `/auth/me` ainda.

O provider raiz chama `hydrate()` no carregamento client-side.

Isso prepara o Bloco 06, onde `/auth/me` podera confirmar o profile real a partir do token.

## 10. Preservacao do Mock Mode

Mock mode foi preservado:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

continua usando a wallet demo existente.

```txt
NEXT_PUBLIC_USE_MOCKS=false
```

continua usando o fluxo real de wallet, nonce, assinatura, verify e agora sessao.

Nao houve:

```txt
remocao de mock
unificacao de perfis demo
fallback silencioso para mock
alteracao em contracts/actions/audit
```

## 11. Tratamento de Erros

A store trata:

- sessao sem token;
- sessao sem `expiresAt`;
- profile invalido;
- role invalida;
- wallet ausente;
- sessao expirada;
- JSON invalido em `sessionStorage`;
- logout/limpeza manual.

Estrategia para proximos blocos:

```txt
401 futuro -> clearSession/logout
403 futuro -> manter sessao e exibir erro de autorizacao
```

Essa regra ainda nao foi ligada ao `httpClient`, pois isso pertence ao Bloco 05.

## 12. Validacoes Executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=true npm run build` | OK. |
| `docker compose config` em `backend/` | OK. |
| `docker compose up -d --build` em `backend/` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| `/auth/nonce` + `/auth/verify` com wallet efemera | OK, JWT recebido sem imprimir token/signature/private key. |
| `setSession` persistindo em `sessionStorage` | OK, validado em teste Node com storage simulado. |
| `hydrate` restaurando sessao | OK, validado em teste Node com storage simulado. |
| `logout` limpando estado e storage | OK, validado em teste Node com storage simulado. |
| sessao expirada | OK, validado em teste Node com storage simulado. |
| `git status` | Executado. |
| Fluxo interativo com MetaMask no navegador | Nao executado; requer wallet/browser interativo. |

Observacao sobre Docker:

O arquivo `docker-compose.yml` do projeto esta em `backend/`. A tentativa no diretorio raiz nao encontrou compose, entao a validacao efetiva foi feita em `backend/`.

## 13. Pendencias para os Proximos Blocos

Pendencias esperadas:

- injetar `Authorization: Bearer ...` no HTTP client no Bloco 05;
- definir comportamento automatico de 401/403 no HTTP client;
- integrar `/auth/me` completo no Bloco 06;
- substituir perfil demo por perfil real no Bloco 07;
- integrar contratos reais depois da autenticacao estar completa;
- validar fluxo interativo no navegador com MetaMask;
- executar teste ponta a ponta completo no Bloco 12.

## 14. Conclusao Tecnica

O Bloco 04 esta concluido tecnicamente.

O frontend agora possui uma Auth Store centralizada, persistida em `sessionStorage`, com restauracao controlada, limpeza de logout, validacao de expiracao e conexao direta com o sucesso de `/auth/verify`.

A implementacao respeita o limite do bloco: nao injeta Bearer global, nao chama `/auth/me`, nao integra contracts/actions/audit, nao remove mocks e nao expõe JWT completo.
