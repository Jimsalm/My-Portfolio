"use client";

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

import { MediaFrame } from "@/features/portfolio/components/media-frame";
import { IconButton, Tag } from "@/features/portfolio/components/ui-atoms";
import type { PublicProject } from "@/features/portfolio/types";
import { fadeUp, motionTransition } from "@/features/portfolio/lib/motion";

export function ProjectCard({ project }: { project: PublicProject }) {
  return (
    <motion.article
      className="group border bg-background transition-colors hover:border-foreground"
      variants={fadeUp}
      transition={motionTransition}
      whileHover={{ y: -4, scale: 1.01 }}
    >
      <div className="flex items-center justify-between border-b px-4 py-2 font-mono text-xs text-muted-foreground">
        <span>project@portfolio:~/work$ cat {project.slug}.json</span>
        <span>published</span>
      </div>
      <Link href={`/projects/${project.slug}`}>
        <MediaFrame
          alt={project.title}
          className="aspect-[16/10] border-x-0 border-t-0"
          image={project.thumbnail}
        />
      </Link>
      <div className="flex flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link className="font-mono text-xl font-semibold tracking-tight hover:underline" href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
            <p className="mt-3 font-mono text-sm leading-6 text-muted-foreground">
              <span className="text-foreground">description:</span> {project.description}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <IconButton href={project.liveUrl} icon={ExternalLink} label={`${project.title} live site`} />
            <IconButton href={project.githubUrl} icon={Github} label={`${project.title} GitHub`} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Tag>Published</Tag>
          {project.techStack.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
