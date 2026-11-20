import * as React from "react";
import { type VariantProps } from "class-variance-authority";
import { Separator } from "./separator";
import { type IconSource } from "./icon";
declare function ItemGroup({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemGroup {
    var displayName: string;
}
declare function ItemSeparator({ className, ref, ...props }: React.ComponentProps<typeof Separator>): React.JSX.Element;
declare namespace ItemSeparator {
    var displayName: string;
}
declare const itemVariants: (props?: ({
    variant?: "default" | "muted" | "outline" | null | undefined;
    size?: "default" | "md" | "sm" | "xs" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export type ItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "title"> & VariantProps<typeof itemVariants> & {
    asChild?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    icon?: IconSource;
    media?: React.ReactNode;
    badge?: React.ReactNode;
    /** A short, predictable value beside the title, such as a time, date, count, status or role. Put an uncapped string in the description instead. */
    meta?: React.ReactNode;
    error?: React.ReactNode;
    /** Buttons at the row end. They sit beside the copy once the row is 36rem wide and stack below it under that. The width is the content box, so an outline Item needs its padding and border on top (about 39rem outside). */
    actions?: React.ReactNode;
    actionsPlacement?: "end" | "below";
    unread?: boolean;
    resolved?: boolean;
    /**
     * Keeps the title and description on one line with an ellipsis, and puts the full text in a
     * native tooltip. Unset, the title still truncates and the description wraps to two lines
     * before its ellipsis, except on a row with actions at the default or md size, where both
     * wrap. titleLines takes over the title when set, so truncate then governs only the
     * description.
     */
    truncate?: boolean;
    /**
     * Clamps the title to this many lines and shows the full title in a Tooltip while it is cut
     * off. Unset leaves the title to truncate. titleLines={1} reads like truncate but uses a Cipher
     * tooltip instead of a native one.
     */
    titleLines?: number;
    mono?: boolean;
};
declare function Item({ className, variant, size, asChild, title, description, icon, media, badge, meta, error, actions, actionsPlacement, unread, resolved, truncate, titleLines, mono, children, ref, ...props }: ItemProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace Item {
    var displayName: string;
}
declare const itemMediaVariants: (props?: ({
    variant?: "default" | "icon" | "image" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
declare function ItemMedia({ className, variant, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & VariantProps<typeof itemMediaVariants> & {
    ref?: React.Ref<React.ComponentRef<"div">>;
}): React.JSX.Element;
declare namespace ItemMedia {
    var displayName: string;
}
declare function ItemContent({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemContent {
    var displayName: string;
}
declare function ItemTitle({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemTitle {
    var displayName: string;
}
declare function ItemDescription({ className, ref, ...props }: React.ComponentProps<"p">): React.JSX.Element;
declare namespace ItemDescription {
    var displayName: string;
}
declare function ItemActions({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemActions {
    var displayName: string;
}
declare function ItemHeader({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemHeader {
    var displayName: string;
}
declare function ItemFooter({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace ItemFooter {
    var displayName: string;
}
export { Item, ItemActions, ItemContent, ItemDescription, ItemFooter, ItemGroup, ItemHeader, ItemMedia, ItemSeparator, ItemTitle };
export declare function Media({ icon, size, tone, children, className, style, ref, ...props }: React.ComponentPropsWithoutRef<"span"> & {
    icon?: IconSource;
    size?: "sm" | "md" | number;
    tone?: "ok" | "warn" | "bad" | "info";
} & {
    ref?: React.Ref<HTMLSpanElement>;
}): React.JSX.Element;
export declare namespace Media {
    var displayName: string;
}
type TileOwnProps = {
    selected?: boolean;
    title?: React.ReactNode;
    description?: React.ReactNode;
    media?: React.ReactNode;
    /**
     * row ends in a chevron, or a check while selected. inline drops the chevron for grids of
     * choices such as a TilePicker: the title wraps to two lines, with a tooltip once it is cut off,
     * and the description clamps at two. stacked puts the media on top, then the title on one line.
     */
    layout?: "row" | "inline" | "stacked";
    /** Sits right after the title, such as a plan Badge. */
    badge?: React.ReactNode;
    /** @deprecated A category reads better as the description under the title. */
    eyebrow?: React.ReactNode;
    /** Disables the tile and shows why in place of the description. Unlike disabled, it stays focusable so the reason can be reached. */
    disabledReason?: string;
};
type TileButtonProps = TileOwnProps & Omit<React.ComponentPropsWithoutRef<"button">, "title"> & {
    href?: undefined;
    asChild?: false;
    external?: undefined;
    ref?: React.Ref<HTMLButtonElement>;
};
type TileLinkProps = TileOwnProps & Omit<React.ComponentPropsWithoutRef<"a">, "title" | "media"> & {
    /** Opens href in a new tab and marks the tile with an external icon. With asChild, set the child's target yourself. */
    external?: boolean;
    /** Takes the link's destination away and dims it, so it cannot be opened. */
    disabled?: boolean;
    ref?: React.Ref<HTMLAnchorElement>;
} & ({
    /** Renders the tile as a link, so hover shows the URL and modifier or middle clicks open it elsewhere. */
    href: string;
    asChild?: false;
} | {
    /** Renders the one child, such as a router Link, with the tile's content inside it. */
    asChild: true;
    href?: undefined;
});
export type TileProps = TileButtonProps | TileLinkProps;
export declare function Tile({ selected, title, description, media, layout, badge, eyebrow, disabledReason, href, external, asChild, disabled, children, className, onClick, type, ref, ...props }: TileProps): React.JSX.Element;
export declare namespace Tile {
    var displayName: string;
}
