import type { Metadata } from "next";

import { ProjectsPage } from "@/features/portfolio/pages/projects-page";
import { absoluteUrl } from "@/features/portfolio/lib/utils";
import { safePublicProjects } from "@/features/portfolio/server/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/projects") },
  description: "Published portfolio projects and selected work.",
  openGraph: {
    description: "Published portfolio projects and selected work.",
    title: "Projects",
    url: absoluteUrl("/projects"),
  },
  title: "Projects | Portfolio",
};

export default async function PublicProjectsPage() {
  const projects = await safePublicProjects();
  return <ProjectsPage initialData={projects} />;
}
