import * as React from "react";
import { type EmptyGhost } from "../ui/empty";
import type { IconSource } from "../ui/icon";
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
/**
 * Search plus a responsive grid of stacked Tiles. With an empty search, popular items come first
 * under their own label and every item follows; a search lists its matches flat, then any
 * pinned items, and finding nothing offers to clear it above the pinned items. The grid adds
 * columns as the container widens, so it fits a sheet or a page without a frame of its own.
 */
export declare function TilePicker({ items, onSelect, searchLabel, searchPlaceholder, popularLabel, allLabel, noun, empty, ghost, filtered: filteredProp, className, ref, ...props }: TilePickerProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace TilePicker {
    var displayName: string;
}
