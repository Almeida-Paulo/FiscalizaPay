"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

interface CopyButtonProps {
  value: string;
  label?: string;
  successMessage?: string;
  className?: string;
}

export function CopyButton({
  value,
  label,
  successMessage = "Copiado para a área de transferência",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copiado" : "Copiar"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs",
        "text-muted-foreground transition-colors",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {label && <span>{label}</span>}
    </button>
  );
}
