"use client";

import { useRef, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Clock3 } from "lucide-react";
import { m, useInView } from "framer-motion";
import ReactMarkdown from "react-markdown";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";

import { cn } from "@/lib/utils";
import type { PublicAbout } from "@/features/portfolio/types";

type ExperienceEntry = PublicAbout["experience"][number];

const descriptionLimit = 320;

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), ["target"], ["rel"], ["className"]],
  },
};

const monthIndexes: Map<string, number> = new Map(
  [
    ["jan", 0],
    ["january", 0],
    ["feb", 1],
    ["february", 1],
    ["mar", 2],
    ["march", 2],
    ["apr", 3],
    ["april", 3],
    ["may", 4],
    ["jun", 5],
    ["june", 5],
    ["jul", 6],
    ["july", 6],
    ["aug", 7],
    ["august", 7],
    ["sep", 8],
    ["sept", 8],
    ["september", 8],
    ["oct", 9],
    ["october", 9],
    ["nov", 10],
    ["november", 10],
    ["dec", 11],
    ["december", 11],
  ] as const,
);

export function ExperienceTimeline({ entries }: { entries: ExperienceEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20% 0px -20% 0px", once: true });

  if (!entries.length) {
    return (
      <div className="border border-dashed p-10 text-center font-mono text-sm text-muted-foreground">
        Experience entries will appear here.
      </div>
    );
  }

  return (
    <div className="relative" data-experience-timeline="true" ref={containerRef}>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-3 top-0 w-px bg-foreground/20 md:left-1/2"
      />
      <m.div
        aria-hidden="true"
        animate={{ scaleY: isInView ? 1 : 0 }}
        className="absolute bottom-0 left-3 top-0 w-px origin-top bg-foreground md:left-1/2"
        initial={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />

      <div className="grid gap-8">
        {entries.map((entry, index) => (
          <TimelineItem entry={entry} index={index} key={entry.id} />
        ))}
      </div>
    </div>
  );
}

function TimelineItem({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const itemRef = useRef<HTMLElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isInView = useInView(itemRef, { margin: "-12% 0px -12% 0px", once: true });
  const isRightSide = index % 2 === 0;
  const dateRange = formatDateRange(entry);
  const duration = calculateDuration(entry.startDate, entry.endDate, entry.current);
  const isLongDescription = entry.description.length > descriptionLimit;
  const slideX = isRightSide ? 36 : -36;

  return (
    <div className="relative grid gap-4 pl-10 md:grid-cols-[minmax(0,1fr)_3rem_minmax(0,1fr)] md:pl-0">
      <span
        aria-hidden="true"
        data-timeline-node="true"
        className={cn(
          "absolute left-3 top-8 z-10 size-3 -translate-x-1/2 border border-foreground md:left-1/2",
          entry.current ? "bg-foreground" : "bg-background",
        )}
      />

      <m.article
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: slideX }}
        className={cn(
          "group border bg-background/90 p-5 font-mono transition-colors hover:border-foreground",
          isRightSide ? "md:col-start-3" : "md:col-start-1",
        )}
        initial={{ opacity: 0, x: slideX }}
        ref={itemRef}
        transition={{ delay: index * 0.15, duration: 0.45, ease: "easeOut" }}
        whileHover={{ y: -2 }}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-3.5" />
            {dateRange}
          </span>
          {duration ? (
            <span className="inline-flex items-center gap-2">
              <Clock3 aria-hidden="true" className="size-3.5" />
              {duration}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">{entry.company}</h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">{entry.role}</p>
          </div>
          {entry.current ? (
            <span className="border border-foreground bg-foreground px-2 py-1 text-[11px] uppercase tracking-[0.14em] text-background">
              Current
            </span>
          ) : null}
        </div>

        <div
          className={cn(
            "mt-5 space-y-3",
            isLongDescription && !isExpanded
              ? "overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]"
              : "",
          )}
        >
          <ExperienceMarkdown content={entry.description} />
        </div>

        {isLongDescription ? (
          <button
            aria-expanded={isExpanded}
            className="mt-4 inline-flex min-h-11 items-center gap-2 border px-3 text-sm transition-colors hover:border-foreground hover:bg-muted"
            onClick={() => setIsExpanded((current) => !current)}
            type="button"
          >
            <BriefcaseBusiness aria-hidden="true" className="size-4" />
            {isExpanded ? "collapse" : "read more"}
          </button>
        ) : null}
      </m.article>
    </div>
  );
}

function ExperienceMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ children, ...props }) => (
          <a className="border-b border-foreground font-medium" rel="noreferrer" target="_blank" {...props}>
            {children}
          </a>
        ),
        code: ({ children }) => <code className="border bg-muted px-1.5 py-0.5 text-sm">{children}</code>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        p: ({ children }) => <p className="text-sm leading-7 text-muted-foreground">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
        ul: ({ children }) => <ul className="ml-5 list-disc space-y-2 text-sm text-muted-foreground">{children}</ul>,
      }}
      rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
    >
      {content}
    </ReactMarkdown>
  );
}

function formatDateRange(entry: ExperienceEntry) {
  const start = formatTimelineDate(entry.startDate);
  const end = entry.current ? "Present" : formatTimelineDate(entry.endDate);

  return `${start} — ${end || entry.endDate || "Present"}`;
}

function formatTimelineDate(value: string) {
  const parsed = parseTimelineDate(value);

  if (!parsed) {
    return value;
  }

  if (parsed.precision === "year") {
    return String(parsed.date.getUTCFullYear());
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(parsed.date);
}

function calculateDuration(startDate: string, endDate: string, current: boolean) {
  const start = parseTimelineDate(startDate);
  const end = current ? dateToTimelineParts(new Date()) : parseTimelineDate(endDate);

  if (!start || !end) {
    return "";
  }

  const totalMonths =
    (end.date.getUTCFullYear() - start.date.getUTCFullYear()) * 12 +
    end.date.getUTCMonth() -
    start.date.getUTCMonth();

  if (totalMonths < 0) {
    return "";
  }

  const normalizedMonths = Math.max(1, totalMonths);
  const years = Math.floor(normalizedMonths / 12);
  const months = normalizedMonths % 12;
  const parts = [];

  if (years > 0) {
    parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  }

  if (months > 0) {
    parts.push(`${months} ${months === 1 ? "mo" : "mos"}`);
  }

  return parts.join(" ");
}

function parseTimelineDate(value: string) {
  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  const yearOnly = normalized.match(/^(\d{4})$/);
  if (yearOnly) {
    return dateToTimelineParts(new Date(Date.UTC(Number(yearOnly[1]), 0, 1)), "year");
  }

  const yearMonth = normalized.match(/^(\d{4})-(\d{2})$/);
  if (yearMonth) {
    const month = Number(yearMonth[2]);
    if (month >= 1 && month <= 12) {
      return dateToTimelineParts(new Date(Date.UTC(Number(yearMonth[1]), month - 1, 1)));
    }
  }

  const fullDate = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (fullDate) {
    const year = Number(fullDate[1]);
    const month = Number(fullDate[2]);
    const day = Number(fullDate[3]);
    const date = new Date(Date.UTC(year, month - 1, day));

    if (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    ) {
      return dateToTimelineParts(date);
    }
  }

  const monthYear = normalized.match(/^([a-z]+)\s+(\d{4})$/i);
  if (monthYear) {
    const month = monthIndexes.get(monthYear[1].toLowerCase());
    if (month !== undefined) {
      return dateToTimelineParts(new Date(Date.UTC(Number(monthYear[2]), month, 1)));
    }
  }

  return null;
}

function dateToTimelineParts(date: Date, precision: "month" | "year" = "month") {
  return { date, precision };
}
