import { z } from "zod";

export const contentStatusSchema = z.enum(["published", "draft"]);

export const uploadedFileSchema = z.object({
  blurDataURL: z.string().optional(),
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

const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required.")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only.");

const timestampSchema = z
  .number()
  .nullable()
  .optional()
  .refine((value) => value == null || !Number.isNaN(new Date(value).getTime()), {
    message: "Enter a valid date.",
  })
  .transform((value) => value ?? null);

const monthYearPattern =
  /^(jan(uary)?|feb(ruary)?|mar(ch)?|apr(il)?|may|jun(e)?|jul(y)?|aug(ust)?|sep(t|tember)?|oct(ober)?|nov(ember)?|dec(ember)?)\s+\d{4}$/i;

function isValidDateString(value: string) {
  const trimmed = value.trim();
  const yearOnly = trimmed.match(/^(\d{4})$/);
  const yearMonth = trimmed.match(/^(\d{4})-(\d{2})$/);
  const fullDate = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (yearOnly) {
    return true;
  }

  if (yearMonth) {
    const month = Number(yearMonth[2]);
    return month >= 1 && month <= 12;
  }

  if (fullDate) {
    const year = Number(fullDate[1]);
    const month = Number(fullDate[2]);
    const day = Number(fullDate[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }

  return monthYearPattern.test(trimmed);
}

const dateStringSchema = z
  .string()
  .trim()
  .refine(isValidDateString, "Use YYYY, YYYY-MM, YYYY-MM-DD, or Month YYYY.");

export const projectFormSchema = z
  .object({
  title: z.string().trim().min(1, "Title is required."),
  slug: slugSchema,
  description: z.string().trim().min(20, "Description must be at least 20 characters."),
  details: z.string().trim().min(40, "Details must be at least 40 characters."),
  thumbnail: nullableUploadedFileSchema,
  techStack: z.array(z.string().trim().min(1)).default([]),
  liveUrl: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
  status: contentStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  priority: z.coerce.number().int().min(0).default(0),
})
  .superRefine((value, context) => {
    if (value.status === "published" && !value.thumbnail) {
      context.addIssue({
        code: "custom",
        message: "Thumbnail image is required before publishing.",
        path: ["thumbnail"],
      });
    }
  });

export const blogPostFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: slugSchema,
  excerpt: z.string().trim().min(20, "Excerpt must be at least 20 characters."),
  content: z.string().trim().min(80, "Content must be at least 80 characters."),
  coverImage: nullableUploadedFileSchema,
  tags: z.array(z.string().trim().min(1)).default([]),
  status: contentStatusSchema.default("draft"),
  featured: z.boolean().default(false),
  publishedAt: timestampSchema,
  readTime: z.coerce.number().int().min(1).default(1),
});

export const socialLinksSchema = z.object({
  github: optionalUrlSchema,
  linkedin: optionalUrlSchema,
  twitter: optionalUrlSchema,
  website: optionalUrlSchema,
});

const hexColorSchema = z
  .string()
  .trim()
  .optional()
  .default("")
  .refine((value) => value === "" || /^#?[0-9a-fA-F]{6}$/.test(value), {
    message: "Use a valid hex color.",
  })
  .transform(normalizeHexColor);

const rawSkillItemSchema = z.union([
  z.string().trim().min(1),
  z.object({
    brandColor: hexColorSchema,
    iconSlug: z.string().trim().optional().default(""),
    id: z.string().trim().optional().default(""),
    name: z.string().trim().min(1, "Skill name is required."),
  }),
]);

export const skillCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1, "Category name is required."),
  order: z.number().int().min(0),
  skills: z
    .array(rawSkillItemSchema)
    .default([])
    .transform((skills) => skills.map((skill, index) => normalizeSkillItem(skill, index))),
});

export const experienceSchema = z
  .object({
  id: z.string().min(1),
  company: z.string().trim().min(1, "Company is required."),
  role: z.string().trim().min(1, "Role is required."),
  startDate: dateStringSchema,
  endDate: z.string().trim().optional().default(""),
  description: z.string().trim().min(1, "Description is required."),
  current: z.boolean().default(false),
})
  .superRefine((value, context) => {
    if (!value.current && !dateStringSchema.safeParse(value.endDate).success) {
      context.addIssue({
        code: "custom",
        message: "Use YYYY, YYYY-MM, YYYY-MM-DD, or Month YYYY.",
        path: ["endDate"],
      });
    }
  });

export const educationSchema = z.object({
  id: z.string().min(1),
  school: z.string().trim().min(1, "School is required."),
  degree: z.string().trim().min(1, "Degree is required."),
  year: z.string().trim().regex(/^\d{4}$/, "Use a four-digit year."),
  honors: z.string().trim().max(120, "Honors should be 120 characters or less.").optional().default(""),
  gpa: z.string().trim().max(40, "GPA should be 40 characters or less.").optional().default(""),
});

export const aboutFormSchema = z.object({
  profilePhoto: nullableUploadedFileSchema,
  fullName: z.string().trim().min(1, "Full name is required."),
  role: z.string().trim().min(1, "Role is required."),
  shortBio: z.string().trim().min(20, "Short bio must be at least 20 characters."),
  longBio: z.string().trim().min(80, "Long bio must be at least 80 characters."),
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
export type SkillItem = {
  brandColor: string;
  iconSlug: string;
  id: string;
  name: string;
};

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

export function normalizeHexColor(value?: string | null) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  const withoutHash = trimmed.replace(/^#/, "");
  return /^([0-9a-fA-F]{6})$/.test(withoutHash) ? `#${withoutHash.toUpperCase()}` : trimmed;
}

export function normalizeSkillItem(
  value:
    | string
    | {
        brandColor?: string;
        iconSlug?: string;
        id?: string;
        name: string;
      },
  index = 0,
): SkillItem {
  const raw = typeof value === "string" ? { name: value } : value;
  const name = raw.name.trim();
  const fallbackId = `${slugify(name) || "skill"}-${index}`;

  return {
    brandColor: normalizeHexColor(raw.brandColor),
    iconSlug: raw.iconSlug?.trim() ?? "",
    id: raw.id?.trim() || fallbackId,
    name,
  };
}

export function normalizeSkillItems(values: Array<SkillItem | string>) {
  return values.map((value, index) => normalizeSkillItem(value, index));
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
