import type { Metadata } from "next";

import { AboutPage } from "@/features/portfolio/pages/about-page";
import {
  aboutDescription,
  buildMetadata,
  jsonLdScriptProps,
  personJsonLd,
} from "@/features/portfolio/lib/seo";
import { getProfileName } from "@/features/portfolio/lib/utils";
import { safePublicAbout } from "@/features/portfolio/server/public-data";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const about = await safePublicAbout();

  return buildMetadata({
    description: aboutDescription(about),
    keywords: [getProfileName(about), "about", "resume", "software engineer"],
    path: "/about",
    title: `${getProfileName(about)} About`,
  });
}

export default async function PublicAboutPage() {
  const about = await safePublicAbout();
  return (
    <>
      <script {...jsonLdScriptProps(personJsonLd(about))} />
      <AboutPage initialData={about} />
    </>
  );
}
