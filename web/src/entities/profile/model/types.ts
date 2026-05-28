/** Roles oficiais do sistema — valores em português conforme domínio */
export type UserRole =
  | "GESTOR"
  | "FORNECEDOR"
  | "ENTREGADOR"
  | "FISCAL"
  | "AUDITOR";

/** Perfil de usuário do sistema */
export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  walletAddress?: string;
  createdAt: string;
  updatedAt: string;
}
