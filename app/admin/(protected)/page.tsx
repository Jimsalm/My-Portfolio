import { Suspense } from "react";

import {
  AdminDashboard,
  AdminDashboardSkeleton,
} from "@/features/admin/components/admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboard />
    </Suspense>
  );
}
