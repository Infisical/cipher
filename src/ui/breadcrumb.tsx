import * as React from "react";
import { Slot } from "radix-ui";

import { isDev } from "../lib/dev";
import { CipherLink, type CipherLinkTarget } from "../lib/link";
import { useControllableState } from "../lib/use-controllable-state";
import { cn } from "../lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./dropdown-menu";
import { Icon } from "./icon";
import { Switcher, type SwitcherProps } from "./switcher";

import breadcrumbStyles from "./breadcrumb.module.css";

export type BreadcrumbSwitcher = Omit<SwitcherProps, "trigger" | "anchor">;

export type BreadcrumbCrumb = {
  label: React.ReactNode;
  link?: CipherLinkTarget;
  href?: string;
  /** Runs on click beside `link` or `href`. On its own the crumb renders as a button, which can't open in a new tab, and development builds warn. */
  onNavigate?: React.MouseEventHandler<HTMLElement>;
  mono?: boolean;
  media?: React.ReactNode;
  switcher?: BreadcrumbSwitcher;
  /** DropdownMenuItems for a menu on the current crumb, such as Copy path. The crumb becomes the menu's trigger. */
  menu?: React.ReactNode;
};

const hasPage = (crumb: BreadcrumbCrumb) => Boolean(crumb.link || crumb.href || crumb.onNavigate);

const CrumbName = ({
  crumb,
  className,
  labelId,
  children
}: {
  crumb: BreadcrumbCrumb;
  className: string;
  labelId: string;
  children: React.ReactNode;
}) => {
  if (crumb.link)
    return (
      <CipherLink
        link={crumb.link}
        onClick={crumb.onNavigate}
        data-slot="breadcrumb-name"
        className={className}
        aria-labelledby={labelId}
      >
        {children}
      </CipherLink>
    );
  if (crumb.href)
    return (
      <a
        href={crumb.href}
        onClick={crumb.onNavigate}
        data-slot="breadcrumb-name"
        className={className}
        aria-labelledby={labelId}
      >
        {children}
      </a>
    );
  return (
    <button
      type="button"
      onClick={crumb.onNavigate}
      data-slot="breadcrumb-name"
      className={className}
      aria-labelledby={labelId}
    >
      {children}
    </button>
  );
};

function BandDivider({ className }: { className?: string }) {
  return (
    <span
      data-slot="band-divider"
      className={cn(breadcrumbStyles.separator, className)}
      aria-hidden="true"
    />
  );
}
BandDivider.displayName = "BandDivider";

const SwitcherCrumb = ({
  crumb,
  current,
  labelId,
  purposeId
}: {
  crumb: BreadcrumbCrumb & { switcher: BreadcrumbSwitcher };
  current: boolean;
  labelId: string;
  purposeId: string;
}) => {
  const { switcher } = crumb;
  const [open, setOpen] = useControllableState({
    value: switcher.open,
    defaultValue: switcher.defaultOpen ?? false,
    onChange: switcher.onOpenChange
  });
  const navigates = !current && hasPage(crumb);
  const media = crumb.media && (
    <span className={breadcrumbStyles.media} aria-hidden="true">
      {crumb.media}
    </span>
  );
  const label = (
    <span
      id={labelId}
      className={cn(breadcrumbStyles.label, crumb.mono && breadcrumbStyles.mono)}
      title={typeof crumb.label === "string" ? crumb.label : undefined}
    >
      {crumb.label}
    </span>
  );
  const purpose = (
    <span id={purposeId} className="sr-only">
      {switcher.label}
    </span>
  );
  if (!navigates)
    return (
      <Switcher
        {...switcher}
        open={open}
        onOpenChange={setOpen}
        trigger={
          <button
            type="button"
            data-slot="breadcrumb-switcher"
            data-name-target="switcher"
            className={breadcrumbStyles.segment}
            aria-current={current ? "page" : undefined}
            aria-labelledby={`${purposeId} ${labelId}`}
          >
            {purpose}
            {media}
            {label}
            <span className={breadcrumbStyles.chevron} aria-hidden="true">
              <Icon name="chev-ud" size={14} />
            </span>
          </button>
        }
      />
    );
  return (
    <Switcher
      {...switcher}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          type="button"
          data-slot="breadcrumb-switcher"
          className={breadcrumbStyles.chevron}
          aria-labelledby={`${purposeId} ${labelId}`}
        >
          {purpose}
          <Icon name="chev-ud" size={14} />
        </button>
      }
      anchor={(trigger) => (
        <span className={breadcrumbStyles.segment} data-name-target="page">
          <CrumbName crumb={crumb} className={breadcrumbStyles.name} labelId={labelId}>
            {media}
            {label}
          </CrumbName>
          {trigger}
        </span>
      )}
    />
  );
};
const CrumbNavigation = ({
  crumb,
  children
}: {
  crumb: BreadcrumbCrumb;
  children: React.ReactNode;
}) => {
  if (crumb.link)
    return (
      <DropdownMenuItem asChild>
        <CipherLink link={crumb.link} onClick={crumb.onNavigate}>
          {children}
        </CipherLink>
      </DropdownMenuItem>
    );
  if (crumb.href)
    return (
      <DropdownMenuItem asChild>
        <a href={crumb.href} onClick={crumb.onNavigate}>
          {children}
        </a>
      </DropdownMenuItem>
    );
  return <DropdownMenuItem onClick={crumb.onNavigate}>{children}</DropdownMenuItem>;
};

const RulerCrumb = ({ crumb, current }: { crumb: BreadcrumbCrumb; current: boolean }) => {
  const content = (
    <>
      {crumb.media && <span className={breadcrumbStyles.media}>{crumb.media}</span>}
      <span className={cn(breadcrumbStyles.label, crumb.mono && breadcrumbStyles.mono)}>
        {crumb.label}
      </span>
    </>
  );
  if (crumb.switcher && !current && hasPage(crumb))
    return (
      <span className={breadcrumbStyles.segment} data-name-target="page">
        <span className={breadcrumbStyles.name}>{content}</span>
        <span className={breadcrumbStyles.chevron} />
      </span>
    );
  if (crumb.switcher || (current && crumb.menu))
    return (
      <span className={breadcrumbStyles.segment} data-name-target="switcher">
        {content}
        <span className={breadcrumbStyles.chevron} />
      </span>
    );
  return (
    <span className={cn(breadcrumbStyles.link, current && breadcrumbStyles.current)}>
      {content}
    </span>
  );
};

const lastHiddenCrumb = (
  entries: number[],
  ellipsis: number,
  container: number,
  maxItems: number | undefined,
  head: number
) => {
  const count = entries.length;
  const cap = maxItems === undefined ? count : Math.max(head + 1, maxItems);
  const total = entries.reduce((sum, width) => sum + width, 0);
  if (count - 2 < head || (count <= cap && total <= container)) return -1;
  let first = count - 1;
  let used =
    entries.slice(0, head).reduce((sum, width) => sum + width, 0) + entries[count - 1] + ellipsis;
  while (
    first - 1 > head &&
    head + count - first + 1 <= cap &&
    used + entries[first - 1] <= container
  ) {
    first -= 1;
    used += entries[first];
  }
  return first - 1;
};

export type BreadcrumbProps = React.ComponentPropsWithoutRef<"nav"> & {
  items?: readonly BreadcrumbCrumb[];
  variant?: "default" | "product";
  /** At most this many crumbs show; the rest join the ones width hides in the ellipsis menu. Crumbs up to the last switcher stay visible, so a switcher never collapses. */
  maxItems?: number;
  lastIsCurrent?: boolean;
  /** Draws a divider after a lone root crumb, so a root-only path reads "Root /". */
  trailingDivider?: boolean;
};
function Breadcrumb({
  className,
  items,
  variant = "default",
  maxItems,
  lastIsCurrent = true,
  trailingDivider = false,
  children,
  ref,
  ...props
}: BreadcrumbProps & { ref?: React.Ref<HTMLElement> }) {
  const nameId = React.useId();
  const navigateOnly = Boolean(
    items?.some((crumb) => crumb.onNavigate && !crumb.link && !crumb.href)
  );
  const warned = React.useRef(false);
  React.useEffect(() => {
    if (!isDev || !navigateOnly || warned.current) return;
    warned.current = true;
    console.warn(
      "Breadcrumb: a crumb has onNavigate but no link or href, so it renders as a button that can't open in a new tab. Pass link or href for navigation."
    );
  }, [navigateOnly]);
  const nav = React.useRef<HTMLElement | null>(null);
  const measure = React.useRef<HTMLOListElement | null>(null);
  const [lastHidden, setLastHidden] = React.useState(-1);
  const count = items?.length ?? 0;
  const measured = variant === "default" && count > 2;
  const head =
    1 +
    (items ?? []).reduce(
      (last, crumb, index) => (crumb.switcher && index < count - 1 ? index : last),
      0
    );
  const attach = React.useCallback(
    (node: HTMLElement | null) => {
      nav.current = node;
      if (typeof ref === "function") return ref(node);
      if (ref) ref.current = node;
      return undefined;
    },
    [ref]
  );
  React.useLayoutEffect(() => {
    const root = nav.current;
    const list = measure.current;
    if (!measured || !root || !list) {
      setLastHidden(-1);
      return undefined;
    }
    let active = true;
    const read = () => {
      if (!active) return;
      const entries = [...list.querySelectorAll<HTMLElement>('[data-measure="entry"]')].map(
        (entry) => entry.getBoundingClientRect().width
      );
      const ellipsis =
        list.querySelector<HTMLElement>('[data-measure="ellipsis"]')?.getBoundingClientRect()
          .width ?? 0;
      setLastHidden(lastHiddenCrumb(entries, ellipsis, root.clientWidth, maxItems, head));
    };
    read();
    const observer = new ResizeObserver(read);
    observer.observe(root);
    list.querySelectorAll("[data-measure]").forEach((entry) => observer.observe(entry));
    document.fonts?.ready.then(read).catch(() => {});
    return () => {
      active = false;
      observer.disconnect();
    };
  }, [measured, count, maxItems, head]);
  const hiddenTo = measured
    ? lastHidden
    : maxItems !== undefined && count > Math.max(3, maxItems) && count - 2 >= head
      ? count - 2
      : -1;
  const hiddenCount = hiddenTo < 0 ? 0 : hiddenTo - head + 1;
  const ids = (index: number) => ({
    label: nameId + "-" + index + "-label",
    purpose: nameId + "-" + index + "-purpose"
  });
  const renderCrumb = (crumb: BreadcrumbCrumb, index: number) => {
    const last = lastIsCurrent && index === count - 1;
    const content = (
      <>
        {crumb.media && <span className={breadcrumbStyles.media}>{crumb.media}</span>}
        <span
          id={ids(index).label}
          className={cn(breadcrumbStyles.label, crumb.mono && breadcrumbStyles.mono)}
          title={typeof crumb.label === "string" ? crumb.label : undefined}
        >
          {crumb.label}
        </span>
      </>
    );
    return (
      <li
        key={index}
        className={breadcrumbStyles.entry}
        data-current={last || undefined}
        data-switcher={Boolean(crumb.switcher) || undefined}
        data-media={Boolean(crumb.media) || undefined}
      >
        {index > 0 && <BandDivider />}
        {crumb.switcher ? (
          <SwitcherCrumb
            crumb={{ ...crumb, switcher: crumb.switcher }}
            current={last}
            labelId={ids(index).label}
            purposeId={ids(index).purpose}
          />
        ) : last && crumb.menu ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                data-slot="breadcrumb-menu"
                data-name-target="switcher"
                className={breadcrumbStyles.segment}
                aria-current="page"
                aria-labelledby={ids(index).purpose + " " + ids(index).label}
              >
                <span id={ids(index).purpose} className="sr-only">
                  Actions for
                </span>
                {content}
                <span className={breadcrumbStyles.chevron} aria-hidden="true">
                  <Icon name="chev-down" size={14} />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">{crumb.menu}</DropdownMenuContent>
          </DropdownMenu>
        ) : last ? (
          <span
            aria-current="page"
            className={cn(breadcrumbStyles.link, breadcrumbStyles.current, breadcrumbStyles.static)}
          >
            {content}
          </span>
        ) : hasPage(crumb) ? (
          <CrumbName crumb={crumb} className={breadcrumbStyles.link} labelId={ids(index).label}>
            {content}
          </CrumbName>
        ) : (
          <span className={cn(breadcrumbStyles.link, breadcrumbStyles.static)}>{content}</span>
        )}
        {trailingDivider && count === 1 && <BandDivider />}
      </li>
    );
  };
  const trailClass = cn(breadcrumbStyles.trail, variant === "product" && breadcrumbStyles.product);
  return (
    <nav
      ref={attach}
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      data-variant={variant}
      className={cn(breadcrumbStyles.root, className)}
      {...props}
    >
      {items ? (
        <>
          <ol className={trailClass}>
            {items.map((crumb, index) => {
              if (index < head || index > hiddenTo) return renderCrumb(crumb, index);
              if (index > head) return null;
              return (
                <li key="hidden" className={breadcrumbStyles.entry}>
                  <BandDivider />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        data-slot="breadcrumb-ellipsis"
                        className={breadcrumbStyles.chevron}
                        aria-label={"Show " + hiddenCount + " hidden levels"}
                      >
                        <Icon name="more" size={16} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className={breadcrumbStyles.hiddenMenu}>
                      {items.slice(head, hiddenTo + 1).map((hiddenCrumb, offset) => (
                        <CrumbNavigation key={offset} crumb={hiddenCrumb}>
                          {hiddenCrumb.media ?? <Icon name="folder" />}
                          <span className={breadcrumbStyles.label}>{hiddenCrumb.label}</span>
                        </CrumbNavigation>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              );
            })}
          </ol>
          {measured && (
            <div className={breadcrumbStyles.measure} aria-hidden="true">
              <ol ref={measure} className={trailClass}>
                {items.map((crumb, index) => (
                  <li key={index} className={breadcrumbStyles.entry} data-measure="entry">
                    {index > 0 && <BandDivider />}
                    <RulerCrumb crumb={crumb} current={lastIsCurrent && index === count - 1} />
                  </li>
                ))}
                <li className={breadcrumbStyles.entry} data-measure="ellipsis">
                  <BandDivider />
                  <span className={breadcrumbStyles.chevron} />
                </li>
              </ol>
            </div>
          )}
        </>
      ) : (
        children
      )}
    </nav>
  );
}
Breadcrumb.displayName = "Breadcrumb";

function BreadcrumbList({ className, ref, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-word",
        className
      )}
      {...props}
    />
  );
}
BreadcrumbList.displayName = "BreadcrumbList";

function BreadcrumbItem({ className, ref, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}
BreadcrumbItem.displayName = "BreadcrumbItem";

function BreadcrumbLink({
  asChild,
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<"a"> & {
  asChild?: boolean;
} & { ref?: React.Ref<React.ComponentRef<"a">> }) {
  const Comp = asChild ? Slot.Root : "a";

  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

function BreadcrumbPage({ className, ref, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbPage.displayName = "BreadcrumbPage";

function BreadcrumbSeparator({ children, className, ref, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <BandDivider />}
    </li>
  );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

function BreadcrumbEllipsis({ className, ref, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-5 items-center justify-center [&>svg]:size-4", className)}
      {...props}
    >
      <Icon name="more" />
      <span className="sr-only">More</span>
    </span>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  BandDivider,
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
};
