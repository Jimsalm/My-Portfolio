"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { apiRequest } from "@/lib/axios";
import {
  type BlogPost,
  type BlogPostFormValues,
  type ContentStatus,
} from "@/features/cms/schemas";
import { queryKeys } from "@/features/cms/query-keys";

export function useBlogPosts() {
  return useQuery({
    queryFn: () => apiRequest<BlogPost[]>({ method: "GET", url: "/api/admin/blog" }),
    queryKey: queryKeys.blogPosts,
  });
}

export function useBlogPost(id?: string) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () =>
      apiRequest<BlogPost | null>({
        method: "GET",
        url: `/api/admin/blog/${id}`,
      }),
    queryKey: id ? queryKeys.blogPost(id) : ["blog-post"],
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BlogPostFormValues) =>
      apiRequest<BlogPost>({ data: input, method: "POST", url: "/api/admin/blog" }),
    onError: () => toast.error("Blog post could not be created."),
    onSuccess: () => toast.success("Blog post created."),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useUpdateBlogPost(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BlogPostFormValues) =>
      apiRequest<BlogPost>({
        data: input,
        method: "PUT",
        url: `/api/admin/blog/${id}`,
      }),
    onError: () => toast.error("Blog post could not be updated."),
    onSuccess: (post) => {
      queryClient.setQueryData(queryKeys.blogPost(id), post);
      toast.success("Blog post updated.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiRequest<{ id: string }>({ method: "DELETE", url: `/api/admin/blog/${id}` }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.blogPosts });
      const previous = queryClient.getQueryData<BlogPost[]>(queryKeys.blogPosts);
      queryClient.setQueryData<BlogPost[]>(queryKeys.blogPosts, (current) =>
        (current ?? []).filter((post) => post.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(queryKeys.blogPosts, context?.previous);
      toast.error("Blog post could not be deleted.");
    },
    onSuccess: () => toast.success("Blog post deleted."),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}

export function useToggleBlogPostStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiRequest<BlogPost>({
        data: { status },
        method: "PATCH",
        url: `/api/admin/blog/${id}/status`,
      }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.blogPosts });
      const previous = queryClient.getQueryData<BlogPost[]>(queryKeys.blogPosts);
      queryClient.setQueryData<BlogPost[]>(queryKeys.blogPosts, (current) =>
        (current ?? []).map((post) => (post.id === id ? { ...post, status } : post)),
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKeys.blogPosts, context?.previous);
      toast.error("Status could not be changed.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.blogPosts });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    },
  });
}
