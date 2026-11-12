import * as React from "react";
export type IndicatorRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};
export type MeasuredIndicatorOptions = {
    /** The positioned container the indicator sits in. */
    listRef: React.RefObject<HTMLElement | null>;
    /** Matches the one item that is currently selected. */
    activeSelector: string;
    /** Matches every item whose size can move the indicator. */
    itemSelector: string;
    /** Overrides the active item's own box, for an indicator that spans more than the item. */
    rect?: (active: HTMLElement, list: HTMLElement) => IndicatorRect;
    /** Runs after each measure, once the active item is known. */
    onMeasure?: (list: HTMLElement, active: HTMLElement | null, context: MeasureContext) => void;
    /** Re-runs the observers when the item set changes. */
    watch?: unknown;
    /** Skips all measuring and observing while false. */
    enabled?: boolean;
};
export type MeasureContext = {
    reveal: boolean;
    instant: boolean;
};
export type IndicatorState = IndicatorRect & {
    visible: boolean;
    instant: boolean;
};
/**
 * Measures the selected item and returns the box an indicator should slide to.
 * It snaps on the first measure, on resize and when fonts load, so nothing animates on mount.
 */
export declare function useMeasuredIndicator({ listRef, activeSelector, itemSelector, rect, onMeasure, watch, enabled }: MeasuredIndicatorOptions): {
    state: IndicatorState;
    measure: (reveal?: boolean) => void;
};
