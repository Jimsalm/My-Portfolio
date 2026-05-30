import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const uploadedFile = v.object({
  blurDataURL: v.optional(v.string()),
  key: v.string(),
  name: v.string(),
  url: v.string(),
});

const nullableUploadedFile = v.union(uploadedFile, v.null());
const status = v.union(v.literal("published"), v.literal("draft"));
const skillItem = v.union(
  v.string(),
  v.object({
    brandColor: v.string(),
    iconSlug: v.string(),
    id: v.string(),
    name: v.string(),
  }),
);

export default defineSchema({
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),
  projects: defineTable({
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
    .index("by_updatedAt", ["updatedAt"]),
  blogPosts: defineTable({
    content: v.optional(v.string()),
    coverImage: v.optional(nullableUploadedFile),
    createdAt: v.optional(v.number()),
    excerpt: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    publishedAt: v.optional(v.union(v.number(), v.null())),
    readTime: v.optional(v.number()),
    slug: v.string(),
    status: v.optional(status),
    tags: v.optional(v.array(v.string())),
    title: v.string(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_updatedAt", ["updatedAt"]),
  profile: defineTable({
    education: v.optional(
      v.array(
        v.object({
          degree: v.string(),
          gpa: v.optional(v.string()),
          honors: v.optional(v.string()),
          id: v.string(),
          school: v.string(),
          year: v.string(),
        }),
      ),
    ),
    email: v.optional(v.string()),
    experience: v.optional(
      v.array(
        v.object({
          company: v.string(),
          current: v.boolean(),
          description: v.string(),
          endDate: v.string(),
          id: v.string(),
          role: v.string(),
          startDate: v.string(),
        }),
      ),
    ),
    fullName: v.optional(v.string()),
    location: v.optional(v.string()),
    longBio: v.optional(v.string()),
    profilePhoto: v.optional(nullableUploadedFile),
    resumeFile: v.optional(nullableUploadedFile),
    role: v.optional(v.string()),
    shortBio: v.optional(v.string()),
    skills: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          order: v.number(),
          skills: v.array(skillItem),
        }),
      ),
    ),
    socialLinks: v.optional(
      v.object({
        github: v.string(),
        linkedin: v.string(),
        twitter: v.string(),
        website: v.string(),
      }),
    ),
    updatedAt: v.number(),
  }).index("by_updatedAt", ["updatedAt"]),
});
