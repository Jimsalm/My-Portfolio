"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { MatrixRainBackground } from "@/features/portfolio/components/matrix-rain-background";
import { TerminalMagneticCursor } from "@/features/portfolio/components/terminal-magnetic-cursor";
import { WipBadge } from "@/features/portfolio/components/wip-badge";
import { usePublicAbout } from "@/features/portfolio/hooks/use-public-data";
import { getProfileHandle, getProfileName } from "@/features/portfolio/lib/utils";
import type { PublicAbout } from "@/features/portfolio/types";

const navItems = [
  { href: "/projects", index: "01", label: "WORK" },
  { href: "/blog", index: "02", label: "LOG" },
  { href: "/about", index: "03", label: "WHOAMI" },
];

export function PortfolioShell({
  children,
  initialAbout,
}: Readonly<{ children: React.ReactNode; initialAbout: PublicAbout | null }>) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: about = initialAbout } = usePublicAbout(initialAbout);
  const profileHandle = getProfileHandle(about);
  const profileName = getProfileName(about);

  return (
    <LazyMotion features={domAnimation}>
      <div className="terminal-theme relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <MatrixRainBackground />
        <TerminalMagneticCursor />
        <WipBadge />
        <a className="skip-link" href="#main-content">
          skip to main content
        </a>
        <m.header
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-0 top-0 z-40 border-b bg-background/85 font-mono backdrop-blur"
          initial={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.38, ease: "easeOut" }}
        >
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
            <Link className="inline-flex h-11 items-center text-sm font-semibold tracking-tight" href="/" onClick={() => setIsOpen(false)}>
              {profileHandle}:~$
            </Link>

            <nav className="hidden items-center gap-8 text-sm md:flex">
              {navItems.map((item) => (
                <NavLink
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  href={item.href}
                  key={item.href}
                >
                  <span className="text-muted-foreground">{item.index}</span>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              aria-expanded={isOpen}
              aria-label="Toggle navigation"
              className="inline-flex size-11 items-center justify-center border md:hidden"
              onClick={() => setIsOpen((current) => !current)}
              type="button"
            >
              {isOpen ? <X aria-hidden="true" className="size-4" /> : <Menu aria-hidden="true" className="size-4" />}
            </button>
          </div>

          <div
            className={cn(
              "grid border-t transition-[grid-template-rows] duration-300 md:hidden",
              isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <nav className="overflow-hidden font-mono">
              <div className="mx-auto flex max-w-6xl flex-col px-5 py-3 text-sm">
                {navItems.map((item) => (
                  <Link
                    className={cn(
                      "border-b py-4",
                      pathname === item.href || pathname.startsWith(`${item.href}/`)
                        ? "font-semibold"
                        : "text-muted-foreground",
                    )}
                    href={item.href}
                    key={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="mr-3 text-muted-foreground">{item.index}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </m.header>

        <main className="relative z-10 pt-16" id="main-content">
          {children}
        </main>
        <Footer profileHandle={profileHandle} profileName={profileName} />
      </div>
    </LazyMotion>
  );
}

function NavLink({
  active,
  children,
  href,
}: {
  active: boolean;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Link
      className={cn(
        "relative flex h-11 items-center gap-2 transition-colors hover:text-foreground",
        active ? "font-semibold text-foreground" : "text-muted-foreground",
      )}
      href={href}
    >
      {children}
      {active ? (
        <m.span
          className="absolute inset-x-0 -bottom-px h-px bg-foreground"
          layoutId="portfolio-active-nav"
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      ) : null}
    </Link>
  );
}

function Footer({
  profileHandle,
  profileName,
}: {
  profileHandle: string;
  profileName: string;
}) {
  const year = new Date().getFullYear();

  return (
    <m.footer
      className="relative z-10 border-t bg-background/85 font-mono backdrop-blur"
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      viewport={{ amount: 0.2, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-semibold tracking-tight">{profileHandle}:~/exit$</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {profileName} · Built with Next.js + Convex. Session persisted until {year}.
          </p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <Link className="inline-flex h-11 items-center hover:text-foreground" href="/projects">
            Projects
          </Link>
          <Link className="inline-flex h-11 items-center hover:text-foreground" href="/blog">
            Blog
          </Link>
          <Link className="inline-flex h-11 items-center hover:text-foreground" href="/about">
            About
          </Link>
          <span>© {year}</span>
        </div>
      </div>
    </m.footer>
  );
}
