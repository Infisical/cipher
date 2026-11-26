import * as React from "react";

import { cn, truncateTitle } from "../lib/utils";
import { TitleCount } from "./badge";
import { Icon, type IconSource } from "./icon";
import { Spinner } from "./spinner";

import styles from "./text.module.css";

type TextProps = React.ComponentPropsWithoutRef<"p"> & {
  muted?: boolean;
  /** Keeps the line breaks and spaces in user-entered text, such as notes, and still wraps long lines. */
  preWrap?: boolean;
  /** Keeps the text on one line and ends it in an ellipsis, with a string child as its title. */
  truncate?: boolean;
} & { ref?: React.Ref<HTMLParagraphElement> };

export function Text({
  muted = false,
  preWrap = false,
  truncate = false,
  title,
  className,
  ref,
  ...props
}: TextProps) {
  return (
    <p
      ref={ref}
      data-slot="text"
      title={truncateTitle(truncate, title, props.children)}
      className={cn(
        styles.text,
        muted && styles.muted,
        preWrap && styles.preWrap,
        truncate && styles.endTruncate,
        className
      )}
      {...props}
    />
  );
}
Text.displayName = "Text";
export function SmallText({
  muted = false,
  preWrap = false,
  truncate = false,
  title,
  className,
  ref,
  ...props
}: TextProps) {
  return (
    <p
      ref={ref}
      data-slot="small-text"
      title={truncateTitle(truncate, title, props.children)}
      className={cn(
        styles.small,
        muted && styles.muted,
        preWrap && styles.preWrap,
        truncate && styles.endTruncate,
        className
      )}
      {...props}
    />
  );
}
SmallText.displayName = "SmallText";

export function Heading({
  level = 2,
  size = "section",
  count,
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"h2"> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: "page" | "display" | "section" | "subsection";
  /** Shown right after the title, as List's countPlacement="title" shows it. A number or string becomes the accent Count. */
  count?: React.ReactNode;
} & { ref?: React.Ref<HTMLHeadingElement> }) {
  const Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = `h${level}`;
  return (
    <Tag
      ref={ref}
      data-slot="heading"
      data-size={size}
      className={cn(styles.heading, className)}
      {...props}
    >
      {count == null ? (
        children
      ) : (
        <TitleCount count={count} wrap>
          {children}
        </TitleCount>
      )}
    </Tag>
  );
}
Heading.displayName = "Heading";
export function Meta({
  mono = true,
  truncate = false,
  title,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & { mono?: boolean; truncate?: boolean } & {
  ref?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <span
      ref={ref}
      data-slot="meta"
      title={truncateTitle(truncate, title, props.children)}
      className={cn(styles.meta, mono && styles.mono, truncate && styles.endTruncate, className)}
      {...props}
    />
  );
}
Meta.displayName = "Meta";

/** A compact uppercase group label, such as WHEN or CONDITIONS above a block of rules. */
export function Eyebrow({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"p"> & { ref?: React.Ref<HTMLParagraphElement> }) {
  return <p ref={ref} data-slot="eyebrow" className={cn(styles.eyebrow, className)} {...props} />;
}
Eyebrow.displayName = "Eyebrow";

export function StatusText({
  tone = "neutral",
  size,
  icon,
  loading = false,
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  tone?: "neutral" | "ok" | "warn" | "bad";
  /** sm sets small text and md body text; without it the status inherits the surrounding type, so set it inside a Heading or a stat value. */
  size?: "sm" | "md";
  icon?: IconSource;
  loading?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <span
      ref={ref}
      data-slot="status-text"
      data-tone={tone}
      data-size={size}
      data-loading={loading || undefined}
      className={cn(styles.status, className)}
      {...props}
    >
      {loading ? <Spinner /> : icon && <Icon icon={icon} />}
      <span>{children}</span>
    </span>
  );
}
StatusText.displayName = "StatusText";

/**
 * Marks every case-insensitive occurrence of query in text as a search match. The query is literal
 * text, never a pattern; terms matches each whitespace-separated word on its own.
 */
export function Highlight({
  text,
  query,
  terms = false,
  className
}: {
  text: string;
  query?: string;
  terms?: boolean;
  className?: string;
}) {
  const needles = (terms ? (query ?? "").split(/\s+/) : [(query ?? "").trim() && (query ?? "")])
    .map((needle) => needle.toLowerCase())
    .filter(Boolean);
  const lower = text.toLowerCase();
  const ranges = needles
    .flatMap((needle) => {
      const found: [number, number][] = [];
      for (let at = lower.indexOf(needle); at >= 0; at = lower.indexOf(needle, at + 1))
        found.push([at, at + needle.length]);
      return found;
    })
    .sort((a, b) => a[0] - b[0])
    .reduce<[number, number][]>((merged, range) => {
      const last = merged.at(-1);
      if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
      else merged.push([...range]);
      return merged;
    }, []);
  if (!ranges.length || lower.length !== text.length) return text;
  const parts: React.ReactNode[] = [];
  let from = 0;
  ranges.forEach(([start, end]) => {
    if (start > from) parts.push(text.slice(from, start));
    parts.push(
      <mark key={start} data-slot="highlight" className={cn(styles.highlight, className)}>
        {text.slice(start, end)}
      </mark>
    );
    from = end;
  });
  if (from < text.length) parts.push(text.slice(from));
  return parts;
}
