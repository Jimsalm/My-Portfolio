import type { About, BlogPost, Project } from "@/features/cms/schemas";

export type PublicProject = Project;
export type PublicBlogPost = BlogPost & {
  publishedAt: number;
};
export type PublicAbout = About;

export type PublicHomeData = {
  about: PublicAbout | null;
  featuredProjects: PublicProject[];
  latestPosts: PublicBlogPost[];
};

export type PublicProjectDetailData = {
  project: PublicProject | null;
  relatedProjects: PublicProject[];
};

export type PublicBlogPostDetailData = {
  post: PublicBlogPost | null;
  relatedPosts: PublicBlogPost[];
};
