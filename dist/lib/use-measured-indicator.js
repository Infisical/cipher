import * as React from "react";
// src/lib/use-measured-indicator.ts
var hidden = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	visible: false,
	instant: true
};
/**
* Measures the selected item and returns the box an indicator should slide to.
* It snaps on the first measure, on resize and when fonts load, so nothing animates on mount.
*/
function useMeasuredIndicator({ listRef, activeSelector, itemSelector, rect, onMeasure, watch, enabled = true }) {
	const [state, setState] = React.useState(hidden);
	const instant = React.useRef(true);
	const placed = React.useRef(false);
	const latest = React.useRef({
		rect,
		onMeasure
	});
	React.useLayoutEffect(() => {
		latest.current = {
			rect,
			onMeasure
		};
	});
	const measure = React.useCallback((reveal = false) => {
		const list = listRef.current;
		if (!list) return;
		const active = list.querySelector(activeSelector);
		latest.current.onMeasure?.(list, active, {
			reveal,
			instant: instant.current
		});
		if (!active) {
			setState((current) => current.visible ? {
				...current,
				visible: false,
				instant: false
			} : current);
			return;
		}
		const box = latest.current.rect?.(active, list) ?? {
			x: active.offsetLeft,
			y: active.offsetTop,
			width: active.offsetWidth,
			height: active.offsetHeight
		};
		setState({
			...box,
			visible: true,
			instant: instant.current
		});
	}, [listRef, activeSelector]);
	React.useLayoutEffect(() => {
		const list = listRef.current;
		if (!enabled || !list) return void 0;
		const snap = () => {
			instant.current = true;
			measure(true);
			instant.current = false;
		};
		if (placed.current) measure(true);
		else snap();
		placed.current = true;
		const observer = new MutationObserver(() => measure(true));
		observer.observe(list, {
			attributes: true,
			subtree: true,
			attributeFilter: ["data-state"]
		});
		const resize = new ResizeObserver(snap);
		resize.observe(list);
		list.querySelectorAll(itemSelector).forEach((item) => resize.observe(item));
		document.fonts?.addEventListener("loadingdone", snap);
		return () => {
			observer.disconnect();
			resize.disconnect();
			document.fonts?.removeEventListener("loadingdone", snap);
		};
	}, [
		listRef,
		itemSelector,
		measure,
		watch,
		enabled
	]);
	return {
		state,
		measure
	};
}
export { useMeasuredIndicator };

//# sourceMappingURL=use-measured-indicator.js.map