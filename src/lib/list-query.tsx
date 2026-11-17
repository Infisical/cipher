import * as React from "react";

export type ListQuery = { search: string; filters: number };

type ListQueryStore = {
  query: ListQuery;
  setQuery: (query: ListQuery) => void;
};

const ListQueryContext = React.createContext<ListQueryStore | null>(null);

const EMPTY: ListQuery = { search: "", filters: 0 };

/**
 * Wraps a list and the FilterBar that narrows it. FilterBar reports its search text and applied
 * filters here, and DataTable, Grid and TilePicker read them, so an empty list under a search or
 * filter reads as no matches without passing filtered by hand.
 */
export function ListQueryScope({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = React.useState(EMPTY);
  const store = React.useMemo(() => ({ query, setQuery }), [query]);
  return <ListQueryContext value={store}>{children}</ListQueryContext>;
}

/** The search text and applied filter count of the nearest ListQueryScope, or undefined outside one. */
export function useListQuery(): ListQuery | undefined {
  return React.useContext(ListQueryContext)?.query;
}

/** Whether the nearest ListQueryScope has a search or a filter applied; false outside one. */
export function useListFiltered(): boolean {
  const query = useListQuery();
  return Boolean(query && (query.search.trim() || query.filters > 0));
}

/** Reports a search and filter count to the nearest ListQueryScope, and clears them on unmount. */
export function useReportListQuery(search: string, filters: number) {
  const setQuery = React.useContext(ListQueryContext)?.setQuery;
  React.useLayoutEffect(() => {
    setQuery?.({ search, filters });
  }, [setQuery, search, filters]);
  React.useLayoutEffect(() => () => setQuery?.(EMPTY), [setQuery]);
}
