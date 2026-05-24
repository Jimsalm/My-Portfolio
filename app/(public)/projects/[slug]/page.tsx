import type { Metadata } from "next";

import { PublicNotFoundPanel } from "@/features/portfolio/components/public-not-found";
import { ProjectDetailPage } from "@/features/portfolio/pages/project-detail-page";
import {
  buildMetadata,
  getOgImageUrl,
  jsonLdScriptProps,
  projectJsonLd,
} from "@/features/portfolio/lib/seo";
import {
  getPublicProject,
  getPublicProjectSlugs,
} from "@/features/portfolio/server/public-data";

export const revalidate = 60;

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
      return {
        ...buildMetadata({
          description: "The requested project could not be found.",
          path: `/projects/${slug}`,
          title: "Project Not Found",
        }),
        robots: { follow: false, index: false },
      };
    }

    return buildMetadata({
      description: project.description,
      image: getOgImageUrl({ slug: project.slug, type: "project" }),
      keywords: ["project", ...project.techStack],
      path: `/projects/${project.slug}`,
      title: project.title,
    });
  } catch {
    return buildMetadata({
      description: "Project details from the portfolio.",
      path: `/projects/${slug}`,
      title: "Project",
    });
  }
}

export default async function PublicProjectPage({ params }: PublicProjectPageProps) {
  const { slug } = await params;
  const data = await getPublicProject(slug);

  if (!data.project) {
    return <PublicNotFoundPanel />;
  }

  return (
    <>
      <script {...jsonLdScriptProps(projectJsonLd(data.project))} />
      <ProjectDetailPage initialData={data} slug={slug} />
    </>
  );
}
