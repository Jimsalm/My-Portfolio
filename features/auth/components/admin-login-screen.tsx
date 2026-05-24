import { LoginForm } from "@/features/auth/components/login-form";
import { MatrixRainBackground } from "@/features/portfolio/components/matrix-rain-background";

type AdminLoginScreenProps = {
  callbackUrl: string;
};

export function AdminLoginScreen({ callbackUrl }: AdminLoginScreenProps) {
  return (
    <main className="terminal-theme admin-terminal relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-12 font-mono text-foreground">
      <MatrixRainBackground />
      <section className="relative z-10 w-full max-w-md border bg-background/85 p-6 backdrop-blur">
        <div className="mb-8 border-b pb-5">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">$ ssh portfolio-admin</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            sign-in
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            enter credentials to mount the admin filesystem
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl} />
      </section>
    </main>
  );
}
