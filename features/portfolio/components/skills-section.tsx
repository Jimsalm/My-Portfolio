"use client";

import { m, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  getVisibleSkillIconColor,
  SkillIcon,
} from "@/features/portfolio/components/skill-icon";
import { motionTransition } from "@/features/portfolio/lib/motion";
import type { PublicAbout } from "@/features/portfolio/types";

type SkillCategory = PublicAbout["skills"][number];
type SkillItem = SkillCategory["skills"][number];
type RuntimeSkillCategory = Omit<SkillCategory, "skills"> & {
  skills: Array<SkillItem | string>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeSkillItem(value: SkillItem | string, index: number): SkillItem {
  if (typeof value !== "string") {
    return {
      brandColor: value.brandColor ?? "",
      iconSlug: value.iconSlug ?? "",
      id: value.id || `${slugify(value.name) || "skill"}-${index}`,
      name: value.name,
    };
  }

  const name = value.trim();

  return {
    brandColor: "",
    iconSlug: "",
    id: `${slugify(name) || "skill"}-${index}`,
    name,
  };
}

function normalizeSkillCategory(category: RuntimeSkillCategory, index: number): SkillCategory {
  return {
    ...category,
    id: category.id || `${slugify(category.name) || "skills"}-${index}`,
    order: category.order ?? index,
    skills: category.skills.map((skill, skillIndex) => normalizeSkillItem(skill, skillIndex)),
  };
}

function useTypewriter(text: string, active: boolean, delay = 0, speed = 28) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduceMotion || !active || count >= text.length) {
      return;
    }

    const timeout = setTimeout(() => {
      setCount((currentCount) => Math.min(currentCount + 1, text.length));
    }, count === 0 ? delay : speed);

    return () => {
      clearTimeout(timeout);
    };
  }, [active, count, delay, reduceMotion, speed, text.length]);

  return reduceMotion ? text : text.slice(0, count);
}

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");

  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) {
    return `rgba(255,255,255,${alpha})`;
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${red},${green},${blue},${alpha})`;
}

function TerminalCursor({ active }: { active: boolean }) {
  return active ? (
    <span
      aria-hidden="true"
      className="ml-1 inline-block h-[1em] w-2 animate-pulse bg-foreground align-[-0.12em]"
    />
  ) : null;
}

function SkillTile({
  inView,
  item,
  itemIndex,
}: {
  inView: boolean;
  item: SkillItem;
  itemIndex: number;
}) {
  const color = getVisibleSkillIconColor(item.name, item.iconSlug, item.brandColor);
  const glow = hexToRgba(color, 0.25);

  return (
    <m.li
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82 }}
      className="group flex min-h-24 flex-col items-center justify-center border bg-background/90 p-3 text-center transition-colors duration-300 hover:border-foreground focus-within:border-foreground"
      initial={{ opacity: 0, scale: 0.82 }}
      style={{ boxShadow: "0 0 0 rgba(255,255,255,0)" }}
      transition={{ delay: itemIndex * 0.05, duration: 0.25, ease: "easeOut" }}
      whileHover={{ boxShadow: `0 0 12px ${glow}`, scale: 1.08 }}
    >
      <SkillIcon
        className="filter grayscale brightness-150 transition duration-300 group-hover:grayscale-0 group-hover:brightness-100"
        color={color}
        iconSlug={item.iconSlug}
        name={item.name}
        size={40}
      />
      <span className="mt-3 max-w-full break-words font-mono text-[11px] uppercase leading-4 text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        {item.name}
      </span>
    </m.li>
  );
}

function SkillCategoryCard({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });

  return (
    <m.section
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
      className="border bg-background/90 p-5 font-mono transition-colors hover:border-foreground"
      initial={{ opacity: 0, y: 18 }}
      ref={ref}
      transition={{ ...motionTransition, delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
        <span className="text-xs text-muted-foreground">
          {category.skills.length.toString().padStart(2, "0")} items
        </span>
      </div>
      {category.skills.length ? (
        <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {category.skills.map((item, itemIndex) => (
            <SkillTile
              inView={inView}
              item={item}
              itemIndex={itemIndex}
              key={`${item.id}-${item.name}-${itemIndex}`}
            />
          ))}
        </ul>
      ) : (
        <div className="mt-5 border border-dashed p-6 text-center text-sm text-muted-foreground">
          No skill items yet.
        </div>
      )}
    </m.section>
  );
}

export function SkillsSection({ categories }: { categories: RuntimeSkillCategory[] }) {
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { amount: 0.2, once: true });
  const label = useTypewriter("$ PORTFOLIO --SECTION", inView, 40, 10);
  const title = useTypewriter("./skills", inView, 220, 22);
  const sortedCategories = useMemo(
    () =>
      categories
        .map((category, index) => normalizeSkillCategory(category, index))
        .sort((left, right) => left.order - right.order),
    [categories],
  );
  const labelDone = label.length >= "$ PORTFOLIO --SECTION".length;
  const titleDone = title.length >= "./skills".length;

  return (
    <section className="space-y-8" ref={ref}>
      <div className="font-mono">
        <p
          aria-label="$ PORTFOLIO --SECTION"
          className="min-h-5 text-xs uppercase text-muted-foreground"
        >
          {label}
          <TerminalCursor active={inView && !labelDone} />
        </p>
        <h2 aria-label="./skills" className="mt-3 text-4xl font-semibold text-foreground md:text-6xl">
          {title}
          <TerminalCursor active={inView && labelDone && !titleDone} />
        </h2>
      </div>

      {sortedCategories.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {sortedCategories.map((category, index) => (
            <SkillCategoryCard category={category} index={index} key={category.id} />
          ))}
        </div>
      ) : (
        <div className="border border-dashed p-10 text-center font-mono text-sm text-muted-foreground">
          Skills will appear once they are added in the admin panel.
        </div>
      )}
    </section>
  );
}
