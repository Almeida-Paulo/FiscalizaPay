"use client";

import { Toaster } from "sonner";

/**
 * Renderiza o container de toast do Sonner.
 * Não precisa envolver children — o Toaster usa portal e renderiza
 * diretamente no body via createPortal.
 */
export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      theme="dark"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          background: "#0F172A",
          border: "1px solid #1E293B",
          color: "#F8FAFC",
        },
      }}
    />
  );
}
