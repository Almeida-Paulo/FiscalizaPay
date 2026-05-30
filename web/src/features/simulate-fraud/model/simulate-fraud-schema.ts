import { z } from "zod";

export const simulateFraudSchema = z.object({
  alteredDocumentHash: z
    .string()
    .min(16, "O hash deve ter pelo menos 16 caracteres."),
  fraudReason: z
    .string()
    .min(10, "O motivo deve ter pelo menos 10 caracteres."),
  notes: z.string().optional(),
});

export type SimulateFraudValues = z.infer<typeof simulateFraudSchema>;

export function generateFakeHash(originalHash: string): string {
  const length = originalHash.length || 64;
  const chars = "0123456789abcdef";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
