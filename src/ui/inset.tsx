import * as React from "react";

import { cn } from "../lib/utils";

import styles from "./inset.module.css";

/**
 * A block inside a framed container (a card, sheet section or frame): tinted fill, inset padding and no border.
 * Use it for every block nested in a frame, such as a resource, a template, a summary tile or a drop target,
 * instead of a bordered Card or frame, so two frames never nest.
 */
export function Inset({
  className,
  hang,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  /** Bleeds the fill out by its own inline padding, so its content shares the content edge with the titles and fields beside it, as in a sheet or dialog section. */
  hang?: boolean;
}) {
  return (
    <div
      ref={ref}
      data-slot="inset"
      data-hang={hang || undefined}
      className={cn(styles.inset, className)}
      {...props}
    />
  );
}
Inset.displayName = "Inset";
