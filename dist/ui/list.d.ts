import * as React from "react";
import { type CipherLinkTarget } from "../lib/link";
export interface ListRowProps {
    value: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    media?: React.ReactNode;
    badge?: React.ReactNode;
    meta?: React.ReactNode;
    actions?: React.ReactNode;
    error?: React.ReactNode;
    children?: React.ReactNode;
    href?: string;
    /** A router link (to, params, search); the title renders as one anchor that keeps modifier clicks native. */
    link?: CipherLinkTarget;
    onClick?: (event: React.MouseEvent) => void;
    current?: boolean;
    disabled?: boolean;
    selectable?: boolean;
    unread?: boolean;
    resolved?: boolean;
    label: string;
}
export declare function ListRow({ value, title, description, media, badge, meta, actions, error, children, href, link, onClick, current, disabled, selectable, unread, resolved, label }: ListRowProps): React.JSX.Element;
export interface ListHeaderProps {
    title?: React.ReactNode;
    count?: React.ReactNode;
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
    empty?: React.ReactNode;
    /** State that must stay visible under the rows, never an action result; those go to a toast. */
    footer?: React.ReactNode;
}
export declare function List({ children: content, title: titleProp, count: countProp, action: actionProp, label, variant: requestedVariant, size, actionsPlacement, selection, selectedIds, defaultSelectedIds, onSelectionChange, loading, loadingRows, empty, footer: footerProp }: ListProps): React.JSX.Element;
export declare function ListSection({ label, meta, children }: {
    label: React.ReactNode;
    meta?: React.ReactNode;
    children: React.ReactNode;
}): React.JSX.Element;
export type DataListItem = readonly [React.ReactNode, React.ReactNode] | readonly [React.ReactNode, React.ReactNode, {
    span: "half";
}];
export declare function DataList({ items, variant, density }: {
    items: readonly DataListItem[];
    variant?: "stat" | "meta" | "props";
    density?: "default" | "compact";
}): React.JSX.Element;
