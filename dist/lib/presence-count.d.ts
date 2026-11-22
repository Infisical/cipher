export type PresenceReport = (delta: number) => void;
/**
 * Counts descendants that report themselves through context, so a container styles itself from
 * React state instead of a :has() selector, which would make every DOM change below it relayout the document.
 */
export declare function usePresenceCount(): readonly [boolean, PresenceReport];
/** Reports to the nearest counter while active holds. */
export declare function useReportPresence(report: PresenceReport | null | undefined, active: boolean): void;
