import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { APP_NAME, APP_DESCRIPTION } from "@/shared/constants/theme";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6">
        <ShieldCheck className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {APP_NAME}
      </h1>
      <p className="mt-4 max-w-md text-base text-muted-foreground">
        {APP_DESCRIPTION}
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild size="lg">
          <Link href="/dashboard">Acessar Dashboard</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/contracts">Ver contratos</Link>
        </Button>
      </div>
    </div>
  );
}
