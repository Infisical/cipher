import * as React from "react";
import { flushSync } from "react-dom";
import { jsx } from "react/jsx-runtime";
// src/lib/header-actions.tsx
/**
* Whether the header actions around a Button are collapsed; undefined outside a header actions
* slot. A collapsed Button with a leading icon renders icon-only and shows its label as a tooltip.
*/
var ActionLabelCollapseContext = React.createContext(void 0);
var overflows = (slot) => {
	const row = slot.parentElement;
	if (!row) return false;
	if (row.scrollWidth > row.clientWidth + 1) return true;
	const list = row.querySelector("[role=\"tablist\"]");
	if (list && list.scrollWidth > list.clientWidth + 1) return true;
	const title = list ? null : row.querySelector("[data-slot$=\"-title\"]");
	if (title && title.offsetHeight > parseFloat(getComputedStyle(title).lineHeight) * 1.5) return true;
	return [...slot.querySelectorAll("[data-slot=\"button-text\"]")].some((label) => label.scrollWidth > label.clientWidth + 1);
};
/**
* Collapses icon actions when the row cannot hold the tabs or the title on one line beside the
* full-label actions. It re-measures when the row resizes, fonts load, or an action's content
* changes; the mutations a measurement makes itself are discarded so it cannot loop. Every measurement lays the actions out expanded first, inside flushSync, so
* the expanded and collapsed passes land in the same frame and no truncated frame is painted.
*/
function HeaderActions({ className, slot, children }) {
	const ref = React.useRef(null);
	const [collapsed, setCollapsed] = React.useState(false);
	const measuring = React.useRef(false);
	const mutations = React.useRef(null);
	const measure = React.useCallback(() => {
		const node = ref.current;
		if (!node || measuring.current) return;
		measuring.current = true;
		try {
			flushSync(() => setCollapsed(false));
			if (overflows(node)) flushSync(() => setCollapsed(true));
		} finally {
			mutations.current?.takeRecords();
			measuring.current = false;
		}
	}, []);
	React.useLayoutEffect(() => {
		if (!measuring.current) queueMicrotask(measure);
	});
	React.useLayoutEffect(() => {
		const node = ref.current;
		const row = node?.parentElement;
		if (!node || !row) return void 0;
		const observer = new ResizeObserver(measure);
		observer.observe(row);
		const mutation = new MutationObserver(measure);
		mutation.observe(node, {
			childList: true,
			subtree: true,
			characterData: true
		});
		mutations.current = mutation;
		document.fonts?.addEventListener("loadingdone", measure);
		return () => {
			observer.disconnect();
			mutation.disconnect();
			mutations.current = null;
			document.fonts?.removeEventListener("loadingdone", measure);
		};
	}, [measure]);
	return /* @__PURE__ */ jsx("div", {
		ref,
		"data-slot": slot,
		"data-collapsed": collapsed || void 0,
		className,
		children: /* @__PURE__ */ jsx(ActionLabelCollapseContext, {
			value: collapsed,
			children
		})
	});
}
export { ActionLabelCollapseContext, HeaderActions };

//# sourceMappingURL=header-actions.js.map