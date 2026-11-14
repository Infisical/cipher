import * as React from "react";
/** Data attribute name to the selector that turns it on. */
export type DescendantFlags = Readonly<Record<string, string>>;
type Watch = {
    /** Attributes whose changes below the element can flip a flag. */
    attributes?: readonly string[];
    /** false watches only the element's own children. */
    subtree?: boolean;
    /** Re-checks on focus moving in or out, for :focus-visible selectors. */
    focus?: boolean;
    /** Flags set on each element below that matches the selector, instead of on the element itself. */
    marks?: DescendantFlags;
};
export declare const assignRef: <T>(ref: React.Ref<T> | undefined, value: T | null) => void;
/**
 * Mirrors state the component does not own, such as a slotted control's focus, invalid or disabled
 * state or which slots a caller composed, onto data attributes, re-checked only on this element's own
 * focus changes and mutations. A :has() selector instead re-checks on every DOM change in the
 * document, so one cell update in a large table relayouts the page. Returns the ref to attach;
 * flags and watch must be module constants.
 */
export declare function useDescendantFlags<T extends Element>(flags: DescendantFlags, watch?: Watch, forwardedRef?: React.Ref<T>): (element: T | null) => void;
export {};
