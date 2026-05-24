"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/axios";
import { queryKeys } from "@/features/cms/query-keys";
import { type About, type AboutFormValues } from "@/features/cms/schemas";

const publicPortfolioQueryKey = ["portfolio"] as const;

export function useAbout() {
  return useQuery({
    queryFn: () => apiRequest<About>({ method: "GET", url: "/api/admin/about" }),
    queryKey: queryKeys.about,
  });
}

export function useUpdateAbout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AboutFormValues) =>
      apiRequest<About>({ data: input, method: "PUT", url: "/api/admin/about" }),
    onError: () => toast.error("About page could not be updated."),
    onSuccess: (about) => {
      queryClient.setQueryData(queryKeys.about, about);
      toast.success("About page updated.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.about });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
      queryClient.invalidateQueries({ queryKey: publicPortfolioQueryKey });
    },
  });
}
