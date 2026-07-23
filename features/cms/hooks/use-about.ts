"use client";

import { toast } from "sonner";

import { apiRequest, useApiMutation, useApiQuery } from "@/lib/api-client";
import { queryKeys } from "@/features/cms/query-keys";
import { type About, type AboutFormValues } from "@/features/cms/schemas";

export function useAbout() {
  return useApiQuery({
    queryFn: () => apiRequest<About>({ method: "GET", url: "/api/admin/about" }),
    queryKey: queryKeys.about,
  });
}

export function useUpdateAbout() {
  return useApiMutation({
    invalidate: [queryKeys.about, queryKeys.dashboard],
    mutationFn: (input: AboutFormValues) =>
      apiRequest<About>({ data: input, method: "PUT", url: "/api/admin/about" }),
    onError: () => toast.error("About page could not be updated."),
    onSuccess: () => toast.success("About page updated."),
  });
}
