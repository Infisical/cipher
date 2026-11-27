import * as React from "react";
import { type CipherLinkTarget } from "../lib/link";
export interface ListRowProps {
    value: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    media?: React.ReactNode;
    badge?: React.ReactNode;
    /** A short, predictable value at the row end, such as a time, date, count, status or role. Put an uncapped string in the description instead. */
    meta?: React.ReactNode;
    actions?: React.ReactNode;
    error?: React.ReactNode;
    children?: React.ReactNode;
    href?: string;
    /** A router link (to, params, search); the title renders as one anchor that keeps modifier clicks native. */
    link?: CipherLinkTarget;
    /** Opens the link in a new tab and marks the row with an external icon. */
    external?: boolean;
    onClick?: (event: React.MouseEvent) => void;
    current?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    unread?: boolean;
    resolved?: boolean;
    label: string;
}
export declare function ListRow({ value, title, description, media, badge, meta, actions, error, children, href, link, external, onClick, current, disabled, selectable, unread, resolved, label }: ListRowProps): React.JSX.Element;
export interface ListHeaderProps {
    title?: React.ReactNode;
    count?: React.ReactNode;
    /** title puts the count right after the title, a number on the accent Count; end keeps it at the far right. */
    countPlacement?: "end" | "title";
    /** Right after the title: status badges, and a DocumentationLink so it stays paired with the title. They drop below the title before it wraps. */
    badges?: React.ReactNode;
    action?: React.ReactNode;
}
export declare const ListHeader: React.FC<ListHeaderProps>;
/** State that must stay visible under the rows, never an action result; those go to a toast. */
export declare const ListFooter: React.FC<{
    children: React.ReactNode;
}>;
export interface ListProps extends ListHeaderProps {
    children?: React.ReactNode;
    label: string;
    /** flush is for read-only rows under a DataList or other content: no row inset or hover ground, so row content starts on the container's left edge. */
    variant?: "framed" | "plain" | "bare" | "segmented" | "divided" | "flush";
    size?: "md" | "sm";
    actionsPlacement?: "end" | "below";
    /** Sits rows on a 16px content lane for a list inside a popover or sheet: media, text and trailing buttons sit inside the lane, so a button's own hover fill keeps the same 8px off the row's hover and selected fill, which stays 8px off the container edge. Applies to the bare, segmented and divided variants, which draw no frame or border of their own. */
    inset?: boolean;
    selection?: "none" | "multiple";
    selectedIds?: readonly string[];
    defaultSelectedIds?: readonly string[];
    onSelectionChange?: (ids: string[]) => void;
    loading?: boolean;
    loadingRows?: number;
    /** A background refetch: the current rows stay, with a thin sweep on the top edge instead of loading's skeleton rows. */
    refreshing?: boolean;
    empty?: React.ReactNode;
    /** State that must stay visible under the rows, never an action result; those go to a toast. */
    footer?: React.ReactNode;
}
export declare function List({ children: content, title: titleProp, count: countProp, countPlacement: countPlacementProp, badges: badgesProp, action: actionProp, label, variant: requestedVariant, size, actionsPlacement, inset, selection, selectedIds, defaultSelectedIds, onSelectionChange, loading, loadingRows, refreshing, empty, footer: footerProp }: ListProps): React.JSX.Element;
export declare function ListSection({ label, meta, children }: {
    label: React.ReactNode;
    meta?: React.ReactNode;
    children: React.ReactNode;
}): React.JSX.Element;
export type DataListItem = readonly [React.ReactNode, React.ReactNode] | readonly [
    React.ReactNode,
    React.ReactNode,
    {
        span?: "half";
        /** A trailing inline action (copy, reveal, edit). It sits on the value's first line, so a wrapped value grows downward and the action stays put. */
        action?: React.ReactNode;
    }
];
export type DataListLabelWidth = "cell-min" | "data-list-term" | "text-min" | (string & {});
export declare function DataList({ items, variant, density, labelWidth }: {
    items: readonly DataListItem[];
    /** stat for headline numbers, meta and props for label and value rows with dividers, inline for a borderless label column beside wrapping values, such as a short breakdown inside another list's value. */
    variant?: "stat" | "meta" | "props" | "inline";
    density?: "default" | "compact";
    /** Inline only. The label width, as a size token (cell-min, data-list-term, text-min) or a CSS length; defaults to data-list-term. Values in every row and in sibling lists start on one edge, and when a row can't keep text-min for the value beside the label, labels take the full row and values stack under them. */
    labelWidth?: DataListLabelWidth;
}): React.JSX.Element;
