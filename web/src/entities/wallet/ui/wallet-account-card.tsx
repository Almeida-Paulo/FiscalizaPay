"use client";

import { ExternalLink, WifiOff, AlertCircle } from "lucide-react";
import { useWalletStore } from "../model/store";
import { shortenAddress } from "@/shared/lib/formatters";
import { NetworkBadge } from "./network-badge";
import { CopyButton } from "@/shared/ui/copy-button";
import { env } from "@/shared/config/env";
import { getExplorerAddressUrl } from "../model/helpers";

export function WalletAccountCard() {
  const { isConnected, address, networkName, chainId, isCorrectNetwork } =
    useWalletStore();

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center gap-2 py-3 text-center">
        <WifiOff className="h-7 w-7 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Wallet não conectada</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Status + Network */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 shrink-0 rounded-full bg-success" />
        <span className="text-sm font-medium text-foreground">Conectada</span>
        <NetworkBadge
          chainId={chainId}
          isConnected={isConnected}
          isCorrectNetwork={isCorrectNetwork}
        />
      </div>

      {/* Address */}
      <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
        <p className="mb-1 text-[10px] text-muted-foreground uppercase tracking-wide">
          Endereço
        </p>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-mono text-xs text-foreground">
            {shortenAddress(address!, 6)}
          </p>
          <CopyButton value={address!} successMessage="Endereço copiado!" />
        </div>
      </div>

      {/* Network info */}
      {networkName && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{networkName}</span>
          {chainId && <span className="font-mono">Chain {chainId}</span>}
        </div>
      )}

      {/* Explorer link */}
      {address && (
        <a
          href={getExplorerAddressUrl(env.explorerUrl, address)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3 shrink-0" />
          Ver no PolygonScan Amoy
        </a>
      )}

      {/* Demo disclaimer */}
      <div className="flex items-start gap-1.5 rounded-md border border-warning/20 bg-warning/5 px-2.5 py-2">
        <AlertCircle className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
        <p className="text-[11px] leading-relaxed text-warning/80">
          Carteira de demonstração visual. A integração real com MetaMask virá em versão futura.
        </p>
      </div>
    </div>
  );
}
