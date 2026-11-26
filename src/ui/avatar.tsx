import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";

import { cn } from "../lib/utils";
import { Icon } from "./icon";
import { Tooltip, TooltipProvider, useInTooltipScope } from "./tooltip";

import controls from "./controls.module.css";
import helperStyles from "./helpers.module.css";

type AvatarKind = "person" | "machine" | "agent" | "group" | "fallback";
const kindIcons = {
  machine: "machine",
  agent: "agent",
  group: "users",
  fallback: "user"
} as const;

function Avatar({
  className,
  size = "default",
  name,
  initials,
  label,
  kind = "person",
  status,
  ring,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg" | number;
  name?: string;
  initials?: string;
  label?: string;
  status?: "ok" | "warn" | "off";
  ring?: boolean;
  kind?: AvatarKind;
} & { ref?: React.Ref<React.ComponentRef<typeof AvatarPrimitive.Root>> }) {
  if (!Object.prototype.hasOwnProperty.call(kindIcons, kind) && kind !== "person") return null;
  const dimension =
    typeof size === "number" && Number.isFinite(size) && size > 0
      ? size
      : size === "sm"
        ? 24
        : size === "lg"
          ? 40
          : 32;
  return (
    <AvatarPrimitive.Root
      ref={ref}
      data-kind={kind}
      data-size={typeof size === "number" ? undefined : size}
      role={name || label ? "img" : undefined}
      aria-label={label ?? name}
      {...props}
      data-slot="avatar"
      style={{
        width: dimension,
        height: dimension,
        fontSize: dimension <= 24 ? 10 : dimension <= 32 ? 12 : Math.round(dimension * 0.35),
        ...props.style
      }}
      className={cn(
        "group/avatar relative flex shrink-0 select-none",
        helperStyles.avatarShape,
        ring && helperStyles.avatarRing,
        className
      )}
    >
      {children ?? (
        <AvatarFallback>
          {kind !== "person" ? (
            <Icon name={kindIcons[kind]} />
          ) : (
            (initials ??
            name
              ?.trim()
              .split(/[\s._-]+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase() ??
            "?")
          )}
        </AvatarFallback>
      )}
      {status && (
        <span aria-hidden="true" data-status={status} className={helperStyles.avatarStatus} />
      )}
    </AvatarPrimitive.Root>
  );
}
Avatar.displayName = "Avatar";

function AvatarImage({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      ref={ref}
      data-slot="avatar-image"
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}
AvatarImage.displayName = "AvatarImage";

function AvatarFallback({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        helperStyles.avatarFallback,
        "flex size-full items-center justify-center",
        className
      )}
      {...props}
    />
  );
}
AvatarFallback.displayName = "AvatarFallback";

function AvatarBadge({ className, ref, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      ref={ref}
      data-slot="avatar-badge"
      className={cn(
        "text-primary-foreground bg-primary absolute right-0 bottom-0 z-10 inline-flex items-center justify-center bg-blend-color ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className
      )}
      {...props}
    />
  );
}
AvatarBadge.displayName = "AvatarBadge";

function AvatarGroup({
  className,
  children,
  max,
  size = 32,
  label,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { max?: number; size?: number; label?: string } & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  const all = React.Children.toArray(children);
  const limit = max === undefined ? all.length : Math.max(0, Math.floor(max));
  const scoped = useInTooltipScope();
  return (
    <div
      ref={ref}
      role="group"
      aria-label={label}
      data-slot="avatar-group"
      className={cn(helperStyles.avatarGroup, className)}
      {...props}
    >
      <TooltipProvider>
        {all.slice(0, limit).map((child) => {
          if (!React.isValidElement<React.ComponentProps<typeof Avatar>>(child)) return child;
          if (child.type !== Avatar) return child;
          const { label: avatarLabel, tabIndex } = child.props;
          const avatar = React.cloneElement(child, {
            size: child.props.size ?? size,
            ring: true,
            tabIndex: avatarLabel && !scoped ? (tabIndex ?? 0) : tabIndex,
            className: cn(avatarLabel && !scoped && controls.focusOutline, child.props.className)
          });
          return avatarLabel ? (
            <Tooltip key={child.key} content={avatarLabel}>
              {avatar}
            </Tooltip>
          ) : (
            avatar
          );
        })}
      </TooltipProvider>
      {all.length > limit && (
        <Avatar
          size={size}
          initials={`+${all.length - limit}`}
          label={`${all.length - limit} more`}
          ring
        />
      )}
    </div>
  );
}
AvatarGroup.displayName = "AvatarGroup";

function AvatarGroupCount({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center [&>svg]:size-4",
        helperStyles.avatarCount,
        className
      )}
      {...props}
    />
  );
}
AvatarGroupCount.displayName = "AvatarGroupCount";

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage };

export const Identity = ({
  name,
  description,
  mono = false,
  media,
  title,
  kind = "person",
  className
}: {
  name: string;
  description?: string;
  mono?: boolean;
  media?: React.ReactNode;
  title?: React.ReactNode;
  kind?: AvatarKind;
  className?: string;
}) => (
  <div data-slot="identity" className={cn(helperStyles.identity, className)}>
    {media ?? <Avatar name={name} kind={kind} />}
    <div className={helperStyles.identityText}>
      <span className={cn(helperStyles.identityTitle, mono && helperStyles.mono)}>
        {title ?? name}
      </span>
      {description && <span className={helperStyles.identityDescription}>{description}</span>}
    </div>
  </div>
);
