"use client";

import { FileDown, Github, Globe, Linkedin, Mail, MapPin, Twitter } from "lucide-react";
import { m } from "framer-motion";
import dynamic from "next/dynamic";

import { MediaFrame } from "@/features/portfolio/components/media-frame";
import { IconButton, SectionHeading, SectionShell, Tag, TextButton } from "@/features/portfolio/components/ui-atoms";
import { usePublicAbout } from "@/features/portfolio/hooks/use-public-data";
import { fadeUp, motionTransition, staggerContainer } from "@/features/portfolio/lib/motion";
import {
  getProfileBio,
  getProfileEmail,
  getProfileName,
  getProfileRole,
  socialEntries,
} from "@/features/portfolio/lib/utils";
import type { PublicAbout } from "@/features/portfolio/types";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
};

const MarkdownRenderer = dynamic(
  () => import("@/features/portfolio/components/markdown-renderer").then((mod) => mod.MarkdownRenderer),
  {
    loading: () => <div className="h-40 animate-pulse border bg-muted" />,
  },
);

export function AboutPage({ initialData }: { initialData: PublicAbout | null }) {
  const { data: about = initialData } = usePublicAbout(initialData);
  const name = getProfileName(about);
  const role = getProfileRole(about);
  const bio = getProfileBio(about);
  const email = getProfileEmail(about);

  return (
    <>
      <SectionShell>
        <m.div
          animate="visible"
          className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-end"
          initial="hidden"
          variants={staggerContainer}
        >
          <m.div variants={fadeUp}>
            <MediaFrame alt={name} className="aspect-square" image={about?.profilePhoto ?? null} priority sizes="(min-width: 1024px) 320px, 100vw" />
          </m.div>
          <m.div variants={fadeUp} transition={motionTransition}>
            <p className="font-mono text-sm text-muted-foreground">whoami --verbose</p>
            <h1 className="mt-4 font-mono text-5xl font-semibold tracking-tight md:text-7xl">{name}</h1>
            <p className="mt-5 font-mono text-2xl font-medium tracking-tight">
              <span aria-hidden="true">{"// "}</span>
              {role}
            </p>
            <p className="mt-5 max-w-2xl font-mono text-sm leading-8 text-muted-foreground">{bio}</p>
          </m.div>
        </m.div>
      </SectionShell>

      <SectionShell className="grid gap-12 pt-8 lg:grid-cols-[1fr_320px]">
        <article>
          <SectionHeading>./about-me</SectionHeading>
          <MarkdownRenderer content={about?.longBio || bio} />
        </article>
        <aside className="flex flex-col gap-4 border bg-background p-5 font-mono text-sm">
          <a className="inline-flex items-center gap-2 hover:underline" href={`mailto:${email}`}>
            <Mail aria-hidden="true" className="size-4" />
            {email}
          </a>
          {about?.location ? (
            <span className="inline-flex items-center gap-2 text-muted-foreground">
              <MapPin aria-hidden="true" className="size-4" />
              {about.location}
            </span>
          ) : null}
          {about?.resumeFile?.url ? (
            <TextButton href={about.resumeFile.url} target="_blank" variant="secondary">
              Download Resume
            </TextButton>
          ) : null}
        </aside>
      </SectionShell>

      <SectionShell className="pt-8">
        <SectionHeading>./skills</SectionHeading>
        {about?.skills.length ? (
          <div className="grid gap-5 md:grid-cols-2">
            {about.skills
              .toSorted((a, b) => a.order - b.order)
              .map((category) => (
                <section className="border p-5" key={category.id}>
                  <h3 className="font-mono font-semibold tracking-tight">{category.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </div>
                </section>
              ))}
          </div>
        ) : (
          <div className="border border-dashed p-10 text-center text-sm text-muted-foreground">
            Skills will appear once they are added in the admin panel.
          </div>
        )}
      </SectionShell>

      <SectionShell className="pt-8">
        <SectionHeading>./experience</SectionHeading>
        <div className="grid gap-4">
          {about?.experience.length ? (
            about.experience.map((entry) => (
              <article className="grid gap-3 border p-5 md:grid-cols-[220px_1fr]" key={entry.id}>
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                  {entry.startDate} - {entry.current ? "Present" : entry.endDate}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-mono text-xl font-semibold tracking-tight">{entry.role}</h3>
                    {entry.current ? <Tag>Current</Tag> : null}
                  </div>
                  <p className="mt-1 font-mono font-medium">{entry.company}</p>
                  <p className="mt-3 font-mono text-sm leading-6 text-muted-foreground">{entry.description}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="border border-dashed p-10 text-center text-sm text-muted-foreground">
              Experience entries will appear here.
            </div>
          )}
        </div>
      </SectionShell>

      <SectionShell className="grid gap-12 pt-8 lg:grid-cols-2">
        <section>
          <SectionHeading>./education</SectionHeading>
          <div className="grid gap-3">
            {about?.education.length ? (
              about.education.map((entry) => (
                <article className="border p-5" key={entry.id}>
                  <p className="font-mono font-semibold tracking-tight">{entry.school}</p>
                  <p className="mt-2 font-mono text-sm text-muted-foreground">
                    {entry.degree} · {entry.year}
                  </p>
                </article>
              ))
            ) : (
              <div className="border border-dashed p-10 text-sm text-muted-foreground">Education entries will appear here.</div>
            )}
          </div>
        </section>
        <section>
          <SectionHeading>./links</SectionHeading>
          <div className="flex flex-wrap gap-2">
            <IconButton href={`mailto:${email}`} icon={Mail} label="Email" />
            {socialEntries(about).map((entry) => {
              const Icon = socialIcons[entry.type as keyof typeof socialIcons] ?? Globe;
              return <IconButton href={entry.href} icon={Icon} key={entry.type} label={entry.label} />;
            })}
            {about?.resumeFile?.url ? <IconButton href={about.resumeFile.url} icon={FileDown} label="Resume" /> : null}
          </div>
        </section>
      </SectionShell>
    </>
  );
}
