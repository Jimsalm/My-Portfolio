"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useState } from "react";

export function ConvexClientProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [client] = useState(() => {
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

    if (!convexUrl) {
      throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
    }

    return new ConvexReactClient(convexUrl);
  });

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
