import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import {
  adminApiToken,
  assertAdminApiToken,
  blogPostInput,
  status,
} from "./cmsValidators";

function normalizeBlogPost(post: Doc<"blogPosts">) {
  return {
    id: post._id,
    content: post.content ?? "",
    coverImage: post.coverImage ?? null,
    createdAt: post.createdAt ?? post.updatedAt,
    excerpt: post.excerpt ?? "",
    featured: post.featured ?? false,
    publishedAt: post.publishedAt ?? null,
    readTime: post.readTime ?? 1,
    slug: post.slug,
    status: post.status ?? "draft",
    tags: post.tags ?? [],
    title: post.title,
    updatedAt: post.updatedAt,
  };
}

export const list = query({
  args: { adminApiToken },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_updatedAt")
      .order("desc")
      .collect();

    return posts.map(normalizeBlogPost);
  },
});

export const get = query({
  args: {
    adminApiToken,
    id: v.id("blogPosts"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const post = await ctx.db.get(args.id);
    return post ? normalizeBlogPost(post) : null;
  },
});

export const create = mutation({
  args: {
    adminApiToken,
    input: blogPostInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const now = Date.now();
    const id = await ctx.db.insert("blogPosts", {
      ...args.input,
      createdAt: now,
      updatedAt: now,
    });

    const post = await ctx.db.get(id);
    return post ? normalizeBlogPost(post) : null;
  },
});

export const update = mutation({
  args: {
    adminApiToken,
    id: v.id("blogPosts"),
    input: blogPostInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    await ctx.db.patch(args.id, {
      ...args.input,
      updatedAt: Date.now(),
    });

    const post = await ctx.db.get(args.id);
    return post ? normalizeBlogPost(post) : null;
  },
});

export const remove = mutation({
  args: {
    adminApiToken,
    id: v.id("blogPosts"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    await ctx.db.delete(args.id);
    return { id: args.id };
  },
});

export const toggleStatus = mutation({
  args: {
    adminApiToken,
    id: v.id("blogPosts"),
    status,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    const post = await ctx.db.get(args.id);
    return post ? normalizeBlogPost(post) : null;
  },
});
