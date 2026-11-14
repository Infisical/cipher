import * as React from "react";
export declare function useOwnedEscape<ElementType extends HTMLElement>(ref: React.Ref<ElementType> | undefined, onEscapeKeyDown?: (event: KeyboardEvent) => void): {
    ref: (node: ElementType | null) => void;
    onEscapeKeyDown: (event: KeyboardEvent) => void;
};
