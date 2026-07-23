"use client";

import { toast } from "sonner";

import { certificationQueryKeys } from "@/features/certifications/query-keys";
import type {
  Certification,
  CertificationFormValues,
} from "@/features/certifications/schemas";
import type { ContentStatus } from "@/features/cms/schemas";
import { queryKeys } from "@/features/cms/query-keys";
import { apiRequest, useApiMutation, useApiQuery } from "@/lib/api-client";

const certificationInvalidationKeys = [
  certificationQueryKeys.certifications,
  queryKeys.dashboard,
];

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}

export function useCertifications() {
  return useApiQuery({
    queryFn: () =>
      apiRequest<Certification[]>({
        method: "GET",
        url: "/api/admin/certifications",
      }),
    queryKey: certificationQueryKeys.certifications,
  });
}

export function useCertification(id?: string) {
  return useApiQuery({
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
  return useApiMutation({
    invalidate: certificationInvalidationKeys,
    mutationFn: (input: CertificationFormValues) =>
      apiRequest<Certification>({
        data: input,
        method: "POST",
        url: "/api/admin/certifications",
      }),
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to save certification.")),
    onSuccess: () => toast.success("Certification saved."),
  });
}

export function useUpdateCertification(id: string) {
  return useApiMutation({
    invalidate: [
      certificationQueryKeys.certification(id),
      ...certificationInvalidationKeys,
    ],
    mutationFn: (input: CertificationFormValues) =>
      apiRequest<Certification>({
        data: input,
        method: "PUT",
        url: `/api/admin/certifications/${id}`,
      }),
    onError: (error) =>
      toast.error(getErrorMessage(error, "Failed to save certification.")),
    onSuccess: () => toast.success("Certification saved."),
  });
}

export function useDeleteCertification() {
  return useApiMutation({
    invalidate: certificationInvalidationKeys,
    mutationFn: (id: string) =>
      apiRequest<{ id: string }>({
        method: "DELETE",
        url: `/api/admin/certifications/${id}`,
      }),
    onError: () => toast.error("Certification could not be deleted."),
    onSuccess: () => toast.success("Certification deleted."),
  });
}

export function useToggleCertificationFeatured() {
  return useApiMutation({
    invalidate: certificationInvalidationKeys,
    mutationFn: ({ featured, id }: { featured: boolean; id: string }) =>
      apiRequest<Certification>({
        data: { featured },
        method: "PATCH",
        url: `/api/admin/certifications/${id}/featured`,
      }),
    onError: () => toast.error("Featured state could not be changed."),
  });
}

export function useToggleCertificationStatus() {
  return useApiMutation({
    invalidate: certificationInvalidationKeys,
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiRequest<Certification>({
        data: { status },
        method: "PATCH",
        url: `/api/admin/certifications/${id}/status`,
      }),
    onError: () => toast.error("Status could not be changed."),
  });
}

export function useReorderCertifications() {
  return useApiMutation({
    invalidate: certificationInvalidationKeys,
    mutationFn: (ids: string[]) =>
      apiRequest<{ ids: string[] }>({
        data: { ids },
        method: "POST",
        url: "/api/admin/certifications/reorder",
      }),
    onError: () => toast.error("Certification order could not be saved."),
    onSuccess: () => toast.success("Certification order saved."),
  });
}
