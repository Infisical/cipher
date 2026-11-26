import * as React from "react";

import { useListFiltered } from "../lib/list-query";
import { cn, truncateTitle } from "../lib/utils";
import { type EmptyGhost, EmptyGhostScope } from "./empty";

import { Tabs, TabsList, TabsTrigger } from "./tabs";

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
const spacing = (gap: LayoutGap | "toolbar") =>
  gap === 0 ? 0 : `var(--cipher-space-${gap === "toolbar" ? "toolbar-gap" : gap})`;
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
}: Omit<LayoutProps, "gap"> & {
  /** "toolbar" is the gap between a list toolbar (a FilterBar or a search row) and the list, table or results it filters. */
  gap?: LayoutGap | "toolbar";
} & { ref?: React.Ref<HTMLDivElement> }) {
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
  wrap: wrapProp,
  style,
  className,
  ref,
  ...props
}: Omit<LayoutProps, "align"> & {
  /** first-line keeps a leading icon or control on the first line of the text beside it as the text wraps (the first child gets .cipher-lead-line). Use it for an icon before a sentence; center is for rows that never wrap. */
  align?: LayoutProps["align"] | "baseline" | "first-line";
  /** Defaults to true, or false with align first-line so the text stays beside its icon. */
  wrap?: boolean;
} & { ref?: React.Ref<HTMLDivElement> }) {
  const firstLine = align === "first-line";
  const wrap = wrapProp ?? !firstLine;
  return (
    <div
      ref={ref}
      data-slot="inline"
      data-align={firstLine ? "first-line" : undefined}
      className={cn(styles.inline, firstLine && "*:first:cipher-lead-line", className)}
      style={{
        gap: spacing(gap),
        alignItems: firstLine ? "flex-start" : alignment(align),
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
  empty,
  ghost,
  filtered: filteredProp,
  style,
  className,
  children,
  ref,
  ...props
}: Omit<LayoutProps, "align" | "justify"> & {
  /** At most this many equal columns, and fewer once a column would drop below min, down to one on a narrow screen. */
  columns?: 2 | 3 | 4 | "1:2";
  min?: "tile" | "card";
  /** Shown across every column when the grid has no children, such as an EmptyState. */
  empty?: React.ReactNode;
  /** The ghost behind an Empty in the empty slot. Defaults to cards, and to none while filtered. */
  ghost?: EmptyGhost;
  /** The items are narrowed by a search or filters, so an empty grid means no matches and draws no ghost. Inside a ListQueryScope it follows the FilterBar unless passed. */
  filtered?: boolean;
} & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  const listFiltered = useListFiltered();
  const filtered = filteredProp ?? listFiltered;
  let gridTemplateColumns = `repeat(auto-fit, minmax(min(100%, var(--cipher-size-${min}-min)), 1fr))`;
  if (columns === "1:2") gridTemplateColumns = "minmax(0, 1fr) minmax(0, 2fr)";
  else if (columns) {
    const columnGap = style?.columnGap ?? spacing(gap);
    const gapWidth = typeof columnGap === "number" ? `${columnGap}px` : columnGap || "0px";
    gridTemplateColumns = `repeat(auto-fill, minmax(max(min(100%, var(--cipher-size-${min}-min)), calc((100% - ${columns - 1} * ${gapWidth}) / ${columns})), 1fr))`;
  }
  return (
    <div
      ref={ref}
      data-slot="grid"
      data-columns={columns}
      className={cn(
        styles.grid,
        columns === "1:2" && styles.gridSplit,
        typeof columns === "number" && styles.gridColumns,
        className
      )}
      style={{
        gap: spacing(gap),
        gridTemplateColumns,
        ...style
      }}
      {...props}
    >
      {empty !== undefined && React.Children.toArray(children).length === 0 ? (
        <div style={{ gridColumn: "1 / -1" }}>
          <EmptyGhostScope ghost={ghost ?? (filtered ? false : "cards")}>{empty}</EmptyGhostScope>
        </div>
      ) : (
        children
      )}
    </div>
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
  asideWidth = "default",
  children,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  aside: React.ReactNode;
  asideLabel: string;
  /** "narrow" sets the sidecar to size-pane-aside (320px) instead of size-sidecar (384px), for a page capped narrower than the content measure. A full UUID wraps onto two lines at that width. */
  asideWidth?: "default" | "narrow";
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
      data-aside-width={asideWidth === "narrow" ? "narrow" : undefined}
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
  /** Below size-pane-collapse: the identity is a fixed header and the aside body is a tab of its own. */
  narrow: boolean;
  detailsOpen: boolean;
  setDetailsOpen: (open: boolean) => void;
};

const PanesIdentityBlock = ({ identity, narrow }: { identity: PanesIdentity; narrow: boolean }) => (
  <div data-slot="panes-identity" className={paneStyles.identity}>
    {identity.media && narrow ? (
      <span className={cn(paneStyles.identityMedia, "cipher-lead-block")}>{identity.media}</span>
    ) : (
      identity.media
    )}
    <div className={paneStyles.identityText}>
      {identity.title}
      {identity.description}
      {identity.badges && <div className={paneStyles.badges}>{identity.badges}</div>}
    </div>
  </div>
);

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

const ASIDE_TAB = "aside";
const MAIN_TAB = "main";

type PanesProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  identity?: PanesIdentity;
  aside: React.ReactNode;
  /** Names the aside landmark and, in the narrow layout, its tab. Defaults to Details. */
  asideLabel?: string;
  asideClassName?: string;
  ref?: React.Ref<HTMLDivElement>;
} & (
    | {
        /** Names the main pane's tab in the narrow layout. */
        mainLabel: string;
        children: React.ReactNode;
      }
    | { mainLabel?: never; children: (state: PanesState) => React.ReactNode }
  );

/**
 * A fixed-width aside beside a main pane inside a bounded height, such as a sheet or a dialog. The
 * aside holds the identity (media, title, description, badges) above its body, each pane scrolls
 * on its own, and the main pane's fields run its full width. Below size-pane-collapse the identity
 * becomes a fixed header and two tabs under it switch between the aside body (asideLabel, first)
 * and the main pane (mainLabel, shown first). Pass children as a function of PanesState to place
 * the tabs yourself, as SheetContent does with header tabs. A page with a sidecar uses
 * DetailLayout, which scrolls with the page instead.
 */
export function Panes({
  identity,
  aside,
  asideLabel = "Details",
  asideClassName,
  mainLabel,
  children,
  className,
  ref,
  ...props
}: PanesProps) {
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const narrow = usePanesNarrow(node);
  const [detailsOpen, setDetailsOpen] = React.useState(false);
  const tabsId = React.useId();
  React.useEffect(() => {
    if (!narrow) setDetailsOpen(false);
  }, [narrow]);
  const open = narrow && detailsOpen;
  const setRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      setNode(element);
      if (typeof ref === "function") ref(element);
      else if (ref) ref.current = element;
    },
    [ref]
  );
  const identityBlock = identity && <PanesIdentityBlock identity={identity} narrow={narrow} />;
  const main =
    typeof children === "function" ? (
      children({ narrow, detailsOpen: open, setDetailsOpen })
    ) : (
      <>
        {narrow && (
          <Tabs
            data-slot="panes-tabs"
            className={paneStyles.tabs}
            value={open ? ASIDE_TAB : MAIN_TAB}
            onValueChange={(value) => setDetailsOpen(value === ASIDE_TAB)}
          >
            <TabsList>
              <TabsTrigger
                value={ASIDE_TAB}
                id={tabsId + ASIDE_TAB}
                aria-controls={tabsId + "asidepanel"}
              >
                {asideLabel}
              </TabsTrigger>
              <TabsTrigger
                value={MAIN_TAB}
                id={tabsId + MAIN_TAB}
                aria-controls={tabsId + "mainpanel"}
              >
                {mainLabel}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        {narrow && (
          <div
            data-slot="panes-details"
            role="tabpanel"
            id={tabsId + "asidepanel"}
            aria-labelledby={tabsId + ASIDE_TAB}
            className={cn(paneStyles.page, !open && paneStyles.hidden)}
          >
            {aside}
          </div>
        )}
        <div
          className={cn(paneStyles.main, paneStyles.scroll, open && paneStyles.hidden)}
          {...(narrow
            ? { role: "tabpanel", id: tabsId + "mainpanel", "aria-labelledby": tabsId + MAIN_TAB }
            : {})}
        >
          {children}
        </div>
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
