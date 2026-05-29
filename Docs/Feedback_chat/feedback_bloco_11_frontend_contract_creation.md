# Feedback Bloco 11 — Cadastro de Contrato

## 1. Objetivo do bloco

Implementar o formulário de criação de contrato em `/contracts/new`, substituindo o placeholder do Bloco 8. O formulário usa React Hook Form + Zod, valida todos os campos e redireciona para `/contracts` após sucesso.

---

## 2. Documentos lidos

- `Docs/Feedback_chat/feedback_bloco_10_frontend_contracts_listing.md` — padrão de arquitetura, decisão sobre `src/pages/`
- `Docs/Cronograma/Tasks_Frontend_implementation.md` — seção Bloco 11
- `Docs/Contratos_tecnicos/contrato_api_frontend_backend.md` — shape de `CreateContractPayload`
- `web/node_modules/next/dist/docs/01-app/02-guides/forms.md` — Server Actions (descartado; usamos Client Component + mutation)
- `web/node_modules/next/dist/docs/01-app/02-guides/redirecting.md` — confirmado `useRouter` para redirect client-side

---

## 3. Arquivos criados

```txt
web/src/features/create-contract/model/create-contract-schema.ts
web/src/features/create-contract/ui/create-contract-form.tsx
web/src/features/create-contract/index.ts
web/src/app/contracts/new/_components/create-contract-page.tsx
```

---

## 4. Arquivos alterados

```txt
web/src/app/contracts/new/page.tsx     → substituído placeholder por delegação para CreateContractPage
web/README.md                          → seção "Cadastro de contrato" adicionada; stale path corrigido
Docs/Cronograma/Tasks_Frontend_implementation.md → Bloco 11 marcado como concluído
```

---

## 5. Componentes implementados

### createContractSchema
`features/create-contract/model/create-contract-schema.ts` — schema Zod v4. Valida:
- `contractNumber`: string, mín. 3 chars
- `publicAgency`: string, obrigatório
- `supplierName`: string, obrigatório
- `supplierWallet`: string, regex `^0x[a-fA-F0-9]{40}$` (vazio permitido)
- `object`: string, mín. 10 chars
- `amount`: `z.number().positive()` — usa `valueAsNumber: true` no RHF para conversão HTML→number
- `deadline`: string, obrigatório
- `inspectorName`: string, obrigatório
- `inspectorWallet`: wallet opcional
- `logisticsResponsible`: string, obrigatório
- `logisticsWallet`: wallet opcional
- `managerName`: string (vazio = sem gestor)
- `managerWallet`: wallet opcional
- `documentHash`: string, mín. 16 chars se preenchido

### CreateContractForm
`features/create-contract/ui/create-contract-form.tsx` — Client Component com RHF + zodResolver. Organiza os campos em 6 `Card` seções:
1. Dados do contrato (contractNumber, publicAgency, amount, deadline, object)
2. Fornecedor (supplierName, supplierWallet)
3. Fiscal (inspectorName, inspectorWallet)
4. Logística (logisticsResponsible, logisticsWallet)
5. Gestor (opcional: managerName, managerWallet)
6. Hash do documento (opcional: documentHash)

Cada campo usa o componente `Field` interno (label + input + mensagem de erro em `text-danger`). Os inputs usam `aria-invalid` para estilização de erro (suportado pelo shadcn/ui `Input` e `Textarea`).

Botões: "Cancelar" (→ `/contracts`) e "Criar contrato" (submit). Estado loading: `mutation.isPending` → texto "Salvando..." + `disabled`.

Função `toPayload` converte `CreateContractFormData` → `CreateContractPayload`: campos opcionais vazios viram `undefined`, deadline recebe sufixo `T23:59:59.000Z`.

### CreateContractPage
`app/contracts/new/_components/create-contract-page.tsx` — Client Component de layout. Compõe `PageHeader` com botão "← Voltar" e `CreateContractForm` limitado a `max-w-3xl`.

---

## 6. Página /contracts/new

**Arquitetura:**
```
app/contracts/new/page.tsx                        → Server Component (delegação)
app/contracts/new/_components/create-contract-page.tsx → Client Component (layout)
features/create-contract/ui/create-contract-form.tsx   → Client Component (form + estado)
```

A rota `app/contracts/new/page.tsx` é um Server Component puro.

---

## 7. Fluxo de submit

1. Usuário preenche o formulário
2. RHF valida com `zodResolver(createContractSchema)` — erros exibidos campo a campo
3. `handleSubmit(onSubmit)` chama `mutation.mutate(toPayload(data), { onSuccess: () => router.push('/contracts') })`
4. `useCreateContract()` exibe `toast.success` em sucesso / `toast.error` em falha
5. Em sucesso: redirect para `/contracts`

---

## 8. Problemas encontrados

### Problema 1 — `invalid_type_error` não existe em Zod v4

O projeto usa Zod v4.4.3. Em Zod v3 o parâmetro era `{ invalid_type_error: "..." }`; em Zod v4 o parâmetro é `{ error: "..." }`. Ao usar `{ invalid_type_error: "..." }`, o TypeScript emitiu erro de build:

```
Type error: Object literal may only specify known properties, and 'invalid_type_error' does not exist in type ...
```

**Solução:** Removido o parâmetro customizado de tipo — a mensagem de validação principal fica em `.positive("Valor deve ser maior que zero.")`.

### Problema 2 — `z.coerce.number()` incompatível com `@hookform/resolvers` em Zod v4

`z.coerce.number()` em Zod v4 tem tipo de entrada `unknown` (aceita qualquer valor). O `zodResolver` para Zod v4 usa `z4.input<T>` para tipar o formulário, resultando em `amount: unknown`. Isso gerou conflito de tipos com `useForm<CreateContractFormData>`:

```
Type 'Resolver<{ ..., amount: unknown, ... }>' is not assignable to type 'Resolver<{ ..., amount: number, ... }>'
```

**Solução:** Substituído `z.coerce.number()` por `z.number()` + `{ valueAsNumber: true }` em `register("amount")`. O RHF com `valueAsNumber: true` converte o valor do HTML input para number antes de passar ao resolver. Isso mantém `amount: number` no schema sem coerção implícita.

### Problema 3 — `.default("")` divide tipos de entrada e saída em Zod v4

`z.string().default("")` em Zod v4 produz tipo de entrada `string | undefined` e tipo de saída `string`. O `zodResolver` usa o tipo de entrada; `z.infer<typeof schema>` usa o tipo de saída. O mismatch gerou conflito de tipos:

```
Type 'string | undefined' is not assignable to type 'string'.
```

**Solução:** Removido `.default("")` do schema. Os valores padrão são declarados em `defaultValues` do `useForm`, que é o lugar correto para isso em RHF.

---

## 9. Validações executadas

| Check | Resultado |
|---|---|
| `npm run lint` | ✅ 0 erros, 0 warnings |
| `npm run build` | ✅ Turbopack — TypeScript sem erros — 7 rotas estáticas |
| `npm run dev` | Não executado (ambiente headless) |

---

## 10. Commit e push

| Item | Valor |
|---|---|
| Commit realizado | ✅ sim |
| Hash do commit | `849b194` |
| Mensagem | `feat(frontend): implement contract creation form` |
| Push realizado | ✅ sim |
| Branch | `main` |
| Remote | `origin/main` |
| Arquivos no commit | 7 (4 criados, 3 alterados) |

---

## 11. Pendências para o Bloco 12

- Página de detalhe do contrato em `/contracts/[id]`
- Resumo principal do contrato (status em destaque, partes envolvidas, valor/prazo)
- Próxima ação sugerida (`getNextContractAction`)
- Painel de ações (botões por status + role: confirmar envio, entrega, validar, autorizar pagamento, abrir disputa)
- Timeline auditável de eventos (`useContractEvents`)
- Área de hashes (documentHash) e transactionHash
- Link para block explorer
- Alerta de disputa
- Integração blockchain (`useBlockchainStatus`, `useRegisterOnChain`)
- Loading/error/not-found states

---

## 12. Veredito

**Bloco 11 está concluído e aprovado para avançar para o Bloco 12.**

Todos os critérios de aceite foram atendidos:
- `/contracts/new` implementado com formulário real
- `useCreateContract()` consumido sem fetch direto
- RHF + zodResolver funcionando com Zod v4
- Todos os 14 campos de `CreateContractPayload` presentes
- Validações por campo: obrigatório, valor positivo, wallet regex, tamanho mínimo
- Mensagens de erro em português, abaixo de cada campo
- Toast de sucesso (via `useCreateContract`) + redirect para `/contracts`
- Loading no botão de submit
- Layout responsivo com seções agrupadas em Cards
- `npm run lint`: PASSOU
- `npm run build`: PASSOU
- Commit `849b194` e push realizados
- Backend e smart contract não foram alterados
