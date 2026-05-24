import type { Metadata } from "next";

import { ProjectsPage } from "@/features/portfolio/pages/projects-page";
import { buildMetadata } from "@/features/portfolio/lib/seo";
import { safePublicProjects } from "@/features/portfolio/server/public-data";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  description: "Published portfolio projects and selected work.",
  keywords: ["portfolio projects", "selected work", "software engineering"],
  path: "/projects",
  title: "Projects",
});

export default async function PublicProjectsPage() {
  const projects = await safePublicProjects();
  return <ProjectsPage initialData={projects} />;
}
