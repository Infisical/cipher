import * as React from "react";
import { type EmptyGhost } from "./empty";
import { type IconSource } from "./icon";
import { type InlineEdit, type UpToThree } from "./table";
export interface DataTableColumn<Row> {
    id: string;
    header: string;
    render?: (row: Row, index: number) => React.ReactNode;
    toggle?: DataTableToggle<Row>;
    /** The cell's plain text: its hover title when the value truncates, and the value itself when the column has no render. */
    text?: (row: Row) => string;
    /** The row's name column. Without a width or minWidth it keeps at least size-text-min, so on a narrow screen the table scrolls sideways instead of squeezing names. A page-scrolling virtual table can't scroll sideways, so there it keeps size-cell-min. */
    primary?: boolean;
    /** Sets the column in mono, for machine values compared character by character: secret keys, key IDs, hashes, hosts. Names people chose stay in the sans. */
    mono?: boolean;
    /** Wraps long text onto more lines and grows the row, instead of truncating it to one line. */
    wrap?: boolean;
    /** Badges or icons right after the value, such as a status badge or a description tooltip. The value truncates before they do; at the narrowest widths, once the value is down to 12 characters, a badge that no longer fits hides whole. */
    badges?: (row: Row, index: number) => React.ReactNode;
    /** A muted second line under the cell's value, such as an email under a name or a key under a label. */
    secondary?: (row: Row, index: number) => React.ReactNode;
    /** The column's cell in a summary row under the body, such as a total. Any column with a footer adds the row. */
    footer?: React.ReactNode;
    sortable?: boolean;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    grow?: boolean;
    /** Hides the column while the table is too narrow to show every column, when the primary column's names would truncate or the table would scroll sideways. For secondary columns such as a usage or a description. */
    dropFirst?: boolean;
    align?: "start" | "end" | "center";
    actions?: boolean;
    /** true pins the column to the inline end (the actions tail); start pins it to the inline start, after a pinned selection column. */
    pin?: boolean | "start";
    hideHeader?: boolean;
    /** Edits the cell in place for this row, or undefined when the row can't be edited. Click the cell, or press Enter or F2 on it, to open the editor. */
    edit?: (row: Row) => InlineEdit | undefined;
}
/** Attributes and handlers for a data row's tr, such as drag and drop handlers that make it a drop target. */
export type DataTableRowProps = Omit<React.HTMLAttributes<HTMLTableRowElement>, "children" | "dangerouslySetInnerHTML" | "className" | "style"> & {
    /** Draws a drop indicator: an edge before or after the row, or the whole row as the target. */
    "data-drop-target"?: "before" | "after" | "inside";
    [data: `data-${string}`]: string | number | boolean | undefined;
};
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
    icon: IconSource;
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
    /** The ghost behind an Empty in the empty slot. Defaults to rows, and to none while filtered or when the table sits flush in a framed Card. */
    ghost?: EmptyGhost;
    /** The rows are narrowed by a search or filters, so an empty table means no matches and draws no ghost. Inside a ListQueryScope it follows the FilterBar unless passed. */
    filtered?: boolean;
    /** Caps the table in its own scroll window. With virtual, the window is trimmed to the header plus whole rows, so no row is cut at the bottom edge. */
    height?: number;
    /**
     * Renders only the rows in view. With height it windows the table's own scroll; without height the
     * table flows with the page, its header sticks to the top of the page's scroll area, and rows are
     * windowed against that scroll. Horizontal overflow is clipped then, so size the columns to fit.
     */
    virtual?: boolean;
    rowHeight?: number;
    /**
     * A quiet "Show more" at the end of the footer. In a framed Card with footerPlacement="frame" and no
     * footer of its own, the footer moves into the card's frame band; anywhere else it is the table's own.
     */
    loadMore?: {
        label?: string;
        onClick: () => void;
        loading?: boolean;
    };
    /** Collapses rows that loadMore added, beside "Show more" in the footer. */
    showFewer?: {
        label?: string;
        onClick: () => void;
    };
    /** Shown at the end of the footer once loadMore is gone, such as "End of events". */
    end?: React.ReactNode;
    /**
     * State that must stay visible under the rows, such as "Showing 5 of 120 after filter". It starts
     * the footer, muted, before any loadMore. Never an action result: copied, saved, deleted, moved,
     * uploaded and failures go to a toast.
     */
    persistentStatus?: React.ReactNode;
    onRowActivate?: (row: Row) => void;
    /** Rows that return false keep the default cursor, take no row focus stop, and ignore click and Enter. Defaults to every row. */
    isRowActivatable?: (row: Row) => boolean;
    pagination?: React.ReactNode;
    loading?: boolean;
    loadingRows?: number;
    /** A background refetch: the current rows stay, with a thin sweep on the top edge instead of loading's skeleton. */
    refreshing?: boolean;
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
    /** Rows that stay in the table but read as inactive, such as disabled or archived ones: muted text on the done ground. */
    isRowMuted?: (row: Row) => boolean;
    /** Tints a row by tone: bad marks one that is invalid, such as a row an import cannot take, and colors the icons in its primary cell, other than its badges. */
    rowTone?: (row: Row) => "bad" | undefined;
    /** Extra attributes and handlers for each data row's tr. Handlers run before DataTable's own, which skip a default-prevented event. */
    rowProps?: (row: Row, index: number) => DataTableRowProps;
    /**
     * Lets a person put the rows in order: a grip at the start of the first column picks a row up by
     * pointer or keyboard, and a drop edge shows where it lands. Flat rows only; leave sort unset while it
     * is on.
     */
    reorder?: {
        onReorder: (rows: Row[]) => void;
        /** A disabled row keeps its grip inert; other rows can still move past it. */
        isRowDisabled?: (row: Row) => boolean;
    };
}
export type DataTableProps<Row> = DataTableBaseProps<Row> & ({
    rows: readonly Row[];
    groups?: never;
} | {
    /** Rows under full-width group header rows, one tbody per group. Groups with no rows are not drawn. */
    groups: readonly DataTableGroup<Row>[];
    rows?: never;
});
export declare function DataTable<Row>({ label, rows: flatRows, groups, getRowChildren, columns: allColumns, getRowId, rowLabel, variant, selectable, selectedIds, defaultSelectedIds, onSelectionChange, isSelectable: isSelectableProp, selectionDisabledReason, sort, onSortChange, empty, ghost, filtered: filteredProp, height, virtual, rowHeight, loadMore, showFewer, end, persistentStatus, onRowActivate, isRowActivatable, pagination, loading, loadingRows, refreshing, actionBar, focusedRowId, rowActions, rowContextMenu, containerRef, containerClassName, isRowMuted, rowTone, rowProps, reorder }: DataTableProps<Row>): React.JSX.Element;
export declare function EnvMark({ present, env }: {
    present: boolean;
    env?: string;
}): React.JSX.Element;
export {};
