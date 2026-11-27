import * as React from "react";
import { type EmptyGhost } from "../ui/empty";
import type { IconSource } from "../ui/icon";
export type TilePickerItem = {
    value: string;
    title: string;
    /** The line under the title. Wins over category there. */
    description?: React.ReactNode;
    /** A short group name, such as AWS or CI/CD. Shown under the title when there is no description, and what groupBy groups by. */
    category?: string;
    /** @deprecated Use category. */
    eyebrow?: string;
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
    /** grid shows tiles; list shows a List of rows, each with the description or category under its name. */
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
/**
 * Search plus a responsive grid of Tiles, or a List of rows. With an empty search, popular items
 * come first (as a section or a featured strip), then pinned items under pinnedLabel, then every
 * item, grouped by category with groupBy. A search lists its matches flat, then the pinned items,
 * and finding nothing offers to clear it above them. The grid adds columns as the container
 * widens, so it fits a sheet or a page without a frame of its own.
 */
export declare function TilePicker({ items, onSelect, layout, density, groupBy, popular: popularStyle, pinnedLabel, searchable, value, searchLabel, searchPlaceholder, popularLabel, allLabel, noun, empty, ghost, filtered: filteredProp, className, ref, ...props }: TilePickerProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace TilePicker {
    var displayName: string;
}
