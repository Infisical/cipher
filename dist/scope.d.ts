import * as React from "react";
import { type PresenceReport } from "./lib/presence-count";
import type { V4Scheme } from "./lib/themes";
export declare const useV4PortalContainer: () => HTMLElement | null | undefined;
export declare const useV4CollisionBoundary: () => HTMLElement | undefined;
export declare const useV4Theme: () => string | undefined;
export declare const useV4Scheme: () => V4Scheme | undefined;
export declare const useV4ToastLayer: () => HTMLElement | null;
/** A shown FloatingActionBar reports here, so every node of the scope, toast layer included, lifts its toasts clear of the bar. */
export declare const useV4ActionBarReserve: () => PresenceReport | null;
export declare function V4Scope({ children, className, theme, portalContainer, ref: forwardedRef, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    theme?: string;
    portalContainer?: HTMLElement | null;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace V4Scope {
    var displayName: string;
}
