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

/** Reports the link to its host and returns whether one exists, since a link with no host has nothing to cover. */
export function useStretchedLink(active: boolean) {
  const report = React.useContext(StretchedLinkContext);
  useReportPresence(report, active);
  return report !== null;
}

const CellLinkContext = React.createContext<PresenceReport | null>(null);

/** A table cell whose own CellLink covers it, without making the row clickable. */
export function useCellLinkHost() {
  return usePresenceCount();
}

export function useCellLink(active: boolean) {
  useReportPresence(React.useContext(CellLinkContext), active);
}

export { CellLinkContext, StretchedLinkContext };
