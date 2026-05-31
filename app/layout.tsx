import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/features/theme/components/providers";
import { getOgImageUrl } from "@/features/portfolio/lib/seo";

export const metadata: Metadata = {
  description: "Public portfolio, projects, writing, and admin-managed profile.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    description: "Public portfolio, projects, writing, and admin-managed profile.",
    images: [{ url: getOgImageUrl() }],
    siteName: "Jimiel Salmon",
    title: "Jimiel Salmon | Portfolio",
    type: "website",
  },
  title: {
    default: "Jimiel Salmon | Portfolio",
    template: "Jimiel Salmon | %s",
  },
  twitter: {
    card: "summary_large_image",
    description: "Public portfolio, projects, writing, and admin-managed profile.",
    images: [{ url: getOgImageUrl() }],
    title: "Jimiel Salmon | Portfolio",
  },
  verification: {
    google: "c1466GaDIlhH7UxbahxYBIMRpkcl0mn3Nly9SyFyJRE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
