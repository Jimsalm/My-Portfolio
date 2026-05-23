import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogPostDetailPage } from "@/features/portfolio/pages/blog-post-detail-page";
import { absoluteUrl } from "@/features/portfolio/lib/utils";
import {
  getPublicBlogPost,
  getPublicBlogSlugs,
} from "@/features/portfolio/server/public-data";

export const dynamic = "force-dynamic";

type PublicBlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublicBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PublicBlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { post } = await getPublicBlogPost(slug);

    if (!post) {
      return { title: "Post Not Found | Portfolio" };
    }

    return {
      alternates: { canonical: absoluteUrl(`/blog/${post.slug}`) },
      description: post.excerpt,
      openGraph: {
        description: post.excerpt,
        images: post.coverImage?.url ? [{ url: post.coverImage.url }] : undefined,
        title: post.title,
        url: absoluteUrl(`/blog/${post.slug}`),
      },
      title: `${post.title} | Portfolio`,
    };
  } catch {
    return { title: "Blog Post | Portfolio" };
  }
}

export default async function PublicBlogPostPage({ params }: PublicBlogPostPageProps) {
  const { slug } = await params;
  const data = await getPublicBlogPost(slug);

  if (!data.post) {
    notFound();
  }

  return <BlogPostDetailPage initialData={data} slug={slug} />;
}
