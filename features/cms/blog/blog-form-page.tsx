"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form";
import { Loader2 } from "lucide-react";

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
  useBlogPost,
  useCreateBlogPost,
  useUpdateBlogPost,
} from "@/features/cms/hooks/use-blog-posts";
import {
  blogPostFormSchema,
  calculateReadTime,
  emptyBlogPost,
  slugify,
  type BlogPostFormValues,
} from "@/features/cms/schemas";
import {
  useAutoSaveDraft,
  useUnsavedChangesWarning,
} from "@/features/cms/hooks/use-form-safety";

type BlogFormPageProps = {
  id?: string;
  mode: "create" | "edit";
};

export function BlogFormPage({ id, mode }: BlogFormPageProps) {
  const router = useRouter();
  const { data: post, isLoading } = useBlogPost(id);
  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost(id ?? "");
  const form = useForm<BlogPostFormValues>({
    defaultValues: emptyBlogPost(),
    resolver: zodResolver(blogPostFormSchema) as Resolver<BlogPostFormValues>,
  });
  const title = useWatch({ control: form.control, name: "title" });
  const slug = useWatch({ control: form.control, name: "slug" });
  const content = useWatch({ control: form.control, name: "content" });
  const excerpt = useWatch({ control: form.control, name: "excerpt" });
  const publishedAt = useWatch({ control: form.control, name: "publishedAt" });
  const draftKey = `blog-draft-${id ?? "new"}`;
  const isPending = createPost.isPending || updatePost.isPending;

  useUnsavedChangesWarning(form.formState.isDirty);
  useAutoSaveDraft(form, draftKey);

  useEffect(() => {
    if (mode === "edit" && post) {
      form.reset(post);
      return;
    }

    const savedDraft = window.localStorage.getItem(draftKey);
    if (mode === "create" && savedDraft) {
      form.reset(JSON.parse(savedDraft) as BlogPostFormValues);
    }
  }, [draftKey, form, mode, post]);

  useEffect(() => {
    if (!slug && title) {
      form.setValue("slug", slugify(title), { shouldDirty: true });
    }
  }, [form, slug, title]);

  useEffect(() => {
    form.setValue("readTime", calculateReadTime(content), { shouldDirty: true });
  }, [content, form]);

  function onSubmit(values: BlogPostFormValues) {
    const action = mode === "create" ? createPost : updatePost;
    action.mutate(values, {
      onSuccess: () => {
        window.localStorage.removeItem(draftKey);
        router.push("/admin/blog");
      },
    });
  }

  function onInvalid() {
    const firstError = document.querySelector("[aria-invalid='true']");
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (mode === "edit" && isLoading) {
    return <Skeleton className="h-96 rounded-none" />;
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
      <div className="flex items-center justify-between border p-4">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">
            {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
          </h2>
          <p className="text-sm text-muted-foreground">Markdown content and publishing state.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="rounded-none" variant="outline">
            <Link href="/admin/blog">Cancel</Link>
          </Button>
          <Button className="rounded-none" disabled={isPending}>
            {isPending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-5 border p-4 lg:grid-cols-2">
        <Field label="Title" error={form.formState.errors.title?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.title)} className="rounded-none" {...form.register("title")} />
        </Field>
        <Field description={slug ? `Preview: /blog/${slug}` : "Use lowercase words separated by hyphens."} label="Slug" error={form.formState.errors.slug?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.slug)} className="rounded-none" {...form.register("slug")} />
        </Field>
        <Field count={excerpt?.length ?? 0} label="Excerpt" error={form.formState.errors.excerpt?.message}>
          <Textarea aria-invalid={Boolean(form.formState.errors.excerpt)} className="rounded-none" {...form.register("excerpt")} />
        </Field>
        <Controller
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <UploadField
              accept="image/*"
              endpoint="blogCover"
              label="Cover image"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <TagInput label="Tags" onChange={field.onChange} placeholder="Next.js" value={field.value} />
          )}
        />
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
        <Field label="Published date">
          <Input
            className="rounded-none"
            onChange={(event) =>
              form.setValue(
                "publishedAt",
                event.target.value ? new Date(event.target.value).getTime() : null,
                { shouldDirty: true },
              )
            }
            type="date"
            value={
              publishedAt
                ? new Date(publishedAt).toISOString().slice(0, 10)
                : ""
            }
          />
        </Field>
        <Field label="Read time">
          <Input className="rounded-none" readOnly type="number" {...form.register("readTime")} />
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

      <div className="grid gap-5 border p-4 lg:grid-cols-2">
        <Field label="Content" error={form.formState.errors.content?.message}>
          <Textarea aria-invalid={Boolean(form.formState.errors.content)} className="min-h-96 rounded-none font-mono" {...form.register("content")} />
          <p className="text-xs text-muted-foreground">{content?.length ?? 0} characters</p>
        </Field>
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="min-h-96 whitespace-pre-wrap border bg-muted/30 p-4 text-sm leading-6">
            {content || "Markdown preview appears here."}
          </div>
        </div>
      </div>
    </form>
  );
}

function Field({
  children,
  count,
  description,
  error,
  label,
}: {
  children: React.ReactNode;
  count?: number;
  description?: string;
  error?: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      {typeof count === "number" ? <p className="text-xs text-muted-foreground">{count} characters</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
