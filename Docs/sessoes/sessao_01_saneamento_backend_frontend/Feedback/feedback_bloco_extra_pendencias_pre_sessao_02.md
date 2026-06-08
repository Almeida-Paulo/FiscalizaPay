# Feedback - Bloco Extra: Pendencias Pre-Sessao 02

## 1. Resumo do que foi feito

Foi executado o Bloco Extra de transicao entre a Sessao 01 - Saneamento Backend/Frontend e a Sessao 02 - Integracao Backend + Frontend.

O foco foi revisar as pendencias P2, P3 e P4 registradas no relatorio de prontidao, resolver o que era seguro, documentar o que deve migrar para as proximas sessoes e preparar tecnicamente o inicio do fluxo de auth real:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```

Nao foi iniciada integracao de contracts/actions/audit, nao houve deploy, nao houve blockchain real e nao foram aplicados fixes automaticos de dependencias.

## 2. Arquivos criados

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/pendencias_pre_sessao_02.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_extra_pendencias_pre_sessao_02.md
```

## 3. Arquivos alterados

```txt
backend/README.md
```

Alteracao aplicada:

- Padronizado comando oficial de seed para `docker compose exec -T api python -m scripts.seed_demo_profiles`.
- Documentada alternativa: `docker compose exec -T api sh -c "PYTHONPATH=/app python scripts/seed_demo_profiles.py"`.

## 4. Pendencias P2 analisadas

| Pendencia | Resultado |
|---|---|
| Auth wallet/JWT no frontend | Migrada para Sessao 02 - Bloco 01. Criar `auth-api`, store de sessao, hooks de login e Bearer. |
| `/auth/nonce` e `/auth/verify` | Contrato real mapeado a partir do backend. |
| Assinatura com wallet | Estrategia definida com wagmi/viem, assinando exatamente `data.message`. |
| Persistencia JWT | Estrategia definida com Zustand + `sessionStorage`. |
| Authorization Bearer | Estrategia definida para injecao central no `httpClient`, preservando requests publicas. |
| Endpoints protegidos | Checklist criado com roles, status e wallet vinculada. |
| Perfis demo duplicados | DECISAO: manter perfis separados com propositos distintos ate auth real substituir a sessao visual. |

## 5. Pendencias P3 analisadas

| Pendencia | Resultado |
|---|---|
| Comando oficial de seed | Resolvido no README do backend e validado via container. |
| `NEXT_PUBLIC_USE_MOCKS=false` | Variavel existe; validacao completa migrada para Sessao 02 apos auth. |
| Console limpo e 401/403 | `handle-api-error.ts` ja mapeia 401/403; teste visual migrado para Sessao 02. |
| Update/delete | Backend e client existem; UI nao expoe fluxo principal agora. |
| Documentos antigos com wallets/placeholders | Feedback historico mantido; contrato tecnico antigo deve ser atualizado/regenerado na Sessao 02. |
| Processo externo em `127.0.0.1:3000` | Confirmado; padrao oficial permanece `http://localhost:3000`. |
| `npm audit` | 24 vulnerabilidades moderadas; sem `audit fix --force`; migrado para bloco de seguranca/deploy. |

## 6. Pendencias P4 analisadas

| Pendencia | Resultado |
|---|---|
| Estrutura DDAD futura | Convencao definida para proximas sessoes: `planejamento/blocos/`, `Feedback/`, `bugs/`, `analises/`. |
| `web/package-lock.json` | Investigado; sem diff de conteudo, hash igual ao indice e status limpo apos refresh. Nao commitado. |
| Centralizar wallets demo | Adiado para depois da auth, para evitar refatoracao antes da integracao. |
| Warnings PostgreSQL | Migrados para Sessao 03/preparacao de producao. |

## 7. Itens resolvidos

- Seed oficial padronizado no README do backend.
- Alternativa de seed com `PYTHONPATH` documentada.
- Contrato de auth documentado.
- Estrategia de Auth/JWT definida.
- Estrategia de Authorization Bearer definida.
- Decisao sobre perfis demo documentada.
- `package-lock` investigado e limpo sem alteracao de conteudo.
- Ambiente local revalidado.

## 8. Itens migrados para Sessao 02

- Implementar `auth-api` frontend.
- Implementar store de sessao/auth.
- Integrar assinatura via wagmi/viem.
- Persistir JWT e perfil autenticado.
- Injetar Bearer no `httpClient`.
- Validar `/auth/me`.
- Ativar e validar `NEXT_PUBLIC_USE_MOCKS=false`.
- Testar endpoints protegidos com role, status e wallet vinculada.
- Atualizar/regenerar contrato tecnico frontend/backend antigo.
- Revisar update/delete se forem expostos na UI.

## 9. Itens migrados para Sessao 03

- Revisar vulnerabilidades moderadas do `npm audit` antes de deploy.
- Revisar warnings locais do PostgreSQL em contexto de producao.
- Revisar seed demo em staging/producao.
- Revisar variaveis finais e docs de deploy.

## 10. Validacoes executadas

| Validacao | Resultado |
|---|---|
| `npm run lint` | OK. |
| `npm run build` | OK. |
| `docker compose config` | OK. |
| `docker compose up -d --build` | OK. |
| `GET /health` | OK, HTTP 200. |
| `npm audit` | Executado; 24 vulnerabilidades moderadas. |
| `git status` | Executado; pendencias antigas nao relacionadas permanecem fora do escopo. |
| `git diff -- web/package-lock.json` | Sem diff de conteudo. |
| Seed oficial | OK via `docker compose exec -T api python -m scripts.seed_demo_profiles`. |
| `/auth/nonce` | OK, HTTP 200 com `walletAddress`, `nonce`, `message`, `expiresAt`. |
| `/auth/me` sem Bearer | OK, HTTP 401 esperado. |
| `localhost:3000` e `127.0.0.1:3000` | `localhost:3000` responde FiscalizaPay; `127.0.0.1:3000` responde outro Node local. |

## 11. Commit realizado

Commit semantico realizado para este bloco:

```txt
chore: prepara pendencias para inicio da sessao 02
```

O commit deve conter apenas:

```txt
backend/README.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/pendencias_pre_sessao_02.md
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/feedback_bloco_extra_pendencias_pre_sessao_02.md
```

## 12. Observacoes finais

A Sessao 02 deve iniciar pelo Bloco 01 - Auth API no Frontend. A integracao de contracts/actions/audit continua bloqueada ate o fluxo abaixo estar funcional:

```txt
wallet -> nonce -> assinatura -> verify -> JWT -> Authorization Bearer -> /auth/me
```
