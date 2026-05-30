import { BlogPage } from "@/features/portfolio/pages/blog-page";
import { buildMetadata } from "@/features/portfolio/lib/seo";
import {
  safePublicBlogPosts,
  safePublicSettings,
} from "@/features/portfolio/server/public-data";

export const revalidate = 30;

export async function generateMetadata() {
  const settings = await safePublicSettings();

  return buildMetadata({
    description: "Published writing, notes, and build logs.",
    keywords: ["blog", "software engineering writing", "technical notes"],
    path: "/blog",
    settings,
    title: "Blog",
  });
}

export default async function PublicBlogPage() {
  const posts = await safePublicBlogPosts();
  return <BlogPage initialData={posts} />;
}
