import { defineSchema } from "convex/server";

import { adminUsersTable } from "./schema/adminUsers";
import { blogPostsTable } from "./schema/blogPosts";
import { certificationsTable } from "./schema/certifications";
import { profileTable } from "./schema/profile";
import { projectsTable } from "./schema/projects";
import { siteSettingsTable } from "./schema/siteSettings";

export default defineSchema({
  adminUsers: adminUsersTable,
  blogPosts: blogPostsTable,
  certifications: certificationsTable,
  profile: profileTable,
  projects: projectsTable,
  siteSettings: siteSettingsTable,
});
