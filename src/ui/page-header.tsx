import * as React from "react";

import { cn, titleIfClamped } from "../lib/utils";
import { Breadcrumb, type BreadcrumbCrumb } from "./breadcrumb";
import { Icon } from "./icon";

import styles from "./page-header.module.css";

export type PageHeaderProps = Omit<
  React.ComponentPropsWithoutRef<"header">,
  "title"
> & {
  title: React.ReactNode;
  size?: "lg" | "md";
  mono?: boolean;
  breadcrumb?: readonly BreadcrumbCrumb[];
  maxItems?: number;
  /** Right after the title: status badges, and the page's DocumentationLink so it stays paired with the title. */
  badges?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
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
  tabs,
  media,
  truncateTitle = false,
  className,
  ref,
  ...props
}: PageHeaderProps & { ref?: React.Ref<HTMLElement> }) {
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
                  media: crumb.media ?? <Icon name="chev-left" size={14} />,
                }
              : crumb,
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
            data-truncate={truncateTitle || undefined}
            className={cn(styles.title, mono && styles.mono)}
            onPointerEnter={
              truncateTitle
                ? (event) => titleIfClamped(event.currentTarget)
                : undefined
            }
          >
            {title}
          </h1>
          {badges && (
            <span data-slot="page-header-badges" className={styles.badges}>
              {badges}
            </span>
          )}
        </div>
        {actions && (
          <div
            data-slot="page-header-actions"
            className={styles.actions}
            onPointerOver={(event) => {
              const button =
                event.target instanceof Element
                  ? event.target.closest<HTMLElement>("[data-slot=button]")
                  : null;
              const text = button?.querySelector<HTMLElement>(
                "[data-slot=button-text]",
              );
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
            {actions}
          </div>
        )}
        {description && (
          <div
            data-slot="page-header-description"
            className={styles.description}
          >
            {description}
          </div>
        )}
      </div>
      {tabs && <div className={styles.tabs}>{tabs}</div>}
    </header>
  );
}
PageHeader.displayName = "PageHeader";
