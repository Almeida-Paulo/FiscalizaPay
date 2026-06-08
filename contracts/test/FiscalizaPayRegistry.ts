import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { anyValue } from "@nomicfoundation/hardhat-viem-assertions/predicates";
import { getAddress, keccak256, stringToHex } from "viem";

const CONTRACT_ID = keccak256(stringToHex("CT-2026-0001"));
const OTHER_CONTRACT_ID = keccak256(stringToHex("CT-2026-0002"));
const DOCUMENT_HASH = keccak256(stringToHex("conteudo-do-documento-fiscalizado"));
const OTHER_DOCUMENT_HASH = keccak256(stringToHex("outro-conteudo"));

describe("FiscalizaPayRegistry", async function () {
  const { viem } = await network.create();
  const publicClient = await viem.getPublicClient();
  const [ownerClient, strangerClient] = await viem.getWalletClients();

  async function deployRegistry() {
    return viem.deployContract("FiscalizaPayRegistry", [ownerClient.account.address]);
  }

  it("define o deployer como owner", async function () {
    const registry = await deployRegistry();
    assert.equal(
      getAddress(await registry.read.owner()),
      getAddress(ownerClient.account.address),
    );
  });

  it("registra um contrato e emite ContractRegistered com os dados corretos", async function () {
    const registry = await deployRegistry();

    await viem.assertions.emitWithArgs(
      registry.write.registerContract([CONTRACT_ID, DOCUMENT_HASH]),
      registry,
      "ContractRegistered",
      [CONTRACT_ID, DOCUMENT_HASH, getAddress(ownerClient.account.address), anyValue],
    );

    const [documentHash, registeredBy, timestamp, exists] = await registry.read.getRecord([CONTRACT_ID]);
    assert.equal(documentHash, DOCUMENT_HASH);
    assert.equal(getAddress(registeredBy), getAddress(ownerClient.account.address));
    assert.ok(timestamp > 0n);
    assert.equal(exists, true);
    assert.equal(await registry.read.isRegistered([CONTRACT_ID]), true);
  });

  it("retorna exists=false e valores zerados para contrato nao registrado", async function () {
    const registry = await deployRegistry();

    const [documentHash, registeredBy, timestamp, exists] = await registry.read.getRecord([OTHER_CONTRACT_ID]);
    assert.equal(documentHash, `0x${"0".repeat(64)}`);
    assert.equal(getAddress(registeredBy), getAddress("0x0000000000000000000000000000000000000000"));
    assert.equal(timestamp, 0n);
    assert.equal(exists, false);
    assert.equal(await registry.read.isRegistered([OTHER_CONTRACT_ID]), false);
  });

  it("bloqueia registro duplicado do mesmo contractId (registro e imutavel)", async function () {
    const registry = await deployRegistry();

    await registry.write.registerContract([CONTRACT_ID, DOCUMENT_HASH]);

    await viem.assertions.revertWithCustomErrorWithArgs(
      registry.write.registerContract([CONTRACT_ID, OTHER_DOCUMENT_HASH]),
      registry,
      "AlreadyRegistered",
      [CONTRACT_ID],
    );

    // o registro original permanece intacto (imutavel)
    const [documentHash] = await registry.read.getRecord([CONTRACT_ID]);
    assert.equal(documentHash, DOCUMENT_HASH);
  });

  it("permite registrar contractIds diferentes de forma independente", async function () {
    const registry = await deployRegistry();

    await registry.write.registerContract([CONTRACT_ID, DOCUMENT_HASH]);
    await registry.write.registerContract([OTHER_CONTRACT_ID, OTHER_DOCUMENT_HASH]);

    assert.equal((await registry.read.getRecord([CONTRACT_ID]))[0], DOCUMENT_HASH);
    assert.equal((await registry.read.getRecord([OTHER_CONTRACT_ID]))[0], OTHER_DOCUMENT_HASH);
  });

  it("reverte quando uma conta diferente do owner tenta registrar", async function () {
    const registry = await deployRegistry();
    const registryAsStranger = await viem.getContractAt(
      "FiscalizaPayRegistry",
      registry.address,
      { client: { wallet: strangerClient } },
    );

    await viem.assertions.revertWithCustomErrorWithArgs(
      registryAsStranger.write.registerContract([CONTRACT_ID, DOCUMENT_HASH]),
      registry,
      "OwnableUnauthorizedAccount",
      [getAddress(strangerClient.account.address)],
    );

    assert.equal(await registry.read.isRegistered([CONTRACT_ID]), false);
  });

  it("emite o timestamp do bloco em que a transacao foi minerada", async function () {
    const registry = await deployRegistry();

    const txHash = await registry.write.registerContract([CONTRACT_ID, DOCUMENT_HASH]);
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });

    const [, , timestamp] = await registry.read.getRecord([CONTRACT_ID]);
    assert.equal(timestamp, block.timestamp);
  });
});
