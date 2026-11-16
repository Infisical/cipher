import * as React from "react";

import { cn, truncateTitle } from "../lib/utils";

import detailStyles from "./detail-layout.module.css";
import paneStyles from "./panes.module.css";
import styles from "./text.module.css";

export function PageMeasure({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="page-measure"
      className={cn(styles.measurePage, className)}
      {...props}
    />
  );
}
PageMeasure.displayName = "PageMeasure";
export function FormMeasure({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="form-measure"
      className={cn(styles.measureForm, className)}
      {...props}
    />
  );
}
FormMeasure.displayName = "FormMeasure";

export type LayoutGap = 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 48;
type LayoutProps = React.ComponentPropsWithoutRef<"div"> & {
  gap?: LayoutGap;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
};
const spacing = (gap: LayoutGap) =>
  gap === 0 ? 0 : `var(--cipher-space-${gap})`;
const alignment = (align: LayoutProps["align"] | "baseline") =>
  align === "start" ? "flex-start" : align === "end" ? "flex-end" : align;
export function Stack({
  gap = 16,
  align = "stretch",
  justify = "start",
  style,
  className,
  ref,
  ...props
}: LayoutProps & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="stack"
      className={cn(styles.stack, className)}
      style={{
        gap: spacing(gap),
        alignItems: alignment(align),
        justifyContent:
          justify === "between" ? "space-between" : alignment(justify),
        ...style,
      }}
      {...props}
    />
  );
}
Stack.displayName = "Stack";
export function Inline({
  gap = 8,
  align = "center",
  justify = "start",
  wrap = true,
  style,
  className,
  ref,
  ...props
}: Omit<LayoutProps, "align"> & {
  align?: LayoutProps["align"] | "baseline";
  wrap?: boolean;
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={ref}
      data-slot="inline"
      className={cn(styles.inline, className)}
      style={{
        gap: spacing(gap),
        alignItems: alignment(align),
        justifyContent:
          justify === "between" ? "space-between" : alignment(justify),
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style,
      }}
      {...props}
    />
  );
}
Inline.displayName = "Inline";
/** An Inline child that takes the row's leftover width, such as a field beside buttons that hug their labels. */
export function InlineGrow({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="inline-grow"
      className={cn(styles.inlineGrow, className)}
      {...props}
    />
  );
}
InlineGrow.displayName = "InlineGrow";
/**
 * An Inline child that sets how it sits in the row. shrink={false} keeps a badge, button or
 * timestamp at its own width while a sibling truncates; truncate ends plain content in an ellipsis
 * on one line. A truncating row needs Inline wrap={false}, or the long child moves to its own line.
 */
export function InlineItem({
  shrink = true,
  truncate = false,
  title,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  shrink?: boolean;
  truncate?: boolean;
} & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="inline-item"
      title={truncateTitle(truncate, title, props.children)}
      className={cn(
        styles.inlineItem,
        !shrink && styles.inlineFixed,
        truncate && styles.endTruncate,
        className,
      )}
      {...props}
    />
  );
}
InlineItem.displayName = "InlineItem";
export function Grid({
  gap = 16,
  columns,
  min = "tile",
  style,
  className,
  ref,
  ...props
}: Omit<LayoutProps, "align" | "justify"> & {
  columns?: 2 | 3 | 4 | "1:2";
  min?: "tile" | "card";
} & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  let gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, var(--cipher-size-${min}-min)), 1fr))`;
  if (columns === "1:2") gridTemplateColumns = "minmax(0, 1fr) minmax(0, 2fr)";
  else if (columns) gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
  return (
    <div
      ref={ref}
      data-slot="grid"
      data-columns={columns}
      className={cn(
        styles.grid,
        columns === "1:2" && styles.gridSplit,
        className,
      )}
      style={{
        gap: spacing(gap),
        gridTemplateColumns,
        ...style,
      }}
      {...props}
    />
  );
}
Grid.displayName = "Grid";
export function Container({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="container"
      className={cn(styles.container, className)}
      {...props}
    />
  );
}
Container.displayName = "Container";
export function Measure({
  size = "prose",
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  size?: "page" | "form" | "prose";
} & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="measure"
      data-size={size}
      className={cn(
        size === "page"
          ? styles.measurePage
          : size === "form"
            ? styles.measureForm
            : styles.measureProse,
        className,
      )}
      {...props}
    />
  );
}
Measure.displayName = "Measure";

const scrollParent = (node: HTMLElement) => {
  for (let parent = node.parentElement; parent; parent = parent.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY))
      return parent;
  }
  return null;
};

export function DetailLayout({
  aside,
  asideLabel,
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  aside: React.ReactNode;
  asideLabel: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const asideRef = React.useRef<HTMLElement>(null);
  const [fits, setFits] = React.useState(false);
  React.useLayoutEffect(() => {
    const node = asideRef.current;
    if (!node) return undefined;
    const scroller = scrollParent(node);
    const measure = () => {
      const style = getComputedStyle(node);
      const room =
        (scroller ? scroller.clientHeight : window.innerHeight) -
        (parseFloat(style.scrollMarginTop) || 0) -
        (parseFloat(style.scrollMarginBottom) || 0);
      setFits(node.offsetHeight <= room);
    };
    measure();
    window.addEventListener("resize", measure);
    if (typeof ResizeObserver === "undefined")
      return () => window.removeEventListener("resize", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    if (scroller) observer.observe(scroller);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return (
    <div
      ref={ref}
      data-slot="detail-layout"
      className={cn(detailStyles.root, className)}
      {...props}
    >
      <div className={detailStyles.columns}>
        <aside
          ref={asideRef}
          data-slot="detail-layout-aside"
          data-sticky={fits || undefined}
          aria-label={asideLabel}
          className={detailStyles.aside}
        >
          {aside}
        </aside>
        <div data-slot="detail-layout-main" className={detailStyles.main}>
          {children}
        </div>
      </div>
    </div>
  );
}
DetailLayout.displayName = "DetailLayout";

/**
 * A fixed-width aside beside a main pane inside a bounded height, such as a sheet or a dialog. Each
 * pane scrolls on its own and the main pane's fields run its full width. Below size-pane-collapse
 * the aside stacks above the main pane, capped at 40% of the height. A page with a sidecar uses
 * DetailLayout, which scrolls with the page instead.
 */
export function Panes({
  aside,
  asideLabel,
  asideClassName,
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  aside: React.ReactNode;
  asideLabel?: string;
  asideClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      data-slot="panes"
      className={cn(paneStyles.root, className)}
      {...props}
    >
      <div className={paneStyles.columns}>
        <aside
          data-slot="panes-aside"
          aria-label={asideLabel}
          className={cn(paneStyles.aside, asideClassName)}
        >
          {aside}
        </aside>
        <div data-slot="panes-main" className={paneStyles.main}>
          {children}
        </div>
      </div>
    </div>
  );
}
Panes.displayName = "Panes";
