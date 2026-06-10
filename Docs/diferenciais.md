# Diferenciais do FiscalizaPay

## Resumo

O FiscalizaPay possui diferenciais fortes em transparencia, visualizacao, experiencia de usuario, historico auditavel, aplicacao pratica e impacto social. Os diferenciais ligados a blockchain estao bem encaminhados: o contrato esta deployado e o backend ja possui integracao Web3, mas devem ser apresentados como parcialmente validados ate haver uma transacao ponta a ponta em Sepolia com RPC, chave owner e saldo.

## Avaliacao dos diferenciais

| Diferencial | Status | Justificativa |
| --- | --- | --- |
| Transparencia dos dados | **Sim** | Dashboard, listagem, detalhe, timeline e auditoria deixam visivel o estado de cada contrato. |
| Impacto social ou ambiental claro | **Sim** | O foco e reduzir risco de fraude, aumentar controle de pagamentos publicos e proteger recursos coletivos. |
| Boa visualizacao das informacoes | **Sim** | UI dark, cards de metricas, badges de status, timeline, alertas e paineis tornam o fluxo compreensivel. |
| Automacoes bem definidas | **Sim** | Eventos sao criados automaticamente; fraude por hash divergente abre disputa e bloqueia pagamento. |
| Experiencia do usuario | **Sim** | Interface organizada por dashboard, contratos, auditoria, disputas e perfil/wallet. |
| Potencial real de adocao | **Sim** | Serve para orgaos publicos, ONGs, empresas contratantes e auditorias independentes. |
| Dashboard simples e compreensivel | **Sim** | Mostra total, status, disputas, pagamentos autorizados e valor fiscalizado. |
| Uso adequado de certificados digitais ou NFTs | **Nao aplicado / pendente** | O projeto nao precisa de NFT para o fluxo atual. O diferencial principal e hash + auditoria; certificado/NFT pode ser evolucao. |
| Integracao funcional entre frontend, blockchain e smart contracts | **Parcial / em validacao** | Frontend tem wallet, tx/hash visual, smart contract existe e backend tem chamada Web3; falta executar e evidenciar uma transacao real ponta a ponta com saldo Sepolia. |
| Clareza sobre dados on-chain e off-chain | **Sim** | A arquitetura separa dados completos no banco e provas/hash no smart contract. |
| Uso de IPFS ou equivalente para evidencias | **Nao aplicado / pendente** | O projeto usa hash do documento, mas nao armazena arquivo/evidencia em IPFS. Pode ser futuro se houver upload real. |
| Metricas de impacto bem definidas | **Sim** | Valor total fiscalizado, contratos por status, disputas e pagamentos autorizados. |
| Solucao conectada a problema real | **Sim** | Contratos publicos sofrem com baixa rastreabilidade, pagamentos indevidos e auditoria tardia. |

## Diferenciais que voce pode defender com seguranca

### 1. Transparencia operacional

Cada contrato possui status claro e historico de eventos. Isso reduz a dependencia de planilhas, mensagens soltas ou documentos desconectados.

### 2. Pagamento condicionado a validacao

O pagamento so avanca depois de etapas sequenciais:

1. contrato criado;
2. envio confirmado;
3. entrega confirmada;
4. recebimento validado;
5. pagamento autorizado.

Esse fluxo evita autorizacao prematura de pagamento.

### 3. Disputa bloqueia o pagamento

Quando ha disputa, o contrato entra em estado `DISPUTA` e o pagamento fica bloqueado visual e logicamente.

### 4. Fraude por hash divergente

Se o hash de um documento alterado diverge do hash original, o sistema detecta a diferenca, registra evento e abre disputa automaticamente.

### 5. Auditoria por perfil e wallet

As acoes sao vinculadas a:

- perfil;
- wallet;
- nome do responsavel;
- status anterior;
- status posterior;
- horario;
- evidencia/hash.

### 6. Separacao correta entre on-chain e off-chain

O projeto nao tenta colocar dados sensiveis completos na blockchain. Ele usa blockchain para prova de integridade, enquanto o banco guarda o contexto completo.

### 7. Smart contract simples e objetivo

O contrato `FiscalizaPayRegistry` registra hash por contrato e impede registro duplicado. Isso e mais facil de explicar e auditar do que um contrato excessivamente complexo.

### 8. Experiencia de demo forte

O sistema tem telas demonstraveis:

- dashboard;
- contratos;
- detalhe;
- timeline;
- auditoria;
- disputas;
- conexao wallet;
- validacao visual de rede;
- simulacao de fraude.

## Diferenciais parcialmente atendidos

### Blockchain de ponta a ponta

O projeto possui:

- smart contract Solidity;
- deploy Sepolia registrado localmente;
- link de explorer;
- campos `transactionHash`;
- UI preparada;
- endpoint de blockchain status.
- chamada backend Web3 para `registerContract`.

Ainda falta:

- configurar backend com `BLOCKCHAIN_ENABLED=true`;
- alinhar chain/backend/frontend/smart contract;
- executar chamada real ao contrato em Sepolia;
- salvar transaction hash real no banco em um teste validado;
- validar fluxo de ponta a ponta.

### Certificados, NFTs ou reconhecimentos

Nao e obrigatorio para a solucao atual. Se o edital valorizar muito isso, a evolucao natural seria emitir um certificado digital de contrato fiscalizado ou um NFT soulbound/nao transferivel para reconhecimento de auditoria. Hoje isso nao esta implementado.

### IPFS ou evidencias equivalentes

Hoje o projeto trabalha com hash do documento. Isso prova integridade, mas nao hospeda o arquivo. A evolucao seria:

- upload do documento;
- armazenamento em IPFS, Filecoin, Arweave, S3 imutavel ou storage equivalente;
- registro do CID/hash no banco e/ou blockchain.

## Diferenciais que voce deve evitar afirmar como completos

Evite dizer:

- "o backend ja grava on-chain em producao";
- "todos os eventos estao na blockchain real";
- "tem NFT/certificado emitido automaticamente";
- "usa IPFS";
- "a integracao blockchain esta 100% ponta a ponta".

Use esta frase:

> O projeto ja possui smart contract deployado e integracao backend Web3 implementada para registro on-chain; a demo pode rodar sem gas por padrao, e a validacao publica ponta a ponta depende de habilitar RPC, chave owner e saldo Sepolia.

## Como transformar parcial em completo

Prioridade para fechar diferenciais Web3:

1. manter Sepolia como rede oficial do MVP;
2. manter `CHAIN_ID`, `NEXT_PUBLIC_CHAIN_ID`, `CONTRACT_ADDRESS`, `NEXT_PUBLIC_CONTRACT_ADDRESS` e explorer alinhados com Sepolia;
3. habilitar no backend a chamada real ao `FiscalizaPayRegistry`;
4. salvar `transaction_hash` e `blockchain_timestamp`, retornando `block_number` na resposta;
5. exibir link real para explorer;
6. rodar teste ponta a ponta com uma carteira de gestor.

## Conclusao

Voce preenche com seguranca os diferenciais de transparencia, impacto social, visualizacao, automacao, experiencia, dashboard, metricas e aplicacao real.

Preenche parcialmente os diferenciais de blockchain/smart contract porque o contrato existe, esta deployado e o backend ja chama Web3, mas falta validar publicamente uma transacao real com saldo Sepolia.

Nao preenche hoje os diferenciais de NFT/certificado e IPFS, mas eles nao sao essenciais para a proposta central do FiscalizaPay.
