import * as React from "react";

import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { EmptyState } from "../ui/empty";
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
};

export type TilePickerProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
  items: readonly TilePickerItem[];
  onSelect: (value: string) => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  popularLabel?: string;
  /** Heads the full list when popular items are shown above it. */
  allLabel?: string;
  /** Names what the search found nothing of, as in No items match. */
  noun?: string;
};

const matches = (item: TilePickerItem, query: string) =>
  [item.title, item.eyebrow, item.description, ...(item.keywords ?? [])].some((text) =>
    text?.toLowerCase().includes(query)
  );

/**
 * Search plus a responsive grid of stacked Tiles. With an empty search, popular items come first
 * under their own label and every item follows; a search lists its matches flat, and finding
 * nothing offers to clear it. The grid adds columns as the container widens, so it fits a sheet
 * or a page without a frame of its own.
 */
export function TilePicker({
  items,
  onSelect,
  searchLabel = "Search",
  searchPlaceholder,
  popularLabel = "Popular",
  allLabel = "All",
  noun = "items",
  className,
  ref,
  ...props
}: TilePickerProps & { ref?: React.Ref<HTMLDivElement> }) {
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const query = search.trim().toLowerCase();
  const popular = query ? [] : items.filter((item) => item.popular);
  const grid = (list: readonly TilePickerItem[]) => (
    <div className={styles.grid}>
      {list.map((item) => (
        <Tile
          key={item.value}
          layout="stacked"
          title={item.title}
          description={item.description}
          eyebrow={item.eyebrow}
          disabledReason={item.disabledReason}
          media={(item.icon || item.media) && <Media icon={item.icon}>{item.media}</Media>}
          onClick={() => onSelect(item.value)}
        />
      ))}
    </div>
  );
  const section = (label: string, list: readonly TilePickerItem[]) => (
    <section className={styles.section} aria-label={label}>
      <h3 className={styles.label}>{label}</h3>
      {grid(list)}
    </section>
  );
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
