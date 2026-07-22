"use client";

import Link from "next/link";
import { FileDown, Github, Globe, Linkedin, Mail, Twitter } from "lucide-react";
import { m } from "framer-motion";

import { ContactForm } from "@/features/contact/components/contact-form";
import { BlogCard } from "@/features/portfolio/components/blog-card";
import { CertificationSection } from "@/features/portfolio/components/certification-section";
import { ProjectCard } from "@/features/portfolio/components/project-card";
import { EditorPanel, IconButton, SectionHeading, SectionShell, TerminalPanel, TextButton } from "@/features/portfolio/components/ui-atoms";
import { usePublicHome } from "@/features/portfolio/hooks/use-public-data";
import { fadeUp, motionTransition, staggerContainer } from "@/features/portfolio/lib/motion";
import {
  getProfileBio,
  getProfileEmail,
  getProfileHandle,
  getProfileName,
  getProfileRole,
  socialEntries,
} from "@/features/portfolio/lib/utils";
import type { PublicHomeData } from "@/features/portfolio/types";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
};

export function HomePage({ initialData }: { initialData: PublicHomeData }) {
  const { data = initialData } = usePublicHome(initialData);
  const about = data.about;
  const name = getProfileName(about);
  const role = getProfileRole(about);
  const bio = getProfileBio(about);
  const email = getProfileEmail(about);
  const handle = getProfileHandle(about);
  const sessionInfoLines = [
    <>
      <span className="text-muted-foreground">export const</span> profile = {"{"}
    </>,
    <>
      {"  "}role: <span className="text-muted-foreground">{JSON.stringify(role)}</span>,
    </>,
    <>
      {"  "}status: <span className="text-muted-foreground">&quot;available for selected work&quot;</span>,
    </>,
    <>
      {"  "}email: <span className="text-muted-foreground">{JSON.stringify(email)}</span>,
    </>,
    <>{"} as const;"}</>,
  ];

  return (
    <>
      <SectionShell className="flex min-h-[calc(100vh-4rem)] items-center">
        <m.div
          animate="visible"
          className="grid w-full gap-8 lg:grid-cols-[1fr_420px] lg:items-end"
          initial="hidden"
          transition={motionTransition}
          variants={staggerContainer}
        >
          <m.div variants={fadeUp}>
            <p className="font-mono text-sm text-muted-foreground">{handle}:~$ whoami</p>
            <h1 className="mt-6 font-mono text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
              {name}
              <span className="animate-pulse text-muted-foreground">_</span>
            </h1>
            <p className="mt-7 font-mono text-xl font-medium text-foreground md:text-3xl">
              <span aria-hidden="true">{"// "}</span>
              {role}
            </p>
            <p className="mt-6 max-w-2xl font-mono text-sm leading-8 text-muted-foreground md:text-base">
              {bio}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <TextButton href="/projects">cd ./work</TextButton>
              <TextButton href="/blog" variant="secondary">
                tail -f writing.log
              </TextButton>
            </div>
          </m.div>
          <m.div variants={fadeUp}>
            <EditorPanel fileName="session.info.ts" lines={sessionInfoLines} />
          </m.div>
        </m.div>
      </SectionShell>

      <SectionShell>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading description="published=true && featured=true | limit=3">
            ./selected-work
          </SectionHeading>
          <Link className="mb-11 hidden font-mono text-sm font-medium hover:underline md:block" href="/projects">
            ls ./work
          </Link>
        </div>
        {data.featuredProjects.length > 0 ? (
          <m.div
            animate="visible"
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            variants={staggerContainer}
          >
            {data.featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </m.div>
        ) : (
          <div className="border border-dashed p-10 text-center text-sm text-muted-foreground">
            No featured projects are published yet.
          </div>
        )}
        <Link className="mt-8 inline-flex text-sm font-medium hover:underline md:hidden" href="/projects">
          ls ./work
        </Link>
      </SectionShell>

      <SectionShell>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading description="status=published | sort=publishedAt.desc | limit=3">
            ./latest-writing
          </SectionHeading>
          <Link className="mb-11 hidden font-mono text-sm font-medium hover:underline md:block" href="/blog">
            cat ./writing
          </Link>
        </div>
        {data.latestPosts.length > 0 ? (
          <m.div
            animate="visible"
            className="grid gap-6 md:grid-cols-3"
            initial="hidden"
            variants={staggerContainer}
          >
            {data.latestPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </m.div>
        ) : (
          <div className="border border-dashed p-10 text-center text-sm text-muted-foreground">
            No blog posts are published yet.
          </div>
        )}
        <Link className="mt-8 inline-flex text-sm font-medium hover:underline md:hidden" href="/blog">
          cat ./writing
        </Link>
      </SectionShell>

      {data.featuredCertifications.length ? (
        <SectionShell>
          <CertificationSection
            certifications={data.featuredCertifications}
            description="status=published && featured=true | limit=3"
          />
        </SectionShell>
      ) : null}

      <SectionShell className="pb-28">
        <SectionHeading description="secure endpoint · resend email · protected by rate limit">
          ./contact
        </SectionHeading>
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <TerminalPanel title="contact.sh">
            <p className="font-mono text-sm text-muted-foreground">{handle}:~/contact$ ./open-channel</p>
            <h2 className="mt-5 max-w-3xl font-mono text-4xl font-semibold tracking-tight md:text-5xl">
              let&apos;s build something careful.
            </h2>
            <p className="mt-5 max-w-2xl font-mono text-sm leading-7 text-muted-foreground">
              Have a product, portfolio, or system that needs clean engineering? Send the brief here and it lands in my inbox.
            </p>
            <a className="mt-8 inline-flex break-all font-mono text-xl font-semibold tracking-tight hover:underline md:text-3xl" href={`mailto:${email}`}>
              mailto:{email}
            </a>
            <div className="mt-8 flex flex-wrap gap-2">
              <IconButton href={`mailto:${email}`} icon={Mail} label="Email" />
              {socialEntries(about).map((entry) => {
                const Icon = socialIcons[entry.type as keyof typeof socialIcons] ?? Globe;
                return <IconButton href={entry.href} icon={Icon} key={entry.type} label={entry.label} />;
              })}
              {about?.resumeFile?.url ? <IconButton href={about.resumeFile.url} icon={FileDown} label="Resume" /> : null}
            </div>
          </TerminalPanel>
          <ContactForm />
        </div>
      </SectionShell>
    </>
  );
}
