import * as React from "react";
import { Dialog as SheetPrimitive, Slot } from "radix-ui";

import { usePortalContainer } from "../scope";
import { DiscardChangesAlertDialog } from "./alert-dialog";
import { Button } from "./button";
import { Icon } from "./icon";
import { Panes, type PanesState } from "./layout";
import { Tabs, TabsList, TabsTrigger } from "./tabs";

import { FrameScope } from "../lib/frame-context";
import { focusFirstControl, formControlSelector } from "../lib/initial-focus";
import { OverlayPendingContext, useDismissGuard, useOverlayPending } from "../lib/overlay-pending";
import { flattenFragments, renderInForm, splitOverlaySections } from "../lib/overlay-sections";
import { useOwnedEscape } from "../lib/use-owned-escape";
import { cn } from "../lib/utils";

import overlay from "./overlay.module.css";

type SheetSize = "sm" | "md" | "lg" | "xl";
type SheetIntercept = {
  escape: () => boolean;
  close: (proceed: () => void) => boolean;
};
type SheetViewLabels = { title?: string; description?: string };
const SheetHostContext = React.createContext<{
  setViewSize: (size: SheetSize | undefined) => void;
  setViewPending: (pending: boolean) => void;
  setViewLabels: (labels: SheetViewLabels | undefined) => void;
  intercept: React.RefObject<SheetIntercept | null>;
  interceptClose: (event: { preventDefault: () => void }) => void;
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
  onClick,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  const pending = useOverlayPending();
  const host = React.useContext(SheetHostContext);
  return (
    <SheetPrimitive.Close
      ref={ref}
      data-slot="sheet-close"
      disabled={disabled || pending}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) host?.interceptClose(event);
      }}
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
  const [viewPending, setViewPending] = React.useState(false);
  const blocked = pending || viewPending;
  const guard = useDismissGuard(blocked, {
    onEscapeKeyDown: escape.onEscapeKeyDown,
    onPointerDownOutside,
    onInteractOutside
  });
  const [viewSize, setViewSize] = React.useState<SheetSize>();
  const [viewLabels, setViewLabels] = React.useState<SheetViewLabels>();
  const intercept = React.useRef<SheetIntercept | null>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const closing = React.useRef(false);
  const host = React.useMemo(() => {
    const proceed = () => {
      closing.current = true;
      closeRef.current?.click();
      closing.current = false;
    };
    return {
      setViewSize,
      setViewPending,
      setViewLabels,
      intercept,
      interceptClose: (event: { preventDefault: () => void }) => {
        if (closing.current) return;
        if (intercept.current?.close(proceed)) event.preventDefault();
      }
    };
  }, []);
  const top = flattenFragments(children);
  const aside = top.find(
    (child): child is React.ReactElement<SheetAsideProps> =>
      React.isValidElement(child) && child.type === SheetAside
  );
  const rest = aside ? top.filter((child) => child !== aside) : children;
  const detailsTabId = React.useId();
  const detailsPanelId = React.useId();
  const sections = splitOverlaySections(
    rest,
    {
      header: SheetHeader,
      subheader: SheetSubheader,
      body: SheetBody,
      footer: SheetFooter
    },
    { pinHeader: true, lookThroughForm: true }
  );
  const content = sections
    ? renderInForm(
        sections.form,
        "sheet-form",
        <SheetLayout
          head={sections.pinned.length > 0 && sections.pinned}
          scroll={sections.scroll.length > 0 && sections.scroll}
          footer={sections.footer.length > 0 && sections.footer}
        />
      )
    : rest;
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={escape.ref}
        data-slot="sheet-content"
        data-has-close={showCloseButton || undefined}
        data-scroll-fade={sections || aside ? undefined : "y"}
        data-sections={sections || aside ? "" : undefined}
        data-panes={aside ? "" : undefined}
        data-side={side}
        data-size={viewSize ?? size}
        className={cn(
          "fixed z-50 flex flex-col gap-4 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto",
          overlay.pop,
          overlay.sheet,
          className
        )}
        aria-busy={blocked || undefined}
        onOpenAutoFocus={(event) => {
          onOpenAutoFocus?.(event);
          focusFirstControl(event);
        }}
        {...props}
        {...(viewLabels?.title ? { "aria-labelledby": viewLabels.title } : {})}
        {...(viewLabels
          ? { "aria-describedby": viewLabels.description ?? props["aria-describedby"] }
          : {})}
        {...guard}
        onEscapeKeyDown={(event) => {
          guard.onEscapeKeyDown(event);
          if (!event.defaultPrevented && intercept.current?.escape()) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          guard.onInteractOutside(event);
          if (!event.defaultPrevented) host.interceptClose(event);
        }}
      >
        <SheetHostContext value={host}>
          <SheetViewDescribeContext value={null}>
            <OverlayPendingContext value={blocked}>
              {aside ? (
                <Panes
                  identity={{
                    media: aside.props.media,
                    title: <SheetTitle>{aside.props.title}</SheetTitle>,
                    description: aside.props.description && (
                      <SheetDescription>{aside.props.description}</SheetDescription>
                    ),
                    badges: aside.props.badges
                  }}
                  aside={aside.props.children}
                  asideLabel={aside.props.label}
                  asideClassName={aside.props.className}
                >
                  {(panes) => (
                    <div data-slot="sheet-main" data-sections="">
                      {renderAsideMain({
                        panes,
                        aside: aside.props,
                        sections,
                        rest,
                        detailsTabId,
                        detailsPanelId
                      })}
                    </div>
                  )}
                </Panes>
              ) : (
                content
              )}
              {showCloseButton ? (
                <SheetPrimitive.Close data-slot="sheet-close" asChild>
                  <Button
                    ref={closeRef}
                    variant="ghost"
                    className={overlay.close}
                    size="icon-sm"
                    disabled={blocked}
                    onClick={host.interceptClose}
                  >
                    <Icon name="x" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetPrimitive.Close>
              ) : (
                <SheetPrimitive.Close ref={closeRef} hidden tabIndex={-1} aria-hidden />
              )}
            </OverlayPendingContext>
          </SheetViewDescribeContext>
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

type SheetAsideProps = {
  /** Names the aside landmark and, in the narrow layout, its tab. Defaults to Details. */
  label?: string;
  /**
   * Names the main pane's tab in the narrow layout when the sheet's header has no tabs of its own,
   * such as Configuration. Required because SheetAside cannot see the header; a header with tabs
   * keeps its own labels and this goes unused.
   */
  mainLabel: string;
  className?: string;
  media?: React.ReactNode;
  /** The sheet's title, rendered as its SheetTitle. */
  title: React.ReactNode;
  description?: React.ReactNode;
  badges?: React.ReactNode;
  /** The aside body, such as a summary DataList. */
  children?: React.ReactNode;
};

/**
 * The fixed left pane of a two-pane sheet. It declares the identity (media, title, description,
 * badges) and, as children, the body such as a summary DataList. As a direct child of SheetContent
 * (outside any form) it splits the sheet, and the header, tabs, body, footer or SheetViews beside
 * it form the main pane. Use it with size="xl". Below size-pane-collapse the identity becomes the
 * fixed header and the body becomes the first header tab (label). A header with controlled Tabs
 * and a TabsList keeps its tabs after it; otherwise a second tab, mainLabel, holds the main pane.
 * The sheet opens on the main pane's tab either way. Only a header that is a direct child of
 * SheetContent merges its tabs: beside SheetViews or SheetSections the Details and mainLabel tabs
 * sit above their headers, so keep tabs out of those headers or give the sheet a direct header.
 */
function SheetAside(_: SheetAsideProps): React.ReactNode {
  return null;
}
SheetAside.displayName = "SheetAside";

const DETAILS_TAB = "cipher-sheet-aside-details";
const MAIN_TAB = "cipher-sheet-aside-main";

type TabsElement = React.ReactElement<React.ComponentProps<typeof Tabs>>;

const withDetailsTab = (
  tabs: React.ReactNode,
  label: string,
  open: boolean,
  setOpen: (open: boolean) => void,
  triggerId: string,
  panelId: string
) => {
  if (!React.isValidElement(tabs) || tabs.type !== Tabs) return null;
  const element = tabs as TabsElement;
  if (element.props.value === undefined || element.props.tabs) return null;
  let found = false;
  const children = React.Children.map(element.props.children, (child) => {
    if (!React.isValidElement<{ children?: React.ReactNode }>(child) || child.type !== TabsList)
      return child;
    found = true;
    return React.cloneElement(
      child,
      undefined,
      <TabsTrigger key={DETAILS_TAB} value={DETAILS_TAB} id={triggerId} aria-controls={panelId}>
        {label}
      </TabsTrigger>,
      child.props.children
    );
  });
  if (!found) return null;
  return React.cloneElement(
    element,
    {
      value: open ? DETAILS_TAB : element.props.value,
      onChange: undefined,
      onValueChange: (value: string) => {
        setOpen(value === DETAILS_TAB);
        if (value === DETAILS_TAB) return;
        element.props.onValueChange?.(value);
        element.props.onChange?.(value);
      }
    },
    children
  );
};

type Sections = ReturnType<typeof splitOverlaySections>;

const hide = (node: React.ReactNode, hidden: boolean) =>
  React.isValidElement<{ "data-hidden"?: boolean }>(node)
    ? React.cloneElement(node, { "data-hidden": hidden || undefined })
    : node;

/**
 * The main pane beside a SheetAside, with the aside body as the first header tab while narrow.
 * Both widths render the same tree so the main pane's state survives a resize.
 */
function renderAsideMain({
  panes,
  aside,
  sections,
  rest,
  detailsTabId,
  detailsPanelId
}: {
  panes: PanesState;
  aside: SheetAsideProps;
  sections: Sections;
  rest: React.ReactNode;
  detailsTabId: string;
  detailsPanelId: string;
}) {
  const { narrow, detailsOpen: open, setDetailsOpen } = panes;
  const label = aside.label ?? "Details";
  const mainTabId = detailsTabId + "main";
  const mainPanelId = detailsPanelId + "main";
  const pinned = sections?.pinned ?? [];
  const tabbedIndex = pinned.findIndex(
    (child) =>
      React.isValidElement<{ tabs?: React.ReactNode }>(child) &&
      child.type === SheetHeader &&
      Boolean(child.props.tabs)
  );
  const tabbedHeader = pinned[tabbedIndex] as
    React.ReactElement<{ tabs?: React.ReactNode }> | undefined;
  const tabs =
    narrow && tabbedHeader
      ? withDetailsTab(
          tabbedHeader.props.tabs,
          label,
          open,
          setDetailsOpen,
          detailsTabId,
          detailsPanelId
        )
      : null;
  const ownTabs = narrow && !tabs && (
    <SheetHeader
      tabs={
        <Tabs
          value={open ? DETAILS_TAB : MAIN_TAB}
          onValueChange={(value) => setDetailsOpen(value === DETAILS_TAB)}
        >
          <TabsList>
            <TabsTrigger value={DETAILS_TAB} id={detailsTabId} aria-controls={detailsPanelId}>
              {label}
            </TabsTrigger>
            <TabsTrigger value={MAIN_TAB} id={mainTabId} aria-controls={mainPanelId}>
              {aside.mainLabel}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      }
    />
  );
  const mainPanel = ownTabs
    ? { role: "tabpanel", id: mainPanelId, "aria-labelledby": mainTabId }
    : {};
  const details = open && (
    <div data-slot="sheet-scroll" data-scroll-fade="y">
      <SheetBody role="tabpanel" id={detailsPanelId} aria-labelledby={detailsTabId}>
        {aside.children}
      </SheetBody>
    </div>
  );
  if (!sections)
    return (
      <>
        {ownTabs && <div data-slot="sheet-head">{ownTabs}</div>}
        {details}
        <div
          data-slot="sheet-sections"
          data-sections=""
          data-hidden={open || undefined}
          {...mainPanel}
        >
          {rest}
        </div>
      </>
    );
  const head = tabs
    ? pinned.map((child, index) =>
        index === tabbedIndex && tabbedHeader ? React.cloneElement(tabbedHeader, { tabs }) : child
      )
    : pinned;
  const footer = sections.footer.map((child) => hide(child, open));
  return renderInForm(
    sections.form,
    "sheet-form",
    <>
      {(head.length > 0 || ownTabs) && (
        <div data-slot="sheet-head">
          {head}
          {ownTabs}
        </div>
      )}
      {details}
      {sections.scroll.length > 0 && (
        <div
          data-slot="sheet-scroll"
          data-scroll-fade="y"
          data-before-footer={footer.length > 0 || undefined}
          data-hidden={open || undefined}
          {...mainPanel}
        >
          {sections.scroll}
        </div>
      )}
      {footer}
    </>
  );
}

type SheetViewProps = {
  id: string;
  /** Names the view in a child's breadcrumb, such as the folder a New alert view belongs to. */
  title: string;
  /** The view Back returns to. Defaults to the first view. */
  parent?: string;
  /** The first view's own header, usually a SheetHeader with the SheetTitle. Child views get a back control and a breadcrumb title instead. */
  header?: React.ReactNode;
  description?: React.ReactNode;
  /** A child view's header tabs, as SheetHeader `tabs`. The first view sets them on its own header. */
  tabs?: React.ReactNode;
  footer?: React.ReactNode;
  /** Widens the sheet while this view is shown. */
  size?: SheetSize;
  /** Back, Escape and the close button ask before leaving a view with unsaved changes. */
  dirty?: boolean;
  discardTitle?: string;
  discardDescription?: string;
  /** Right after a child view's breadcrumb title, such as its DocumentationLink. The first view sets them on its own SheetTitle. */
  badges?: React.ReactNode;
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
  /** Leaves the view through its discard guard, as Back does. onLeave runs once leaving is accepted. */
  back: (onLeave?: () => void) => void;
  /** Leaves the view without asking, once its work is saved. */
  done: () => void;
  setPending: (pending: boolean) => void;
};
const SheetViewContext = React.createContext<SheetViewSlots | null>(null);
const SheetViewDescribeContext = React.createContext<((id: string | undefined) => void) | null>(
  null
);
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
  onBack: (onLeave?: () => void) => void;
  onDone: () => void;
  backDisabled: boolean;
  setPending: (pending: boolean) => void;
}) {
  const host = React.useContext(SheetHostContext);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const labelled = active && trail.length > 0;
  const [describedBy, setDescribedBy] = React.useState<string>();
  const ownDescription = labelled && view.description ? descriptionId : undefined;
  React.useLayoutEffect(() => {
    if (!host || !active) return undefined;
    host.setViewLabels({
      title: labelled ? titleId : undefined,
      description: ownDescription ?? describedBy
    });
    return () => host.setViewLabels(undefined);
  }, [host, active, labelled, titleId, ownDescription, describedBy]);
  const [subheader, setSubheader] = React.useState<HTMLElement | null>(null);
  const [footer, setFooter] = React.useState<HTMLElement | null>(null);
  const slots = React.useMemo(
    () => ({ subheader, footer, back: onBack, done: onDone, setPending }),
    [subheader, footer, onBack, onDone, setPending]
  );
  const header = trail.length ? (
    <SheetHeader tabs={view.tabs}>
      <div className={overlay.viewTitleRow}>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={"Back to " + trail[trail.length - 1]}
          disabled={backDisabled}
          onClick={() => onBack()}
        >
          <Icon name="chev-left" />
        </Button>
        <h2 id={titleId} data-slot="sheet-title" className={overlay.viewTitle}>
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
        {view.badges && (
          <span data-slot="overlay-title-badges" className={overlay.titleBadges}>
            {view.badges}
          </span>
        )}
      </div>
      {view.description && (
        <p id={descriptionId} data-slot="sheet-description">
          {view.description}
        </p>
      )}
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
      <SheetViewDescribeContext value={setDescribedBy}>
        <SheetViewContext value={slots}>
          <SheetLayout
            head={
              <>
                {header}
                <div
                  ref={setSubheader}
                  data-slot="sheet-view-subheader"
                  className={overlay.viewSlot}
                />
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
      </SheetViewDescribeContext>
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
  const askEach = (dirty: SheetViewProps[], proceed: () => void) => {
    const [first, ...rest] = dirty;
    if (!first) proceed();
    else ask(first, () => askEach(rest, proceed));
  };
  const back = (onLeave?: () => void) => {
    if (pending || !parentOf || !current) return;
    ask(current.dirty ? current : undefined, () => {
      onLeave?.();
      onViewChange(parentOf.id);
    });
  };
  const done = () => {
    if (parentOf) onViewChange(parentOf.id);
  };
  const latest = React.useRef({ back, done });
  React.useLayoutEffect(() => {
    latest.current = { back, done };
  });
  const stableBack = React.useCallback((onLeave?: () => void) => latest.current.back(onLeave), []);
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
        if (pending) return true;
        const dirty = chain
          .slice(1)
          .filter((entry) => entry.dirty)
          .reverse();
        if (!dirty.length) return false;
        askEach(dirty, proceed);
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
  React.useLayoutEffect(() => {
    if (!host) return undefined;
    host.setViewPending(pending);
    return () => host.setViewPending(false);
  }, [host, pending]);
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
    if (!target) return;
    returnFocus.current = target;
    target.focus({ preventScroll: true });
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

function SheetHeader({
  className,
  tabs,
  children,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  /** Underline Tabs that sit on the header's bottom rule, so the active underline lands on it. Pass a controlled Tabs without content and render the panel in the body, giving it role="tabpanel" and linking it to the active trigger. */
  tabs?: React.ReactNode;
}) {
  const titled = React.Children.toArray(children).length > 0;
  return (
    <div
      ref={ref}
      data-slot="sheet-header"
      data-tabs={tabs ? (titled ? "" : "only") : undefined}
      className={cn("flex flex-col gap-0.5 p-4", className)}
      {...props}
    >
      {children}
      {tabs && <div data-slot="sheet-header-tabs">{tabs}</div>}
    </div>
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
  badges,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title> & {
  /** Right after the title: status badges, and the DocumentationLink so it stays paired with the title. */
  badges?: React.ReactNode;
}) {
  const title = (
    <SheetPrimitive.Title
      ref={ref}
      data-slot="sheet-title"
      className={cn("text-foreground", className)}
      {...props}
    />
  );
  if (!badges) return title;
  return (
    <div data-slot="sheet-title-line" className={overlay.titleLine}>
      {title}
      <span data-slot="overlay-title-badges" className={overlay.titleBadges}>
        {badges}
      </span>
    </div>
  );
}
SheetTitle.displayName = "SheetTitle";

function SheetDescription({
  className,
  ref,
  asChild,
  id,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  const describe = React.useContext(SheetViewDescribeContext);
  const ownId = React.useId();
  const viewId = id ?? ownId;
  React.useLayoutEffect(() => {
    if (!describe) return undefined;
    describe(viewId);
    return () => describe(undefined);
  }, [describe, viewId]);
  if (describe) {
    const Description = asChild ? Slot.Root : "p";
    return (
      <Description
        ref={ref}
        id={viewId}
        data-slot="sheet-description"
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  }
  return (
    <SheetPrimitive.Description
      ref={ref}
      data-slot="sheet-description"
      className={cn("text-muted-foreground", className)}
      asChild={asChild}
      id={id}
      {...props}
    />
  );
}
SheetDescription.displayName = "SheetDescription";

export {
  Sheet,
  SheetAside,
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
