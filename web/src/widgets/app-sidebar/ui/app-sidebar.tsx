"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  AlertTriangle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";
import { cn } from "@/shared/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  PlusCircle,
  AlertTriangle,
  ShieldCheck,
};

interface AppSidebarProps {
  pathname: string;
  onItemClick?: () => void;
  className?: string;
}

export function AppSidebar({ pathname, onItemClick, className }: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-60 flex-col border-r border-border bg-sidebar",
        className,
      )}
    >
      {/* Brand area */}
      <div className="flex h-14 shrink-0 items-center border-b border-border px-5">
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            FiscalizaPay
          </span>
          <span className="mt-0.5 font-mono text-[10px] font-medium tracking-widest text-primary">
            Web3
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive =
              item.href === "/contracts/new"
                ? pathname === item.href
                : item.href === "/contracts"
                  ? pathname === item.href || (pathname.startsWith("/contracts/") && pathname !== "/contracts/new")
                  : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onItemClick}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    isActive
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        isActive
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                  )}
                  <span className="truncate">{item.title}</span>
                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-5 py-3">
        <p className="text-[10px] text-muted-foreground/60">
          FiscalizaPay Web3 © 2026
        </p>
      </div>
    </aside>
  );
}
