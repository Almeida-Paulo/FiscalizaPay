export type NavItem = {
  readonly title: string;
  readonly href: string;
  readonly icon: string;
};

export const NAVIGATION_ITEMS: readonly NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    title: "Contratos",
    href: "/contracts",
    icon: "FileText",
  },
  {
    title: "Novo contrato",
    href: "/contracts/new",
    icon: "PlusCircle",
  },
  {
    title: "Disputas",
    href: "/disputes",
    icon: "AlertTriangle",
  },
  {
    title: "Auditoria",
    href: "/audit",
    icon: "ShieldCheck",
  },
] as const;
