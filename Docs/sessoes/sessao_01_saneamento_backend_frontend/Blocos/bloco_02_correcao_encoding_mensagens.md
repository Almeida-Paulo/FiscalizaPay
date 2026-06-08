# Bloco 02 — Correção de Encoding e Mensagens

## Sessão 01 — Saneamento Backend/Frontend

**Projeto:** FiscalizaPay Web3  
**Metodologia:** DDAD — Document-Driven AI Development  
**Sessão:** `sessao_01_saneamento_backend_frontend`  
**Bloco:** `bloco_02_correcao_encoding_mensagens`  
**Objetivo central:** corrigir textos quebrados, caracteres inválidos, mensagens inconsistentes e problemas de encoding no backend, frontend e documentação técnica.

---

# 1. Contexto do Bloco

Após o diagnóstico técnico inicial, o próximo passo da Sessão 01 é garantir que o projeto esteja limpo, legível e confiável em relação a textos, mensagens, documentação e arquivos de configuração.

Problemas de encoding podem gerar:

```txt
- textos quebrados na interface
- mensagens de erro ilegíveis
- documentação com caracteres inválidos
- inconsistência entre português, inglês e termos técnicos
- dificuldade de manutenção
- impressão de baixa qualidade na entrega do MVP
```

Este bloco não deve alterar regra de negócio, autenticação, banco, integração, blockchain ou layout estrutural. O foco é exclusivamente saneamento textual e normalização de arquivos.

---

# 2. Objetivos do Bloco

## 2.1 Objetivo Principal

Corrigir todos os problemas de encoding e mensagens quebradas encontrados no backend, frontend e documentação do projeto.

## 2.2 Objetivos Secundários

```txt
- Normalizar arquivos para UTF-8
- Corrigir acentuação quebrada
- Corrigir mensagens user-facing
- Corrigir textos técnicos em README/docs
- Padronizar mensagens de erro e sucesso
- Remover caracteres inválidos ou símbolos quebrados
- Garantir consistência textual entre frontend e backend
- Evitar alteração indevida de lógica funcional
```

---

# 3. Escopo do Bloco

## 3.1 Incluído no Escopo

```txt
- Backend
- Frontend
- README
- Documentações técnicas
- Mensagens de erro
- Mensagens de sucesso
- Labels visuais
- Toasts/alerts
- Comentários técnicos relevantes
- Strings fixas exibidas ao usuário
- Arquivos .md com texto quebrado
```

## 3.2 Fora do Escopo

```txt
- Refatoração de arquitetura
- Mudança de layout
- Criação de novas telas
- Integração frontend/backend
- Alteração de endpoints
- Alteração de banco de dados
- Alteração de autenticação
- Alteração de regra de negócio
- Implementação de blockchain
- Deploy
```

---

# 4. Pré-Análise Obrigatória

Antes de alterar arquivos, o executor deve mapear onde existem textos quebrados ou mensagens inconsistentes.

## 4.1 Verificar Backend

Analisar principalmente:

```txt
- mensagens de exceptions
- responses de API
- schemas
- services
- validators
- seed scripts
- README do backend
- arquivos .env.example, se existirem
- comentários técnicos importantes
```

Buscar exemplos como:

```txt
Ã§
Ã£
Ã¡
Ã©
Ã­
Ã³
Ãº
�
â€“
â€œ
â€
```

## 4.2 Verificar Frontend

Analisar principalmente:

```txt
- componentes React
- páginas
- hooks
- stores
- constantes
- mocks
- mensagens de toast
- mensagens de erro
- textos de botões
- labels
- placeholders
- tooltips
```

## 4.3 Verificar Documentação

Analisar principalmente:

```txt
- README.md
- docs internas
- documentos da sessão
- instruções de setup
- contratos de API documentados
```

---

# 5. Plano de Implementação

## Etapa 01 — Criar Inventário de Problemas Textuais

Antes de corrigir, listar os problemas encontrados.

Criar uma seção no feedback final contendo:

```txt
- arquivo analisado
- tipo de problema encontrado
- correção aplicada
- observação, se necessário
```

Exemplo:

```txt
Arquivo: backend/app/services/auth_service.py
Problema: mensagem com acentuação quebrada
Correção: texto normalizado para UTF-8
```

---

## Etapa 02 — Normalizar Encoding dos Arquivos

Garantir que os arquivos editados sejam salvos em:

```txt
UTF-8
```

Evitar salvar arquivos em:

```txt
ANSI
Windows-1252
ISO-8859-1
```

---

## Etapa 03 — Corrigir Mensagens do Backend

Corrigir mensagens quebradas em:

```txt
- erros de autenticação
- erros de permissão
- erros de validação
- mensagens de contrato
- mensagens de auditoria
- mensagens de blockchain indisponível
- mensagens de health/check
```

Exemplo de padrão recomendado:

```txt
Antes:
UsuÃ¡rio nÃ£o autorizado

Depois:
Usuário não autorizado
```

Ou, caso o backend esteja padronizado em inglês:

```txt
User not authorized
```

Atenção: não misturar idiomas de forma desorganizada. Se o backend já estiver majoritariamente em inglês, manter inglês técnico nas mensagens internas e português apenas onde fizer sentido para a demo.

---

## Etapa 04 — Corrigir Mensagens do Frontend

Corrigir textos exibidos ao usuário final.

Pontos obrigatórios:

```txt
- títulos
- descrições
- botões
- modais
- alerts
- toasts
- campos vazios
- mensagens de erro
- mensagens de loading
- mensagens de sucesso
```

Garantir que a linguagem seja clara para uma apresentação de MVP.

Exemplos de padrão:

```txt
Contrato criado com sucesso.
Não foi possível carregar os contratos.
Carteira conectada com sucesso.
Ação indisponível no modo demonstração.
Blockchain indisponível neste ambiente.
```

---

## Etapa 05 — Corrigir Documentações

Corrigir textos quebrados em arquivos `.md` relevantes.

Priorizar:

```txt
- README principal
- README backend
- README frontend
- documentação de setup
- documentação de API
- documentação DDAD da sessão
```

Não reescrever todo o conteúdo, apenas corrigir encoding, acentuação e clareza mínima.

---

## Etapa 06 — Padronizar Termos do Projeto

Usar termos consistentes:

```txt
FiscalizaPay Web3
backend
frontend
wallet
JWT
contrato
auditoria
blockchain
modo demonstração
modo API real
```

Evitar variações desnecessárias como:

```txt
back-end / backend misturados
front-end / frontend misturados
carteira / wallet sem critério
usuario sem acento
sistema blockchain / block chain
```

Sugestão de padrão:

```txt
backend
frontend
wallet
usuário
contrato
blockchain
```

---

# 6. Validação Obrigatória

Após as correções, validar que o projeto continua funcionando.

## 6.1 Validação Backend

Executar, se disponível:

```bash
python -m compileall .
```

Ou o comando equivalente do projeto.

Validar também:

```txt
- backend inicia sem erro
- imports não quebraram
- mensagens corrigidas não quebraram strings
- nenhum arquivo de configuração foi corrompido
```

Se o backend estiver em Docker:

```bash
docker compose up
```

E validar:

```txt
GET /health
```

---

## 6.2 Validação Frontend

Executar, se disponível:

```bash
npm run lint
npm run build
```

Ou comandos equivalentes do projeto:

```bash
pnpm lint
pnpm build
```

Validar também:

```txt
- frontend inicia sem erro
- não houve quebra de componente
- strings corrigidas aparecem corretamente
- acentuação aparece corretamente no navegador
```

---

## 6.3 Validação Visual Manual

Abrir o frontend e verificar visualmente:

```txt
- páginas principais
- modais
- botões
- mensagens de erro/sucesso
- textos de cards
- textos de perfil/wallet
- mensagens relacionadas a contratos e auditoria
```

---

# 7. Critérios de Aceite

O bloco só pode ser considerado concluído quando:

```txt
[ ] Problemas de encoding mapeados
[ ] Arquivos editados salvos em UTF-8
[ ] Mensagens quebradas do backend corrigidas
[ ] Mensagens quebradas do frontend corrigidas
[ ] Documentações principais revisadas
[ ] Termos principais padronizados
[ ] Nenhuma regra de negócio foi alterada indevidamente
[ ] Backend validado, quando aplicável
[ ] Frontend validado, quando aplicável
[ ] Build/lint executado ou justificativa registrada
[ ] Feedback final criado em Markdown
[ ] Commit semântico realizado ao final do bloco
```

---

# 8. Arquivo de Feedback Obrigatório

Ao finalizar este bloco, criar um arquivo `.md` de feedback na pasta:

```txt
Docs/sessoes/sessao_01_saneamento_backend_frontend/Feedback/
```

Nome sugerido:

```txt
feedback_bloco_02_correcao_encoding_mensagens.md
```

## 8.1 Estrutura Recomendada do Feedback

```md
# Feedback — Bloco 02 — Correção de Encoding e Mensagens

## 1. Resumo do que foi feito

## 2. Arquivos analisados

## 3. Arquivos alterados

## 4. Problemas encontrados

## 5. Correções aplicadas

## 6. Validações executadas

## 7. Pendências identificadas

## 8. Riscos ou observações

## 9. Status final do bloco

## 10. Commit realizado
```

---

# 9. Commit Obrigatório

Ao final do bloco, realizar um commit semântico com as alterações implementadas.

## 9.1 Sugestão de Commit

```bash
git add .
git commit -m "fix: corrigir encoding e mensagens do projeto"
```

Caso a alteração seja apenas documental:

```bash
git commit -m "docs: corrigir encoding e mensagens da documentação"
```

Caso envolva frontend e backend:

```bash
git commit -m "fix: normalizar mensagens e encoding no frontend e backend"
```

---

# 10. Observações Importantes para o Executor

```txt
- Não alterar lógica funcional durante este bloco.
- Não implementar integração real com backend.
- Não criar novas features.
- Não trocar identidade visual.
- Não alterar contrato de API.
- Não remover mensagens sem entender o contexto.
- Não misturar português e inglês sem padrão.
- Registrar qualquer pendência no feedback final.
```

---

# 11. Resultado Esperado

Ao final do Bloco 02, o projeto deve estar textual e tecnicamente mais limpo, com mensagens legíveis e arquivos normalizados.

Resultado esperado:

```txt
- Textos quebrados corrigidos
- Encoding normalizado
- Mensagens mais profissionais
- Documentação mais legível
- Menor risco de erro por caracteres inválidos
- Base mais limpa para seguir para o Bloco 03
```

---

# 12. Próximo Bloco

Após concluir este bloco, seguir para:

```txt
Bloco 03 — Configuração Backend .env.example
```

O Bloco 03 só deve iniciar depois que o feedback do Bloco 02 estiver criado e o commit semântico tiver sido realizado.
