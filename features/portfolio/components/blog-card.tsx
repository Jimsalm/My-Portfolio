"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { m } from "framer-motion";

import { MediaFrame } from "@/features/portfolio/components/media-frame";
import { Tag } from "@/features/portfolio/components/ui-atoms";
import { fadeUp, motionTransition } from "@/features/portfolio/lib/motion";
import { formatDisplayDate } from "@/features/portfolio/lib/utils";
import type { PublicBlogPost } from "@/features/portfolio/types";
import { cn } from "@/lib/utils";

export function BlogCard({
  compact = false,
  post,
}: {
  compact?: boolean;
  post: PublicBlogPost;
}) {
  return (
    <m.article
      className={cn(
        "group border bg-background transition-colors hover:border-foreground",
        compact ? "grid gap-0 md:grid-cols-[220px_1fr]" : "",
      )}
      variants={fadeUp}
      transition={motionTransition}
    >
      <div className={cn("border-b px-4 py-2 font-mono text-xs text-muted-foreground", compact ? "md:col-span-2" : "")}>
        log@portfolio:~/writing$ open {post.slug}.md
      </div>
      <Link href={`/blog/${post.slug}`}>
        <MediaFrame
          alt={post.title}
          className={cn("border-x-0 border-t-0", compact ? "aspect-[4/3] md:border-b-0 md:border-r" : "aspect-[16/9]")}
          image={post.coverImage}
        />
      </Link>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <time>{formatDisplayDate(post.publishedAt)}</time>
          <span>{post.readTime} min read</span>
        </div>
        <Link className="font-mono text-xl font-semibold tracking-tight hover:underline" href={`/blog/${post.slug}`}>
          {post.title}
        </Link>
        <p className="font-mono text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <Link className="mt-auto inline-flex items-center gap-2 font-mono text-sm font-medium" href={`/blog/${post.slug}`}>
          read --post <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </m.article>
  );
}
