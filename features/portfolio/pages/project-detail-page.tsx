"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

import { MarkdownRenderer } from "@/features/portfolio/components/markdown-renderer";
import { MediaFrame } from "@/features/portfolio/components/media-frame";
import { ProjectCard } from "@/features/portfolio/components/project-card";
import { IconButton, SectionHeading, SectionShell, Tag, TextButton } from "@/features/portfolio/components/ui-atoms";
import { usePublicProject } from "@/features/portfolio/hooks/use-public-data";
import { fadeUp, motionTransition, staggerContainer } from "@/features/portfolio/lib/motion";
import type { PublicProjectDetailData } from "@/features/portfolio/types";

export function ProjectDetailPage({
  initialData,
  slug,
}: {
  initialData: PublicProjectDetailData;
  slug: string;
}) {
  const { data = initialData } = usePublicProject(slug, initialData);
  const project = data.project;

  if (!project) {
    return null;
  }

  return (
    <>
      <SectionShell className="pb-10">
        <Link className="mb-8 inline-flex items-center gap-2 font-mono text-sm font-medium hover:underline" href="/projects">
          <ArrowLeft aria-hidden="true" className="size-4" />
          cd ../work
        </Link>
        <motion.div animate="visible" initial="hidden" variants={staggerContainer}>
          <motion.div variants={fadeUp}>
            <MediaFrame alt={project.title} className="aspect-[16/8]" image={project.thumbnail} priority />
          </motion.div>
          <motion.div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]" variants={fadeUp} transition={motionTransition}>
            <div>
              <p className="font-mono text-sm text-muted-foreground">cat ./{project.slug}/README.md</p>
              <h1 className="mt-4 font-mono text-5xl font-semibold tracking-tight md:text-7xl">{project.title}</h1>
              <p className="mt-5 max-w-2xl font-mono text-sm leading-8 text-muted-foreground">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.techStack.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
            <div className="flex items-start gap-2 lg:justify-end">
              <IconButton href={project.liveUrl} icon={ExternalLink} label="Live site" />
              <IconButton href={project.githubUrl} icon={Github} label="GitHub" />
            </div>
          </motion.div>
        </motion.div>
      </SectionShell>

      <SectionShell className="pt-8">
        <article className="max-w-3xl">
          <MarkdownRenderer content={project.details} />
        </article>
      </SectionShell>

      <SectionShell>
        <SectionHeading>./related-work</SectionHeading>
        {data.relatedProjects.length > 0 ? (
          <motion.div animate="visible" className="grid gap-6 md:grid-cols-3" initial="hidden" variants={staggerContainer}>
            {data.relatedProjects.map((related) => (
              <ProjectCard key={related.id} project={related} />
            ))}
          </motion.div>
        ) : (
          <TextButton href="/projects" variant="secondary">
            View all projects
          </TextButton>
        )}
      </SectionShell>
    </>
  );
}
