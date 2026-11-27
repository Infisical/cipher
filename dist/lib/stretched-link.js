import { usePresenceCount, useReportPresence } from "./presence-count.js";
import * as React from "react";
// src/lib/stretched-link.ts
var StretchedLinkContext = React.createContext(null);
/**
* A table row or Card whose own stretched RowLink or CardLink covers it. A link inside a nested host,
* such as a row in a Card's table, belongs to that host and never makes the outer one clickable.
*/
function useStretchedLinkHost() {
	return usePresenceCount();
}
/** Reports the link to its host and returns whether one exists, since a link with no host has nothing to cover. */
function useStretchedLink(active) {
	const report = React.useContext(StretchedLinkContext);
	useReportPresence(report, active);
	return report !== null;
}
var CellLinkContext = React.createContext(null);
/** A table cell whose own CellLink covers it, without making the row clickable. */
function useCellLinkHost() {
	return usePresenceCount();
}
function useCellLink(active) {
	useReportPresence(React.useContext(CellLinkContext), active);
}
export { CellLinkContext, StretchedLinkContext, useCellLink, useCellLinkHost, useStretchedLink, useStretchedLinkHost };

//# sourceMappingURL=stretched-link.js.map