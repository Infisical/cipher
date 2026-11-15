import * as React from "react";
import { Dialog as SheetPrimitive } from "radix-ui";

import { usePortalContainer } from "../scope";
import { DiscardChangesAlertDialog } from "./alert-dialog";
import { Button } from "./button";
import { Icon } from "./icon";

import { FrameScope } from "../lib/frame-context";
import { focusFirstControl, formControlSelector } from "../lib/initial-focus";
import { OverlayPendingContext, useDismissGuard, useOverlayPending } from "../lib/overlay-pending";
import { renderInForm, splitOverlaySections } from "../lib/overlay-sections";
import { useOwnedEscape } from "../lib/use-owned-escape";
import { cn } from "../lib/utils";

import overlay from "./overlay.module.css";

type SheetSize = "sm" | "md" | "lg";
type SheetIntercept = {
  escape: () => boolean;
  close: (proceed: () => void) => boolean;
};
const SheetHostContext = React.createContext<{
  setViewSize: (size: SheetSize | undefined) => void;
  intercept: React.RefObject<SheetIntercept | null>;
} | null>(null);

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ref, ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger ref={ref} data-slot="sheet-trigger" {...props} />;
}
SheetTrigger.displayName = "SheetTrigger";

function SheetClose({
  ref,
  disabled,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  const pending = useOverlayPending();
  return (
    <SheetPrimitive.Close
      ref={ref}
      data-slot="sheet-close"
      disabled={disabled || pending}
      {...props}
    />
  );
}
SheetClose.displayName = "SheetClose";

function SheetPortal({ children, ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return (
    <SheetPrimitive.Portal container={usePortalContainer()} data-slot="sheet-portal" {...props}>
      <FrameScope framed={false}>{children}</FrameScope>
    </SheetPrimitive.Portal>
  );
}

function SheetOverlay({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      ref={ref}
      data-slot="sheet-overlay"
      className={cn("z-50", overlay.scrim, overlay.scrimSlow, className)}
      {...props}
    />
  );
}
SheetOverlay.displayName = "SheetOverlay";

const SheetLayout = ({
  head,
  scroll,
  footer
}: {
  head: React.ReactNode;
  scroll: React.ReactNode;
  footer: React.ReactNode;
}) => (
  <>
    {head && <div data-slot="sheet-head">{head}</div>}
    {scroll && (
      <div
        data-slot="sheet-scroll"
        data-scroll-fade="y"
        data-before-footer={Boolean(footer) || undefined}
      >
        {scroll}
      </div>
    )}
    {footer}
  </>
);

function SheetContent({
  className,
  children,
  side = "right",
  size = "sm",
  showCloseButton = true,
  pending = false,
  onEscapeKeyDown,
  onPointerDownOutside,
  onInteractOutside,
  onOpenAutoFocus,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left";
  size?: SheetSize;
  showCloseButton?: boolean;
  /** While true, Escape, outside clicks and every close control are blocked, so an in-flight save cannot be abandoned. */
  pending?: boolean;
} & { ref?: React.Ref<React.ComponentRef<typeof SheetPrimitive.Content>> }) {
  const escape = useOwnedEscape(ref, onEscapeKeyDown);
  const guard = useDismissGuard(pending, {
    onEscapeKeyDown: escape.onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside
  });
  const [viewSize, setViewSize] = React.useState<SheetSize>();
  const intercept = React.useRef<SheetIntercept | null>(null);
  const host = React.useMemo(() => ({ setViewSize, intercept }), []);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const closing = React.useRef(false);
  const proceed = () => {
    closing.current = true;
    closeRef.current?.click();
  };
  const interceptClose = (event: { preventDefault: () => void }) => {
    if (closing.current) {
      closing.current = false;
      return;
    }
    if (intercept.current?.close(proceed)) event.preventDefault();
  };
  const sections = splitOverlaySections(
    children,
    {
      header: SheetHeader,
      subheader: SheetSubheader,
      body: SheetBody,
      footer: SheetFooter
    },
    { pinHeader: true, lookThroughForm: true }
  );
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={escape.ref}
        data-slot="sheet-content"
        data-has-close={showCloseButton || undefined}
        data-scroll-fade={sections ? undefined : "y"}
        data-sections={sections ? "" : undefined}
        data-side={side}
        data-size={viewSize ?? size}
        className={cn(
          "fixed z-50 flex flex-col gap-4 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto",
          overlay.pop,
          overlay.sheet,
          className
        )}
        aria-busy={pending || undefined}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          focusFirstControl(event);
        }}
        {...props}
        {...guard}
        onEscapeKeyDown={(event) => {
          guard.onEscapeKeyDown(event);
          if (!event.defaultPrevented && intercept.current?.escape()) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          guard.onInteractOutside(event);
          if (!event.defaultPrevented) interceptClose(event);
        }}
      >
        <SheetHostContext value={host}>
          <OverlayPendingContext value={pending}>
            {sections
              ? renderInForm(
                  sections.form,
                  "sheet-form",
                  <SheetLayout
                    head={sections.pinned.length > 0 && sections.pinned}
                    scroll={sections.scroll.length > 0 && sections.scroll}
                    footer={sections.footer.length > 0 && sections.footer}
                  />
                )
              : children}
            {showCloseButton ? (
              <SheetPrimitive.Close data-slot="sheet-close" asChild>
                <Button
                  ref={closeRef}
                  variant="ghost"
                  className={overlay.close}
                  size="icon-sm"
                  disabled={pending}
                  onClick={interceptClose}
                >
                  <Icon name="x" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetPrimitive.Close>
            ) : (
              <SheetPrimitive.Close ref={closeRef} hidden tabIndex={-1} aria-hidden />
            )}
          </OverlayPendingContext>
        </SheetHostContext>
      </SheetPrimitive.Content>
    </SheetPortal>
  );
}
SheetContent.displayName = "SheetContent";

/**
 * The pinned layout for content that SheetContent cannot see: a view component that renders its own
 * header and footer, or a header wrapped in another component. header and footer are pinned and
 * children scroll between them, so pinning never depends on what the direct children are.
 */
function SheetSections({
  header,
  footer,
  children,
  className,
  ref,
  ...props
}: Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
} & { ref?: React.Ref<HTMLDivElement> }) {
  return (
    <div ref={ref} data-slot="sheet-sections" data-sections="" className={cn(className)} {...props}>
      <SheetLayout
        head={header}
        scroll={children}
        footer={footer && <div data-slot="sheet-foot">{footer}</div>}
      />
    </div>
  );
}
SheetSections.displayName = "SheetSections";

type SheetViewProps = {
  id: string;
  /** Names the view in a child's breadcrumb, such as the folder a New alert view belongs to. */
  title: string;
  /** The view Back returns to. Defaults to the first view. */
  parent?: string;
  /** The first view's own header, usually a SheetHeader with the SheetTitle. Child views get a back control and a breadcrumb title instead. */
  header?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  /** Widens the sheet while this view is shown. */
  size?: SheetSize;
  /** Back, Escape and the close button ask before leaving a view with unsaved changes. */
  dirty?: boolean;
  discardTitle?: string;
  discardDescription?: string;
  children?: React.ReactNode;
};

/** One level of a SheetViews stack. SheetViews reads its props; it renders nothing on its own. */
function SheetView(_: SheetViewProps): React.ReactNode {
  return null;
}
SheetView.displayName = "SheetView";

type SheetViewSlots = {
  subheader: HTMLElement | null;
  footer: HTMLElement | null;
  /** Leaves the view through its discard guard, as Back does. */
  back: () => void;
  /** Leaves the view without asking, once its work is saved. */
  done: () => void;
  setPending: (pending: boolean) => void;
};
const SheetViewContext = React.createContext<SheetViewSlots | null>(null);
/** The view a component renders in, for MultiStep's view variant: its subheader and footer slots and its exits. */
const useSheetView = () => React.useContext(SheetViewContext);

function SheetViewFrame({
  view,
  trail,
  active,
  onBack,
  onDone,
  backDisabled,
  setPending
}: {
  view: SheetViewProps;
  trail: string[];
  active: boolean;
  onBack: () => void;
  onDone: () => void;
  backDisabled: boolean;
  setPending: (pending: boolean) => void;
}) {
  const [subheader, setSubheader] = React.useState<HTMLElement | null>(null);
  const [footer, setFooter] = React.useState<HTMLElement | null>(null);
  const slots = React.useMemo(
    () => ({ subheader, footer, back: onBack, done: onDone, setPending }),
    [subheader, footer, onBack, onDone, setPending]
  );
  const header = trail.length ? (
    <SheetHeader>
      <div className={overlay.viewTitleRow}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={"Back to " + trail[trail.length - 1]}
          disabled={backDisabled}
          onClick={onBack}
        >
          <Icon name="chev-left" />
        </Button>
        <h2 data-slot="sheet-title" className={overlay.viewTitle}>
          {trail.map((name) => (
            <React.Fragment key={name}>
              <span className={overlay.viewTrail}>{name}</span>
              <span className={overlay.viewTrail} aria-hidden="true">
                {" / "}
              </span>
            </React.Fragment>
          ))}
          {view.title}
        </h2>
      </div>
      {view.description && <p data-slot="sheet-description">{view.description}</p>}
    </SheetHeader>
  ) : (
    view.header
  );
  return (
    <div
      data-slot="sheet-view"
      data-view={view.id}
      data-hidden={!active || undefined}
      data-sections=""
      className={overlay.view}
      {...(!active ? { inert: true, "aria-hidden": true } : {})}
    >
      <SheetViewContext value={slots}>
        <SheetLayout
          head={
            <>
              {header}
              <div ref={setSubheader} className={overlay.viewSlot} />
            </>
          }
          scroll={view.children}
          footer={
            <div data-slot="sheet-foot" className={overlay.viewFoot}>
              {view.footer}
              <div ref={setFooter} className={overlay.viewSlot} />
            </div>
          }
        />
      </SheetViewContext>
    </div>
  );
}

/**
 * A stack of views inside one SheetContent, such as a folder and a New alert flow opened from it.
 * The first SheetView is the base. Showing another view keeps the views under it mounted but hidden,
 * so their scroll and unsaved edits survive, and gives it a back control and a breadcrumb title.
 * Back, Escape, and Cancel on a nested MultiStep's first step return to the parent view; the close
 * button closes the whole sheet. Each asks first when a view it leaves is dirty.
 */
function SheetViews({
  view,
  onViewChange,
  children
}: {
  view: string;
  onViewChange: (view: string) => void;
  children: React.ReactNode;
}) {
  const host = React.useContext(SheetHostContext);
  const views = React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<SheetViewProps> =>
        React.isValidElement(child) && child.type === SheetView
    )
    .map((child) => child.props);
  const base = views[0];
  const byId = new Map(views.map((entry) => [entry.id, entry]));
  const chain: SheetViewProps[] = [];
  let entry: SheetViewProps | undefined = byId.get(view) ?? base;
  while (entry && !chain.includes(entry)) {
    chain.unshift(entry);
    entry = entry.id === base?.id ? undefined : byId.get(entry.parent ?? base?.id ?? "");
  }
  const current = chain[chain.length - 1];
  const parentOf = chain[chain.length - 2];
  const [pending, setPending] = React.useState(false);
  const returnFocus = React.useRef<HTMLElement | null>(null);
  const [discard, setDiscard] = React.useState<{
    proceed: () => void;
    title?: string;
    description?: string;
  }>();
  const ask = (dirty: SheetViewProps | undefined, proceed: () => void) => {
    if (!dirty) {
      proceed();
      return;
    }
    returnFocus.current = null;
    setDiscard({ proceed, title: dirty.discardTitle, description: dirty.discardDescription });
  };
  const back = () => {
    if (pending || !parentOf || !current) return;
    ask(current.dirty ? current : undefined, () => onViewChange(parentOf.id));
  };
  const done = () => {
    if (parentOf) onViewChange(parentOf.id);
  };
  const latest = React.useRef({ back, done });
  React.useLayoutEffect(() => {
    latest.current = { back, done };
  });
  const stableBack = React.useCallback(() => latest.current.back(), []);
  const stableDone = React.useCallback(() => latest.current.done(), []);
  React.useLayoutEffect(() => {
    if (!host) return;
    host.intercept.current = {
      escape: () => {
        if (chain.length < 2) return false;
        back();
        return true;
      },
      close: (proceed) => {
        const dirty = chain.slice(1).find((entry) => entry.dirty);
        if (!dirty) return false;
        ask(dirty, proceed);
        return true;
      }
    };
  });
  React.useLayoutEffect(() => {
    if (!host) return undefined;
    host.setViewSize(chain.length > 1 ? current?.size : undefined);
    return () => host.setViewSize(undefined);
  }, [host, chain.length, current?.size]);
  React.useLayoutEffect(
    () => () => {
      if (host) host.intercept.current = null;
    },
    [host]
  );
  const frames = React.useRef(new Map<string, HTMLDivElement>());
  const openers = React.useRef(new Map<string, HTMLElement>());
  const shown = React.useRef(current?.id);
  React.useLayoutEffect(() => {
    const previous = shown.current;
    shown.current = current?.id;
    if (!current || previous === current.id) return;
    if (previous !== undefined && !chain.some((entry) => entry.id === previous)) {
      const opener = openers.current.get(previous);
      openers.current.delete(previous);
      if (opener?.isConnected) {
        returnFocus.current = opener;
        opener.focus();
        return;
      }
    } else if (document.activeElement instanceof HTMLElement) {
      openers.current.set(current.id, document.activeElement);
    }
    const frame = frames.current.get(current.id);
    const target =
      frame?.querySelector<HTMLElement>('[data-slot="sheet-scroll"] ' + formControlSelector) ??
      frame?.querySelector<HTMLElement>("button, [href], [tabindex]:not([tabindex='-1'])");
    target?.focus({ preventScroll: true });
  });
  return (
    <div data-slot="sheet-views" className={overlay.views}>
      {chain.map((entry, index) => (
        <div
          key={entry.id}
          className={overlay.viewCell}
          ref={(node) => {
            if (node) frames.current.set(entry.id, node);
            else frames.current.delete(entry.id);
          }}
        >
          <SheetViewFrame
            view={entry}
            trail={chain.slice(0, index).map((item) => item.title)}
            active={entry === current}
            onBack={stableBack}
            onDone={stableDone}
            backDisabled={pending}
            setPending={setPending}
          />
        </div>
      ))}
      <DiscardChangesAlertDialog
        open={Boolean(discard)}
        onOpenChange={(open) => {
          if (!open) setDiscard(undefined);
        }}
        onDiscard={() => {
          const proceed = discard?.proceed;
          setDiscard(undefined);
          proceed?.();
        }}
        title={discard?.title}
        description={discard?.description}
        onCloseAutoFocus={(event) => {
          const target = returnFocus.current;
          returnFocus.current = null;
          if (!target?.isConnected) return;
          event.preventDefault();
          target.focus();
        }}
      />
    </div>
  );
}
SheetViews.displayName = "SheetViews";

function SheetHeader({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    />
  );
}
SheetHeader.displayName = "SheetHeader";

function SheetSubheader({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} data-slot="sheet-subheader" className={cn(className)} {...props} />;
}
SheetSubheader.displayName = "SheetSubheader";

function SheetBody({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { ref?: React.Ref<HTMLDivElement> }) {
  return <div ref={ref} data-slot="sheet-body" className={cn(className)} {...props} />;
}
SheetBody.displayName = "SheetBody";

function SheetFooter({ className, ref, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      ref={ref}
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-wrap items-center justify-end gap-2 p-4", className)}
      {...props}
    />
  );
}
SheetFooter.displayName = "SheetFooter";

function SheetTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
}
SheetTitle.displayName = "SheetTitle";

function SheetDescription({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetSections,
  SheetSubheader,
  SheetTitle,
  SheetTrigger,
  SheetView,
  SheetViews,
  useSheetView
};
