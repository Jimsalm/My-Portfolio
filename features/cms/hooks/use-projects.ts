"use client";

import { toast } from "sonner";

import { apiRequest, useApiMutation, useApiQuery } from "@/lib/api-client";
import {
  type ContentStatus,
  type Project,
  type ProjectFormValues,
} from "@/features/cms/schemas";
import { queryKeys } from "@/features/cms/query-keys";

export function useProjects() {
  return useApiQuery({
    queryFn: () => apiRequest<Project[]>({ method: "GET", url: "/api/admin/projects" }),
    queryKey: queryKeys.projects,
  });
}

export function useProject(id?: string) {
  return useApiQuery({
    enabled: Boolean(id),
    queryFn: () =>
      apiRequest<Project | null>({
        method: "GET",
        url: `/api/admin/projects/${id}`,
      }),
    queryKey: id ? queryKeys.project(id) : ["project"],
  });
}

export function useCreateProject() {
  return useApiMutation({
    invalidate: [queryKeys.projects, queryKeys.dashboard],
    mutationFn: (input: ProjectFormValues) =>
      apiRequest<Project>({ data: input, method: "POST", url: "/api/admin/projects" }),
    onError: () => toast.error("Project could not be created."),
    onSuccess: () => toast.success("Project created."),
  });
}

export function useUpdateProject(id: string) {
  return useApiMutation({
    invalidate: [queryKeys.project(id), queryKeys.projects, queryKeys.dashboard],
    mutationFn: (input: ProjectFormValues) =>
      apiRequest<Project>({
        data: input,
        method: "PUT",
        url: `/api/admin/projects/${id}`,
      }),
    onError: () => toast.error("Project could not be updated."),
    onSuccess: () => toast.success("Project updated."),
  });
}

export function useDeleteProject() {
  return useApiMutation({
    invalidate: [queryKeys.projects, queryKeys.dashboard],
    mutationFn: (id: string) =>
      apiRequest<{ id: string }>({ method: "DELETE", url: `/api/admin/projects/${id}` }),
    onError: () => toast.error("Project could not be deleted."),
    onSuccess: () => toast.success("Project deleted."),
  });
}

export function useBulkDeleteProjects() {
  return useApiMutation({
    invalidate: [queryKeys.projects, queryKeys.dashboard],
    mutationFn: (ids: string[]) =>
      apiRequest<{ ids: string[] }>({
        data: { ids },
        method: "POST",
        url: "/api/admin/projects/bulk-delete",
      }),
    onError: () => toast.error("Projects could not be deleted."),
    onSuccess: () => toast.success("Projects deleted."),
  });
}

export function useToggleProjectStatus() {
  return useApiMutation({
    invalidate: [queryKeys.projects, queryKeys.dashboard],
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiRequest<Project>({
        data: { status },
        method: "PATCH",
        url: `/api/admin/projects/${id}/status`,
      }),
    onError: () => toast.error("Status could not be changed."),
  });
}
