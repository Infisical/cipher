import * as React from "react";
/** True when an overlay kept this Escape open for an escape owner inside it, so the owner still acts on the prevented event. */
export declare const isOwnedEscape: (event: Event) => boolean;
export declare function useOwnedEscape<ElementType extends HTMLElement>(ref: React.Ref<ElementType> | undefined, onEscapeKeyDown?: (event: KeyboardEvent) => void): {
    ref: (node: ElementType | null) => void;
    onEscapeKeyDown: (event: KeyboardEvent) => void;
};
