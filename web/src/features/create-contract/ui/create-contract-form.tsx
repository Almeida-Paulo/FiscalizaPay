"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { SectionTitle } from "@/shared/ui/section-title";
import { Card, CardContent } from "@/shared/ui/card";
import { useCreateContract } from "@/entities/contract/api/use-create-contract";
import type { CreateContractPayload } from "@/entities/contract/model/api-types";
import {
  createContractSchema,
  type CreateContractFormData,
} from "../model/create-contract-schema";

function toPayload(data: CreateContractFormData): CreateContractPayload {
  return {
    contractNumber: data.contractNumber,
    publicAgency: data.publicAgency,
    supplierName: data.supplierName,
    supplierWallet: data.supplierWallet || undefined,
    object: data.object,
    amount: data.amount,
    deadline: `${data.deadline}T23:59:59.000Z`,
    inspectorName: data.inspectorName,
    inspectorWallet: data.inspectorWallet || undefined,
    logisticsResponsible: data.logisticsResponsible,
    logisticsWallet: data.logisticsWallet || undefined,
    managerName: data.managerName || undefined,
    managerWallet: data.managerWallet || undefined,
    documentHash: data.documentHash || undefined,
  };
}

interface FieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

export function CreateContractForm() {
  const router = useRouter();
  const mutation = useCreateContract();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateContractFormData>({
    resolver: zodResolver(createContractSchema),
    defaultValues: {
      contractNumber: "",
      publicAgency: "",
      supplierName: "",
      supplierWallet: "",
      object: "",
      amount: undefined as unknown as number,
      deadline: "",
      inspectorName: "",
      inspectorWallet: "",
      logisticsResponsible: "",
      logisticsWallet: "",
      managerName: "",
      managerWallet: "",
      documentHash: "",
    },
  });

  function onSubmit(data: CreateContractFormData) {
    mutation.mutate(toPayload(data), {
      onSuccess: () => router.push("/contracts"),
    });
  }

  const isPending = isSubmitting || mutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Dados básicos */}
      <Card>
        <CardContent className="pt-6">
          <SectionTitle
            title="Dados do contrato"
            description="Informações básicas de identificação"
            className="mb-4"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Número do contrato"
              error={errors.contractNumber?.message}
              required
            >
              <Input
                {...register("contractNumber")}
                placeholder="Ex: CTR-2025-0001"
                aria-invalid={!!errors.contractNumber}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Órgão público"
              error={errors.publicAgency?.message}
              required
            >
              <Input
                {...register("publicAgency")}
                placeholder="Ex: Prefeitura Municipal de São Paulo"
                aria-invalid={!!errors.publicAgency}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Valor do contrato (R$)"
              error={errors.amount?.message}
              required
            >
              <Input
                {...register("amount", { valueAsNumber: true })}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Ex: 150000.00"
                aria-invalid={!!errors.amount}
                disabled={isPending}
              />
            </Field>

            <Field label="Prazo de entrega" error={errors.deadline?.message} required>
              <Input
                {...register("deadline")}
                type="date"
                aria-invalid={!!errors.deadline}
                disabled={isPending}
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field
              label="Objeto do contrato"
              error={errors.object?.message}
              required
            >
              <Textarea
                {...register("object")}
                placeholder="Descreva o objeto do contrato..."
                rows={3}
                aria-invalid={!!errors.object}
                disabled={isPending}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Fornecedor */}
      <Card>
        <CardContent className="pt-6">
          <SectionTitle
            title="Fornecedor"
            description="Empresa responsável pela execução"
            className="mb-4"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Nome do fornecedor"
              error={errors.supplierName?.message}
              required
            >
              <Input
                {...register("supplierName")}
                placeholder="Razão social ou nome"
                aria-invalid={!!errors.supplierName}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Carteira blockchain (opcional)"
              error={errors.supplierWallet?.message}
            >
              <Input
                {...register("supplierWallet")}
                placeholder="0x..."
                aria-invalid={!!errors.supplierWallet}
                disabled={isPending}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Fiscal */}
      <Card>
        <CardContent className="pt-6">
          <SectionTitle
            title="Fiscal"
            description="Responsável pela fiscalização do contrato"
            className="mb-4"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Nome do fiscal"
              error={errors.inspectorName?.message}
              required
            >
              <Input
                {...register("inspectorName")}
                placeholder="Nome completo"
                aria-invalid={!!errors.inspectorName}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Carteira blockchain (opcional)"
              error={errors.inspectorWallet?.message}
            >
              <Input
                {...register("inspectorWallet")}
                placeholder="0x..."
                aria-invalid={!!errors.inspectorWallet}
                disabled={isPending}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Logística */}
      <Card>
        <CardContent className="pt-6">
          <SectionTitle
            title="Logística"
            description="Responsável pelo transporte e entrega"
            className="mb-4"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              label="Responsável pela logística"
              error={errors.logisticsResponsible?.message}
              required
            >
              <Input
                {...register("logisticsResponsible")}
                placeholder="Nome ou empresa"
                aria-invalid={!!errors.logisticsResponsible}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Carteira blockchain (opcional)"
              error={errors.logisticsWallet?.message}
            >
              <Input
                {...register("logisticsWallet")}
                placeholder="0x..."
                aria-invalid={!!errors.logisticsWallet}
                disabled={isPending}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Gestor (opcional) */}
      <Card>
        <CardContent className="pt-6">
          <SectionTitle
            title="Gestor (opcional)"
            description="Autoridade responsável por liberar pagamentos"
            className="mb-4"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nome do gestor" error={errors.managerName?.message}>
              <Input
                {...register("managerName")}
                placeholder="Nome completo"
                aria-invalid={!!errors.managerName}
                disabled={isPending}
              />
            </Field>

            <Field
              label="Carteira blockchain (opcional)"
              error={errors.managerWallet?.message}
            >
              <Input
                {...register("managerWallet")}
                placeholder="0x..."
                aria-invalid={!!errors.managerWallet}
                disabled={isPending}
              />
            </Field>
          </div>
        </CardContent>
      </Card>

      {/* Hash do documento (opcional) */}
      <Card>
        <CardContent className="pt-6">
          <SectionTitle
            title="Hash do documento (opcional)"
            description="Fingerprint criptográfico do documento do contrato"
            className="mb-4"
          />
          <Field
            label="Hash do documento"
            error={errors.documentHash?.message}
          >
            <Input
              {...register("documentHash")}
              placeholder="Ex: sha256:abc123..."
              aria-invalid={!!errors.documentHash}
              disabled={isPending}
            />
          </Field>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/contracts")}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Salvando..." : "Criar contrato"}
        </Button>
      </div>
    </form>
  );
}
