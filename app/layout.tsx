import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/features/theme/components/providers";

export const metadata: Metadata = {
  description: "Public portfolio, projects, writing, and admin-managed profile.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "Portfolio",
    template: "%s",
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
