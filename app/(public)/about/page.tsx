import type { Metadata } from "next";

import { AboutPage } from "@/features/portfolio/pages/about-page";
import { absoluteUrl, getProfileBio, getProfileName } from "@/features/portfolio/lib/utils";
import { safePublicAbout } from "@/features/portfolio/server/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const about = await safePublicAbout();
  const title = `${getProfileName(about)} | About`;
  const description = getProfileBio(about);

  return {
    alternates: { canonical: absoluteUrl("/about") },
    description,
    openGraph: {
      description,
      images: about?.profilePhoto?.url ? [{ url: about.profilePhoto.url }] : undefined,
      title,
      url: absoluteUrl("/about"),
    },
    title,
  };
}

export default async function PublicAboutPage() {
  const about = await safePublicAbout();
  return <AboutPage initialData={about} />;
}
