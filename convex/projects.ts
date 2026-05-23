import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import {
  adminApiToken,
  assertAdminApiToken,
  projectInput,
  status,
} from "./cmsValidators";

function normalizeProject(project: Doc<"projects">) {
  return {
    id: project._id,
    createdAt: project.createdAt ?? project.updatedAt,
    description: project.description ?? "",
    details: project.details ?? "",
    featured: project.featured ?? false,
    githubUrl: project.githubUrl ?? "",
    liveUrl: project.liveUrl ?? "",
    priority: project.priority ?? 0,
    slug: project.slug,
    status: project.status ?? "draft",
    techStack: project.techStack ?? [],
    thumbnail: project.thumbnail ?? null,
    title: project.title,
    updatedAt: project.updatedAt,
  };
}

export const list = query({
  args: { adminApiToken },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const projects = await ctx.db.query("projects").collect();

    return projects
      .map(normalizeProject)
      .sort((a, b) => a.priority - b.priority || b.updatedAt - a.updatedAt);
  },
});

export const get = query({
  args: {
    adminApiToken,
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const project = await ctx.db.get(args.id);
    return project ? normalizeProject(project) : null;
  },
});

export const create = mutation({
  args: {
    adminApiToken,
    input: projectInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    const now = Date.now();
    const id = await ctx.db.insert("projects", {
      ...args.input,
      createdAt: now,
      updatedAt: now,
    });

    const project = await ctx.db.get(id);
    return project ? normalizeProject(project) : null;
  },
});

export const update = mutation({
  args: {
    adminApiToken,
    id: v.id("projects"),
    input: projectInput,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    await ctx.db.patch(args.id, {
      ...args.input,
      updatedAt: Date.now(),
    });

    const project = await ctx.db.get(args.id);
    return project ? normalizeProject(project) : null;
  },
});

export const remove = mutation({
  args: {
    adminApiToken,
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    await ctx.db.delete(args.id);
    return { id: args.id };
  },
});

export const bulkDelete = mutation({
  args: {
    adminApiToken,
    ids: v.array(v.id("projects")),
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);
    await Promise.all(args.ids.map((id) => ctx.db.delete(id)));
    return { ids: args.ids };
  },
});

export const toggleStatus = mutation({
  args: {
    adminApiToken,
    id: v.id("projects"),
    status,
  },
  handler: async (ctx, args) => {
    assertAdminApiToken(args.adminApiToken);

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });

    const project = await ctx.db.get(args.id);
    return project ? normalizeProject(project) : null;
  },
});
