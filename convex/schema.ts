import { defineSchema } from "convex/server";

import { adminUsersTable } from "./schema/adminUsers";
import { blogPostsTable } from "./schema/blogPosts";
import { profileTable } from "./schema/profile";
import { projectsTable } from "./schema/projects";

export default defineSchema({
  adminUsers: adminUsersTable,
  blogPosts: blogPostsTable,
  profile: profileTable,
  projects: projectsTable,
});
