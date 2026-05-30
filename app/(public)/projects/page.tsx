import { ProjectsPage } from "@/features/portfolio/pages/projects-page";
import { buildMetadata } from "@/features/portfolio/lib/seo";
import {
  safePublicProjects,
  safePublicSettings,
} from "@/features/portfolio/server/public-data";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await safePublicSettings();

  return buildMetadata({
    description: "Published portfolio projects and selected work.",
    keywords: ["portfolio projects", "selected work", "software engineering"],
    path: "/projects",
    settings,
    title: "Projects",
  });
}

export default async function PublicProjectsPage() {
  const projects = await safePublicProjects();
  return <ProjectsPage initialData={projects} />;
}
