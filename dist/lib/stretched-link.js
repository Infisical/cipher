import { usePresenceCount, useReportPresence } from "./presence-count.js";
import * as React from "react";
// src/lib/stretched-link.ts
var StretchedLinkContext = React.createContext(null);
/**
* A table row or Card whose stretched RowLink or CardLink covers it. Hosts nest: an outer row or Card
* also counts a link inside an inner one.
*/
function useStretchedLinkHost() {
	const [hasLink, report] = usePresenceCount();
	useReportPresence(React.useContext(StretchedLinkContext), hasLink);
	return [hasLink, report];
}
function useStretchedLink(active) {
	useReportPresence(React.useContext(StretchedLinkContext), active);
}
export { StretchedLinkContext, useStretchedLink, useStretchedLinkHost };

//# sourceMappingURL=stretched-link.js.map