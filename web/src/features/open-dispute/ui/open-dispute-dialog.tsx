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
import type { OpenDisputeValues } from "../model/open-dispute-schema";
import { OpenDisputeForm } from "./open-dispute-form";

interface OpenDisputeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: OpenDisputeValues) => void;
  isLoading?: boolean;
}

export function OpenDisputeDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: OpenDisputeDialogProps) {
  const formId = useId();

  function handleOpenChange(v: boolean) {
    if (isLoading) return;
    onOpenChange(v);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[calc(100%-2rem)] sm:max-w-lg"
        showCloseButton={!isLoading}
      >
        <DialogHeader>
          <DialogTitle>Abrir disputa</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para registrar a divergência no contrato.
          </DialogDescription>
        </DialogHeader>

        <OpenDisputeForm id={formId} onSubmit={onSubmit} disabled={isLoading} />

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
                Abrindo disputa...
              </>
            ) : (
              "Abrir disputa"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
