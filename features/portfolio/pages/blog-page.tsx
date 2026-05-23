"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { BlogCard } from "@/features/portfolio/components/blog-card";
import { EmptyState, SectionHeading, SectionShell } from "@/features/portfolio/components/ui-atoms";
import { usePublicBlogPosts } from "@/features/portfolio/hooks/use-public-data";
import { staggerContainer } from "@/features/portfolio/lib/motion";
import { uniqueBlogTags } from "@/features/portfolio/lib/utils";
import type { PublicBlogPost } from "@/features/portfolio/types";
import { cn } from "@/lib/utils";

const postsPerPage = 10;

export function BlogPage({ initialData }: { initialData: PublicBlogPost[] }) {
  const { data: posts = initialData } = usePublicBlogPosts(initialData);
  const [activeTag, setActiveTag] = useState("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const tags = useMemo(() => uniqueBlogTags(posts), [posts]);
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesTag = activeTag === "All" || post.tags.includes(activeTag);
        const matchesQuery =
          !normalizedQuery ||
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.excerpt.toLowerCase().includes(normalizedQuery);

        return matchesTag && matchesQuery;
      }),
    [activeTag, normalizedQuery, posts],
  );
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / postsPerPage));
  const visiblePosts = filteredPosts.slice((page - 1) * postsPerPage, page * postsPerPage);

  function updateTag(tag: string) {
    setActiveTag(tag);
    setPage(1);
  }

  return (
    <SectionShell className="min-h-screen">
      <SectionHeading description="grep writing.log --status published --paginate 10">
        ./writing
      </SectionHeading>

      <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
        <input
          className="h-11 border bg-background px-3 font-mono text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
          onChange={(event) => {
            setQuery(event.target.value);
            setPage(1);
          }}
          placeholder="$ grep title excerpt"
          value={query}
        />
        <div className="flex flex-wrap gap-2">
          {["All", ...tags].map((tag) => (
            <button
              className={cn(
                "border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
                activeTag === tag ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:border-foreground",
              )}
              key={tag}
              onClick={() => updateTag(tag)}
              type="button"
            >
              --{tag.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {visiblePosts.length > 0 ? (
        <motion.div animate="visible" className="grid gap-5" initial="hidden" variants={staggerContainer}>
          {visiblePosts.map((post) => (
            <BlogCard compact key={post.id} post={post} />
          ))}
        </motion.div>
      ) : (
        <EmptyState>No published posts match this search.</EmptyState>
      )}

      {filteredPosts.length > postsPerPage ? (
        <div className="mt-8 flex items-center justify-between border p-3 text-sm">
          <button
            className="border px-3 py-2 disabled:cursor-not-allowed disabled:text-muted-foreground"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            type="button"
          >
            Previous
          </button>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            className="border px-3 py-2 disabled:cursor-not-allowed disabled:text-muted-foreground"
            disabled={page === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            type="button"
          >
            Next
          </button>
        </div>
      ) : null}
    </SectionShell>
  );
}
