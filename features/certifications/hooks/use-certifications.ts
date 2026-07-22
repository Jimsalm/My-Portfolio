"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { certificationQueryKeys } from "@/features/certifications/query-keys";
import type {
  Certification,
  CertificationFormValues,
} from "@/features/certifications/schemas";
import type { ContentStatus } from "@/features/cms/schemas";
import { queryKeys } from "@/features/cms/query-keys";
import { portfolioQueryKeys } from "@/features/portfolio/query-keys";
import { apiRequest } from "@/lib/axios";

function invalidateCertificationQueries(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: certificationQueryKeys.certifications });
  queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.certifications });
  queryClient.invalidateQueries({ queryKey: portfolioQueryKeys.home });
  queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function useCertifications() {
  return useQuery({
    queryFn: () =>
      apiRequest<Certification[]>({
        method: "GET",
        url: "/api/admin/certifications",
      }),
    queryKey: certificationQueryKeys.certifications,
  });
}

export function useCertification(id?: string) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () =>
      apiRequest<Certification | null>({
        method: "GET",
        url: `/api/admin/certifications/${id}`,
      }),
    queryKey: id ? certificationQueryKeys.certification(id) : ["certification"],
  });
}

export function useCreateCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CertificationFormValues) =>
      apiRequest<Certification>({
        data: input,
        method: "POST",
        url: "/api/admin/certifications",
      }),
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to save certification.")),
    onSuccess: () => toast.success("Certification saved."),
    onSettled: () => invalidateCertificationQueries(queryClient),
  });
}

export function useUpdateCertification(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CertificationFormValues) =>
      apiRequest<Certification>({
        data: input,
        method: "PUT",
        url: `/api/admin/certifications/${id}`,
      }),
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to save certification.")),
    onSuccess: (certification) => {
      queryClient.setQueryData(
        certificationQueryKeys.certification(id),
        certification,
      );
      toast.success("Certification saved.");
    },
    onSettled: () => invalidateCertificationQueries(queryClient),
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ id: string }>({
        method: "DELETE",
        url: `/api/admin/certifications/${id}`,
      }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: certificationQueryKeys.certifications });
      const previous = queryClient.getQueryData<Certification[]>(
        certificationQueryKeys.certifications,
      );
      queryClient.setQueryData<Certification[]>(
        certificationQueryKeys.certifications,
        (current) => (current ?? []).filter((item) => item.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(
        certificationQueryKeys.certifications,
        context?.previous,
      );
      toast.error("Certification could not be deleted.");
    },
    onSuccess: () => toast.success("Certification deleted."),
    onSettled: () => invalidateCertificationQueries(queryClient),
  });
}

export function useToggleCertificationFeatured() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ featured, id }: { featured: boolean; id: string }) =>
      apiRequest<Certification>({
        data: { featured },
        method: "PATCH",
        url: `/api/admin/certifications/${id}/featured`,
      }),
    onMutate: async ({ featured, id }) => {
      await queryClient.cancelQueries({ queryKey: certificationQueryKeys.certifications });
      const previous = queryClient.getQueryData<Certification[]>(
        certificationQueryKeys.certifications,
      );
      queryClient.setQueryData<Certification[]>(
        certificationQueryKeys.certifications,
        (current) =>
          (current ?? []).map((item) =>
            item.id === id ? { ...item, featured } : item,
          ),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        certificationQueryKeys.certifications,
        context?.previous,
      );
      toast.error("Featured state could not be changed.");
    },
    onSettled: () => invalidateCertificationQueries(queryClient),
  });
}

export function useToggleCertificationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiRequest<Certification>({
        data: { status },
        method: "PATCH",
        url: `/api/admin/certifications/${id}/status`,
      }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: certificationQueryKeys.certifications });
      const previous = queryClient.getQueryData<Certification[]>(
        certificationQueryKeys.certifications,
      );
      queryClient.setQueryData<Certification[]>(
        certificationQueryKeys.certifications,
        (current) =>
          (current ?? []).map((item) =>
            item.id === id ? { ...item, status } : item,
          ),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        certificationQueryKeys.certifications,
        context?.previous,
      );
      toast.error("Status could not be changed.");
    },
    onSettled: () => invalidateCertificationQueries(queryClient),
  });
}

export function useReorderCertifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      apiRequest<{ ids: string[] }>({
        data: { ids },
        method: "POST",
        url: "/api/admin/certifications/reorder",
      }),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: certificationQueryKeys.certifications });
      const previous = queryClient.getQueryData<Certification[]>(
        certificationQueryKeys.certifications,
      );
      const itemsById = new Map((previous ?? []).map((item) => [item.id, item]));
      const reordered = ids
        .map((id, order) => {
          const item = itemsById.get(id);
          return item ? { ...item, order } : null;
        })
        .filter((item): item is Certification => Boolean(item));
      queryClient.setQueryData(certificationQueryKeys.certifications, reordered);
      return { previous };
    },
    onError: (_error, _ids, context) => {
      queryClient.setQueryData(
        certificationQueryKeys.certifications,
        context?.previous,
      );
      toast.error("Certification order could not be saved.");
    },
    onSuccess: () => toast.success("Certification order saved."),
    onSettled: () => invalidateCertificationQueries(queryClient),
  });
}
