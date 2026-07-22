import { defineTable } from "convex/server";
import { v } from "convex/values";

import { nullableUploadedFile, status } from "../lib/cmsValidators";

export const certificationsTable = defineTable({
  badgeImage: nullableUploadedFile,
  createdAt: v.number(),
  credentialId: v.string(),
  credentialUrl: v.string(),
  doesNotExpire: v.boolean(),
  expiryDate: v.union(v.string(), v.null()),
  featured: v.boolean(),
  issueDate: v.string(),
  name: v.string(),
  order: v.number(),
  organization: v.string(),
  organizationLogo: nullableUploadedFile,
  status,
  updatedAt: v.number(),
})
  .index("by_order", ["order"])
  .index("by_updatedAt", ["updatedAt"]);
