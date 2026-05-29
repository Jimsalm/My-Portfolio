import type { PublicAbout, PublicBlogPost, PublicProject } from "@/features/portfolio/types";

export const defaultProfile = {
  email: "hello@example.com",
  fullName: "Jimiel Salmon",
  role: "Full Stack Developer",
  shortBio: "Building thoughtful web experiences with clean systems and careful details.",
};

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function formatDisplayDate(value: number | null | undefined) {
  if (!value) {
    return "Unscheduled";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getProfileName(about: PublicAbout | null | undefined) {
  return about?.fullName || defaultProfile.fullName;
}

export function getProfileRole(about: PublicAbout | null | undefined) {
  return about?.role || defaultProfile.role;
}

export function getProfileBio(about: PublicAbout | null | undefined) {
  return about?.shortBio || defaultProfile.shortBio;
}

export function getProfileEmail(about: PublicAbout | null | undefined) {
  return about?.email || defaultProfile.email;
}

export function getProfileHandle(about: PublicAbout | null | undefined) {
  const email = about?.email?.trim();

  if (email) {
    return email.toLowerCase();
  }

  return getProfileName(about).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function uniqueProjectTags(projects: PublicProject[]) {
  return Array.from(new Set(projects.flatMap((project) => project.techStack))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function uniqueBlogTags(posts: PublicBlogPost[]) {
  return Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function socialEntries(about: PublicAbout | null | undefined) {
  const links = about?.socialLinks;
  return [
    { href: links?.github ?? "", label: "GitHub", type: "github" },
    { href: links?.linkedin ?? "", label: "LinkedIn", type: "linkedin" },
    { href: links?.twitter ?? "", label: "Twitter/X", type: "twitter" },
    { href: links?.website ?? "", label: "Website", type: "website" },
  ].filter((entry) => entry.href);
}
