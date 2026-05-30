"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, EyeOff, Loader2, Save, Wrench } from "lucide-react";
import { m } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { AvailableBadge } from "@/features/portfolio/components/available-badge";
import { WipBadge } from "@/features/portfolio/components/wip-badge";
import {
  useAdminSettings,
  useUpdateAccountSettings,
  useUpdateBadgeSettings,
  useUpdatePasswordSettings,
  useUpdateSiteSettings,
} from "@/features/settings/hooks/use-settings";
import {
  accountSettingsSchema,
  badgeSettingsSchema,
  emptyAccountSettings,
  emptyPasswordSettings,
  emptySiteSettings,
  passwordSettingsSchema,
  siteSettingsSchema,
  type AccountSettingsFormValues,
  type BadgeMode,
  type BadgeSettingsFormValues,
  type PasswordSettingsFormValues,
  type SiteSettingsFormValues,
} from "@/features/settings/schemas";
import { ApiRequestError } from "@/lib/axios";
import { cn } from "@/lib/utils";

const badgeOptions: Array<{
  description: string;
  icon: typeof Wrench;
  label: string;
  mode: BadgeMode;
  title: string;
}> = [
  {
    description: "Shows the work in progress badge",
    icon: Wrench,
    label: "Work in Progress",
    mode: "wip",
    title: "WIP",
  },
  {
    description: "Shows open to work badge",
    icon: CircleCheck,
    label: "Available for Work",
    mode: "available",
    title: "AVAILABLE",
  },
  {
    description: "Hides the portfolio status badge",
    icon: EyeOff,
    label: "Hidden",
    mode: "hidden",
    title: "HIDDEN",
  },
];

export function SettingsPage() {
  const { data: settings, isLoading } = useAdminSettings();
  const updateAccount = useUpdateAccountSettings();
  const updatePassword = useUpdatePasswordSettings();
  const updateSite = useUpdateSiteSettings();
  const updateBadge = useUpdateBadgeSettings();
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const accountForm = useForm<AccountSettingsFormValues>({
    defaultValues: emptyAccountSettings(),
    resolver: zodResolver(accountSettingsSchema) as Resolver<AccountSettingsFormValues>,
  });
  const passwordForm = useForm<PasswordSettingsFormValues>({
    defaultValues: emptyPasswordSettings(),
    resolver: zodResolver(passwordSettingsSchema) as Resolver<PasswordSettingsFormValues>,
  });
  const siteForm = useForm<SiteSettingsFormValues>({
    defaultValues: emptySiteSettings(),
    resolver: zodResolver(siteSettingsSchema) as Resolver<SiteSettingsFormValues>,
  });
  const badgeForm = useForm<BadgeSettingsFormValues>({
    defaultValues: { badgeMode: "wip" },
    resolver: zodResolver(badgeSettingsSchema) as Resolver<BadgeSettingsFormValues>,
  });
  const metaDescription = useWatch({
    control: siteForm.control,
    name: "metaDescription",
  });
  const badgeMode = useWatch({
    control: badgeForm.control,
    name: "badgeMode",
  });

  useEffect(() => {
    if (!settings) {
      return;
    }

    accountForm.reset({
      currentPassword: "",
      displayName: settings.account.displayName,
      email: settings.account.email,
    });
    siteForm.reset({
      metaDescription: settings.site.metaDescription,
      siteTitle: settings.site.siteTitle,
      tagline: settings.site.tagline,
    });
    badgeForm.reset({ badgeMode: settings.site.badgeMode });
  }, [accountForm, badgeForm, settings, siteForm]);

  if (isLoading) {
    return <Skeleton className="h-[640px] rounded-none" />;
  }

  function saveAccount(values: AccountSettingsFormValues) {
    updateAccount.mutate(values, {
      onError: (error) => {
        if (error instanceof ApiRequestError) {
          accountForm.setError("currentPassword", { message: error.message });
        }
      },
      onSuccess: (account) => {
        accountForm.reset({
          currentPassword: "",
          displayName: account.displayName,
          email: account.email,
        });
      },
    });
  }

  function savePassword(values: PasswordSettingsFormValues) {
    updatePassword.mutate(values, {
      onError: (error) => {
        if (error instanceof ApiRequestError) {
          passwordForm.setError("currentPassword", { message: error.message });
        }
      },
      onSuccess: () => {
        passwordForm.reset(emptyPasswordSettings());
        setIsPasswordOpen(false);
      },
    });
  }

  function saveSite(values: SiteSettingsFormValues) {
    updateSite.mutate(values, {
      onSuccess: (site) => {
        siteForm.reset({
          metaDescription: site.metaDescription,
          siteTitle: site.siteTitle,
          tagline: site.tagline,
        });
      },
    });
  }

  function saveBadge(values: BadgeSettingsFormValues) {
    updateBadge.mutate(values, {
      onSuccess: (site) => {
        badgeForm.reset({ badgeMode: site.badgeMode });
      },
    });
  }

  const accountIsDirty =
    accountForm.formState.isDirty || passwordForm.formState.isDirty;
  const remainingMetaCharacters = 160 - (metaDescription?.length ?? 0);
  const metaCounterClass =
    remainingMetaCharacters <= 5
      ? "text-red-500"
      : remainingMetaCharacters <= 20
        ? "text-yellow-500"
        : "text-muted-foreground";

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <SectionTitle dirty={accountIsDirty}>Account</SectionTitle>
          <CardDescription>
            Manage the admin identity shown in the dashboard header.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <form className="space-y-5" onSubmit={accountForm.handleSubmit(saveAccount)}>
            <div className="grid gap-5 lg:grid-cols-2">
              <Field
                error={accountForm.formState.errors.displayName?.message}
                label="Display name"
              >
                <Input
                  aria-invalid={Boolean(accountForm.formState.errors.displayName)}
                  {...accountForm.register("displayName")}
                />
              </Field>
              <Field
                error={accountForm.formState.errors.email?.message}
                label="Email address"
              >
                <Input
                  aria-invalid={Boolean(accountForm.formState.errors.email)}
                  type="email"
                  {...accountForm.register("email")}
                />
              </Field>
              <Field
                className="lg:col-span-2"
                error={accountForm.formState.errors.currentPassword?.message}
                label="Current password"
              >
                <Input
                  aria-invalid={Boolean(accountForm.formState.errors.currentPassword)}
                  autoComplete="current-password"
                  placeholder="Required only when changing email"
                  type="password"
                  {...accountForm.register("currentPassword")}
                />
              </Field>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button disabled={updateAccount.isPending} type="submit">
                {updateAccount.isPending ? (
                  <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                ) : (
                  <Save aria-hidden="true" className="size-4" />
                )}
                Save Account
              </Button>
              <Button
                onClick={() => setIsPasswordOpen((current) => !current)}
                type="button"
                variant="outline"
              >
                Change Password
              </Button>
            </div>
          </form>

          {isPasswordOpen ? (
            <form
              className="border-t pt-5"
              onSubmit={passwordForm.handleSubmit(savePassword)}
            >
              <div className="mb-5">
                <h3 className="font-mono font-semibold">Change Password</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Verify your current password before saving a new one.
                </p>
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
              <Field
                error={passwordForm.formState.errors.currentPassword?.message}
                label="Current password"
              >
                <Input
                  aria-invalid={Boolean(passwordForm.formState.errors.currentPassword)}
                  autoComplete="current-password"
                  type="password"
                  {...passwordForm.register("currentPassword")}
                />
              </Field>
              <Field
                error={passwordForm.formState.errors.newPassword?.message}
                label="New password"
              >
                <Input
                  aria-invalid={Boolean(passwordForm.formState.errors.newPassword)}
                  autoComplete="new-password"
                  type="password"
                  {...passwordForm.register("newPassword")}
                />
              </Field>
              <Field
                error={passwordForm.formState.errors.confirmPassword?.message}
                label="Confirm new password"
              >
                <Input
                  aria-invalid={Boolean(passwordForm.formState.errors.confirmPassword)}
                  autoComplete="new-password"
                  type="password"
                  {...passwordForm.register("confirmPassword")}
                />
              </Field>
              <div className="lg:col-span-3">
                <Button disabled={updatePassword.isPending} type="submit">
                  {updatePassword.isPending ? (
                    <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                  ) : (
                    <Save aria-hidden="true" className="size-4" />
                  )}
                  Update Password
                </Button>
              </div>
              </div>
            </form>
          ) : null}
        </CardContent>
      </Card>

      <form onSubmit={siteForm.handleSubmit(saveSite)}>
        <Card>
          <CardHeader>
            <SectionTitle dirty={siteForm.formState.isDirty}>Site</SectionTitle>
            <CardDescription>
              Configure browser titles and default SEO text.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-5 lg:grid-cols-2">
              <Field
                error={siteForm.formState.errors.siteTitle?.message}
                label="Site title"
              >
                <Input
                  aria-invalid={Boolean(siteForm.formState.errors.siteTitle)}
                  placeholder="John Doe"
                  {...siteForm.register("siteTitle")}
                />
              </Field>
              <Field
                error={siteForm.formState.errors.tagline?.message}
                label="Tagline / subtitle"
              >
                <Input
                  aria-invalid={Boolean(siteForm.formState.errors.tagline)}
                  placeholder="Full Stack Developer based in Manila"
                  {...siteForm.register("tagline")}
                />
              </Field>
              <Field
                className="lg:col-span-2"
                error={siteForm.formState.errors.metaDescription?.message}
                label="Meta description"
              >
                <Textarea
                  aria-invalid={Boolean(siteForm.formState.errors.metaDescription)}
                  className="min-h-28"
                  {...siteForm.register("metaDescription")}
                />
                <p className={cn("text-xs", metaCounterClass)}>
                  {remainingMetaCharacters} characters remaining
                </p>
              </Field>
            </div>
            <Button disabled={updateSite.isPending} type="submit">
              {updateSite.isPending ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Save aria-hidden="true" className="size-4" />
              )}
              Save Site
            </Button>
          </CardContent>
        </Card>
      </form>

      <form onSubmit={badgeForm.handleSubmit(saveBadge)}>
        <Card>
          <CardHeader>
            <SectionTitle dirty={badgeForm.formState.isDirty}>Site Badge</SectionTitle>
            <CardDescription>
              Control the badge displayed on your portfolio. Visitors see this in
              the bottom-right corner of every page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 lg:grid-cols-3">
              {badgeOptions.map((option) => {
                const Icon = option.icon;
                const selected = badgeMode === option.mode;

                return (
                  <button
                    className={cn(
                      "border p-4 text-left transition-colors",
                      selected
                        ? "border-foreground bg-foreground text-background"
                        : "hover:border-foreground",
                    )}
                    key={option.mode}
                    onClick={() =>
                      badgeForm.setValue("badgeMode", option.mode, {
                        shouldDirty: true,
                      })
                    }
                    type="button"
                  >
                    <Icon aria-hidden="true" className="size-5" />
                    <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em]">
                      {option.title}
                    </p>
                    <p className="mt-2 font-semibold">{option.label}</p>
                    <p
                      className={cn(
                        "mt-2 text-sm",
                        selected ? "text-background/70" : "text-muted-foreground",
                      )}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="border bg-[#111] p-4">
              <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Preview
              </p>
              <m.div
                animate={{ opacity: 1, y: 0 }}
                className="min-h-16"
                initial={{ opacity: 0, y: 8 }}
                key={badgeMode}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {badgeMode === "wip" ? <WipBadge preview /> : null}
                {badgeMode === "available" ? <AvailableBadge preview /> : null}
                {badgeMode === "hidden" ? (
                  <div className="border border-dashed p-4 font-mono text-sm text-muted-foreground">
                    badge.hidden = true
                  </div>
                ) : null}
              </m.div>
            </div>

            <Button disabled={updateBadge.isPending} type="submit">
              {updateBadge.isPending ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Save aria-hidden="true" className="size-4" />
              )}
              Save Badge
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

function SectionTitle({
  children,
  dirty,
}: {
  children: React.ReactNode;
  dirty: boolean;
}) {
  return (
    <CardTitle className="flex items-center gap-2 font-mono">
      {children}
      {dirty ? (
        <span aria-label="Unsaved changes" className="size-2 bg-foreground" />
      ) : null}
    </CardTitle>
  );
}

function Field({
  children,
  className,
  error,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  error?: string;
  label: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
