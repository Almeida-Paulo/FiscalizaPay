# Blockchain Indisponivel de Forma Segura - Bloco 11

Data: 2026-06-08

## 1. Resumo Executivo

O Bloco 11 tratou a indisponibilidade de blockchain como uma limitacao controlada do ambiente integrado local.

O backend agora informa explicitamente, em `GET /contracts/{id}/blockchain-status`, se o recurso blockchain esta disponivel. Com `BLOCKCHAIN_ENABLED=false` e `CONTRACT_ADDRESS` vazio, o endpoint retorna `blockchainAvailable=false`, `registeredOnChain=false` e uma mensagem amigavel.

O frontend usa esse status para desabilitar `register-on-chain` em modo API real, exibir estado de preparacao e impedir links para explorer quando nao ha hash de transacao EVM valido.

Nenhum smart contract real foi implementado, nenhum `CONTRACT_ADDRESS` foi inventado e nenhum `transactionHash` fake e gerado em modo API real.

## 2. Arquivos Analisados

- `backend/app/config.py`
- `backend/app/schemas.py`
- `backend/app/services/contracts.py`
- `backend/app/routers/contracts.py`
- `backend/app/models.py`
- `web/src/shared/config/env.ts`
- `web/src/shared/api/blockchain-api.ts`
- `web/src/shared/api/handle-api-error.ts`
- `web/src/shared/types/api.ts`
- `web/src/shared/mocks/blockchain.mock.ts`
- `web/src/shared/mocks/mock-store.ts`
- `web/src/entities/contract/model/types.ts`
- `web/src/entities/transaction/api/use-blockchain-status.ts`
- `web/src/entities/transaction/api/use-register-on-chain.ts`
- `web/src/entities/transaction/ui/transaction-hash-link.tsx`
- `web/src/app/contracts/[id]/_components/contract-detail-page.tsx`
- `web/src/app/contracts/[id]/_components/contract-blockchain-card.tsx`
- `web/src/app/contracts/[id]/_components/contract-hashes-card.tsx`
- `web/src/features/contract-actions/ui/contract-action-panel.tsx`
- `web/src/features/contract-actions/ui/register-on-chain-action.tsx`

## 3. Pontos Blockchain Encontrados

Backend:

- `GET /contracts/{id}/blockchain-status`
- `POST /contracts/{id}/register-on-chain`
- `BLOCKCHAIN_ENABLED=false`
- `CONTRACT_ADDRESS=""`
- campos `transaction_hash`, `blockchain_timestamp` e `blockchain_contract_id`

Frontend:

- `getBlockchainStatus`
- `registerOnChain`
- `useBlockchainStatus`
- `useRegisterOnChain`
- `ContractBlockchainCard`
- `RegisterOnChainAction`
- `TransactionHashLink`
- mocks de status/eventos blockchain

## 4. Status Atual do Backend

`GET /contracts/{id}/blockchain-status` existe, exige JWT e retorna status de leitura do contrato.

Com o ambiente atual:

```txt
BLOCKCHAIN_ENABLED=false
CONTRACT_ADDRESS vazio
```

o retorno esperado inclui:

```ts
{
  registeredOnChain: false,
  blockchainAvailable: false,
  unavailableReason: "Registro em blockchain indisponivel neste ambiente."
}
```

`POST /contracts/{id}/register-on-chain` existe, exige JWT e segue validando permissao do gestor. Quando o usuario autorizado chama o endpoint com blockchain indisponivel, o backend retorna:

```txt
503 BLOCKCHAIN_UNAVAILABLE
```

Usuario sem permissao continua recebendo:

```txt
403 UNAUTHORIZED_ROLE
```

Contrato inexistente continua retornando:

```txt
404 NOT_FOUND
```

## 5. Status Atual do Frontend

Em `NEXT_PUBLIC_USE_MOCKS=false`:

- `getBlockchainStatus` usa API real
- `registerOnChain` usa API real
- o botao de registro fica desabilitado quando a blockchain esta indisponivel
- a UI exibe mensagem amigavel de recurso em preparacao
- explorer link so aparece quando existe hash de transacao EVM valido

Em `NEXT_PUBLIC_USE_MOCKS=true`:

- mocks de blockchain continuam funcionando
- `registerOnChain` mockado ainda pode gerar evento e hash de demo
- fluxo mockado nao foi removido

## 6. Estrategia para register-on-chain

Foi aplicada a estrategia preferencial:

- obter disponibilidade via `GET /contracts/{id}/blockchain-status`
- desabilitar o botao em modo API real quando indisponivel
- exibir motivo amigavel no proprio bloco de acao
- nao chamar o endpoint quando o frontend ja sabe que o recurso esta indisponivel
- manter o endpoint protegido e controlado para chamadas diretas

Se uma chamada direta ao endpoint ocorrer, o backend retorna 503 controlado sem alterar contrato, sem criar evento e sem criar `transactionHash`.

## 7. Tratamento de UI/UX

O card de blockchain passou a exibir:

- loading enquanto consulta status
- `Recurso blockchain em preparacao` quando `blockchainAvailable=false`
- texto informando que o fluxo principal permanece disponivel
- `Ainda nao registrado on-chain` apenas quando a blockchain estiver disponivel e o contrato ainda nao estiver registrado
- estado registrado apenas quando `registeredOnChain=true`

O botao `Registrar on-chain` passou a:

- ficar desabilitado enquanto a disponibilidade esta carregando
- ficar desabilitado quando o ambiente real nao esta configurado
- exibir motivo amigavel abaixo do botao
- manter o modal de confirmacao apenas quando a action esta habilitada

## 8. Tratamento de Erros

O handler central `getApiErrorMessage` passou a tratar:

- `BLOCKCHAIN_UNAVAILABLE`
- `BLOCKCHAIN_ERROR`
- `501`
- `503`

Mensagem principal:

```txt
Registro em blockchain indisponivel neste ambiente.
```

Demais status validados:

- `401`: token ausente/invalido
- `403`: perfil sem permissao
- `404`: contrato inexistente
- `503`: blockchain indisponivel

## 9. Explorer e Transaction Hash

Foi criado helper para validar hash de transacao EVM:

```txt
0x + 64 caracteres hexadecimais
```

O componente `TransactionHashLink` agora:

- exibe link para explorer somente com hash EVM valido
- exibe apenas texto/copiar quando o hash nao pode formar link seguro
- nao usa hash fake para montar explorer em modo real

Como o backend real nao gera `transactionHash` nesta fase, a validacao real confirmou ausencia de hash no status blockchain.

## 10. Preservacao do Mock Mode

Mock mode foi preservado.

Em `NEXT_PUBLIC_USE_MOCKS=true`, `registerOnChain` continua usando `mockStore`, podendo simular registro para demo.

Em `NEXT_PUBLIC_USE_MOCKS=false`, nao ha fallback silencioso para mock. O POST real retorna indisponibilidade controlada e nao simula sucesso.

## 11. Impacto no Fluxo Principal

O fluxo principal permanece funcionando com blockchain indisponivel:

- autenticacao
- `/auth/me`
- listagem de contratos
- criacao de contrato
- detalhe de contrato
- actions reais
- timeline real
- auditoria real

A validacao real confirmou que, apos o registro blockchain retornar 503, uma action real `confirm-shipment` continuou funcionando e atualizou timeline/auditoria.

## 12. Seguranca

Cuidados mantidos:

- nenhum JWT foi salvo em arquivo
- nenhuma assinatura foi salva em arquivo
- nenhuma private key, seed phrase ou mnemonic foi salva
- `.env` real nao foi alterado
- `CONTRACT_ADDRESS` nao foi preenchido
- `BLOCKCHAIN_ENABLED` nao foi habilitado
- nenhuma transacao on-chain real foi chamada
- nenhum `transactionHash` fake foi criado em modo API real

## 13. Validacoes Executadas

| Validacao | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` com `NEXT_PUBLIC_USE_MOCKS=false` | OK |
| `npm run build` com `NEXT_PUBLIC_USE_MOCKS=true` | OK |
| `docker compose config` | OK |
| `docker compose up -d --build` | OK |
| `docker compose ps` | API e DB ativos |
| `GET http://127.0.0.1:8000/health` | OK |
| nonce -> assinatura -> verify -> JWT | OK |
| `GET /auth/me` com token real | OK |
| `GET /contracts` com token real | OK |
| `GET /contracts/{id}` com token real | OK |
| `GET /contracts/{id}/events` com token real | OK |
| `GET /audit/events` com token real | OK |
| `GET /contracts/{id}/blockchain-status` com token real | `200` |
| `GET /contracts/{id}/blockchain-status` sem token | `401` |
| `GET /contracts/{id}/blockchain-status` com token invalido | `401` |
| `GET /contracts/{id}/blockchain-status` com id inexistente | `404` |
| `POST /contracts/{id}/register-on-chain` com gestor | `503 BLOCKCHAIN_UNAVAILABLE` |
| `POST /contracts/{id}/register-on-chain` com auditor | `403 UNAUTHORIZED_ROLE` |
| `POST /contracts/{id}/register-on-chain` sem token | `401` |
| `POST /contracts/{id}/register-on-chain` com token invalido | `401` |
| `POST /contracts/{id}/register-on-chain` com id inexistente | `404` |
| action real apos blockchain indisponivel | `200` |
| timeline apos action real | continuou funcionando |
| auditoria apos action real | continuou funcionando |
| `transactionHash` fake em modo real | nao encontrado |
| explorer sem hash real | bloqueado por validacao de hash |

## 14. Pendencias Futuras

- Implementar smart contract real em sessao propria.
- Habilitar `BLOCKCHAIN_ENABLED=true` apenas com contrato real configurado.
- Preencher `CONTRACT_ADDRESS` somente apos deploy real do contrato.
- Criar testes automatizados de UI para o estado blockchain indisponivel.
- Executar teste ponta a ponta final no Bloco 12.
- Tratar deploy/producao na Sessao 03.

## 15. Conclusao Tecnica

O Bloco 11 esta concluido: a blockchain indisponivel e tratada como limitacao controlada, sem quebrar o fluxo principal, sem simular sucesso on-chain e sem gerar hash fake em modo API real.

O backend passou a declarar a disponibilidade do recurso, o frontend usa essa informacao para bloquear `register-on-chain` com mensagem clara, e os links de explorer ficaram condicionados a hash de transacao EVM valido.
