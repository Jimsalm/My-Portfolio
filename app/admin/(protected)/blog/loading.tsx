import { AdminTableRowsSkeleton } from "@/features/portfolio/components/skeletons";

export default function AdminBlogLoading() {
  return (
    <div className="overflow-x-auto border">
      <table className="w-full min-w-[820px] text-sm">
        <tbody>
          <AdminTableRowsSkeleton />
        </tbody>
      </table>
    </div>
  );
}
