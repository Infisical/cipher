import * as React from "react";
import { type PresenceReport } from "./presence-count";
declare const StretchedLinkContext: React.Context<PresenceReport | null>;
/**
 * A table row or Card whose own stretched RowLink or CardLink covers it. A link inside a nested host,
 * such as a row in a Card's table, belongs to that host and never makes the outer one clickable.
 */
export declare function useStretchedLinkHost(): readonly [boolean, PresenceReport];
export declare function useStretchedLink(active: boolean): void;
export { StretchedLinkContext };
