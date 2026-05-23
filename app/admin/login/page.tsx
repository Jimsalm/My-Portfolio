import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { AdminLoginScreen } from "@/features/auth/components/admin-login-screen";
import { authOptions } from "@/features/auth/server/auth-options";

type LoginPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getServerSession(authOptions);
  const { callbackUrl } = await searchParams;
  const safeCallbackUrl =
    callbackUrl?.startsWith("/") && !callbackUrl.startsWith("//")
      ? callbackUrl
      : "/admin";

  if (session) {
    redirect(safeCallbackUrl);
  }

  return <AdminLoginScreen callbackUrl={safeCallbackUrl} />;
}
