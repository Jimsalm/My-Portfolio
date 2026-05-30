import { defineTable } from "convex/server";
import { v } from "convex/values";

import {
  educationEntry,
  experienceEntry,
  nullableUploadedFile,
  skillCategory,
  socialLinks,
} from "../lib/cmsValidators";

export const profileTable = defineTable({
  education: v.optional(v.array(educationEntry)),
  email: v.optional(v.string()),
  experience: v.optional(v.array(experienceEntry)),
  fullName: v.optional(v.string()),
  location: v.optional(v.string()),
  longBio: v.optional(v.string()),
  profilePhoto: v.optional(nullableUploadedFile),
  resumeFile: v.optional(nullableUploadedFile),
  role: v.optional(v.string()),
  shortBio: v.optional(v.string()),
  skills: v.optional(v.array(skillCategory)),
  socialLinks: v.optional(socialLinks),
  updatedAt: v.number(),
}).index("by_updatedAt", ["updatedAt"]);
