import * as React from "react";

import { cn, titleIfClamped } from "../lib/utils";

import styles from "./name-line.module.css";

/** One line of media, name, badges and trailing content. Under pressure the badges give way first (use Badge collapse), then a long name truncates to a 12ch floor, then the badges clip; the trailing content always stays whole. The full name shows on hover. */
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
  return (
    <div
      ref={ref}
      data-slot="name-line"
      className={cn(styles.line, className)}
      {...props}
    >
      <span className={styles.main}>
        {media && (
          <span data-slot="name-line-media" className={styles.media}>
            {media}
          </span>
        )}
        <span
          data-slot="name-line-name"
          data-floor={
            typeof children !== "string" || children.length > 12 || undefined
          }
          className={styles.name}
          onPointerEnter={(event) => titleIfClamped(event.currentTarget)}
        >
          {children}
        </span>
        {badges && <span className={styles.badges}>{badges}</span>}
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
