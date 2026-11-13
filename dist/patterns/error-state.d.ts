import * as React from "react";
export type ErrorStatePreset = "not-found" | "forbidden" | "crash";
export type ErrorStateLayout = "auto" | "in-shell" | "full-page";
export type ErrorStateDetail = {
    label: string;
    value: string;
};
export type ErrorStateProps = {
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
    /** Runs on Go to organization home before the link navigates; call preventDefault to route in-app. */
    onHome?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    onBack?: () => void;
    onReload?: () => void;
    /** Called once per error when crash mounts, to send it to error reporting. */
    onReport?: (error: unknown) => void;
    /** The page's own flows, such as Request access. They sit after the preset's primary action and before its secondary one; keep them outline so the primary stays the one accent. */
    actions?: React.ReactNode;
};
export declare function ErrorState({ preset, layout, description, error, details, showStack, homeHref, onHome, onBack, onReload, onReport, actions }: ErrorStateProps): React.JSX.Element;
export declare namespace ErrorState {
    var displayName: string;
}
