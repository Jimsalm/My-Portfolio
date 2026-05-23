import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/features/auth/server/auth-options";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect("/admin/login");
  }

  return children;
}
