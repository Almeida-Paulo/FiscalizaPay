# Feedback - Bloco 06: Integracao /auth/me

## 1. Resumo do que foi feito

Foi integrada oficialmente a chamada protegida:

```txt
GET /auth/me
```

O frontend agora valida o JWT salvo na auth store, usa o Bearer automatico do HTTP client e atualiza a sessao com o profile real retornado pelo backend.

Fluxo atual:

```txt
/auth/verify -> accessToken -> auth store -> /auth/me -> profile real -> auth store/sessionStorage
```

Nao foram iniciados contracts/actions/audit, blockchain, deploy ou substituicao completa do perfil demo.

## 2. Arquivos criados

```txt
web/src/entities/auth/model/session.ts
Docs/sessoes/sessao_02_integrar_back_e_front/analises/integracao_auth_me.md
Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_06_integracao_auth_me.md
```

## 3. Arquivos alterados

```txt
web/src/entities/auth/model/store.ts
web/src/entities/auth/ui/auth-session-hydrator.tsx
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
```

## 4. Contrato do /auth/me

Endpoint:

```http
GET /auth/me
Authorization: Bearer <accessToken>
```

Resposta de sucesso:

```txt
data.id
data.name
data.role
data.walletAddress
data.createdAt
data.updatedAt
```

Fonte real:

```txt
backend/app/routers/auth.py
backend/app/deps.py
backend/app/security.py
backend/app/serializers.py
```

## 5. Header Authorization

O header e enviado pelo `httpClient` do Bloco 05:

```txt
Authorization: Bearer <accessToken>
```

`refreshAuthenticatedProfile()` chama:

```txt
getCurrentProfile()
```

sem passar token manualmente.

## 6. Profile real carregado

Validado com backend real:

```txt
authMeValidStatus=200
authMeValidRole=GESTOR
authMeValidWalletMatches=true
```

O profile retornado por `/auth/me` passa a atualizar a auth session.

## 7. Atualizacao da auth store/session

Action criada:

```txt
setAuthenticatedProfile(profile)
```

Ela atualiza:

```txt
profile
role
walletAddress
isAuthenticated
isLoading
error
sessionStorage
```

Ela preserva:

```txt
accessToken
expiresAt
```

Validado:

```txt
authMeUpdatedProfile=true
authMeUpdatedRole=true
authMeUpdatedWalletAddress=true
sessionStorageUpdated=true
```

## 8. Tratamento de 401

Implementado:

```txt
401 -> clearSession()
401 -> remove sessionStorage
401 -> isAuthenticated=false
401 -> profile=null
401 -> role=null
401 -> walletAddress=null
```

Mensagens tratadas:

```txt
Sessao invalida ou expirada. Faca login novamente.
Perfil autenticado nao encontrado.
```

Validados:

```txt
/auth/me sem token -> 401
/auth/me com token invalido -> 401
/auth/me com profile removido -> 401
```

## 9. Tratamento de 403

Implementado:

```txt
403 -> nao limpar sessao
403 -> manter accessToken
403 -> manter isAuthenticated=true
403 -> setar erro de permissao
```

Validado com fetch simulado:

```txt
forbiddenKeepsSession=true
forbiddenSetsError=true
```

## 10. Restore / Hydrate

O restore agora funciona assim:

```txt
hydrate() restaura sessionStorage
AuthSessionHydrator chama /auth/me se houver accessToken e mocks=false
/auth/me confirma profile real
store/sessionStorage sao atualizados
```

Validado:

```txt
hydrateWithAuthMeRestoredProfile=true
```

## 11. Preservacao do mock mode

Validado:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

Resultado:

```txt
mockModeSkippedAuthMe=true
mockProfilePreserved=true
```

O modo mock nao exige JWT nem chama `/auth/me`.

Com:

```txt
NEXT_PUBLIC_USE_MOCKS=false
```

o profile real vem de `/auth/me`.

## 12. Validacoes executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=true npm run build` | OK. |
| `docker compose config` em `backend/` | OK. |
| `docker compose up -d --build` em `backend/` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| fluxo ate `/auth/verify` | OK, JWT recebido sem expor token. |
| `GET /auth/me` com token valido | OK, HTTP 200. |
| `GET /auth/me` sem token | OK, HTTP 401 esperado. |
| `GET /auth/me` com token invalido | OK, HTTP 401 esperado. |
| `GET /auth/me` com profile removido | OK, HTTP 401 esperado. |
| profile real na auth store/session | OK. |
| role real na auth store/session | OK. |
| walletAddress real na auth store/session | OK. |
| limpeza da sessao em 401 | OK. |
| 403 sem limpar sessao | OK, validado com fetch simulado. |
| hydrate/restore com `/auth/me` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=true` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false` | OK. |
| `git status` | Executado. |

## 13. Pendencias encontradas

Pendencias esperadas para os proximos blocos:

- substituir perfil demo pelo profile real nos componentes em modo API no Bloco 07;
- integrar contratos reais no Bloco 08;
- integrar actions reais no Bloco 09;
- integrar timeline/auditoria no Bloco 10;
- tratar blockchain indisponivel no Bloco 11;
- teste ponta a ponta completo no Bloco 12.

## 14. Commit realizado

Commit semantico realizado:

```txt
feat: integrar perfil autenticado via auth me
```

## 15. Observacoes para o proximo bloco

O Bloco 07 deve usar a auth store como fonte de verdade em `NEXT_PUBLIC_USE_MOCKS=false`, substituindo gradualmente `useProfileStore`/perfil demo nos pontos visuais e de permissao sem quebrar o modo mock.
