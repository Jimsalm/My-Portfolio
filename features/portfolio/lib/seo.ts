import type { Metadata } from "next";

import type { PublicAbout, PublicBlogPost, PublicProject } from "@/features/portfolio/types";
import {
  absoluteUrl,
  formatDisplayDate,
  getProfileBio,
  getProfileEmail,
  getProfileName,
  getProfileRole,
  getSiteUrl,
  socialEntries,
} from "@/features/portfolio/lib/utils";

const siteName = "Portfolio";
const defaultDescription = "Portfolio of selected projects, writing, and professional profile.";
const defaultKeywords = ["portfolio", "software engineer", "projects", "blog", "full stack developer"];

type SeoMetadataInput = {
  description?: string;
  image?: string | null;
  keywords?: string[];
  path: string;
  title: string;
  type?: "article" | "website";
};

export function getOgImageUrl(params?: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  const suffix = searchParams.size ? `?${searchParams.toString()}` : "";
  return absoluteUrl(`/og${suffix}`);
}

export function buildMetadata({
  description = defaultDescription,
  image,
  keywords = defaultKeywords,
  path,
  title,
  type = "website",
}: SeoMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedTitle = title === siteName ? siteName : `${title} | ${siteName}`;
  const images = [{ url: image || getOgImageUrl({ title }) }];

  return {
    alternates: { canonical },
    description,
    keywords,
    openGraph: {
      description,
      images,
      siteName,
      title: resolvedTitle,
      type,
      url: canonical,
    },
    title: { absolute: resolvedTitle },
    twitter: {
      card: "summary_large_image",
      description,
      images,
      title: resolvedTitle,
    },
  };
}

export function personJsonLd(about: PublicAbout | null) {
  const socialUrls = socialEntries(about).map((entry) => entry.href);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    email: getProfileEmail(about),
    image: about?.profilePhoto?.url,
    jobTitle: getProfileRole(about),
    name: getProfileName(about),
    sameAs: socialUrls.length ? socialUrls : undefined,
    url: absoluteUrl("/about"),
    worksFor: {
      "@type": "Organization",
      name: "Independent",
    },
  };
}

export function projectJsonLd(project: PublicProject) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    dateModified: new Date(project.updatedAt).toISOString(),
    description: project.description,
    image: project.thumbnail?.url,
    keywords: project.techStack.join(", "),
    name: project.title,
    url: absoluteUrl(`/projects/${project.slug}`),
  };
}

export function articleJsonLd(post: PublicBlogPost, about: PublicAbout | null = null) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    author: {
      "@type": "Person",
      name: getProfileName(about),
      url: getSiteUrl(),
    },
    dateModified: new Date(post.updatedAt).toISOString(),
    datePublished: new Date(post.publishedAt ?? post.updatedAt).toISOString(),
    description: post.excerpt,
    headline: post.title,
    image: post.coverImage?.url,
    keywords: post.tags.join(", "),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    timeRequired: `PT${post.readTime}M`,
  };
}

export function jsonLdScriptProps(data: unknown) {
  return {
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
    type: "application/ld+json",
  };
}

export function aboutDescription(about: PublicAbout | null) {
  return getProfileBio(about);
}

export function postDescription(post: PublicBlogPost) {
  return `${post.excerpt} Published ${formatDisplayDate(post.publishedAt)}.`;
}
