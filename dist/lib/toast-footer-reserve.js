import { useToastLayer } from "../scope.js";
import * as React from "react";
// src/lib/toast-footer-reserve.ts
var reserves = /* @__PURE__ */ new WeakMap();
var publish = (layer) => {
	const lift = Math.max(0, ...reserves.get(layer)?.values() ?? []);
	if (lift) layer.style.setProperty("--cipher-toast-footer", `${lift}px`);
	else layer.style.removeProperty("--cipher-toast-footer");
};
/** An open overlay's footer lifts the toasts above itself whenever they would reach it, so a toast never covers its buttons. Returns the footer's ref. */
function useToastFooterReserve(ref) {
	const layer = useToastLayer();
	const [node, setNode] = React.useState(null);
	React.useLayoutEffect(() => {
		if (!layer || !node) return void 0;
		const key = {};
		const entries = reserves.get(layer) ?? /* @__PURE__ */ new Map();
		reserves.set(layer, entries);
		const observer = new ResizeObserver(() => measure());
		const measure = () => {
			const toasts = [...layer.querySelectorAll("[data-sonner-toast]")];
			const style = getComputedStyle(layer);
			const size = (token) => parseFloat(style.getPropertyValue(token)) || 0;
			const offset = size("--cipher-space-action-bar-offset");
			const base = layer.hasAttribute("data-action-bar-reserve") ? size("--cipher-size-action-bar") + 2 * offset : offset;
			const gap = size("--cipher-space-8");
			const stack = toasts.reduce((sum, toast) => sum + toast.offsetHeight + gap, base);
			const { top, bottom, left, right } = node.getBoundingClientRect();
			toasts.forEach((toast) => observer.observe(toast));
			const beside = toasts.every((toast) => {
				const rect = toast.getBoundingClientRect();
				return rect.right <= left || rect.left >= right;
			});
			const covered = toasts.length > 0 && !beside && node.getClientRects().length > 0 && !node.closest("[inert]") && window.innerHeight - bottom < stack;
			entries.set(key, covered ? Math.max(0, window.innerHeight - top) : 0);
			publish(layer);
		};
		const panel = node.closest("[role=\"dialog\"], [role=\"alertdialog\"]") ?? node;
		observer.observe(node);
		observer.observe(panel);
		const changes = new MutationObserver(measure);
		changes.observe(layer, {
			childList: true,
			subtree: true,
			attributeFilter: ["data-action-bar-reserve"]
		});
		changes.observe(panel, {
			subtree: true,
			attributeFilter: ["inert"]
		});
		panel.addEventListener("animationend", measure);
		panel.addEventListener("transitionend", measure);
		panel.addEventListener("scroll", measure, {
			capture: true,
			passive: true
		});
		window.addEventListener("resize", measure);
		measure();
		return () => {
			observer.disconnect();
			changes.disconnect();
			panel.removeEventListener("animationend", measure);
			panel.removeEventListener("transitionend", measure);
			panel.removeEventListener("scroll", measure, { capture: true });
			window.removeEventListener("resize", measure);
			entries.delete(key);
			publish(layer);
		};
	}, [layer, node]);
	return React.useCallback((value) => {
		setNode(value);
		const cleanup = typeof ref === "function" ? ref(value) : void 0;
		if (ref && typeof ref !== "function") ref.current = value;
		return () => {
			setNode(null);
			if (typeof cleanup === "function") cleanup();
			else if (typeof ref === "function") ref(null);
			else if (ref) ref.current = null;
		};
	}, [ref]);
}
export { useToastFooterReserve };

//# sourceMappingURL=toast-footer-reserve.js.map