# Roteiro para video pitch do FiscalizaPay

## Objetivo do video

Explicar em poucos minutos o problema, a solucao, o funcionamento da plataforma, o uso de blockchain e o impacto social do FiscalizaPay.

Tempo sugerido: 3 a 5 minutos.

## Mensagem central

> FiscalizaPay e uma plataforma Web3 para fiscalizar contratos publicos antes do pagamento. Ela registra cada etapa do contrato, vincula evidencias por hash, mostra uma timeline auditavel e bloqueia pagamentos quando existe disputa ou indicio de fraude.

## Estrutura do pitch

### 1. Abertura: problema real

Tempo sugerido: 30 segundos.

Fala sugerida:

> Contratos publicos movimentam muito dinheiro, mas muitas vezes a fiscalizacao acontece tarde demais. Quando uma entrega nao e comprovada, quando um documento e trocado, ou quando o pagamento e liberado sem validacao, o prejuizo ja aconteceu. O problema que o FiscalizaPay resolve e simples: como aumentar transparencia e confianca antes do dinheiro sair?

Mostrar na tela:

- dashboard ou tela inicial;
- nome FiscalizaPay;
- metricas gerais.

### 2. Solucao em uma frase

Tempo sugerido: 20 segundos.

Fala sugerida:

> O FiscalizaPay transforma cada contrato em um fluxo auditavel: criacao, envio, entrega, validacao fiscal e autorizacao de pagamento. Cada acao gera um evento, cada evidencia pode ser vinculada por hash, e a blockchain entra como camada de prova para registrar integridade.

Mostrar na tela:

- menu lateral;
- dashboard;
- cards de status.

### 3. Quem participa do fluxo

Tempo sugerido: 30 segundos.

Fala sugerida:

> O sistema trabalha com cinco perfis: gestor, fornecedor, entregador, fiscal e auditor. Cada perfil so executa as acoes compatíveis com sua responsabilidade. O gestor cria o contrato e autoriza pagamento; o fornecedor confirma envio; o entregador confirma entrega; o fiscal valida recebimento; e o auditor acompanha integridade e pode abrir disputa.

Mostrar na tela:

- perfil/wallet;
- painel de acoes;
- badges de role/status.

### 4. Demonstracao do fluxo normal

Tempo sugerido: 60 a 90 segundos.

Passos para mostrar:

1. Abrir dashboard.
2. Ir para contratos.
3. Abrir um contrato.
4. Mostrar dados principais: valor, orgao, fornecedor, status.
5. Mostrar a timeline.
6. Mostrar o painel de acoes.
7. Explicar que cada acao muda status e cria evento.

Fala sugerida:

> Aqui eu tenho a visao dos contratos fiscalizados. Ao abrir um contrato, vejo valor, orgao publico, fornecedor, responsaveis e status atual. O ponto principal e esta timeline: ela mostra quem fez cada acao, quando fez, qual era o status anterior e qual passou a ser o novo status. Isso cria uma trilha auditavel do contrato.

Complemento:

> O fluxo impede pular etapas. O pagamento so fica disponivel depois que a entrega foi confirmada e validada pelo fiscal.

### 5. Demonstracao de disputa e fraude

Tempo sugerido: 60 segundos.

Passos para mostrar:

1. Abrir um contrato com `documentHash`.
2. Usar simulacao de fraude ou explicar a acao.
3. Mostrar hash original e hash alterado.
4. Mostrar alerta de disputa.
5. Mostrar pagamento bloqueado.

Fala sugerida:

> Um diferencial e a simulacao de fraude por hash. O sistema compara o hash original do documento com um novo hash. Se houver divergencia, isso indica que a evidencia foi alterada. O FiscalizaPay registra o evento, abre disputa automaticamente e bloqueia o pagamento. Assim, a auditoria acontece antes do prejuizo.

Mostrar na tela:

- card de hash;
- alerta de disputa;
- timeline com evento de fraude/disputa.

### 6. Blockchain e smart contract

Tempo sugerido: 45 segundos.

Fala sugerida:

> A blockchain e usada como camada de prova, nao como banco de dados completo. Dados sensiveis e detalhes do contrato ficam off-chain, no banco. On-chain fica a prova de integridade: o identificador do contrato, o hash do documento, quem registrou e o timestamp. O projeto possui o smart contract `FiscalizaPayRegistry`, deployado em Sepolia, preparado para registrar esses hashes de forma imutavel.

Mostrar na tela:

- card de blockchain;
- transaction hash quando houver em mock/demo;
- link do explorer;
- opcional: abrir o explorer.

Dados para falar:

- Contrato: `FiscalizaPayRegistry`
- Rede: Sepolia
- Chain ID: `11155111`
- Endereco: `0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`
- Explorer: `https://sepolia.etherscan.io/address/0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`

Fala honesta sobre estado atual:

> A arquitetura blockchain ja esta preparada e o contrato existe. A etapa final e conectar o backend ao contrato deployado para que o registro on-chain seja executado automaticamente no fluxo real.

### 7. Impacto e valor social

Tempo sugerido: 30 segundos.

Fala sugerida:

> O valor social esta em proteger recursos publicos e tornar a fiscalizacao mais transparente. O FiscalizaPay ajuda governos, ONGs e empresas a provar que uma entrega foi conferida antes do pagamento. Ele tambem cria evidencias para auditoria posterior, reduzindo dependencia de processos manuais e documentos soltos.

Mostrar na tela:

- dashboard;
- valor total fiscalizado;
- contratos em disputa;
- auditoria.

### 8. Fechamento

Tempo sugerido: 20 segundos.

Fala sugerida:

> Em resumo, o FiscalizaPay aumenta confianca em contratos publicos porque transforma cada etapa em evidencia verificavel. Ele une fluxo de negocio, auditoria, wallet, hash e smart contract para que o pagamento so avance quando existe comprovacao.

Frase final curta:

> FiscalizaPay: pagamento publico com rastreabilidade, evidencia e confianca.

## Roteiro completo em fala corrida

> Contratos publicos movimentam muito dinheiro, mas a fiscalizacao muitas vezes acontece tarde demais. Quando uma entrega nao e comprovada ou um documento e alterado, o pagamento pode ser liberado antes que alguem perceba o problema.
>
> O FiscalizaPay resolve isso criando uma plataforma Web3 para fiscalizar contratos antes do pagamento. Cada contrato passa por um fluxo claro: criacao, envio, entrega, validacao fiscal e autorizacao de pagamento.
>
> A plataforma possui cinco perfis: gestor, fornecedor, entregador, fiscal e auditor. Cada perfil tem permissoes especificas. O gestor cria contratos e autoriza pagamentos; o fornecedor confirma envio; o entregador confirma entrega; o fiscal valida; e o auditor acompanha a integridade.
>
> Na tela de contrato, eu consigo ver todos os dados principais: valor, orgao publico, fornecedor, responsaveis, status e hashes. O ponto mais importante e a timeline auditavel. Cada acao gera um evento com responsavel, wallet, horario, status anterior e novo status.
>
> O sistema tambem bloqueia situacoes de risco. Se um documento for alterado, o hash muda. Ao simular essa divergencia, o FiscalizaPay detecta a fraude, registra o evento, abre disputa automaticamente e bloqueia o pagamento.
>
> A blockchain entra como camada de prova. Os dados completos ficam off-chain, no banco, e a blockchain registra apenas a prova de integridade: identificador do contrato, hash do documento, endereco responsavel e timestamp. O projeto possui o smart contract FiscalizaPayRegistry deployado em Sepolia, preparado para esse registro imutavel.
>
> O impacto e direto: mais transparencia, melhor auditoria e menos risco de pagamento indevido. O FiscalizaPay ajuda governos, ONGs e empresas a comprovarem que uma entrega foi realmente fiscalizada antes do dinheiro sair.
>
> FiscalizaPay: pagamento publico com rastreabilidade, evidencia e confianca.

## Ordem recomendada da demo na tela

1. Dashboard.
2. Lista de contratos.
3. Detalhe de um contrato.
4. Partes envolvidas e wallets.
5. Timeline auditavel.
6. Painel de acoes.
7. Simulacao de fraude.
8. Disputa e pagamento bloqueado.
9. Card blockchain / link explorer.
10. Tela de auditoria.

## Pontos que devem aparecer no video

- O problema e real: baixa rastreabilidade em contratos e pagamentos.
- Existe fluxo com perfis.
- Existe historico auditavel.
- Pagamento nao avanca sem validacao.
- Disputa bloqueia pagamento.
- Hash detecta alteracao de evidencia.
- Blockchain e usada para prova, nao para armazenar tudo.
- Dados sensiveis ficam off-chain.
- Smart contract existe e esta deployado em Sepolia.
- Integracao on-chain runtime deve ser apresentada como fase final se ainda nao estiver conectada.

## Cuidados na apresentacao

Evite dizer:

- "todos os eventos ja sao gravados na blockchain real";
- "usa IPFS";
- "emite NFT automaticamente";
- "a integracao blockchain esta 100% completa".

Diga:

> O MVP ja demonstra o fluxo auditavel, a autenticacao por wallet e a arquitetura de prova on-chain. O smart contract esta deployado, e a conexao runtime completa com o backend e o proximo passo tecnico.

## Pitch de 30 segundos

> O FiscalizaPay e uma plataforma Web3 para fiscalizacao de contratos publicos. Ele cria uma trilha auditavel de cada etapa do contrato, vincula evidencias por hash e bloqueia pagamentos quando ha disputa ou indicio de fraude. Gestor, fornecedor, entregador, fiscal e auditor participam do fluxo com permissoes especificas. A blockchain entra como camada de prova para registrar hashes de forma imutavel, aumentando transparencia e confianca antes do dinheiro publico sair.

## Pitch de 10 segundos

> FiscalizaPay fiscaliza contratos publicos antes do pagamento, usando timeline auditavel, hash de evidencias, wallet e blockchain para aumentar transparencia e bloquear fraudes.
