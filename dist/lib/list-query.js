import * as React from "react";
import { jsx } from "react/jsx-runtime";
// src/lib/list-query.tsx
var ListQueryContext = React.createContext(null);
/**
* Wraps a list and the FilterBars that narrow it. Each FilterBar reports its search text and
* applied filters here, and DataTable, Grid and TilePicker read them combined, so an empty list
* under any search or filter reads as no matches without passing filtered by hand.
*/
function ListQueryScope({ children }) {
	const [reports, setReports] = React.useState({});
	const report = React.useCallback((id, query) => {
		setReports((current) => {
			if (query === null) {
				if (!(id in current)) return current;
				const { [id]: _removed, ...rest } = current;
				return rest;
			}
			const previous = current[id];
			if (previous && previous.search === query.search && previous.filters === query.filters) return current;
			return {
				...current,
				[id]: query
			};
		});
	}, []);
	const store = React.useMemo(() => {
		const all = Object.values(reports);
		return {
			query: {
				search: all.map((entry) => entry.search.trim()).filter(Boolean).join(" "),
				filters: all.reduce((sum, entry) => sum + entry.filters, 0)
			},
			report
		};
	}, [reports, report]);
	return /* @__PURE__ */ jsx(ListQueryContext, {
		value: store,
		children
	});
}
/** The combined search text and applied filter count of the nearest ListQueryScope, or undefined outside one. */
function useListQuery() {
	return React.useContext(ListQueryContext)?.query;
}
/** Whether the nearest ListQueryScope has a search or a filter applied; false outside one. */
function useListFiltered() {
	const query = useListQuery();
	return Boolean(query && (query.search || query.filters > 0));
}
/** Reports a search and filter count to the nearest ListQueryScope, and withdraws them on unmount. */
function useReportListQuery(search, filters) {
	const report = React.useContext(ListQueryContext)?.report;
	const id = React.useId();
	React.useLayoutEffect(() => {
		report?.(id, {
			search,
			filters
		});
	}, [
		report,
		id,
		search,
		filters
	]);
	React.useLayoutEffect(() => () => report?.(id, null), [report, id]);
}
export { ListQueryScope, useListFiltered, useListQuery, useReportListQuery };

//# sourceMappingURL=list-query.js.map