"use client";

import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";
import { Icon, type IconSource } from "./icon";
import { Tooltip } from "./tooltip";

import controlStyles from "./controls.module.css";
import helperStyles from "./helpers.module.css";

const badgeVariants = cva([
  controlStyles.focusOutline,
  helperStyles.badge,
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-(--cipher-badge-glyph)!"
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
  size = "md",
  mono = false,
  collapse = false,
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
  size?: "sm" | "md" | "control-sm" | "control-md" | "control-lg";
  mono?: boolean;
  /** Lets the badge give up width under pressure, as in a NameLine or a narrow cell: an icon or dot badge drops to its glyph and a text badge truncates to about 6ch. */
  collapse?: boolean;
} & { ref?: React.Ref<React.ComponentRef<"span">> }) {
  const Comp = asChild ? Slot.Root : "span";
  const fitsWhole = !icon && !dot;
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
      {dot && <span aria-hidden="true" className={helperStyles.badgeDot} />}
      {icon && <Icon icon={icon} />}
    </>
  );
  const body =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children) ? (
      React.cloneElement(
        children,
        undefined,
        <>
          {dotNode}
          {text(children.props.children)}
        </>
      )
    ) : (
      <>
        {dotNode}
        {text(children)}
      </>
    );

  return (
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
        if (props.title !== undefined) {
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
    >
      {body}
    </Comp>
  );
}
Badge.displayName = "Badge";

/** A row of badges that never wraps: badges that don't fit collapse into a trailing +N whose tooltip lists them. For table cells, where every row keeps one height. */
function BadgeGroup({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
  const items = React.Children.toArray(children);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const measureRef = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(items.length);
  const [hidden, setHidden] = React.useState("");
  React.useImperativeHandle(ref, () => groupRef.current as HTMLDivElement);
  React.useLayoutEffect(() => {
    const group = groupRef.current;
    const measure = measureRef.current;
    if (!group || !measure) return;
    const fit = () => {
      const nodes = Array.from(measure.children);
      const more = nodes.pop()?.getBoundingClientRect().width ?? 0;
      const widths = nodes.map((node) => node.getBoundingClientRect().width);
      const gap = parseFloat(getComputedStyle(group).columnGap) || 0;
      const room = group.clientWidth + 0.5;
      let used = 0;
      let count = widths.length;
      const whole = widths.reduce((sum, width) => sum + width, 0) + gap * (widths.length - 1);
      for (let index = 0; whole > room && index < widths.length; index++) {
        used += (index ? gap : 0) + widths[index];
        const tail = index < widths.length - 1 ? gap + more : 0;
        if (used + tail > room) {
          count = Math.max(1, index);
          break;
        }
      }
      setShown(count);
      setHidden(
        nodes
          .slice(count)
          .map((node) => (node.textContent ?? "").trim())
          .join(", ")
      );
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(group);
    Array.from(measure.children).forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  });
  const rest = items.length - shown;
  return (
    <div
      ref={groupRef}
      data-slot="badge-group"
      className={cn(helperStyles.badgeGroup, className)}
      {...props}
    >
      {items.slice(0, shown)}
      {rest > 0 && (
        <Tooltip content={hidden}>
          <Badge tabIndex={0} aria-label={`${rest} more: ${hidden}`}>
            +{rest}
          </Badge>
        </Tooltip>
      )}
      <div ref={measureRef} aria-hidden="true" inert className={helperStyles.badgeGroupMeasure}>
        {items}
        <Badge>+{items.length}</Badge>
      </div>
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
