import * as React from "react";
// src/lib/presence-count.ts
/**
* Counts descendants that report themselves through context, so a container styles itself from
* React state instead of a :has() selector, which would make every DOM change below it relayout the document.
*/
function usePresenceCount() {
	const [count, setCount] = React.useState(0);
	const report = React.useCallback((delta) => setCount((value) => value + delta), []);
	return [count > 0, report];
}
/** Reports to the nearest counter while active holds. */
function useReportPresence(report, active) {
	React.useLayoutEffect(() => {
		if (!active || !report) return void 0;
		report(1);
		return () => report(-1);
	}, [active, report]);
}
export { usePresenceCount, useReportPresence };

//# sourceMappingURL=presence-count.js.map