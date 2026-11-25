"use client";

import * as React from "react";

import { cn, titleIfClamped } from "../lib/utils";

import styles from "./name-line.module.css";

/** One line of media, name, badges and trailing content. Under pressure the badges give way first (use Badge collapse), then a long name truncates to a 12ch floor, then each badge that no longer fits hides whole; the trailing content always stays whole. The full name shows on hover, or title when given, such as an unabbreviated value. */
export function NameLine({
  media,
  badges,
  trailing,
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  /** A leading icon, logo or avatar. */
  media?: React.ReactNode;
  /** Badges after the name; give each one collapse so they shrink before the name does. */
  badges?: React.ReactNode;
  /** Short content held whole at the line's end, such as a time or a count. */
  trailing?: React.ReactNode;
} & { ref?: React.Ref<HTMLDivElement> }) {
  const nameRef = React.useRef<HTMLSpanElement>(null);
  const mainRef = React.useRef<HTMLSpanElement>(null);
  const badgesRef = React.useRef<HTMLSpanElement>(null);
  const hasBadges = Boolean(badges);
  React.useLayoutEffect(() => {
    const main = mainRef.current;
    const group = badgesRef.current;
    const name = nameRef.current;
    if (!main || !group || !name) return;
    const fit = () => {
      const edge = main.getBoundingClientRect();
      for (const badge of Array.from(group.children)) {
        const box = badge.getBoundingClientRect();
        badge.toggleAttribute(
          "data-clipped",
          box.right > edge.right + 0.5 || box.left < edge.left - 0.5
        );
      }
    };
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(main);
    resize.observe(name);
    const mutation = new MutationObserver(fit);
    mutation.observe(main, { subtree: true, childList: true, characterData: true });
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, [hasBadges]);
  React.useLayoutEffect(() => {
    const name = nameRef.current;
    if (!name) return;
    const measure = () => {
      if ((name.textContent ?? "").length > 12) name.setAttribute("data-floor", "");
      else name.removeAttribute("data-floor");
    };
    measure();
    const observer = new MutationObserver(measure);
    observer.observe(name, {
      subtree: true,
      childList: true,
      characterData: true
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} data-slot="name-line" className={cn(styles.line, className)} {...props}>
      <span ref={mainRef} className={styles.main}>
        {media && (
          <span data-slot="name-line-media" className={styles.media}>
            {media}
          </span>
        )}
        <span
          data-slot="name-line-name"
          ref={nameRef}
          className={styles.name}
          onPointerEnter={
            props.title === undefined ? (event) => titleIfClamped(event.currentTarget) : undefined
          }
        >
          {children}
        </span>
        {badges && (
          <span ref={badgesRef} data-slot="name-line-badges" className={styles.badges}>
            {badges}
          </span>
        )}
      </span>
      {trailing && (
        <span data-slot="name-line-trailing" className={styles.trailing}>
          {trailing}
        </span>
      )}
    </div>
  );
}
NameLine.displayName = "NameLine";
