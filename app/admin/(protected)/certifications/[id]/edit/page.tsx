import { CertificationFormPage } from "@/features/certifications/components/certification-form-page";

type AdminEditCertificationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditCertificationPage({
  params,
}: AdminEditCertificationPageProps) {
  const { id } = await params;
  return <CertificationFormPage id={id} mode="edit" />;
}
