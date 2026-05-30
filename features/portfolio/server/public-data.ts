import "server-only";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type {
  PublicAbout,
  PublicBlogPost,
  PublicBlogPostDetailData,
  PublicHomeData,
  PublicProject,
  PublicProjectDetailData,
} from "@/features/portfolio/types";

export async function getPublicHome(): Promise<PublicHomeData> {
  return await fetchQuery(api.api.publicContent.home);
}

export async function getPublicProjects(): Promise<PublicProject[]> {
  return await fetchQuery(api.api.publicContent.projects);
}

export async function getPublicProject(slug: string): Promise<PublicProjectDetailData> {
  return await fetchQuery(api.api.publicContent.projectBySlug, { slug });
}

export async function getPublicProjectSlugs(): Promise<string[]> {
  return await fetchQuery(api.api.publicContent.projectSlugs);
}

export async function getPublicBlogPosts(): Promise<PublicBlogPost[]> {
  return await fetchQuery(api.api.publicContent.blogPosts);
}

export async function getPublicBlogPost(slug: string): Promise<PublicBlogPostDetailData> {
  return await fetchQuery(api.api.publicContent.blogPostBySlug, { slug });
}

export async function getPublicBlogSlugs(): Promise<string[]> {
  return await fetchQuery(api.api.publicContent.blogSlugs);
}

export async function getPublicAbout(): Promise<PublicAbout | null> {
  return await fetchQuery(api.api.publicContent.about);
}

export async function safePublicHome(): Promise<PublicHomeData> {
  try {
    return await getPublicHome();
  } catch {
    return { about: null, featuredProjects: [], latestPosts: [] };
  }
}

export async function safePublicProjects(): Promise<PublicProject[]> {
  try {
    return await getPublicProjects();
  } catch {
    return [];
  }
}

export async function safePublicBlogPosts(): Promise<PublicBlogPost[]> {
  try {
    return await getPublicBlogPosts();
  } catch {
    return [];
  }
}

export async function safePublicAbout(): Promise<PublicAbout | null> {
  try {
    return await getPublicAbout();
  } catch {
    return null;
  }
}
