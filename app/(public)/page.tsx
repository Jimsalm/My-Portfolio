import type { Metadata } from "next";

import { HomePage } from "@/features/portfolio/pages/home-page";
import { buildMetadata } from "@/features/portfolio/lib/seo";
import { safePublicHome } from "@/features/portfolio/server/public-data";

export const revalidate = 60;

export const metadata: Metadata = buildMetadata({
  path: "/",
  title: "Portfolio",
});

export default async function PublicHomePage() {
  const data = await safePublicHome();
  return <HomePage initialData={data} />;
}
