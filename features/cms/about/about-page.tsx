"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch, type Resolver } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { SkillItemsEditor } from "@/features/cms/components/skill-items-editor";
import { UploadField } from "@/features/cms/components/upload-field";
import { useAbout, useUpdateAbout } from "@/features/cms/hooks/use-about";
import {
  aboutFormSchema,
  emptyAbout,
  type AboutFormValues,
} from "@/features/cms/schemas";
import {
  useAutoSaveDraft,
  useUnsavedChangesWarning,
} from "@/features/cms/hooks/use-form-safety";

export function AboutPage() {
  const { data: about, isLoading } = useAbout();
  const updateAbout = useUpdateAbout();
  const [draggedSkillIndex, setDraggedSkillIndex] = useState<number | null>(null);
  const form = useForm<AboutFormValues>({
    defaultValues: emptyAbout(),
    resolver: zodResolver(aboutFormSchema) as Resolver<AboutFormValues>,
  });
  const skillFields = useFieldArray({ control: form.control, name: "skills" });
  const experienceFields = useFieldArray({ control: form.control, name: "experience" });
  const educationFields = useFieldArray({ control: form.control, name: "education" });
  const shortBio = useWatch({ control: form.control, name: "shortBio" });
  const longBio = useWatch({ control: form.control, name: "longBio" });

  useUnsavedChangesWarning(form.formState.isDirty);
  useAutoSaveDraft(form, "about-draft");

  useEffect(() => {
    if (about) {
      form.reset(about);
      return;
    }

    const savedDraft = window.localStorage.getItem("about-draft");
    if (savedDraft) {
      form.reset(JSON.parse(savedDraft) as AboutFormValues);
    }
  }, [about, form]);

  function onSubmit(values: AboutFormValues) {
    updateAbout.mutate(values, {
      onSuccess: () => window.localStorage.removeItem("about-draft"),
    });
  }

  function onInvalid() {
    toast.error("Fix the highlighted fields before saving.");
    const firstError = document.querySelector("[aria-invalid='true']");
    firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (isLoading) {
    return <Skeleton className="h-96 rounded-none" />;
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
      <div className="flex items-center justify-between border p-4">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">About / Resume</h2>
          <p className="text-sm text-muted-foreground">Profile, resume, skills, experience, and education.</p>
        </div>
        <Button className="rounded-none" disabled={updateAbout.isPending}>
          {updateAbout.isPending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
          Save
        </Button>
      </div>

      <section className="grid gap-5 border p-4 lg:grid-cols-2">
        <Controller
          control={form.control}
          name="profilePhoto"
          render={({ field }) => (
            <UploadField
              accept="image/*"
              endpoint="profilePhoto"
              label="Profile photo"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Controller
          control={form.control}
          name="resumeFile"
          render={({ field }) => (
            <UploadField
              accept="application/pdf"
              endpoint="resumePdf"
              label="Resume PDF"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />
        <Field label="Full name" error={form.formState.errors.fullName?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.fullName)} className="rounded-none" {...form.register("fullName")} />
        </Field>
        <Field label="Title / Role" error={form.formState.errors.role?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.role)} className="rounded-none" {...form.register("role")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.email)} className="rounded-none" {...form.register("email")} />
        </Field>
        <Field label="Location" error={form.formState.errors.location?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.location)} className="rounded-none" {...form.register("location")} />
        </Field>
        <Field count={shortBio?.length ?? 0} label="Short bio" error={form.formState.errors.shortBio?.message}>
          <Textarea aria-invalid={Boolean(form.formState.errors.shortBio)} className="rounded-none" {...form.register("shortBio")} />
        </Field>
        <Field count={longBio?.length ?? 0} label="Long bio / About me" error={form.formState.errors.longBio?.message}>
          <Textarea aria-invalid={Boolean(form.formState.errors.longBio)} className="min-h-44 rounded-none font-mono" {...form.register("longBio")} />
        </Field>
      </section>

      <section className="grid gap-5 border p-4 lg:grid-cols-2">
        <Field label="GitHub URL" error={form.formState.errors.socialLinks?.github?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.socialLinks?.github)} className="rounded-none" {...form.register("socialLinks.github")} />
        </Field>
        <Field label="LinkedIn URL" error={form.formState.errors.socialLinks?.linkedin?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.socialLinks?.linkedin)} className="rounded-none" {...form.register("socialLinks.linkedin")} />
        </Field>
        <Field label="Twitter/X URL" error={form.formState.errors.socialLinks?.twitter?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.socialLinks?.twitter)} className="rounded-none" {...form.register("socialLinks.twitter")} />
        </Field>
        <Field label="Website URL" error={form.formState.errors.socialLinks?.website?.message}>
          <Input aria-invalid={Boolean(form.formState.errors.socialLinks?.website)} className="rounded-none" {...form.register("socialLinks.website")} />
        </Field>
      </section>

      <section className="space-y-3 border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold tracking-normal">Skills</h3>
          <Button
            className="rounded-none"
            onClick={() =>
              skillFields.append({
                id: crypto.randomUUID(),
                name: "",
                order: skillFields.fields.length,
                skills: [],
              })
            }
            type="button"
            variant="outline"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add Category
          </Button>
        </div>
        <div className="space-y-3">
          {skillFields.fields.map((field, index) => (
            <div
              className="grid gap-3 border p-3"
              draggable
              key={field.id}
              onDragOver={(event) => event.preventDefault()}
              onDragStart={() => setDraggedSkillIndex(index)}
              onDrop={() => {
                if (draggedSkillIndex !== null && draggedSkillIndex !== index) {
                  skillFields.move(draggedSkillIndex, index);
                }
                setDraggedSkillIndex(null);
              }}
            >
              <div className="flex items-center gap-2">
                <GripVertical aria-hidden="true" className="size-4 text-muted-foreground" />
                <Input
                  className="rounded-none"
                  placeholder="Frontend"
                  {...form.register(`skills.${index}.name`)}
                />
                <Button
                  className="rounded-none"
                  onClick={() => skillFields.remove(index)}
                  size="icon"
                  type="button"
                  variant="outline"
                >
                  <Trash2 aria-hidden="true" className="size-4" />
                </Button>
              </div>
              <Controller
                control={form.control}
                name={`skills.${index}.skills`}
                render={({ field }) => (
                  <SkillItemsEditor onChange={field.onChange} value={field.value} />
                )}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3 border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold tracking-normal">Experience</h3>
          <Button
            className="rounded-none"
            onClick={() =>
              experienceFields.append({
                company: "",
                current: false,
                description: "",
                endDate: "",
                id: crypto.randomUUID(),
                role: "",
                startDate: "",
              })
            }
            type="button"
            variant="outline"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add Experience
          </Button>
        </div>
        {experienceFields.fields.map((field, index) => (
          <div className="grid gap-3 border p-3 lg:grid-cols-2" key={field.id}>
            <Field label="Company" error={form.formState.errors.experience?.[index]?.company?.message}>
              <Input
                aria-invalid={Boolean(form.formState.errors.experience?.[index]?.company)}
                className="rounded-none"
                placeholder="Company"
                {...form.register(`experience.${index}.company`)}
              />
            </Field>
            <Field label="Role" error={form.formState.errors.experience?.[index]?.role?.message}>
              <Input
                aria-invalid={Boolean(form.formState.errors.experience?.[index]?.role)}
                className="rounded-none"
                placeholder="Role"
                {...form.register(`experience.${index}.role`)}
              />
            </Field>
            <Field label="Start date" error={form.formState.errors.experience?.[index]?.startDate?.message}>
              <Input
                aria-invalid={Boolean(form.formState.errors.experience?.[index]?.startDate)}
                className="rounded-none"
                placeholder="December 2025"
                {...form.register(`experience.${index}.startDate`)}
              />
            </Field>
            <Field label="End date" error={form.formState.errors.experience?.[index]?.endDate?.message}>
              <Input
                aria-invalid={Boolean(form.formState.errors.experience?.[index]?.endDate)}
                className="rounded-none"
                placeholder="March 2026"
                {...form.register(`experience.${index}.endDate`)}
              />
            </Field>
            <Field
              className="lg:col-span-2"
              label="Description"
              error={form.formState.errors.experience?.[index]?.description?.message}
            >
              <Textarea
                aria-invalid={Boolean(form.formState.errors.experience?.[index]?.description)}
                className="rounded-none"
                placeholder="Description"
                {...form.register(`experience.${index}.description`)}
              />
            </Field>
            <Controller
              control={form.control}
              name={`experience.${index}.current`}
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  Current job
                </label>
              )}
            />
            <Button className="rounded-none" onClick={() => experienceFields.remove(index)} type="button" variant="outline">
              Remove
            </Button>
          </div>
        ))}
      </section>

      <section className="space-y-3 border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold tracking-normal">Education</h3>
          <Button
            className="rounded-none"
            onClick={() =>
              educationFields.append({
                degree: "",
                id: crypto.randomUUID(),
                school: "",
                year: "",
              })
            }
            type="button"
            variant="outline"
          >
            <Plus aria-hidden="true" className="size-4" />
            Add Education
          </Button>
        </div>
        {educationFields.fields.map((field, index) => (
          <div className="grid gap-3 border p-3 lg:grid-cols-[1fr_1fr_120px_auto]" key={field.id}>
            <Field label="School" error={form.formState.errors.education?.[index]?.school?.message}>
              <Input
                aria-invalid={Boolean(form.formState.errors.education?.[index]?.school)}
                className="rounded-none"
                placeholder="School"
                {...form.register(`education.${index}.school`)}
              />
            </Field>
            <Field label="Degree" error={form.formState.errors.education?.[index]?.degree?.message}>
              <Input
                aria-invalid={Boolean(form.formState.errors.education?.[index]?.degree)}
                className="rounded-none"
                placeholder="Degree"
                {...form.register(`education.${index}.degree`)}
              />
            </Field>
            <Field label="Year" error={form.formState.errors.education?.[index]?.year?.message}>
              <Input
                aria-invalid={Boolean(form.formState.errors.education?.[index]?.year)}
                className="rounded-none"
                placeholder="2026"
                {...form.register(`education.${index}.year`)}
              />
            </Field>
            <Button className="rounded-none" onClick={() => educationFields.remove(index)} type="button" variant="outline">
              Remove
            </Button>
          </div>
        ))}
      </section>
    </form>
  );
}

function Field({
  children,
  className,
  count,
  error,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  count?: number;
  error?: string;
  label: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
      {typeof count === "number" ? <p className="text-xs text-muted-foreground">{count} characters</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
