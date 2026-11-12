import * as React from "react";
import { type GridChange, type GridColumn, type GridSelection } from "./data-grid-model";
export type { GridCell, GridChange, GridColumn, GridSelection, GridValue } from "./data-grid-model";
export interface DataGridProps<Row> {
    rows: readonly Row[];
    columns: readonly GridColumn<Row>[];
    getRowId: (row: Row) => string;
    label: string;
    editable?: boolean;
    onCellsChange?: (changes: readonly GridChange<Row>[], context: {
        signal: AbortSignal;
    }) => void | Promise<void>;
    onSelectionChange?: (selection: GridSelection | null) => void;
    dirty?: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
    height?: number;
    rowHeight?: number;
    rowNumberStart?: number;
    sort?: {
        columnId: string;
        direction: "asc" | "desc";
    };
    onSortChange?: (sort: {
        columnId: string;
        direction: "asc" | "desc";
    }) => void;
    onColumnResize?: (columnId: string, width: number | null) => void;
    onCopy?: (text: string, count: number) => void;
    /** Content of the frame band under the grid: counts, pagination or actions. Never an action result such as copied, saved or deleted; that goes to a toast. */
    footer?: React.ReactNode;
    empty?: React.ReactNode;
    /** Shows a + at the end of the header that opens a name, type and nullable form. */
    onAddColumn?: (column: NewGridColumn) => void;
    /** Shows a New row action in the footer band. Return the new row's id to start editing it. */
    onAddRow?: () => string | void;
    /** Called when a new row's first edit is cancelled before anything was committed. */
    onAddRowCancel?: (rowId: string) => void;
}
export declare const gridColumnTypes: readonly ["text", "int8", "bool", "timestamp", "json"];
export type NewGridColumn = {
    name: string;
    type: (typeof gridColumnTypes)[number];
    nullable: boolean;
};
export declare function DataGrid<Row>({ rows, columns, getRowId, label, editable, onCellsChange, onSelectionChange, dirty, height, rowHeight, rowNumberStart, sort, onSortChange, onColumnResize, onCopy, footer, empty, onAddColumn, onAddRow, onAddRowCancel }: DataGridProps<Row>): React.JSX.Element;
