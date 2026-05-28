"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,      // dados ficam frescos por 1 minuto
        retry: 1,                   // 1 retry em caso de erro
        refetchOnWindowFocus: false, // não revalidar ao focar na janela
      },
    },
  });
}

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // useState com factory garante que o QueryClient seja criado uma única vez
  // por montagem do componente, sem recriar a cada render
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
