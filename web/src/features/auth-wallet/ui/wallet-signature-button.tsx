"use client";

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  LogOut,
  PenLine,
  Plug,
  Wallet,
} from "lucide-react";

import { useWalletNonceSignature } from "../model/use-wallet-nonce-signature";
import { NetworkBadge } from "@/entities/wallet/ui/network-badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Separator } from "@/shared/ui/separator";
import { shortenAddress, shortenHash } from "@/shared/lib/formatters";

export function WalletSignatureButton() {
  const {
    walletAddress,
    chainId,
    expectedChainId,
    isConnected,
    isCorrectNetwork,
    isBusy,
    isConnecting,
    isRequestingNonce,
    isSigning,
    nonceData,
    signature,
    error,
    connectWallet,
    disconnectWallet,
    signNonceMessage,
  } = useWalletNonceSignature();

  const statusLabel = isRequestingNonce
    ? "Solicitando nonce"
    : isSigning
      ? "Assinando"
      : signature
        ? "Assinada"
        : "Wallet real";

  if (!isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => void connectWallet().catch(() => undefined)}
        disabled={isConnecting}
        className="h-7 gap-1.5 border-primary/30 text-xs text-primary hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
      >
        {isConnecting ? (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
        ) : (
          <Plug className="h-3.5 w-3.5 shrink-0" />
        )}
        <span className="hidden sm:inline">Conectar wallet</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1.5 border-success/30 text-xs hover:border-success/50 hover:bg-success/5"
        >
          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
          <span className="hidden font-mono sm:inline">
            {walletAddress ? shortenAddress(walletAddress) : "Wallet"}
          </span>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{statusLabel}</p>
                <p className="font-mono text-xs text-muted-foreground">
                  {walletAddress ? shortenAddress(walletAddress, 6) : "Sem address"}
                </p>
              </div>
            </div>
            <NetworkBadge
              chainId={chainId}
              isConnected={isConnected}
              isCorrectNetwork={isCorrectNetwork}
            />
          </div>

          {!isCorrectNetwork && (
            <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-2.5 py-2 text-[11px] text-warning">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>Conecte a wallet na chain {expectedChainId} antes de assinar.</span>
            </div>
          )}

          <Button
            size="sm"
            onClick={() => void signNonceMessage().catch(() => undefined)}
            disabled={isBusy || !isCorrectNetwork}
            className="w-full justify-center gap-2"
          >
            {isBusy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <PenLine className="h-3.5 w-3.5" />
            )}
            Assinar mensagem
          </Button>

          {nonceData && (
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
              <p className="text-[10px] uppercase text-muted-foreground">Nonce recebido</p>
              <p className="mt-1 truncate font-mono text-xs text-foreground">
                {nonceData.nonce}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Expira em {nonceData.expiresAt}
              </p>
            </div>
          )}

          {signature && (
            <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success/10 px-2.5 py-2">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-success">Signature capturada</p>
                <p className="truncate font-mono text-[11px] text-success/80">
                  {shortenHash(signature, 10)}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-2">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
              <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
            </div>
          )}
        </div>

        <Separator className="my-3" />

        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectWallet}
          className="w-full justify-start gap-2 text-muted-foreground hover:bg-danger/10 hover:text-danger"
        >
          <LogOut className="h-3.5 w-3.5" />
          Desconectar wallet
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
