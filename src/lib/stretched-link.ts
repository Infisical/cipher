import * as React from "react";

import { type PresenceReport, usePresenceCount, useReportPresence } from "./presence-count";

const StretchedLinkContext = React.createContext<PresenceReport | null>(null);

/**
 * A table row or Card whose own stretched RowLink or CardLink covers it. A link inside a nested host,
 * such as a row in a Card's table, belongs to that host and never makes the outer one clickable.
 */
export function useStretchedLinkHost() {
  return usePresenceCount();
}

export function useStretchedLink(active: boolean) {
  useReportPresence(React.useContext(StretchedLinkContext), active);
}

export { StretchedLinkContext };
