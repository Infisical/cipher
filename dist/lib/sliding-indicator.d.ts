import type { IndicatorState } from "./use-measured-indicator";
/**
 * The raised chip behind the selected item. It moves on transforms and size with the moderate
 * spring, snaps on the first measure and under reduced motion, and cross-fades instead of travelling.
 */
export declare function SlidingIndicator({ state, className }: {
    state: IndicatorState;
    className?: string;
}): import("react").JSX.Element;
