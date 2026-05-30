"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2, ShieldAlert } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { Button } from "@/shared/ui/button";
import {
  simulateFraudSchema,
  generateFakeHash,
  type SimulateFraudValues,
} from "../model/simulate-fraud-schema";

interface SimulateFraudFormProps {
  id: string;
  originalHash: string;
  onSubmit: (values: SimulateFraudValues) => void;
  disabled?: boolean;
}

export function SimulateFraudForm({
  id,
  originalHash,
  onSubmit,
  disabled,
}: SimulateFraudFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SimulateFraudValues>({
    resolver: zodResolver(simulateFraudSchema),
    defaultValues: {
      alteredDocumentHash: "",
      fraudReason: "",
      notes: "",
    },
  });

  const alteredHash = useWatch({ control, name: "alteredDocumentHash", defaultValue: "" });
  const hashDiffers = alteredHash.trim().length > 0 && alteredHash.trim() !== originalHash;

  function handleGenerateFakeHash() {
    setValue("alteredDocumentHash", generateFakeHash(originalHash), {
      shouldValidate: true,
    });
  }

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2.5 flex items-start gap-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
        <p className="text-sm text-danger">
          Esta simulação substitui o hash do documento. Se o hash divergir do original, uma disputa será aberta automaticamente.
        </p>
      </div>

      {/* Hash comparison */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">Comparação de hashes</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Hash original</p>
            <div className="rounded-md border border-border bg-muted/20 px-3 py-2">
              <p className="font-mono text-xs break-all text-foreground/70 leading-relaxed">
                {originalHash || <span className="italic text-muted-foreground">Sem hash</span>}
              </p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Hash adulterado</p>
            <div
              className={`rounded-md border px-3 py-2 min-h-[52px] transition-colors ${
                hashDiffers
                  ? "border-danger/50 bg-danger/5"
                  : "border-border bg-muted/20"
              }`}
            >
              <p
                className={`font-mono text-xs break-all leading-relaxed ${
                  hashDiffers ? "text-danger" : "text-foreground/40 italic"
                }`}
              >
                {alteredHash.trim() || "Digite o hash abaixo"}
              </p>
            </div>
          </div>
        </div>
        {hashDiffers && (
          <p className="text-xs text-danger flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" />
            Os hashes divergem — uma disputa será aberta ao confirmar.
          </p>
        )}
      </div>

      {/* Altered hash input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Hash adulterado *</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleGenerateFakeHash}
            disabled={disabled}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <Wand2 className="mr-1 h-3 w-3" />
            Gerar hash falso
          </Button>
        </div>
        <Input
          {...register("alteredDocumentHash")}
          placeholder="Hash adulterado para simular divergência..."
          disabled={disabled}
          className="font-mono text-xs"
        />
        {errors.alteredDocumentHash && (
          <p className="text-xs text-danger">{errors.alteredDocumentHash.message}</p>
        )}
      </div>

      {/* Fraud reason */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Motivo da adulteração *</p>
        <Textarea
          {...register("fraudReason")}
          placeholder="Descreva o cenário de adulteração simulado..."
          rows={2}
          disabled={disabled}
        />
        {errors.fraudReason && (
          <p className="text-xs text-danger">{errors.fraudReason.message}</p>
        )}
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">
          Notas adicionais{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </p>
        <Textarea
          {...register("notes")}
          placeholder="Informações complementares sobre o teste..."
          rows={2}
          disabled={disabled}
        />
      </div>
    </form>
  );
}
