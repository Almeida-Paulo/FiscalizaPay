"use client";

import { ChevronDown, LogOut, Plug } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { useWalletStore } from "@/entities/wallet/model/store";
import { shortenAddress } from "@/shared/lib/formatters";
import { WalletAccountCard } from "@/entities/wallet/ui/wallet-account-card";

export function WalletConnectButton() {
  const { isConnected, address, connectMockWallet, disconnectWallet } =
    useWalletStore();

  if (!isConnected) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={connectMockWallet}
        className="h-7 gap-1.5 border-primary/30 text-xs text-primary hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
      >
        <Plug className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden sm:inline">Conectar wallet</span>
        <span className="hidden text-[10px] text-primary/60 sm:inline">(demo)</span>
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
          <span className="hidden font-mono sm:inline">{shortenAddress(address!)}</span>
          <ChevronDown className="h-3 w-3 shrink-0 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 p-3">
        <WalletAccountCard />
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
