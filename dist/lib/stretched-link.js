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
function useStretchedLink(active) {
	useReportPresence(React.useContext(StretchedLinkContext), active);
}
export { StretchedLinkContext, useStretchedLink, useStretchedLinkHost };

//# sourceMappingURL=stretched-link.js.map