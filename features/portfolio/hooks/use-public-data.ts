"use client";

import { useQuery } from "@tanstack/react-query";

import { apiRequest } from "@/lib/axios";
import { portfolioQueryKeys } from "@/features/portfolio/query-keys";
import type {
  PublicAbout,
  PublicBlogPost,
  PublicBlogPostDetailData,
  PublicHomeData,
  PublicProject,
  PublicProjectDetailData,
} from "@/features/portfolio/types";

export function usePublicHome(initialData?: PublicHomeData) {
  return useQuery({
    initialData,
    queryFn: () => apiRequest<PublicHomeData>({ method: "GET", url: "/api/public/home" }),
    queryKey: portfolioQueryKeys.home,
    refetchOnMount: "always",
  });
}

export function usePublicProjects(initialData?: PublicProject[]) {
  return useQuery({
    initialData,
    queryFn: () => apiRequest<PublicProject[]>({ method: "GET", url: "/api/public/projects" }),
    queryKey: portfolioQueryKeys.projects,
    refetchOnMount: "always",
  });
}

export function usePublicProject(slug: string, initialData?: PublicProjectDetailData) {
  return useQuery({
    initialData,
    queryFn: () =>
      apiRequest<PublicProjectDetailData>({
        method: "GET",
        url: `/api/public/projects/${slug}`,
      }),
    queryKey: portfolioQueryKeys.project(slug),
    refetchOnMount: "always",
  });
}

export function usePublicBlogPosts(initialData?: PublicBlogPost[]) {
  return useQuery({
    initialData,
    queryFn: () => apiRequest<PublicBlogPost[]>({ method: "GET", url: "/api/public/blog" }),
    queryKey: portfolioQueryKeys.blogPosts,
    refetchOnMount: "always",
  });
}

export function usePublicBlogPost(slug: string, initialData?: PublicBlogPostDetailData) {
  return useQuery({
    initialData,
    queryFn: () =>
      apiRequest<PublicBlogPostDetailData>({
        method: "GET",
        url: `/api/public/blog/${slug}`,
      }),
    queryKey: portfolioQueryKeys.blogPost(slug),
    refetchOnMount: "always",
  });
}

export function usePublicAbout(initialData?: PublicAbout | null) {
  return useQuery({
    initialData,
    queryFn: () => apiRequest<PublicAbout | null>({ method: "GET", url: "/api/public/about" }),
    queryKey: portfolioQueryKeys.about,
    refetchOnMount: "always",
  });
}
