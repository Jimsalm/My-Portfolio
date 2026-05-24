import { AdminTableRowsSkeleton } from "@/features/portfolio/components/skeletons";

export default function AdminProjectsLoading() {
  return (
    <div className="overflow-x-auto border">
      <table className="w-full min-w-[760px] text-sm">
        <tbody>
          <AdminTableRowsSkeleton />
        </tbody>
      </table>
    </div>
  );
}
