export const adminRoutes = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog Posts" },
  { href: "/admin/certifications", label: "Certifications" },
  { href: "/admin/about", label: "About/Resume" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export function getAdminRouteLabel(pathname: string) {
  const matchedRoute = [...adminRoutes]
    .sort((a, b) => b.href.length - a.href.length)
    .find((route) =>
      route.href === "/admin"
        ? pathname === route.href
        : pathname.startsWith(route.href),
    );

  return matchedRoute?.label ?? "Dashboard";
}

export function getAdminBreadcrumbs(pathname: string) {
  const segments = pathname
    .replace(/^\/admin\/?/, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return [
      { href: "/admin", label: "Admin" },
      { href: "/admin", label: "Dashboard" },
    ];
  }

  return [
    { href: "/admin", label: "Admin" },
    ...segments.map((segment, index) => {
      const href = `/admin/${segments.slice(0, index + 1).join("/")}`;
      const label =
        adminRoutes.find((route) => route.href === href)?.label ??
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      return { href, label };
    }),
  ];
}
