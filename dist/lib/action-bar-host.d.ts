import * as React from "react";
/** The scroller a FloatingActionBar under a modal overlay portals into, or undefined outside one. Null while the scroller mounts. */
export declare const useActionBarHost: () => HTMLElement | null | undefined;
/** Provides an overlay scroller as the action bar host, so the bar stays inside the overlay's focus trap and dismiss layer instead of portalling under its scrim. */
export declare function ActionBarHost({ host, children }: {
    host: HTMLElement | null;
    children?: React.ReactNode;
}): React.JSX.Element;
/** An overlay scroller that hosts a FloatingActionBar rendered inside it. */
export declare function ActionBarScroller({ children, ref, ...props }: React.ComponentProps<"div">): React.JSX.Element;
