import { z } from "zod";

export const DISPUTE_TYPES = [
  "DOCUMENT_HASH_MISMATCH",
  "DELIVERY_NOT_CONFIRMED",
  "INSPECTION_REJECTED",
  "PAYMENT_BLOCKED",
  "OTHER",
] as const;

export type DisputeType = (typeof DISPUTE_TYPES)[number];

export const DISPUTE_TYPE_LABELS: Record<DisputeType, string> = {
  DOCUMENT_HASH_MISMATCH: "Divergência de hash do documento",
  DELIVERY_NOT_CONFIRMED: "Entrega não confirmada",
  INSPECTION_REJECTED: "Inspeção rejeitada",
  PAYMENT_BLOCKED: "Pagamento bloqueado",
  OTHER: "Outro",
};

export const openDisputeSchema = z.object({
  disputeType: z.enum(DISPUTE_TYPES),
  reason: z.string().min(10, "O motivo deve ter pelo menos 10 caracteres."),
  notes: z.string().optional(),
});

export type OpenDisputeValues = z.infer<typeof openDisputeSchema>;
