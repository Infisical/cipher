"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { RowDescriptionContext } from "../lib/row-description";
import { cn } from "../lib/utils";
import { Icon, type IconSource } from "./icon";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useReason } from "./tooltip";

import controlStyles from "./controls.module.css";
import helperStyles from "./helpers.module.css";

const badgeVariants = cva([
  controlStyles.focusOutline,
  helperStyles.badge,
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-(--cipher-badge-glyph)! [&>svg]:[--cipher-lead-size:var(--cipher-badge-glyph)]! [&>svg]:cipher-lead-line"
]);

export type BadgeTone = "outline" | "soft" | "ok" | "warn" | "bad" | "info" | "solid" | "accent";
type LegacyBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
const legacyTone: Record<LegacyBadgeVariant, BadgeTone> = {
  default: "solid",
  secondary: "soft",
  destructive: "bad",
  outline: "outline",
  ghost: "outline",
  link: "outline"
};

function Badge({
  className,
  variant,
  tone,
  dot = false,
  icon,
  media,
  size = "md",
  mono = false,
  collapse = false,
  reason,
  children,
  asChild = false,
  ref,
  onPointerEnter,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  asChild?: boolean;
  tone?: BadgeTone;
  /** @deprecated Use tone. Each value maps to a tone: default solid, secondary soft, destructive bad, the rest outline. */
  variant?: LegacyBadgeVariant;
  dot?: boolean;
  /** A leading glyph, decorative: the text stays the badge's name. */
  icon?: IconSource;
  /** A logo or image before the label: 14px beside the default label, the glyph size in the sm and control sizes. It never shrinks; under collapse the label truncates and the media stays. Ignored when icon is set. */
  media?: React.ReactNode;
  size?: "sm" | "md" | "control-sm" | "control-md" | "control-lg";
  mono?: boolean;
  /** Lets the badge give up width under pressure, as in a NameLine or a narrow cell: an icon or dot badge drops to its glyph and a text badge truncates to about 6ch. */
  collapse?: boolean;
  /** Says why the badge reads as it does, such as the error behind a failed status: it becomes a tab stop, shows the reason in a tooltip and exposes it as the accessible description. */
  reason?: React.ReactNode;
} & { ref?: React.Ref<React.ComponentRef<"span">> }) {
  const Comp = asChild ? Slot.Root : "span";
  const reasonTooltip = useReason(reason);
  const describedBy = reasonTooltip.describedBy(
    [
      props["aria-describedby"],
      asChild && React.isValidElement<{ "aria-describedby"?: string }>(children)
        ? children.props["aria-describedby"]
        : undefined
    ]
      .filter(Boolean)
      .join(" ") || undefined
  );
  const fitsWhole = !icon && !dot && !media;
  const textRef = React.useCallback(
    (label: HTMLSpanElement | null) => {
      const root = label?.parentElement;
      if (!label || !root) return;
      const measure = () => {
        if (fitsWhole && (label.textContent ?? "").length <= 6) root.setAttribute("data-fit", "");
        else root.removeAttribute("data-fit");
      };
      measure();
      const observer = new MutationObserver(measure);
      observer.observe(label, {
        subtree: true,
        childList: true,
        characterData: true
      });
      return () => observer.disconnect();
    },
    [fitsWhole]
  );
  const text = (content: React.ReactNode) => {
    if (collapse)
      return (
        <span ref={textRef} data-badge-text="" className={helperStyles.badgeText}>
          {content}
        </span>
      );
    const nodes: React.ReactNode[] = [];
    let run: React.ReactNode[] = [];
    const flush = () => {
      if (!run.length) return;
      nodes.push(
        <span key={nodes.length} data-badge-text="" className={helperStyles.badgeText}>
          {run}
        </span>
      );
      run = [];
    };
    React.Children.toArray(content).forEach((child) => {
      if (
        React.isValidElement<{ children?: React.ReactNode }>(child) &&
        (child.type === "svg" ||
          (child.type !== React.Fragment && child.props.children === undefined))
      ) {
        flush();
        nodes.push(child);
      } else run.push(child);
    });
    flush();
    return nodes;
  };
  const dotNode = (
    <>
      {dot && <span aria-hidden="true" className={cn(helperStyles.badgeDot, "cipher-lead-line")} />}
      {icon && <Icon icon={icon} />}
      {!icon && Boolean(media) && (
        <span data-slot="badge-media" className={cn(helperStyles.badgeMedia, "cipher-lead-line")}>
          {media}
        </span>
      )}
    </>
  );
  const body =
    asChild &&
    React.isValidElement<{ children?: React.ReactNode; "aria-describedby"?: string }>(children) ? (
      React.cloneElement(
        children,
        reasonTooltip.active ? { "aria-describedby": describedBy } : undefined,
        <>
          {dotNode}
          {text(children.props.children)}
          {reasonTooltip.description}
        </>
      )
    ) : (
      <>
        {dotNode}
        {text(children)}
        {reasonTooltip.description}
      </>
    );

  return reasonTooltip.wrap(
    <Comp
      ref={ref}
      data-slot="badge"
      data-tone={tone ?? (variant ? legacyTone[variant] : "outline")}
      data-size={size}
      data-collapse={collapse || undefined}
      className={cn(badgeVariants(), mono && helperStyles.mono, className)}
      onPointerEnter={(event: React.PointerEvent<HTMLSpanElement>) => {
        onPointerEnter?.(event);
        const badge = event.currentTarget;
        const labels = badge.querySelectorAll<HTMLElement>("[data-badge-text]");
        if (!labels.length) return;
        if (props.title !== undefined || reasonTooltip.active) {
          delete badge.dataset.autoTitle;
          return;
        }
        const automatic = badge.dataset.autoTitle !== undefined;
        if (badge.title && !automatic) return;
        const range = document.createRange();
        const cut = Array.from(labels).some((label) => {
          range.selectNodeContents(label);
          return range.getBoundingClientRect().width > label.getBoundingClientRect().width + 0.1;
        });
        if (cut) {
          badge.title = (badge.textContent ?? "").trim();
          badge.dataset.autoTitle = "";
        } else if (automatic) {
          badge.removeAttribute("title");
          delete badge.dataset.autoTitle;
        }
      }}
      {...props}
      aria-describedby={describedBy}
    >
      {body}
    </Comp>,
    true
  );
}
Badge.displayName = "Badge";

/** A row of badges that never wraps: badges that don't fit collapse into a trailing +N that opens the rest. For table cells, where every row keeps one height. With wrap, every badge shows and they wrap onto more lines, a long label wrapping inside its badge, for a details card or a form where the height can grow. */
function flatten(children: React.ReactNode, prefix = ""): React.ReactNode[] {
  return React.Children.toArray(children).flatMap((child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) return [child];
    const key = `${prefix}${child.key}`;
    return child.type === React.Fragment
      ? flatten(child.props.children, `${key}/`)
      : [prefix ? React.cloneElement(child, { key }) : child];
  });
}

function BadgeGroup({
  className,
  wrap = false,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  wrap?: boolean;
} & { ref?: React.Ref<HTMLDivElement> }) {
  const items = flatten(children);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const measured = React.useRef("");
  const [shown, setShown] = React.useState(items.length);
  React.useImperativeHandle(ref, () => groupRef.current as HTMLDivElement);
  React.useLayoutEffect(() => {
    const group = groupRef.current;
    const measure = measureRef.current;
    if (!group || !measure) return;
    const fit = () => {
      const nodes = Array.from(measure.children);
      const more = nodes.pop()?.getBoundingClientRect().width ?? 0;
      const widths = nodes.map((node) => node.getBoundingClientRect().width);
      const signature = widths.join();
      if (signature !== measured.current) {
        measured.current = signature;
        if (visible < widths.length) {
          setShown(widths.length);
          return;
        }
      }
      const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
      const room = group.clientWidth + 0.5;
      const whole = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
      let used = 0;
      let count = widths.length;
      for (let index = 0; whole > room && index < widths.length; index++) {
        used += (index ? gap : 0) + widths[index];
        const tail = index < widths.length - 1 ? gap + more : 0;
        if (used + tail > room) {
          count = Math.max(1, index);
          break;
        }
      }
      setShown(count);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(group);
    Array.from(measure.children).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  });
  const visible = wrap ? items.length : Math.min(shown, items.length);
  const rest = items.length - visible;
  return (
    <div
      ref={groupRef}
      data-slot="badge-group"
      data-wrap={wrap || undefined}
      className={cn(helperStyles.badgeGroup, className)}
      {...props}
    >
      {items.slice(0, visible)}
      {rest > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Badge asChild>
              <button
                type="button"
                aria-label={`${rest} more`}
                onClick={(event) => event.stopPropagation()}
              >
                +{rest}
              </button>
            </Badge>
          </PopoverTrigger>
          <PopoverContent
            align="start"
            data-width="content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className={helperStyles.badgeGroupMore}>{items.slice(visible)}</div>
          </PopoverContent>
        </Popover>
      )}
      {!wrap && (
        <div ref={measureRef} aria-hidden="true" inert className={helperStyles.badgeGroupMeasure}>
          <RowDescriptionContext value={null}>
            {items.map((item) =>
              React.isValidElement(item)
                ? React.cloneElement(item, { ref: null, id: undefined } as object)
                : item
            )}
            <Badge>+{items.length}</Badge>
          </RowDescriptionContext>
        </div>
      )}
    </div>
  );
}
BadgeGroup.displayName = "BadgeGroup";

export { Badge, BadgeGroup, badgeVariants };

export function Count({
  tone = "accent",
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  /** warn and bad reuse the soft Badge tones, for a count that flags trouble rather than volume. */
  tone?: "accent" | "ink" | "neutral" | "warn" | "bad";
} & {
  ref?: React.Ref<HTMLSpanElement>;
}) {
  return (
    <span
      ref={ref}
      data-slot="count"
      data-tone={tone}
      className={cn(
        helperStyles.count,
        tone === "ink" && helperStyles.countInk,
        tone === "neutral" && helperStyles.countNeutral,
        className
      )}
      {...props}
    />
  );
}
Count.displayName = "Count";

/** A title followed by its count, as List and Heading show it. A number or string becomes the accent Count. */
export function TitleCount({
  count,
  wrap = false,
  children
}: {
  count: React.ReactNode;
  /** Lets the title wrap with the count after its last word, instead of truncating beside a fixed count. */
  wrap?: boolean;
  children: React.ReactNode;
}) {
  return (
    <span data-slot="title-count" data-wrap={wrap || undefined} className={helperStyles.titleCount}>
      <span>{children}</span>
      {typeof count === "number" || typeof count === "string" ? <Count>{count}</Count> : count}
    </span>
  );
}
TitleCount.displayName = "TitleCount";
