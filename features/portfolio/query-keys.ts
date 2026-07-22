export const portfolioQueryKeys = {
  about: ["portfolio", "about"] as const,
  blogPost: (slug: string) => ["portfolio", "blog", slug] as const,
  blogPosts: ["portfolio", "blog"] as const,
  certifications: ["portfolio", "certifications"] as const,
  home: ["portfolio", "home"] as const,
  project: (slug: string) => ["portfolio", "projects", slug] as const,
  projects: ["portfolio", "projects"] as const,
};
