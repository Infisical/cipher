import * as React from "react";

import { cn, truncateTitle } from "../lib/utils";

import { Button } from "./button";
import { Icon } from "./icon";

import detailStyles from "./detail-layout.module.css";
import paneStyles from "./panes.module.css";
import styles from "./text.module.css";

export function PageMeasure({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
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
}: React.ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
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
const spacing = (gap: LayoutGap) => (gap === 0 ? 0 : `var(--cipher-space-${gap})`);
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
        justifyContent: justify === "between" ? "space-between" : alignment(justify),
        ...style
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
        justifyContent: justify === "between" ? "space-between" : alignment(justify),
        flexWrap: wrap ? "wrap" : "nowrap",
        ...style
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
}: React.ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
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
}: React.ComponentPropsWithoutRef<"div"> & { shrink?: boolean; truncate?: boolean } & {
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
        className
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
      className={cn(styles.grid, columns === "1:2" && styles.gridSplit, className)}
      style={{
        gap: spacing(gap),
        gridTemplateColumns,
        ...style
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
}: React.ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} data-slot="container" className={cn(styles.container, className)} {...props} />
  );
}
Container.displayName = "Container";
export function Measure({
  size = "prose",
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { size?: "page" | "form" | "prose" } & {
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
        className
      )}
      {...props}
    />
  );
}
Measure.displayName = "Measure";

const scrollParent = (node: HTMLElement) => {
  for (let parent = node.parentElement; parent; parent = parent.parentElement) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) return parent;
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

export type PanesIdentity = {
  media?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  badges?: React.ReactNode;
};

export type PanesState = {
  /** Below size-pane-collapse: the identity is a fixed header and the aside body is a page of its own. */
  narrow: boolean;
  detailsOpen: boolean;
  setDetailsOpen: (open: boolean) => void;
};

const PanesIdentityBlock = ({ identity }: { identity: PanesIdentity }) => (
  <div data-slot="panes-identity" className={paneStyles.identity}>
    {identity.media}
    <div className={paneStyles.identityText}>
      {identity.title}
      {identity.description}
      {identity.badges && <div className={paneStyles.badges}>{identity.badges}</div>}
    </div>
  </div>
);

/** The narrow-layout entry to the aside body's page, for a pane with no tabs to hold it. */
export function PanesDetailsEntry({ label, onOpen }: { label: string; onOpen: () => void }) {
  return (
    <button
      type="button"
      data-slot="panes-details-entry"
      data-panes-details-entry=""
      className={paneStyles.entry}
      onClick={onOpen}
    >
      <span>{label}</span>
      <Icon name="chev-right" />
    </button>
  );
}

/** The aside body as a page in the narrow layout, with a back control to the main pane. */
export function PanesDetailsPage({
  label,
  onBack,
  head,
  children
}: {
  label: string;
  onBack: () => void;
  /** Replaces the default back row, such as a sheet header in the same place. */
  head?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {head ?? (
        <div data-slot="panes-details-head" className={paneStyles.pageHead}>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Back"
            data-panes-details-back=""
            onClick={onBack}
          >
            <Icon name="chev-left" />
          </Button>
          <h2 className={paneStyles.pageTitle}>{label}</h2>
        </div>
      )}
      <div data-slot="panes-details" className={paneStyles.page}>
        {children}
      </div>
    </>
  );
}

const usePanesNarrow = (node: HTMLElement | null) => {
  const [narrow, setNarrow] = React.useState(false);
  React.useLayoutEffect(() => {
    if (!node) return undefined;
    const measure = () => {
      const collapse = parseFloat(
        getComputedStyle(node).getPropertyValue("--cipher-size-pane-collapse")
      );
      setNarrow(node.clientWidth < (collapse || 0));
    };
    measure();
    if (typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return narrow;
};

/**
 * A fixed-width aside beside a main pane inside a bounded height, such as a sheet or a dialog. The
 * aside holds the identity (media, title, description, badges) above its body, each pane scrolls
 * on its own, and the main pane's fields run its full width. Below size-pane-collapse the identity
 * becomes a fixed header and the aside body becomes its own page: by default a Details entry above
 * the main pane opens it with a back control. Pass children as a function of PanesState to place
 * that entry and page yourself, as SheetContent does with header tabs. A page with a sidecar uses
 * DetailLayout, which scrolls with the page instead.
 */
export function Panes({
  identity,
  aside,
  asideLabel,
  asideClassName,
  detailsLabel = "Details",
  children,
  className,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  identity?: PanesIdentity;
  aside: React.ReactNode;
  asideLabel?: string;
  asideClassName?: string;
  /** Names the aside body's page and its entry in the narrow layout. */
  detailsLabel?: string;
  children: React.ReactNode | ((state: PanesState) => React.ReactNode);
  ref?: React.Ref<HTMLDivElement>;
}) {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const narrow = usePanesNarrow(node);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const open = narrow && detailsOpen;
  const opened = React.useRef(open);
  React.useEffect(() => {
    if (opened.current === open || !node) return;
    opened.current = open;
    const target = node.querySelector<HTMLElement>(
      open ? "[data-panes-details-back]" : "[data-panes-details-entry]"
    );
    target?.focus();
  }, [open, node]);
  const setRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      setNode(element);
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [ref]
  );
  const state = { narrow, detailsOpen: open, setDetailsOpen };
  const identityBlock = identity && <PanesIdentityBlock identity={identity} />;
  const main =
    typeof children === "function" ? (
      children(state)
    ) : (
      <>
        {narrow &&
          (open ? (
            <PanesDetailsPage label={detailsLabel} onBack={() => setDetailsOpen(false)}>
              {aside}
            </PanesDetailsPage>
          ) : (
            <PanesDetailsEntry label={detailsLabel} onOpen={() => setDetailsOpen(true)} />
          ))}
        <div className={cn(paneStyles.main, open && paneStyles.hidden)}>{children}</div>
      </>
    );
  return (
    <div
      ref={setRef}
      data-slot="panes"
      data-narrow={narrow || undefined}
      className={cn(paneStyles.root, className)}
      {...props}
    >
      <div className={paneStyles.columns}>
        {narrow ? (
          identityBlock
        ) : (
          <aside
            data-slot="panes-aside"
            aria-label={asideLabel}
            className={cn(paneStyles.aside, asideClassName)}
          >
            {identityBlock}
            {aside}
          </aside>
        )}
        <div data-slot="panes-main" className={paneStyles.main}>
          {main}
        </div>
      </div>
    </div>
  );
}
Panes.displayName = "Panes";
