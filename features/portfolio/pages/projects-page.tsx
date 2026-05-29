"use client";

import { useMemo, useState } from "react";
import { m } from "framer-motion";

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
      <SectionHeading description="query projects --status published --filter tech_stack" level="h1">
        ./work
      </SectionHeading>

      <div className="mb-8 border-y bg-background/70 py-4 font-mono">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-muted-foreground">
          <span>
            <span className="text-foreground">portfolio:~/work$</span> filter --stack
          </span>
          <span>{filteredProjects.length.toString().padStart(2, "0")} results</span>
        </div>
        <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:overflow-visible md:px-1">
          <div className="flex min-w-max gap-2 md:min-w-0 md:flex-wrap">
            {["All", ...tags].map((tag) => {
              const isActive = activeTag === tag;

              return (
                <button
                  aria-pressed={isActive}
                  className={cn(
                    "h-8 max-w-44 shrink-0 border px-3 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
                    "overflow-hidden text-ellipsis whitespace-nowrap",
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                  )}
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  title={`Filter by ${tag}`}
                  type="button"
                >
                  {tag === "All" ? "all" : tag.toLowerCase()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredProjects.length > 0 ? (
        <m.div
          animate="visible"
          className="grid gap-6 lg:grid-cols-2"
          initial="hidden"
          variants={staggerContainer}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </m.div>
      ) : (
        <EmptyState>No published projects match this filter.</EmptyState>
      )}
    </SectionShell>
  );
}
