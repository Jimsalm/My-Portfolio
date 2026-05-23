"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm, type Resolver } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { TagInput } from "@/features/cms/components/tag-input";
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

  if (isLoading) {
    return <Skeleton className="h-96 rounded-none" />;
  }

  return (
    <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex items-center justify-between border p-4">
        <div>
          <h2 className="text-xl font-semibold tracking-normal">About / Resume</h2>
          <p className="text-sm text-muted-foreground">Profile, resume, skills, experience, and education.</p>
        </div>
        <Button className="rounded-none" disabled={updateAbout.isPending}>
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
          <Input className="rounded-none" {...form.register("fullName")} />
        </Field>
        <Field label="Title / Role" error={form.formState.errors.role?.message}>
          <Input className="rounded-none" {...form.register("role")} />
        </Field>
        <Field label="Email" error={form.formState.errors.email?.message}>
          <Input className="rounded-none" {...form.register("email")} />
        </Field>
        <Field label="Location" error={form.formState.errors.location?.message}>
          <Input className="rounded-none" {...form.register("location")} />
        </Field>
        <Field label="Short bio" error={form.formState.errors.shortBio?.message}>
          <Textarea className="rounded-none" {...form.register("shortBio")} />
        </Field>
        <Field label="Long bio / About me" error={form.formState.errors.longBio?.message}>
          <Textarea className="min-h-44 rounded-none font-mono" {...form.register("longBio")} />
        </Field>
      </section>

      <section className="grid gap-5 border p-4 lg:grid-cols-2">
        <Field label="GitHub URL">
          <Input className="rounded-none" {...form.register("socialLinks.github")} />
        </Field>
        <Field label="LinkedIn URL">
          <Input className="rounded-none" {...form.register("socialLinks.linkedin")} />
        </Field>
        <Field label="Twitter/X URL">
          <Input className="rounded-none" {...form.register("socialLinks.twitter")} />
        </Field>
        <Field label="Website URL">
          <Input className="rounded-none" {...form.register("socialLinks.website")} />
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
                  <TagInput label="Skill items" onChange={field.onChange} value={field.value} />
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
            <Input className="rounded-none" placeholder="Company" {...form.register(`experience.${index}.company`)} />
            <Input className="rounded-none" placeholder="Role" {...form.register(`experience.${index}.role`)} />
            <Input className="rounded-none" placeholder="Start date" {...form.register(`experience.${index}.startDate`)} />
            <Input className="rounded-none" placeholder="End date" {...form.register(`experience.${index}.endDate`)} />
            <Textarea className="rounded-none lg:col-span-2" placeholder="Description" {...form.register(`experience.${index}.description`)} />
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
            <Input className="rounded-none" placeholder="School" {...form.register(`education.${index}.school`)} />
            <Input className="rounded-none" placeholder="Degree" {...form.register(`education.${index}.degree`)} />
            <Input className="rounded-none" placeholder="Year" {...form.register(`education.${index}.year`)} />
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
