export declare const formControlSelector = ":is(input:not([type=hidden]), textarea, select, [role=combobox], button[role=radio], button[role=checkbox], button[role=switch]):not(:disabled, [aria-disabled=true])";
/** Marks a control, such as a help button, that an opening overlay never picks as its first focus. */
export declare const skipAutoFocus: {
    readonly "data-skip-autofocus": "";
};
/**
 * An onOpenAutoFocus handler for overlays: focus lands on the first form control, else the first
 * tabbable element that is not marked with skipAutoFocus, so a help button beside the first label
 * never takes focus and opens its tooltip.
 */
export declare function focusFirstControl(event: Event): void;
