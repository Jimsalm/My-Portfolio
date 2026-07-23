"use client";

import { toast } from "sonner";

import { apiRequest, useApiMutation, useApiQuery } from "@/lib/api-client";
import {
  type BlogPost,
  type BlogPostFormValues,
  type ContentStatus,
} from "@/features/cms/schemas";
import { queryKeys } from "@/features/cms/query-keys";

export function useBlogPosts() {
  return useApiQuery({
    queryFn: () => apiRequest<BlogPost[]>({ method: "GET", url: "/api/admin/blog" }),
    queryKey: queryKeys.blogPosts,
  });
}

export function useBlogPost(id?: string) {
  return useApiQuery({
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
  return useApiMutation({
    invalidate: [queryKeys.blogPosts, queryKeys.dashboard],
    mutationFn: (input: BlogPostFormValues) =>
      apiRequest<BlogPost>({ data: input, method: "POST", url: "/api/admin/blog" }),
    onError: () => toast.error("Blog post could not be created."),
    onSuccess: () => toast.success("Blog post created."),
  });
}

export function useUpdateBlogPost(id: string) {
  return useApiMutation({
    invalidate: [queryKeys.blogPost(id), queryKeys.blogPosts, queryKeys.dashboard],
    mutationFn: (input: BlogPostFormValues) =>
      apiRequest<BlogPost>({
        data: input,
        method: "PUT",
        url: `/api/admin/blog/${id}`,
      }),
    onError: () => toast.error("Blog post could not be updated."),
    onSuccess: () => toast.success("Blog post updated."),
  });
}

export function useDeleteBlogPost() {
  return useApiMutation({
    invalidate: [queryKeys.blogPosts, queryKeys.dashboard],
    mutationFn: (id: string) =>
      apiRequest<{ id: string }>({ method: "DELETE", url: `/api/admin/blog/${id}` }),
    onError: () => toast.error("Blog post could not be deleted."),
    onSuccess: () => toast.success("Blog post deleted."),
  });
}

export function useToggleBlogPostStatus() {
  return useApiMutation({
    invalidate: [queryKeys.blogPosts, queryKeys.dashboard],
    mutationFn: ({ id, status }: { id: string; status: ContentStatus }) =>
      apiRequest<BlogPost>({
        data: { status },
        method: "PATCH",
        url: `/api/admin/blog/${id}/status`,
      }),
    onError: () => toast.error("Status could not be changed."),
  });
}
