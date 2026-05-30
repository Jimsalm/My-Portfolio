"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { portfolioQueryKeys } from "@/features/portfolio/query-keys";
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
import { apiRequest } from "@/lib/axios";

export function useAdminSettings() {
  return useQuery({
    queryFn: () =>
      apiRequest<AdminSettings>({ method: "GET", url: "/api/admin/settings" }),
    queryKey: settingsQueryKeys.admin,
  });
}

export function usePublicSettings(initialData?: PublicSiteSettings) {
  return useQuery({
    initialData,
    queryFn: () =>
      apiRequest<PublicSiteSettings>({
        method: "GET",
        url: "/api/public/settings",
      }),
    queryKey: settingsQueryKeys.public,
    refetchOnMount: false,
  });
}

export function useUpdateAccountSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AccountSettingsFormValues) =>
      apiRequest<AccountSettings>({
        data: input,
        method: "PUT",
        url: "/api/admin/settings/account",
      }),
    onSuccess: (account) => {
      queryClient.setQueryData<AdminSettings>(settingsQueryKeys.admin, (current) =>
        current ? { ...current, account } : current,
      );
      toast.success("Settings saved successfully");
    },
    onError: () => toast.error("Failed to save. Please try again."),
  });
}

export function useUpdatePasswordSettings() {
  return useMutation({
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SiteSettingsFormValues) =>
      apiRequest<PublicSiteSettings>({
        data: input,
        method: "PUT",
        url: "/api/admin/settings/site",
      }),
    onSuccess: (site) => {
      queryClient.setQueryData<AdminSettings>(settingsQueryKeys.admin, (current) =>
        current ? { ...current, site } : current,
      );
      queryClient.setQueryData(settingsQueryKeys.public, site);
      toast.success("Settings saved successfully");
    },
    onError: () => toast.error("Failed to save. Please try again."),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.public });
      queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.home });
    },
  });
}

export function useUpdateBadgeSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BadgeSettingsFormValues) =>
      apiRequest<PublicSiteSettings>({
        data: input,
        method: "PUT",
        url: "/api/admin/settings/badge",
      }),
    onSuccess: (site) => {
      queryClient.setQueryData<AdminSettings>(settingsQueryKeys.admin, (current) =>
        current ? { ...current, site } : current,
      );
      queryClient.setQueryData(settingsQueryKeys.public, site);
      toast.success("Settings saved successfully");
    },
    onError: () => toast.error("Failed to save. Please try again."),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: settingsQueryKeys.public });
    },
  });
}
