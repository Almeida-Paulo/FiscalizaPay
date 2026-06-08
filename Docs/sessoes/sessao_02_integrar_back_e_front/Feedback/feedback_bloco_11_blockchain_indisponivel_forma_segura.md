# Feedback - Bloco 11: Blockchain Indisponivel de Forma Segura

Data: 2026-06-08

## 1. Resumo do que foi feito

Foi implementado tratamento seguro para blockchain indisponivel no ambiente integrado local.

O backend agora informa quando o recurso blockchain nao esta disponivel e retorna erro controlado no `register-on-chain`. O frontend desabilita o botao de registro em modo real, exibe mensagem amigavel e nao cria links de explorer sem hash de transacao valido.

## 2. Arquivos criados

- `web/src/entities/transaction/model/helpers.ts`
- `Docs/sessoes/sessao_02_integrar_back_e_front/analises/blockchain_indisponivel_forma_segura.md`
- `Docs/sessoes/sessao_02_integrar_back_e_front/Feedback/feedback_bloco_11_blockchain_indisponivel_forma_segura.md`

## 3. Arquivos alterados

- `backend/app/schemas.py`
- `backend/app/services/contracts.py`
- `web/src/shared/api/handle-api-error.ts`
- `web/src/shared/types/api.ts`
- `web/src/entities/contract/model/types.ts`
- `web/src/entities/transaction/index.ts`
- `web/src/entities/transaction/api/use-register-on-chain.ts`
- `web/src/entities/transaction/ui/transaction-hash-link.tsx`
- `web/src/app/contracts/[id]/_components/contract-detail-page.tsx`
- `web/src/app/contracts/[id]/_components/contract-blockchain-card.tsx`
- `web/src/features/contract-actions/ui/contract-action-panel.tsx`
- `web/src/features/contract-actions/ui/register-on-chain-action.tsx`

## 4. Pontos blockchain encontrados

- `GET /contracts/{id}/blockchain-status`
- `POST /contracts/{id}/register-on-chain`
- `ContractBlockchainCard`
- `RegisterOnChainAction`
- `TransactionHashLink`
- mocks de blockchain e eventos com `transactionHash`
- variaveis `BLOCKCHAIN_ENABLED`, `CONTRACT_ADDRESS`, `NEXT_PUBLIC_CONTRACT_ADDRESS` e `NEXT_PUBLIC_EXPLORER_URL`

## 5. Status atual do backend/frontend

Backend:

- `BLOCKCHAIN_ENABLED=false`
- `CONTRACT_ADDRESS` vazio
- status blockchain retorna `blockchainAvailable=false`
- register-on-chain retorna `503 BLOCKCHAIN_UNAVAILABLE` para gestor autorizado

Frontend:

- botao de registro on-chain fica desabilitado em modo real indisponivel
- card mostra recurso blockchain em preparacao
- explorer link depende de hash EVM valido
- mock mode segue preservado

## 6. Estrategia aplicada

Foi aplicada a estrategia preferencial do bloco:

- consultar status blockchain
- desabilitar action se indisponivel
- exibir texto claro
- nao chamar endpoint quando o frontend ja sabe que esta indisponivel
- manter endpoint protegido para chamadas diretas

## 7. Tratamento de register-on-chain

Em modo API real:

- nao simula sucesso
- nao gera `transactionHash`
- nao cria evento fake
- nao marca contrato como registrado
- retorna erro controlado se chamado diretamente

Em mock mode:

- comportamento demo foi preservado
- evento/hash mock seguem restritos ao `NEXT_PUBLIC_USE_MOCKS=true`

## 8. Tratamento de UI/UX

A UI agora comunica:

```txt
Recurso blockchain em preparacao
Registro em blockchain indisponivel neste ambiente.
```

O fluxo principal do contrato continua sendo apresentado como disponivel.

## 9. Explorer e transactionHash

Foi criado helper para validar hash EVM antes de montar URL de explorer.

O explorer so aparece quando o hash atende ao formato:

```txt
0x + 64 caracteres hexadecimais
```

Sem hash valido, a UI exibe o valor para copia, mas nao cria link externo.

## 10. Tratamento de erros

O frontend trata:

- `BLOCKCHAIN_UNAVAILABLE`
- `BLOCKCHAIN_ERROR`
- `501`
- `503`
- `401`
- `403`
- `404`

Mensagem principal:

```txt
Registro em blockchain indisponivel neste ambiente.
```

## 11. Preservacao do mock mode

`NEXT_PUBLIC_USE_MOCKS=true` continua usando mocks de blockchain.

`NEXT_PUBLIC_USE_MOCKS=false` usa apenas API real e nao cai para mock quando blockchain esta indisponivel.

## 12. Impacto no fluxo principal

Validado que os seguintes fluxos continuam funcionando:

- `/auth/me`
- listagem de contratos
- detalhe de contrato
- eventos/timeline
- auditoria
- action real `confirm-shipment`

## 13. Validacoes executadas

| Validacao | Resultado |
| --- | --- |
| `npm run lint` | OK |
| `npm run build` com `NEXT_PUBLIC_USE_MOCKS=false` | OK |
| `npm run build` com `NEXT_PUBLIC_USE_MOCKS=true` | OK |
| `docker compose config` | OK |
| `docker compose up -d --build` | OK |
| `GET /health` | OK |
| fluxo real ate `/auth/me` | OK |
| `GET /contracts` | OK |
| `GET /contracts/{id}` | OK |
| `GET /contracts/{id}/blockchain-status` | `200`, indisponivel |
| `POST /contracts/{id}/register-on-chain` com gestor | `503 BLOCKCHAIN_UNAVAILABLE` |
| `POST /contracts/{id}/register-on-chain` com auditor | `403 UNAUTHORIZED_ROLE` |
| register sem token/token invalido | `401` |
| register contrato inexistente | `404` |
| action real apos indisponibilidade | OK |
| timeline/auditoria apos action | OK |
| hash fake em modo real | nao encontrado |

## 14. Pendencias encontradas

- Blockchain real segue fora de escopo.
- `BLOCKCHAIN_ENABLED=true` nao deve ser usado ate existir contrato real.
- `CONTRACT_ADDRESS` continua vazio por decisao correta do bloco.
- Teste visual automatizado do botao desabilitado pode entrar em etapa futura.

## 15. Commit realizado

Commit semantico deste bloco:

```txt
fix: tratar blockchain indisponivel de forma segura
```

## 16. Observacoes para o proximo bloco

O Bloco 12 pode validar ponta a ponta assumindo que blockchain indisponivel nao bloqueia o MVP integrado.

O fluxo principal esta preservado e o registro on-chain real continua propositalmente desabilitado.
