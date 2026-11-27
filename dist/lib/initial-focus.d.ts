export declare const formControlSelector = ":is(input:not([type=hidden]), textarea, select, [role=combobox], button[role=radio], button[role=checkbox], button[role=switch]):not(:disabled, [aria-disabled=true])";
/** Marks a control, such as a help button, that an opening overlay never picks as its first focus. */
export declare const skipAutoFocus: {
    readonly "data-skip-autofocus": "";
};
/**
 * An onOpenAutoFocus handler for overlays: focus lands on the first form control, else the first
 * tabbable element that is not marked with skipAutoFocus, so a help button beside the first label
 * never takes focus and opens its tooltip. With nothing to focus, the overlay itself takes focus. With prefer, the first control inside that element wins,
 * such as a two-pane sheet's main pane over its aside.
 */
export declare function focusFirstControl(event: Event, prefer?: string): void;
