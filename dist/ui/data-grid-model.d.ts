export type GridValue = string | null;
export type ParseResult = {
    value: GridValue;
} | {
    error: string;
};
export interface GridCell {
    rowId: string;
    columnId: string;
}
export interface GridSelection {
    active: GridCell;
    anchor: GridCell;
}
export interface GridChange<Row> extends GridCell {
    row: Row;
    previous: GridValue;
    value: GridValue;
}
export interface GridColumn<Row> {
    id: string;
    header: string;
    type?: string;
    getValue: (row: Row) => GridValue;
    parse?: (text: GridValue, row: Row) => ParseResult;
    format?: (value: GridValue, row: Row) => string;
    editable?: boolean;
    nullable?: boolean;
    primaryKey?: boolean;
    sensitive?: boolean;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    align?: "start" | "end";
}
export declare function encodeTsv(rows: readonly (readonly GridValue[])[]): string;
export declare function decodeTsv(text: string): {
    rows: GridValue[][];
} | {
    error: string;
};
export declare function parseGridValue<Row>(column: GridColumn<Row>, value: GridValue, row: Row): ParseResult;
export declare function canEditColumn<Row>(column: GridColumn<Row>): boolean;
export declare function pasteGrid<Row>({ rows, columns, getRowId, active, text }: {
    rows: readonly Row[];
    columns: readonly GridColumn<Row>[];
    getRowId: (row: Row) => string;
    active: GridCell;
    text: string;
}): {
    changes: GridChange<Row>[];
} | {
    error: string;
};
