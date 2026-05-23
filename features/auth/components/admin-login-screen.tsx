import { LoginForm } from "@/features/auth/components/login-form";

type AdminLoginScreenProps = {
  callbackUrl: string;
};

export function AdminLoginScreen({ callbackUrl }: AdminLoginScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground">
      <section className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground">Portfolio admin</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-normal">
            Sign in
          </h1>
        </div>
        <LoginForm callbackUrl={callbackUrl} />
      </section>
    </main>
  );
}
