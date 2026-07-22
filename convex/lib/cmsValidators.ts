import { v } from "convex/values";

export const adminApiToken = v.string();

export const status = v.union(v.literal("published"), v.literal("draft"));

export const badgeMode = v.union(
  v.literal("wip"),
  v.literal("available"),
  v.literal("hidden"),
);

export const uploadedFile = v.object({
  blurDataURL: v.optional(v.string()),
  key: v.string(),
  name: v.string(),
  url: v.string(),
});

export const nullableUploadedFile = v.union(uploadedFile, v.null());

export const projectInput = v.object({
  description: v.string(),
  details: v.string(),
  featured: v.boolean(),
  githubUrl: v.string(),
  liveUrl: v.string(),
  priority: v.number(),
  slug: v.string(),
  status,
  techStack: v.array(v.string()),
  thumbnail: nullableUploadedFile,
  title: v.string(),
});

export const blogPostInput = v.object({
  content: v.string(),
  coverImage: nullableUploadedFile,
  excerpt: v.string(),
  featured: v.boolean(),
  publishedAt: v.union(v.number(), v.null()),
  readTime: v.number(),
  slug: v.string(),
  status,
  tags: v.array(v.string()),
  title: v.string(),
});

export const certificationInput = v.object({
  badgeImage: nullableUploadedFile,
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
});

export const socialLinks = v.object({
  github: v.string(),
  linkedin: v.string(),
  twitter: v.string(),
  website: v.string(),
});

export const skillItem = v.union(
  v.string(),
  v.object({
    brandColor: v.string(),
    iconSlug: v.string(),
    id: v.string(),
    name: v.string(),
  }),
);

export const skillCategory = v.object({
  id: v.string(),
  name: v.string(),
  order: v.number(),
  skills: v.array(skillItem),
});

export const experienceEntry = v.object({
  company: v.string(),
  current: v.boolean(),
  description: v.string(),
  endDate: v.string(),
  id: v.string(),
  role: v.string(),
  startDate: v.string(),
});

export const educationEntry = v.object({
  degree: v.string(),
  gpa: v.optional(v.string()),
  honors: v.optional(v.string()),
  id: v.string(),
  school: v.string(),
  year: v.string(),
});

export const aboutInput = v.object({
  education: v.array(educationEntry),
  email: v.string(),
  experience: v.array(experienceEntry),
  fullName: v.string(),
  location: v.string(),
  longBio: v.string(),
  profilePhoto: nullableUploadedFile,
  resumeFile: nullableUploadedFile,
  role: v.string(),
  shortBio: v.string(),
  skills: v.array(skillCategory),
  socialLinks,
});

export const accountSettingsInput = v.object({
  currentPassword: v.optional(v.string()),
  displayName: v.string(),
  email: v.string(),
});

export const passwordSettingsInput = v.object({
  currentPassword: v.string(),
  newPassword: v.string(),
});

export const siteSettingsInput = v.object({
  metaDescription: v.string(),
  siteTitle: v.string(),
  tagline: v.string(),
});

export const badgeSettingsInput = v.object({
  badgeMode,
});

export function assertAdminApiToken(token: string) {
  const expectedToken = process.env.ADMIN_API_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    throw new Error("Unauthorized admin API request.");
  }
}
