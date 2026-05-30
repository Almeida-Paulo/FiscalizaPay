import { FileText } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { CopyButton } from "@/shared/ui/copy-button";
import { shortenHash } from "@/shared/lib/formatters";

interface DocumentHashViewerProps {
  hash: string;
  className?: string;
}

export function DocumentHashViewer({ hash, className }: DocumentHashViewerProps) {
  return (
    <span className={cn("flex items-center gap-1 font-mono text-xs", className)}>
      <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
      <span className="text-muted-foreground">{shortenHash(hash, 6)}</span>
      <CopyButton value={hash} />
    </span>
  );
}
