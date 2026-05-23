import type { Metadata } from "next";

import { HomePage } from "@/features/portfolio/pages/home-page";
import { absoluteUrl } from "@/features/portfolio/lib/utils";
import { safePublicHome } from "@/features/portfolio/server/public-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
  description: "Portfolio of selected projects, writing, and professional profile.",
  openGraph: {
    description: "Portfolio of selected projects, writing, and professional profile.",
    title: "Portfolio",
    url: absoluteUrl("/"),
  },
  title: "Portfolio",
};

export default async function PublicHomePage() {
  const data = await safePublicHome();
  return <HomePage initialData={data} />;
}
