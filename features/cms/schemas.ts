import { z } from "zod";

export const contentStatusSchema = z.enum(["published", "draft"]);

export const uploadedFileSchema = z.object({
  key: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
});

const nullableUploadedFileSchema = uploadedFileSchema
  .nullish()
  .transform((value) => value ?? null);

const optionalUrlSchema = z
  .string()
  .trim()
  .refine((value) => value === "" || /^https?:\/\//i.test(value), {
    message: "Enter a valid URL.",
  })
  .optional()
  .default("");

export const projectFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  description: z.string().trim().min(1, "Description is required."),
  details: z.string().trim().min(1, "Details are required."),
  thumbnail: nullableUploadedFileSchema,
  techStack: z.array(z.string().trim().min(1)).default([]),
  liveUrl: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
  status: contentStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  priority: z.coerce.number().int().min(0).default(0),
});

export const blogPostFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  excerpt: z.string().trim().min(1, "Excerpt is required."),
  content: z.string().trim().min(1, "Content is required."),
  coverImage: nullableUploadedFileSchema,
  tags: z.array(z.string().trim().min(1)).default([]),
  status: contentStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  publishedAt: z
    .number()
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  readTime: z.coerce.number().int().min(1).default(1),
});

export const socialLinksSchema = z.object({
  github: optionalUrlSchema,
  linkedin: optionalUrlSchema,
  twitter: optionalUrlSchema,
  website: optionalUrlSchema,
});

export const skillCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Category name is required."),
  order: z.number().int().min(0),
  skills: z.array(z.string().trim().min(1)).default([]),
});

export const experienceSchema = z.object({
  id: z.string().min(1),
  company: z.string().trim().min(1, "Company is required."),
  role: z.string().trim().min(1, "Role is required."),
  startDate: z.string().trim().min(1, "Start date is required."),
  endDate: z.string().trim().optional().default(""),
  description: z.string().trim().min(1, "Description is required."),
  current: z.boolean().default(false),
});

export const educationSchema = z.object({
  id: z.string().min(1),
  school: z.string().trim().min(1, "School is required."),
  degree: z.string().trim().min(1, "Degree is required."),
  year: z.string().trim().min(1, "Year is required."),
});

export const aboutFormSchema = z.object({
  profilePhoto: nullableUploadedFileSchema,
  fullName: z.string().trim().min(1, "Full name is required."),
  role: z.string().trim().min(1, "Role is required."),
  shortBio: z.string().trim().min(1, "Short bio is required."),
  longBio: z.string().trim().min(1, "Long bio is required."),
  email: z.string().trim().email("Enter a valid email."),
  location: z.string().trim().min(1, "Location is required."),
  resumeFile: nullableUploadedFileSchema,
  socialLinks: socialLinksSchema,
  skills: z.array(skillCategorySchema).default([]),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
});

export type ContentStatus = z.infer<typeof contentStatusSchema>;
export type UploadedFile = z.infer<typeof uploadedFileSchema>;
export type ProjectFormValues = z.infer<typeof projectFormSchema>;
export type BlogPostFormValues = z.infer<typeof blogPostFormSchema>;
export type AboutFormValues = z.infer<typeof aboutFormSchema>;

export type Project = ProjectFormValues & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type BlogPost = BlogPostFormValues & {
  id: string;
  createdAt: number;
  updatedAt: number;
};

export type About = AboutFormValues & {
  id: string;
  updatedAt: number;
};

export type DashboardOverviewData = {
  profileLastUpdated: number | null;
  recentBlogPosts: Array<Pick<BlogPost, "id" | "slug" | "title" | "updatedAt">>;
  recentProjects: Array<Pick<Project, "id" | "slug" | "title" | "updatedAt">>;
  totalBlogPosts: number;
  totalProjects: number;
};

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateReadTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function emptyProject(): ProjectFormValues {
  return {
    description: "",
    details: "",
    featured: false,
    githubUrl: "",
    liveUrl: "",
    priority: 0,
    slug: "",
    status: "draft",
    techStack: [],
    thumbnail: null,
    title: "",
  };
}

export function emptyBlogPost(): BlogPostFormValues {
  return {
    content: "",
    coverImage: null,
    excerpt: "",
    featured: false,
    publishedAt: null,
    readTime: 1,
    slug: "",
    status: "draft",
    tags: [],
    title: "",
  };
}

export function emptyAbout(): AboutFormValues {
  return {
    education: [],
    email: "",
    experience: [],
    fullName: "",
    location: "",
    longBio: "",
    profilePhoto: null,
    resumeFile: null,
    role: "",
    shortBio: "",
    skills: [],
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      website: "",
    },
  };
}
