import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { authOptions } from "@/features/auth/server/auth-options";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    redirect("/admin/login");
  }

  const currentDateLabel = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  return (
    <AdminShell currentDateLabel={currentDateLabel} session={session}>
      {children}
    </AdminShell>
  );
}
