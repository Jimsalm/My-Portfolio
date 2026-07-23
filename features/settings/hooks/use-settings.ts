"use client";

import { useQuery as useConvexQuery } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { settingsQueryKeys } from "@/features/settings/query-keys";
import type {
  AccountSettings,
  AccountSettingsFormValues,
  AdminSettings,
  BadgeSettingsFormValues,
  PasswordSettingsFormValues,
  PublicSiteSettings,
  SiteSettingsFormValues,
} from "@/features/settings/schemas";
import { apiRequest, useApiMutation, useApiQuery } from "@/lib/api-client";

export function useAdminSettings() {
  return useApiQuery({
    queryFn: () =>
      apiRequest<AdminSettings>({ method: "GET", url: "/api/admin/settings" }),
    queryKey: settingsQueryKeys.admin,
  });
}

export function usePublicSettings(initialData?: PublicSiteSettings) {
  const data = useConvexQuery(api.api.settings.getPublicSettings, {});

  return {
    data: data ?? initialData,
    isLoading: data === undefined && initialData === undefined,
  };
}

export function useUpdateAccountSettings() {
  return useApiMutation({
    invalidate: [settingsQueryKeys.admin],
    mutationFn: (input: AccountSettingsFormValues) =>
      apiRequest<AccountSettings>({
        data: input,
        method: "PUT",
        url: "/api/admin/settings/account",
      }),
    onSuccess: () => toast.success("Settings saved successfully"),
    onError: () => toast.error("Failed to save. Please try again."),
  });
}

export function useUpdatePasswordSettings() {
  return useApiMutation({
    mutationFn: (input: PasswordSettingsFormValues) =>
      apiRequest<{ success: boolean }>({
        data: input,
        method: "PUT",
        url: "/api/admin/settings/password",
      }),
    onSuccess: () => toast.success("Settings saved successfully"),
    onError: () => toast.error("Failed to save. Please try again."),
  });
}

export function useUpdateSiteSettings() {
  return useApiMutation({
    invalidate: [settingsQueryKeys.admin],
    mutationFn: (input: SiteSettingsFormValues) =>
      apiRequest<PublicSiteSettings>({
        data: input,
        method: "PUT",
        url: "/api/admin/settings/site",
      }),
    onSuccess: () => toast.success("Settings saved successfully"),
    onError: () => toast.error("Failed to save. Please try again."),
  });
}

export function useUpdateBadgeSettings() {
  return useApiMutation({
    invalidate: [settingsQueryKeys.admin],
    mutationFn: (input: BadgeSettingsFormValues) =>
      apiRequest<PublicSiteSettings>({
        data: input,
        method: "PUT",
        url: "/api/admin/settings/badge",
      }),
    onSuccess: () => toast.success("Settings saved successfully"),
    onError: () => toast.error("Failed to save. Please try again."),
  });
}
