"use client";

import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { ConvexClientProvider } from "@/features/query/convex-provider";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <ConvexClientProvider>{children}</ConvexClientProvider>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
