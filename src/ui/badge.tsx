import * as React from "react";
import { cva } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "../lib/utils";
import { Icon, type IconSource } from "./icon";

import controlStyles from "./controls.module.css";
import helperStyles from "./helpers.module.css";

const badgeVariants = cva([
  controlStyles.focusOutline,
  helperStyles.badge,
  "group/badge inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-(--cipher-badge-glyph)!",
]);

export type BadgeTone =
  "outline" | "soft" | "ok" | "warn" | "bad" | "info" | "solid" | "accent";
type LegacyBadgeVariant =
  "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
const legacyTone: Record<LegacyBadgeVariant, BadgeTone> = {
  default: "solid",
  secondary: "soft",
  destructive: "bad",
  outline: "outline",
  ghost: "outline",
  link: "outline",
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
  /** Lets the badge give up width under pressure, as in a NameLine or a narrow cell: an icon or dot badge drops to its glyph and a text badge truncates to about 6ch. Hovering shows the full text. */
  collapse?: boolean;
} & { ref?: React.Ref<React.ComponentRef<"span">> }) {
  const Comp = asChild ? Slot.Root : "span";
  const text = (content: React.ReactNode) =>
    collapse ? (
      <span data-badge-text="" className={helperStyles.badgeText}>
        {content}
      </span>
    ) : (
      content
    );
  const dotNode = (
    <>
      {dot && <span aria-hidden="true" className={helperStyles.badgeDot} />}
      {icon && <Icon icon={icon} />}
    </>
  );
  const body =
    asChild &&
    React.isValidElement<{ children?: React.ReactNode }>(children) ? (
      React.cloneElement(
        children,
        undefined,
        <>
          {dotNode}
          {text(children.props.children)}
        </>,
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
      data-collapse={
        collapse
          ? !icon &&
            !dot &&
            typeof children === "string" &&
            children.length <= 6
            ? "fit"
            : ""
          : undefined
      }
      className={cn(badgeVariants(), mono && helperStyles.mono, className)}
      onPointerEnter={(event: React.PointerEvent<HTMLSpanElement>) => {
        onPointerEnter?.(event);
        const label =
          collapse &&
          !props.title &&
          event.currentTarget.querySelector<HTMLElement>("[data-badge-text]");
        if (!label) return;
        if (label.scrollWidth > label.clientWidth + 1)
          event.currentTarget.title = label.textContent ?? "";
        else event.currentTarget.removeAttribute("title");
      }}
      {...props}
    >
      {body}
    </Comp>
  );
}
Badge.displayName = "Badge";

export { Badge, badgeVariants };

export function Count({
  tone = "accent",
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"span"> & {
  tone?: "accent" | "ink" | "neutral";
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
        className,
      )}
      {...props}
    />
  );
}
Count.displayName = "Count";
