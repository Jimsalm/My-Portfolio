import bcrypt from "bcryptjs";
import { v } from "convex/values";

import { internal } from "../_generated/api";
import type { Doc, Id } from "../_generated/dataModel";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "../_generated/server";
import {
  accountSettingsInput,
  adminApiToken,
  assertAdminApiToken,
  badgeSettingsInput,
  passwordSettingsInput,
  siteSettingsInput,
} from "../lib/cmsValidators";

const defaultSiteSettings = {
  badgeMode: "wip" as const,
  metaDescription: "Portfolio of selected projects, writing, and professional profile.",
  siteTitle: "Jimiel Salmon",
  tagline: "Full Stack Developer",
};

function normalizeAccount(admin: Doc<"adminUsers">) {
  return {
    displayName: admin.displayName ?? "",
    email: admin.email,
    id: admin._id,
    updatedAt: admin.updatedAt,
  };
}

type NormalizedAccount = ReturnType<typeof normalizeAccount>;

function normalizeSiteSettings(settings: Doc<"siteSettings"> | null) {
  return {
    ...defaultSiteSettings,
    ...(settings
      ? {
          badgeMode: settings.badgeMode,
          metaDescription: settings.metaDescription,
          siteTitle: settings.siteTitle,
          tagline: settings.tagline,
          updatedAt: settings.updatedAt,
        }
      : {
          updatedAt: 0,
        }),
  };
}

async function getLatestSiteSettings(ctx: QueryCtx | MutationCtx) {
  return await ctx.db
    .query("siteSettings")
    .withIndex("by_updatedAt")
    .order("desc")
    .first();
}

export const getAdminSettings = query({
  args: {
    adminApiToken,
    adminId: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const [admin, siteSettings] = await Promise.all([
      ctx.db.get(args.adminId),
      getLatestSiteSettings(ctx),
    ]);

    if (!admin) {
      throw new Error("Admin account not found.");
    }

    return {
      account: normalizeAccount(admin),
      site: normalizeSiteSettings(siteSettings),
    };
  },
});

export const getPublicSettings = query({
  args: {},
  handler: async (ctx) => {
    const siteSettings = await getLatestSiteSettings(ctx);
    return normalizeSiteSettings(siteSettings);
  },
});

export const updateSite = mutation({
  args: {
    adminApiToken,
    input: siteSettingsInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const now = Date.now();
    const existing = await getLatestSiteSettings(ctx);

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args.input,
        updatedAt: now,
      });
      return normalizeSiteSettings(await ctx.db.get(existing._id));
    }

    const id = await ctx.db.insert("siteSettings", {
      ...args.input,
      badgeMode: defaultSiteSettings.badgeMode,
      createdAt: now,
      updatedAt: now,
    });

    return normalizeSiteSettings(await ctx.db.get(id));
  },
});

export const updateBadge = mutation({
  args: {
    adminApiToken,
    input: badgeSettingsInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const now = Date.now();
    const existing = await getLatestSiteSettings(ctx);

    if (existing) {
      await ctx.db.patch(existing._id, {
        badgeMode: args.input.badgeMode,
        updatedAt: now,
      });
      return normalizeSiteSettings(await ctx.db.get(existing._id));
    }

    const id = await ctx.db.insert("siteSettings", {
      ...defaultSiteSettings,
      badgeMode: args.input.badgeMode,
      createdAt: now,
      updatedAt: now,
    });

    return normalizeSiteSettings(await ctx.db.get(id));
  },
});

export const updateAccount = action({
  args: {
    adminApiToken,
    adminId: v.id("adminUsers"),
    input: accountSettingsInput,
  },
  handler: async (ctx, args): Promise<NormalizedAccount> => {
    assertAdminApiToken(args.adminApiToken);

    const admin: Doc<"adminUsers"> | null = await ctx.runQuery(
      internal.api.settings.getAdminById,
      {
      adminId: args.adminId,
      },
    );

    if (!admin) {
      throw new Error("Admin account not found.");
    }

    const email = args.input.email.trim().toLowerCase();
    const currentEmail: string = admin.email.trim().toLowerCase();

    if (email !== currentEmail) {
      if (!args.input.currentPassword) {
        throw new Error("Current password is required to change email.");
      }

      const passwordMatches = await bcrypt.compare(
        args.input.currentPassword,
        admin.passwordHash,
      );

      if (!passwordMatches) {
        throw new Error("Current password is incorrect.");
      }
    }

    const account: NormalizedAccount = await ctx.runMutation(
      internal.api.settings.patchAdminAccount,
      {
        adminId: args.adminId,
        displayName: args.input.displayName.trim(),
        email,
      },
    );

    return account;
  },
});

export const updatePassword = action({
  args: {
    adminApiToken,
    adminId: v.id("adminUsers"),
    input: passwordSettingsInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const admin = await ctx.runQuery(internal.api.settings.getAdminById, {
      adminId: args.adminId,
    });

    if (!admin) {
      throw new Error("Admin account not found.");
    }

    const passwordMatches = await bcrypt.compare(
      args.input.currentPassword,
      admin.passwordHash,
    );

    if (!passwordMatches) {
      throw new Error("Current password is incorrect.");
    }

    const passwordHash = await bcrypt.hash(args.input.newPassword, 12);

    await ctx.runMutation(internal.api.settings.patchAdminPassword, {
      adminId: args.adminId,
      passwordHash,
    });

    return { success: true };
  },
});

export const getAdminById = internalQuery({
  args: {
    adminId: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.adminId);
  },
});

export const patchAdminAccount = internalMutation({
  args: {
    adminId: v.id("adminUsers"),
    displayName: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.adminId, {
      displayName: args.displayName,
      email: args.email,
      updatedAt: Date.now(),
    });

    const admin = await ctx.db.get(args.adminId as Id<"adminUsers">);

    if (!admin) {
      throw new Error("Admin account not found.");
    }

    return normalizeAccount(admin);
  },
});

export const patchAdminPassword = internalMutation({
  args: {
    adminId: v.id("adminUsers"),
    passwordHash: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.adminId, {
      passwordHash: args.passwordHash,
      updatedAt: Date.now(),
    });
  },
});
