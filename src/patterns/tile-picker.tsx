import * as React from "react";

import { useListFiltered } from "../lib/list-query";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { type EmptyGhost, EmptyGhostScope, EmptyState } from "../ui/empty";
import type { IconSource } from "../ui/icon";
import { Input } from "../ui/input";
import { Media, Tile } from "../ui/item";
import { List, ListRow, ListSection } from "../ui/list";

import listStyles from "../ui/data.module.css";
import styles from "./tile-picker.module.css";

export type TilePickerItem = {
  value: string;
  title: string;
  /** The line under the title. Wins over category there. */
  description?: React.ReactNode;
  /** A short group name, such as AWS or CI/CD. Shown under the title when there is no description, and what groupBy groups by. */
  category?: string;
  /** @deprecated Use category. */
  eyebrow?: string;
  /** The trailing slot in the list layout. Defaults to category. */
  meta?: React.ReactNode;
  /** Sits right after the title, such as a plan Badge. */
  badge?: React.ReactNode;
  icon?: IconSource;
  /** A logo or image, framed like an icon. Ignored when icon is set. */
  media?: React.ReactNode;
  /** Listed under the popular section, or in the featured strip, while the search is empty. */
  popular?: boolean;
  disabledReason?: string;
  /** Extra words the search matches, such as a vendor's other product names. */
  keywords?: readonly string[];
  /** Always listed, after any matches, even when a search doesn't match it. For catch-alls such as a custom integration. With pinnedLabel, pinned items get a section of their own. */
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
  /** grid shows tiles; list shows a List of rows with the category as trailing meta. */
  layout?: "grid" | "list";
  /** compact shows the title only, so about twice as many tiles fit. Grid only. */
  density?: "comfortable" | "compact";
  /** Heads each category with its count. A search flattens the groups and shows the category under each title. */
  groupBy?: "category";
  /** section lists popular items under their own label and again below. featured shows them as a strip of larger tiles, with the description in mono, that are not repeated below. Grid only. */
  popular?: "section" | "featured";
  /** Heads the pinned items, which then leave the catalog and sit under this label, below any search results. */
  pinnedLabel?: string;
  /** Off for a short choice, such as three sources. */
  searchable?: boolean;
  /** The selected item's value. */
  value?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  popularLabel?: string;
  /** Heads the full list when popular or pinned items are shown above it. Ignored with groupBy. */
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

const categoryOf = (item: TilePickerItem) => item.category ?? item.eyebrow;

const matches = (item: TilePickerItem, query: string) =>
  [
    item.title,
    categoryOf(item),
    typeof item.description === "string" ? item.description : undefined,
    ...(item.keywords ?? [])
  ].some((text) => text?.toLowerCase().includes(query));

type Group = {
  id: string;
  label?: string;
  items: readonly TilePickerItem[];
  counted?: boolean;
  pinned?: boolean;
};

/**
 * Search plus a responsive grid of Tiles, or a List of rows. With an empty search, popular items
 * come first (as a section or a featured strip), then pinned items under pinnedLabel, then every
 * item, grouped by category with groupBy. A search lists its matches flat, then the pinned items,
 * and finding nothing offers to clear it above them. The grid adds columns as the container
 * widens, so it fits a sheet or a page without a frame of its own.
 */
export function TilePicker({
  items,
  onSelect,
  layout = "grid",
  density = "comfortable",
  groupBy,
  popular: popularStyle = "section",
  pinnedLabel,
  searchable = true,
  value,
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
  const query = searchable ? search.trim().toLowerCase() : "";
  const compact = layout === "grid" && density === "compact";
  const media = (item: TilePickerItem) =>
    (item.icon || item.media) && (
      <Media icon={item.icon} size={compact ? "sm" : "md"}>
        {item.media}
      </Media>
    );
  const tile = (item: TilePickerItem, featured: boolean, pinned: boolean) => {
    let detail: React.ReactNode = item.description ?? categoryOf(item);
    if (featured)
      detail = item.description && <span className={styles.host}>{item.description}</span>;
    else if (compact && !pinned && !(query && groupBy)) detail = undefined;
    const shared = {
      layout: featured ? ("stacked" as const) : ("inline" as const),
      title: item.title,
      description: detail,
      badge: item.badge,
      disabledReason: item.disabledReason,
      selected: value === undefined ? undefined : value === item.value,
      media: media(item),
      className: cn(featured && styles.featured, pinned && styles.pinned)
    };
    return item.href ? (
      <Tile key={item.value} {...shared} href={item.href} external={item.external} />
    ) : (
      <Tile key={item.value} {...shared} onClick={() => onSelect?.(item.value)} />
    );
  };
  const row = (item: TilePickerItem) => {
    const shared = {
      value: item.value,
      label: item.title,
      title: item.title,
      description: item.disabledReason ?? item.description,
      media: media(item),
      badge: item.badge,
      meta: item.meta ?? categoryOf(item),
      disabled: Boolean(item.disabledReason),
      current: value === item.value
    };
    return item.href ? (
      <ListRow key={item.value} {...shared} href={item.href} external={item.external} />
    ) : (
      <ListRow key={item.value} {...shared} onClick={() => onSelect?.(item.value)} />
    );
  };
  const grid = (group: Group) => (
    <div className={styles.grid} data-density={compact ? "compact" : undefined}>
      {group.items.map((item) => tile(item, false, Boolean(group.pinned)))}
    </div>
  );
  const head = (label: string, count?: number) => (
    <div className={styles.head}>
      <h3 className={listStyles.sectionLabel}>{label}</h3>
      {count !== undefined && <span className={listStyles.sectionMeta}>{count}</span>}
    </div>
  );
  const render = (groups: readonly Group[]) => {
    const visible = groups.filter((group) => group.items.length > 0);
    if (layout === "list")
      return (
        <List label={searchLabel}>
          {visible.map((group) =>
            group.label ? (
              <ListSection
                key={group.id}
                label={group.label}
                meta={group.counted ? String(group.items.length) : undefined}
              >
                {group.items.map(row)}
              </ListSection>
            ) : (
              <React.Fragment key={group.id}>{group.items.map(row)}</React.Fragment>
            )
          )}
        </List>
      );
    return visible.map((group) =>
      group.label ? (
        <section key={group.id} className={styles.section} aria-label={group.label}>
          {head(group.label, group.counted ? group.items.length : undefined)}
          {grid(group)}
        </section>
      ) : (
        <React.Fragment key={group.id}>{grid(group)}</React.Fragment>
      )
    );
  };
  const ownPinned = pinnedLabel ? items.filter((item) => item.pinned) : [];
  const pinnedGroup: Group = { id: "pinned", label: pinnedLabel, items: ownPinned, pinned: true };
  let body: React.ReactNode;
  if (!query && items.length === 0 && empty !== undefined)
    body = <EmptyGhostScope ghost={ghost ?? (filtered ? false : "cards")}>{empty}</EmptyGhostScope>;
  else if (query) {
    const found = items.filter((item) => matches(item, query) && !ownPinned.includes(item));
    const trailing = pinnedLabel
      ? []
      : items.filter((item) => item.pinned && !matches(item, query));
    body = (
      <>
        {found.length === 0 && (
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
        )}
        {render([{ id: "results", items: [...found, ...trailing] }, pinnedGroup])}
      </>
    );
  } else {
    const popular = items.filter((item) => item.popular && !ownPinned.includes(item));
    const featured = popularStyle === "featured" && layout === "grid" ? popular : [];
    const rest = items.filter((item) => !ownPinned.includes(item) && !featured.includes(item));
    const lead: Group[] = [
      { id: "popular", label: popularLabel, items: featured.length > 0 ? [] : popular },
      pinnedGroup
    ];
    const above = featured.length > 0 || lead.some((group) => group.items.length > 0);
    let catalog: Group[] = [{ id: "all", label: above ? allLabel : undefined, items: rest }];
    if (groupBy) {
      const groups = new Map<string, TilePickerItem[]>();
      for (const item of rest) {
        const label = categoryOf(item) ?? allLabel;
        groups.set(label, [...(groups.get(label) ?? []), item]);
      }
      catalog = [...groups]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, members]) => ({
          id: `category:${label}`,
          label,
          items: members,
          counted: true
        }));
    }
    body = (
      <>
        {featured.length > 0 && (
          <section className={styles.section} aria-label={popularLabel}>
            {head(popularLabel)}
            <div className={styles.strip}>{featured.map((item) => tile(item, true, false))}</div>
          </section>
        )}
        {render([...lead, ...catalog])}
      </>
    );
  }
  return (
    <div ref={ref} data-slot="tile-picker" className={cn(styles.picker, className)} {...props}>
      {searchable && (
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
      )}
      {body}
    </div>
  );
}
TilePicker.displayName = "TilePicker";
