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
    siteName: "Portfolio",
    title: "Portfolio",
    type: "website",
  },
  title: {
    default: "Portfolio",
    template: "%s | Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    description: "Public portfolio, projects, writing, and admin-managed profile.",
    images: [{ url: getOgImageUrl() }],
    title: "Portfolio",
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
