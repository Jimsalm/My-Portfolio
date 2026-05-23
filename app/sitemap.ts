import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/features/portfolio/lib/utils";
import {
  safePublicBlogPosts,
  safePublicProjects,
} from "@/features/portfolio/server/public-data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts] = await Promise.all([
    safePublicProjects(),
    safePublicBlogPosts(),
  ]);

  return [
    {
      lastModified: new Date(),
      url: absoluteUrl("/"),
    },
    {
      lastModified: new Date(),
      url: absoluteUrl("/projects"),
    },
    ...projects.map((project) => ({
      lastModified: new Date(project.updatedAt),
      url: absoluteUrl(`/projects/${project.slug}`),
    })),
    {
      lastModified: new Date(),
      url: absoluteUrl("/blog"),
    },
    ...posts.map((post) => ({
      lastModified: new Date(post.updatedAt),
      url: absoluteUrl(`/blog/${post.slug}`),
    })),
    {
      lastModified: new Date(),
      url: absoluteUrl("/about"),
    },
  ];
}
