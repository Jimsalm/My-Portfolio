import { defineTable } from "convex/server";
import { v } from "convex/values";

export const adminUsersTable = defineTable({
  displayName: v.optional(v.string()),
  email: v.string(),
  passwordHash: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_email", ["email"]);
