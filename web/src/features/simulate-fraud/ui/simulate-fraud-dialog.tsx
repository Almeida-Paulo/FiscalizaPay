"use client";

import { useId } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { Loader2 } from "lucide-react";
import type { SimulateFraudValues } from "../model/simulate-fraud-schema";
import { SimulateFraudForm } from "./simulate-fraud-form";

interface SimulateFraudDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SimulateFraudValues) => void;
  originalHash: string;
  isLoading?: boolean;
}

export function SimulateFraudDialog({
  open,
  onOpenChange,
  onSubmit,
  originalHash,
  isLoading,
}: SimulateFraudDialogProps) {
  const formId = useId();

  function handleOpenChange(v: boolean) {
    if (isLoading) return;
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] sm:max-w-xl"
        showCloseButton={!isLoading}
      >
        <DialogHeader>
          <DialogTitle>Simular adulteração de documento</DialogTitle>
          <DialogDescription>
            Substitua o hash do documento para testar a detecção de fraude.
          </DialogDescription>
        </DialogHeader>

        <SimulateFraudForm
          id={formId}
          originalHash={originalHash}
          onSubmit={onSubmit}
          disabled={isLoading}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="destructive"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simulando fraude...
              </>
            ) : (
              "Simular fraude"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
