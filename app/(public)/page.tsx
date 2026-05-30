import { HomePage } from "@/features/portfolio/pages/home-page";
import { buildMetadata } from "@/features/portfolio/lib/seo";
import {
  safePublicHome,
  safePublicSettings,
} from "@/features/portfolio/server/public-data";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await safePublicSettings();

  return buildMetadata({
    path: "/",
    settings,
    title: "Portfolio",
  });
}

export default async function PublicHomePage() {
  const data = await safePublicHome();
  return <HomePage initialData={data} />;
}
