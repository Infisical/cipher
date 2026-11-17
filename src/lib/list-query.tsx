import * as React from "react";

export type ListQuery = { search: string; filters: number };

type ListQueryStore = {
  query: ListQuery;
  report: (id: string, query: ListQuery | null) => void;
};

const ListQueryContext = React.createContext<ListQueryStore | null>(null);

/**
 * Wraps a list and the FilterBars that narrow it. Each FilterBar reports its search text and
 * applied filters here, and DataTable, Grid and TilePicker read them combined, so an empty list
 * under any search or filter reads as no matches without passing filtered by hand.
 */
export function ListQueryScope({ children }: { children: React.ReactNode }) {
  const [reports, setReports] = React.useState<Record<string, ListQuery>>({});
  const report = React.useCallback((id: string, query: ListQuery | null) => {
    setReports((current) => {
      if (query === null) {
        if (!(id in current)) return current;
        const { [id]: _removed, ...rest } = current;
        return rest;
      }
      const previous = current[id];
      if (previous && previous.search === query.search && previous.filters === query.filters)
        return current;
      return { ...current, [id]: query };
    });
  }, []);
  const store = React.useMemo(() => {
    const all = Object.values(reports);
    return {
      query: {
        search: all
          .map((entry) => entry.search.trim())
          .filter(Boolean)
          .join(" "),
        filters: all.reduce((sum, entry) => sum + entry.filters, 0)
      },
      report
    };
  }, [reports, report]);
  return <ListQueryContext value={store}>{children}</ListQueryContext>;
}

/** The combined search text and applied filter count of the nearest ListQueryScope, or undefined outside one. */
export function useListQuery(): ListQuery | undefined {
  return React.useContext(ListQueryContext)?.query;
}

/** Whether the nearest ListQueryScope has a search or a filter applied; false outside one. */
export function useListFiltered(): boolean {
  const query = useListQuery();
  return Boolean(query && (query.search || query.filters > 0));
}

/** Reports a search and filter count to the nearest ListQueryScope, and withdraws them on unmount. */
export function useReportListQuery(search: string, filters: number) {
  const report = React.useContext(ListQueryContext)?.report;
  const id = React.useId();
  React.useLayoutEffect(() => {
    report?.(id, { search, filters });
  }, [report, id, search, filters]);
  React.useLayoutEffect(() => () => report?.(id, null), [report, id]);
}
