"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

import { BlogCard } from "@/features/portfolio/components/blog-card";
import { MarkdownRenderer } from "@/features/portfolio/components/markdown-renderer";
import { MediaFrame } from "@/features/portfolio/components/media-frame";
import { ShareButtons } from "@/features/portfolio/components/share-buttons";
import { SectionHeading, SectionShell, Tag } from "@/features/portfolio/components/ui-atoms";
import { usePublicBlogPost } from "@/features/portfolio/hooks/use-public-data";
import { fadeUp, motionTransition, staggerContainer } from "@/features/portfolio/lib/motion";
import { absoluteUrl, formatDisplayDate } from "@/features/portfolio/lib/utils";
import type { PublicBlogPostDetailData } from "@/features/portfolio/types";

export function BlogPostDetailPage({
  initialData,
  slug,
}: {
  initialData: PublicBlogPostDetailData;
  slug: string;
}) {
  const { data = initialData } = usePublicBlogPost(slug, initialData);
  const post = data.post;

  if (!post) {
    return null;
  }

  return (
    <>
      <SectionShell className="pb-10">
        <Link className="mb-8 inline-flex items-center gap-2 font-mono text-sm font-medium hover:underline" href="/blog">
          <ArrowLeft aria-hidden="true" className="size-4" />
          cd ../writing
        </Link>
        <motion.div animate="visible" initial="hidden" variants={staggerContainer}>
          <motion.div variants={fadeUp}>
            <MediaFrame alt={post.title} className="aspect-[16/8]" image={post.coverImage} priority />
          </motion.div>
          <motion.div className="mt-10 max-w-4xl" variants={fadeUp} transition={motionTransition}>
            <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
              <time>{formatDisplayDate(post.publishedAt)}</time>
              <span>{post.readTime} min read</span>
            </div>
            <p className="mt-5 font-mono text-sm text-muted-foreground">vim ./{post.slug}.md</p>
            <h1 className="mt-4 font-mono text-5xl font-semibold tracking-tight md:text-7xl">{post.title}</h1>
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
            <div className="mt-8">
              <ShareButtons title={post.title} url={absoluteUrl(`/blog/${post.slug}`)} />
            </div>
          </motion.div>
        </motion.div>
      </SectionShell>

      <SectionShell className="pt-8">
        <article className="max-w-3xl">
          <MarkdownRenderer content={post.content} />
        </article>
      </SectionShell>

      <SectionShell>
        <SectionHeading>./related-posts</SectionHeading>
        {data.relatedPosts.length > 0 ? (
          <motion.div animate="visible" className="grid gap-6 md:grid-cols-3" initial="hidden" variants={staggerContainer}>
            {data.relatedPosts.map((related) => (
              <BlogCard key={related.id} post={related} />
            ))}
          </motion.div>
        ) : null}
      </SectionShell>
    </>
  );
}
