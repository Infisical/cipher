import * as React from "react";
export type ListQuery = {
    search: string;
    filters: number;
};
/**
 * Wraps a list and the FilterBars that narrow it. Each FilterBar reports its search text and
 * applied filters here, and DataTable, Grid and TilePicker read them combined, so an empty list
 * under any search or filter reads as no matches without passing filtered by hand.
 */
export declare function ListQueryScope({ children }: {
    children: React.ReactNode;
}): React.JSX.Element;
/** The combined search text and applied filter count of the nearest ListQueryScope, or undefined outside one. */
export declare function useListQuery(): ListQuery | undefined;
/** Whether the nearest ListQueryScope has a search or a filter applied; false outside one. */
export declare function useListFiltered(): boolean;
/** Reports a search and filter count to the nearest ListQueryScope, and withdraws them on unmount. */
export declare function useReportListQuery(search: string, filters: number): void;
