# Expectativa de atendimento dos requisitos

## Resumo executivo

O FiscalizaPay atende bem aos requisitos de clareza da solucao, problema real, valor social, historico auditavel, registro de acoes de impacto e visualizacao das informacoes.

O projeto tambem possui smart contract Solidity, artefato de deploy em Sepolia e integracao Web3 no backend para chamar o contrato. Por isso, requisitos ligados a escrita blockchain real podem ser apresentados como implementados tecnicamente, mas ainda parcialmente validados ate que uma transacao real seja executada com RPC, chave owner e saldo Sepolia.

## README explicando a solucao

Status: **atendido**

O projeto possui READMEs nas camadas:

- `web/README.md`
- `backend/README.md`
- `contracts/README.md`

Eles explicam partes importantes da solucao, tecnologias e execucao por camada. Porem, para o requisito ficar forte, o ideal e existir tambem um `README.md` raiz consolidado explicando:

- problema;
- solucao;
- arquitetura;
- tecnologias;
- funcionamento da plataforma;
- instrucoes de execucao de frontend, backend e smart contract;
- link do deploy;
- endereco do smart contract;
- separacao entre dados on-chain e off-chain.

Conclusao: o requisito esta atendido pelo README raiz e pelos READMEs por modulo.

## Smart contract deployado

Status: **parcialmente validado**

Existe um smart contract no projeto:

- Nome: `FiscalizaPayRegistry`
- Arquivo: `contracts/contracts/FiscalizaPayRegistry.sol`
- Rede do artefato de deploy: Sepolia
- Chain ID: `11155111`
- Endereco: `0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`
- Explorer: `https://sepolia.etherscan.io/address/0xC39B2598EF9eaDc8F5C4e670893544e7Dfc52f83`
- Artefato local: `contracts/ignition/deployments/chain-11155111/deployed_addresses.json`

Ponto de atencao: a API backend ja implementa o registro on-chain real, mas ele fica desabilitado por padrao. A rede atual para apresentacao deve ser Sepolia, alinhada ao artefato de deploy existente.

Conclusao: o requisito de contrato deployado tem evidencia local e endereco publico. A integracao completa frontend -> backend -> smart contract precisa de uma execucao real registrada em Sepolia para ficar plenamente comprovada.

## Checklist dos requisitos principais

| Requisito | Status | Avaliacao |
| --- | --- | --- |
| Uso de blockchain | **Parcial / em validacao** | Ha wallet EVM, assinatura, smart contract, campos/hash/tx na UI e backend Web3; falta evidenciar uma transacao real em Sepolia. |
| Registro de acoes de impacto | **Sim** | Cada acao do fluxo gera evento auditavel no backend e timeline no frontend. |
| Uso de smart contracts | **Parcial / em validacao** | Existe contrato `FiscalizaPayRegistry`, deploy Sepolia e chamada backend; falta validar com uma transacao real. |
| Historico auditavel | **Sim** | Eventos de contrato, timeline e tela de auditoria registram quem fez, quando fez, status e evidencias. |
| Emissao automatica de certificados, NFTs ou reconhecimentos | **Nao aplicado / pendente** | O escopo atual nao implementa NFT/certificado. Pode ser defendido como nao essencial para fiscalizacao de contratos. |
| Clareza da solucao | **Sim** | Problema, fluxo, perfis, dashboard e timeline comunicam bem a proposta. |
| Valor social, ambiental ou comunitario | **Sim** | A solucao combate baixa transparencia em contratos publicos e ajuda a proteger dinheiro publico. |
| Aplicacao pratica real | **Sim** | O fluxo se aplica a governos, orgaos publicos, ONGs e empresas que contratam entregas fiscalizadas. |
| Quais dados sao registrados | **Sim** | Contratos, perfis, status, eventos, disputas, hashes, wallets e timestamps. |
| Quais evidencias sao vinculadas as acoes | **Sim** | `documentHash`, `transactionHash` quando existir, wallet responsavel, role, status anterior/posterior e timestamp. |
| Como a informacao pode ser consultada ou verificada | **Parcial / em validacao** | Consulta via dashboard, detalhe do contrato, timeline, auditoria e explorer; verificacao on-chain real depende de uma transacao validada. |
| Quem participa do fluxo | **Sim** | Gestor, fornecedor, entregador, fiscal e auditor. |
| Qual metrica de impacto e acompanhada | **Sim** | Total de contratos, contratos por status, disputas, pagamentos autorizados e valor total fiscalizado. |
| Como aumenta transparencia e confianca | **Sim** | Mostra trilha de eventos, bloqueia pagamento em disputa, exige perfil/wallet e vincula evidencias por hash. |

## Dados registrados

### Off-chain no banco

- numero do contrato;
- orgao publico;
- fornecedor;
- objeto contratado;
- valor;
- prazos;
- responsaveis;
- wallets vinculadas;
- status;
- eventos;
- disputas;
- nonces de autenticacao;
- perfil autenticado;
- hash de documento;
- transaction hash quando existir.

### On-chain implementado / contrato deployado

O contrato `FiscalizaPayRegistry` registra:

- `contractId`;
- `documentHash`;
- endereco que registrou;
- timestamp do bloco.

Essa separacao e correta: dados completos e sensiveis ficam off-chain; prova de integridade fica on-chain.

## Evidencias vinculadas as acoes

- Criacao do contrato: `documentHash`, responsavel, wallet e timestamp.
- Confirmacao de envio: role fornecedor, wallet vinculada, status anterior e posterior.
- Confirmacao de entrega: role entregador, wallet vinculada, status anterior e posterior.
- Validacao fiscal: role fiscal, wallet vinculada, status anterior e posterior.
- Autorizacao de pagamento: role gestor, wallet vinculada, status anterior e posterior.
- Disputa: motivo, responsavel, status bloqueado.
- Simulacao de fraude: hash original, novo hash e abertura automatica de disputa.
- Registro blockchain: transaction hash e timestamp on-chain quando disponivel.

## Como consultar ou verificar

- Dashboard: metricas gerais e situacao dos contratos.
- Listagem: contratos e filtros por status.
- Detalhe do contrato: dados, partes, hashes, blockchain e acoes disponiveis.
- Timeline: historico completo de eventos.
- Auditoria: busca e visualizacao consolidada dos eventos.
- Explorer Sepolia: consulta publica do contrato deployado.

## Participantes do fluxo

| Perfil | Papel |
| --- | --- |
| Gestor | Cria contrato, autoriza pagamento, abre disputa e registra on-chain. |
| Fornecedor | Confirma envio ou execucao do servico. |
| Entregador | Confirma entrega no local correto. |
| Fiscal | Valida recebimento, abre disputa e simula fraude. |
| Auditor | Consulta integridade, abre disputa e simula fraude. |

## Metrica de impacto acompanhada

Metricas atuais:

- total de contratos fiscalizados;
- contratos por status;
- contratos em disputa;
- pagamentos autorizados;
- valor total fiscalizado;
- quantidade de eventos com hash/transacao;
- alertas de disputa.

Metrica mais forte para pitch:

> Valor total de contratos fiscalizados com trilha auditavel e pagamento bloqueavel em caso de disputa.

## Conclusao

O projeto preenche a maior parte dos requisitos de produto, transparencia, auditoria e aplicacao real.

Os pontos que precisam ser apresentados com cuidado sao:

- integracao blockchain real esta implementada no backend, mas desabilitada por padrao;
- existe smart contract deployado em Sepolia, mas ainda falta evidenciar uma transacao runtime real;
- NFTs/certificados e IPFS nao fazem parte do escopo atual.

Para apresentacao, a formulacao mais honesta e forte e:

> O FiscalizaPay ja entrega o fluxo auditavel completo off-chain com autenticacao por wallet, possui smart contract deployado e backend Web3 para registro de hashes. A etapa final e executar uma transacao real em Sepolia para demonstrar o fluxo runtime de ponta a ponta.
