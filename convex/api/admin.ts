import bcrypt from "bcryptjs";
import { v } from "convex/values";

import { internal } from "../_generated/api";
import type { Doc } from "../_generated/dataModel";
import { action, internalMutation, internalQuery } from "../_generated/server";

type AuthenticatedAdmin = {
  id: string;
  email: string;
  role: "admin";
};

export const authenticateAdmin = action({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<AuthenticatedAdmin | null> => {
    const email = args.email.trim().toLowerCase();
    const admin: Doc<"adminUsers"> | null = await ctx.runQuery(
      internal.api.admin.getAdminByEmail,
      { email },
    );

    if (!admin) {
      return null;
    }

    const passwordMatches = await bcrypt.compare(
      args.password,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      return null;
    }

    return {
      id: admin._id,
      email: admin.email,
      role: "admin" as const,
    };
  },
});

export const seedAdmin = action({
  args: {
    email: v.string(),
    password: v.string(),
    setupToken: v.string(),
  },
  handler: async (ctx, args): Promise<{ email: string }> => {
    const expectedToken = process.env.ADMIN_SETUP_TOKEN;

    if (!expectedToken || args.setupToken !== expectedToken) {
      throw new Error("Invalid admin setup token.");
    }

    const email = args.email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(args.password, 12);

    await ctx.runMutation(internal.api.admin.upsertSingleAdmin, {
      email,
      passwordHash,
    });

    return { email };
  },
});

export const getAdminByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"adminUsers"> | null> => {
    return await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

export const upsertSingleAdmin = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    const now = Date.now();
    const existingForEmail = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (existingForEmail) {
      await ctx.db.patch(existingForEmail._id, {
        passwordHash: args.passwordHash,
        updatedAt: now,
      });
      return;
    }

    const admins = await ctx.db.query("adminUsers").collect();
    const [existingAdmin, ...extraAdmins] = admins;

    if (existingAdmin) {
      await ctx.db.patch(existingAdmin._id, {
        email: args.email,
        passwordHash: args.passwordHash,
        updatedAt: now,
      });

      await Promise.all(extraAdmins.map((admin) => ctx.db.delete(admin._id)));
      return;
    }

    await ctx.db.insert("adminUsers", {
      email: args.email,
      passwordHash: args.passwordHash,
      createdAt: now,
      updatedAt: now,
    });
  },
});
