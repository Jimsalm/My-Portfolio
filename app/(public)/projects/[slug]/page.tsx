import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailPage } from "@/features/portfolio/pages/project-detail-page";
import { absoluteUrl } from "@/features/portfolio/lib/utils";
import {
  getPublicProject,
  getPublicProjectSlugs,
} from "@/features/portfolio/server/public-data";

export const dynamic = "force-dynamic";

type PublicProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublicProjectSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PublicProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const { project } = await getPublicProject(slug);

    if (!project) {
      return { title: "Project Not Found | Portfolio" };
    }

    return {
      alternates: { canonical: absoluteUrl(`/projects/${project.slug}`) },
      description: project.description,
      openGraph: {
        description: project.description,
        images: project.thumbnail?.url ? [{ url: project.thumbnail.url }] : undefined,
        title: project.title,
        url: absoluteUrl(`/projects/${project.slug}`),
      },
      title: `${project.title} | Portfolio`,
    };
  } catch {
    return { title: "Project | Portfolio" };
  }
}

export default async function PublicProjectPage({ params }: PublicProjectPageProps) {
  const { slug } = await params;
  const data = await getPublicProject(slug);

  if (!data.project) {
    notFound();
  }

  return <ProjectDetailPage initialData={data} slug={slug} />;
}
