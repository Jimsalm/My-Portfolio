"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Controller,
  useForm,
  useWatch,
  type Resolver,
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  certificationFormSchema,
  emptyCertification,
  type CertificationFormValues,
} from "@/features/certifications/schemas";
import {
  useCertification,
  useCreateCertification,
  useUpdateCertification,
} from "@/features/certifications/hooks/use-certifications";
import { UploadField } from "@/features/cms/components/upload-field";
import {
  useAutoSaveDraft,
  useUnsavedChangesWarning,
} from "@/features/cms/hooks/use-form-safety";

type CertificationFormPageProps = {
  id?: string;
  mode: "create" | "edit";
};

export function CertificationFormPage({
  id,
  mode,
}: CertificationFormPageProps) {
  const router = useRouter();
  const { data: certification, isLoading } = useCertification(id);
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification(id ?? "");
  const form = useForm<CertificationFormValues>({
    defaultValues: emptyCertification(),
    resolver: zodResolver(certificationFormSchema) as Resolver<CertificationFormValues>,
  });
  const doesNotExpire = useWatch({
    control: form.control,
    name: "doesNotExpire",
  });
  const draftKey = `certification-draft-${id ?? "new"}`;
  const isPending =
    createCertification.isPending || updateCertification.isPending;

  useUnsavedChangesWarning(form.formState.isDirty);
  useAutoSaveDraft(form, draftKey);

  useEffect(() => {
    if (mode === "edit" && certification) {
      form.reset(certification);
      return;
    }

    const savedDraft = window.localStorage.getItem(draftKey);

    if (mode === "create" && savedDraft) {
      form.reset(JSON.parse(savedDraft) as CertificationFormValues);
    }
  }, [certification, draftKey, form, mode]);

  function onSubmit(values: CertificationFormValues) {
    const action = mode === "create" ? createCertification : updateCertification;

    action.mutate(values, {
      onSuccess: () => {
        window.localStorage.removeItem(draftKey);
        router.push("/admin/certifications");
      },
    });
  }

  function onInvalid() {
    toast.error("Fix the highlighted fields before saving.");
    document
      .querySelector("[aria-invalid='true']")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (mode === "edit" && isLoading) {
    return <Skeleton className="h-96 rounded-none" />;
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={form.handleSubmit(onSubmit, onInvalid)}
    >
      <div className="flex flex-col justify-between gap-4 border bg-background/80 p-4 md:flex-row md:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            $ certification --edit
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">
            {mode === "create" ? "New Certification" : "Edit Certification"}
          </h2>
        </div>
        <div className="flex gap-2">
          <Button asChild className="rounded-none" variant="outline">
            <Link href="/admin/certifications">Cancel</Link>
          </Button>
          <Button className="rounded-none" disabled={isPending}>
            {isPending ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : null}
            Save
          </Button>
        </div>
      </div>

      <section className="grid gap-5 border bg-background/80 p-4 lg:grid-cols-2">
        <Field
          error={form.formState.errors.name?.message}
          label="Certificate name"
        >
          <Input
            aria-invalid={Boolean(form.formState.errors.name)}
            className="rounded-none"
            {...form.register("name")}
          />
        </Field>
        <Field
          error={form.formState.errors.organization?.message}
          label="Issuing organization"
        >
          <Input
            aria-invalid={Boolean(form.formState.errors.organization)}
            className="rounded-none"
            {...form.register("organization")}
          />
        </Field>
        <Controller
          control={form.control}
          name="organizationLogo"
          render={({ field }) => (
            <UploadField
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              endpoint="certificationLogo"
              label="Organization logo (optional)"
              maxSizeMb={2}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={form.control}
          name="badgeImage"
          render={({ field }) => (
            <UploadField
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              endpoint="certificationBadge"
              label="Badge image (optional)"
              maxSizeMb={2}
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
      </section>

      <section className="grid gap-5 border bg-background/80 p-4 lg:grid-cols-2">
        <Field
          error={form.formState.errors.issueDate?.message}
          label="Issue date"
        >
          <Input
            aria-invalid={Boolean(form.formState.errors.issueDate)}
            className="rounded-none"
            type="date"
            {...form.register("issueDate")}
          />
        </Field>
        {!doesNotExpire ? (
          <Controller
            control={form.control}
            name="expiryDate"
            render={({ field }) => (
              <Field
                error={form.formState.errors.expiryDate?.message}
                label="Expiry date (optional)"
              >
                <Input
                  aria-invalid={Boolean(form.formState.errors.expiryDate)}
                  className="rounded-none"
                  onChange={field.onChange}
                  type="date"
                  value={field.value ?? ""}
                />
              </Field>
            )}
          />
        ) : null}
        <Controller
          control={form.control}
          name="doesNotExpire"
          render={({ field }) => (
            <ToggleField
              checked={field.value}
              label="Does not expire"
              onCheckedChange={(checked) => {
                field.onChange(checked);

                if (checked) {
                  form.setValue("expiryDate", null, { shouldDirty: true });
                }
              }}
            />
          )}
        />
      </section>

      <section className="grid gap-5 border bg-background/80 p-4 lg:grid-cols-2">
        <Field
          error={form.formState.errors.credentialId?.message}
          label="Credential ID (optional)"
        >
          <Input
            aria-invalid={Boolean(form.formState.errors.credentialId)}
            className="rounded-none"
            placeholder="e.g. ABC-12345"
            {...form.register("credentialId")}
          />
        </Field>
        <Field
          error={form.formState.errors.credentialUrl?.message}
          label="Credential URL (optional)"
        >
          <Input
            aria-invalid={Boolean(form.formState.errors.credentialUrl)}
            className="rounded-none"
            placeholder="https://verify.example.com/cert/..."
            {...form.register("credentialUrl")}
          />
        </Field>
      </section>

      <section className="grid gap-5 border bg-background/80 p-4 lg:grid-cols-2">
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Field label="Status">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Field
          error={form.formState.errors.order?.message}
          label="Order / priority"
        >
          <Input
            aria-invalid={Boolean(form.formState.errors.order)}
            className="rounded-none"
            type="number"
            {...form.register("order")}
          />
        </Field>
        <Controller
          control={form.control}
          name="featured"
          render={({ field }) => (
            <ToggleField
              checked={field.value}
              label="Featured on homepage"
              onCheckedChange={field.onChange}
            />
          )}
        />
      </section>
    </form>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function ToggleField({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-11 items-center gap-3 border px-3 text-sm">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      {label}
    </label>
  );
}
