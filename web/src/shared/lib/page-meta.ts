export interface PageMeta {
  title: string;
  description: string;
}

export function getPageMeta(pathname: string): PageMeta {
  if (pathname === "/dashboard") {
    return { title: "Dashboard", description: "Visão geral dos contratos fiscalizados" };
  }
  if (pathname === "/contracts/new") {
    return { title: "Novo contrato", description: "Cadastre um contrato para fiscalização" };
  }
  if (pathname.startsWith("/contracts/")) {
    return { title: "Detalhe do contrato", description: "Informações, timeline e ações do contrato" };
  }
  if (pathname === "/contracts") {
    return { title: "Contratos", description: "Acompanhe contratos públicos e status de execução" };
  }
  if (pathname === "/disputes") {
    return { title: "Disputas", description: "Contratos com divergência ou bloqueio" };
  }
  if (pathname === "/audit") {
    return { title: "Auditoria", description: "Rastreabilidade de eventos, hashes e transações" };
  }
  return { title: "FiscalizaPay Web3", description: "Fiscalização e liberação segura de pagamentos públicos" };
}
