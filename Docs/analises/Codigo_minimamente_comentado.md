# Codigo minimamente comentado

## Objetivo

Registrar a analise e os pontos comentados para atender ao criterio de codigo minimamente comentado do MVP.

O criterio foi tratado sem poluir o projeto com comentarios obvios. Os comentarios foram adicionados apenas onde explicam regra de negocio, seguranca, fronteira entre frontend/backend, autenticacao por wallet, mocks e blockchain.

## Cobertura aplicada

### Backend

- `backend/app/services/contracts.py`: permissoes por acao, validacao de wallet vinculada, eventos auditaveis, fluxo de status, simulacao de fraude e disponibilidade blockchain.
- `backend/app/services/auth.py`: nonce, assinatura EVM, validacao de perfil e uso unico do nonce.
- `backend/app/security.py`: normalizacao de wallet, mensagem de login, recuperacao da assinatura e emissao de JWT.
- `backend/app/deps.py`: dependencia que resolve o perfil autenticado nas rotas protegidas.
- `backend/app/serializers.py`: fronteira entre snake_case do banco e camelCase da API.
- `backend/app/main.py`: hardening por headers e TrustedHost em producao.
- `backend/app/errors.py`: padrao publico de erro da API.
- `backend/app/schemas.py`: serializacao ISO e tolerancia a claims extras no JWT.
- `backend/scripts/create_profile.py` e `backend/scripts/seed_demo_profiles.py`: uso seguro/idempotente dos scripts de perfil.

### Frontend

- `web/src/shared/api/http-client.ts`: rotas publicas, envio de Bearer token, timeout e limpeza de sessao em 401.
- `web/src/shared/api/auth-api.ts`: contrato de autenticacao por wallet e origem da role no backend.
- `web/src/features/auth-wallet/model/use-wallet-nonce-signature.ts`: fluxo MetaMask -> nonce -> assinatura -> verificacao -> JWT.
- `web/src/entities/auth/model/store.ts`: persistencia de sessao, validacao antes de gravar e hidratacao no browser.
- `web/src/entities/contract/model/rules.ts`: regras visuais, limite de seguranca do frontend e espelhamento do backend.
- `web/src/shared/api/contracts-api.ts`: adaptador mock/API real e sincronizacao de contrato com timeline.
- `web/src/shared/api/blockchain-api.ts`: contrato de leitura/escrita blockchain em mock e API real.
- `web/src/shared/api/use-protected-query-enabled.ts`: bloqueio de queries protegidas antes de haver sessao.
- `web/src/shared/config/env.ts`: normalizacao de URL de API por ambiente.
- `web/src/shared/mocks/mock-store.ts`: estado em memoria para demo.
- `web/src/features/contract-actions/ui/contract-action-panel.tsx`: separacao entre fluxo principal, auditoria/disputa e blockchain.

## Conclusao

O projeto agora possui comentarios minimos nos pontos que explicam intencao tecnica e regras centrais, sem comentar JSX simples, imports, props triviais ou codigo autoexplicativo.

Status do criterio: atendido para revisao de MVP.
