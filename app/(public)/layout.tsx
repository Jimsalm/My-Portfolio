import { PortfolioShell } from "@/features/portfolio/components/portfolio-shell";
import {
  safePublicAbout,
  safePublicSettings,
} from "@/features/portfolio/server/public-data";

export default async function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [about, settings] = await Promise.all([
    safePublicAbout(),
    safePublicSettings(),
  ]);

  return (
    <PortfolioShell initialAbout={about} initialSettings={settings}>
      {children}
    </PortfolioShell>
  );
}
