"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Edit, Plus, Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBulkDeleteProjects,
  useDeleteProject,
  useProjects,
  useToggleProjectStatus,
} from "@/features/cms/hooks/use-projects";
import { type ContentStatus, type Project } from "@/features/cms/schemas";
import { formatDate } from "@/features/admin/lib/admin-profile";
import { fallbackBlurDataURL } from "@/features/portfolio/lib/image-placeholders";

export function ProjectsListPage() {
  const { data: projects = [], isLoading } = useProjects();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | ContentStatus>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const deleteProject = useDeleteProject();
  const bulkDelete = useBulkDeleteProjects();
  const toggleStatus = useToggleProjectStatus();

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const matchesSearch = project.title
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesStatus = status === "all" || project.status === status;
        return matchesSearch && matchesStatus;
      }),
    [projects, search, status],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 border p-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">Projects</h2>
          <p className="text-sm text-muted-foreground">Manage portfolio work.</p>
        </div>
        <Button asChild className="rounded-none">
          <Link href="/admin/projects/new">
            <Plus aria-hidden="true" className="size-4" />
            Add Project
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 border p-4 md:flex-row">
        <Input
          className="rounded-none"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by title"
          value={search}
        />
        <Select value={status} onValueChange={(value) => setStatus(value as typeof status)}>
          <SelectTrigger className="rounded-none md:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Button
          className="rounded-none"
          disabled={selected.length === 0 || bulkDelete.isPending}
          onClick={() => bulkDelete.mutate(selected, { onSuccess: () => setSelected([]) })}
          type="button"
          variant="outline"
        >
          <Trash2 aria-hidden="true" className="size-4" />
          Delete Selected
        </Button>
      </div>

      <div className="overflow-x-auto border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-muted text-left text-muted-foreground">
            <tr>
              <th className="w-12 p-3">
                <Checkbox
                  checked={
                    filteredProjects.length > 0 &&
                    selected.length === filteredProjects.length
                  }
                  onCheckedChange={(checked) =>
                    setSelected(checked ? filteredProjects.map((project) => project.id) : [])
                  }
                />
              </th>
              <th className="p-3">Thumbnail</th>
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={index}>
                  <td className="p-3" colSpan={7}>
                    <Skeleton className="h-12 rounded-none" />
                  </td>
                </tr>
              ))
            ) : filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <tr className="hover:bg-muted/50" key={project.id}>
                  <td className="p-3">
                    <Checkbox
                      checked={selected.includes(project.id)}
                      onCheckedChange={(checked) =>
                        setSelected((current) =>
                          checked
                            ? [...current, project.id]
                            : current.filter((id) => id !== project.id),
                        )
                      }
                    />
                  </td>
                  <td className="p-3">
                    <div className="relative size-12 border bg-muted">
                      {project.thumbnail?.url ? (
                        <Image
                          alt={`${project.title} thumbnail`}
                          blurDataURL={project.thumbnail.blurDataURL ?? fallbackBlurDataURL}
                          className="object-cover"
                          fill
                          placeholder="blur"
                          sizes="48px"
                          src={project.thumbnail.url}
                          unoptimized
                        />
                      ) : null}
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium">{project.title}</p>
                    <p className="text-xs text-muted-foreground">/{project.slug}</p>
                  </td>
                  <td className="p-3">
                    <Button
                      className="rounded-none"
                      onClick={() =>
                        toggleStatus.mutate({
                          id: project.id,
                          status: project.status === "published" ? "draft" : "published",
                        })
                      }
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      {project.status}
                    </Button>
                  </td>
                  <td className="p-3">{project.featured ? "Yes" : "No"}</td>
                  <td className="p-3">{formatDate(project.updatedAt)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <Button asChild className="rounded-none" size="icon-sm" variant="outline">
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <Edit aria-hidden="true" className="size-4" />
                        </Link>
                      </Button>
                      <Button
                        className="rounded-none"
                        onClick={() => setDeleteTarget(project)}
                        size="icon-sm"
                        type="button"
                        variant="outline"
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-8 text-center text-muted-foreground" colSpan={7}>
                  No projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-none">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-none"
              onClick={() => {
                if (deleteTarget) {
                  deleteProject.mutate(deleteTarget.id);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
