# Integracao /auth/me - Bloco 06

## 1. Resumo Executivo

O Bloco 06 integrou oficialmente o endpoint protegido:

```txt
GET /auth/me
```

O fluxo minimo de autenticacao real agora fica completo:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me -> auth store/session
```

Quando `/auth/verify` retorna JWT, o frontend salva a sessao e em seguida chama `/auth/me` usando o Bearer automatico do HTTP client. O profile real retornado pelo backend atualiza:

```txt
profile
role
walletAddress
isAuthenticated
sessionStorage
```

Tambem foi adicionada validacao de `/auth/me` no restore/hydrate client-side, sem substituir ainda todos os usos visuais do perfil demo.

Nao foram iniciados neste bloco:

```txt
contracts reais
actions reais
audit real
blockchain real
deploy
substituicao completa do perfil demo
unificacao dos perfis demo
```

## 2. Arquivos Analisados

Frontend:

```txt
web/src/shared/api/auth-api.ts
web/src/shared/api/http-client.ts
web/src/shared/api/handle-api-error.ts
web/src/shared/types/api.ts
web/src/entities/auth/model/store.ts
web/src/entities/auth/ui/auth-session-hydrator.tsx
web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts
web/src/features/auth-wallet/ui/wallet-signature-button.tsx
web/src/features/wallet-connect/ui/wallet-connect-button.tsx
web/src/entities/profile/model/store.ts
web/src/entities/profile/ui/profile-identity-card.tsx
web/src/entities/profile/ui/profile-switcher.tsx
```

Backend:

```txt
backend/app/routers/auth.py
backend/app/deps.py
backend/app/schemas.py
backend/app/security.py
backend/app/services/auth.py
backend/app/serializers.py
backend/app/errors.py
```

Documentacao:

```txt
Docs/sessoes/sessao_02_integrar_back_e_front/Blocos/bloco_06_integracao_auth_me.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/authorization_bearer_http_client.md
Docs/sessoes/sessao_02_integrar_back_e_front/analises/auth_store_session.md
```

## 3. Contrato Real do /auth/me

Endpoint:

```http
GET /auth/me
Authorization: Bearer <accessToken>
```

Fonte de verdade:

```txt
backend/app/routers/auth.py
backend/app/deps.py
backend/app/security.py
backend/app/serializers.py
```

O backend:

- exige credencial Bearer;
- decodifica o JWT;
- extrai o `sub` do token;
- busca o profile no banco;
- retorna `profile_out(profile)`;
- retorna 401 se token estiver ausente, invalido, expirado ou sem profile valido.

## 4. Header Authorization Utilizado

O header e enviado pelo HTTP client central criado no Bloco 05:

```txt
Authorization: Bearer <accessToken>
```

Origem do token:

```txt
useAuthStore.getState().accessToken
```

Neste bloco, a chamada oficial usa:

```txt
getCurrentProfile()
```

sem passar token manualmente.

## 5. Response de Sucesso

Resposta esperada:

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

Validado localmente com backend real:

```txt
authMeValidStatus=200
authMeValidRole=GESTOR
authMeValidWalletMatches=true
```

Nenhum JWT, signature ou chave privada foi exibido.

## 6. Responses de Erro

Erros validados:

| Cenario | Resultado |
|---|---|
| `/auth/me` sem token | HTTP 401, `UNAUTHORIZED_ROLE`. |
| `/auth/me` com token invalido | HTTP 401, `UNAUTHORIZED_ROLE`. |
| `/auth/me` com profile removido | HTTP 401, `UNAUTHORIZED_ROLE`, mensagem de profile detectada. |

Erro 403:

```txt
validado por fetch simulado no helper de auth, sem iniciar contratos/actions/audit
```

## 7. Atualizacao da Auth Store/Session

Foi criada a action:

```txt
setAuthenticatedProfile(profile)
```

Ela atualiza:

```txt
profile
role
walletAddress
isAuthenticated=true
isLoading=false
error=null
sessionStorage
```

Ela preserva:

```txt
accessToken
expiresAt
```

Se a sessao estiver invalida, expirada ou sem token, a store limpa a sessao.

## 8. Restore / Hydrate com /auth/me

O restore agora tem duas etapas:

```txt
1. hydrate() restaura a sessao persistida do sessionStorage
2. AuthSessionHydrator chama refreshAuthenticatedProfile()
```

Com `NEXT_PUBLIC_USE_MOCKS=false`, se houver `accessToken`, o frontend valida a sessao chamando `/auth/me`.

Com `NEXT_PUBLIC_USE_MOCKS=true`, o helper nao chama `/auth/me` e preserva o fluxo demo.

Validado:

```txt
hydrateWithAuthMeRestoredProfile=true
```

## 9. Tratamento de 401

Implementado no helper:

```txt
401 -> clearSession()
401 -> remove sessionStorage
401 -> error = "Sessao invalida ou expirada. Faca login novamente."
```

Se a mensagem indicar profile autenticado nao encontrado:

```txt
error = "Perfil autenticado nao encontrado."
```

O HTTP client do Bloco 05 tambem limpa sessao em 401 protegido.

## 10. Tratamento de 403

Implementado:

```txt
403 -> nao limpar sessao
403 -> isAuthenticated permanece true
403 -> accessToken preservado
403 -> error = "Voce nao tem permissao para acessar este recurso."
```

Validacao feita com fetch simulado, pois este bloco nao deve iniciar fluxo de contratos/actions para produzir 403 real de dominio.

## 11. Seguranca e Logs

Cuidados aplicados:

- JWT completo nao foi logado.
- JWT completo nao foi exibido.
- JWT completo nao foi salvo em docs.
- JWT completo nao foi commitado.
- `localStorage` nao foi usado.
- `.env` nao foi alterado.
- Nenhuma private key, signature, seed phrase ou mnemonic foi salva.
- Nenhum `console.log` sensivel permanente foi adicionado.

## 12. Preservacao do Mock Mode

Validado:

```txt
NEXT_PUBLIC_USE_MOCKS=true
```

Com mocks ligados:

- `refreshAuthenticatedProfile()` nao chama `/auth/me`;
- profile demo existente e preservado;
- wallet demo e role demo nao foram quebradas;
- nenhum JWT e exigido.

Com mocks desligados:

```txt
NEXT_PUBLIC_USE_MOCKS=false
```

o profile real vem de `/auth/me`.

## 13. Validacoes Executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=false npm run build` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=true npm run build` | OK. |
| `docker compose config` em `backend/` | OK. |
| `docker compose up -d --build` em `backend/` | OK. |
| `GET http://127.0.0.1:8000/health` | OK, HTTP 200. |
| fluxo real ate `/auth/verify` | OK, JWT recebido sem expor token. |
| `GET /auth/me` com token valido | OK, HTTP 200. |
| `GET /auth/me` sem token | OK, HTTP 401 esperado. |
| `GET /auth/me` com token invalido | OK, HTTP 401 esperado. |
| `GET /auth/me` com profile removido | OK, HTTP 401 esperado. |
| auth store atualiza profile real | OK. |
| auth store atualiza role real | OK. |
| auth store atualiza walletAddress real | OK. |
| sessionStorage atualiza profile real | OK. |
| 401 limpa sessao | OK. |
| 403 preserva sessao | OK, validado com fetch simulado. |
| hydrate/restore com `/auth/me` | OK. |
| `NEXT_PUBLIC_USE_MOCKS=true` | OK, nao chama `/auth/me`. |
| `NEXT_PUBLIC_USE_MOCKS=false` | OK, usa `/auth/me`. |
| `git status` | Executado. |

## 14. Pendencias para Proximos Blocos

Pendencias esperadas:

- substituir usos visuais do perfil demo pelo profile real em modo API no Bloco 07;
- integrar contratos reais no Bloco 08;
- integrar actions reais no Bloco 09;
- integrar eventos/timeline/auditoria no Bloco 10;
- tratar blockchain indisponivel no Bloco 11;
- executar teste ponta a ponta completo no Bloco 12.

## 15. Conclusao Tecnica

O Bloco 06 esta concluido tecnicamente.

`/auth/me` agora valida o JWT, confirma o profile real no backend e atualiza a auth store/session com `profile`, `role` e `walletAddress` reais. O restore/hydrate tambem valida a sessao com `/auth/me` quando o modo API real esta ativo.
