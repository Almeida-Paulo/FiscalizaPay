"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import {
  openDisputeSchema,
  DISPUTE_TYPES,
  DISPUTE_TYPE_LABELS,
  type OpenDisputeValues,
} from "../model/open-dispute-schema";

interface OpenDisputeFormProps {
  id: string;
  onSubmit: (values: OpenDisputeValues) => void;
  disabled?: boolean;
}

export function OpenDisputeForm({ id, onSubmit, disabled }: OpenDisputeFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OpenDisputeValues>({
    resolver: zodResolver(openDisputeSchema),
    defaultValues: {
      reason: "",
      notes: "",
    },
  });

  const reason = useWatch({ control, name: "reason", defaultValue: "" });

  return (
    <form id={id} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="rounded-md border border-warning/30 bg-warning/5 px-3 py-2.5 flex items-start gap-2.5">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
        <p className="text-sm text-warning">
          Ao abrir uma disputa, o pagamento será bloqueado até resolução. Esta ação será registrada permanentemente na auditoria.
        </p>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Tipo de disputa *</p>
        <Controller
          control={control}
          name="disputeType"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o tipo de disputa" />
              </SelectTrigger>
              <SelectContent>
                {DISPUTE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {DISPUTE_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.disputeType && (
          <p className="text-xs text-danger">{errors.disputeType.message ?? "Selecione o tipo de disputa."}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">Motivo da disputa *</p>
        <Textarea
          {...register("reason")}
          placeholder="Descreva detalhadamente o motivo da disputa..."
          rows={3}
          disabled={disabled}
        />
        <div className="flex items-center justify-between">
          {errors.reason ? (
            <p className="text-xs text-danger">{errors.reason.message}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">{reason.length} / 10 min</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium text-foreground">
          Notas adicionais{" "}
          <span className="text-muted-foreground font-normal">(opcional)</span>
        </p>
        <Textarea
          {...register("notes")}
          placeholder="Informações complementares..."
          rows={2}
          disabled={disabled}
        />
      </div>
    </form>
  );
}
