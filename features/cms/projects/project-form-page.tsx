"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/features/cms/components/tag-input";
import { UploadField } from "@/features/cms/components/upload-field";
import {
  useCreateProject,
  useProject,
  useUpdateProject,
} from "@/features/cms/hooks/use-projects";
import {
  emptyProject,
  projectFormSchema,
  slugify,
  type ProjectFormValues,
} from "@/features/cms/schemas";
import {
  useAutoSaveDraft,
  useUnsavedChangesWarning,
} from "@/features/cms/hooks/use-form-safety";

type ProjectFormPageProps = {
  id?: string;
  mode: "create" | "edit";
};

export function ProjectFormPage({ id, mode }: ProjectFormPageProps) {
  const router = useRouter();
  const { data: project, isLoading } = useProject(id);
  const createProject = useCreateProject();
  const updateProject = useUpdateProject(id ?? "");
  const form = useForm<ProjectFormValues>({
    defaultValues: emptyProject(),
    resolver: zodResolver(projectFormSchema) as Resolver<ProjectFormValues>,
  });
  const title = useWatch({ control: form.control, name: "title" });
  const slug = useWatch({ control: form.control, name: "slug" });
  const draftKey = `project-draft-${id ?? "new"}`;

  useUnsavedChangesWarning(form.formState.isDirty);
  useAutoSaveDraft(form, draftKey);

  useEffect(() => {
    if (mode === "edit" && project) {
      form.reset(project);
      return;
    }

    const savedDraft = window.localStorage.getItem(draftKey);
    if (mode === "create" && savedDraft) {
      form.reset(JSON.parse(savedDraft) as ProjectFormValues);
    }
  }, [draftKey, form, mode, project]);

  useEffect(() => {
    if (!slug && title) {
      form.setValue("slug", slugify(title), { shouldDirty: true });
    }
  }, [form, slug, title]);

  async function onSubmit(values: ProjectFormValues) {
    const action = mode === "create" ? createProject : updateProject;

    action.mutate(values, {
      onSuccess: () => {
        window.localStorage.removeItem(draftKey);
        router.push("/admin/projects");
      },
    });
  }

  if (mode === "edit" && isLoading) {
    return <Skeleton className="h-96 rounded-none" />;
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between border p-4">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">
            {mode === "create" ? "New Project" : "Edit Project"}
          </h2>
          <p className="text-sm text-muted-foreground">Project details and publishing state.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="rounded-none" variant="outline">
            <Link href="/admin/projects">Cancel</Link>
          </Button>
          <Button className="rounded-none" disabled={createProject.isPending || updateProject.isPending}>
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-5 border p-4 lg:grid-cols-2">
        <Field label="Title" error={form.formState.errors.title?.message}>
          <Input className="rounded-none" {...form.register("title")} />
        </Field>
        <Field label="Slug" error={form.formState.errors.slug?.message}>
          <Input className="rounded-none" {...form.register("slug")} />
        </Field>
        <Field label="Description" error={form.formState.errors.description?.message}>
          <Textarea className="rounded-none" {...form.register("description")} />
        </Field>
        <Field label="Details" error={form.formState.errors.details?.message}>
          <Textarea className="min-h-32 rounded-none" {...form.register("details")} />
        </Field>
        <Controller
          control={form.control}
          name="thumbnail"
          render={({ field }) => (
            <UploadField
              accept="image/*"
              endpoint="projectThumbnail"
              label="Thumbnail image"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={form.control}
          name="techStack"
          render={({ field }) => (
            <TagInput
              label="Tech stack"
              onChange={field.onChange}
              placeholder="React"
              value={field.value}
            />
          )}
        />
        <Field label="Live URL" error={form.formState.errors.liveUrl?.message}>
          <Input className="rounded-none" {...form.register("liveUrl")} />
        </Field>
        <Field label="GitHub URL" error={form.formState.errors.githubUrl?.message}>
          <Input className="rounded-none" {...form.register("githubUrl")} />
        </Field>
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Field label="Status">
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="rounded-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />
        <Field label="Order / priority" error={form.formState.errors.priority?.message}>
          <Input className="rounded-none" type="number" {...form.register("priority")} />
        </Field>
        <Controller
          control={form.control}
          name="featured"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              Featured
            </label>
          )}
        />
      </div>
    </form>
  );
}

function Field({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
