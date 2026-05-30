import { defineTable } from "convex/server";
import { v } from "convex/values";

import { badgeMode } from "../lib/cmsValidators";

export const siteSettingsTable = defineTable({
  badgeMode,
  createdAt: v.optional(v.number()),
  metaDescription: v.string(),
  siteTitle: v.string(),
  tagline: v.string(),
  updatedAt: v.number(),
}).index("by_updatedAt", ["updatedAt"]);
