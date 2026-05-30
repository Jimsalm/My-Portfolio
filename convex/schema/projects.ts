import { defineTable } from "convex/server";
import { v } from "convex/values";

import { nullableUploadedFile, status } from "../lib/cmsValidators";

export const projectsTable = defineTable({
  createdAt: v.optional(v.number()),
  description: v.optional(v.string()),
  details: v.optional(v.string()),
  featured: v.optional(v.boolean()),
  githubUrl: v.optional(v.string()),
  liveUrl: v.optional(v.string()),
  priority: v.optional(v.number()),
  slug: v.string(),
  status: v.optional(status),
  techStack: v.optional(v.array(v.string())),
  thumbnail: v.optional(nullableUploadedFile),
  title: v.string(),
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_updatedAt", ["updatedAt"]);
