"use client";

import { WifiOff } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { shortenAddress } from "@/shared/lib/formatters";
import { useWalletStore } from "../model/store";
import { NetworkBadge } from "./network-badge";

interface WalletStatusProps {
  className?: string;
  showNetwork?: boolean;
}

export function WalletStatus({ className, showNetwork = true }: WalletStatusProps) {
  const { isConnected, address, chainId, isCorrectNetwork } = useWalletStore();

  if (!isConnected) {
    return (
      <div className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <WifiOff className="h-3.5 w-3.5 shrink-0" />
        <span>Não conectada</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
      <span className="font-mono text-xs text-foreground">
        {shortenAddress(address!)}
      </span>
      {showNetwork && (
        <NetworkBadge
          chainId={chainId}
          isConnected={isConnected}
          isCorrectNetwork={isCorrectNetwork}
        />
      )}
    </div>
  );
}
