"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { ProjectCard } from "@/features/portfolio/components/project-card";
import { EmptyState, SectionHeading, SectionShell } from "@/features/portfolio/components/ui-atoms";
import { usePublicProjects } from "@/features/portfolio/hooks/use-public-data";
import { staggerContainer } from "@/features/portfolio/lib/motion";
import { uniqueProjectTags } from "@/features/portfolio/lib/utils";
import type { PublicProject } from "@/features/portfolio/types";
import { cn } from "@/lib/utils";

export function ProjectsPage({ initialData }: { initialData: PublicProject[] }) {
  const { data: projects = initialData } = usePublicProjects(initialData);
  const [activeTag, setActiveTag] = useState("All");
  const tags = useMemo(() => uniqueProjectTags(projects), [projects]);
  const filteredProjects = useMemo(
    () =>
      activeTag === "All"
        ? projects
        : projects.filter((project) => project.techStack.includes(activeTag)),
    [activeTag, projects],
  );

  return (
    <SectionShell className="min-h-screen">
      <SectionHeading description="query projects --status published --filter tech_stack">
        ./work
      </SectionHeading>

      <div className="mb-8 flex flex-wrap gap-2 border bg-background p-3">
        {["All", ...tags].map((tag) => (
          <button
            className={cn(
              "border px-3 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
              activeTag === tag ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:border-foreground",
            )}
            key={tag}
            onClick={() => setActiveTag(tag)}
            type="button"
          >
            --{tag.toLowerCase()}
          </button>
        ))}
      </div>

      {filteredProjects.length > 0 ? (
        <motion.div
          animate="visible"
          className="grid gap-6 lg:grid-cols-2"
          initial="hidden"
          variants={staggerContainer}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      ) : (
        <EmptyState>No published projects match this filter.</EmptyState>
      )}
    </SectionShell>
  );
}
