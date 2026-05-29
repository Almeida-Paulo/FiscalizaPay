import { z } from "zod";

const walletRegex = /^0x[a-fA-F0-9]{40}$/;

function optionalWallet(label: string) {
  return z
    .string()
    .refine(
      (val) => val === "" || walletRegex.test(val),
      `${label} inválida. Deve começar com 0x e ter 42 caracteres.`,
    );
}

export const createContractSchema = z.object({
  contractNumber: z
    .string()
    .min(3, "Número do contrato deve ter pelo menos 3 caracteres."),
  publicAgency: z.string().min(1, "Órgão público é obrigatório."),
  supplierName: z.string().min(1, "Nome do fornecedor é obrigatório."),
  supplierWallet: optionalWallet("Carteira do fornecedor"),
  object: z
    .string()
    .min(10, "Objeto do contrato deve ter pelo menos 10 caracteres."),
  amount: z.number().positive("Valor deve ser maior que zero."),
  deadline: z.string().min(1, "Prazo de entrega é obrigatório."),
  inspectorName: z.string().min(1, "Nome do fiscal é obrigatório."),
  inspectorWallet: optionalWallet("Carteira do fiscal"),
  logisticsResponsible: z
    .string()
    .min(1, "Responsável pela logística é obrigatório."),
  logisticsWallet: optionalWallet("Carteira da logística"),
  managerName: z.string(),
  managerWallet: optionalWallet("Carteira do gestor"),
  documentHash: z
    .string()
    .refine(
      (val) => val === "" || val.length >= 16,
      "Hash do documento deve ter pelo menos 16 caracteres.",
    ),
});

export type CreateContractFormData = z.infer<typeof createContractSchema>;
