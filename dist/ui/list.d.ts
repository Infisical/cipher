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
    variant?: "framed" | "plain" | "bare" | "segmented" | "divided";
    size?: "md" | "sm";
    actionsPlacement?: "end" | "below";
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
export declare function List({ children: content, title: titleProp, count: countProp, countPlacement: countPlacementProp, action: actionProp, label, variant: requestedVariant, size, actionsPlacement, selection, selectedIds, defaultSelectedIds, onSelectionChange, loading, loadingRows, refreshing, empty, footer: footerProp }: ListProps): React.JSX.Element;
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
export declare function DataList({ items, variant, density }: {
    items: readonly DataListItem[];
    /** stat for headline numbers, meta and props for label and value rows with dividers, inline for a borderless label column beside wrapping values, such as a short breakdown inside another list's value. */
    variant?: "stat" | "meta" | "props" | "inline";
    density?: "default" | "compact";
}): React.JSX.Element;
