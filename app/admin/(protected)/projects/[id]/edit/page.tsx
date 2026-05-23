import { ProjectFormPage } from "@/features/cms/projects/project-form-page";

type AdminEditProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProjectPage({
  params,
}: AdminEditProjectPageProps) {
  const { id } = await params;

  return <ProjectFormPage id={id} mode="edit" />;
}
