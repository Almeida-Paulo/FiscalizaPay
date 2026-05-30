"use client";

import { Menu, User } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { ProfileIdentityCard } from "@/entities/profile/ui/profile-identity-card";
import { WalletConnectButton } from "@/features/wallet-connect";
import { getPageMeta } from "@/shared/lib/page-meta";
import { cn } from "@/shared/lib/utils";

interface AppHeaderProps {
  pathname: string;
  onMenuOpen: () => void;
  className?: string;
}

export function AppHeader({ pathname, onMenuOpen, className }: AppHeaderProps) {
  const meta = getPageMeta(pathname);

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
        {/* Wallet connect / status */}
        <WalletConnectButton />

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
              aria-label="Perfil atual"
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Perfil</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-3">
            <ProfileIdentityCard />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
