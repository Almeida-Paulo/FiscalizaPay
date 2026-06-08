const EVM_TRANSACTION_HASH_RE = /^0x[a-fA-F0-9]{64}$/;

export function isEvmTransactionHash(hash?: string | null): hash is string {
  return !!hash && EVM_TRANSACTION_HASH_RE.test(hash);
}

export function buildExplorerTxUrl(explorerUrl: string, hash: string): string {
  return `${explorerUrl.replace(/\/$/, "")}/tx/${hash}`;
}
