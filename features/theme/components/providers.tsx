"use client";

import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/features/query/query-provider";

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <QueryProvider>{children}</QueryProvider>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
