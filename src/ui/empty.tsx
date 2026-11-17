import * as React from "react";

import { cn } from "../lib/utils";
import { Icon, type IconSource } from "./icon";

import controlStyles from "./controls.module.css";
import styles from "./empty.module.css";

type EmptySize = "default" | "sm";

const GHOSTS = ["a", "b", "c", "d", "e", "f"];

export type EmptyGhost = "rows" | "cards" | false;

const GhostContext = React.createContext<EmptyGhost | undefined>(undefined);

/** Sets the ghost an Empty inside defaults to. Containers with an empty slot use it, so an explicit ghost on the Empty still wins. */
export function EmptyGhostScope({
  ghost,
  children
}: {
  ghost: EmptyGhost | undefined;
  children: React.ReactNode;
}) {
  return <GhostContext value={ghost}>{children}</GhostContext>;
}

function Empty({
  className,
  size = "default",
  ghost,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  size?: EmptySize;
  /**
   * Faded placeholder rows or cards behind the message, hinting at what fills the space. They fade
   * out toward the center, so the message and action never sit on a line. Containers pick it for
   * you: DataTable draws rows, Grid and TilePicker draw cards, and none draw one while filtered or
   * when the table sits flush in a framed Card. Inside a ListQueryScope, a FilterBar search or filter
   * counts as filtered. A standalone Empty stays plain. Pass a value to override the container, or
   * false to turn it off.
   */
  ghost?: EmptyGhost;
} & {
  ref?: React.Ref<React.ComponentRef<"div">>;
}) {
  const inherited = React.useContext(GhostContext);
  const resolved = ghost === undefined ? inherited : ghost;
  return (
    <div
      ref={ref}
      data-slot="empty"
      data-size={size}
      data-ghost={resolved || undefined}
      className={cn(styles.root, className)}
      {...props}
    >
      {resolved && (
        <div className={styles.ghosts} aria-hidden="true">
          {GHOSTS.map((id) => (
            <span key={id} className={styles.ghost} />
          ))}
        </div>
      )}
      {children}
    </div>
  );
}
Empty.displayName = "Empty";

function EmptyHeader({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div ref={ref} data-slot="empty-header" className={cn(styles.header, className)} {...props} />
  );
}
EmptyHeader.displayName = "EmptyHeader";

export type EmptyMediaVariant = "tile" | "bare";

function EmptyMedia({
  className,
  variant = "tile",
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { variant?: EmptyMediaVariant } & {
  ref?: React.Ref<React.ComponentRef<"div">>;
}) {
  return (
    <div
      ref={ref}
      data-slot="empty-media"
      data-variant={variant}
      className={cn(styles.media, className)}
      {...props}
    />
  );
}
EmptyMedia.displayName = "EmptyMedia";

function EmptyTitle({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="empty-title"
      className={cn(controlStyles.sectionTitle, styles.title, className)}
      {...props}
    />
  );
}
EmptyTitle.displayName = "EmptyTitle";

function EmptyDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <div
      data-slot="empty-description"
      className={cn(controlStyles.supporting, styles.description, className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div ref={ref} data-slot="empty-content" className={cn(styles.content, className)} {...props} />
  );
}
EmptyContent.displayName = "EmptyContent";

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };

export const EmptyState = ({
  title,
  description,
  actions,
  icon = "inbox",
  media = "tile",
  size = "default",
  ghost
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  icon?: IconSource;
  media?: EmptyMediaVariant;
  size?: EmptySize;
  ghost?: EmptyGhost;
}) => (
  <Empty size={size} ghost={ghost}>
    <EmptyMedia variant={media}>
      <Icon icon={icon} />
    </EmptyMedia>
    <EmptyHeader>
      <EmptyTitle>{title}</EmptyTitle>
      {description && <EmptyDescription>{description}</EmptyDescription>}
    </EmptyHeader>
    {actions && <EmptyContent>{actions}</EmptyContent>}
  </Empty>
);
