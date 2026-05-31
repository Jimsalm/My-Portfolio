import { HomePage } from "@/features/portfolio/pages/home-page";
import {
  buildMetadata,
  jsonLdScriptProps,
  websiteJsonLd,
} from "@/features/portfolio/lib/seo";
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
  const [data, settings] = await Promise.all([
    safePublicHome(),
    safePublicSettings(),
  ]);

  return (
    <>
      <script {...jsonLdScriptProps(websiteJsonLd(data.about, settings))} />
      <HomePage initialData={data} />
    </>
  );
}
