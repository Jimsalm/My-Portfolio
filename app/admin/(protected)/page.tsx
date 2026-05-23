import { getServerSession } from "next-auth";

import { AdminDashboard } from "@/features/admin/components/admin-dashboard";
import { authOptions } from "@/features/auth/server/auth-options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return <AdminDashboard session={session} />;
}
