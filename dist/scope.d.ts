import * as React from "react";
import { type PresenceReport } from "./lib/presence-count";
import type { Scheme } from "./lib/themes";
export declare const usePortalContainer: () => HTMLElement | null | undefined;
export declare const useCollisionBoundary: () => HTMLElement | undefined;
export declare const useTheme: () => string | undefined;
export declare const useScheme: () => Scheme | undefined;
export declare const useToastLayer: () => HTMLElement | null;
/** A shown FloatingActionBar reports here, so every node of the scope, toast layer included, lifts its toasts clear of the bar. */
export declare const useActionBarReport: () => PresenceReport | null;
export declare function CipherScope({ children, className, theme, portalContainer, ref: forwardedRef, ...props }: React.ComponentPropsWithoutRef<"div"> & {
    theme?: string;
    portalContainer?: HTMLElement | null;
} & {
    ref?: React.Ref<HTMLDivElement>;
}): React.JSX.Element;
export declare namespace CipherScope {
    var displayName: string;
}
