"use client";

import * as React from "react";
import { GripHorizontalIcon } from "lucide-react";
import { Dialog as DialogPrimitive, Popover as PopoverPrimitive, Slot } from "radix-ui";

import { useIsMobile } from "../hooks/use-mobile";

import { useCollisionBoundary, usePortalContainer } from "../scope";

import { FrameScope } from "../lib/frame-context";
import { splitOverlaySections } from "../lib/overlay-sections";
import { useOwnedEscape } from "../lib/use-owned-escape";
import { cn } from "../lib/utils";
import { EmptySurface } from "./empty";
import { Icon } from "./icon";

import controls from "./controls.module.css";
import menu from "./menu.module.css";
import overlay from "./overlay.module.css";
import styles from "./popover.module.css";

const PopoverOpenContext = React.createContext(false);
const PopoverStateContext = React.createContext<{
  setOpen: (open: boolean) => void;
  trigger: React.RefObject<HTMLButtonElement | null>;
} | null>(null);
const PopoverDrawerContext = React.createContext(false);

function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultOpen);
  const current = open ?? uncontrolled;
  const trigger = React.useRef<HTMLButtonElement | null>(null);
  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  };
  return (
    <PopoverOpenContext value={current}>
      <PopoverStateContext value={{ setOpen, trigger }}>
        <PopoverPrimitive.Root
          data-slot="popover"
          open={current}
          onOpenChange={setOpen}
          {...props}
        />
      </PopoverStateContext>
    </PopoverOpenContext>
  );
}

function PopoverTrigger({ ref, ...props }: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  const state = React.useContext(PopoverStateContext);
  return (
    <PopoverPrimitive.Trigger
      ref={(node) => {
        if (state) state.trigger.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="popover-trigger"
      {...props}
    />
  );
}
PopoverTrigger.displayName = "PopoverTrigger";

type DragOffset = { x: number; y: number };

const restingOffset: DragOffset = { x: 0, y: 0 };

const tabbable =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const dragKeys: Record<string, DragOffset | undefined> = {
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 }
};

function clampDragOffset(
  content: HTMLElement,
  current: DragOffset,
  next: DragOffset,
  padding: React.ComponentProps<typeof PopoverPrimitive.Content>["collisionPadding"],
  boundary: HTMLElement | undefined
): DragOffset {
  const inset =
    typeof padding === "number"
      ? { top: padding, right: padding, bottom: padding, left: padding }
      : { top: 0, right: 0, bottom: 0, left: 0, ...padding };
  const frame = boundary?.getBoundingClientRect();
  const viewport = document.documentElement;
  const minLeft = Math.max(frame?.left ?? 0, 0) + inset.left;
  const minTop = Math.max(frame?.top ?? 0, 0) + inset.top;
  const maxRight = Math.min(frame?.right ?? Infinity, viewport.clientWidth) - inset.right;
  const maxBottom = Math.min(frame?.bottom ?? Infinity, viewport.clientHeight) - inset.bottom;
  const rect = content.getBoundingClientRect();
  const left = rect.left - current.x;
  const top = rect.top - current.y;
  return {
    x: Math.max(minLeft - left, Math.min(next.x, maxRight - left - rect.width)),
    y: Math.max(minTop - top, Math.min(next.y, maxBottom - top - rect.height))
  };
}

const swipeStart = 6;
const swipeVelocity = 0.5;

function PopoverDrawer({
  open,
  className,
  style,
  children,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  ...props
}: React.ComponentPropsWithRef<typeof DialogPrimitive.Content> & { open: boolean }) {
  const state = React.useContext(PopoverStateContext);
  const [drag, setDrag] = React.useState(0);
  const [openedFor, setOpenedFor] = React.useState(open);
  if (open !== openedFor) {
    setOpenedFor(open);
    if (open) setDrag(0);
  }
  const swipe = React.useRef<
    { id: number; y: number; time: number; dragging: boolean } | undefined
  >(undefined);
  const release = (panel: HTMLElement, y: number) => {
    const start = swipe.current;
    swipe.current = undefined;
    if (!start?.dragging) return;
    const distance = Math.max(0, y - start.y);
    const velocity = distance / Math.max(1, performance.now() - start.time);
    if (distance > panel.offsetHeight / 4 || velocity > swipeVelocity) state?.setOpen(false);
    else setDrag(0);
  };
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => state?.setOpen(next)}>
      <DialogPrimitive.Portal container={usePortalContainer()}>
        <DialogPrimitive.Overlay
          data-slot="popover-drawer-overlay"
          className={cn("z-50", overlay.scrim)}
        />
        <DialogPrimitive.Content
          data-slot="popover-drawer"
          data-size="feed"
          data-side="bottom"
          data-dragging={drag > 0 || undefined}
          aria-describedby={undefined}
          {...props}
          className={cn("z-50", menu.surface, overlay.sheet, menu.feedDrawer, className)}
          style={drag ? { ...style, transform: `translateY(${drag}px)` } : style}
          onOpenAutoFocus={(event) => {
            onOpenAutoFocus?.(event);
            if (event.defaultPrevented) return;
            event.preventDefault();
            (event.currentTarget as HTMLElement).focus();
          }}
          onCloseAutoFocus={(event) => {
            onCloseAutoFocus?.(event);
            if (event.defaultPrevented) return;
            event.preventDefault();
            state?.trigger.current?.focus();
          }}
          onPointerDown={(event) => {
            onPointerDown?.(event);
            if (event.defaultPrevented || event.button !== 0) return;
            const target = event.target as HTMLElement;
            if (
              !target.closest('[data-slot="popover-drawer-grabber"], [data-slot="popover-header"]')
            )
              return;
            swipe.current = {
              id: event.pointerId,
              y: event.clientY,
              time: performance.now(),
              dragging: false
            };
          }}
          onPointerMove={(event) => {
            onPointerMove?.(event);
            const start = swipe.current;
            if (!start || start.id !== event.pointerId) return;
            const distance = event.clientY - start.y;
            if (!start.dragging) {
              if (Math.abs(distance) < swipeStart) return;
              if (distance < 0) {
                swipe.current = undefined;
                return;
              }
              start.dragging = true;
              start.y = event.clientY;
              start.time = performance.now();
              event.currentTarget.setPointerCapture(event.pointerId);
              return;
            }
            setDrag(Math.max(0, distance));
          }}
          onPointerUp={(event) => {
            onPointerUp?.(event);
            release(event.currentTarget, event.clientY);
          }}
          onPointerCancel={(event) => {
            onPointerCancel?.(event);
            swipe.current = undefined;
            setDrag(0);
          }}
        >
          <div data-slot="popover-drawer-grabber" className={menu.feedGrabber} aria-hidden />
          <PopoverDrawerContext value>{children}</PopoverDrawerContext>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function PopoverContent({
  className,
  collisionPadding = 8,
  align = "center",
  sideOffset = 4,
  surface = "card",
  size,
  draggable = false,
  onEscapeKeyDown,
  onOpenAutoFocus,
  style,
  children,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>, "draggable"> & {
  surface?: "card" | "menu";
  /**
   * feed is for a panel a person reopens to scan, like notifications, activity, recent items or
   * search results; never for a menu, a select or a short form. It holds a fixed height
   * (size-feed-height, capped at the space below the trigger) whatever the content, pins a
   * PopoverHeader and PopoverFooter while only the body scrolls, and lets an Empty or Loader in the
   * body fill it. Below the mobile breakpoint it opens as a bottom drawer at size-feed-drawer-height
   * on the same open state, dismissed by swiping it down, tapping outside or Escape.
   */
  size?: "feed";
  draggable?: boolean;
} & { ref?: React.Ref<React.ComponentRef<typeof PopoverPrimitive.Content>> }) {
  const escape = useOwnedEscape(ref, onEscapeKeyDown);
  const container = usePortalContainer();
  const boundary = useCollisionBoundary();
  const open = React.useContext(PopoverOpenContext);
  const [offset, setOffset] = React.useState(restingOffset);
  const [openedFor, setOpenedFor] = React.useState(open);
  if (open !== openedFor) {
    setOpenedFor(open);
    if (open) setOffset(restingOffset);
  }
  const content = React.useRef<HTMLElement | null>(null);
  const pointer = React.useRef<{ x: number; y: number; offset: DragOffset } | undefined>(undefined);
  const instructions = React.useId();
  const dragged = offset.x !== 0 || offset.y !== 0;
  const narrow = useIsMobile();
  const feed = size === "feed";

  const moveTo = (next: DragOffset) => {
    if (!content.current) return;
    setOffset(clampDragOffset(content.current, offset, next, collisionPadding, boundary));
  };
  const grab = (handle: HTMLElement) => {
    content.current = handle.closest<HTMLElement>('[data-slot="popover-content"]');
  };

  React.useEffect(() => {
    if (!dragged) return undefined;
    let frame = 0;
    const reclamp = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = content.current;
        if (node)
          setOffset((current) =>
            clampDragOffset(node, current, current, collisionPadding, boundary)
          );
      });
    };
    window.addEventListener("resize", reclamp);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", reclamp);
    };
  }, [dragged, collisionPadding, boundary]);

  const sections = feed
    ? splitOverlaySections(
        children,
        { header: PopoverHeader, footer: PopoverFooter },
        { pinHeader: true }
      )
    : null;
  const scroll = (content: React.ReactNode) => (
    <div data-slot="popover-scroll" data-scroll-fade="y" className={menu.scroller}>
      {content}
    </div>
  );
  const layout = (
    <FrameScope framed={false}>
      <EmptySurface>
        {sections ? (
          <>
            {sections.pinned}
            {scroll(sections.scroll)}
            {sections.footer}
          </>
        ) : (
          scroll(children)
        )}
      </EmptySurface>
    </FrameScope>
  );

  if (feed && narrow) {
    const {
      side,
      alignOffset,
      avoidCollisions,
      sticky,
      hideWhenDetached,
      arrowPadding,
      updatePositionStrategy,
      collisionBoundary,
      ...drawerProps
    } = props;
    return (
      <PopoverDrawer
        {...drawerProps}
        ref={escape.ref}
        open={open}
        className={className}
        style={style}
        onOpenAutoFocus={onOpenAutoFocus}
        onEscapeKeyDown={escape.onEscapeKeyDown}
      >
        {layout}
      </PopoverDrawer>
    );
  }

  return (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        ref={escape.ref}
        data-slot="popover-content"
        collisionPadding={collisionPadding}
        collisionBoundary={boundary}
        align={align}
        sideOffset={sideOffset}
        data-surface={surface}
        data-size={size}
        className={cn(
          "z-50",
          menu.surface,
          surface === "menu" ? menu.panel : menu.card,
          menu.scrollHost,
          menu.motion,
          className
        )}
        style={dragged ? { ...style, transform: `translate(${offset.x}px, ${offset.y}px)` } : style}
        {...props}
        onEscapeKeyDown={escape.onEscapeKeyDown}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          if (event.defaultPrevented) return;
          if (feed) {
            event.preventDefault();
            (event.currentTarget as HTMLElement).focus();
            return;
          }
          if (!draggable) return;
          event.preventDefault();
          const panel = event.currentTarget as HTMLElement;
          const field = Array.from(panel.querySelectorAll<HTMLElement>(tabbable)).find(
            (element) =>
              element.dataset.slot !== "popover-drag-handle" && !element.closest("[hidden]")
          );
          (field ?? panel).focus();
        }}
      >
        {draggable && (
          <button
            type="button"
            data-slot="popover-drag-handle"
            aria-label="Move"
            aria-describedby={instructions}
            className={cn(styles.dragHandle, controls.focusOutline)}
            onPointerDown={(event) => {
              if (event.button !== 0) return;
              grab(event.currentTarget);
              event.currentTarget.setPointerCapture(event.pointerId);
              pointer.current = { x: event.clientX, y: event.clientY, offset };
            }}
            onPointerMove={(event) => {
              const start = pointer.current;
              if (!start) return;
              moveTo({
                x: start.offset.x + event.clientX - start.x,
                y: start.offset.y + event.clientY - start.y
              });
            }}
            onPointerUp={() => {
              pointer.current = undefined;
            }}
            onLostPointerCapture={() => {
              pointer.current = undefined;
            }}
            onKeyDown={(event) => {
              const direction = dragKeys[event.key];
              if (!direction) return;
              event.preventDefault();
              grab(event.currentTarget);
              const step = parseFloat(
                getComputedStyle(event.currentTarget).getPropertyValue(
                  event.shiftKey ? "--cipher-space-48" : "--cipher-space-8"
                )
              );
              moveTo({ x: offset.x + direction.x * step, y: offset.y + direction.y * step });
            }}
          >
            <Icon icon={GripHorizontalIcon} />
            <span id={instructions} hidden>
              Use the arrow keys to move the popover. Hold Shift to move it further.
            </span>
          </button>
        )}
        {layout}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
PopoverContent.displayName = "PopoverContent";

function PopoverAnchor({
  asChild,
  virtualRef,
  ref,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  const node = React.useRef<HTMLDivElement | null>(null);
  const attach = React.useCallback(
    (element: HTMLDivElement | null) => {
      node.current = element;
      if (typeof ref === "function") ref(element);
      else if (ref) {
        ref.current = element;
      }
    },
    [ref]
  );
  // The trigger can re-claim the anchor on a later commit (StrictMode ref replays, re-mounts in a
  // Dialog) and a virtual anchor only re-announces when its element changes, so it remounts on
  // every open to point the popper back at this anchor.
  const generation = React.useContext(PopoverOpenContext) ? "open" : "closed";
  if (virtualRef)
    return (
      <PopoverPrimitive.Anchor
        key={generation}
        ref={ref}
        data-slot="popover-anchor"
        virtualRef={virtualRef}
        hidden
        {...props}
      />
    );
  // Radix registers a real anchor only when its node attaches, and its trigger re-mounts without
  // the anchor wrapper once a custom anchor exists, so the popper measures through a virtual ref.
  const Comp = asChild ? Slot.Root : "div";
  return (
    <>
      <Comp ref={attach} data-slot="popover-anchor" {...props} />
      <PopoverPrimitive.Anchor key={generation} virtualRef={node} hidden />
    </>
  );
}
PopoverAnchor.displayName = "PopoverAnchor";

function PopoverHeader({
  className,
  menu: leading,
  action,
  tabs,
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  /** An icon button before the title, such as a DropdownMenu of view options. */
  menu?: React.ReactNode;
  /** An icon button after the title, such as Mark all as read. */
  action?: React.ReactNode;
  /** Underline Tabs or a filter row under the title; at size feed they sit on the header's bottom rule. Pass a controlled Tabs so reopening keeps the active tab. */
  tabs?: React.ReactNode;
}) {
  return (
    <div
      ref={ref}
      data-slot="popover-header"
      data-tabs={tabs ? "" : undefined}
      className={cn("flex flex-col gap-0.5", styles.header, className)}
      {...props}
    >
      {leading || action ? (
        <div className={styles.headerRow}>
          {leading}
          <div className={styles.headerText}>{children}</div>
          {action}
        </div>
      ) : (
        children
      )}
      {tabs && (
        <div data-slot="popover-header-tabs" className={styles.headerTabs}>
          {tabs}
        </div>
      )}
    </div>
  );
}
PopoverHeader.displayName = "PopoverHeader";

function PopoverFooter({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div ref={ref} data-slot="popover-footer" className={cn(styles.footer, className)} {...props} />
  );
}
PopoverFooter.displayName = "PopoverFooter";

function PopoverTitle({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"h2"> & { ref?: React.Ref<HTMLHeadingElement> }) {
  const Title = React.useContext(PopoverDrawerContext) ? DialogPrimitive.Title : "h2";
  return (
    <Title ref={ref} data-slot="popover-title" className={cn("", className)} {...props}>
      {children}
    </Title>
  );
}
PopoverTitle.displayName = "PopoverTitle";

function PopoverDescription({ className, ref, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      ref={ref}
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}
PopoverDescription.displayName = "PopoverDescription";

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
};
