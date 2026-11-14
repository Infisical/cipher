// src/lib/initial-focus.ts
var formControlSelector = ":is(input:not([type=hidden]), textarea, select, [role=combobox], button[role=radio], button[role=checkbox], button[role=switch]):not(:disabled, [aria-disabled=true])";
var tabbableSelector = ":is(a[href], button, input:not([type=hidden]), textarea, select, [tabindex], [contenteditable=true]):not(:disabled, [tabindex='-1'])";
/** Marks a control, such as a help button, that an opening overlay never picks as its first focus. */
var skipAutoFocus = { "data-skip-autofocus": "" };
var candidate = (element) => element.tabIndex >= 0 && !element.closest("[data-skip-autofocus]") && element.getClientRects().length > 0;
/**
* An onOpenAutoFocus handler for overlays: focus lands on the first form control, else the first
* tabbable element that is not marked with skipAutoFocus, so a help button beside the first label
* never takes focus and opens its tooltip.
*/
function focusFirstControl(event) {
	if (event.defaultPrevented || !(event.target instanceof HTMLElement)) return;
	const container = event.target;
	const find = (selector) => Array.from(container.querySelectorAll(selector)).find(candidate);
	const target = find(":is(input:not([type=hidden]), textarea, select, [role=combobox], button[role=radio], button[role=checkbox], button[role=switch]):not(:disabled, [aria-disabled=true])") ?? find(tabbableSelector);
	if (!target) return;
	event.preventDefault();
	target.focus({ preventScroll: true });
}
export { focusFirstControl, formControlSelector, skipAutoFocus };

//# sourceMappingURL=initial-focus.js.map