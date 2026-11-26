import * as React from "react";
import { flushSync } from "react-dom";
import { Slot, Tooltip as TooltipPrimitive } from "radix-ui";

import { overlayCollisionPadding, useCollisionBoundary, usePortalContainer } from "../scope";

import { interactiveControl, RowDescriptionContext } from "../lib/row-description";
import { cn } from "../lib/utils";
import { Kbd } from "./kbd";

import controls from "./controls.module.css";
import menu from "./menu.module.css";

const navigationKeys = new Set([
  "Tab",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End"
]);
let lastNavigationKeyAt = -Infinity;
const tapAttribute = "data-tooltip-tap";
const tapToggles = new WeakMap<Element, () => void>();
const tapClicks = new WeakSet<Event>();
let tapped: Element | null = null;
if (typeof document !== "undefined") {
  document.addEventListener(
    "keydown",
    (event) => {
      lastNavigationKeyAt = navigationKeys.has(event.key) ? performance.now() : -Infinity;
    },
    true
  );
  document.addEventListener(
    "pointerdown",
    (event) => {
      lastNavigationKeyAt = -Infinity;
      tapped =
        event.pointerType === "touch" && event.target instanceof Element
          ? event.target.closest(`[${tapAttribute}]`)
          : null;
      if (tapped) tapToggles.get(tapped)?.();
    },
    true
  );
  document.addEventListener(
    "click",
    (event) => {
      if (tapped && event.target instanceof Node && tapped.contains(event.target)) {
        event.preventDefault();
        tapClicks.add(event);
      }
      tapped = null;
    },
    true
  );
}
const skipTapClick =
  (onClick?: React.MouseEventHandler<HTMLElement>) => (event: React.MouseEvent<HTMLElement>) => {
    if (!tapClicks.has(event.nativeEvent)) onClick?.(event);
  };
/** Radix closes every open tooltip on this event when one opens; a tap opens without Radix, so it sends it itself. */
const closeOtherTooltips = () => document.dispatchEvent(new CustomEvent("tooltip.open"));
const focusedByKeyboard = () => performance.now() - lastNavigationKeyAt < 1000;
const coveredByOverlay = (trigger: Element) =>
  trigger.getAttribute("aria-expanded") === "true" ||
  getComputedStyle(document.body).pointerEvents === "none";

const ProvidedContext = React.createContext(false);

function TooltipProvider({
  delayDuration = 200,
  disableHoverableContent = true,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      disableHoverableContent={disableHoverableContent}
      {...props}
    >
      <ProvidedContext value>{children}</ProvidedContext>
    </TooltipPrimitive.Provider>
  );
}

/** Adds a TooltipProvider only where no ancestor has one, so the app's delay and skip-delay group still apply. */
function EnsureTooltipProvider({ children }: { children: React.ReactNode }) {
  return React.useContext(ProvidedContext) ? (
    children
  ) : (
    <TooltipProvider>{children}</TooltipProvider>
  );
}

type TooltipSide = "top" | "right" | "bottom" | "left";
type TooltipAlign = "start" | "center" | "end";
type SharedEntry = {
  content: React.ReactNode;
  shortcut?: string;
  side: TooltipSide;
  align: TooltipAlign;
};
type SharedStore = {
  entries: Map<string, SharedEntry>;
  listener: ((id: string) => void) | null;
  set: (id: string, entry: SharedEntry | null) => void;
};
type TriggerHandlers = Pick<
  React.ComponentProps<"button">,
  "onPointerMove" | "onPointerLeave" | "onPointerDown" | "onFocus" | "onBlur" | "onClick"
>;
type AnchorHandle = { ref: React.Ref<HTMLElement> | undefined; handlers: TriggerHandlers };

const sharedAttribute = "data-cipher-tooltip";
const TooltipScopeContext = React.createContext<SharedStore | null>(null);

function SharedAnchor({
  handle,
  ref,
  ...handlers
}: TriggerHandlers & {
  handle: React.RefObject<AnchorHandle | null>;
  ref?: React.Ref<HTMLElement>;
}) {
  React.useLayoutEffect(() => {
    handle.current = { ref, handlers };
  });
  return null;
}

function SharedTooltipHost({ store }: { store: SharedStore }) {
  const [mounted, setMounted] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const openRef = React.useRef(open);
  const holdOpen = React.useRef(false);
  React.useLayoutEffect(() => {
    openRef.current = open;
  });
  const [, refresh] = React.useReducer((count: number) => count + 1, 0);
  const contentId = React.useId();
  const handle = React.useRef<AnchorHandle | null>(null);
  const pending = React.useRef<((anchor: AnchorHandle) => void)[]>([]);
  const element = React.useRef<HTMLElement | null>(null);

  React.useLayoutEffect(() => {
    if (!handle.current || !pending.current.length) return;
    queueMicrotask(() => {
      const anchor = handle.current;
      const queued = pending.current;
      pending.current = [];
      if (anchor) queued.forEach((run) => run(anchor));
    });
  });

  React.useEffect(() => {
    const pressed = new WeakSet<Element>();
    let hovered: HTMLElement | null = null;
    const run = (step: (anchor: AnchorHandle) => void) => {
      if (handle.current) step(handle.current);
      else {
        pending.current.push(step);
        setMounted(true);
      }
    };
    const call = (name: keyof TriggerHandlers, event: Event | { defaultPrevented: boolean }) =>
      run((anchor) => (anchor.handlers[name] as ((event: unknown) => void) | undefined)?.(event));
    const attach = (target: HTMLElement) => {
      if (element.current === target) return;
      element.current = target;
      setActiveId(target.getAttribute(sharedAttribute));
      run((anchor) => {
        const { ref } = anchor;
        if (typeof ref === "function") ref(target);
        else if (ref) ref.current = target;
      });
    };
    const find = (target: EventTarget | null) => {
      const trigger =
        target instanceof Element ? target.closest<HTMLElement>(`[${sharedAttribute}]`) : null;
      const id = trigger?.getAttribute(sharedAttribute);
      return id && store.entries.has(id) ? trigger : null;
    };
    const leave = (event: Event) => {
      const target = hovered;
      hovered = null;
      if (!target) return;
      if (target === element.current) call("onPointerLeave", event);
      if (!coveredByOverlay(target)) pressed.delete(target);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const trigger = find(event.target);
      if (trigger !== hovered) leave(event);
      if (!trigger) return;
      hovered = trigger;
      if (pressed.has(trigger)) return;
      attach(trigger);
      call("onPointerMove", event);
    };
    const onPointerOut = (event: PointerEvent) => {
      if (!hovered || !(event.target instanceof Node) || !hovered.contains(event.target)) return;
      if (!(event.relatedTarget instanceof Node && hovered.contains(event.relatedTarget)))
        leave(event);
    };
    const onPointerDown = (event: PointerEvent) => {
      const trigger = find(event.target);
      if (!trigger) return;
      pressed.add(trigger);
      const shown = openRef.current && trigger === element.current;
      if (trigger === element.current) call("onPointerDown", event);
      if (event.pointerType !== "touch" || !trigger.hasAttribute(tapAttribute)) return;
      if (shown) setOpen(false);
      else {
        closeOtherTooltips();
        attach(trigger);
        run(() => setOpen(true));
        holdOpen.current = true;
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      const trigger = find(event.target);
      if (!trigger || pressed.has(trigger) || !focusedByKeyboard()) return;
      attach(trigger);
      call("onFocus", event);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (element.current && find(event.target) === element.current) call("onBlur", event);
    };
    const onPointerCancel = () => {
      holdOpen.current = false;
    };
    const onClick = (event: MouseEvent) => {
      if (holdOpen.current)
        setTimeout(() => {
          holdOpen.current = false;
        });
      if (element.current && find(event.target) === element.current) call("onClick", event);
    };
    store.listener = (id) => {
      if (!element.current || element.current.getAttribute(sharedAttribute) !== id) return;
      if (store.entries.has(id)) {
        refresh();
        return;
      }
      call("onPointerLeave", { defaultPrevented: false });
      element.current = null;
      setActiveId(null);
    };
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("pointerout", onPointerOut, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("pointercancel", onPointerCancel, true);
    return () => {
      store.listener = null;
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerout", onPointerOut, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("focusout", onFocusOut, true);
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("pointercancel", onPointerCancel, true);
    };
  }, [store]);

  React.useLayoutEffect(() => {
    const target = element.current;
    if (!open || !target || target.hasAttribute("aria-describedby")) return undefined;
    target.setAttribute("aria-describedby", contentId);
    return () => target.removeAttribute("aria-describedby");
  }, [open, activeId, contentId]);

  if (!mounted) return null;
  const entry = activeId ? store.entries.get(activeId) : undefined;
  return (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      disableHoverableContent
      open={open}
      onOpenChange={(next) => {
        if (!next && holdOpen.current) return;
        flushSync(() => setOpen(next));
      }}
    >
      <TooltipPrimitive.Trigger asChild>
        <SharedAnchor handle={handle} />
      </TooltipPrimitive.Trigger>
      {entry && (
        <TooltipContent id={contentId} side={entry.side} align={entry.align}>
          <span className={menu.tooltipText}>{entry.content}</span>
          {entry.shortcut && <Kbd>{entry.shortcut}</Kbd>}
        </TooltipContent>
      )}
    </TooltipPrimitive.Root>
  );
}

/**
 * Shares one tooltip among every Tooltip inside it: each trigger renders only its element, marked with
 * data-cipher-tooltip, and the scope mounts a single Radix tooltip on the first hover or keyboard focus and
 * moves it to whichever trigger is active. Table renders one around its rows.
 */
function TooltipScope({ children }: { children?: React.ReactNode }) {
  const [store] = React.useState<SharedStore>(() => {
    const entries = new Map<string, SharedEntry>();
    const shared: SharedStore = {
      entries,
      listener: null,
      set: (id, entry) => {
        if (entry) entries.set(id, entry);
        else if (!entries.delete(id)) return;
        shared.listener?.(id);
      }
    };
    return shared;
  });
  return (
    <TooltipScopeContext.Provider value={store}>
      {children}
      <EnsureTooltipProvider>
        <SharedTooltipHost store={store} />
      </EnsureTooltipProvider>
    </TooltipScopeContext.Provider>
  );
}

function SharedTooltip({
  store,
  content,
  shortcut,
  side,
  align,
  tap,
  children
}: SharedEntry & { store: SharedStore; tap: boolean; children: React.ReactElement }) {
  const id = React.useId();
  React.useLayoutEffect(() => {
    store.set(id, content ? { content, shortcut, side, align } : null);
  }, [store, id, content, shortcut, side, align]);
  React.useLayoutEffect(() => () => store.set(id, null), [store, id]);
  return content
    ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        [sharedAttribute]: id,
        [tapAttribute]: tap ? "" : undefined
      })
    : children;
}

function Tooltip({
  content,
  shortcut,
  side = "top",
  align = "center",
  wrap: _wrap,
  disableHoverableContent = true,
  openOnTap = false,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  content?: React.ReactNode;
  shortcut?: string;
  side?: TooltipSide;
  align?: TooltipAlign;
  /** @deprecated Tooltips always wrap at size-tooltip-max; this has no effect. */
  wrap?: boolean;
  /** On a touch device a tap on the trigger toggles the tooltip, and a tap elsewhere or Escape closes it. The tap does not activate the trigger. Hover and keyboard focus are unchanged. */
  openOnTap?: boolean;
}) {
  const store = React.useContext(TooltipScopeContext);
  const [tapOpen, setTapOpen] = React.useState(props.defaultOpen ?? false);
  const tapOpenRef = React.useRef(tapOpen);
  React.useLayoutEffect(() => {
    tapOpenRef.current = tapOpen;
  });
  const tap = openOnTap && props.open === undefined;
  const changeTapOpen = (next: boolean) => {
    setTapOpen(next);
    props.onOpenChange?.(next);
  };
  const trigger =
    openOnTap && React.isValidElement<{ onClick?: React.MouseEventHandler<HTMLElement> }>(children)
      ? React.cloneElement(children, { onClick: skipTapClick(children.props.onClick) })
      : children;
  if (
    store &&
    disableHoverableContent &&
    props.open === undefined &&
    props.defaultOpen === undefined &&
    props.onOpenChange === undefined &&
    props.delayDuration === undefined &&
    React.isValidElement(children)
  )
    return (
      <SharedTooltip
        store={store}
        content={content}
        shortcut={shortcut}
        side={side}
        align={align}
        tap={openOnTap}
      >
        {trigger as React.ReactElement}
      </SharedTooltip>
    );
  const tooltip = (
    <TooltipPrimitive.Root
      data-slot="tooltip"
      disableHoverableContent={disableHoverableContent}
      {...props}
      {...(tap && {
        open: tapOpen,
        onOpenChange: changeTapOpen
      })}
    >
      {content ? (
        <>
          <TooltipTrigger
            asChild
            {...(tap && {
              [tapAttribute]: "",
              ref: (node: HTMLButtonElement | null) => {
                if (!node) return;
                tapToggles.set(node, () => {
                  if (!tapOpenRef.current) closeOtherTooltips();
                  changeTapOpen(!tapOpenRef.current);
                });
              }
            })}
          >
            {trigger}
          </TooltipTrigger>
          <TooltipContent side={side} align={align} data-has-kbd={shortcut ? "" : undefined}>
            <span className={menu.tooltipText}>{content}</span>
            {shortcut && <Kbd>{shortcut}</Kbd>}
          </TooltipContent>
        </>
      ) : (
        children
      )}
    </TooltipPrimitive.Root>
  );
  return <EnsureTooltipProvider>{tooltip}</EnsureTooltipProvider>;
}

/**
 * Opens on hover and on keyboard focus only. Focus that a closing menu, dialog or sheet returns to the
 * trigger never opens it, and after a click it stays closed until the pointer leaves and comes back.
 */
function TooltipTrigger({
  ref,
  onPointerDown,
  onPointerMove,
  onPointerLeave,
  onFocus,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  const pressed = React.useRef(false);
  return (
    <TooltipPrimitive.Trigger
      ref={ref}
      data-slot="tooltip-trigger"
      onPointerDown={(event) => {
        onPointerDown?.(event);
        pressed.current = true;
        if (event.pointerType === "touch" && event.currentTarget.hasAttribute(tapAttribute))
          event.preventDefault();
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (pressed.current) event.preventDefault();
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (!coveredByOverlay(event.currentTarget)) pressed.current = false;
        if (event.pointerType === "touch") event.preventDefault();
      }}
      onFocus={(event) => {
        onFocus?.(event);
        if (pressed.current || !focusedByKeyboard()) event.preventDefault();
      }}
      {...props}
    />
  );
}
TooltipTrigger.displayName = "TooltipTrigger";

function TooltipContent({
  className,
  collisionPadding = overlayCollisionPadding,
  sideOffset = 0,
  children,
  ref,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal container={usePortalContainer()}>
      <TooltipPrimitive.Content
        ref={ref}
        data-slot="tooltip-content"
        collisionPadding={collisionPadding}
        collisionBoundary={useCollisionBoundary()}
        sideOffset={sideOffset}
        className={cn("z-50", menu.tooltip, menu.motion, className)}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow width={10} height={5} className={menu.tooltipArrow} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}
TooltipContent.displayName = "TooltipContent";

const interactiveRoles = new Set([
  "button",
  "checkbox",
  "combobox",
  "link",
  "menuitem",
  "switch",
  "tab"
]);

function TooltipText({
  content,
  side,
  align,
  asChild = false,
  openOnTap,
  className,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"span">, "content"> & {
  /** The supplementary text the tooltip shows on hover and keyboard focus. */
  content: React.ReactNode;
  side?: TooltipSide;
  align?: TooltipAlign;
  /** Make the child element (StatusText, MiddleTruncate) the focusable text instead of a span. In an activatable table row non-interactive text is no tab stop of its own: clicks and Enter reach the row, and the row's description carries the tooltip text. */
  asChild?: boolean;
  openOnTap?: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}) {
  const Comp = asChild ? Slot.Root : "span";
  const describeRow = React.useContext(RowDescriptionContext);
  const descriptionId = React.useId();
  const trigger = React.useRef<HTMLSpanElement | null>(null);
  const child = asChild && React.isValidElement(props.children) ? props.children : undefined;
  const own = { ...props, ...(child?.props as object | undefined) } as {
    role?: unknown;
    onClick?: unknown;
    onKeyDown?: unknown;
    disabled?: unknown;
  };
  const independent =
    (typeof own.role === "string" && interactiveRoles.has(own.role)) ||
    Boolean(own.onClick || own.onKeyDown);
  const disabled = Boolean(own.disabled);
  const passThrough = Boolean(describeRow) && !independent;
  React.useLayoutEffect(() => {
    const node = trigger.current;
    if (!describeRow) return undefined;
    const nodeDisabled = disabled || Boolean(node?.matches(":disabled"));
    if (independent && !nodeDisabled) return undefined;
    if (!nodeDisabled && node?.matches(interactiveControl)) return undefined;
    return describeRow(descriptionId);
  }, [describeRow, descriptionId, independent, disabled, child?.type]);
  return (
    <>
      <Tooltip content={content} side={side} align={align} openOnTap={openOnTap}>
        <Comp
          ref={(node: HTMLSpanElement | null) => {
            trigger.current = node;
            if (typeof ref === "function") return ref(node);
            if (ref) ref.current = node;
          }}
          data-slot="tooltip-text"
          data-tooltip-text={independent ? undefined : ""}
          tabIndex={passThrough ? undefined : 0}
          className={cn(controls.focusOutline, className)}
          {...props}
        />
      </Tooltip>
      {describeRow && (
        <span id={descriptionId} hidden>
          {content}
        </span>
      )}
    </>
  );
}
TooltipText.displayName = "TooltipText";

const stretchedHost =
  'tr[data-stretched-link], [data-slot="card"][data-stretched-link], [data-slot="stat-card"][data-stretched-link]';

const ownControl =
  "a[href], button, input, select, textarea, summary, [role=button], [role=checkbox], [role=combobox], [role=link], [role=menuitem], [role=switch], [role=tab]";

/** A reason trigger sits above a row's stretched link so hovering it shows the reason, so it hands clicks on to that link, modifier keys and middle button included. A trigger that is a control of its own keeps its clicks. */
function forwardToStretchedLink(event: React.MouseEvent<HTMLElement>) {
  if (event.defaultPrevented) return;
  const trigger = event.currentTarget;
  const control = event.target instanceof Element ? event.target.closest(ownControl) : null;
  if (control && trigger.contains(control)) return;
  const link = trigger
    .closest(stretchedHost)
    ?.querySelector<HTMLElement>('[data-row-link], a[data-slot="card-link"]');
  if (!link || trigger.contains(link) || link.contains(trigger)) return;
  const selection = window.getSelection();
  if (selection && !selection.isCollapsed && trigger.contains(selection.anchorNode)) return;
  link.dispatchEvent(new MouseEvent("click", event.nativeEvent));
}

function forwardMiddleClick(event: React.MouseEvent<HTMLElement>) {
  if (event.button === 1) forwardToStretchedLink(event);
}

/**
 * Says why: Button's disabledReason and the reason on Badge and StatusText. wrap shows the reason in a
 * tooltip that also opens on a tap on touch devices, adding a provider where none is above it, and with
 * focusable the element becomes a TooltipText tab stop. Put
 * description inside the element and pass its aria-describedby through describedBy, so the reason is
 * its accessible description even while the tooltip is closed.
 */
function useReason(reason: React.ReactNode) {
  const id = React.useId();
  const active = Boolean(reason);
  return {
    active,
    describedBy: (own?: string) => (active ? [own, id].filter(Boolean).join(" ") : own),
    description: active ? (
      <span id={id} hidden>
        {reason}
      </span>
    ) : null,
    wrap: (
      element: React.ReactElement<{ onClick?: React.MouseEventHandler<HTMLElement> }>,
      focusable = false
    ) =>
      active ? (
        <EnsureTooltipProvider>
          {focusable ? (
            <TooltipText
              asChild
              openOnTap
              content={reason}
              data-reason-trigger=""
              onClick={forwardToStretchedLink}
              onAuxClick={forwardMiddleClick}
            >
              {React.cloneElement(element, { onClick: skipTapClick(element.props.onClick) })}
            </TooltipText>
          ) : (
            <Tooltip content={reason} openOnTap>
              {element}
            </Tooltip>
          )}
        </EnsureTooltipProvider>
      ) : (
        element
      )
  };
}

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipScope,
  TooltipText,
  TooltipTrigger,
  useReason
};
