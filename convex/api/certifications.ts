import { v } from "convex/values";

import type { Doc } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";
import {
  adminApiToken,
  assertAdminApiToken,
  certificationInput,
  status,
} from "../lib/cmsValidators";

function normalizeCertification(certification: Doc<"certifications">) {
  return {
    id: certification._id,
    badgeImage: certification.badgeImage,
    createdAt: certification.createdAt,
    credentialId: certification.credentialId,
    credentialUrl: certification.credentialUrl,
    doesNotExpire: certification.doesNotExpire,
    expiryDate: certification.expiryDate,
    featured: certification.featured,
    issueDate: certification.issueDate,
    name: certification.name,
    order: certification.order,
    organization: certification.organization,
    organizationLogo: certification.organizationLogo,
    status: certification.status,
    updatedAt: certification.updatedAt,
  };
}

function sortCertifications(
  left: ReturnType<typeof normalizeCertification>,
  right: ReturnType<typeof normalizeCertification>,
) {
  return left.order - right.order || right.updatedAt - left.updatedAt;
}

export const list = query({
  args: { adminApiToken },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    const certifications = await ctx.db.query("certifications").collect();
    return certifications.map(normalizeCertification).sort(sortCertifications);
  },
});

export const get = query({
  args: {
    adminApiToken,
    id: v.id("certifications"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    const certification = await ctx.db.get(args.id);
    return certification ? normalizeCertification(certification) : null;
  },
});

export const create = mutation({
  args: {
    adminApiToken,
    input: certificationInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    const now = Date.now();
    const id = await ctx.db.insert("certifications", {
      ...args.input,
      createdAt: now,
      updatedAt: now,
    });
    const certification = await ctx.db.get(id);
    return certification ? normalizeCertification(certification) : null;
  },
});

export const update = mutation({
  args: {
    adminApiToken,
    id: v.id("certifications"),
    input: certificationInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    await ctx.db.patch(args.id, {
      ...args.input,
      updatedAt: Date.now(),
    });
    const certification = await ctx.db.get(args.id);
    return certification ? normalizeCertification(certification) : null;
  },
});

export const remove = mutation({
  args: {
    adminApiToken,
    id: v.id("certifications"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    await ctx.db.delete(args.id);
    return { id: args.id };
  },
});

export const toggleFeatured = mutation({
  args: {
    adminApiToken,
    featured: v.boolean(),
    id: v.id("certifications"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    await ctx.db.patch(args.id, {
      featured: args.featured,
      updatedAt: Date.now(),
    });
    const certification = await ctx.db.get(args.id);
    return certification ? normalizeCertification(certification) : null;
  },
});

export const toggleStatus = mutation({
  args: {
    adminApiToken,
    id: v.id("certifications"),
    status,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
    const certification = await ctx.db.get(args.id);
    return certification ? normalizeCertification(certification) : null;
  },
});

export const reorder = mutation({
  args: {
    adminApiToken,
    ids: v.array(v.id("certifications")),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    const now = Date.now();
    await Promise.all(
      args.ids.map((id, order) =>
        ctx.db.patch(id, {
          order,
          updatedAt: now,
        }),
      ),
    );
    return { ids: args.ids };
  },
});
