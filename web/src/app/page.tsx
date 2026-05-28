import { FileSearch, ShieldCheck, CheckCircle } from "lucide-react";
import { PermissionsShowcase } from "./permissions-showcase";
import { ContractStatusBadge } from "@/entities/contract/ui/contract-status-badge";
import { RoleBadge } from "@/entities/profile/ui/role-badge";
import type { ContractStatus } from "@/entities/contract";
import type { UserRole } from "@/entities/profile";
import { CONTRACT_STATUS_MAP } from "@/entities/contract";
import { ROLE_LABELS } from "@/entities/profile";
import { EVENT_TYPE_LABELS } from "@/entities/contract-event";
import { formatCurrencyBRL, shortenAddress } from "@/shared/lib/formatters";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { Separator } from "@/shared/ui/separator";
import { EmptyState } from "@/shared/ui/empty-state";
import { ErrorState } from "@/shared/ui/error-state";
import { LoadingState } from "@/shared/ui/loading-state";
import { PageHeader } from "@/shared/ui/page-header";
import { SectionTitle } from "@/shared/ui/section-title";
import { CopyButton } from "@/shared/ui/copy-button";
import { MotionContainer } from "@/shared/ui/motion-container";
import { APP_NAME, APP_DESCRIPTION } from "@/shared/constants/theme";

/**
 * Showcase temporário do Design System — Bloco 3
 * Esta página será substituída pelo dashboard real no Bloco 9.
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <div className="mx-auto max-w-4xl space-y-10">

        {/* Cabeçalho */}
        <MotionContainer>
          <PageHeader
            title={APP_NAME}
            description={APP_DESCRIPTION}
            badge={<Badge variant="outline">Design System — Bloco 3</Badge>}
          />
        </MotionContainer>

        <Separator />

        {/* Botões */}
        <MotionContainer delay={0.05}>
          <SectionTitle title="Botões" description="Variantes base do shadcn/ui" />
          <div className="mt-4 flex flex-wrap gap-3">
            <Button>Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destrutivo</Button>
          </div>
        </MotionContainer>

        <Separator />

        {/* Badges */}
        <MotionContainer delay={0.1}>
          <SectionTitle title="Badges" description="Status e labels visuais" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </MotionContainer>

        <Separator />

        {/* Cards */}
        <MotionContainer delay={0.15}>
          <SectionTitle title="Cards" description="Superfícies principais da interface" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Contratos ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Em validação</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-warning">4</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Em disputa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-danger">1</p>
              </CardContent>
            </Card>
          </div>
        </MotionContainer>

        <Separator />

        {/* Skeleton */}
        <MotionContainer delay={0.2}>
          <SectionTitle title="Skeletons" description="Estados de carregamento" />
          <div className="mt-4 space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </MotionContainer>

        <Separator />

        {/* Estados visuais */}
        <MotionContainer delay={0.25}>
          <SectionTitle title="Estados visuais" description="Empty, Error e Loading" />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <EmptyState
                title="Sem contratos"
                description="Crie um contrato para começar."
                icon={<FileSearch className="h-6 w-6" />}
              />
            </Card>
            <Card>
              <ErrorState
                title="Falha ao carregar"
                description="Verifique sua conexão e tente novamente."
              />
            </Card>
            <Card>
              <LoadingState label="Carregando contratos..." />
            </Card>
          </div>
        </MotionContainer>

        <Separator />

        {/* CopyButton */}
        <MotionContainer delay={0.3}>
          <SectionTitle
            title="CopyButton"
            description="Usado em documentHash e transactionHash"
          />
          <div className="mt-4 flex items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 font-mono text-xs text-primary">
              0xa1b2c3d4e5f6...
            </code>
            <CopyButton
              value="0xa1b2c3d4e5f6789012345678901234567890abcdef"
              label="Copiar hash"
            />
          </div>
        </MotionContainer>

        <Separator />

        {/* Paleta */}
        <MotionContainer delay={0.35}>
          <SectionTitle title="Paleta Oraculum" description="Cores oficiais do Design System" />
          <div className="mt-4 flex flex-wrap gap-3">
            {[
              { label: "Primary", cls: "bg-primary" },
              { label: "Success", cls: "bg-success" },
              { label: "Warning", cls: "bg-warning" },
              { label: "Danger", cls: "bg-danger" },
              { label: "Info", cls: "bg-info" },
              { label: "Muted", cls: "bg-muted" },
            ].map(({ label, cls }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <div className={`h-10 w-10 rounded-lg border border-border ${cls}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </MotionContainer>

        <Separator />

        {/* Domínio — Status de contratos */}
        <MotionContainer delay={0.4}>
          <SectionTitle
            title="Status do contrato"
            description="Bloco 4 — Modelos de domínio implementados"
          />
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(Object.entries(CONTRACT_STATUS_MAP) as [string, { label: string; description: string; progress: number }][]).map(
              ([status, info]) => (
                <Card key={status} className="p-3">
                  <p className="font-mono text-xs text-muted-foreground">
                    {status}
                  </p>
                  <p className="mt-1 text-sm font-medium">{info.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {info.progress}%
                  </p>
                </Card>
              ),
            )}
          </div>
        </MotionContainer>

        <Separator />

        {/* Domínio — Roles e Formatters */}
        <MotionContainer delay={0.45}>
          <SectionTitle
            title="Roles e helpers"
            description="UserRole labels e formatCurrencyBRL / shortenAddress"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {Object.values(ROLE_LABELS).map((label) => (
              <Badge key={label} variant="outline">
                {label}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-1">
            <p className="text-sm">
              <span className="text-muted-foreground">formatCurrencyBRL(150000): </span>
              <span className="font-mono text-primary">
                {formatCurrencyBRL(150000)}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">shortenAddress: </span>
              <span className="font-mono text-primary">
                {shortenAddress("0x742d35Cc6634C0532925a3b8D4C9C35")}
              </span>
            </p>
          </div>
        </MotionContainer>

        <Separator />

        {/* Bloco 5 — Regras visuais de permissão */}
        <MotionContainer delay={0.5}>
          <SectionTitle
            title="Regras visuais — Bloco 5"
            description="Troque o perfil para ver quais ações ficam disponíveis"
          />
          <div className="mt-4">
            <PermissionsShowcase />
          </div>
        </MotionContainer>

        <Separator />

        {/* Status badges — usando ContractStatusBadge */}
        <MotionContainer delay={0.55}>
          <SectionTitle title="ContractStatusBadge" description="Badge visual por status" />
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                "CRIADO",
                "ENVIADO",
                "ENTREGUE",
                "VALIDADO",
                "PAGAMENTO_AUTORIZADO",
                "DISPUTA",
              ] as ContractStatus[]
            ).map((s) => (
              <ContractStatusBadge key={s} status={s} />
            ))}
          </div>
        </MotionContainer>

        <Separator />

        {/* Role badges */}
        <MotionContainer delay={0.6}>
          <SectionTitle title="RoleBadge" description="Badge visual por role" />
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                "GESTOR",
                "FORNECEDOR",
                "ENTREGADOR",
                "FISCAL",
                "AUDITOR",
              ] as UserRole[]
            ).map((r) => (
              <RoleBadge key={r} role={r} />
            ))}
          </div>
        </MotionContainer>

        <div className="pb-8 pt-4">
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle className="h-3.5 w-3.5 text-success" />
            Bloco 5 completo — regras visuais, PermissionGate e perfil simulado prontos
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            {Object.keys(EVENT_TYPE_LABELS).length} event types · backend valida de verdade
          </p>
        </div>

      </div>
    </main>
  );
}
