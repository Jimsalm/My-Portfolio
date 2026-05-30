import { defineTable } from "convex/server";
import { v } from "convex/values";

import { nullableUploadedFile, status } from "../lib/cmsValidators";

export const blogPostsTable = defineTable({
  content: v.optional(v.string()),
  coverImage: v.optional(nullableUploadedFile),
  createdAt: v.optional(v.number()),
  excerpt: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  publishedAt: v.optional(v.union(v.number(), v.null())),
  readTime: v.optional(v.number()),
  slug: v.string(),
  status: v.optional(status),
  tags: v.optional(v.array(v.string())),
  title: v.string(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_updatedAt", ["updatedAt"]);
