import * as React from "react";

import { useInFrame } from "../lib/frame-context";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty";
import type { IconSource } from "../ui/icon";
import { Input } from "../ui/input";
import { Media } from "../ui/item";

import styles from "./provider-picker.module.css";

export type ProviderTileProps = Omit<React.ComponentPropsWithoutRef<"button">, "title"> & {
  title: string;
  description?: string;
  /** A short group name, such as AWS or CI/CD, shown in the top-right corner. */
  category?: string;
  icon?: IconSource;
  /** The provider's logo, framed like an icon. Ignored when icon is set. */
  media?: React.ReactNode;
  /** Disables the tile and shows why in place of the description. It stays focusable. */
  disabledReason?: string;
  ref?: React.Ref<HTMLButtonElement>;
};

/**
 * A provider to pick: an icon tile with the category across from it, then the name and a
 * one-line description. Picking it moves on, so it has no trailing chevron.
 */
export function ProviderTile({
  title,
  description,
  category,
  icon,
  media,
  disabledReason,
  className,
  onClick,
  type = "button",
  ref,
  ...props
}: ProviderTileProps) {
  const inFrame = useInFrame("ProviderTile");
  const reason = disabledReason || undefined;
  const detail = reason ?? description;
  return (
    <button
      ref={ref}
      type={type}
      data-slot="provider-tile"
      data-in-frame={inFrame || undefined}
      aria-disabled={reason ? true : undefined}
      className={cn(styles.tile, className)}
      onClick={(event) => {
        if (reason) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      <span className={styles.top}>
        <Media icon={icon} className={styles.media}>
          {media}
        </Media>
        {category && (
          <span className={styles.category} title={category}>
            {category}
          </span>
        )}
      </span>
      <span className={styles.title} title={title}>
        {title}
      </span>
      {detail && (
        <span
          data-slot="provider-tile-detail"
          data-reason={reason ? "" : undefined}
          className={styles.detail}
          title={detail}
        >
          {detail}
        </span>
      )}
    </button>
  );
}
ProviderTile.displayName = "ProviderTile";

export type ProviderPickerItem = {
  value: string;
  title: string;
  description?: string;
  category?: string;
  icon?: IconSource;
  media?: React.ReactNode;
  /** Also listed under the popular section while the search is empty. */
  popular?: boolean;
  disabledReason?: string;
  /** Extra words the search matches, such as a vendor's other product names. */
  keywords?: readonly string[];
};

export type ProviderPickerProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
  items: readonly ProviderPickerItem[];
  onSelect: (value: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  popularLabel?: string;
  /** Heads the full list when popular items are shown above it. */
  allLabel?: string;
  /** Names what the search found nothing of, as in No providers match. */
  noun?: string;
};

const matches = (item: ProviderPickerItem, query: string) =>
  [item.title, item.category, item.description, ...(item.keywords ?? [])].some((text) =>
    text?.toLowerCase().includes(query)
  );

/**
 * Search plus a responsive grid of ProviderTiles. With an empty search, popular items come first
 * under their own label and every item follows; a search lists its matches flat, and finding
 * nothing offers to clear it. The grid adds columns as the container widens, so it fits a sheet
 * or a page without a frame of its own.
 */
export function ProviderPicker({
  items,
  onSelect,
  searchLabel = "Search providers",
  searchPlaceholder,
  popularLabel = "Popular",
  allLabel = "All providers",
  noun = "providers",
  className,
  ref,
  ...props
}: ProviderPickerProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const query = search.trim().toLowerCase();
  const popular = query ? [] : items.filter((item) => item.popular);
  const grid = (list: readonly ProviderPickerItem[]) => (
    <div className={styles.grid}>
      {list.map(({ value, popular: _popular, keywords: _keywords, ...item }) => (
        <ProviderTile key={value} {...item} onClick={() => onSelect(value)} />
      ))}
    </div>
  );
  const section = (label: string, list: readonly ProviderPickerItem[]) => {
    const id = `${label}-heading`;
    return (
      <section className={styles.section} aria-label={label}>
        <h3 id={id} className={styles.label}>
          {label}
        </h3>
        {grid(list)}
      </section>
    );
  };
  const found = query ? items.filter((item) => matches(item, query)) : items;
  let body: React.ReactNode;
  if (query && found.length === 0)
    body = (
      <EmptyState
        size="sm"
        media="bare"
        icon="search"
        title={`No ${noun} match "${search.trim()}"`}
        actions={
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              inputRef.current?.focus();
            }}
          >
            Clear search
          </Button>
        }
      />
    );
  else if (popular.length > 0)
    body = (
      <>
        {section(popularLabel, popular)}
        {section(allLabel, items)}
      </>
    );
  else body = grid(found);
  return (
    <div ref={ref} data-slot="provider-picker" className={cn(styles.picker, className)} {...props}>
      <Input
        ref={inputRef}
        icon="search"
        aria-label={searchLabel}
        placeholder={searchPlaceholder ?? searchLabel}
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape" && search) {
            event.preventDefault();
            event.stopPropagation();
            setSearch("");
          }
        }}
      />
      {body}
    </div>
  );
}
ProviderPicker.displayName = "ProviderPicker";
