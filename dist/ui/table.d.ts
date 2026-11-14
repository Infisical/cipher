import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { type IconName } from "./icon";
declare function Table({ className, containerClassName, containerRef, children, ref, ...props }: React.ComponentProps<"table"> & {
    /** Layout classes for the scroll container (height caps, flex sizing). ref targets the table element itself. */
    containerClassName?: string;
    /** The horizontal scroll container. */
    containerRef?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
declare namespace Table {
    var displayName: string;
}
declare function TableHeader({ className, ref, ...props }: React.ComponentProps<"thead">): React.JSX.Element;
declare namespace TableHeader {
    var displayName: string;
}
/** Marks the body while it holds a focused row at any depth, and tells the row it is nested in. */
declare function TableBody({ className, ref, ...props }: React.ComponentProps<"tbody">): React.JSX.Element;
declare namespace TableBody {
    var displayName: string;
}
declare function TableFooter({ className, ref, ...props }: React.ComponentProps<"tfoot">): React.JSX.Element;
declare namespace TableFooter {
    var displayName: string;
}
/** A row draws its focus ring only when the keyboard moved focus to it, never after a pointer interaction. */
declare function TableRow({ className, focused, onClick, onFocus, onBlur, ref, children, ...props }: React.ComponentProps<"tr"> & {
    /** The row is being edited: every other row in the same body dims its cell contents until this clears. */
    focused?: boolean;
}): React.JSX.Element;
declare namespace TableRow {
    var displayName: string;
}
type PinProps = {
    /** start sticks the cell to the inline start while the table scrolls sideways; viewport keeps a full-width cell's content inside the visible width. */
    pin?: "start" | "viewport";
    /** Inline-start offset of a start-pinned cell, as a CSS length: the width of the pinned columns before it. A cell after a pinned selection cell gets size-row without it. */
    pinOffset?: string;
};
type SelectionProps = {
    /** Draws the selection column: size-row wide, a centered Checkbox and a persistent line-soft divider on its right. */
    selection?: boolean;
    /** With selection, false drops the divider, for an icon or expand column that doubles as selection. */
    divider?: boolean;
};
declare function TableHead({ selection, divider, pin, pinOffset, className, style, ref, ...props }: React.ComponentProps<"th"> & SelectionProps & PinProps): React.JSX.Element;
declare namespace TableHead {
    var displayName: string;
}
/** The one interactive header: a sort or menu trigger that fills its TableHead and takes hover on that cell alone. */
declare function TableHeadButton({ className, type, ref, ...props }: React.ComponentProps<"button">): React.JSX.Element;
declare namespace TableHeadButton {
    var displayName: string;
}
declare function TableCell({ selection, divider, pin, pinOffset, className, style, children, ref, ...props }: React.ComponentProps<"td"> & SelectionProps & PinProps): React.JSX.Element;
declare namespace TableCell {
    var displayName: string;
}
declare function TableCaption({ className, ref, ...props }: React.ComponentProps<"caption">): React.JSX.Element;
declare namespace TableCaption {
    var displayName: string;
}
declare function TableRowActions({ className, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
declare namespace TableRowActions {
    var displayName: string;
}
declare function TableRowIndicators({ className, ref, ...props }: React.ComponentProps<"span">): React.JSX.Element;
declare namespace TableRowIndicators {
    var displayName: string;
}
declare function TableActionsHead({ slots, className, style, children, ref, ...props }: React.ComponentProps<"th"> & {
    slots?: number;
}): React.JSX.Element;
declare namespace TableActionsHead {
    var displayName: string;
}
declare function TableActionsCell({ slots, className, style, ref, ...props }: React.ComponentProps<"td"> & {
    slots?: number;
}): React.JSX.Element;
declare namespace TableActionsCell {
    var displayName: string;
}
/** A full-width header row that names the rows under it. Put it first in its own TableBody, one body per group. */
declare function TableGroupRow({ label, meta, actions, checkbox, selectable, colSpan, actionSlots, className, ref, ...props }: Omit<React.ComponentProps<"tr">, "children"> & {
    label: React.ReactNode;
    /** Muted text after the label, such as the group's row count. */
    meta?: React.ReactNode;
    /** The group's own actions, drawn in the actions column. Needs actionSlots. */
    actions?: React.ReactNode;
    /** A Checkbox that selects the group's rows, drawn in the selection column. */
    checkbox?: React.ReactNode;
    /** Keeps the selection column when the group has no checkbox, so the label lines up with the rows. */
    selectable?: boolean;
    /** Columns the label spans, not counting the selection and actions columns. */
    colSpan: number;
    /** Width of the table's actions column. Omit when the table has none. */
    actionSlots?: number;
}): React.JSX.Element;
declare namespace TableGroupRow {
    var displayName: string;
}
export type TableLoadingColumn = {
    /** Draws a shorter bar, as for the column that names the row. */
    primary?: boolean;
    /** The column holds row actions: one glyph-sized bar in the actions tail. */
    actions?: boolean;
    pin?: boolean | "start";
    maxWidth?: React.CSSProperties["maxWidth"];
    style?: React.CSSProperties;
};
/** Skeleton rows for a table on screen while its rows load: the same shapes, row height and data-loading marking as DataTable loading. */
declare function TableLoadingRows({ columns, rows, selectable, actionSlots, label }: {
    /** One entry per body column, or a count of plain text columns. */
    columns: number | readonly TableLoadingColumn[];
    rows?: number;
    selectable?: boolean;
    /** Adds a TableActionsCell tail with this many action slots. */
    actionSlots?: number;
    /** Announced while loading, naming what loads, such as Loading secrets. DataTable announces its own. */
    label?: string;
}): React.JSX.Element[];
export type RowAction = {
    label: string;
    icon: IconName | LucideIcon;
    onSelect: () => void;
    disabledReason?: string;
};
export type UpToThree<T> = readonly [] | readonly [T] | readonly [T, T] | readonly [T, T, T];
export type RowActionList = UpToThree<RowAction>;
declare function RowActions({ label, inline, menu, menuLabel, menuDisabledReason, lazy, open, defaultOpen, onOpenChange, onMenuCloseAutoFocus, className, ref, ...props }: Omit<React.ComponentProps<"div">, "children"> & {
    label: string;
    inline?: RowActionList;
    menu?: React.ReactNode;
    menuLabel?: string;
    menuDisabledReason?: string;
    /** Renders plain buttons with the same DOM, classes and names, and no tooltips or menu, until the row is hovered or something in it takes focus, then swaps in the real parts in place. A press while idle still runs the action or opens the menu. For long tables. */
    lazy?: boolean;
    /** The More menu's open state, for opening it from outside the row actions. */
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** The More menu's close focus handler: preventDefault keeps focus where a menu item moved it. */
    onMenuCloseAutoFocus?: (event: Event) => void;
}): React.JSX.Element;
declare namespace RowActions {
    var displayName: string;
}
/**
 * Opens a row's actions as a right-click menu on the whole row: the inline actions first, then the
 * More menu items after a separator, from the same nodes RowActions renders. Shift+F10 and the Menu key
 * open it on a focused row; inputs and editable cells keep the browser's own menu.
 */
declare function RowContextMenu({ label, inline, menu, menuDisabledReason, children }: {
    label: string;
    inline?: RowActionList;
    menu?: React.ReactNode;
    menuDisabledReason?: string;
    children: React.ReactElement<React.ComponentProps<"tr">>;
}): React.JSX.Element;
declare namespace RowContextMenu {
    var displayName: string;
}
declare const rowActionSlots: (inline: number, menu: boolean) => number;
export { rowActionSlots, RowActions, RowContextMenu, Table, TableActionsCell, TableActionsHead, TableBody, TableCaption, TableCell, TableFooter, TableGroupRow, TableHead, TableHeadButton, TableHeader, TableLoadingRows, TableRow, TableRowActions, TableRowIndicators };
