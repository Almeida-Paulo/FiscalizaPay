"use client";

import { Menu, Wifi, WifiOff } from "lucide-react";
import { useAccount } from "wagmi";
import { Button } from "@/shared/ui/button";
import { ProfileSwitcher } from "@/entities/profile/ui/profile-switcher";
import { getPageMeta } from "@/shared/lib/page-meta";
import { shortenAddress } from "@/shared/lib/formatters";
import { env } from "@/shared/config/env";
import { cn } from "@/shared/lib/utils";

interface AppHeaderProps {
  pathname: string;
  onMenuOpen: () => void;
  className?: string;
}

export function AppHeader({ pathname, onMenuOpen, className }: AppHeaderProps) {
  const { address, isConnected } = useAccount();
  const meta = getPageMeta(pathname);

  const chainLabel = env.chainId === 80002 ? "Amoy" : `Chain ${env.chainId}`;

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-3 border-b border-border bg-sidebar px-4 md:px-6",
        className,
      )}
    >
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onMenuOpen}
        aria-label="Abrir menu de navegação"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page title + description */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-sm font-semibold leading-none text-foreground">
          {meta.title}
        </h1>
        <p className="mt-0.5 hidden truncate text-xs text-muted-foreground sm:block">
          {meta.description}
        </p>
      </div>

      {/* Right-side controls */}
      <div className="flex shrink-0 items-center gap-2">
        {/* Wallet status badge */}
        <div className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs sm:flex">
          {isConnected ? (
            <Wifi className="h-3 w-3 text-success" />
          ) : (
            <WifiOff className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-muted-foreground">
            {isConnected && address ? shortenAddress(address) : "Não conectada"}
          </span>
          <span className="text-[10px] text-muted-foreground/50">{chainLabel}</span>
        </div>

        {/* Profile switcher */}
        <ProfileSwitcher compact />
      </div>
    </header>
  );
}
