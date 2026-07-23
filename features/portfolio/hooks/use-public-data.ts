"use client";

import { useQuery as useConvexQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import type { Certification } from "@/features/certifications/schemas";
import type {
  PublicAbout,
  PublicBlogPost,
  PublicBlogPostDetailData,
  PublicHomeData,
  PublicProject,
  PublicProjectDetailData,
} from "@/features/portfolio/types";

function withInitialData<T>(data: T | undefined, initialData: T | undefined) {
  return {
    data: data ?? initialData,
    isLoading: data === undefined && initialData === undefined,
  };
}

export function usePublicHome(initialData?: PublicHomeData) {
  const data = useConvexQuery(api.api.publicContent.home, {});
  return withInitialData(data, initialData);
}

export function usePublicProjects(initialData?: PublicProject[]) {
  const data = useConvexQuery(api.api.publicContent.projects, {});
  return withInitialData(data, initialData);
}

export function usePublicProject(slug: string, initialData?: PublicProjectDetailData) {
  const data = useConvexQuery(api.api.publicContent.projectBySlug, { slug });
  return withInitialData(data, initialData);
}

export function usePublicBlogPosts(initialData?: PublicBlogPost[]) {
  const data = useConvexQuery(api.api.publicContent.blogPosts, {});
  return withInitialData(data, initialData);
}

export function usePublicBlogPost(slug: string, initialData?: PublicBlogPostDetailData) {
  const data = useConvexQuery(api.api.publicContent.blogPostBySlug, { slug });
  return withInitialData(data, initialData);
}

export function usePublicAbout(initialData?: PublicAbout | null) {
  const data = useConvexQuery(api.api.publicContent.about, {});
  return withInitialData(data, initialData);
}

export function usePublicCertifications(initialData?: Certification[]) {
  const data = useConvexQuery(api.api.publicContent.certifications, {});
  return withInitialData(data, initialData);
}
