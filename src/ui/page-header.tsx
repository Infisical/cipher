import * as React from "react";

import { cn, titleIfClamped } from "../lib/utils";
import { Breadcrumb, type BreadcrumbCrumb } from "./breadcrumb";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./dropdown-menu";
import { Icon, type IconSource } from "./icon";

import styles from "./page-header.module.css";

export type PageHeaderMoreAction = {
  label: string;
  icon?: IconSource;
  /** Navigates instead of acting in place: renders a link, as a button and as a menu item. */
  href?: string;
  onSelect?: () => void;
  variant?: "default" | "destructive";
  disabledReason?: string;
};

export type PageHeaderProps = Omit<React.ComponentPropsWithoutRef<"header">, "title"> & {
  title: React.ReactNode;
  size?: "lg" | "md";
  mono?: boolean;
  breadcrumb?: readonly BreadcrumbCrumb[];
  maxItems?: number;
  /** Right after the title: status badges, and the page's DocumentationLink so it stays paired with the title. */
  badges?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /**
   * Secondary actions, drawn as outline buttons before `actions` while the header is wide. Below the
   * narrow breakpoint they move into a "More actions" menu to leave more room for the title.
   * Existing `actions` keep their usual responsive behavior.
   */
  moreActions?: readonly PageHeaderMoreAction[];
  moreLabel?: string;
  tabs?: React.ReactNode;
  media?: React.ReactNode;
  /** Keeps a long title on one line, ending in an ellipsis with the full title on hover, instead of wrapping. */
  truncateTitle?: boolean;
};

export function PageHeader({
  title,
  size = "lg",
  mono = false,
  breadcrumb,
  maxItems,
  badges,
  description,
  actions,
  moreActions,
  moreLabel = "More actions",
  tabs,
  media,
  truncateTitle = false,
  className,
  ref,
  ...props
}: PageHeaderProps & { ref?: React.Ref<HTMLElement> }) {
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const [titleClamped, setTitleClamped] = React.useState(false);
  const [titleExpanded, setTitleExpanded] = React.useState(false);
  React.useEffect(() => {
    const element = titleRef.current;
    if (!element || truncateTitle) return;
    const measure = () => {
      const style = getComputedStyle(element);
      const line = parseFloat(style.lineHeight);
      const clamps =
        style.getPropertyValue("--cipher-page-header-title-clamp").trim() === "2" &&
        element.scrollHeight > 2.5 * line;
      setTitleClamped(clamps);
      if (clamps) element.title = element.textContent ?? "";
      else {
        element.removeAttribute("title");
        setTitleExpanded(false);
      }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const mutations = new MutationObserver(measure);
    mutations.observe(element, { subtree: true, childList: true, characterData: true });
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [truncateTitle]);
  const titleToggle = !truncateTitle && titleClamped;
  const more = moreActions && moreActions.length > 0 ? moreActions : null;
  const moreTriggerRef = React.useRef<HTMLButtonElement>(null);
  const [moreOpen, setMoreOpen] = React.useState(false);
  React.useEffect(() => {
    const trigger = moreTriggerRef.current;
    if (!moreOpen || !trigger) return;
    const observer = new ResizeObserver(() => {
      if (!trigger.getClientRects().length) setMoreOpen(false);
    });
    observer.observe(trigger);
    return () => observer.disconnect();
  }, [moreOpen]);
  return (
    <header
      ref={ref}
      data-slot="page-header"
      data-size={size}
      className={cn(styles.header, className)}
      {...props}
    >
      {breadcrumb && breadcrumb.length > 0 && (
        <Breadcrumb
          aria-label="Page path"
          items={breadcrumb.map((crumb, index) =>
            index === 0
              ? {
                  ...crumb,
                  media: crumb.media ?? <Icon name="chev-left" size={14} />
                }
              : crumb
          )}
          maxItems={maxItems}
          lastIsCurrent={false}
          className={styles.trail}
        />
      )}
      <div className={styles.main}>
        {media && <span className={styles.media}>{media}</span>}
        <div className={styles.titleLine}>
          <h1
            ref={titleRef}
            data-truncate={truncateTitle || undefined}
            data-expanded={titleExpanded || undefined}
            className={cn(styles.title, mono && styles.mono)}
            onPointerEnter={
              truncateTitle ? (event) => titleIfClamped(event.currentTarget) : undefined
            }
          >
            {titleToggle ? (
              <span
                role="button"
                tabIndex={0}
                aria-expanded={titleExpanded}
                className={styles.titleToggle}
                onClick={() => {
                  if (window.getSelection()?.isCollapsed !== false)
                    setTitleExpanded(!titleExpanded);
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  setTitleExpanded(!titleExpanded);
                }}
              >
                {title}
              </span>
            ) : (
              title
            )}
          </h1>
          {badges && (
            <span data-slot="page-header-badges" className={styles.badges}>
              {badges}
            </span>
          )}
        </div>
        {(actions || more) && (
          <div
            data-slot="page-header-actions"
            className={styles.actions}
            onPointerOver={(event) => {
              const button =
                event.target instanceof Element
                  ? event.target.closest<HTMLElement>("[data-slot=button]")
                  : null;
              const text = button?.querySelector<HTMLElement>("[data-slot=button-text]");
              if (!button || !text) return;
              const generated = button.dataset.autoTitle;
              if (generated !== undefined && button.title !== generated) {
                delete button.dataset.autoTitle;
                return;
              }
              if (button.title && generated === undefined) return;
              if (getComputedStyle(text).position === "absolute") {
                const label = text.textContent ?? "";
                button.title = label;
                button.dataset.autoTitle = label;
              } else if (generated !== undefined) {
                button.removeAttribute("title");
                delete button.dataset.autoTitle;
              }
            }}
          >
            {more && (
              <>
                <span data-slot="page-header-more-inline" className={styles.moreInline}>
                  {more.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      icon={action.icon}
                      disabledReason={action.disabledReason}
                      asChild={Boolean(action.href)}
                      onClick={action.href ? undefined : action.onSelect}
                    >
                      {action.href ? <a href={action.href}>{action.label}</a> : action.label}
                    </Button>
                  ))}
                </span>
                <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
                  <DropdownMenuTrigger ref={moreTriggerRef} asChild>
                    <Button variant="outline" icon="more" iconOnly className={styles.moreMenu}>
                      {moreLabel}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {more.map((action) => (
                      <DropdownMenuItem
                        key={action.label}
                        variant={action.variant}
                        disabledReason={action.disabledReason}
                        asChild={Boolean(action.href)}
                        onSelect={action.href ? undefined : action.onSelect}
                      >
                        {action.href ? <a href={action.href}>{action.label}</a> : action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
            {actions}
          </div>
        )}
        {description && (
          <div data-slot="page-header-description" className={styles.description}>
            {description}
          </div>
        )}
      </div>
      {tabs && <div className={styles.tabs}>{tabs}</div>}
    </header>
  );
}
PageHeader.displayName = "PageHeader";
