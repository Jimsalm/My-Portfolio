import { BlogFormPage } from "@/features/cms/blog/blog-form-page";

type AdminEditBlogPostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditBlogPostPage({
  params,
}: AdminEditBlogPostPageProps) {
  const { id } = await params;

  return <BlogFormPage id={id} mode="edit" />;
}
