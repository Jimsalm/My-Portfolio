import { PortfolioShell } from "@/features/portfolio/components/portfolio-shell";
import { safePublicAbout } from "@/features/portfolio/server/public-data";

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const about = await safePublicAbout();

  return <PortfolioShell initialAbout={about}>{children}</PortfolioShell>;
}
