export const formControlSelector =
  ":is(input:not([type=hidden]), textarea, select, [role=combobox], button[role=radio], button[role=checkbox], button[role=switch]):not(:disabled, [aria-disabled=true])";

const tabbableSelector =
  ":is(a[href], button, input:not([type=hidden]), textarea, select, [tabindex], [contenteditable=true]):not(:disabled, [tabindex='-1'])";

/** Marks a control, such as a help button, that an opening overlay never picks as its first focus. */
export const skipAutoFocus = { "data-skip-autofocus": "" } as const;

const candidate = (element: HTMLElement) =>
  element.tabIndex >= 0 &&
  !element.closest("[data-skip-autofocus]") &&
  element.getClientRects().length > 0;

/**
 * An onOpenAutoFocus handler for overlays: focus lands on the first form control, else the first
 * tabbable element that is not marked with skipAutoFocus, so a help button beside the first label
 * never takes focus and opens its tooltip.
 */
export function focusFirstControl(event: Event) {
  if (event.defaultPrevented || !(event.target instanceof HTMLElement)) return;
  const container = event.target;
  const find = (selector: string) =>
    Array.from(container.querySelectorAll<HTMLElement>(selector)).find(candidate);
  const target = find(formControlSelector) ?? find(tabbableSelector);
  if (!target) return;
  event.preventDefault();
  target.focus({ preventScroll: true });
}
