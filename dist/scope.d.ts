import * as React from "react";
import { type HueLevel } from "./lib/hue";
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
/** Carries a hue scope to overlays: sheets, dialogs, menus and popovers opened under it render outside the scoped element, so they portal into a container in the same hue and their accent matches the page. Put it around the element that spreads hueScope with the same hue. */
export declare function HuePortal({ hue, level, lightness, children }: {
    hue: number;
    level?: HueLevel;
    lightness?: number;
    children?: React.ReactNode;
}): React.JSX.Element;
