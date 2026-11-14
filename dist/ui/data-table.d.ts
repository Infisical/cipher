import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { type IconName } from "./icon";
import { type UpToThree } from "./table";
export interface DataTableColumn<Row> {
    id: string;
    header: string;
    render?: (row: Row, index: number) => React.ReactNode;
    toggle?: DataTableToggle<Row>;
    text?: (row: Row) => string;
    primary?: boolean;
    /** Sets the column in mono, for machine values compared character by character: secret keys, key IDs, hashes, hosts. Names people chose stay in the sans. */
    mono?: boolean;
    sortable?: boolean;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    grow?: boolean;
    align?: "start" | "end" | "center";
    actions?: boolean;
    /** true pins the column to the inline end (the actions tail); start pins it to the inline start, after a pinned selection column. */
    pin?: boolean | "start";
    hideHeader?: boolean;
}
export interface DataTableToggle<Row> {
    checked: (row: Row) => boolean | "indeterminate";
    onChange: (rowIds: string[], checked: boolean) => void;
    disabledReason?: (row: Row) => string | undefined;
    absent?: (row: Row) => boolean;
    adornment?: (row: Row) => React.ReactNode;
    label?: string;
}
export interface DataTableRowAction<Row> {
    label: string | ((row: Row) => string);
    icon: IconName | LucideIcon;
    onSelect: (row: Row) => void;
    disabledReason?: (row: Row) => string | undefined;
}
export interface DataTableRowActions<Row> {
    /** At most three icon actions, the same set on every row; a blocked one stays visible and disabled with its reason. */
    inline?: UpToThree<DataTableRowAction<Row>>;
    /** Items for the More menu after the inline actions, for everything past the first three. */
    renderMenu?: (row: Row) => React.ReactNode;
    menuLabel?: string;
    menuDisabledReason?: (row: Row) => string | undefined;
    header?: string;
}
export interface DataTableGroup<Row> {
    id: string;
    /** The header row's label, such as the parent resource's name or a link to it. */
    label: React.ReactNode;
    /** Plain-text name for the group's checkbox ("Select all in name") when label is not a string. */
    name?: string;
    rows: readonly Row[];
    /** Muted text after the label, such as the group's row count. */
    meta?: React.ReactNode;
    /** The group's own actions, such as a RowActions menu, drawn in the actions tail. Needs rowActions. */
    actions?: React.ReactNode;
}
interface DataTableBaseProps<Row> {
    label: string;
    columns: readonly DataTableColumn<Row>[];
    getRowId: (row: Row) => string;
    rowLabel: (row: Row) => string;
    variant?: "basic" | "striped" | "bordered";
    selectable?: boolean;
    selectedIds?: readonly string[];
    defaultSelectedIds?: readonly string[];
    onSelectionChange?: (ids: string[]) => void;
    isSelectable?: (row: Row) => boolean;
    selectionDisabledReason?: (row: Row) => string | undefined;
    sort?: {
        columnId: string;
        direction: "asc" | "desc";
    };
    onSortChange?: (sort: {
        columnId: string;
        direction: "asc" | "desc";
    }) => void;
    empty?: React.ReactNode;
    height?: number;
    virtual?: boolean;
    rowHeight?: number;
    loadMore?: {
        label: string;
        onClick: () => void;
        loading?: boolean;
    };
    end?: React.ReactNode;
    /**
     * State that must stay visible under the rows, such as "Showing 5 of 120 after filter". Never an
     * action result: copied, saved, deleted, moved, uploaded and failures go to a toast.
     */
    persistentStatus?: React.ReactNode;
    onRowActivate?: (row: Row) => void;
    pagination?: React.ReactNode;
    loading?: boolean;
    loadingRows?: number;
    actionBar?: React.ReactNode;
    /** Row ids being edited. Their rows render focused and the other rows dim until the value clears. */
    focusedRowId?: string | readonly string[];
    /** Persistent row actions in the sticky tail column: inline icon actions, then the More menu. */
    rowActions?: DataTableRowActions<Row>;
    /** Right-click (and Shift+F10 or the Menu key) on a data row opens its inline actions and More menu items. On by default with rowActions. */
    rowContextMenu?: boolean;
    /** The scroll container (vertical and horizontal), for ports that read scrollTop or observe it. */
    containerRef?: React.Ref<HTMLDivElement>;
    /** Layout classes for the scroll container, such as a flex-fill height. */
    containerClassName?: string;
    /** One level of child rows under a row, indented by space-row-indent. */
    getRowChildren?: (row: Row) => readonly Row[] | undefined;
}
export type DataTableProps<Row> = DataTableBaseProps<Row> & ({
    rows: readonly Row[];
    groups?: never;
} | {
    /** Rows under full-width group header rows, one tbody per group. Groups with no rows are not drawn. */
    groups: readonly DataTableGroup<Row>[];
    rows?: never;
});
export declare function DataTable<Row>({ label, rows: flatRows, groups, getRowChildren, columns, getRowId, rowLabel, variant, selectable, selectedIds, defaultSelectedIds, onSelectionChange, isSelectable: isSelectableProp, selectionDisabledReason, sort, onSortChange, empty, height, virtual, rowHeight, loadMore, end, persistentStatus, onRowActivate, pagination, loading, loadingRows, actionBar, focusedRowId, rowActions, rowContextMenu, containerRef, containerClassName }: DataTableProps<Row>): React.JSX.Element;
export declare function EnvMark({ present, env }: {
    present: boolean;
    env?: string;
}): React.JSX.Element;
export {};
