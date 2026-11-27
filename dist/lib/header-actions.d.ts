import * as React from "react";
/**
 * Whether the header actions around a Button are collapsed; undefined outside a header actions
 * slot. A collapsed Button with a leading icon renders icon-only and shows its label as a tooltip.
 */
export declare const ActionLabelCollapseContext: React.Context<boolean | undefined>;
/**
 * Collapses icon actions when the row cannot hold the tabs or the title on one line beside the
 * full-label actions. It re-measures when the row resizes, fonts load, or an action's content
 * changes; the mutations a measurement makes itself are discarded so it cannot loop. Every measurement lays the actions out expanded first, inside flushSync, so
 * the expanded and collapsed passes land in the same frame and no truncated frame is painted.
 */
export declare function HeaderActions({ className, slot, children }: {
    className?: string;
    slot: string;
    children: React.ReactNode;
}): React.JSX.Element;
