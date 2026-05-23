export const queryKeys = {
  about: ["about"] as const,
  blogPost: (id: string) => ["blog-post", id] as const,
  blogPosts: ["blog-posts"] as const,
  dashboard: ["dashboard"] as const,
  project: (id: string) => ["project", id] as const,
  projects: ["projects"] as const,
};
