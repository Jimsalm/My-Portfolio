import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { aboutInput, adminApiToken, assertAdminApiToken } from "./cmsValidators";

function normalizeAbout(about: Doc<"profile">) {
  return {
    id: about._id,
    education: about.education ?? [],
    email: about.email ?? "",
    experience: about.experience ?? [],
    fullName: about.fullName ?? "",
    location: about.location ?? "",
    longBio: about.longBio ?? "",
    profilePhoto: about.profilePhoto ?? null,
    resumeFile: about.resumeFile ?? null,
    role: about.role ?? "",
    shortBio: about.shortBio ?? "",
    skills: about.skills ?? [],
    socialLinks: about.socialLinks ?? {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    updatedAt: about.updatedAt,
  };
}

export const get = query({
  args: { adminApiToken },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const about = await ctx.db
      .query("profile")
      .withIndex("by_updatedAt")
      .order("desc")
      .first();

    return about ? normalizeAbout(about) : null;
  },
});

export const upsert = mutation({
  args: {
    adminApiToken,
    input: aboutInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const now = Date.now();
    const existing = await ctx.db
      .query("profile")
      .withIndex("by_updatedAt")
      .order("desc")
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args.input,
        updatedAt: now,
      });

      const about = await ctx.db.get(existing._id);
      return about ? normalizeAbout(about) : null;
    }

    const id = await ctx.db.insert("profile", {
      ...args.input,
      updatedAt: now,
    });

    const about = await ctx.db.get(id);
    return about ? normalizeAbout(about) : null;
  },
});
