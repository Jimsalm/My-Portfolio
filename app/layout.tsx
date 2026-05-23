import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/features/theme/components/providers";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Personal portfolio admin panel",
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
