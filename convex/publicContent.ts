import { v } from "convex/values";

import { query, type QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { normalizeSkillCategories } from "./skillUtils";

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

function normalizeBlogPost(post: Doc<"blogPosts">) {
  return {
    id: post._id,
    content: post.content ?? "",
    coverImage: post.coverImage ?? null,
    createdAt: post.createdAt ?? post.updatedAt,
    excerpt: post.excerpt ?? "",
    featured: post.featured ?? false,
    publishedAt: post.publishedAt ?? post.updatedAt,
    readTime: post.readTime ?? 1,
    slug: post.slug,
    status: post.status ?? "draft",
    tags: post.tags ?? [],
    title: post.title,
    updatedAt: post.updatedAt,
  };
}

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
    skills: normalizeSkillCategories(about.skills ?? []),
    socialLinks: about.socialLinks ?? {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
    updatedAt: about.updatedAt,
  };
}

function isPublishedProject(project: Doc<"projects">) {
  return project.status === "published";
}

function isPublishedPost(post: Doc<"blogPosts">) {
  return post.status === "published";
}

function sharedCount(left: string[], right: string[]) {
  const rightSet = new Set(right.map((item) => item.toLowerCase()));
  return left.reduce(
    (count, item) => count + (rightSet.has(item.toLowerCase()) ? 1 : 0),
    0,
  );
}

async function getAbout(ctx: QueryCtx) {
  const about = await ctx.db
    .query("profile")
    .withIndex("by_updatedAt")
    .order("desc")
    .first();

  return about ? normalizeAbout(about) : null;
}

export const home = query({
  args: {},
  handler: async (ctx) => {
    const [about, projects, posts] = await Promise.all([
      getAbout(ctx),
      ctx.db.query("projects").collect(),
      ctx.db.query("blogPosts").withIndex("by_updatedAt").order("desc").collect(),
    ]);

    const featuredProjects = projects
      .filter(isPublishedProject)
      .map(normalizeProject)
      .sort((a, b) => a.priority - b.priority || b.updatedAt - a.updatedAt)
      .filter((project) => project.featured)
      .slice(0, 3);

    const latestPosts = posts
      .filter(isPublishedPost)
      .map(normalizeBlogPost)
      .sort((a, b) => (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt))
      .slice(0, 3);

    return { about, featuredProjects, latestPosts };
  },
});

export const about = query({
  args: {},
  handler: async (ctx) => getAbout(ctx),
});

export const projects = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();

    return projects
      .filter(isPublishedProject)
      .map(normalizeProject)
      .sort((a, b) => a.priority - b.priority || b.updatedAt - a.updatedAt);
  },
});

export const projectSlugs = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    return projects.filter(isPublishedProject).map((project) => project.slug);
  },
});

export const projectBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const project = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!project || !isPublishedProject(project)) {
      return { project: null, relatedProjects: [] };
    }

    const normalizedProject = normalizeProject(project);
    const projects = await ctx.db.query("projects").collect();
    const relatedProjects = projects
      .filter((candidate) => candidate._id !== project._id && isPublishedProject(candidate))
      .map(normalizeProject)
      .map((candidate) => ({
        project: candidate,
        sharedTech: sharedCount(normalizedProject.techStack, candidate.techStack),
      }))
      .filter((candidate) => candidate.sharedTech > 0)
      .sort((a, b) => b.sharedTech - a.sharedTech || b.project.updatedAt - a.project.updatedAt)
      .slice(0, 3)
      .map((candidate) => candidate.project);

    return { project: normalizedProject, relatedProjects };
  },
});

export const blogPosts = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("blogPosts")
      .withIndex("by_updatedAt")
      .order("desc")
      .collect();

    return posts
      .filter(isPublishedPost)
      .map(normalizeBlogPost)
      .sort((a, b) => (b.publishedAt ?? b.updatedAt) - (a.publishedAt ?? a.updatedAt));
  },
});

export const blogSlugs = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("blogPosts").collect();
    return posts.filter(isPublishedPost).map((post) => post.slug);
  },
});

export const blogPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!post || !isPublishedPost(post)) {
      return { post: null, relatedPosts: [] };
    }

    const normalizedPost = normalizeBlogPost(post);
    const posts = await ctx.db.query("blogPosts").collect();
    const relatedPosts = posts
      .filter((candidate) => candidate._id !== post._id && isPublishedPost(candidate))
      .map(normalizeBlogPost)
      .map((candidate) => ({
        post: candidate,
        sharedTags: sharedCount(normalizedPost.tags, candidate.tags),
      }))
      .filter((candidate) => candidate.sharedTags > 0)
      .sort((a, b) => b.sharedTags - a.sharedTags || b.post.updatedAt - a.post.updatedAt)
      .slice(0, 3)
      .map((candidate) => candidate.post);

    return { post: normalizedPost, relatedPosts };
  },
});
