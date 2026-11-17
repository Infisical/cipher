import * as React from "react";

import { useListFiltered } from "../lib/list-query";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { type EmptyGhost, EmptyGhostScope, EmptyState } from "../ui/empty";
import type { IconSource } from "../ui/icon";
import { Input } from "../ui/input";
import { Media, Tile } from "../ui/item";

import styles from "./tile-picker.module.css";

export type TilePickerItem = {
  value: string;
  title: string;
  description?: string;
  /** A short group name, such as AWS or CI/CD, shown across from the media. */
  eyebrow?: string;
  icon?: IconSource;
  /** A logo or image, framed like an icon. Ignored when icon is set. */
  media?: React.ReactNode;
  /** Also listed under the popular section while the search is empty. */
  popular?: boolean;
  disabledReason?: string;
  /** Extra words the search matches, such as a vendor's other product names. */
  keywords?: readonly string[];
  /** Always listed, after any matches, even when a search doesn't match it. For catch-alls such as a custom integration. */
  pinned?: boolean;
  /** Makes the tile a link that navigates instead of calling onSelect. */
  href?: string;
  /** Opens href in a new tab and marks the tile as external. */
  external?: boolean;
};

export type TilePickerProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
  items: readonly TilePickerItem[];
  /** Called with a picked item's value. Items with an href navigate instead. */
  onSelect?: (value: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  popularLabel?: string;
  /** Heads the full list when popular items are shown above it. */
  allLabel?: string;
  /** Names what the search found nothing of, as in No items match. */
  noun?: string;
  /** Shown in place of the grid when there are no items at all, such as an EmptyState. */
  empty?: React.ReactNode;
  /** The ghost behind an Empty in the empty slot. Defaults to cards; a search that finds nothing never draws one. */
  ghost?: EmptyGhost;
  /** The items are narrowed outside the picker, so an empty picker means no matches and draws no ghost. Inside a ListQueryScope it follows the FilterBar unless passed. */
  filtered?: boolean;
};

const matches = (item: TilePickerItem, query: string) =>
  [item.title, item.eyebrow, item.description, ...(item.keywords ?? [])].some((text) =>
    text?.toLowerCase().includes(query)
  );

/**
 * Search plus a responsive grid of stacked Tiles. With an empty search, popular items come first
 * under their own label and every item follows; a search lists its matches flat, then any
 * pinned items, and finding nothing offers to clear it above the pinned items. The grid adds
 * columns as the container widens, so it fits a sheet or a page without a frame of its own.
 */
export function TilePicker({
  items,
  onSelect,
  searchLabel = "Search",
  searchPlaceholder,
  popularLabel = "Popular",
  allLabel = "All",
  noun = "items",
  empty,
  ghost,
  filtered: filteredProp,
  className,
  ref,
  ...props
}: TilePickerProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [search, setSearch] = React.useState("");
  const listFiltered = useListFiltered();
  const filtered = filteredProp ?? listFiltered;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const query = search.trim().toLowerCase();
  const popular = query ? [] : items.filter((item) => item.popular);
  const grid = (list: readonly TilePickerItem[]) => (
    <div className={styles.grid}>
      {list.map((item) => {
        const shared = {
          layout: "stacked" as const,
          title: item.title,
          description: item.description,
          eyebrow: item.eyebrow,
          disabledReason: item.disabledReason,
          media: (item.icon || item.media) && <Media icon={item.icon}>{item.media}</Media>
        };
        return item.href ? (
          <Tile key={item.value} {...shared} href={item.href} external={item.external} />
        ) : (
          <Tile key={item.value} {...shared} onClick={() => onSelect?.(item.value)} />
        );
      })}
    </div>
  );
  const section = (label: string, list: readonly TilePickerItem[]) => (
    <section className={styles.section} aria-label={label}>
      <h3 className={styles.label}>{label}</h3>
      {grid(list)}
    </section>
  );
  const found = query ? items.filter((item) => matches(item, query)) : items;
  const pinned = query ? items.filter((item) => item.pinned && !matches(item, query)) : [];
  let body: React.ReactNode;
  if (!query && items.length === 0 && empty !== undefined)
    body = (
      <EmptyGhostScope ghost={ghost ?? (filtered ? false : "cards")}>{empty}</EmptyGhostScope>
    );
  else if (query && found.length === 0)
    body = (
      <>
        <EmptyState
          ghost={false}
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
        {pinned.length > 0 && grid(pinned)}
      </>
    );
  else if (popular.length > 0)
    body = (
      <>
        {section(popularLabel, popular)}
        {section(allLabel, items)}
      </>
    );
  else body = grid([...found, ...pinned]);
  return (
    <div ref={ref} data-slot="tile-picker" className={cn(styles.picker, className)} {...props}>
      <Input
        ref={inputRef}
        icon="search"
        aria-label={searchLabel}
        placeholder={searchPlaceholder ?? searchLabel}
        value={search}
        data-cipher-escape-owner={search ? "" : undefined}
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
TilePicker.displayName = "TilePicker";
