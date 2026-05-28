import type { CSSProperties } from "react";
import {
  siAngular,
  siApollographql,
  siAppwrite,
  siAstro,
  siAxios,
  siBootstrap,
  siBun,
  siC,
  siCloudflare,
  siConvex,
  siCplusplus,
  siCss,
  siCypress,
  siDeno,
  siDocker,
  siDotnet,
  siEslint,
  siExpress,
  siFigma,
  siFirebase,
  siFramer,
  siGit,
  siGithub,
  siGitlab,
  siGo,
  siGraphql,
  siHtml5,
  siJavascript,
  siJest,
  siJsonwebtokens,
  siKnexdotjs,
  siLaravel,
  siLinux,
  siMongodb,
  siMysql,
  siNestjs,
  siNetlify,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siOpenapiinitiative,
  siPhp,
  siPostgresql,
  siPostman,
  siPrettier,
  siPrisma,
  siPython,
  siReact,
  siRedux,
  siRender,
  siShadcnui,
  siSqlite,
  siSupabase,
  siSvelte,
  siSwagger,
  siTailwindcss,
  siTanstack,
  siTurborepo,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
  siVuedotjs,
  siWebpack,
  siZod,
  type SimpleIcon,
} from "simple-icons";

import { cn } from "@/lib/utils";

const iconsByLookup = new Map<string, SimpleIcon>();

const curatedIcons = [
  siAngular,
  siApollographql,
  siAppwrite,
  siAstro,
  siAxios,
  siBootstrap,
  siBun,
  siC,
  siCloudflare,
  siConvex,
  siCplusplus,
  siCss,
  siCypress,
  siDeno,
  siDocker,
  siDotnet,
  siEslint,
  siExpress,
  siFigma,
  siFirebase,
  siFramer,
  siGit,
  siGithub,
  siGitlab,
  siGo,
  siGraphql,
  siHtml5,
  siJavascript,
  siJest,
  siJsonwebtokens,
  siKnexdotjs,
  siLaravel,
  siLinux,
  siMongodb,
  siMysql,
  siNestjs,
  siNetlify,
  siNextdotjs,
  siNodedotjs,
  siNpm,
  siOpenapiinitiative,
  siPhp,
  siPostgresql,
  siPostman,
  siPrettier,
  siPrisma,
  siPython,
  siReact,
  siRedux,
  siRender,
  siShadcnui,
  siSqlite,
  siSupabase,
  siSvelte,
  siSwagger,
  siTailwindcss,
  siTanstack,
  siTurborepo,
  siTypescript,
  siVercel,
  siVite,
  siVitest,
  siVuedotjs,
  siWebpack,
  siZod,
] satisfies SimpleIcon[];

for (const icon of curatedIcons) {
  iconsByLookup.set(normalizeIconLookup(icon.slug), icon);
  iconsByLookup.set(normalizeIconLookup(icon.title), icon);
}

registerAliasLookups("apollo", "apollographql", "apollo graphql");
registerAliasLookups("cplusplus", "c++", "cpp");
registerAliasLookups("css", "css3");
registerAliasLookups("dotnet", ".net", "c#", "csharp");
registerAliasLookups("express", "express.js", "expressjs");
registerAliasLookups("framer", "framer motion", "framermotion");
registerAliasLookups("github", "github actions");
registerAliasLookups("graphql", "graphql api");
registerAliasLookups("html5", "html");
registerAliasLookups("jsonwebtokens", "jwt");
registerAliasLookups("knexdotjs", "knex", "knex.js", "knexjs");
registerAliasLookups("mongodb", "mongo", "mongodb atlas");
registerAliasLookups("nextdotjs", "next", "next.js", "nextjs");
registerAliasLookups("nodedotjs", "node", "node.js", "nodejs");
registerAliasLookups("postgresql", "postgres");
registerAliasLookups("react", "react.js", "reactjs");
registerAliasLookups("render", "render.com");
registerAliasLookups("shadcnui", "shadcn", "shadcn/ui");
registerAliasLookups("sqlite", "sql");
registerAliasLookups("tailwindcss", "tailwind", "tailwind css");
registerAliasLookups("tanstack", "react query", "tanstack query", "tanstack query v5");
registerAliasLookups("typescript", "ts");
registerAliasLookups("vuedotjs", "vue", "vue.js", "vuejs");
registerAliasLookups("openapiinitiative", "api", "rest", "rest api", "restapi");

function registerAliasLookups(iconLookup: string, ...aliases: string[]) {
  const icon = iconsByLookup.get(normalizeIconLookup(iconLookup));

  if (!icon) {
    return;
  }

  for (const alias of aliases) {
    iconsByLookup.set(normalizeIconLookup(alias), icon);
  }
}

function normalizeIconLookup(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\+/g, "plus")
    .replace(/#/g, "sharp")
    .replace(/\./g, "dot")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

function normalizeHex(value?: string) {
  const trimmed = value?.trim() ?? "";

  if (!trimmed) {
    return "";
  }

  const withoutHash = trimmed.replace(/^#/, "");
  return /^([0-9a-fA-F]{6})$/.test(withoutHash) ? `#${withoutHash.toUpperCase()}` : "";
}

function ensureVisibleColor(value: string) {
  const color = normalizeHex(value);

  if (!color) {
    return "#FFFFFF";
  }

  return ["#000000", "#010101", "#111111"].includes(color) ? "#FFFFFF" : color;
}

function initialsForSkill(name: string) {
  if (["visualstudiocode", "vscode"].includes(normalizeIconLookup(name))) {
    return "VS";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length > 1) {
    return parts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return name.replace(/[^a-z0-9]/gi, "").slice(0, 2).toUpperCase() || "--";
}

export function resolveSkillIcon(name: string, iconSlug?: string) {
  const lookups = [iconSlug, name].filter(Boolean) as string[];

  for (const lookup of lookups) {
    const icon = iconsByLookup.get(normalizeIconLookup(lookup));

    if (icon) {
      return icon;
    }
  }

  return null;
}

export function getSkillIconColor(name: string, iconSlug?: string, brandColor?: string) {
  const explicitColor = normalizeHex(brandColor);

  if (explicitColor) {
    return explicitColor;
  }

  const icon = resolveSkillIcon(name, iconSlug);
  return icon ? `#${icon.hex}` : "#FFFFFF";
}

export function getVisibleSkillIconColor(name: string, iconSlug?: string, brandColor?: string) {
  return ensureVisibleColor(getSkillIconColor(name, iconSlug, brandColor));
}

export function SkillIcon({
  className,
  color,
  iconSlug,
  name,
  size = 40,
  style,
}: {
  className?: string;
  color?: string;
  iconSlug?: string;
  name: string;
  size?: number;
  style?: CSSProperties;
}) {
  const icon = resolveSkillIcon(name, iconSlug);
  const displayColor = ensureVisibleColor(color ?? getSkillIconColor(name, iconSlug));

  if (!icon) {
    return (
      <span
        aria-label={`${name} icon fallback`}
        className={cn("inline-flex items-center justify-center font-mono text-xs font-semibold", className)}
        role="img"
        style={{ color: displayColor, height: size, width: size, ...style }}
      >
        {initialsForSkill(name)}
      </span>
    );
  }

  return (
    <svg
      aria-label={`${icon.title} icon`}
      className={className}
      height={size}
      role="img"
      style={{ color: displayColor, ...style }}
      viewBox="0 0 24 24"
      width={size}
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  );
}
