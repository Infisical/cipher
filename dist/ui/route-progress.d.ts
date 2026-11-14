import * as React from "react";
export type RouteProgressProps = {
    /** Whether a navigation is resolving; the app reads it from its router. */
    pending: boolean;
    className?: string;
};
/** A thin bar along the top of the viewport while the router resolves a navigation. */
export declare function RouteProgress({ pending, className }: RouteProgressProps): React.JSX.Element;
export declare namespace RouteProgress {
    var displayName: string;
}
