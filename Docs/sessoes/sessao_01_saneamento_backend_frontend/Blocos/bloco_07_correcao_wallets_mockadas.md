# Bloco 07 — Correção de Wallets Mockadas

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `07`  
**Status inicial:** Planejado  
**Objetivo central:** revisar e corrigir todas as wallets mockadas utilizadas no frontend/backend para garantir que estejam em formato EVM válido e compatíveis com o fluxo futuro de autenticação por wallet.

---

# 1. Objetivo do Bloco

O objetivo deste bloco é garantir que todos os endereços de wallet usados em ambiente demo/mock estejam tecnicamente corretos.

Como o projeto FiscalizaPay Web3 utiliza autenticação baseada em wallet, assinatura EVM, nonce e JWT, qualquer wallet mockada inválida pode causar problemas na integração real com o backend.

Este bloco deve revisar, corrigir e padronizar todos os endereços mockados usados em:

```txt
- perfis demo
- usuários mockados
- contratos demo
- seed do backend
- fixtures
- mocks do frontend
- dados exibidos na interface
- testes manuais ou automatizados
```

---

# 2. Contexto Técnico

O backend espera trabalhar com wallets compatíveis com o padrão EVM.

O formato esperado é:

```txt
0x + 40 caracteres hexadecimais
```

Exemplo válido:

```txt
0x742d35Cc6634C0532925a3b844Bc454e4438f44e
```

Exemplos inválidos:

```txt
123456
wallet_gestor
0xABC
0x12345TESTE
0x000
lukas_wallet
```

Esses valores podem funcionar visualmente em modo mock, mas tendem a quebrar quando houver:

```txt
- validação de address no backend
- assinatura de mensagem
- comparação entre wallet conectada e wallet cadastrada
- geração de perfil autenticado
- filtros por wallet
- auditoria de eventos
```

---

# 3. Pré-Análise Obrigatória

Antes de alterar qualquer arquivo, o executor deve localizar onde existem wallets mockadas ou endereços similares.

Pesquisar por termos como:

```txt
wallet
address
walletAddress
wallet_address
publicAddress
public_address
owner
userWallet
mockWallet
0x
GESTOR
FISCAL
AUDITOR
FORNECEDOR
COMPRADOR
```

Verificar principalmente:

```txt
frontend/src/
frontend/app/
frontend/components/
frontend/lib/
frontend/mocks/
frontend/data/
frontend/hooks/
backend/
backend/app/
backend/scripts/
backend/seeds/
backend/tests/
```

Caso a estrutura do projeto seja diferente, adaptar a busca mantendo o mesmo objetivo.

---

# 4. Regras de Padronização

Todos os endereços mockados devem seguir o padrão:

```txt
0x + 40 caracteres hexadecimais
```

Regras obrigatórias:

```txt
[ ] Não usar textos como wallet
[ ] Não usar nomes de cargos como endereço
[ ] Não usar endereços curtos
[ ] Não usar caracteres fora de 0-9 e a-f/A-F
[ ] Não duplicar wallets entre perfis diferentes, salvo quando intencional e documentado
[ ] Manter consistência entre frontend e backend
[ ] Garantir que o mesmo perfil demo use a mesma wallet em todos os pontos
```

---

# 5. Sugestão de Wallets Mockadas

Utilizar endereços estáveis e válidos apenas para ambiente demo.

```txt
Gestor:
0x1111111111111111111111111111111111111111

Fiscal:
0x2222222222222222222222222222222222222222

Auditor:
0x3333333333333333333333333333333333333333

Fornecedor:
0x4444444444444444444444444444444444444444

Comprador:
0x5555555555555555555555555555555555555555

Entregador/Transportador:
0x6666666666666666666666666666666666666666

Admin/Demo:
0x7777777777777777777777777777777777777777
```

Observação:

```txt
Esses endereços são apenas mocks técnicos. Não devem ser tratados como carteiras reais com fundos ou uso em produção.
```

---

# 6. Implementação

## 6.1 Localizar wallets inválidas

Executar uma busca global no projeto e listar todos os pontos onde existem wallets mockadas.

Criar uma lista temporária com:

```txt
- arquivo
- linha aproximada
- valor atual
- problema encontrado
- valor sugerido
```

Exemplo:

```txt
Arquivo: src/mocks/profiles.ts
Valor atual: gestor_wallet
Problema: não é endereço EVM válido
Valor novo: 0x1111111111111111111111111111111111111111
```

---

## 6.2 Corrigir dados mockados no frontend

Corrigir arquivos de mock, dados demo e perfis visuais.

Validar possíveis campos:

```txt
wallet
address
walletAddress
profile.wallet
profile.address
connectedWallet
ownerAddress
createdByWallet
```

Garantir que a interface continue exibindo os dados corretamente.

---

## 6.3 Corrigir dados mockados no backend

Corrigir seeds, fixtures, scripts demo ou testes que usem wallets inválidas.

Verificar principalmente scripts como:

```txt
seed_demo_profiles.py
seed.py
fixtures.py
mock_data.py
```

Caso algum script gere usuários demo, garantir que os endereços usados sejam os mesmos definidos para o frontend.

---

## 6.4 Garantir consistência entre frontend e backend

A mesma role deve usar a mesma wallet em todos os pontos do projeto.

Exemplo:

```txt
GESTOR no frontend = 0x1111111111111111111111111111111111111111
GESTOR no backend = 0x1111111111111111111111111111111111111111
```

Essa consistência é importante para a próxima sessão, onde será implementado login real com wallet e JWT.

---

## 6.5 Documentar tabela de wallets demo

Criar ou atualizar uma documentação simples com a tabela de wallets demo.

Arquivo sugerido:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/analises/wallets_demo_padronizadas.md
```

Conteúdo mínimo:

```txt
# Wallets Demo Padronizadas

| Perfil | Role | Wallet Demo | Uso |
|---|---|---|---|
| Gestor | GESTOR | 0x1111111111111111111111111111111111111111 | Demo/Auth futura |
| Fiscal | FISCAL | 0x2222222222222222222222222222222222222222 | Demo/Auth futura |
| Auditor | AUDITOR | 0x3333333333333333333333333333333333333333 | Demo/Auth futura |
| Fornecedor | FORNECEDOR | 0x4444444444444444444444444444444444444444 | Demo/Auth futura |
| Comprador | COMPRADOR | 0x5555555555555555555555555555555555555555 | Demo/Auth futura |
```

---

# 7. Validação

Após aplicar as correções, validar:

```txt
[ ] Frontend inicia sem erro
[ ] Backend inicia sem erro
[ ] Seeds/scripts demo executam sem erro
[ ] Não existem wallets mockadas em formato inválido
[ ] Perfis demo aparecem corretamente na interface
[ ] Roles continuam corretas
[ ] Contratos demo continuam vinculados aos perfis corretos
[ ] Não houve quebra de tipagem
[ ] Não houve quebra em telas que exibem wallet
```

Comandos sugeridos, adaptar conforme stack real:

```bash
npm run lint
npm run build
npm run dev
```

```bash
pytest
python scripts/seed_demo_profiles.py
```

Caso não existam testes automatizados, registrar no feedback que a validação foi manual.

---

# 8. Critérios de Aceite

O bloco será considerado concluído quando:

```txt
[ ] Todas as wallets mockadas forem EVM válidas
[ ] Não houver wallets textuais inválidas como gestor_wallet ou fiscal_wallet
[ ] Frontend e backend estiverem usando a mesma tabela de wallets demo
[ ] Seeds ou fixtures estiverem corrigidos
[ ] Perfis demo continuarem funcionando
[ ] Contratos demo continuarem coerentes
[ ] Documentação de wallets demo for criada ou atualizada
[ ] Validação técnica for registrada
[ ] Commit semântico for criado
[ ] Feedback final do bloco for salvo na pasta Feedback
```

---

# 9. Riscos

## 9.1 Quebra de vínculo entre perfil e contrato

Se a wallet de um perfil for alterada no frontend, mas não for alterada no backend ou nos contratos demo, pode haver inconsistência na interface.

Mitigação:

```txt
Atualizar a mesma wallet em todos os arquivos relacionados.
```

---

## 9.2 Duplicidade de wallets

Se dois perfis diferentes usarem a mesma wallet, o backend pode identificar o usuário errado no fluxo de autenticação.

Mitigação:

```txt
Garantir uma wallet única por perfil/role demo.
```

---

## 9.3 Uso indevido em produção

Wallets mockadas não devem ser usadas como dados reais de produção.

Mitigação:

```txt
Documentar claramente que são endereços para demo/staging/mock.
```

---

# 10. Commit Obrigatório ao Final do Bloco

Ao finalizar todas as implementações e validações deste bloco, deve ser feito um commit semântico.

Sugestão de commit:

```bash
git add .
git commit -m "fix: padroniza wallets mockadas da sessao 01"
```

Caso o bloco gere apenas documentação e análise, usar:

```bash
git add .
git commit -m "docs: documenta padronizacao de wallets mockadas"
```

O commit deve acontecer somente depois de:

```txt
[ ] alterações concluídas
[ ] validações executadas
[ ] documentação atualizada
[ ] feedback criado
```

---

# 11. Feedback Obrigatório do Bloco

Ao final do bloco, gerar um arquivo `.md` de feedback dentro da pasta:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/
```

Nome sugerido:

```txt
feedback_bloco_07_correcao_wallets_mockadas.md
```

Estrutura mínima do feedback:

```md
# Feedback — Bloco 07 — Correção de Wallets Mockadas

## 1. Resumo do que foi feito

Descrever as wallets revisadas, corrigidas e padronizadas.

## 2. Arquivos alterados

Listar arquivos modificados.

## 3. Wallets padronizadas

Listar tabela final de perfis e wallets.

## 4. Validações realizadas

Informar comandos executados e resultados.

## 5. Problemas encontrados

Registrar inconsistências, duplicidades ou arquivos suspeitos.

## 6. Pendências

Listar pendências, se houver.

## 7. Status final

Informar se o bloco foi concluído com sucesso ou se ficou parcialmente pendente.

## 8. Commit realizado

Informar hash ou mensagem do commit.
```

---

# 12. Definição de Pronto

Este bloco estará pronto quando o projeto não tiver mais wallets mockadas inválidas e a base estiver preparada para a autenticação real por wallet que será trabalhada na Sessão 02.

Resultado final esperado:

```txt
Wallets demo válidas, documentadas, consistentes e prontas para integração real com backend.
```
