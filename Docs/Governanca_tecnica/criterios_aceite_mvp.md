# FiscalizaPay Web3 — Critérios de Aceite do MVP

> **Referência:** `Docs/decisoes_tecnicas_finais.md` | `Docs/analises/fiscalizapay_analise_coerencia_session_two.md`  
> **Uso:** checklist de prontidão antes da apresentação/demo

Este documento define os critérios mínimos que o MVP precisa atender para ser considerado completo e apresentável.

---

## 1. Escopo Oficial do MVP

### 1.1 MVP Obrigatório

Funcionalidades sem as quais o projeto **não pode** ser apresentado:

```txt
[  ] Criar contrato
[  ] Listar contratos
[  ] Visualizar detalhe do contrato
[  ] Confirmar envio (Fornecedor)
[  ] Confirmar entrega (Entregador)
[  ] Validar recebimento (Fiscal)
[  ] Autorizar pagamento (Gestor)
[  ] Abrir disputa (role autorizada)
[  ] Simular fraude por hash
[  ] Exibir timeline auditável
[  ] Exibir documentHash
[  ] Exibir transactionHash quando existir
[  ] Conectar wallet visualmente (RainbowKit)
```

### 1.2 MVP Diferencial

Funcionalidades que elevam a qualidade da apresentação:

```txt
[  ] Link para block explorer da testnet
[  ] Status visual por perfil (PermissionGate)
[  ] Dashboard com métricas (total, por status, em disputa)
[  ] Feedbacks animados com Framer Motion
[  ] Mocks controlados com mesmo formato da API
```

### 1.3 Pós-MVP

Funcionalidades que **não devem ser incluídas** no MVP, apenas documentadas:

```txt
[  ] Upload real de documentos (binário)
[  ] Autenticação Web3 completa (assinatura + JWT)
[  ] Relatórios PDF
[  ] Auditoria avançada com exportação
[  ] Score de risco de fornecedor
[  ] Integração com sistemas públicos (SIAFI, COMPRASNET)
[  ] Assinatura digital avançada (ICP-Brasil)
[  ] Permissões institucionais complexas
[  ] Multi-contrato por órgão
[  ] Painel analítico com gráficos avançados
```

---

## 2. Critérios de Produto

O MVP resolve o problema central quando:

- [ ] Um gestor consegue criar um contrato público com dados básicos.
- [ ] O fluxo completo pode ser executado: criação → envio → entrega → validação → pagamento.
- [ ] O pagamento **não pode** ser autorizado antes da validação do fiscal.
- [ ] Uma disputa **bloqueia** o pagamento de forma demonstrável.
- [ ] A simulação de fraude por hash divergente gera uma disputa e bloqueia o pagamento.
- [ ] A timeline exibe o histórico completo de eventos com timestamps.
- [ ] Pelo menos um evento crítico gera registro rastreável (hash ou tx hash).
- [ ] A proposta central está demonstrável em menos de 5 minutos de demo.

---

## 3. Critérios de Frontend

O frontend está pronto quando:

- [ ] O projeto Next.js App Router está configurado com TypeScript.
- [ ] TailwindCSS, shadcn/ui e Framer Motion estão configurados.
- [ ] A estrutura Feature-Sliced Design (app/pages/widgets/features/entities/shared) existe.
- [ ] O design system dark (#050816, #0F172A, #22D3EE) está aplicado.
- [ ] O dashboard exibe métricas (total de contratos por status).
- [ ] A listagem de contratos funciona com filtro por status.
- [ ] O detalhe do contrato exibe dados, status, atores e timeline.
- [ ] O painel de ações exibe botões corretos por status e perfil.
- [ ] A timeline exibe eventos em ordem cronológica com tipo, responsável, hash.
- [ ] Os badges de status têm cores corretas:
  - CRIADO → default/cinza
  - ENVIADO → azul info
  - ENTREGUE → amarelo warning
  - VALIDADO → verde success
  - PAGAMENTO_AUTORIZADO → verde success
  - DISPUTA → vermelho danger
- [ ] A tela de disputa exibe motivo e status bloqueado.
- [ ] A simulação de fraude exibe comparação de hashes e alerta visual.
- [ ] A conexão de wallet (RainbowKit) funciona e exibe o endereço.
- [ ] Os estados de loading, error e empty estão implementados.
- [ ] Os formulários validam com React Hook Form + Zod.
- [ ] Os mocks seguem exatamente o formato da API.
- [ ] A variável `NEXT_PUBLIC_ENABLE_MOCKS=true` ativa os mocks.
- [ ] A aplicação está responsiva (desktop prioritário, tablet aceitável).

---

## 4. Critérios de Backend

O backend está pronto quando:

- [ ] O servidor NestJS/Node.js está rodando e acessível.
- [ ] O banco Supabase/PostgreSQL está configurado.
- [ ] As tabelas `contracts`, `contract_events` e `profiles` existem.
- [ ] Os endpoints oficiais respondem corretamente:
  - `GET /dashboard/summary`
  - `GET /contracts`
  - `POST /contracts`
  - `GET /contracts/:id`
  - `PATCH /contracts/:id`
  - `DELETE /contracts/:id`
  - `GET /contracts/:id/events`
  - `POST /contracts/:id/confirm-shipment`
  - `POST /contracts/:id/confirm-delivery`
  - `POST /contracts/:id/validate-receipt`
  - `POST /contracts/:id/authorize-payment`
  - `POST /contracts/:id/open-dispute`
  - `POST /contracts/:id/simulate-fraud`
  - `GET /contracts/:id/blockchain-status`
  - `POST /contracts/:id/register-on-chain`
- [ ] Transições de status fora de ordem retornam erro `INVALID_STATUS_TRANSITION`.
- [ ] A API retorna dados em camelCase.
- [ ] Os eventos são criados automaticamente a cada ação do fluxo.
- [ ] A simulação de fraude compara hashes e abre disputa automaticamente.
- [ ] O padrão de resposta de sucesso `{ data, message? }` está aplicado.
- [ ] O padrão de resposta de erro `{ message, code, details? }` está aplicado.
- [ ] CORS está configurado para aceitar o frontend.
- [ ] Variáveis de ambiente estão configuradas e funcionando.

---

## 5. Critérios de Blockchain

A integração blockchain está aceitável para o MVP quando:

- [ ] O smart contract FiscalizaPay.sol está deployado na testnet (Polygon Amoy ou Sepolia).
- [ ] O endereço do contrato está documentado e configurado no backend.
- [ ] A ABI está disponível para o backend consumir.
- [ ] Pelo menos uma ação (ex: register-on-chain) gera um `transactionHash` real.
- [ ] O `transactionHash` é salvo no banco e retornado pela API.
- [ ] O `transactionHash` é exibido na timeline do frontend.
- [ ] O link para o block explorer é gerado a partir do `transactionHash`.

**Alternativa aceitável para hackathon:** Se o smart contract não estiver deployado no tempo, o backend pode simular um `transactionHash` fictício com formato válido (`0x` + 64 caracteres hex). Isso deve ser claramente indicado como simulação na interface.

---

## 6. Critérios de Integração

Frontend e backend estão integrados quando:

- [ ] O frontend consome a API real (não mocks) via `NEXT_PUBLIC_API_URL`.
- [ ] O dashboard exibe dados reais do banco.
- [ ] A criação de contrato persiste no banco e aparece na listagem.
- [ ] Cada ação muda o status no banco e retorna o contrato atualizado.
- [ ] A timeline exibe eventos reais do banco.
- [ ] O `documentHash` e `transactionHash` aparecem quando existem.
- [ ] Os erros da API são exibidos com mensagem amigável no frontend.
- [ ] Os estados de loading aparecem durante chamadas à API.
- [ ] A invalidade do TanStack Query funciona após mutações.

---

## 7. Critérios de Demo

A demo está pronta quando:

- [ ] É possível executar o fluxo completo ao vivo sem erros.
- [ ] A demo pode ser concluída em menos de 5 minutos.
- [ ] O efeito "uau" da simulação de fraude está funcionando.
- [ ] A timeline visual está clara e impressionante.
- [ ] O bloqueio do pagamento por disputa fica visualmente óbvio.
- [ ] A conexão de wallet MetaMask funciona ao vivo.
- [ ] Existe um plano B caso o backend caia (mocks ativados).
- [ ] Os dados de exemplo (contrato + eventos) estão pré-carregados para demo.
- [ ] O hash exibido na timeline é real ou claramente simulado.
- [ ] O link para o explorer leva a uma transação real (ou está bem sinalizado como simulação).

---

## 8. Critérios de Documentação

A documentação está adequada quando:

- [ ] O README explica o projeto, o problema e a solução.
- [ ] O README tem instruções claras de como rodar o frontend.
- [ ] O README tem instruções claras de como rodar o backend.
- [ ] O README tem instruções claras de como rodar o smart contract.
- [ ] O README tem as variáveis de ambiente necessárias.
- [ ] Os documentos do projeto estão organizados na pasta `docs/`.
- [ ] O contrato de API está documentado (`contrato_api_frontend_backend.md`).

---

## 9. Definition of Done

Um contrato de implementação é considerado **done** quando:

```txt
[ ] O código está escrito e funcional.
[ ] A funcionalidade pode ser testada manualmente de ponta a ponta.
[ ] Os estados de loading/error/empty estão implementados (frontend).
[ ] A regra de negócio está validada no backend (não só no frontend).
[ ] Os eventos são criados no banco para cada ação.
[ ] O padrão camelCase (API) e snake_case (banco) está respeitado.
[ ] Os status e event types usam apenas os valores oficiais em português.
[ ] O item está demonstrável na demo sem intervenção manual.
```

---

## 10. Checklist Final de Prontidão para Apresentação

Execute este checklist antes da apresentação:

```txt
[ ] Frontend rodando em produção (Vercel).
[ ] Backend rodando em produção (Render/Railway).
[ ] Banco conectado e populado com dados de exemplo.
[ ] Smart contract deployado (ou simulação clara preparada).
[ ] Variáveis de ambiente de produção configuradas.
[ ] Fluxo feliz testado do início ao fim.
[ ] Disputa testada e bloqueando pagamento.
[ ] Simulação de fraude testada e mostrando alerta.
[ ] Wallet conectando com MetaMask.
[ ] Timeline exibindo todos os eventos.
[ ] README atualizado e correto.
[ ] Roteiro da demo ensaiado.
[ ] Plano B preparado (mocks ativados caso necessário).
[ ] Todos os membros sabem qual parte apresentar.
```

---

*Documento criado na Session Two de Coerência — 2026-05-28*
