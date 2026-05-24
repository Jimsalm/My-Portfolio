"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBlogPosts,
  useDeleteBlogPost,
  useToggleBlogPostStatus,
} from "@/features/cms/hooks/use-blog-posts";
import { type BlogPost, type ContentStatus } from "@/features/cms/schemas";
import { formatDate } from "@/features/admin/lib/admin-profile";
import { fallbackBlurDataURL } from "@/features/portfolio/lib/image-placeholders";

export function BlogListPage() {
  const { data: posts = [], isLoading } = useBlogPosts();
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ContentStatus>("all");
  const [tag, setTag] = useState("all");
  const deletePost = useDeleteBlogPost();
  const toggleStatus = useToggleBlogPostStatus();
  const tags = useMemo(
    () => Array.from(new Set(posts.flatMap((post) => post.tags))).sort(),
    [posts],
  );
  const filteredPosts = useMemo(
    () =>
      posts.filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "all" || post.status === status;
        const matchesTag = tag === "all" || post.tags.includes(tag);
        return matchesSearch && matchesStatus && matchesTag;
      }),
    [posts, search, status, tag],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 border p-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">Blog Posts</h2>
          <p className="text-sm text-muted-foreground">Draft and publish writing.</p>
        </div>
        <Button asChild className="rounded-none">
          <Link href="/admin/blog/new">
            <Plus aria-hidden="true" className="size-4" />
            Add Blog Post
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 border p-4 md:grid-cols-[1fr_180px_180px]">
        <Input
          className="rounded-none"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title"
          value={search}
        />
        <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
          <SelectTrigger className="rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tag} onValueChange={setTag}>
          <SelectTrigger className="rounded-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All tags</SelectItem>
            {tags.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto border">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="p-3">Cover</th>
              <th className="p-3">Title</th>
              <th className="p-3">Tags</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
              <th className="p-3">Read</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td className="p-3" colSpan={7}>
                    <Skeleton className="h-12 rounded-none" />
                  </td>
                </tr>
              ))
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <tr className="hover:bg-muted/50" key={post.id}>
                  <td className="p-3">
                    <div className="relative size-12 border bg-muted">
                      {post.coverImage?.url ? (
                        <Image
                          alt={`${post.title} cover`}
                          blurDataURL={post.coverImage.blurDataURL ?? fallbackBlurDataURL}
                          className="object-cover"
                          fill
                          placeholder="blur"
                          sizes="48px"
                          src={post.coverImage.url}
                          unoptimized
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">/{post.slug}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex max-w-56 flex-wrap gap-1">
                      {post.tags.map((item) => (
                        <span className="border px-1.5 py-0.5 text-xs" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <Button
                      className="rounded-none"
                      onClick={() =>
                        toggleStatus.mutate({
                          id: post.id,
                          status: post.status === "published" ? "draft" : "published",
                        })
                      }
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      {post.status}
                    </Button>
                  </td>
                  <td className="p-3">{formatDate(post.publishedAt ?? post.updatedAt)}</td>
                  <td className="p-3">{post.readTime} min</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild className="rounded-none" size="icon-sm" variant="outline">
                        <Link href={`/admin/blog/${post.id}/edit`}>
                          <Edit aria-hidden="true" className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        className="rounded-none"
                        onClick={() => setDeleteTarget(post)}
                        size="icon-sm"
                        type="button"
                        variant="outline"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-8 text-center text-muted-foreground" colSpan={7}>
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete blog post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none"
              onClick={() => {
                if (deleteTarget) {
                  deletePost.mutate(deleteTarget.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
