import type { Metadata } from "next";

import { BlogPage } from "@/features/portfolio/pages/blog-page";
import { absoluteUrl } from "@/features/portfolio/lib/utils";
import { safePublicBlogPosts } from "@/features/portfolio/server/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/blog") },
  description: "Published writing, notes, and build logs.",
  openGraph: {
    description: "Published writing, notes, and build logs.",
    title: "Blog",
    url: absoluteUrl("/blog"),
  },
  title: "Blog | Portfolio",
};

export default async function PublicBlogPage() {
  const posts = await safePublicBlogPosts();
  return <BlogPage initialData={posts} />;
}
