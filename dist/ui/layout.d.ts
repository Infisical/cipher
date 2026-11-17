import * as React from "react";
import { type EmptyGhost } from "./empty";
export declare function PageMeasure({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace PageMeasure {
    var displayName: string;
}
export declare function FormMeasure({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace FormMeasure {
    var displayName: string;
}
export type LayoutGap = 0 | 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 48;
type LayoutProps = React.ComponentPropsWithoutRef<"div"> & {
    gap?: LayoutGap;
    align?: "start" | "center" | "end" | "stretch";
    justify?: "start" | "center" | "end" | "between";
};
export declare function Stack({ gap, align, justify, style, className, ref, ...props }: LayoutProps & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Stack {
    var displayName: string;
}
export declare function Inline({ gap, align, justify, wrap, style, className, ref, ...props }: Omit<LayoutProps, "align"> & {
    align?: LayoutProps["align"] | "baseline";
    wrap?: boolean;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Inline {
    var displayName: string;
}
/** An Inline child that takes the row's leftover width, such as a field beside buttons that hug their labels. */
export declare function InlineGrow({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace InlineGrow {
    var displayName: string;
}
/**
 * An Inline child that sets how it sits in the row. shrink={false} keeps a badge, button or
 * timestamp at its own width while a sibling truncates; truncate ends plain content in an ellipsis
 * on one line. A truncating row needs Inline wrap={false}, or the long child moves to its own line.
 */
export declare function InlineItem({ shrink, truncate, title, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    shrink?: boolean;
    truncate?: boolean;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace InlineItem {
    var displayName: string;
}
export declare function Grid({ gap, columns, min, empty, ghost, filtered: filteredProp, style, className, children, ref, ...props }: Omit<LayoutProps, "align" | "justify"> & {
    columns?: 2 | 3 | 4 | "1:2";
    min?: "tile" | "card";
    /** Shown across every column when the grid has no children, such as an EmptyState. */
    empty?: React.ReactNode;
    /** The ghost behind an Empty in the empty slot. Defaults to cards, and to none while filtered. */
    ghost?: EmptyGhost;
    /** The items are narrowed by a search or filters, so an empty grid means no matches and draws no ghost. Inside a ListQueryScope it follows the FilterBar unless passed. */
    filtered?: boolean;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Grid {
    var displayName: string;
}
export declare function Container({ className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Container {
    var displayName: string;
}
export declare function Measure({ size, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    size?: "page" | "form" | "prose";
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace Measure {
    var displayName: string;
}
export declare function DetailLayout({ aside, asideLabel, children, className, ref, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    aside: React.ReactNode;
    asideLabel: string;
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace DetailLayout {
    var displayName: string;
}
export type PanesIdentity = {
    media?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    badges?: React.ReactNode;
};
export type PanesState = {
    /** Below size-pane-collapse: the identity is a fixed header and the aside body is a tab of its own. */
    narrow: boolean;
    detailsOpen: boolean;
    setDetailsOpen: (open: boolean) => void;
};
type PanesProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    identity?: PanesIdentity;
    aside: React.ReactNode;
    /** Names the aside landmark and, in the narrow layout, its tab. Defaults to Details. */
    asideLabel?: string;
    asideClassName?: string;
    ref?: React.Ref<HTMLDivElement>;
} & ({
    /** Names the main pane's tab in the narrow layout. */
    mainLabel: string;
    children: React.ReactNode;
} | {
    mainLabel?: never;
    children: (state: PanesState) => React.ReactNode;
});
/**
 * A fixed-width aside beside a main pane inside a bounded height, such as a sheet or a dialog. The
 * aside holds the identity (media, title, description, badges) above its body, each pane scrolls
 * on its own, and the main pane's fields run its full width. Below size-pane-collapse the identity
 * becomes a fixed header and two tabs under it switch between the aside body (asideLabel, first)
 * and the main pane (mainLabel, shown first). Pass children as a function of PanesState to place
 * the tabs yourself, as SheetContent does with header tabs. A page with a sidecar uses
 * DetailLayout, which scrolls with the page instead.
 */
export declare function Panes({ identity, aside, asideLabel, asideClassName, mainLabel, children, className, ref, ...props }: PanesProps): React.JSX.Element;
export declare namespace Panes {
    var displayName: string;
}
export {};
