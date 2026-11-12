import * as React from "react";
import { type PresenceReport } from "./presence-count";
declare const StretchedLinkContext: React.Context<PresenceReport | null>;
/**
 * A table row or Card whose stretched RowLink or CardLink covers it. Hosts nest: an outer row or Card
 * also counts a link inside an inner one.
 */
export declare function useStretchedLinkHost(): readonly [boolean, PresenceReport];
export declare function useStretchedLink(active: boolean): void;
export { StretchedLinkContext };
