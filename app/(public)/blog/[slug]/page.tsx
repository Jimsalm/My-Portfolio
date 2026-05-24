import type { Metadata } from "next";

import { PublicNotFoundPanel } from "@/features/portfolio/components/public-not-found";
import { BlogPostDetailPage } from "@/features/portfolio/pages/blog-post-detail-page";
import {
  articleJsonLd,
  buildMetadata,
  getOgImageUrl,
  jsonLdScriptProps,
  postDescription,
} from "@/features/portfolio/lib/seo";
import {
  getPublicBlogPost,
  getPublicBlogSlugs,
  safePublicAbout,
} from "@/features/portfolio/server/public-data";

export const revalidate = 30;

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
      return {
        ...buildMetadata({
          description: "The requested blog post could not be found.",
          path: `/blog/${slug}`,
          title: "Post Not Found",
        }),
        robots: { follow: false, index: false },
      };
    }

    return buildMetadata({
      description: postDescription(post),
      image: getOgImageUrl({ slug: post.slug, type: "blog" }),
      keywords: ["blog", ...post.tags],
      path: `/blog/${post.slug}`,
      title: post.title,
      type: "article",
    });
  } catch {
    return buildMetadata({
      description: "Blog post from the portfolio.",
      path: `/blog/${slug}`,
      title: "Blog Post",
      type: "article",
    });
  }
}

export default async function PublicBlogPostPage({ params }: PublicBlogPostPageProps) {
  const { slug } = await params;
  const data = await getPublicBlogPost(slug);

  if (!data.post) {
    return <PublicNotFoundPanel />;
  }

  const about = await safePublicAbout();

  return (
    <>
      <script {...jsonLdScriptProps(articleJsonLd(data.post, about))} />
      <BlogPostDetailPage initialData={data} slug={slug} />
    </>
  );
}
