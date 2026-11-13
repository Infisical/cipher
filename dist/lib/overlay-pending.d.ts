import * as React from "react";
export declare const OverlayPendingContext: React.Context<boolean>;
export declare const useOverlayPending: () => boolean;
export declare function useDismissGuard<Outside extends Event & {
    target: EventTarget | null;
}, Interact extends Event & {
    target: EventTarget | null;
}>(pending: boolean, handlers: {
    onEscapeKeyDown: (event: KeyboardEvent) => void;
    onPointerDownOutside?: (event: Outside) => void;
    onInteractOutside?: (event: Interact) => void;
}): {
    onEscapeKeyDown: (event: KeyboardEvent) => void;
    onPointerDownOutside: (event: Outside) => void;
    onInteractOutside: (event: Interact) => void;
};
