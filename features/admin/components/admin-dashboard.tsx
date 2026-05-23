import type { Session } from "next-auth";

import { AdminLogoutButton } from "@/features/admin/components/admin-logout-button";

type AdminDashboardProps = {
  session: Session | null;
};

export function AdminDashboard({ session }: AdminDashboardProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8">
        <header className="flex items-center justify-between border-b pb-5">
          <div>
            <p className="text-sm text-muted-foreground">Portfolio admin</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">
              Dashboard
            </h1>
          </div>
          <AdminLogoutButton />
        </header>

        <section className="flex flex-1 items-center">
          <div>
            <p className="text-sm text-muted-foreground">Signed in as</p>
            <p className="mt-1 font-medium">{session?.user?.email}</p>
          </div>
        </section>
      </div>
    </main>
  );
}
