"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/axios";
import {
  type ContentStatus,
  type Project,
  type ProjectFormValues,
} from "@/features/cms/schemas";
import { queryKeys } from "@/features/cms/query-keys";

export function useProjects() {
  return useQuery({
    queryFn: () => apiRequest<Project[]>({ method: "GET", url: "/api/admin/projects" }),
    queryKey: queryKeys.projects,
  });
}

export function useProject(id?: string) {
  return useQuery({
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProjectFormValues) =>
      apiRequest<Project>({ data: input, method: "POST", url: "/api/admin/projects" }),
    onError: () => toast.error("Project could not be created."),
    onSuccess: () => toast.success("Project created."),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ProjectFormValues) =>
      apiRequest<Project>({
        data: input,
        method: "PUT",
        url: `/api/admin/projects/${id}`,
      }),
    onError: () => toast.error("Project could not be updated."),
    onSuccess: (project) => {
      queryClient.setQueryData(queryKeys.project(id), project);
      toast.success("Project updated.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ id: string }>({ method: "DELETE", url: `/api/admin/projects/${id}` }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects });
      const previous = queryClient.getQueryData<Project[]>(queryKeys.projects);
      queryClient.setQueryData<Project[]>(queryKeys.projects, (current) =>
        (current ?? []).filter((project) => project.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(queryKeys.projects, context?.previous);
      toast.error("Project could not be deleted.");
    },
    onSuccess: () => toast.success("Project deleted."),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useBulkDeleteProjects() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: string[]) =>
      apiRequest<{ ids: string[] }>({
        data: { ids },
        method: "POST",
        url: "/api/admin/projects/bulk-delete",
      }),
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects });
      const previous = queryClient.getQueryData<Project[]>(queryKeys.projects);
      queryClient.setQueryData<Project[]>(queryKeys.projects, (current) =>
        (current ?? []).filter((project) => !ids.includes(project.id)),
      );
      return { previous };
    },
    onError: (_error, _ids, context) => {
      queryClient.setQueryData(queryKeys.projects, context?.previous);
      toast.error("Projects could not be deleted.");
    },
    onSuccess: () => toast.success("Projects deleted."),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useToggleProjectStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiRequest<Project>({
        data: { status },
        method: "PATCH",
        url: `/api/admin/projects/${id}/status`,
      }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.projects });
      const previous = queryClient.getQueryData<Project[]>(queryKeys.projects);
      queryClient.setQueryData<Project[]>(queryKeys.projects, (current) =>
        (current ?? []).map((project) =>
          project.id === id ? { ...project, status } : project,
        ),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKeys.projects, context?.previous);
      toast.error("Status could not be changed.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
