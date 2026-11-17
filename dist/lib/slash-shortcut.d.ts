import * as React from "react";
/**
 * Registers an element that "/" acts on. One document listener serves every registration, so
 * searches never compete: a card-scoped one wins while focus is inside its card (the innermost card when cards nest), otherwise the first
 * visible page-scoped one in document order. "/" is ignored while typing in a field, editor or grid, and
 * while a dialog or popover is open that doesn't contain the element.
 */
export declare function useSlashShortcut(element: React.RefObject<HTMLElement | null>, { enabled, scope, onTrigger }: {
    enabled?: boolean;
    scope?: "page" | "card";
    onTrigger: () => void;
}): void;
