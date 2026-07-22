import type { Metadata } from "next";

import { AboutPage } from "@/features/portfolio/pages/about-page";
import {
  aboutDescription,
  buildMetadata,
  jsonLdScriptProps,
  personJsonLd,
} from "@/features/portfolio/lib/seo";
import { getProfileName } from "@/features/portfolio/lib/utils";
import {
  safePublicAbout,
  safePublicCertifications,
  safePublicSettings,
} from "@/features/portfolio/server/public-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const [about, settings] = await Promise.all([
    safePublicAbout(),
    safePublicSettings(),
  ]);

  return buildMetadata({
    description: aboutDescription(about),
    keywords: [getProfileName(about), "about", "resume", "software engineer"],
    path: "/about",
    settings,
    title: "About",
  });
}

export default async function PublicAboutPage() {
  const [about, certifications] = await Promise.all([
    safePublicAbout(),
    safePublicCertifications(),
  ]);
  return (
    <>
      <script {...jsonLdScriptProps(personJsonLd(about))} />
      <AboutPage initialCertifications={certifications} initialData={about} />
    </>
  );
}
