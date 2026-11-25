import * as React from "react";
import { type CipherLinkTarget } from "../lib/link";
export type ErrorStatePreset = "not-found" | "forbidden" | "crash";
export type ErrorStateLayout = "auto" | "in-shell" | "full-page";
export type ErrorStateDetail = {
    label: string;
    value: string;
};
type ErrorStatePrimaryTarget = {
    /** Makes the primary action a link to this target, through the app's router. */
    actionLink?: CipherLinkTarget;
    onAction?: never;
} | {
    actionLink?: never;
    /** Makes the primary action a button that runs this. */
    onAction?: () => void;
};
export type ErrorStateProps = ErrorStatePrimaryTarget & {
    preset: ErrorStatePreset;
    /** auto renders in the content area when an AppShell is above it, and full-page (fixed over its containing block, the viewport in the app) when there is none, such as when the shell itself failed. */
    layout?: ErrorStateLayout;
    description?: string;
    /** The caught error. crash shows its name and message under Error details. */
    error?: unknown;
    /** Extra lines for Error details and the copied report, such as the request id, status, route and time. */
    details?: readonly ErrorStateDetail[];
    /** Adds the stack to Error details. Defaults to development builds only. */
    showStack?: boolean;
    homeHref?: string;
    /** Runs on the home link before it navigates; call preventDefault to route in-app. */
    onHome?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    /** The home link's label: crash's secondary action, and the primary action of the other presets. Defaults to Go to organization home. */
    homeLabel?: string;
    /** Makes the home link a link to this target, through the app's router, instead of homeHref. */
    homeLink?: CipherLinkTarget;
    onBack?: () => void;
    onReload?: () => void;
    /** The primary action's label. Defaults to Reload on crash and the home label otherwise. */
    actionLabel?: string;
    /** Called once per error when crash mounts, to send it to error reporting. */
    onReport?: (error: unknown) => void;
    /** The page's own flows, such as Request access. They sit after the preset's primary action and before its secondary one; keep them outline so the primary stays the one accent. */
    actions?: React.ReactNode;
};
export declare function ErrorState({ preset, layout, description, error, details, showStack, homeHref, onHome, homeLabel, homeLink, onBack, onReload, onReport, actions, actionLabel, actionLink, onAction }: ErrorStateProps): React.JSX.Element;
export declare namespace ErrorState {
    var displayName: string;
}
export {};
